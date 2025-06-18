/* --------------------------------------------------------------------------
   src/components/categories/CategoryForm.tsx              (UI polished)
   -------------------------------------------------------------------------- */
"use client";

import React, { useState, useRef } from "react";
import API           from "@/lib/axios";
import { Category }  from "./CategoryList";
import { FaSpinner } from "react-icons/fa";

type Props = {
    initial?  : Category;               // edición si existe
    onSuccess?: (c: Category) => void;  // callback al guardar
    onCancel? : () => void;             // cancelar formulario
};

export default function CategoryForm({ initial, onSuccess, onCancel }: Props) {
    const formRef = useRef<HTMLFormElement>(null);

    const [name,   setName]   = useState(initial?.name ?? "");
    const [error,  setError]  = useState<string | null>(null);
    const [saving, setSaving] = useState(false);

    /* ───────────── Submit ───────────── */
    const handleSubmit: React.FormEventHandler<HTMLFormElement> = async e => {
        e.preventDefault();
        if (!name.trim()) { setError("El nombre es obligatorio"); return; }

        setSaving(true);
        try {
            let data: Category;

            if (initial) {
                ({ data } = await API.put<Category>(
                    `/Categories/${initial.id}`, { id: initial.id, name }
                ));
            } else {
                ({ data } = await API.post<Category>("/Categories", { name }));
            }

            const saved: Category = { ...data, name: data.name ?? name };

            onSuccess?.(saved);
        } catch {
            setError("No se pudo guardar, inténtalo de nuevo.");
        } finally {
            setSaving(false);
        }
    };

    const handleKeyDown: React.KeyboardEventHandler<HTMLInputElement> = e => {
        if (e.key === "Enter") {
            e.preventDefault();          // evita el submit implícito del input
            formRef.current?.requestSubmit(); // dispara la validación y onSubmit
        }
    };

    /* ───────────── UI ───────────── */
    return (
        <form
            onSubmit={handleSubmit}
            className="rounded-lg border border-gray-200 bg-white/80 p-5 shadow-sm space-y-5"
        >
            {/* Título dinámico */}
            <h3 className="text-lg font-semibold text-gray-800">
                {initial ? "Editar categoría" : "Nueva categoría"}
            </h3>

            {/* Campo de texto */}
            <div className="space-y-1">
                <label htmlFor="cat-name" className="text-sm font-medium text-gray-700">
                    Nombre<span className="text-red-600">*</span>
                </label>

                <input
                    id="cat-name"
                    value={name}
                    onChange={e => { setName(e.target.value); if (error) setError(null); }}
                    onKeyDown={handleKeyDown}
                    aria-invalid={Boolean(error)}
                    aria-describedby={error ? "cat-error" : undefined}
                    className={`w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2
                    ${error ? "border-red-500 focus:ring-red-600"
                        : "border-gray-300 focus:ring-gray-700"}`}
                />

                {error && (
                    <p id="cat-error" className="text-xs text-red-600">
                        {error}
                    </p>
                )}
            </div>

            {/* Botones */}
            <div className="flex gap-3">
                <button
                    type="submit"
                    disabled={saving}
                    className="inline-flex items-center gap-2 rounded-md bg-gray-800 px-4 py-2
                     text-white transition hover:bg-gray-900 disabled:opacity-60"
                >
                    {saving && <FaSpinner className="animate-spin" />}
                    {saving ? "Guardando…" : "Guardar"}
                </button>

                {onCancel && (
                    <button
                        type="button"
                        onClick={onCancel}
                        className="rounded-md border border-gray-300 px-4 py-2 text-gray-700
                       transition hover:bg-gray-50"
                    >
                        Cancelar
                    </button>
                )}
            </div>
        </form>
    );
}
