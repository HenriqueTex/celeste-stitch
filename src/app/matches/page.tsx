import type { Metadata } from "next";
import MatchHistory from "@/components/MatchHistory";
import MatchPrediction from "@/components/MatchPrediction";

export const metadata: Metadata = {
	title: "Jogos - Bolão Celeste",
	description:
		"Acompanhe o histórico de jogos e faça seus palpites para as próximas partidas do Cruzeiro.",
};

export default function MatchesPage() {
	return (
		<div className="max-w-4xl mx-auto flex flex-col gap-6">
			<MatchPrediction />
			<MatchHistory />
		</div>
	);
}
