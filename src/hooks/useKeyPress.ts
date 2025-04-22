import { useEffect } from "react";

export function useKeyPress(callback: (e: KeyboardEvent) => void) {
    useEffect(() => {
        const handler = (e: KeyboardEvent) => callback(e);
        window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
    }, [callback]);
}
