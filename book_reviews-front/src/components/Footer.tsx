// src/components/Footer.tsx
"use client";

import React from "react";

export default function Footer() {
    const year = new Date().getFullYear();
    return (
        <footer className="bg-gray-100 text-gray-600 py-6">
            <div className="max-w-screen-2xl mx-auto px-4 text-center space-y-2">
                <p>© {year} Book Reviews. Cristian Infante</p>
            </div>
        </footer>
    );
}
