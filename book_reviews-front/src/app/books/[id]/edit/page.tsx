import {notFound} from "next/navigation";
import dynamic from "next/dynamic";
import API from "@/lib/axios";
import type {Book} from "@/components/books/BookCard";

const BookForm = dynamic(() => import("@/components/books/BookForm"));

type Params = { params: { id: string } };

export default async function EditBook({params}: Params) {
    const {id} = params;
    try {
        const {data} = await API.get<Book>(`/Books/${id}`);
        return (
            <section className="max-w-3xl mx-auto p-6">
                <h1 className="text-2xl font-bold mb-6">Editar libro</h1>
                <BookForm initial={data}/>
            </section>
        );
    } catch {
        notFound();
    }
}
