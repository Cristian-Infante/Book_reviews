import {notFound} from "next/navigation";
import type {Metadata} from "next";
import dynamic from "next/dynamic";
import Link from "next/link";
import {Suspense} from "react";
import {API} from "@/lib/axios";
import type {Book} from "@/components/books/BookCard";
import {FaArrowLeft} from "react-icons/fa";

const ReviewList = dynamic(() => import("@/components/books/ReviewList"), {suspense: true});
const AddReviewForm = dynamic(() => import("@/components/books/AddReviewForm"), {suspense: true});

type Props = { params: { id: string } };

export async function generateMetadata({params}: Props): Promise<Metadata> {
    const {id} = params;
    try {
        const {data} = await API.get<Book>(`/Books/${id}`);
        return {
            title: `${data.title} | Book Reviews`,
            description: data.summary ?? data.title,
        };
    } catch {
        return {title: "Libro no encontrado | Book Reviews"};
    }
}

export default async function BookDetailPage({params}: Props) {
    const {id} = params;

    let book: Book;
    try {
        const {data} = await API.get<Book>(`/Books/${id}`);
        book = data;
    } catch {
        notFound();
    }

    return (
        <main className="max-w-3xl mx-auto p-6 space-y-8">
            <Link
                href="/books"
                className="inline-flex items-center text-gray-600 hover:text-gray-800 mb-4"
            >
                <FaArrowLeft className="mr-2"/>
                Volver a libros
            </Link>

            <article className="bg-white shadow rounded-lg p-6 text-center">
                <h1 className="text-3xl font-bold text-gray-800">{book.title}</h1>
                <p className="text-gray-600 mt-1">{book.author}</p>
                {book.categoryName && (
                    <span
                        className="inline-block mt-3 bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
                      {book.categoryName}
                    </span>
                )}
            </article>

            {book.summary && (
                <section className="bg-white shadow rounded-lg p-6">
                    <h2 className="text-xl font-semibold text-gray-800 mb-2 text-center">Resumen</h2>
                    <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                        {book.summary}
                    </p>
                </section>
            )}

            <section className="space-y-6">
                <div className="bg-white shadow rounded-lg p-6">
                    <h2 className="text-xl font-semibold text-gray-800 mb-2 text-center">Reseñas</h2>
                    <Suspense fallback={<p className="text-gray-500">Cargando reseñas…</p>}>
                        <ReviewList bookId={+id}/>
                    </Suspense>
                </div>

                <div className="bg-white shadow rounded-lg p-6">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">
                        ¿Qué te pareció?
                    </h3>
                    <Suspense fallback={<p className="text-gray-500">Cargando formulario…</p>}>
                        <AddReviewForm bookId={+id}/>
                    </Suspense>
                </div>
            </section>
        </main>
    );
}
