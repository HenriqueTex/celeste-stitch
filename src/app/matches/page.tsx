import type { Metadata } from "next";
import MatchesBoard from "@/components/MatchesBoard";
export const metadata: Metadata = { title: "Jogos — Bolão Celeste" };
export default function MatchesPage() {
	return (
		<div className="home-dashboard">
			<div className="page-intro">
				<h1>Jogos do Cruzeiro</h1>
				<p>
					A agenda das próximas partidas, com o bolão de cada uma, e como terminaram
					os últimos jogos.
				</p>
			</div>
			<MatchesBoard />
		</div>
	);
}
