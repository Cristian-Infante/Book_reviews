import { notFound } from "next/navigation";
import dynamic     from "next/dynamic";
import API         from "@/lib/axios";

const CategoryForm = dynamic(() => import("@/components/categories/CategoryForm"));

type Params = { params:{ id:string } };

export default async function CategoryDetail({ params }:Params) {
    const { id } = params;
    if (id === "new") return <CategoryForm />;           // alta

    try {
        const { data } = await API.get(`/Categories/${id}`);
        return <CategoryForm initial={data} />;
    } catch { notFound(); }
}
