import type { Metadata } from "next";
import MatchHistory from "@/components/MatchHistory";
import MatchPrediction from "@/components/MatchPrediction";
export const metadata: Metadata = { title: "Jogos — Bolão Celeste" };
export default function MatchesPage() {
	return (
		<div className="home-dashboard">
			<div className="page-intro">
				<p className="eyebrow">Dentro de campo</p>
				<h1>Jogos do Cruzeiro</h1>
				<p>Escolha a partida e prepare seu palpite.</p>
			</div>
			<MatchPrediction />
			<MatchHistory />
		</div>
	);
}
