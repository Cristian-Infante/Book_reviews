import BookList from "@/components/books/BookList";

export const metadata = {
    title: "Libros | Book Reviews",
};

export default function BooksPage() {
    return (
        <section className="max-w-6xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-8 text-center">Catálogo de libros</h1>
            <BookList />
        </section>
    );
}