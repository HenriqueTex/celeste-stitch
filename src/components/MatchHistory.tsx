"use client";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { useResource } from "@/hooks/use-resource";
import { formatShortDate } from "@/lib/format";
import type { MatchItem } from "@/lib/types";
export default function MatchHistory({
	compact = false,
}: {
	compact?: boolean;
}) {
	const { data, loading, error, reload } =
		useResource<MatchItem[]>("/matches/history");
	const matches = compact ? data?.slice(0, 3) : data;
	return (
		<section
			id="historico"
			className="support-panel"
			aria-labelledby="history-heading"
		>
			<div className="section-heading">
				<h2 id="history-heading">Últimos resultados</h2>
				{compact && (
					<Link className="text-link" href="/matches#historico">
						Ver histórico
						<ArrowUpRight size={15} aria-hidden="true" />
					</Link>
				)}
			</div>
			{loading ? (
				<p className="empty-inline" role="status">
					Carregando resultados…
				</p>
			) : error ? (
				<div className="empty-inline">
					<p>Não foi possível carregar os resultados.</p>
					<button onClick={reload} className="text-link">
						Tentar novamente
					</button>
				</div>
			) : !matches?.length ? (
				<p className="empty-inline">
					Os resultados aparecem após a apuração das partidas.
				</p>
			) : (
				<ul className="history-list">
					{matches.map((match) => (
						<li key={match.id}>
							<div>
								<span>{formatShortDate(match.scheduledAt)}</span>
								<strong>
									{match.homeTeam} <span>×</span> {match.awayTeam}
								</strong>
							</div>
							<span className="history-score">
								{match.status === "cancelled"
									? "Cancelado"
									: match.result
										? `${match.result.homeScore} – ${match.result.awayScore}`
										: "A apurar"}
							</span>
						</li>
					))}
				</ul>
			)}
		</section>
	);
}
