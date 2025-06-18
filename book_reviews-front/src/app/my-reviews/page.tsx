"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {FaStar, FaTrash, FaSignInAlt, FaSpinner, FaPen} from "react-icons/fa";
import { API, PublicAPI } from "@/lib/axios";
import { getUserIdFromToken } from "@/lib/auth";

type Review = {
    id: number;
    bookId: number;
    bookTitle: string;
    rating: number;
    comment: string;
    createdAt: string;
};

export default function MyReviewsPage() {
    const [userId, setUserId] = useState<number | null | undefined>(undefined);
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);

    // Para edición inline
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editRating, setEditRating] = useState(0);
    const [editComment, setEditComment] = useState("");
    const [editError, setEditError] = useState<string | null>(null);

    useEffect(() => {
        setUserId(getUserIdFromToken());
    }, []);

    // Carga de reseñas y títulos
    useEffect(() => {
        if (!userId) {
            setLoading(false);
            return;
        }
        const ac = new AbortController();
        setLoading(true);

        async function fetchReviews() {
            try {
                const { data } = await API.get<Review[]>(
                    `/Reviews/user/${userId}`,
                    { signal: ac.signal }
                );
                // Enriquecer con título si falta
                const enriched = await Promise.all(
                    data.map(async (r) => {
                        if (r.bookTitle) return r;
                        try {
                            const { data: book } = await PublicAPI.get(
                                `/Books/${r.bookId}`,
                                { signal: ac.signal }
                            );
                            return { ...r, bookTitle: book.title };
                        } catch {
                            return { ...r, bookTitle: "(Título no disponible)" };
                        }
                    })
                );
                setReviews(enriched);
            } catch (e) {
                if (!ac.signal.aborted) console.error(e);
            } finally {
                setLoading(false);
            }
        }

        void fetchReviews();
        return () => ac.abort();
    }, [userId]);

    const deleteReview = async (id: number) => {
        if (!confirm("¿Eliminar esta reseña?")) return;
        try {
            await API.delete(`/Reviews/${id}`);
            setReviews((prev) => prev.filter((r) => r.id !== id));
        } catch {
            alert("No se pudo eliminar la reseña.");
        }
    };

    const saveEdit = async (id: number) => {
        if (!editRating) return setEditError("Selecciona una calificación.");
        if (!editComment.trim()) return setEditError("Escribe un comentario.");
        setEditError(null);

        try {
            await API.put(`/Reviews/${id}`, {
                id,
                rating: editRating,
                comment: editComment,
            });
            setEditingId(null);
            // Recargar localmente
            setReviews((prev) =>
                prev.map((r) =>
                    r.id === id ? { ...r, rating: editRating, comment: editComment } : r
                )
            );
        } catch {
            setEditError("No se pudo actualizar. Intenta de nuevo.");
        }
    };

    if (userId === undefined) return <div className="p-6" />;
    if (userId === null)
        return (
            <NeedLogin />
        );
    if (loading) return <p className="p-6">Cargando reseñas…</p>;
    if (reviews.length === 0)
        return <p className="p-6">Aún no has escrito reseñas.</p>;

    return (
        <section className="max-w-4xl mx-auto p-6 space-y-6">
            <h1 className="text-2xl font-bold">Mis reseñas</h1>
            <ul className="space-y-4">
                {reviews.map((r) => (
                    <li key={r.id} className="border rounded p-4">
                        {editingId === r.id ? (
                            // Formulario inline de edición
                            <div className="space-y-4">
                                <fieldset className="flex items-center gap-1" aria-label="Calificación">
                                    {Array.from({ length: 5 }).map((_, i) => {
                                        const val = i + 1;
                                        return (
                                            <label
                                                key={val}
                                                className={`cursor-pointer ${
                                                    val <= editRating ? "text-yellow-500" : "text-gray-400"
                                                }`}
                                            >
                                                <input
                                                    type="radio"
                                                    name="edit-rating"
                                                    value={val}
                                                    className="sr-only"
                                                    checked={editRating === val}
                                                    onChange={() => setEditRating(val)}
                                                />
                                                <FaStar />
                                            </label>
                                        );
                                    })}
                                    <span className="ml-2 text-sm text-gray-600">
                    {editRating}/5
                  </span>
                                </fieldset>

                                <textarea
                                    rows={3}
                                    value={editComment}
                                    onChange={(e) => setEditComment(e.target.value)}
                                    className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-gray-700"
                                />

                                {editError && (
                                    <p className="text-sm text-red-600">{editError}</p>
                                )}

                                <div className="flex gap-2">
                                    <button
                                        onClick={() => saveEdit(r.id)}
                                        className="px-4 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                                    >
                                        Guardar
                                    </button>
                                    <button
                                        onClick={() => setEditingId(null)}
                                        className="px-4 py-1 bg-gray-300 rounded hover:bg-gray-400"
                                    >
                                        Cancelar
                                    </button>
                                </div>
                            </div>
                        ) : (
                            // Vista normal
                            <>
                                <div className="flex gap-1 text-yellow-500 mb-1">
                                    {Array.from({ length: 5 }).map((_, i) => (
                                        <FaStar
                                            key={i}
                                            className={i < r.rating ? "" : "opacity-30"}
                                        />
                                    ))}
                                </div>
                                <p className="text-sm text-gray-800 whitespace-pre-line">
                                    {r.comment}
                                </p>
                                <footer className="mt-2 flex items-center justify-between text-xs text-gray-500">
                                    <Link
                                        href={`/books/${r.bookId}`}
                                        className="font-semibold hover:underline"
                                    >
                                        {r.bookTitle}
                                    </Link>
                                    <div className="flex items-center gap-2">
                    <span>
                      {new Date(r.createdAt).toLocaleDateString()}
                    </span>
                                        <button
                                            onClick={() => deleteReview(r.id)}
                                            className="text-red-600 hover:text-red-800"
                                            aria-label="Eliminar reseña"
                                        >
                                            <FaTrash />
                                        </button>
                                        <button
                                            onClick={() => {
                                                setEditingId(r.id);
                                                setEditRating(r.rating);
                                                setEditComment(r.comment);
                                            }}
                                            className="text-blue-600 hover:underline"
                                        >
                                            <FaPen />
                                        </button>
                                    </div>
                                </footer>
                            </>
                        )}
                    </li>
                ))}
            </ul>
        </section>
    );
}

function NeedLogin() {
    return (
        <section className="flex flex-col items-center justify-center min-h-[60vh] space-y-4 text-center">
            <h1 className="text-2xl font-bold">¡Ups! Necesitas iniciar sesión</h1>
            <p className="max-w-sm text-gray-600">
                Inicia sesión para ver, editar o eliminar tus reseñas de libros.
            </p>
            <Link
                href="/login"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-md bg-gray-800 text-white font-medium hover:bg-gray-900 transition-colors"
            >
                <FaSignInAlt /> Iniciar sesión
            </Link>
        </section>
    );
}
