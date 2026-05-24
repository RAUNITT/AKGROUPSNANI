import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 1.0);
  }
`;

const fragmentShader = `
  precision highp float;
  uniform float uTime;
  uniform vec2 uResolution;
  uniform float uScrollProgress;
  varying vec2 vUv;

  vec3 mod289(vec3 x) { return x - floor(x * (1.0/289.0)) * 289.0; }
  vec2 mod289(vec2 x) { return x - floor(x * (1.0/289.0)) * 289.0; }
  vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }

  float snoise(vec2 v) {
    const vec4 C = vec4(0.211324865405187, 0.366025403784439,
             -0.577350269189626, 0.024390243902439);
    vec2 i  = floor(v + dot(v, C.yy));
    vec2 x0 = v -   i + dot(i, C.xx);
    vec2 i1;
    i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod289(i);
    vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0))
      + i.x + vec3(0.0, i1.x, 1.0));
    vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy),
      dot(x12.zw,x12.zw)), 0.0);
    m = m*m;
    m = m*m;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * (a0*a0+h*h);
    vec3 g;
    g.x = a0.x * x0.x + h.x * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
  }

  void main() {
    vec2 uv = vUv;
    float aspect = uResolution.x / uResolution.y;
    uv.x *= aspect;

    float t = uTime * 0.08;
    float scrollFactor = uScrollProgress * 0.3;

    float n1 = snoise(vec2(uv.x * 1.5 + t, uv.y * 1.5 - t * 0.7)) * 0.5 + 0.5;
    float n2 = snoise(vec2(uv.x * 3.0 - t * 0.5, uv.y * 3.0 + t * 0.3)) * 0.5 + 0.5;
    float n3 = snoise(vec2(uv.x * 0.8 + scrollFactor, uv.y * 0.8 - scrollFactor)) * 0.5 + 0.5;

    vec3 darkBase = vec3(0.039, 0.039, 0.039);
    vec3 warm1 = vec3(0.08, 0.05, 0.02);
    vec3 warm2 = vec3(0.12, 0.07, 0.03);
    vec3 highlight = vec3(0.18, 0.10, 0.04);

    vec3 color = darkBase;
    color = mix(color, warm1, n1 * 0.15);
    color = mix(color, warm2, n2 * 0.08);
    color = mix(color, highlight, n3 * 0.06 * (1.0 + scrollFactor));

    float vignette = 1.0 - smoothstep(0.4, 1.4, length(vUv - 0.5) * 2.0);
    color *= 0.85 + vignette * 0.15;

    float grain = (fract(sin(dot(uv, vec2(12.9898, 78.233))) * 43758.5453) - 0.5) * 0.015;
    color += grain;

    gl_FragColor = vec4(color, 1.0);
  }
`;

function isWebGLAvailable() {
  try {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
    return !!ctx;
  } catch (e) {
    return false;
  }
}

// CSS fallback for environments without WebGL (e.g. sandboxed preview)
function CSSFallback() {
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: 0,
        pointerEvents: "none",
        background: "#0a0a0a",
        backgroundImage: `
          radial-gradient(ellipse 80% 50% at 20% 40%, rgba(40, 22, 6, 0.25) 0%, transparent 50%),
          radial-gradient(ellipse 60% 40% at 80% 60%, rgba(35, 18, 4, 0.18) 0%, transparent 50%),
          radial-gradient(ellipse 70% 60% at 50% 20%, rgba(30, 16, 3, 0.12) 0%, transparent 50%)
        `,
      }}
    >
      <style>{`
        @keyframes bgShift {
          0%, 100% { opacity: 0.6; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.05); }
        }
        .webgl-fallback-layer {
          position: absolute;
          inset: 0;
          background: radial-gradient(ellipse 80% 50% at 20% 40%, rgba(255,140,0,0.06) 0%, transparent 55%);
          animation: bgShift 12s ease-in-out infinite;
          mix-blend-mode: screen;
        }
        .webgl-fallback-layer-2 {
          position: absolute;
          inset: 0;
          background: radial-gradient(ellipse 60% 40% at 80% 70%, rgba(255,120,0,0.04) 0%, transparent 50%);
          animation: bgShift 18s ease-in-out infinite reverse;
          mix-blend-mode: screen;
        }
      `}</style>
      <div className="webgl-fallback-layer" />
      <div className="webgl-fallback-layer-2" />
    </div>
  );
}

export function WebGLBackground() {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const frameRef = useRef<number>(0);
  const scrollProgressRef = useRef(0);
  const [webglFailed, setWebglFailed] = useState(!isWebGLAvailable());

  useEffect(() => {
    if (webglFailed) return;

    const container = containerRef.current;
    if (!container) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: false, alpha: false });
    } catch {
      setWebglFailed(true);
      return;
    }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    renderer.domElement.style.display = "block";
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    const uniforms = {
      uTime: { value: 0 },
      uResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
      uScrollProgress: { value: 0 },
    };

    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms,
      depthTest: false,
      depthWrite: false,
    });

    const geometry = new THREE.PlaneGeometry(2, 2);
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    const onScroll = () => {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      scrollProgressRef.current = maxScroll > 0 ? window.scrollY / maxScroll : 0;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    const startTime = performance.now();
    const animate = () => {
      uniforms.uTime.value = (performance.now() - startTime) * 0.001;
      uniforms.uScrollProgress.value += (scrollProgressRef.current - uniforms.uScrollProgress.value) * 0.05;
      renderer.render(scene, camera);
      frameRef.current = requestAnimationFrame(animate);
    };
    frameRef.current = requestAnimationFrame(animate);

    const onResize = () => {
      renderer.setSize(window.innerWidth, window.innerHeight);
      uniforms.uResolution.value.set(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(frameRef.current);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      renderer.dispose();
      geometry.dispose();
      material.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [webglFailed]);

  if (webglFailed) {
    return <CSSFallback />;
  }

  return (
    <div
      ref={containerRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: 0,
        pointerEvents: "none",
      }}
    />
  );
}
