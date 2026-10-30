import type { Metadata } from "next";
import MatchHistory from "@/components/MatchHistory";
import MatchPrediction from "@/components/MatchPrediction";
export const metadata: Metadata = { title: "Jogos — Bolão Celeste" };
export default function MatchesPage() {
	return (
		<div className="home-dashboard">
			<div className="page-intro">
				<h1>Jogos do Cruzeiro</h1>
				<p>Todas as partidas abertas, seu status em cada uma e os últimos resultados.</p>
			</div>
			<MatchPrediction />
			<MatchHistory />
		</div>
	);
}
