"use client";

import React, {useState, useEffect} from "react";
import {useRouter, useSearchParams} from "next/navigation";
import {API} from "@/lib/axios";
import {FaEye, FaEyeSlash} from "react-icons/fa";

export default function ResetPasswordPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const email = searchParams.get("email") || "";

    const [code, setCode] = useState("");
    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const [showPwd, setShowPwd] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);

    const [resending, setResending] = useState(false);
    const [resendMsg, setResendMsg] = useState<string | null>(null);

    const [countdown, setCountdown] = useState(30);
    useEffect(() => {
        if (countdown <= 0) return;
        const timer = setTimeout(() => setCountdown(c => c - 1), 1000);
        return () => clearTimeout(timer);
    }, [countdown]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!/^\d{6}$/.test(code)) {
            return setError("Introduce un código de 6 dígitos válido.");
        }
        if (password !== confirm) {
            return setError("Las contraseñas no coinciden.");
        }
        setError(null);
        setLoading(true);
        try {
            await API.post("/Auth/reset-password", {
                token: code,
                newPassword: password,
            });
            setSuccess(true);
            setTimeout(() => router.push("/login"), 2000);
        } catch {
            setError("No se pudo restablecer. El código puede ser incorrecto o haber expirado.");
        } finally {
            setLoading(false);
        }
    };

    const handleResend = async () => {
        if (!email) return;
        setResending(true);
        setResendMsg(null);
        try {
            await API.post("/Auth/forgot-password", {email});
            setResendMsg("Código reenviado. Revisa tu bandeja de entrada.");
            setCountdown(30); // reinicia la cuenta atrás
        } catch {
            setResendMsg("No se pudo reenviar. Intenta de nuevo más tarde.");
        } finally {
            setResending(false);
            setTimeout(() => setResendMsg(null), 5000);
        }
    };

    if (success) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center px-4">
                <h1 className="text-2xl font-semibold text-green-600 mb-2">
                    ¡Contraseña actualizada!
                </h1>
                <p>Te redirigimos al inicio de sesión…</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-gray-50">
            <div className="w-full max-w-sm bg-white p-6 rounded-lg shadow">
                <h1 className="text-xl font-bold mb-4 text-center">Restablecer contraseña</h1>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Código OTP */}
                    <div>
                        <label htmlFor="otp" className="block text-gray-700 mb-1">
                            Código de 6 dígitos
                        </label>
                        <input
                            id="otp"
                            type="text"
                            inputMode="numeric"
                            maxLength={6}
                            value={code}
                            onChange={e => setCode(e.target.value.trim())}
                            className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-gray-600"
                            placeholder="123456"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-gray-700 mb-1">
                            Nueva contraseña
                        </label>
                        <div className="relative">
                            <input
                                id="password"
                                type={showPwd ? "text" : "password"}
                                minLength={6}
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                className="w-full border rounded px-3 py-2 pr-10 focus:ring-2 focus:ring-gray-600"
                                placeholder="••••••••"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPwd(v => !v)}
                                className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
                                aria-label={showPwd ? "Ocultar contraseña" : "Mostrar contraseña"}
                            >
                                {showPwd ? <FaEyeSlash size={20}/> : <FaEye size={20}/>}
                            </button>
                        </div>
                    </div>

                    <div>
                        <label htmlFor="confirm" className="block text-gray-700 mb-1">
                            Confirmar contraseña
                        </label>
                        <div className="relative">
                            <input
                                id="confirm"
                                type={showConfirm ? "text" : "password"}
                                minLength={6}
                                value={confirm}
                                onChange={e => setConfirm(e.target.value)}
                                className="w-full border rounded px-3 py-2 pr-10 focus:ring-2 focus:ring-gray-600"
                                placeholder="••••••••"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirm(v => !v)}
                                className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
                                aria-label={showConfirm ? "Ocultar contraseña" : "Mostrar contraseña"}
                            >
                                {showConfirm ? <FaEyeSlash size={20}/> : <FaEye size={20}/>}
                            </button>
                        </div>
                    </div>

                    {error && <p className="text-red-600 text-sm">{error}</p>}

                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full py-2 bg-gray-800 text-white rounded hover:bg-gray-900 transition ${
                            loading ? "opacity-70 cursor-not-allowed" : ""
                        }`}
                    >
                        {loading ? "Procesando…" : "Actualizar contraseña"}
                    </button>
                </form>

                <div className="mt-4 text-center">
                    <button
                        onClick={handleResend}
                        disabled={resending || countdown > 0 || !email}
                        className="text-sm text-gray-600 hover:underline disabled:opacity-50"
                    >
                        {countdown > 0
                            ? `Reenviar en ${countdown}s`
                            : resending
                                ? "Reenviando…"
                                : "¿No recibiste el código? Reenviar"}
                    </button>
                    {resendMsg && <p className="mt-2 text-xs text-gray-500">{resendMsg}</p>}
                </div>

                <p className="mt-4 text-sm text-gray-500 text-center">
                    Introduce el código OTP de 6 dígitos que te hemos enviado por correo.
                    Si no lo recibes en unos minutos, revisa la carpeta de spam.
                </p>
            </div>
        </div>
    );
}
