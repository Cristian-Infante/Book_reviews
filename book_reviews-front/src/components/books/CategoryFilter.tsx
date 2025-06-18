/* --------------------------------------------------------------------------
   src/components/books/CategoryFilter.tsx    (Refactor UI)
   -------------------------------------------------------------------------- */
"use client";

import React, { useEffect, useState } from "react";
import { API } from "@/lib/axios";
import { FaSpinner } from "react-icons/fa";

type Category = { id: number; name: string };

export default function CategoryFilter({
                                           value,
                                           onChange,
                                       }: {
    value: number | null;
    onChange: (v: number | null) => void;
}) {
    /* ───────────── state ───────────── */
    const [cats,    setCats]    = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [error,   setError]   = useState<string | null>(null);

    /* ───────────── fetch ───────────── */
    useEffect(() => {
        API.get<Category[]>("/Categories")
            .then(({ data }) =>
                setCats(data.sort((a, b) => a.name.localeCompare(b.name))))
            .catch(()  => setError("No se pudo cargar"))
            .finally(() => setLoading(false));
    }, []);

    /* Si la categoría seleccionada se elimina en el servidor */
    useEffect(() => {
        if (value && !cats.some(c => c.id === value)) onChange(null);
    }, [cats]);      // eslint-disable-line react-hooks/exhaustive-deps

    /* ───────────── UI ───────────── */
    return (
        <div className="relative w-full sm:w-auto">
            <select
                id="category"
                name="category"
                disabled={loading || !!error}
                value={value ?? ""}
                onChange={e => onChange(e.target.value ? Number(e.target.value) : null)}
                className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 pr-8
                   text-sm focus:outline-none focus:ring-2 focus:ring-gray-700
                   disabled:opacity-50"
                aria-label="Filtrar por categoría"
            >
                <option value="">Todas las categorías</option>
                {cats.map(c => (
                    <option key={c.id} value={c.id}>
                        {c.name}
                    </option>
                ))}
            </select>

            {/* Spinner à la derecha dentro del select */}
            {loading && (
                <FaSpinner className="absolute right-3 top-1/2 -translate-y-1/2 animate-spin text-gray-500" />
            )}

            {/* Error message */}
            {error && (
                <p className="mt-1 text-xs text-red-600">
                    {error}. <button onClick={() => location.reload()}>Reintentar</button>
                </p>
            )}
        </div>
    );
}
