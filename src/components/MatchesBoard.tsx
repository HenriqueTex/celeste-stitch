"use client";
import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { ArrowRight, CalendarClock, Clock3, Trophy } from "lucide-react";
import TeamBadge from "@/components/TeamBadge";
import { useBetting } from "@/components/BettingContext";
import { acceptsPicks, predictionState } from "@/components/MatchPrediction";
import { useResource } from "@/hooks/use-resource";
import {
	formatCountdown,
	formatCurrency,
	formatDayMonth,
	formatMatchDate,
	formatScore,
	formatTime,
	formatWeekdayDate,
	plural,
} from "@/lib/format";
import type { MatchItem } from "@/lib/types";

type View = "upcoming" | "results";
const HISTORY_HASH = "#historico";

function FixtureCard({
	match,
	featured,
	now,
}: {
	match: MatchItem;
	featured: boolean;
	now: number;
}) {
	const { orderFor, linesFor, openCheckout } = useBetting();
	const order = orderFor(match.id);
	const state = predictionState(order, linesFor(match.id)[0]);
	const open = acceptsPicks(match, now);
	return (
		<li className={`fixture-card${featured ? " is-featured" : ""}`}>
			<div className="fixture-top">
				<span className="match-competition">
					<Trophy size={16} aria-hidden="true" />
					{match.competition}
				</span>
				<span className={open ? "status-open" : "status-pending"}>
					{open ? "Palpites abertos" : "Palpites encerrados"}
				</span>
			</div>
			<p className="fixture-when">
				<strong>{formatCountdown(match.scheduledAt, now)}</strong>
				<time dateTime={match.scheduledAt}>
					{formatWeekdayDate(match.scheduledAt)} · {formatTime(match.scheduledAt)}
				</time>
			</p>
			<div className="fixture-teams">
				<span className="fixture-team">
					<TeamBadge name={match.homeTeam} src={match.homeTeamLogoUrl} small={!featured} />
					<strong>{match.homeTeam}</strong>
				</span>
				<span className="fixture-versus" aria-hidden="true">
					×
				</span>
				<span className="fixture-team">
					<TeamBadge name={match.awayTeam} src={match.awayTeamLogoUrl} small={!featured} />
					<strong>{match.awayTeam}</strong>
				</span>
			</div>
			<dl className="fixture-stats">
				<div>
					<dt>Bolão</dt>
					<dd>{formatCurrency(match.stats.revenue)}</dd>
				</div>
				<div>
					<dt>Bilhetes</dt>
					<dd>{match.stats.tickets}</dd>
				</div>
				<div>
					<dt>Participantes</dt>
					<dd>{match.stats.participants}</dd>
				</div>
			</dl>
			<div className="fixture-footer">
				<small className="prediction-chip" data-tone={state.tone}>
					{state.label}
				</small>
				{order ? (
					<button
						type="button"
						className="client-button-secondary"
						onClick={() => openCheckout(match, order)}
					>
						Ver meu pedido
					</button>
				) : (
					open && (
						<button
							type="button"
							className="client-button-primary"
							onClick={() => openCheckout(match)}
						>
							Fazer palpite
							<ArrowRight size={17} aria-hidden="true" />
						</button>
					)
				)}
			</div>
			{open && (
				<p className="fixture-deadline">
					<Clock3 size={14} aria-hidden="true" />
					Palpites até {formatMatchDate(match.bettingDeadlineAt)}
				</p>
			)}
		</li>
	);
}

function ResultRow({ match }: { match: MatchItem }) {
	const { day, month } = formatDayMonth(match.scheduledAt);
	const { result, stats } = match;
	const cancelled = match.status === "cancelled";
	const winners = stats.winners;
	return (
		<li className="result-row">
			<span className="result-date" aria-hidden="true">
				<strong>{day}</strong>
				{month}
			</span>
			<div className="result-main">
				<p className="result-teams">
					<span>{match.homeTeam}</span>
					<strong className={`result-score${result && !cancelled ? "" : " is-pending"}`}>
						{cancelled ? "Cancelado" : result ? formatScore(result.homeScore, result.awayScore) : "A apurar"}
					</strong>
					<span>{match.awayTeam}</span>
				</p>
				<p className="result-meta">
					<time dateTime={match.scheduledAt}>{formatMatchDate(match.scheduledAt)}</time>
					{" · "}
					{match.competition}
				</p>
				<ul className="result-facts">
					{cancelled ? (
						<li>Partida cancelada. Os palpites não foram apurados.</li>
					) : !result ? (
						<li>O resultado ainda não foi registrado.</li>
					) : (
						<>
							<li data-tone={winners && winners.participants > 0 ? "hit" : undefined}>
								{winners && winners.participants > 0
									? `${plural(winners.participants, "torcedor cravou", "torcedores cravaram")} · ${plural(winners.tickets, "bilhete vencedor", "bilhetes vencedores")}`
									: "Ninguém cravou o placar"}
							</li>
							{stats.consensus && (
								<li>
									Mais escolhido{" "}
									{formatScore(stats.consensus.homeScore, stats.consensus.awayScore)}
								</li>
							)}
							<li>{plural(stats.tickets, "bilhete confirmado", "bilhetes confirmados")}</li>
						</>
					)}
				</ul>
			</div>
		</li>
	);
}

