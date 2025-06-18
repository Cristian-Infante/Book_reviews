"use client";

import React, {useState} from "react";
import {API} from "@/lib/axios";
import {FaEye, FaEyeSlash, FaUserShield} from "react-icons/fa";
import {useRouter} from "next/navigation";

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const {data} = await API.post("/Auth/login", {
                email,
                password,
            });

            localStorage.setItem("accessToken", data.accessToken);
            localStorage.setItem("expiresAt", data.expiresAt);
            localStorage.setItem("refreshToken", data.refreshToken);
            localStorage.setItem("refreshTokenExpiresAt", data.refreshTokenExpiresAt);

            setErrorMessage(null);
            router.replace("/books");
        } catch {
            setErrorMessage("Credenciales incorrectas. Por favor intente de nuevo.");

            setTimeout(() => setErrorMessage(null), 3000);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br  p-6">
            <div className="text-center mb-8">
                <FaUserShield className="mx-auto text-gray-800" size={60}/>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 uppercase tracking-wide mt-3">
                    Book Reviews
                </h1>
            </div>

            <div
                className="w-full max-w-sm md:max-w-md bg-white rounded-xl shadow-lg p-6 md:p-8 hover:shadow-2xl transition-shadow">
                <h2 className="text-xl md:text-2xl font-semibold mb-6 text-center text-gray-800">
                    Iniciar sesión
                </h2>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label
                            htmlFor="email"
                            className="block text-gray-700 font-medium mb-2 text-sm md:text-base"
                        >
                            Correo electrónico:
                        </label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="usuario@ejemplo.com"
                            autoComplete="email"
                            required
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-600 shadow-sm text-sm md:text-base"
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="password"
                            className="block text-gray-700 font-medium mb-2 text-sm md:text-base"
                        >
                            Contraseña:
                        </label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Ingrese su contraseña"
                                autoComplete="current-password"
                                required
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg pr-12 focus:outline-none focus:ring-2 focus:ring-gray-600 shadow-sm text-sm md:text-base"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-600"
                            >
                                {showPassword ? <FaEyeSlash size={20}/> : <FaEye size={20}/>}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className={`w-full py-3 bg-gray-800 text-white font-semibold rounded-lg hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-600 shadow-lg flex justify-center items-center ${
                            isLoading ? "opacity-70 cursor-not-allowed" : ""
                        }`}
                    >
                        {isLoading ? (
                            <div
                                className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"/>
                        ) : (
                            "Ingresar"
                        )}
                    </button>

                    <div className="text-center mt-3 md:mt-4">
                        <a
                            href="/forgot-password"
                            className="text-gray-800 hover:text-gray-600 text-sm md:text-base"
                        >
                            ¿Olvidó su contraseña?
                        </a>
                    </div>

                    {errorMessage && (
                        <div className="bg-red-100 text-red-700 p-3 mt-4 rounded-lg text-center text-sm md:text-base">
                            {errorMessage}
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
}
