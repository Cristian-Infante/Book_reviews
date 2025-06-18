"use client";

import React, {useState, useEffect} from "react";
import Link from "next/link";
import {usePathname, useRouter} from "next/navigation";
import {
    FaBookOpen,
    FaBook,
    FaStar,
    FaUserCircle,
    FaSignOutAlt,
    FaSignInAlt,
    FaUserPlus,
    FaBars,
    FaTimes,
    FaTag,
    FaPlus,
} from "react-icons/fa";

const isTokenValid = (): boolean => {
    const token = localStorage.getItem("accessToken");
    const exp = localStorage.getItem("expiresAt");
    if (!token || !exp) return false;
    return Date.now() < new Date(exp).getTime();
};

export default function Navbar() {
    const pathname = usePathname();
    const router = useRouter();
    const [menuOpen, setMenuOpen] = useState(false);
    const [isAuth, setIsAuth] = useState(false);

    useEffect(() => {
        setIsAuth(isTokenValid());
    }, []);
    useEffect(() => {
        setIsAuth(isTokenValid());
    }, [pathname]);

    const handleLogout = () => {
        localStorage.clear();
        setIsAuth(false);
        setMenuOpen(false);
        router.push("/login");
    };

    const desktopLinkClasses = (href: string) =>
        `flex items-center gap-2 py-2 ${
            pathname === href
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-600 hover:text-blue-700"
        }`;

    const mobileLinkClasses = (href: string) =>
        `flex items-center gap-2 px-4 py-3 rounded-md transition-colors ${
            pathname === href
                ? "bg-blue-50 text-blue-600"
                : "text-gray-700 hover:bg-gray-100"
        }`;

    return (
        <nav className="bg-white border-b shadow-sm fixed inset-x-0 z-50">
            <div className="mx-auto max-w-screen-2xl px-4">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link
                        href="/"
                        className="flex items-center gap-2 text-gray-600 hover:text-gray-700"
                    >
                        <FaBook size={32}/>
                        <span className="font-semibold text-xl">Book Reviews</span>
                    </Link>

                    {/* Desktop */}
                    <div className="hidden md:flex items-center space-x-6">
                        <Link href="/books" className={desktopLinkClasses("/books")}>
                            <FaBookOpen/> Libros
                        </Link>
                        {isAuth ? (
                            <>
                                <Link href="/categories" className={desktopLinkClasses("/categories")}>
                                    <FaTag/> Categorías
                                </Link>
                                <Link href="/books/new" className={desktopLinkClasses("/books/new")}>
                                    <FaPlus/> Añadir libro
                                </Link>
                                <Link href="/my-reviews" className={desktopLinkClasses("/my-reviews")}>
                                    <FaStar/> Mis reseñas
                                </Link>
                                <Link href="/profile" className={desktopLinkClasses("/profile")}>
                                    <FaUserCircle/> Perfil
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center gap-2 text-red-600 hover:text-red-800"
                                >
                                    <FaSignOutAlt/> Cerrar sesión
                                </button>
                            </>
                        ) : (
                            <>
                                <Link href="/login" className={desktopLinkClasses("/login")}>
                                    <FaSignInAlt/> Iniciar sesión
                                </Link>
                                <Link href="/register" className={desktopLinkClasses("/register")}>
                                    <FaUserPlus/> Registrarse
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile button */}
                    <button
                        onClick={() => setMenuOpen(!menuOpen)}
                        className="md:hidden p-2 text-gray-600 hover:text-gray-900 focus:ring-2 focus:ring-gray-300"
                    >
                        {menuOpen ? <FaTimes size={20}/> : <FaBars size={20}/>}
                    </button>
                </div>

                {/* Mobile menu */}
                {menuOpen && (
                    <div className="md:hidden bg-white border-t border-gray-200 shadow-lg">
                        <ul className="flex flex-col divide-y divide-gray-100">
                            <li>
                                <Link
                                    href="/books"
                                    onClick={() => setMenuOpen(false)}
                                    className={mobileLinkClasses("/books")}
                                >
                                    <FaBookOpen/> Libros
                                </Link>
                            </li>

                            {isAuth ? (
                                <>
                                    <li>
                                        <Link
                                            href="/categories"
                                            onClick={() => setMenuOpen(false)}
                                            className={mobileLinkClasses("/categories")}
                                        >
                                            <FaTag/> Categorías
                                        </Link>
                                    </li>
                                    <li>
                                        <Link
                                            href="/books/new"
                                            onClick={() => setMenuOpen(false)}
                                            className={mobileLinkClasses("/books/new")}
                                        >
                                            <FaPlus/> Añadir libro
                                        </Link>
                                    </li>
                                    <li>
                                        <Link
                                            href="/my-reviews"
                                            onClick={() => setMenuOpen(false)}
                                            className={mobileLinkClasses("/my-reviews")}
                                        >
                                            <FaStar/> Mis reseñas
                                        </Link>
                                    </li>
                                    <li>
                                        <Link
                                            href="/profile"
                                            onClick={() => setMenuOpen(false)}
                                            className={mobileLinkClasses("/profile")}
                                        >
                                            <FaUserCircle/> Perfil
                                        </Link>
                                    </li>
                                    <li>
                                        <button
                                            onClick={handleLogout}
                                            className="w-full text-left flex items-center gap-2 px-4 py-3 text-red-600 hover:bg-red-50 rounded-md"
                                        >
                                            <FaSignOutAlt/> Cerrar sesión
                                        </button>
                                    </li>
                                </>
                            ) : (
                                <>
                                    <li>
                                        <Link
                                            href="/login"
                                            onClick={() => setMenuOpen(false)}
                                            className={mobileLinkClasses("/login")}
                                        >
                                            <FaSignInAlt/> Iniciar sesión
                                        </Link>
                                    </li>
                                    <li>
                                        <Link
                                            href="/register"
                                            onClick={() => setMenuOpen(false)}
                                            className={mobileLinkClasses("/register")}
                                        >
                                            <FaUserPlus/> Registrarse
                                        </Link>
                                    </li>
                                </>
                            )}
                        </ul>
                    </div>
                )}
            </div>
        </nav>
    );
}
