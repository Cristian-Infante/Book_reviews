/* --------------------------------------------------------------------------
   src/components/books/SearchBar.tsx            (Refactor UI)
   -------------------------------------------------------------------------- */
"use client";

import React, { useId } from "react";
import { FaSearch, FaTimes } from "react-icons/fa";

type Props = {
    value: string;
    onChange: (v: string) => void;
    /** opcional — aparecerá un botón “✕” para limpiar el campo */
    onClear?: () => void;
};

export default function SearchBar({ value, onChange, onClear }: Props) {
    const inputId = useId();
    const showClear = value.length > 0 && onClear;

    return (
        <div className="relative w-full sm:w-auto">
            {/* Etiqueta accesible oculta */}
            <label htmlFor={inputId} className="sr-only">
                Buscar libro
            </label>

            {/* 🔍 Ícono search fijo a la izquierda */}
            <FaSearch
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                aria-hidden
            />

            {/* Campo de búsqueda */}
            <input
                id={inputId}
                type="search"
                autoComplete="off"
                placeholder="Buscar por título o autor…"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-white py-2 pl-10 pr-10 text-sm
                   shadow-sm placeholder:text-gray-400
                   focus:border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-700"
            />

            {showClear && (
                <button
                    type="button"
                    onClick={onClear}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400
                     hover:text-gray-600 focus:outline-none"
                    aria-label="Limpiar búsqueda"
                >
                    <FaTimes />
                </button>
            )}
        </div>
    );
}
