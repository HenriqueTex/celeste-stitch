import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { LeaderboardRow } from "@/lib/types";
export default function TopPredictors({ rows }: { rows: LeaderboardRow[] }) {
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
				<ol className="ranking-preview">
					{rows.slice(0, 3).map((row) => (
						<li key={row.userId}>
							<span className="rank-number">
								{row.rank.toString().padStart(2, "0")}
							</span>
							<span className="rank-person">
								<strong>{row.name}</strong>
								<small>
									{row.exactHits}{" "}
									{row.exactHits === 1 ? "placar exato" : "placares exatos"}
								</small>
							</span>
							<span className="rank-points">
								{row.points}
								<small>pontos</small>
							</span>
						</li>
					))}
				</ol>
			) : (
				<p className="empty-inline">
					O ranking aparece após a apuração das primeiras partidas.
				</p>
			)}
		</section>
	);
}
