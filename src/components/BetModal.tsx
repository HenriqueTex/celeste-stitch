"use client";
import { useEffect, useId, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Minus, Plus, Trash2, X } from "lucide-react";
import ScorePicker, { validScore } from "@/components/ScorePicker";
import { useModalAccessibility } from "@/hooks/use-modal-accessibility";
import { useAuth } from "@/components/AuthContext";
import IdentificationStep, {
	type GuestData,
	type IdentityMode,
} from "@/components/checkout/IdentificationStep";
import PaymentStep from "@/components/checkout/PaymentStep";
import type { PredictionLine } from "@/components/BettingContext";
import { apiFetch, ApiError } from "@/lib/api";
import { formatCurrency, formatMatchDate, isClubTeam } from "@/lib/format";
import type { BetOrderResponse, MatchItem } from "@/lib/types";

interface Props {
	uncertain: boolean;
	onUncertain: () => void;
	open: boolean;
	onClose: () => void;
	match: MatchItem;
	onMatchChange: (match: MatchItem) => void;
	lines: PredictionLine[];
	onLinesChange: (lines: PredictionLine[]) => void;
	order?: BetOrderResponse;
	onOrderChange: (order: BetOrderResponse) => void;
	onNewOrder: (keepLines: boolean) => void;
}
export default function BetModal({
	open,
	onClose,
	match,
	onMatchChange,
	lines,
	onLinesChange,
	order,
	onOrderChange,
	onNewOrder,
	uncertain,
	onUncertain,
}: Props) {
	const { user, token, logout } = useAuth();
	const [step, setStep] = useState<"review" | "identity">("review");
	const [mode, setMode] = useState<IdentityMode>("choice");
	const [busy, setBusy] = useState(false);
	const [error, setError] = useState("");
	const [now, setNow] = useState(() => Date.now());
	const submitLock = useRef(false);
	const headingRef = useRef<HTMLHeadingElement>(null);
	const bodyRef = useRef<HTMLDivElement>(null);
	const titleId = useId();
	const close = () => {
		if (!busy) onClose();
	};
	const dialogRef = useModalAccessibility(open, close);
	const stage = order ? 2 : step === "identity" ? 1 : 0;
	useEffect(() => {
		if (!open) return;
		const frame = requestAnimationFrame(() => {
			bodyRef.current?.scrollTo({ top: 0 });
			headingRef.current?.focus();
		});
		return () => cancelAnimationFrame(frame);
	}, [open, stage, mode]);
	useEffect(() => {
		if (!open) return;
		const timer = setInterval(() => setNow(Date.now()), 1000);
		return () => clearInterval(timer);
	}, [open]);
	const tickets = lines.reduce((sum, line) => sum + line.tickets, 0);
	const total = tickets * match.ticketPrice;
	const valid =
		lines.length > 0 &&
		lines.length <= 20 &&
		lines.every(
			(line) =>
				validScore(line.home) &&
				validScore(line.away) &&
				line.tickets >= 1 &&
				line.tickets <= 50,
		);
	const isOpen =
		match.status === "open" &&
		new Date(match.bettingDeadlineAt).getTime() > now;
	const effectiveMode = user ? "account" : mode === "account" ? "choice" : mode;
	const updateLine = (id: string, patch: Partial<PredictionLine>) =>
		onLinesChange(
			lines.map((line) => (line.id === id ? { ...line, ...patch } : line)),
		);
	const changeStep = (next: "review" | "identity") => {
		setError("");
		setStep(next);
	};

	async function placeOrder(guest?: GuestData) {
		if (submitLock.current || uncertain || !valid) return;
		submitLock.current = true;
		setBusy(true);
		setError("");
		let posted = false;
		try {
			const current = await apiFetch<MatchItem>(`/matches/${match.id}`);
			onMatchChange(current);
			if (
				current.status !== "open" ||
				new Date(current.bettingDeadlineAt).getTime() <= Date.now()
			)
				throw new Error(
					"O prazo desta partida terminou. Seu placar foi preservado.",
				);
			if (current.ticketPrice !== match.ticketPrice) {
				setStep("review");
				throw new Error(
					"O preço do bilhete mudou. Confira o novo total antes de continuar.",
				);
			}
			if (current.paymentAvailable === false)
				throw new Error(
					"O pagamento está indisponível no momento. Seu placar foi preservado.",
				);
			posted = true;
			const response = await apiFetch<BetOrderResponse>(
				guest ? "/bets/guest" : "/bets",
				{
					method: "POST",
					token: guest ? undefined : token,
					body: JSON.stringify({
						matchId: current.id,
						predictions: lines.map((line) => ({
							homeScorePrediction: line.home,
							awayScorePrediction: line.away,
							tickets: line.tickets,
						})),
						...guest,
					}),
				},
			);
			onOrderChange(response);
		} catch (reason) {
			if (
				reason instanceof ApiError &&
				(reason.status === 401 || reason.status === 403)
			) {
				await logout();
				setMode("login");
				setError(
					"Sua sessão expirou. Entre novamente para continuar com o mesmo palpite.",
				);
			} else if (
				posted &&
				reason instanceof ApiError &&
				(reason.status === 0 || reason.status >= 500)
			) {
				onUncertain();
				setError(
					"Não foi possível verificar se o pedido foi criado. Evite gerar outro pedido agora. Se você tem conta, confira Meus palpites.",
				);
			} else
				setError(
					reason instanceof Error
						? reason.message
						: "Não foi possível continuar.",
				);
		} finally {
			submitLock.current = false;
			setBusy(false);
		}
	}
	if (!open) return null;
	return (
		<div className="checkout-backdrop" onClick={close}>
			<div
				className="checkout-panel"
				ref={dialogRef}
				role="dialog"
				aria-modal="true"
				aria-labelledby={titleId}
				tabIndex={-1}
				onClick={(event) => event.stopPropagation()}
			>
				<header className="checkout-header">
					<div>
						<h2 id={titleId} ref={headingRef} tabIndex={-1}>
							{match.homeTeam} × {match.awayTeam}
						</h2>
						<p className="small-text muted">
							{formatMatchDate(match.scheduledAt)} · Horário de Brasília
						</p>
					</div>
					<button
						className="icon-button"
						onClick={close}
						disabled={busy}
						aria-label="Fechar revisão"
					>
						<X size={21} aria-hidden="true" />
					</button>
				</header>
				<ol className="checkout-steps" aria-label="Etapas do palpite">
					{["Palpite", "Dados", "Pagamento"].map((label, index) => (
						<li
							key={label}
							aria-current={stage === index ? "step" : undefined}
							className={index < stage ? "step-complete" : ""}
						>
							<span>{index + 1}</span>
							{label}
						</li>
					))}
				</ol>
				<div className="checkout-body" ref={bodyRef}>
					{order ? (
						<PaymentStep
							key={order.payment.id}
							order={order}
							open={open}
							onChange={onOrderChange}
							onClose={close}
							canStartNew={isOpen}
							onNewOrder={(keepLines) => {
								onNewOrder(keepLines);
								setStep("review");
								setError("");
							}}
						/>
					) : (
						<>
							{step === "review" ? (
								<div className="prediction-lines">
									<h3>Confira seu placar</h3>
									<p className="muted">
										Cada bilhete repete este placar e custa{" "}
										{formatCurrency(match.ticketPrice)}.
									</p>
									{lines.map((line, index) => (
										<div className="prediction-line" key={line.id}>
											<div className="line-heading">
												<h4>Palpite {index + 1}</h4>
												{lines.length > 1 && (
													<button
														className="icon-button"
														aria-label={`Remover palpite ${index + 1}`}
														onClick={() =>
															onLinesChange(
																lines.filter((item) => item.id !== line.id),
															)
														}
													>
														<Trash2 size={17} aria-hidden="true" />
													</button>
												)}
											</div>
											<div className="checkout-scores">
												<div>
													<span>{match.homeTeam}</span>
													<ScorePicker
														team={match.homeTeam}
														club={isClubTeam(match.homeTeam)}
														value={line.home}
														onChange={(home) => updateLine(line.id, { home })}
													/>
												</div>
												<div>
													<span>{match.awayTeam}</span>
													<ScorePicker
														team={match.awayTeam}
														club={isClubTeam(match.awayTeam)}
														value={line.away}
														onChange={(away) => updateLine(line.id, { away })}
													/>
												</div>
											</div>
											<div className="line-tickets">
												<label htmlFor={`tickets-${line.id}`}>Bilhetes</label>
												<div className="ticket-control">
													<button
														className="icon-button"
														disabled={line.tickets <= 1}
														aria-label={`Diminuir bilhetes do palpite ${index + 1}`}
														onClick={() =>
															updateLine(line.id, { tickets: line.tickets - 1 })
														}
													>
														<Minus size={16} aria-hidden="true" />
													</button>
													<input
														id={`tickets-${line.id}`}
														type="number"
														inputMode="numeric"
														min={1}
														max={50}
														value={line.tickets}
														onChange={(event) => {
															const value = Number(event.target.value);
															if (
																Number.isInteger(value) &&
																value >= 1 &&
																value <= 50
															)
																updateLine(line.id, { tickets: value });
														}}
													/>
													<button
														className="icon-button"
														disabled={line.tickets >= 50}
														aria-label={`Aumentar bilhetes do palpite ${index + 1}`}
														onClick={() =>
															updateLine(line.id, { tickets: line.tickets + 1 })
														}
													>
														<Plus size={16} aria-hidden="true" />
													</button>
												</div>
												<strong>
													{formatCurrency(line.tickets * match.ticketPrice)}
												</strong>
											</div>
											{lines.some(
												(other) =>
													other.id !== line.id &&
													other.home === line.home &&
													other.away === line.away,
											) && (
												<p className="small-text muted">
													Este placar se repete. Você também pode concentrar os
													bilhetes em uma linha.
												</p>
											)}
										</div>
									))}
									<button
										className="client-button-secondary"
										disabled={lines.length >= 20}
										onClick={() =>
											onLinesChange([
												...lines,
												{
													id: crypto.randomUUID(),
													home: 0,
													away: 0,
													tickets: 1,
												},
											])
										}
									>
										<Plus size={17} aria-hidden="true" />
										{lines.length >= 20
											? "Limite de 20 placares"
											: "Adicionar outro placar"}
									</button>
									{!valid && (
										<p className="form-error">
											Preencha os gols dos dois times, de 0 a 20.
										</p>
									)}
								</div>
							) : (
								<IdentificationStep
									mode={effectiveMode}
									onModeChange={setMode}
									onReady={placeOrder}
									onBusy={setBusy}
									onError={setError}
								/>
							)}
							{!isOpen && (
								<p className="notice">
									O prazo para novos palpites nesta partida terminou.
								</p>
							)}
							{match.paymentAvailable === false && (
								<p className="notice">
									Os pagamentos estão temporariamente indisponíveis. Você pode
									preparar seu placar e voltar mais tarde.
								</p>
							)}
							{error && (
								<p className="form-error" role="alert">
									{error}
								</p>
							)}
							{uncertain && !error && (
								<p className="notice">
									Há um envio ainda não verificado nesta partida. Confira seus
									pedidos antes de tentar novamente.
								</p>
							)}
						</>
					)}
				</div>
				<footer className="checkout-footer">
					<div className="checkout-total">
						<span>
							{order
								? "Total do pedido"
								: `${tickets} ${tickets === 1 ? "bilhete" : "bilhetes"} · ${lines.length} ${lines.length === 1 ? "placar" : "placares"}`}
						</span>
						<strong>{formatCurrency(order?.payment.amount ?? total)}</strong>
					</div>
					{order ? (
						<button className="client-button-secondary" onClick={close}>
							Fechar resumo
						</button>
					) : (
						<div className="checkout-actions">
							{step === "identity" && (
								<button
									className="client-button-secondary"
									disabled={busy}
									onClick={() => changeStep("review")}
								>
									<ArrowLeft size={16} aria-hidden="true" />
									Voltar
								</button>
							)}
							{step === "review" ? (
								// Keys keep React from reusing this node as the submit
								// button below, which would submit the order on click.
								<button
									key="continue"
									type="button"
									className="client-button-primary"
									disabled={!valid || !isOpen || uncertain}
									onClick={() => changeStep("identity")}
								>
									Continuar
									<ArrowRight size={18} aria-hidden="true" />
								</button>
							) : (
								effectiveMode !== "choice" && (
									<button
										key="submit"
										type="submit"
										form="checkout-identity"
										className="client-button-primary"
										disabled={
											busy ||
											uncertain ||
											!isOpen ||
											(match.paymentAvailable === false &&
												effectiveMode !== "login" &&
												effectiveMode !== "register")
										}
									>
										{busy
											? "Aguarde…"
											: effectiveMode === "login"
												? "Entrar e continuar"
												: effectiveMode === "register"
													? "Criar conta e continuar"
													: `Gerar PIX de ${formatCurrency(total)}`}
									</button>
								)
							)}
						</div>
					)}
					{!order && (
						<p className="checkout-footnote">
							O palpite participa após a confirmação do pagamento.
						</p>
					)}
				</footer>
			</div>
		</div>
	);
}
