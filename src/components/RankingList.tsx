"use client";
import { useState } from "react";
import ExpandableRow from "@/components/ExpandableRow";
import { apiFetch } from "@/lib/api";
import { formatScore, formatShortDate, plural } from "@/lib/format";
import type { ExactHit, LeaderboardRow } from "@/lib/types";

type HitsState = { status: "loading" } | { status: "error" } | { status: "done"; hits: ExactHit[] };

function ExactHits({
	state,
	name,
	onRetry,
}: {
	state?: HitsState;
	name: string;
	onRetry: () => void;
}) {
	if (!state || state.status === "loading")
		return (
			<p className="muted" role="status">
				Carregando placares cravados…
			</p>
		);
	if (state.status === "error")
		return (
			<p className="muted">
				Não foi possível carregar.{" "}
				<button type="button" className="text-link" onClick={onRetry}>
					Tentar novamente
				</button>
			</p>
		);
	if (!state.hits.length)
		return <p className="muted">{name} ainda não cravou nenhum placar.</p>;
	return (
		<>
			<p className="detail-title">Placares cravados</p>
			<ul className="hit-list">
				{state.hits.map((hit) => (
					<li key={hit.matchId}>
						<span>
							{hit.homeTeam} × {hit.awayTeam}
							<small>
								{formatShortDate(hit.scheduledAt)} · {hit.competition}
							</small>
						</span>
						<strong>{formatScore(hit.homeScore, hit.awayScore)}</strong>
					</li>
				))}
			</ul>
		</>
	);
}

export default function RankingList({
	rows,
	mineId,
}: {
	rows: LeaderboardRow[];
	mineId?: number;
}) {
	const [openId, setOpenId] = useState<number | null>(null);
	const [hits, setHits] = useState<Record<number, HitsState>>({});
	const load = (userId: number) => {
		setHits((current) => ({ ...current, [userId]: { status: "loading" } }));
		apiFetch<ExactHit[]>(`/leaderboard/${userId}/exact-hits`)
			.then((list) =>
				setHits((current) => ({
					...current,
					[userId]: { status: "done", hits: list },
				})),
			)
			.catch(() =>
				setHits((current) => ({ ...current, [userId]: { status: "error" } })),
			);
	};
	const toggle = (userId: number) => {
		const opening = openId !== userId;
		setOpenId(opening ? userId : null);
		if (opening && (!hits[userId] || hits[userId].status === "error"))
			load(userId);
	};
	return (
		<ol className="expand-list ranking-list">
			{rows.map((row) => {
				const mine = row.userId === mineId;
				return (
					<ExpandableRow
						key={row.userId}
						open={openId === row.userId}
						onToggle={() => toggle(row.userId)}
						className={mine ? "is-mine" : undefined}
						summary={
							<>
								<span className="rank-number">
									{row.rank.toString().padStart(2, "0")}
								</span>
								<span className="row-main">
									<strong>
										{row.name}
										{mine && <span className="you-tag">você</span>}
									</strong>
									<small>
										{plural(row.exactHits, "placar exato", "placares exatos")}
									</small>
								</span>
								<span className="row-value">
									{row.points.toLocaleString("pt-BR")}
									<small>pontos</small>
								</span>
							</>
						}
					>
						<ExactHits
							state={hits[row.userId]}
							name={row.name}
							onRetry={() => load(row.userId)}
						/>
					</ExpandableRow>
				);
			})}
		</ol>
	);
}
