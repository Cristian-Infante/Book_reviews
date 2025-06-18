import type {Metadata} from "next";
import {Geist, Geist_Mono} from "next/font/google";
import "./globals.css";
import Navbar from "@/components/NavBar";
import React from "react";
import ScrollToTopButton from "@/components/ScrollToTopButton";
import Footer from "@/components/Footer";

const geistSans = Geist({
    subsets: ["latin"],
    variable: "--font-geist-sans",
});

const geistMono = Geist_Mono({
    subsets: ["latin"],
    variable: "--font-geist-mono",
});

export const metadata: Metadata = {
    title: "Book Reviews",
    description: "Plataforma para reseñar y descubrir libros",
};

export default function RootLayout({children,}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="es" className="scroll-smooth">
        <body
            suppressHydrationWarning
            className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen`}
        >
        <Navbar/>

        <main className="flex-1 pt-16 bg-gray-50">{children}</main>

        <Footer/>

        <ScrollToTopButton/>
        </body>
        </html>
    );
}
