import type { Metadata } from "next";
import MyBetsPanel from "@/components/MyBetsPanel";

export const metadata: Metadata = {
	title: "Meus Palpites - Bolão Celeste",
	description:
		"Acompanhe seus palpites, ganhos e histórico de apostas.",
};

export default function MyBetsPage() {
	return <MyBetsPanel />;
}
