"use client";
import { Fragment, useEffect, useState } from "react";
import { ArrowRight, ChevronRight, Clock3, Trophy } from "lucide-react";
import ActivePool from "@/components/ActivePool";
import ScorePicker, {
	allowedPick,
	scoreBounds,
	validScore,
} from "@/components/ScorePicker";
import TeamBadge from "@/components/TeamBadge";
import { useBetting } from "@/components/BettingContext";
import {
	formatCurrency,
	formatMatchDate,
	formatScore,
	isClubTeam,
	plural,
} from "@/lib/format";
import type { BetOrderResponse, HomeResponse, MatchItem } from "@/lib/types";
import type { PredictionLine } from "@/components/BettingContext";

function focusScorePicker() {
	const panel = document.getElementById("palpite");
	if (!panel) return false;
	panel.scrollIntoView({ behavior: "smooth", block: "start" });
	panel
		.querySelector<HTMLInputElement>(".score-value:not(:disabled)")
		?.focus({ preventScroll: true });
	return true;
}

export type PredictionTone = "empty" | "draft" | "pending" | "confirmed";

/** Open for picks: published, not started and before the betting deadline. */
export function acceptsPicks(match: MatchItem, now = Date.now()) {
	return (
		match.status === "open" &&
		new Date(match.scheduledAt).getTime() > now &&
		new Date(match.bettingDeadlineAt).getTime() > now
	);
}

/** What the visitor has done for a match: nothing, a draft, or an order. */
export function predictionState(
	order: BetOrderResponse | undefined,
	draft: PredictionLine,
): { tone: PredictionTone; label: string } {
	if (order)
		return order.payment.status === "confirmed"
			? { tone: "confirmed", label: "Palpite confirmado" }
			: { tone: "pending", label: "Pedido aguardando pagamento" };
	const touched = draft.id !== "first" || draft.home !== 0 || draft.away !== 0;
	if (touched && validScore(draft.home) && validScore(draft.away))
		return {
			tone: "draft",
			label: `Rascunho ${formatScore(Number(draft.home), Number(draft.away))}`,
		};
	return { tone: "empty", label: "Sem palpite" };
}

export function LoadingMatch() {
	return (
		<div className="client-panel match-skeleton" role="status">
			<span className="sr-only">Carregando partidas…</span>
			<div className="skeleton-line" />
			<div className="skeleton-teams">
				<span />
				<span />
			</div>
			<div className="skeleton-line" />
			<div className="skeleton-button" />
		</div>
	);
}

function MatchChooser({
	choices,
	selected,
	onSelect,
}: {
	choices: MatchItem[];
	selected: MatchItem;
	onSelect: (id: number) => void;
}) {
	const { orderFor, linesFor } = useBetting();
	return (
		<div className="match-chooser" role="group" aria-label="Escolha a partida">
			{choices.map((item) => {
				const state = predictionState(orderFor(item.id), linesFor(item.id)[0]);
				return (
					<button
						key={item.id}
						type="button"
						aria-pressed={item.id === selected.id}
						title={`${item.homeTeam} × ${item.awayTeam} · ${item.competition}`}
						onClick={() => onSelect(item.id)}
					>
						<strong>
							{item.homeTeam} × {item.awayTeam}
						</strong>
						<span className="chooser-when">
							{formatMatchDate(item.scheduledAt)}
							<span className="chooser-competition"> · {item.competition}</span>
						</span>
						<small data-tone={state.tone}>{state.label}</small>
						<ChevronRight className="chooser-chevron" size={18} aria-hidden="true" />
					</button>
				);
			})}
		</div>
	);
}

