"use client";
import { useEffect, useState } from "react";
import { ArrowRight, Clock3, ChevronDown } from "lucide-react";
import ActivePool from "@/components/ActivePool";
import ScorePicker, { validScore } from "@/components/ScorePicker";
import TeamBadge from "@/components/TeamBadge";
import { useBetting } from "@/components/BettingContext";
import { useResource } from "@/hooks/use-resource";
import { formatCurrency, formatMatchDate } from "@/lib/format";
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
	const first = lines[0];
	const isOpen =
		match.status === "open" &&
		new Date(match.scheduledAt).getTime() > now &&
		new Date(match.bettingDeadlineAt).getTime() > now;
	const choices = available.some((item) => item.id === match.id)
		? available
		: [match, ...available];
	const order = orderFor(match.id);
	const totalTickets = lines.reduce((sum, line) => sum + line.tickets, 0);
	const valid = lines.every(
		(line) => validScore(line.home) && validScore(line.away),
	);
	return (
		<div className="match-workspace">
			<section id="palpite" className="prediction-panel" aria-label="Escolha seu placar">
				<div className="match-meta">
					<span>{match.competition}</span>
					<span className={isOpen ? "status-open" : "status-pending"}>
						{isOpen ? "Palpites abertos" : "Palpites encerrados"}
					</span>
				</div>
				<div className="match-date-row">
					<time dateTime={match.scheduledAt}>
						{formatMatchDate(match.scheduledAt)}
					</time>
					{choices.length > 1 && (
						<label className="match-switch">
							<span className="sr-only">Trocar partida</span>
							<select
								value={match.id}
								onChange={(event) => setSelectedId(Number(event.target.value))}
							>
								{choices.map((item) => (
									<option key={item.id} value={item.id}>
										{item.homeTeam} × {item.awayTeam} ·{" "}
										{formatMatchDate(item.scheduledAt)}
									</option>
								))}
							</select>
							<span aria-hidden="true">
								Trocar partida <ChevronDown size={14} />
							</span>
						</label>
					)}
				</div>
				<form
					onSubmit={(event) => {
						event.preventDefault();
						if (order || (valid && isOpen)) openCheckout(match);
					}}
				>
					<div className="score-board">
						<div className="score-team">
							<div className="team-identity">
								<TeamBadge name={match.homeTeam} src={match.homeTeamLogoUrl} />
								<h2>{match.homeTeam}</h2>
							</div>
							<ScorePicker
								team={match.homeTeam}
								value={first.home}
								disabled={!isOpen || Boolean(order)}
								onChange={(home) =>
									updateLines(
										match.id,
										lines.map((line, index) =>
											index === 0 ? { ...line, home } : line,
										),
									)
								}
							/>
						</div>
						<span className="score-separator" aria-hidden="true">
							×
						</span>
						<div className="score-team">
							<div className="team-identity">
								<TeamBadge name={match.awayTeam} src={match.awayTeamLogoUrl} />
								<h2>{match.awayTeam}</h2>
							</div>
							<ScorePicker
								team={match.awayTeam}
								value={first.away}
								disabled={!isOpen || Boolean(order)}
								onChange={(away) =>
									updateLines(
										match.id,
										lines.map((line, index) =>
											index === 0 ? { ...line, away } : line,
										),
									)
								}
							/>
						</div>
					</div>
					<p className="score-instruction">
						{order
							? "Seu pedido está salvo nesta sessão."
							: "Ajuste os gols de cada time."}
					</p>
					<div className="prediction-review">
						<p aria-live="polite">
							{order ? (
								"Acompanhe seu pedido"
							) : valid ? (
								<>
									Seu palpite:{" "}
									<strong>
										{match.homeTeam} {first.home} × {first.away}{" "}
										{match.awayTeam}
									</strong>
								</>
							) : (
								"Preencha os gols dos dois times, de 0 a 20."
							)}
						</p>
						<div className="prediction-total">
							<span>
								{totalTickets} {totalTickets === 1 ? "bilhete" : "bilhetes"}
								{lines.length > 1 ? ` · ${lines.length} placares` : ""}
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
						Palpites até {formatMatchDate(match.bettingDeadlineAt)}
						<small>
							Horário de Brasília · Válido após a confirmação do pagamento.
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
	return <MatchWorkspace matches={data ?? []} />;
}
