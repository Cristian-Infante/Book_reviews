/* --------------------------------------------------------------------------
   src/components/books/BookList.tsx           (Bug-fix)
   -------------------------------------------------------------------------- */
"use client";

import React, { useEffect, useState } from "react";
import { API } from "@/lib/axios";
import BookCard, { Book } from "./BookCard";
import SearchBar from "./SearchBar";
import CategoryFilter from "./CategoryFilter";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import useDebounce from "@/lib/useDebounce";

type Paged<T> = {
    items: T[] | undefined;
    pageNumber: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
};

export default function BookList() {
    const [books,      setBooks]      = useState<Book[]>([]);
    const [search,     setSearch]     = useState("");
    const debounced                     = useDebounce(search, 300);
    const [categoryId, setCategoryId]  = useState<number | null>(null);
    const [page,       setPage]        = useState(1);
    const [totalPages, setTotalPages]  = useState(1);
    const [loading,    setLoading]     = useState(false);

    /* Fetch */
    useEffect(() => {
        setLoading(true);
        API.get<Paged<Book>>("/Books", {
            params: {
                pageNumber: page,
                pageSize  : 12,
                search    : debounced || undefined,
                categoryId: categoryId || undefined,
            },
        })
            .then(({ data }) => {
                /* ✅ Siempre un array */
                setBooks(data.items ?? []);
                setTotalPages(data.totalPages);
            })
            .finally(() => setLoading(false));
    }, [page, debounced, categoryId]);

    /* Reset page cuando cambia filtro/búsqueda */
    useEffect(() => { setPage(1); }, [debounced, categoryId]);

    /* Scroll suave al cambiar de página */
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, [page]);

    function PagerBtn({
                          disabled,
                          onClick,
                          icon,
                          label,
                          reversed = false,
                      }: {
        disabled : boolean;
        onClick  : () => void;
        icon     : React.ReactNode;
        label    : string;
        reversed?: boolean;
    }) {
        return (
            <button
                type="button"
                disabled={disabled}
                onClick={onClick}
                aria-label={label}
                className="inline-flex items-center gap-2 rounded-md border bg-white px-3 py-2
                 text-gray-700 shadow-sm transition hover:bg-gray-50 disabled:opacity-40"
            >
                {!reversed && icon}
                <span className="sr-only sm:not-sr-only">{label}</span>
                {reversed && icon}
            </button>
        );
    }
    /* Render */
    return (
        <>
            <header className="sticky top-16 z-20 mx-[-1rem] mb-6 flex flex-wrap
                         gap-4 bg-white/80 p-4 backdrop-blur lg:rounded-lg justify-center">
                <SearchBar      value={search}    onChange={setSearch} />
                <CategoryFilter value={categoryId} onChange={setCategoryId} />
            </header>

            {loading ? (
                <SkeletonGrid expected={books?.length ?? 12} />
            ) : books.length === 0 ? (
                <p className="text-center text-gray-500">No se encontraron libros.</p>
            ) : (
                <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                    {books.map(b => <BookCard key={b.id} book={b} />)}
                </div>
            )}

            {totalPages > 1 && (
                <nav className="mt-10 flex items-center justify-center gap-6">
                    <PagerBtn
                        disabled={page === 1}
                        onClick={() => setPage(p => p - 1)}
                        icon={<FaChevronLeft />}
                        label="Anterior"
                    />
                    <span className="text-sm sm:text-base">
            Página&nbsp;<strong>{page}/{totalPages}</strong>
          </span>
                    <PagerBtn
                        disabled={page === totalPages}
                        onClick={() => setPage(p => p + 1)}
                        icon={<FaChevronRight />}
                        label="Siguiente"
                        reversed
                    />
                </nav>
            )}
        </>
    );
}

/* … PagerBtn y SkeletonGrid no cambian salvo: */
function SkeletonGrid({ expected }: { expected: number }) {
    return (
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: expected }).map((_, i) => (
                <div
                    key={i}
                    className="h-40 animate-pulse rounded-lg bg-gradient-to-r
                     from-gray-200 via-gray-100 to-gray-200"
                />
            ))}
        </div>
    );
}