function Retry({ message, onRetry }: { message: string; onRetry: () => void }) {
	return (
		<div className="client-panel error-panel" role="alert">
			<p>{message}</p>
			<button type="button" className="client-button-secondary" onClick={onRetry}>
				Tentar novamente
			</button>
		</div>
	);
}

export default function MatchesBoard() {
	const active = useResource<MatchItem[]>("/matches/active");
	const history = useResource<MatchItem[]>("/matches/history");
	const [view, setView] = useState<View>("upcoming");
	const [now, setNow] = useState(() => Date.now());
	const tabs = useRef<Record<View, HTMLButtonElement | null>>({
		upcoming: null,
		results: null,
	});

	useEffect(() => {
		const frame = requestAnimationFrame(() => {
			if (window.location.hash === HISTORY_HASH) setView("results");
		});
		const timer = setInterval(() => setNow(Date.now()), 60_000);
		return () => {
			cancelAnimationFrame(frame);
			clearInterval(timer);
		};
	}, []);

	const select = (next: View, focus = false) => {
		setView(next);
		window.history.replaceState(
			null,
			"",
			next === "results" ? HISTORY_HASH : window.location.pathname,
		);
		if (focus) tabs.current[next]?.focus();
	};
	const onTabKey = (event: KeyboardEvent) => {
		if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
		event.preventDefault();
		const next =
			event.key === "Home"
				? "upcoming"
				: event.key === "End"
					? "results"
					: view === "upcoming"
						? "results"
						: "upcoming";
		select(next, true);
	};

	const upcoming = (active.data ?? [])
		.filter((match) => new Date(match.scheduledAt).getTime() > now)
		.sort((a, b) => a.scheduledAt.localeCompare(b.scheduledAt));
	const results = history.data ?? [];
	const views: { id: View; label: string; count?: number }[] = [
		{ id: "upcoming", label: "Próximos jogos", count: active.data ? upcoming.length : undefined },
		{ id: "results", label: "Resultados", count: history.data ? results.length : undefined },
	];

	return (
		<>
			<div className="view-tabs" role="tablist" aria-label="Jogos" onKeyDown={onTabKey}>
				{views.map((tab) => (
					<button
						key={tab.id}
						ref={(node) => {
							tabs.current[tab.id] = node;
						}}
						id={`tab-${tab.id}`}
						type="button"
						role="tab"
						aria-selected={view === tab.id}
						aria-controls={`panel-${tab.id}`}
						tabIndex={view === tab.id ? 0 : -1}
						onClick={() => select(tab.id)}
					>
						{tab.label}
						{tab.count !== undefined && <span className="view-tab-count">{tab.count}</span>}
					</button>
				))}
			</div>

			<section
				id="panel-upcoming"
				role="tabpanel"
				aria-labelledby="tab-upcoming"
				hidden={view !== "upcoming"}
			>
				{active.loading ? (
					<div className="client-panel" role="status">
						Carregando os próximos jogos…
					</div>
				) : active.error ? (
					<Retry message="Não foi possível carregar os próximos jogos." onRetry={active.reload} />
				) : upcoming.length ? (
					<ul className="fixture-grid">
						{upcoming.map((match, index) => (
							<FixtureCard key={match.id} match={match} featured={index === 0} now={now} />
						))}
					</ul>
				) : (
					<div className="client-panel empty-panel">
						<CalendarClock size={28} aria-hidden="true" />
						<h2>A próxima partida vem aí</h2>
						<p>Assim que um novo jogo for publicado, ele aparece aqui.</p>
						<button type="button" className="text-link" onClick={() => select("results")}>
							Ver resultados anteriores
						</button>
					</div>
				)}
			</section>

			<section
				id="panel-results"
				role="tabpanel"
				aria-labelledby="tab-results"
				hidden={view !== "results"}
			>
				{history.loading ? (
					<div className="client-panel" role="status">
						Carregando resultados…
					</div>
				) : history.error ? (
					<Retry message="Não foi possível carregar os resultados." onRetry={history.reload} />
				) : results.length ? (
					<ol className="client-panel result-list">
						{results.map((match) => (
							<ResultRow key={match.id} match={match} />
						))}
					</ol>
				) : (
					<div className="client-panel empty-panel">
						<CalendarClock size={28} aria-hidden="true" />
						<h2>Nenhum resultado ainda</h2>
						<p>Os resultados aparecem após a apuração das partidas.</p>
					</div>
				)}
			</section>
		</>
	);
}
