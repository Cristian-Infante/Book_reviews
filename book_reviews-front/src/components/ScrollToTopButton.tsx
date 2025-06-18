"use client";

import React, {useState, useEffect} from "react";
import {FaArrowUp} from "react-icons/fa";

export default function ScrollToTopButton() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const toggleVisibility = () => {
            if (window.scrollY > 300) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener("scroll", toggleVisibility);

        return () => {
            window.removeEventListener("scroll", toggleVisibility);
        };
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    return (
        <button
            onClick={scrollToTop}
            className={`fixed bottom-4 right-4 p-3 bg-gray-800 text-white rounded-full shadow-lg transition-opacity duration-300 ${
                isVisible ? "opacity-100" : "opacity-0"
            }`}
            aria-label="Volver arriba"
        >
            <FaArrowUp size={20}/>
        </button>
    );
}