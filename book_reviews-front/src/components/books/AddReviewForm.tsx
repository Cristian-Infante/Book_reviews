"use client";

import React, {useEffect, useState} from "react";
import {useRouter} from "next/navigation";
import {FaSpinner, FaStar, FaUndo} from "react-icons/fa";
import {API} from "@/lib/axios";
import {getUserIdFromToken} from "@/lib/auth";

const MAX_CHARS = 500;
type Props = { bookId: number };

export default function AddReviewForm({bookId}: Props) {
    const [userId, setUserId] = useState<number | null>(null);
    const router = useRouter();

    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => setUserId(getUserIdFromToken()), []);

    if (!userId) return null;

    const reset = () => {
        setRating(0);
        setComment("");
        setError(null);
    };

    const submit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!rating) return setError("Selecciona una calificación.");
        if (!comment.trim())
            return setError("Escribe un comentario antes de enviar.");

        setError(null);
        setLoading(true);
        try {
            await API.post("/Reviews", {bookId, userId, rating, comment});
            window.dispatchEvent(new Event("reviews-updated"));
            reset();
            router.refresh();
        } catch {
            setError("No se pudo guardar la reseña, intenta nuevamente.");
        } finally {
            setLoading(false);
        }
    };

    const remaining = MAX_CHARS - comment.length;
    const overLimit = remaining < 0;

    return (
        <form
            onSubmit={submit}
            className="space-y-6 border rounded-lg p-6 bg-white shadow-sm"
        >
            <fieldset className="flex items-center justify-center gap-1" aria-label="Calificación">
                {Array.from({length: 5}).map((_, i) => {
                    const val = i + 1;
                    return (
                        <label
                            key={val}
                            className={`group cursor-pointer ${
                                val <= rating ? "text-yellow-500" : "text-gray-400"
                            } transition`}
                        >
                            <input
                                type="radio"
                                name="rating"
                                value={val}
                                className="sr-only"
                                checked={rating === val}
                                onChange={() => setRating(val)}
                            />
                            <FaStar className="group-hover:text-yellow-500"/>
                        </label>
                    );
                })}
                <span className="ml-2 text-sm text-gray-600">{rating}/5</span>
            </fieldset>
            {error?.startsWith("Selecciona") && (
                <p className="text-sm text-red-600 -mt-4">{error}</p>
            )}

            <div className="space-y-1">
                <textarea
                    value={comment}
                    maxLength={MAX_CHARS + 1}
                    onChange={(e) => setComment(e.target.value)}
                    rows={4}
                    placeholder="Escribe una reseña sobre este libro..."
                    className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-gray-700 resize-none"
                />
                <div className="flex items-center justify-between text-xs">
            <span
                className={`${
                    overLimit ? "text-red-600" : "text-gray-500"
                } select-none`}
            >
                {remaining} caracteres disponibles
            </span>
                    <button
                        type="button"
                        onClick={reset}
                        className="inline-flex items-center gap-1 text-gray-500 hover:text-gray-700"
                    >
                        <FaUndo/> Limpiar
                    </button>
                </div>
                {error?.startsWith("Escribe") && (
                    <p className="text-sm text-red-600">{error}</p>
                )}
            </div>

            <div className="flex justify-center">
                <button
                    disabled={loading || overLimit}
                    className="inline-flex items-center gap-2 px-6 py-2 rounded-md bg-gray-800 text-white font-medium
                     hover:bg-gray-900 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-gray-700"
                >
                    {loading && (
                        <FaSpinner className="animate-spin" aria-label="Cargando"/>
                    )}
                    Publicar reseña
                </button>
            </div>

            {error && !error.startsWith("Selecciona") && !error.startsWith("Escribe") && (
                <p className="text-center text-red-600 text-sm">{error}</p>
            )}
        </form>
    );
}
