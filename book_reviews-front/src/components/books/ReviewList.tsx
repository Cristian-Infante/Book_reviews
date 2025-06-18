"use client";

import React, { useEffect, useState } from "react";
import { API } from "@/lib/axios";
import {FaStar, FaSpinner, FaPen} from "react-icons/fa";
import { getUserIdFromToken } from "@/lib/auth";

type Review = {
    id: number;
    bookId: number;
    userId: number;
    userName: string;
    rating: number;
    comment: string;
    createdAt: string;
};

export default function ReviewList({ bookId }: { bookId: number }) {
    const currentUserId = getUserIdFromToken();
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    // Para edición inline
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editRating, setEditRating] = useState(0);
    const [editComment, setEditComment] = useState("");
    const [editError, setEditError] = useState<string | null>(null);

    const fetchReviews = async () => {
        setRefreshing(true);
        try {
            const { data } = await API.get<{ items: Review[] }>(
                `/Reviews/book/${bookId}`
            );
            setReviews(data.items);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchReviews();
    }, [bookId]);

    useEffect(() => {
        const handler = () => fetchReviews();
        window.addEventListener("reviews-updated", handler);
        return () => window.removeEventListener("reviews-updated", handler);
    }, [bookId]);

    // Guardar cambios de edición
    const saveEdit = async (id: number) => {
        if (!editRating) return setEditError("Selecciona una calificación.");
        if (!editComment.trim()) return setEditError("Escribe un comentario.");
        setEditError(null);

        try {
            await API.put(`/Reviews/${id}`, {
                id,
                bookId,
                rating: editRating,
                comment: editComment,
            });
            setEditingId(null);
            fetchReviews();
        } catch {
            setEditError("No se pudo actualizar. Intenta de nuevo.");
        }
    };

    if (loading) return <SkeletonList />;

    if (reviews.length === 0)
        return (
            <p className="text-center text-sm text-gray-500">
                Aún no hay reseñas para este libro.
            </p>
        );

    return (
        <section aria-labelledby="reviews-heading" className="mb-8">
            <header className="mb-4 flex items-center gap-2">
                <h2 id="reviews-heading" className="text-lg font-semibold">
                    Reseñas de lectores
                </h2>
                {refreshing && (
                    <FaSpinner className="animate-spin text-gray-500" aria-label="Cargando" />
                )}
            </header>

            <ul role="list" className="space-y-4">
                {reviews.map((r) => (
                    <li
                        key={r.id}
                        className="rounded-lg border border-gray-200 bg-white/70 p-4 shadow-sm"
                    >
                        {editingId === r.id ? (
                            // --- Formulario inline de edición ---
                            <div className="space-y-4">
                                <fieldset
                                    className="flex items-center gap-1"
                                    aria-label="Calificación"
                                >
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
                            // --- Vista normal de reseña ---
                            <>
                                <div className="flex items-center gap-0.5 text-yellow-500">
                                    {Array.from({ length: 5 }).map((_, i) => (
                                        <FaStar
                                            key={i}
                                            className={i < Math.round(r.rating) ? "" : "opacity-30"}
                                        />
                                    ))}
                                </div>
                                <p className="mt-2 whitespace-pre-line text-sm text-gray-800">
                                    {r.comment}
                                </p>
                                <footer className="mt-3 flex items-center justify-between text-xs text-gray-500">
                  <span>
                    — {r.userName} ·{" "}
                      {new Date(r.createdAt).toLocaleDateString(undefined, {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                      })}
                  </span>
                                    {r.userId === currentUserId && (
                                        <button
                                            onClick={() => {
                                                setEditingId(r.id);
                                                setEditRating(r.rating);
                                                setEditComment(r.comment);
                                            }}
                                            className="text-blue-600 hover:underline text-sm"
                                        >
                                            <FaPen />
                                        </button>
                                    )}
                                </footer>
                            </>
                        )}
                    </li>
                ))}
            </ul>
        </section>
    );
}

function SkeletonList() {
    return (
        <ul role="list" className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
                <li
                    key={i}
                    className="h-24 animate-pulse rounded-lg bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200"
                />
            ))}
        </ul>
    );
}
