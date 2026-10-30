"use client";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { useAuth } from "@/components/AuthContext";
import RankingList from "@/components/RankingList";
import type { LeaderboardRow } from "@/lib/types";
export default function TopPredictors({ rows }: { rows: LeaderboardRow[] }) {
	const { user } = useAuth();
	return (
		<section className="support-panel" aria-labelledby="ranking-heading">
			<div className="section-heading">
				<h2 id="ranking-heading">Ranking da comunidade</h2>
				<Link className="text-link" href="/leaderboard">
					Ver ranking
					<ArrowUpRight size={15} aria-hidden="true" />
				</Link>
			</div>
			{rows.length ? (
				<RankingList rows={rows.slice(0, 3)} mineId={user?.id} />
			) : (
				<p className="empty-inline">
					O ranking aparece após a apuração das primeiras partidas.
				</p>
			)}
		</section>
	);
}
