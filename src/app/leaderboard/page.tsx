import type { Metadata } from "next";
import Leaderboard from "@/components/Leaderboard";

export const metadata: Metadata = {
	title: "Ranking - Bolão Celeste",
	description:
		"Veja quem está no topo. Os melhores palpiteiros da comunidade cruzeirense.",
};

export default function LeaderboardPage() {
	return (
		<div className="max-w-4xl mx-auto">
			<Leaderboard />
		</div>
	);
}
