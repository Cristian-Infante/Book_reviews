/* --------------------------------------------------------------------------
   src/components/books/BookForm.tsx   (Refactor UI)
   -------------------------------------------------------------------------- */
"use client";

import React, { useState, useEffect } from "react";
import { API }       from "@/lib/axios";
import { useRouter } from "next/navigation";
import type { Book } from "./BookCard";

type Props = { initial?: Book };

// ────────────────────────────────────────────────────────────────
//  🔖 Campos reutilizables
// ────────────────────────────────────────────────────────────────
function InputField({
                        label,
                        value,
                        onChange,
                        required = false,
                        error,
                    }: {
    label: string;
    value: string;
    onChange: (v: string) => void;
    required?: boolean;
    error?: string | null;
}) {
    return (
        <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">
                {label}
                {required && <span className="text-red-600">*</span>}
            </label>
            <input
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className={`w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-700
                    ${error ? "border-red-500" : "border-gray-300"}`}
            />
            {error && <p className="text-xs text-red-600">{error}</p>}
        </div>
    );
}

type Cat = { id: number; name: string };
function CategorySelect({
                            value,
                            onChange,
                        }: {
    value: number | "";
    onChange: (v: number | "") => void;
}) {
    const [cats, setCats] = useState<Cat[]>([]);
    useEffect(() => {
        API.get<Cat[]>("/Categories").then((r) => setCats(r.data));
    }, []);

    return (
        <select
            value={value}
            onChange={(e) =>
                onChange(e.target.value ? Number(e.target.value) : "")
            }
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-700"
        >
            <option value="">Sin categoría</option>
            {cats.map((c) => (
                <option key={c.id} value={c.id}>
                    {c.name}
                </option>
            ))}
        </select>
    );
}

// ────────────────────────────────────────────────────────────────
//  🌟  Componente principal
// ────────────────────────────────────────────────────────────────
export default function BookForm({ initial }: Props) {
    const router = useRouter();

    // estado
    const [title, setTitle] = useState(initial?.title ?? "");
    const [author, setAuthor] = useState(initial?.author ?? "");
    const [summary, setSummary] = useState(initial?.summary ?? "");
    const [categoryId, setCategoryId] = useState<number | "">(
        initial?.categoryId ?? ""
    );
    const [saving, setSaving] = useState(false);

    // errores de validación por campo
    const [errors, setErrors] = useState<{ title?: string; author?: string }>({});

    // envío
    // envío
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const newErrors: typeof errors = {};
        if (!title.trim())  newErrors.title  = "El título es obligatorio";
        if (!author.trim()) newErrors.author = "El autor es obligatorio";
        setErrors(newErrors);
        if (Object.keys(newErrors).length) return;

        setSaving(true);
        try {
            const payload = { title, author, summary, categoryId: categoryId || null };

            if (initial) {
                await API.put(`/Books/${initial.id}`, { id: initial.id, ...payload });
            } else {
                await API.post("/Books", payload);
            }

            router.push("/books");
            router.refresh();
        } catch {
            alert("No se pudo guardar. Inténtalo de nuevo.");
        } finally {
            setSaving(false);
        }
    };

    // UI
    return (
        <form
            onSubmit={handleSubmit}
            className="mx-auto max-w-md space-y-6 rounded-xl border border-gray-200 bg-white/80 p-6 shadow-sm"
        >
            <div className="space-y-4">
                <InputField
                    label="Título"
                    value={title}
                    onChange={setTitle}
                    required
                    error={errors.title ?? null}
                />
                <InputField
                    label="Autor"
                    value={author}
                    onChange={setAuthor}
                    required
                    error={errors.author ?? null}
                />
            </div>

            <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">Categoría</label>
                <CategorySelect value={categoryId} onChange={setCategoryId} />
            </div>

            <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">Resumen</label>
                <textarea
                    rows={4}
                    value={summary}
                    onChange={(e) => setSummary(e.target.value)}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-700"
                />
            </div>

            <button
                type="submit"
                disabled={saving}
                className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-gray-800 px-6 py-2 text-white transition
                   hover:bg-gray-900 disabled:cursor-not-allowed disabled:opacity-70"
            >
                {saving && (
                    <svg
                        className="h-5 w-5 animate-spin"
                        viewBox="0 0 24 24"
                        fill="none"
                    >
                        <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                        />
                        <path
                            className="opacity-75"
                            d="M22 12a10 10 0 01-10 10V20a8 8 0 008-8h2z"
                            fill="currentColor"
                        />
                    </svg>
                )}
                {saving ? "Guardando…" : initial ? "Actualizar Libro" : "Crear libro"}
            </button>
        </form>
    );
}