export function MatchWorkspace({
	matches,
	distribution,
}: {
	matches: MatchItem[];
	distribution?: HomeResponse["poolDistribution"];
}) {
	const [selectedId, setSelectedId] = useState<number | null>(() => {
		const time = Date.now();
		const upcoming = matches.filter(
			(item) => new Date(item.scheduledAt).getTime() > time,
		);
		return (
			(
				upcoming.find(
					(item) =>
						item.status === "open" &&
						new Date(item.bettingDeadlineAt).getTime() > time,
				) ?? upcoming[0]
			)?.id ?? null
		);
	});
	const [now, setNow] = useState(() => Date.now());
	const { linesFor, updateLines, openCheckout, orderFor, setActiveMatch } =
		useBetting();
	useEffect(() => {
		const interval = setInterval(() => setNow(Date.now()), 1000);
		return () => clearInterval(interval);
	}, []);
	useEffect(() => {
		if (window.location.hash !== "#palpite") return;
		const frame = requestAnimationFrame(() => focusScorePicker());
		return () => cancelAnimationFrame(frame);
	}, []);
	const available = matches.filter(
		(item) => new Date(item.scheduledAt).getTime() > now,
	);
	const match =
		matches.find((item) => item.id === selectedId) ??
		available.find(
			(item) =>
				item.status === "open" &&
				new Date(item.bettingDeadlineAt).getTime() > now,
		) ??
		available[0];
	useEffect(() => {
		setActiveMatch(match ?? null);
	}, [match, setActiveMatch]);
	if (!match)
		return (
			<section className="client-panel empty-panel">
				<Clock3 size={28} aria-hidden="true" />
				<h2>A próxima partida vem aí</h2>
				<p>
					Assim que um novo jogo for publicado, você poderá escolher seu placar
					aqui.
				</p>
			</section>
		);
	const lines = linesFor(match.id);
	const order = orderFor(match.id);
	const first = order?.bets[0]
		? {
				home: order.bets[0].homeScorePrediction,
				away: order.bets[0].awayScorePrediction,
			}
		: lines[0];
	const isOpen = acceptsPicks(match, now);
	const choices = available.some((item) => item.id === match.id)
		? available
		: [match, ...available];
	const showChooser = choices.length > 1;
	const totalTickets = order
		? order.bets.reduce((sum, bet) => sum + bet.tickets, 0)
		: lines.reduce((sum, line) => sum + line.tickets, 0);
	const scoreCount = order ? order.bets.length : lines.length;
	const valid = lines.every((line) => allowedPick(match, line.home, line.away));
	const clubMatch = isClubTeam(match.homeTeam) || isClubTeam(match.awayTeam);
	const teams = [
		{ side: "home" as const, name: match.homeTeam, logo: match.homeTeamLogoUrl },
		{ side: "away" as const, name: match.awayTeam, logo: match.awayTeamLogoUrl },
	];
	return (
		<div className="match-workspace">
			<section
				id="palpite"
				className="prediction-panel"
				aria-label="Escolha seu placar"
			>
				{showChooser && (
					<MatchChooser
						choices={choices}
						selected={match}
						onSelect={setSelectedId}
					/>
				)}
				<div className="match-meta">
					<span className="match-competition">
						<Trophy size={16} aria-hidden="true" />
						{match.competition}
					</span>
					<span className={isOpen ? "status-open" : "status-pending"}>
						{isOpen ? "Palpites abertos" : "Palpites encerrados"}
					</span>
				</div>
				{!showChooser && (
					<time className="match-date" dateTime={match.scheduledAt}>
						{formatMatchDate(match.scheduledAt)}
					</time>
				)}
				<form
					onSubmit={(event) => {
						event.preventDefault();
						if (order || (valid && isOpen)) openCheckout(match);
					}}
				>
					<div className="score-board">
						{teams.map((team, index) => (
							<Fragment key={team.side}>
								{index === 1 && (
									<span className="score-separator" aria-hidden="true">
										×
									</span>
								)}
								<div className="score-team">
									<div className="team-identity">
										<TeamBadge name={team.name} src={team.logo} />
										<h2>{team.name}</h2>
									</div>
									<ScorePicker
										team={team.name}
										club={isClubTeam(team.name)}
										value={team.side === "home" ? first.home : first.away}
										{...scoreBounds(
											match,
											team.side,
											team.side === "home" ? first.away : first.home,
										)}
										disabled={!isOpen || Boolean(order)}
										onChange={(score) =>
											updateLines(
												match.id,
												lines.map((line, lineIndex) =>
													lineIndex === 0
														? { ...line, [team.side]: score }
														: line,
												),
											)
										}
									/>
								</div>
							</Fragment>
						))}
					</div>
					{order ? (
						<p className="score-instruction">
							Seu pedido está salvo neste navegador.
						</p>
					) : (
						clubMatch && (
							<p className="score-instruction">
								Vale vitória do Cruzeiro ou empate.
							</p>
						)
					)}
					<div className="prediction-review">
						<p aria-live="polite">
							{order ? (
								"Acompanhe seu pedido"
							) : valid ? (
								<>
									Seu palpite:{" "}
									<strong>
										{match.homeTeam} {formatScore(Number(first.home), Number(first.away))}{" "}
										{match.awayTeam}
									</strong>
								</>
							) : validScore(first.home) && validScore(first.away) ? (
								"Só vale vitória do Cruzeiro ou empate."
							) : (
								"Preencha os gols dos dois times, de 0 a 20."
							)}
						</p>
						<div className="prediction-total">
							<span>
								{plural(totalTickets, "bilhete", "bilhetes")}
								{scoreCount > 1 ? ` · ${scoreCount} placares` : ""}
							</span>
							<strong>
								{formatCurrency(
									order?.payment.amount ?? totalTickets * match.ticketPrice,
								)}
							</strong>
						</div>
						<button
							type="submit"
							className="client-button-primary"
							disabled={!order && (!isOpen || !valid)}
						>
							{order
								? "Ver meu pedido"
								: isOpen
									? "Revisar palpite"
									: "Palpites encerrados"}
							<ArrowRight size={18} aria-hidden="true" />
						</button>
					</div>
				</form>
				<p className="deadline-note">
					Palpites até {formatMatchDate(match.bettingDeadlineAt)}, horário de
					Brasília.
				</p>
				{match.paymentAvailable === false && !order && (
					<p className="payment-unavailable">
						Pagamentos indisponíveis no momento. Você pode preparar seu placar.
					</p>
				)}
			</section>
			<ActivePool match={match} distribution={distribution} />
		</div>
	);
}
