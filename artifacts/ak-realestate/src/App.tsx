import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import Admin from "@/pages/Admin";
import AdminLogin from "@/pages/AdminLogin";
import PropertyDetail from "@/pages/PropertyDetail";
import Properties from "@/pages/Properties";
import Insights from "@/pages/Insights";
import InsightDetail from "@/pages/InsightDetail";
import Tools from "@/pages/Tools";
import { useEffect, useLayoutEffect } from "react";
import Lenis from "lenis";
import { useLocation } from "wouter";
import { RequestPropertyProvider } from "@/contexts/RequestPropertyContext";
import { RequestPropertyModal } from "@/components/RequestPropertyModal";
import { ParticleCanvas } from "@/components/ParticleCanvas";
import { AnimatePresence, motion } from "framer-motion";

const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 1000 * 60 * 2 } },
});

function LenisScroll() {
  const [location] = useLocation();
  const isAdmin = location.startsWith("/admin");

  useEffect(() => {
    if (isAdmin) return;
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 2,
    });
    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    const id = requestAnimationFrame(raf);
    return () => {
      cancelAnimationFrame(id);
      lenis.destroy();
    };
  }, [isAdmin]);

  return null;
}

function ScrollToTop() {
  const [location] = useLocation();
  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);
  return null;
}

function Router() {
  const [location] = useLocation();
  return (
    <>
      <LenisScroll />
      <ScrollToTop />
      <AnimatePresence mode="wait">
        <motion.div key={location} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4, ease: [0.22,1,0.36,1] }}>
          <Switch location={location}>
            <Route path="/" component={Home} />
            <Route path="/properties" component={Properties} />
            <Route path="/property/:slug" component={PropertyDetail} />
            <Route path="/insights" component={Insights} />
            <Route path="/insights/:slug" component={InsightDetail} />
            <Route path="/tools" component={Tools} />
            <Route path="/admin/login" component={AdminLogin} />
            <Route path="/admin" component={Admin} />
            <Route component={NotFound} />
          </Switch>
        </motion.div>
      </AnimatePresence>
    </>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <RequestPropertyProvider>
          <ParticleCanvas />
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
            <Router />
            <RequestPropertyModal />
          </WouterRouter>
        </RequestPropertyProvider>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}
