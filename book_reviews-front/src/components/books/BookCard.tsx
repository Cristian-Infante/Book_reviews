/* --------------------------------------------------------------------------
   src/components/books/BookCard.tsx   (Refactor)
   -------------------------------------------------------------------------- */
"use client";

import React from "react";
import Link from "next/link";
import { FaBook } from "react-icons/fa";

export type Book = {
    id: number;
    categoryId: number;
    title: string;
    author: string;
    summary?: string;
    coverUrl?: string;
    categoryName?: string;
};

export default function BookCard({ book }: { book: Book }) {
    return (
        <Link
            href={`/books/${book.id}`}
            className="group flex flex-col sm:flex-row gap-4 bg-white/80 border border-gray-200 rounded-lg p-4
                 shadow-sm hover:shadow-lg transition
                 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-700"
        >
            <div className="shrink-0 w-full sm:w-24 h-40 sm:h-auto relative">
                {book.coverUrl ? (
                    <img
                        src={book.coverUrl}
                        alt={`Portada de ${book.title}`}
                        className="w-full h-full object-cover rounded-md"
                        loading="lazy"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-md">
                        <FaBook className="text-gray-400 text-3xl" aria-hidden />
                    </div>
                )}
            </div>

            <div className="flex-1 flex flex-col">
                <header>
                    <h3 className="font-semibold text-lg leading-tight text-gray-800 line-clamp-2 group-hover:underline">
                        {book.title}
                    </h3>
                    <p className="text-sm text-gray-600">{book.author}</p>
                </header>

                {book.summary && (
                    <p className="mt-3 text-sm text-gray-700 line-clamp-3">
                        {book.summary}
                    </p>
                )}

                {book.categoryName && (
                    <span className="mt-3 inline-block w-max bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">
            {book.categoryName}
          </span>
                )}
            </div>
        </Link>
    );
}
