// Server Component
import CategoryList from "@/components/categories/CategoryList";

export const metadata = {
    title: "Categorías | Book Reviews",
};

export default function CategoriesPage() {
    return (
        <section className="max-w-4xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-8">Categorías</h1>
            <CategoryList />
        </section>
    );
}
