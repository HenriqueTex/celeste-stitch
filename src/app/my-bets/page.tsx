import type { Metadata } from "next";
import MyBetsPanel from "@/components/MyBetsPanel";

export const metadata: Metadata = {
	title: "Meus palpites — Bolão Celeste",
	description:
		"Acompanhe seus palpites, pagamentos e resultados.",
};

export default function MyBetsPage() {
	return <MyBetsPanel />;
}
