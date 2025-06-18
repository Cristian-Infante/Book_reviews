import dynamic from "next/dynamic";

export const metadata = { title: "Nuevo libro | Book Reviews" };

const BookForm = dynamic(() => import("@/components/books/BookForm"));

export default function NewBookPage() {
    return (
        <section className="max-w-3xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-6 text-center">Añadir libro</h1>
            <BookForm />
        </section>
    );
}
