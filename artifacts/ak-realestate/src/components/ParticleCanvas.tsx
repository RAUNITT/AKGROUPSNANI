import { useRef, useEffect } from "react";

interface Particle {
  x: number;
  y: number;
  z: number;
  baseY: number;
  floatPhase: number;
  floatSpeed: number;
  colorIdx: number;
  size: number;
}

interface Building {
  x: number;
  z: number;
  w: number;
  d: number;
  h: number;
}

const PARTICLE_COLORS = [
  "245, 158, 11",
  "251, 191, 36",
  "217, 119, 6",
  "251, 146, 60",
  "253, 230, 138",
];

const FL = 480;

function project(
  wx: number,
  wy: number,
  wz: number,
  camX: number,
  camY: number,
  camZ: number,
  cx: number,
  cy: number
) {
  const dz = wz - camZ;
  if (dz < 0.5) return null;
  const scale = FL / dz;
  return {
    x: cx + (wx - camX) * scale,
    y: cy + (wy - camY) * scale,
    scale,
    depth: dz,
  };
}

function randomBuilding(camZ: number): Building {
  return {
    x: (Math.random() - 0.5) * 180,
    z: camZ + 40 + Math.random() * 280,
    w: 4 + Math.random() * 14,
    d: 4 + Math.random() * 14,
    h: 10 + Math.random() * 55,
  };
}

function randomParticle(camZ: number): Particle {
  return {
    x: (Math.random() - 0.5) * 220,
    y: (Math.random() - 0.5) * 90,
    z: camZ + 8 + Math.random() * 310,
    baseY: (Math.random() - 0.5) * 90,
    floatPhase: Math.random() * Math.PI * 2,
    floatSpeed: 0.25 + Math.random() * 0.6,
    colorIdx: Math.floor(Math.random() * PARTICLE_COLORS.length),
    size: 0.4 + Math.random() * 1.8,
  };
}

