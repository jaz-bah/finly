import { useState, useEffect } from "react";


const SCROLED_UP = 100;


export default function useScroll() {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > SCROLED_UP);
        }

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return scrolled;
}

