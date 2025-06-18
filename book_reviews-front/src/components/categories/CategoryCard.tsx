/* --------------------------------------------------------------------------
   src/components/categories/CategoryCard.tsx          (UI polished)
   -------------------------------------------------------------------------- */
"use client";

import React, { useState } from "react";
import { FaTrash, FaPen, FaSpinner } from "react-icons/fa";
import API           from "@/lib/axios";
import { Category }  from "./CategoryList";
import CategoryForm  from "./CategoryForm";

type Props = {
    category : Category;
    onUpdated: (c: Category) => void;
    onDeleted: (id: number) => void;
};

export default function CategoryCard({ category, onUpdated, onDeleted }: Props) {
    const [editing,  setEditing] = useState(false);
    const [deleting, setDeleting] = useState(false);

    /* ───────────── Eliminar ───────────── */
    const handleDelete = async () => {
        const ok = confirm(`¿Eliminar la categoría “${category.name}”?`);
        if (!ok) return;

        setDeleting(true);
        try {
            await API.delete(`/Categories/${category.id}`);
            onDeleted(category.id);
        } finally {
            setDeleting(false);
        }
    };

    /* ───────────── Edición en línea ───────────── */
    if (editing) {
        return (
            <CategoryForm
                initial={category}
                onSuccess={c => { onUpdated(c); setEditing(false); }}
                onCancel={() => setEditing(false)}
            />
        );
    }

    /* ───────────── Card normal ───────────── */
    return (
        <div
            className="group relative flex items-center justify-between rounded-lg border
                 border-gray-200 bg-white px-4 py-3 shadow-sm transition
                 hover:shadow-md"
        >
            {/* Nombre */}
            <span className="font-medium text-gray-800">{category.name}</span>

            {/* Acciones */}
            <div className="flex gap-2">
                {/* Editar */}
                <IconButton
                    title="Editar"
                    ariaLabel="Editar categoría"
                    onClick={() => setEditing(true)}
                    className="text-blue-600 hover:bg-blue-50 hover:text-blue-700"
                >
                    <FaPen />
                </IconButton>

                {/* Eliminar */}
                <IconButton
                    title="Eliminar"
                    ariaLabel="Eliminar categoría"
                    onClick={handleDelete}
                    disabled={deleting}
                    className="text-red-600 hover:bg-red-50 hover:text-red-700 disabled:opacity-50"
                >
                    {deleting ? (
                        <FaSpinner className="animate-spin" />
                    ) : (
                        <FaTrash />
                    )}
                </IconButton>
            </div>
        </div>
    );
}

/* ───────────── Botón con icono reutilizable ───────────── */
function IconButton({
                        children,
                        title,
                        ariaLabel,
                        onClick,
                        disabled,
                        className = "",
                    }: React.PropsWithChildren<{
    title: string;
    ariaLabel: string;
    onClick: () => void;
    disabled?: boolean;
    className?: string;
}>) {
    return (
        <button
            type="button"
            title={title}
            aria-label={ariaLabel}
            onClick={onClick}
            disabled={disabled}
            className={`flex h-8 w-8 items-center justify-center rounded-full
                  transition-colors focus:outline-none focus:ring-2 focus:ring-gray-600
                  ${className}`}
        >
            {children}
        </button>
    );
}
