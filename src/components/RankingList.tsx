"use client";
import { useId, useState } from "react";
import { ChevronRight, X } from "lucide-react";
import { useModalAccessibility } from "@/hooks/use-modal-accessibility";
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
		<ul className="hit-list">
			{state.hits.map((hit) => (
				<li key={hit.matchId}>
					<span>
						{hit.homeTeam} × {hit.awayTeam}
						<small>
							{formatShortDate(hit.scheduledAt)} · {hit.competition}
						</small>
					</span>
					<div className="hit-result">
						<strong>{formatScore(hit.homeScore, hit.awayScore)}</strong>
						{hit.points > 0 && <small>+{hit.points} pts</small>}
					</div>
				</li>
			))}
		</ul>
	);
}

function RankingDetail({
	row,
	mine,
	state,
	onRetry,
	onClose,
}: {
	row: LeaderboardRow;
	mine: boolean;
	state?: HitsState;
	onRetry: () => void;
	onClose: () => void;
}) {
	const titleId = useId();
	const dialogRef = useModalAccessibility(true, onClose);
	return (
		<div className="client-modal-backdrop" onClick={onClose}>
			<div
				ref={dialogRef}
				role="dialog"
				aria-modal="true"
				aria-labelledby={titleId}
				tabIndex={-1}
				className="client-dialog ranking-dialog"
				onClick={(event) => event.stopPropagation()}
			>
				<header className="client-dialog-header">
					<div>
						<p className="ranking-dialog-rank">
							{row.rank}º no ranking
							{mine && <span className="you-tag">você</span>}
						</p>
						<h2 id={titleId}>{row.name}</h2>
					</div>
					<button
						type="button"
						className="icon-button"
						onClick={onClose}
						aria-label="Fechar"
					>
						<X size={20} aria-hidden="true" />
					</button>
				</header>
				<dl className="ranking-dialog-stats">
					<div>
						<dt>Pontos</dt>
						<dd>{row.points.toLocaleString("pt-BR")}</dd>
					</div>
					<div>
						<dt>Placares exatos</dt>
						<dd>{row.exactHits}</dd>
					</div>
				</dl>
				<div className="client-dialog-body ranking-dialog-body">
					<h3 className="detail-title">Placares cravados</h3>
					<ExactHits state={state} name={row.name} onRetry={onRetry} />
				</div>
			</div>
		</div>
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
	const open = (userId: number) => {
		setOpenId(userId);
		if (!hits[userId] || hits[userId].status === "error") load(userId);
	};
	const selected = rows.find((row) => row.userId === openId);
	return (
		<>
			<ol className="expand-list ranking-list">
				{rows.map((row) => {
					const mine = row.userId === mineId;
					return (
						<li key={row.userId} className={`expand-item${mine ? " is-mine" : ""}`}>
							<button
								type="button"
								className="expand-row"
								aria-haspopup="dialog"
								onClick={() => open(row.userId)}
							>
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
								<ChevronRight className="expand-chevron" size={18} aria-hidden="true" />
							</button>
						</li>
					);
				})}
			</ol>
			{selected && (
				<RankingDetail
					row={selected}
					mine={selected.userId === mineId}
					state={hits[selected.userId]}
					onRetry={() => load(selected.userId)}
					onClose={() => setOpenId(null)}
				/>
			)}
		</>
	);
}
