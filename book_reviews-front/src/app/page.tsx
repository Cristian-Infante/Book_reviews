import Link from "next/link";
import {FaSearch, FaStarHalfAlt, FaCompass} from "react-icons/fa";

export default function Home() {
    return (
        <div className="flex flex-col min-h-[calc(100vh-4rem)] pt-10 pb-20 px-6 md:px-10">
            <section className="flex-1 flex flex-col justify-center items-center text-center gap-6">
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                    Bienvenido a&nbsp;
                    <span className="text-gray-600">Book&nbsp;Reviews</span>
                </h1>

                <p className="max-w-xl text-lg md:text-xl text-gray-600 dark:text-gray-400">
                    La comunidad donde <strong>descubres</strong> libros increíbles,
                    <strong> compartes</strong> tus opiniones y encuentras tu próxima gran lectura.
                </p>

                <div className="flex flex-col sm:flex-row gap-4">
                    <Link
                        href="/books"
                        className="px-6 py-3 rounded-md bg-gray-600 text-white font-medium hover:bg-gray-700 transition-colors"
                    >
                        Explorar libros
                    </Link>
                    <Link
                        href="/register"
                        className="px-6 py-3 rounded-md border border-gray-600 text-gray-600 font-medium hover:bg-gray-50 transition-colors"
                    >
                        Crear cuenta
                    </Link>
                </div>
            </section>

            <section className="mt-16 grid gap-8 md:grid-cols-3 max-w-5xl mx-auto">
                <Feature
                    icon={<FaSearch size={28} className="text-gray-600"/>}
                    title="Busca"
                    text="Filtra por título, autor o categoría y encuentra exactamente lo que quieres leer."
                />
                <Feature
                    icon={<FaStarHalfAlt size={28} className="text-gray-600"/>}
                    title="Reseña"
                    text="Comparte tu opinión y valora los libros para ayudar a otros lectores."
                />
                <Feature
                    icon={<FaCompass size={28} className="text-gray-600"/>}
                    title="Descubre"
                    text="Explora recomendaciones basadas en tus gustos y las valoraciones de la comunidad."
                />
            </section>

            <section className="mt-20 text-center">
                <h2 className="text-2xl md:text-3xl font-semibold mb-4">
                    ¿Nuevo en Book Reviews?
                </h2>
                <p className="mb-6 text-gray-600 dark:text-gray-400">
                    ¡Únete gratis y empieza a construir tu biblioteca de reseñas personalizada!
                </p>
                <Link
                    href="/register"
                    className="inline-block px-8 py-3 rounded-md bg-gray-600 text-white font-medium hover:bg-gray-700 transition-colors"
                >
                    Regístrate ahora
                </Link>
            </section>
        </div>
    );
}

type FeatureProps = {
    icon: React.ReactNode;
    title: string;
    text: string;
};

function Feature({icon, title, text}: FeatureProps) {
    return (
        <div className="flex flex-col items-center text-center px-4">
            <div className="mb-4">{icon}</div>
            <h3 className="text-xl font-semibold mb-2">{title}</h3>
            <p className="text-gray-600 dark:text-gray-400">{text}</p>
        </div>
    );
}
