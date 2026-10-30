"use client";
import { useState } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import ExpandableRow from "@/components/ExpandableRow";
import { useResource } from "@/hooks/use-resource";
import { formatScore, formatShortDate, plural } from "@/lib/format";
import type { MatchItem } from "@/lib/types";

function MatchDetails({ match }: { match: MatchItem }) {
	const { stats, result } = match;
	if (match.status === "cancelled")
		return <p className="muted">Partida cancelada. Os palpites não foram apurados.</p>;
	if (!result) return <p className="muted">O resultado ainda não foi registrado.</p>;
	const winners = stats.winners;
	return (
		<dl className="detail-grid">
			<div>
				<dt>Palpites confirmados</dt>
				<dd>
					{plural(stats.tickets, "bilhete", "bilhetes")}
					<small>{plural(stats.participants, "participante", "participantes")}</small>
				</dd>
			</div>
			<div>
				<dt>Cravaram o placar</dt>
				<dd>
					{winners && winners.participants > 0 ? (
						<>
							{plural(winners.participants, "torcedor", "torcedores")}
							<small>{plural(winners.tickets, "bilhete vencedor", "bilhetes vencedores")}</small>
						</>
					) : (
						<>
							Ninguém
							<small>nenhum bilhete com {formatScore(result.homeScore, result.awayScore)}</small>
						</>
					)}
				</dd>
			</div>
			{stats.consensus && (
				<div>
					<dt>Placar mais escolhido</dt>
					<dd>
						{formatScore(stats.consensus.homeScore, stats.consensus.awayScore)}
						<small>
							{plural(stats.consensus.tickets, "bilhete", "bilhetes")}
						</small>
					</dd>
				</div>
			)}
		</dl>
	);
}

export default function MatchHistory({
	compact = false,
}: {
	compact?: boolean;
}) {
	const { data, loading, error, reload } =
		useResource<MatchItem[]>("/matches/history");
	const [openId, setOpenId] = useState<number | null>(null);
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
				<ul className="expand-list">
					{matches.map((match) => (
						<ExpandableRow
							key={match.id}
							open={openId === match.id}
							onToggle={() =>
								setOpenId((current) => (current === match.id ? null : match.id))
							}
							summary={
								<>
									<span className="row-main">
										<strong>
											{match.homeTeam} <span aria-hidden="true">×</span>
											<span className="sr-only">contra</span> {match.awayTeam}
										</strong>
										<small>
											{formatShortDate(match.scheduledAt)} · {match.competition}
										</small>
									</span>
									<span className="row-value">
										{match.status === "cancelled"
											? "Cancelado"
											: match.result
												? formatScore(
														match.result.homeScore,
														match.result.awayScore,
													)
												: "A apurar"}
									</span>
								</>
							}
						>
							<MatchDetails match={match} />
						</ExpandableRow>
					))}
				</ul>
			)}
		</section>
	);
}
