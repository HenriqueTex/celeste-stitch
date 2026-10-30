"use client";
import { Fragment, useEffect, useState } from "react";
import { ArrowRight, Clock3 } from "lucide-react";
import ActivePool from "@/components/ActivePool";
import ScorePicker, { validScore } from "@/components/ScorePicker";
import TeamBadge from "@/components/TeamBadge";
import { useBetting } from "@/components/BettingContext";
import { focusScorePicker } from "@/components/MobileNav";
import { useResource } from "@/hooks/use-resource";
import {
	formatCurrency,
	formatMatchDate,
	formatScore,
	isClubTeam,
	plural,
} from "@/lib/format";
import type { HomeResponse, MatchItem } from "@/lib/types";

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
				const order = orderFor(item.id);
				const draft = linesFor(item.id)[0];
				const touched = draft.id !== "first" || draft.home !== 0 || draft.away !== 0;
				return (
					<button
						key={item.id}
						type="button"
						aria-pressed={item.id === selected.id}
						onClick={() => onSelect(item.id)}
					>
						<strong>
							{item.homeTeam} × {item.awayTeam}
						</strong>
						<span>
							{formatMatchDate(item.scheduledAt)}
							<span className="chooser-competition"> · {item.competition}</span>
						</span>
						<small>
							{order
								? order.payment.status === "confirmed"
									? "Palpite confirmado"
									: "Pedido aguardando pagamento"
								: touched && validScore(draft.home) && validScore(draft.away)
									? `Rascunho ${formatScore(Number(draft.home), Number(draft.away))}`
									: "Sem palpite"}
						</small>
					</button>
				);
			})}
		</div>
	);
}

export function MatchWorkspace({
	matches,
	distribution,
	alwaysShowChooser = false,
}: {
	matches: MatchItem[];
	distribution?: HomeResponse["poolDistribution"];
	alwaysShowChooser?: boolean;
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
	const isOpen =
		match.status === "open" &&
		new Date(match.scheduledAt).getTime() > now &&
		new Date(match.bettingDeadlineAt).getTime() > now;
	const choices = available.some((item) => item.id === match.id)
		? available
		: [match, ...available];
	const showChooser = alwaysShowChooser || choices.length > 1;
	const totalTickets = order
		? order.bets.reduce((sum, bet) => sum + bet.tickets, 0)
		: lines.reduce((sum, line) => sum + line.tickets, 0);
	const scoreCount = order ? order.bets.length : lines.length;
	const valid = lines.every(
		(line) => validScore(line.home) && validScore(line.away),
	);
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
					<span>{match.competition}</span>
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
					{order && (
						<p className="score-instruction">
							Seu pedido está salvo neste navegador.
						</p>
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
				<div className="deadline-note">
					<Clock3 size={15} aria-hidden="true" />
					<span>
						Palpites até {formatMatchDate(match.bettingDeadlineAt)}, horário de
						Brasília.
						<small>
							Cada bilhete custa {formatCurrency(match.ticketPrice)} e vale após
							a confirmação do pagamento.
						</small>
					</span>
				</div>
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
export default function MatchPrediction() {
	const { data, loading, error, reload } =
		useResource<MatchItem[]>("/matches/active");
	if (loading) return <LoadingMatch />;
	if (error)
		return (
			<div className="client-panel error-panel" role="alert">
				<p>Não foi possível carregar as partidas.</p>
				<button className="client-button-secondary" onClick={reload}>
					Tentar novamente
				</button>
			</div>
		);
	return <MatchWorkspace matches={data ?? []} alwaysShowChooser />;
}
