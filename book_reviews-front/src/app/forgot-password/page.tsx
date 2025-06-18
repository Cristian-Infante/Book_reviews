// src/app/forgot-password/page.tsx
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { API } from "@/lib/axios";
import { FaEnvelope } from "react-icons/fa";

export default function ForgotPasswordPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);
        try {
            await API.post("/Auth/forgot-password", { email });
            // redirijo a la pantalla de reset-password
            router.push(`/reset-password?email=${encodeURIComponent(email)}`);
        } catch {
            setError("No se pudo procesar la solicitud. Intenta de nuevo.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[85vh] flex flex-col items-center justify-center px-4">
            <div className="w-full max-w-sm bg-white p-6 rounded-lg shadow">
                <h1 className="text-xl font-bold mb-4 text-center">Recuperar contraseña</h1>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <label className="block text-gray-700">Correo electrónico</label>
                    <div className="relative">
                        <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border rounded focus:ring-2 focus:ring-gray-600"
                            placeholder="usuario@ejemplo.com"
                        />
                    </div>
                    {error && <p className="text-red-600 text-sm">{error}</p>}
                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full py-2 bg-gray-800 text-white rounded hover:bg-gray-900 transition ${
                            loading ? "opacity-70 cursor-not-allowed" : ""
                        }`}
                    >
                        {loading ? "Enviando…" : "Enviar código OTP"}
                    </button>
                </form>
            </div>
        </div>
    );
}
