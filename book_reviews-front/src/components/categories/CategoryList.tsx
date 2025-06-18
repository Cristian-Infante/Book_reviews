/* -------------------------------------------------------------------------- */
/*  src/components/categories/CategoryList.tsx                                */
/* -------------------------------------------------------------------------- */
"use client";

import React, { useEffect, useState } from "react";
import { FaPlus }   from "react-icons/fa";
import API          from "@/lib/axios";
import CategoryCard from "./CategoryCard";
import CategoryForm from "./CategoryForm";

export type Category = { id: number; name: string };

/** ✔️ eliminamos repetidos conservando el más reciente */
const uniqById = (arr: Category[]) =>
    [...new Map(arr.map(c => [c.id, c])).values()];

export default function CategoryList() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading,    setLoading]    = useState(true);
    const [showNew,    setShowNew]    = useState(false);

    /* -------- carga inicial -------- */
    const load = () => {
        setLoading(true);
        API.get<Category[]>("/Categories")
            .then(r => setCategories(uniqById(r.data)))
            .finally(() => setLoading(false));
    };
    useEffect(load, []);
    const onCreated = () => {
        setShowNew(false);
        load();
    };

    /* -------- callbacks -------- */
    const onUpdated = () => {
        setShowNew(false);
        load();
    };

    const onDeleted = (id: number) =>
        setCategories(prev => prev.filter(x => x.id !== id));

    /* -------- UI -------- */
    return (
        <div className="space-y-6">
            <button
                onClick={() => setShowNew(!showNew)}
                className="flex items-center gap-2 rounded-md bg-gray-800 px-4 py-2
                   text-white hover:bg-gray-900"
            >
                <FaPlus /> Nueva categoría
            </button>

            {showNew && (
                <CategoryForm
                    key="new-form"
                    onSuccess={onCreated}
                    onCancel={() => setShowNew(false)}
                />
            )}

            {loading ? (
                <p>Cargando…</p>
            ) : categories.length === 0 ? (
                <p>No hay categorías.</p>
            ) : (
                <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {categories.map(cat => (
                        <CategoryCard
                            key={cat.id ?? `tmp-${cat.name}`}   /* 🛡️ respaldo */
                            category={cat}
                            onUpdated={onUpdated}
                            onDeleted={onDeleted}
                        />
                    ))}
                </ul>
            )}
        </div>
    );
}
