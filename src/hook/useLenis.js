import { useEffect, useRef } from "react";
import Lenis from "lenis";

export default function useLenis() {
    const lenisRef = useRef(null);
    const rafRef = useRef(null);

    useEffect(() => {
        if (lenisRef.current) return;

        const lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            smooth: true,
            smoothWheel: true,
        });

        lenisRef.current = lenis;

        const raf = (time) => {
            lenis.raf(time);
            rafRef.current = requestAnimationFrame(raf);
        };

        rafRef.current = requestAnimationFrame(raf);

        return () => {
            cancelAnimationFrame(rafRef.current);
            lenis.destroy();
            lenisRef.current = null;
        };
    }, []);

    return lenisRef;
}
