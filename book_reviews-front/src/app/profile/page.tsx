"use client";

import React, {useEffect, useState} from "react";
import {API} from "@/lib/axios";
import {useRouter} from "next/navigation";
import {getUserIdFromToken} from "@/lib/auth";

type User = {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    profileImage?: string;
};

export default function ProfilePage() {
    const [user, setUser] = useState<User | null>(null);
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [image, setImage] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        const id = getUserIdFromToken();
        if (!id) return;

        API.get<User>(`/Users/${id}`)
            .then(({data}) => {
                setUser(data);
                setFirstName(data.firstName ?? "");
                setLastName(data.lastName ?? "");
                if (data.profileImage) {
                    setPreview(`data:image/*;base64,${data.profileImage}`);
                }
            })
            .catch(console.error);
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const id = getUserIdFromToken();
        if (!id || !user) return;

        setLoading(true);
        try {
            await API.put(`/Users/${id}`, {
                id,
                firstName,
                lastName,
                email: user.email,
            });

            if (image) {
                const form = new FormData();
                form.append("file", image);
                await API.post(`/Users/${id}/photo`, form, {
                    headers: {"Content-Type": "multipart/form-data"},
                });
                setMessage("Imagen actualizada correctamente");
            } else {
                setMessage("Perfil actualizado correctamente");
            }

            setTimeout(() => setMessage(null), 3000);
            router.refresh();
        } finally {
            setLoading(false);
        }
    };

    const handleRemoveImage = async () => {
        const id = getUserIdFromToken();
        if (!id || !user) return;
        try {
            await API.delete(`/Users/${id}/photo`);
            setPreview(null);
            setImage(null);
            setMessage("Imagen eliminada");
            setTimeout(() => setMessage(null), 3000);
            router.refresh();
        } catch (error) {
            console.error("Error al eliminar la imagen:", error);
        }
    };

    if (!user) return <p className="p-6 text-center text-gray-600">Cargando perfil…</p>;

    return (
        <section className="flex justify-center items-center min-h-[85vh] bg-gray-50 px-4 py-12">
            <div className="bg-white shadow-lg rounded-xl w-full max-w-3xl overflow-hidden">
                {message && (
                    <div className="text-center bg-green-100 text-green-800 py-2 text-sm font-medium">
                        {message}
                    </div>
                )}
                <div className="grid md:grid-cols-3 gap-0">
                    <div className="bg-gray-100 p-6 flex flex-col items-center justify-center">
                        <img
                            src={preview ?? "/default-profile.png"}
                            alt="Foto de perfil"
                            className="w-32 h-32 object-cover rounded-full border"
                        />

                        <div className="mt-4 flex flex-col items-center gap-2">
                            <button
                                type="button"
                                onClick={() => document.getElementById("profile-image")?.click()}
                                className="px-4 py-1 bg-gray-700 text-white text-sm rounded hover:bg-gray-800 transition"
                            >
                                Cambiar foto
                            </button>

                            {(preview || image) && (
                                <button
                                    type="button"
                                    onClick={handleRemoveImage}
                                    className="px-4 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition"
                                >
                                    Eliminar foto
                                </button>
                            )}
                        </div>

                        <input
                            id="profile-image"
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                                const file = e.target.files?.[0] || null;
                                if (file) {
                                    setImage(file);
                                    setPreview(URL.createObjectURL(file));
                                    e.target.value = "";
                                }
                            }}
                        />
                    </div>

                    <div className="md:col-span-2 p-6">
                        <h1 className="text-2xl font-bold mb-6 text-gray-800">Editar perfil</h1>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label className="block font-medium text-gray-700 mb-1">Nombre</label>
                                <input
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                    className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-gray-600"
                                />
                            </div>

                            <div>
                                <label className="block font-medium text-gray-700 mb-1">Apellidos</label>
                                <input
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                    className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-gray-600"
                                />
                            </div>

                            <div>
                                <label className="block font-medium text-gray-700 mb-1">Correo electrónico</label>
                                <input
                                    value={user.email}
                                    disabled
                                    className="w-full border rounded px-3 py-2 bg-gray-100 text-gray-500 cursor-not-allowed"
                                />
                            </div>

                            <div className="flex justify-center">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="px-6 py-2 bg-gray-800 text-white rounded hover:bg-gray-900 disabled:opacity-50"
                                >
                                    {loading ? "Guardando…" : "Actualizar"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
}