export function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let camX = 0;
    let camY = -10;
    let camZ = 0;
    let targetCamX = 0;
    let targetCamY = -10;
    let startTime = performance.now();
    let lastTime = startTime;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const onMouse = (e: MouseEvent) => {
      targetCamX = (e.clientX / window.innerWidth - 0.5) * 7;
      targetCamY = -10 + (e.clientY / window.innerHeight - 0.5) * 4;
    };
    window.addEventListener("mousemove", onMouse);

    const PARTICLE_COUNT = 2200;
    const BUILDING_COUNT = 55;

    const particles: Particle[] = Array.from({ length: PARTICLE_COUNT }, () =>
      randomParticle(camZ)
    );
    const buildings: Building[] = Array.from({ length: BUILDING_COUNT }, () =>
      randomBuilding(camZ)
    );

    const drawGrid = (cx: number, cy: number) => {
      const floorY = 28;
      const zNear = camZ + 4;
      const zFar = camZ + 320;
      const xSpan = 140;
      const xStep = 18;
      const zStep = 22;

      ctx.lineWidth = 0.4;

      for (let gx = -xSpan; gx <= xSpan; gx += xStep) {
        const p1 = project(gx, floorY, zNear, camX, camY, camZ, cx, cy);
        const p2 = project(gx, floorY, zFar, camX, camY, camZ, cx, cy);
        if (!p1 || !p2) continue;
        const grd = ctx.createLinearGradient(p1.x, p1.y, p2.x, p2.y);
        grd.addColorStop(0, "rgba(180, 83, 9, 0.22)");
        grd.addColorStop(1, "rgba(180, 83, 9, 0.01)");
        ctx.strokeStyle = grd;
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.stroke();
      }

      for (let gz = zNear; gz <= zFar; gz += zStep) {
        const p1 = project(-xSpan, floorY, gz, camX, camY, camZ, cx, cy);
        const p2 = project(xSpan, floorY, gz, camX, camY, camZ, cx, cy);
        if (!p1 || !p2) continue;
        const ratio = (gz - zNear) / (zFar - zNear);
        const a = 0.14 * (1 - ratio * 0.85);
        ctx.strokeStyle = `rgba(180, 83, 9, ${a})`;
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.stroke();
      }
    };

    const drawBuilding = (b: Building, alpha: number, cx: number, cy: number) => {
      const floorY = 28;
      const topY = floorY - b.h;
      const hw = b.w / 2;
      const hd = b.d / 2;

      const pts = [
        project(b.x - hw, floorY, b.z - hd, camX, camY, camZ, cx, cy),
        project(b.x + hw, floorY, b.z - hd, camX, camY, camZ, cx, cy),
        project(b.x + hw, floorY, b.z + hd, camX, camY, camZ, cx, cy),
        project(b.x - hw, floorY, b.z + hd, camX, camY, camZ, cx, cy),
        project(b.x - hw, topY, b.z - hd, camX, camY, camZ, cx, cy),
        project(b.x + hw, topY, b.z - hd, camX, camY, camZ, cx, cy),
        project(b.x + hw, topY, b.z + hd, camX, camY, camZ, cx, cy),
        project(b.x - hw, topY, b.z + hd, camX, camY, camZ, cx, cy),
      ];

      if (pts.some((p) => p === null)) return;

      ctx.strokeStyle = `rgba(180, 83, 9, ${alpha * 0.55})`;
      ctx.lineWidth = 0.5;

      const edges = [
        [0, 1], [1, 2], [2, 3], [3, 0],
        [4, 5], [5, 6], [6, 7], [7, 4],
        [0, 4], [1, 5], [2, 6], [3, 7],
      ] as [number, number][];

      for (const [a, b_] of edges) {
        const pa = pts[a];
        const pb = pts[b_];
        if (!pa || !pb) continue;
        ctx.beginPath();
        ctx.moveTo(pa.x, pa.y);
        ctx.lineTo(pb.x, pb.y);
        ctx.stroke();
      }

      const top4 = pts.slice(4) as NonNullable<ReturnType<typeof project>>[];
      if (top4.every(Boolean)) {
        ctx.strokeStyle = `rgba(245, 158, 11, ${alpha * 0.18})`;
        ctx.lineWidth = 0.3;
        ctx.beginPath();
        ctx.moveTo(top4[0].x, top4[0].y);
        for (let i = 1; i < 4; i++) ctx.lineTo(top4[i].x, top4[i].y);
        ctx.closePath();
        ctx.stroke();
      }
    };

    const drawAmbientGlow = (elapsed: number, cx: number, cy: number) => {
      const pulse = Math.sin(elapsed * 0.4) * 0.05 + 0.13;
      const r1 = Math.min(canvas.width, canvas.height) * 0.18;
      const r2 = canvas.width * 0.65;
      const gx = cx;
      const gy = cy + canvas.height * 0.12;
      const grd = ctx.createRadialGradient(gx, gy, r1, gx, gy, r2);
      grd.addColorStop(0, `rgba(120, 53, 15, ${pulse})`);
      grd.addColorStop(0.5, `rgba(100, 40, 5, ${pulse * 0.4})`);
      grd.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = grd;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    };

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const now = performance.now();
      const dt = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;
      const elapsed = (now - startTime) / 1000;

      const cx = canvas.width / 2;
      const cy = canvas.height / 2;

      const scrollY = window.scrollY;
      const scrollSpeed = 1 + scrollY * 0.004;
      camZ += dt * scrollSpeed * 7;

      camX += (targetCamX - camX) * 0.035;
      camY += (targetCamY - camY) * 0.035;

      ctx.fillStyle = "rgba(8, 8, 8, 0.94)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      drawAmbientGlow(elapsed, cx, cy);
      drawGrid(cx, cy);

      for (const b of buildings) {
        if (b.z < camZ - 2) {
          Object.assign(b, randomBuilding(camZ + 260 + Math.random() * 60));
        }
        const dz = b.z - camZ;
        if (dz > 300) continue;
        const alpha = Math.min(0.9, Math.pow(Math.max(0, 1 - dz / 290), 0.3) * 0.85);
        if (alpha > 0.02) drawBuilding(b, alpha, cx, cy);
      }

      particles.sort((a, b) => b.z - a.z);

      for (const p of particles) {
        if (p.z < camZ - 2) {
          Object.assign(p, randomParticle(camZ + 270 + Math.random() * 50));
          continue;
        }

        p.y = p.baseY + Math.sin(elapsed * p.floatSpeed + p.floatPhase) * 3.5;

        const proj = project(p.x, p.y, p.z, camX, camY, camZ, cx, cy);
        if (!proj) continue;

        const { x: px, y: py, depth: dz, scale } = proj;

        if (px < -60 || px > canvas.width + 60 || py < -60 || py > canvas.height + 60) continue;
        if (dz > 300) continue;

        const alpha = Math.min(0.9, (1 - dz / 290) * 0.85 + 0.05);
        if (alpha < 0.02) continue;

        const coreR = Math.max(0.4, scale * p.size * 0.1);
        const glowR = coreR * 5;

        if (coreR > 0.4) {
          const col = PARTICLE_COLORS[p.colorIdx];
          const grd = ctx.createRadialGradient(px, py, 0, px, py, glowR);
          grd.addColorStop(0, `rgba(${col}, ${alpha * 0.55})`);
          grd.addColorStop(0.4, `rgba(${col}, ${alpha * 0.15})`);
          grd.addColorStop(1, "rgba(0,0,0,0)");
          ctx.beginPath();
          ctx.arc(px, py, glowR, 0, Math.PI * 2);
          ctx.fillStyle = grd;
          ctx.fill();
        }

        ctx.beginPath();
        ctx.arc(px, py, Math.max(0.4, coreR), 0, Math.PI * 2);
        ctx.fillStyle = `rgba(253, 230, 138, ${alpha * 0.9})`;
        ctx.fill();
      }
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouse);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full z-0 pointer-events-none"
    />
  );
}
