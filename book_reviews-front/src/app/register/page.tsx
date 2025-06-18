"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {API} from "@/lib/axios";
import {
    FaUserPlus,
    FaEye,
    FaEyeSlash,
} from "react-icons/fa";
import axios, {AxiosError} from "axios";

export default function RegisterPage() {
    const router = useRouter();

    const [firstName, setFirstName] = useState("");
    const [lastName,  setLastName]  = useState("");
    const [email,     setEmail]     = useState("");
    const [password,  setPassword]  = useState("");
    const [confirm,   setConfirm]   = useState("");
    const [showPass,  setShowPass]  = useState(false);
    const [showPass1,  setShowPass1]  = useState(false);

    const [error,     setError]     = useState<string | null>(null);
    const [success,   setSuccess]   = useState(false);
    const [loading,   setLoading]   = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (password !== confirm) {
            setError("Las contraseñas no coinciden.");
            return;
        }

        setLoading(true);
        try {
            await API.post("/Auth/register", {
                firstName,
                lastName,
                email,
                password,
            });

            setSuccess(true);
            setTimeout(() => router.push("/login"), 1500);
        } catch (err: unknown) {
            let msg = "No se pudo completar el registro. Intenta de nuevo.";

            if (axios.isAxiosError(err)) {
                msg = (err as AxiosError<{ message?: string }>).response?.data?.message ?? msg;
            }

            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    /* -------------------------------------------------------------------------- */
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br p-6">
            {/* ---------- encabezado ---------- */}
            <div className="text-center mb-8">
                <FaUserPlus className="mx-auto text-gray-800" size={60} />
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 uppercase tracking-wide mt-3">
                    Crea tu cuenta
                </h1>
            </div>

            {/* ---------- tarjeta ---------- */}
            <div className="w-full max-w-sm md:max-w-md bg-white rounded-xl shadow-lg p-6 md:p-8 hover:shadow-2xl transition-shadow">
                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Nombre */}
                    <Input
                        label="Nombre"
                        id="firstName"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        placeholder="Ingresa tu nombre"
                    />

                    {/* Apellidos */}
                    <Input
                        label="Apellidos"
                        id="lastName"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        placeholder="Ingresa tus apellidos"
                    />

                    {/* Email */}
                    <Input
                        label="Correo electrónico"
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="usuario@ejemplo.com"
                    />

                    {/* Contraseña */}
                    <PasswordInput
                        label="Contraseña"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        show={showPass}
                        toggle={() => setShowPass(!showPass)}
                    />

                    <PasswordInput
                        label="Confirmar contraseña"
                        id="confirmPassword"
                        value={confirm}
                        onChange={(e) => setConfirm(e.target.value)}
                        show={showPass1}
                        toggle={() => setShowPass1(!showPass1)}
                    />

                    {/* Botón submit */}
                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full py-3 bg-gray-800 text-white font-semibold rounded-lg hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-600 shadow-lg flex justify-center items-center ${
                            loading ? "opacity-70 cursor-not-allowed" : ""
                        }`}
                    >
                        {loading ? (
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                            "Registrarme"
                        )}
                    </button>

                    {/* Mensajes */}
                    {error && (
                        <p className="bg-red-100 text-red-700 p-3 rounded-lg text-center text-sm md:text-base">
                            {error}
                        </p>
                    )}
                    {success && (
                        <p className="bg-green-100 text-green-700 p-3 rounded-lg text-center text-sm md:text-base">
                            ¡Registro exitoso! Redirigiendo…
                        </p>
                    )}
                </form>
            </div>
        </div>
    );
}

/* -------------------------------------------------------------------------- */
/*                              Sub-componentes                               */
/* -------------------------------------------------------------------------- */
type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
    label: string;
    icon: React.ReactNode;
};

function Input({ label, id, ...rest }: InputProps) {
    return (
        <div>
            <label
                htmlFor={id}
                className="block text-gray-700 font-medium mb-2 text-sm md:text-base"
            >
                {label}:
            </label>
            <div className="relative">
                <input
                    {...rest}
                    id={id}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-600 shadow-sm text-sm md:text-base"
                    required
                />
            </div>
        </div>
    );
}

type PasswordProps = {
    label: string;
    id: string;
    value: string;
    onChange: React.ChangeEventHandler<HTMLInputElement>;
    show: boolean;
    toggle: () => void;
};

function PasswordInput({
                           label,
                           id,
                           value,
                           onChange,
                           show,
                           toggle,
                       }: PasswordProps) {
    return (
        <div>
            <label
                htmlFor={id}
                className="block text-gray-700 font-medium mb-2 text-sm md:text-base"
            >
                {label}:
            </label>
            <div className="relative">
                <input
                    type={show ? "text" : "password"}
                    id={id}
                    value={value}
                    onChange={onChange}
                    placeholder="••••••••"
                    autoComplete="new-password"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg pr-12 focus:outline-none focus:ring-2 focus:ring-gray-600 shadow-sm text-sm md:text-base"
                    required
                />
                <button
                    type="button"
                    onClick={toggle}
                    className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-600"
                >
                    {show ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
                </button>
            </div>
        </div>
    );
}
