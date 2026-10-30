"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
	Clock3,
	Copy,
	RefreshCw,
	CircleX,
	PencilLine,
	Share2,
	UserRoundPlus,
} from "lucide-react";
import Constellation from "@/components/Constellation";
import { copyText } from "@/lib/utils";
import { apiFetch, ApiError } from "@/lib/api";
import { formatCurrency, formatScore, plural } from "@/lib/format";
import { useAuth } from "@/components/AuthContext";
import type { BetOrderResponse, PaymentStatusResponse } from "@/lib/types";

export function openRegistration(values: Record<string, string>) {
	window.dispatchEvent(
		new CustomEvent("celeste:open-auth", {
			detail: { view: "register", values },
		}),
	);
}

export default function PaymentStep({
	order,
	open,
	onChange,
	onClose,
	onNewOrder,
	canStartNew,
}: {
	order: BetOrderResponse;
	open: boolean;
	onChange: (order: BetOrderResponse) => void;
	onClose: () => void;
	onNewOrder: (keepLines: boolean) => void;
	canStartNew: boolean;
}) {
	const { user, token } = useAuth();
	const accountOrder = user && order.bets.some((bet) => bet.userId === user.id);
	const [checking, setChecking] = useState(false);
	const [error, setError] = useState("");
	const [announcement, setAnnouncement] = useState("");
	const [copied, setCopied] = useState(false);
	const [confirmingCancel, setConfirmingCancel] = useState(false);
	const [cancelling, setCancelling] = useState(false);
	const lock = useRef(false);
	const latest = useRef({ order, onChange });
	useEffect(() => {
		latest.current = { order, onChange };
	}, [order, onChange]);
	const check = useCallback(async () => {
		if (lock.current) return;
		lock.current = true;
		setChecking(true);
		try {
			const current = latest.current;
			const result = await apiFetch<PaymentStatusResponse>(
				`/payments/${current.order.payment.id}/status`,
			);
			setError("");
			if (result.status !== current.order.payment.status) {
				current.onChange({
					...current.order,
					payment: { ...current.order.payment, ...result },
				});
				if (result.status === "confirmed")
					window.dispatchEvent(new Event("celeste:payment-confirmed"));
			}
		} catch {
			setError(
				"Ainda não foi possível verificar o pagamento. Seu pedido continua salvo.",
			);
		} finally {
			lock.current = false;
			setChecking(false);
		}
	}, []);
	useEffect(() => {
		if (!open || order.payment.status !== "pending") return;
		const first = setTimeout(() => void check(), 0);
		const interval = setInterval(() => void check(), 5000);
		return () => {
			clearTimeout(first);
			clearInterval(interval);
		};
	}, [open, order.payment.id, order.payment.status, check]);
	const confirmed = order.payment.status === "confirmed";
	const pending = order.payment.status === "pending";
	const pixCode = order.payment.pixCode?.startsWith("000201")
		? order.payment.pixCode
		: null;
	const qrCode = order.payment.pixQrCodeBase64;
	const canCancel =
		pending && (Boolean(order.cancelToken) || Boolean(accountOrder && token));
	const { homeTeam, awayTeam } = order.match;
	const snapshot = order.bets[0]?.snapshot;
	const copyPix = async () => {
		if (!pixCode) return;
		try {
			await copyText(pixCode);
			setCopied(true);
			setAnnouncement("Código PIX copiado.");
			setError("");
		} catch {
			setError(
				"Não foi possível copiar. Selecione o código e copie manualmente.",
			);
		}
	};
	const cancelOrder = async () => {
		if (cancelling) return;
		setCancelling(true);
		setError("");
		try {
			const id = order.payment.id;
			const result = order.cancelToken
				? await apiFetch<PaymentStatusResponse>(`/payments/${id}/cancel`, {
						method: "POST",
						body: JSON.stringify({ token: order.cancelToken }),
					})
				: await apiFetch<PaymentStatusResponse>(
						`/account/payments/${id}/cancel`,
						{ method: "POST", token },
					);
			onChange({ ...order, payment: { ...order.payment, ...result } });
			setAnnouncement("Pedido cancelado.");
			window.dispatchEvent(new Event("celeste:payment-cancelled"));
		} catch (reason) {
			setError(
				reason instanceof Error
					? reason.message
					: "Não foi possível cancelar agora. O pedido continua ativo.",
			);
			if (reason instanceof ApiError && reason.status === 409) void check();
		} finally {
			setConfirmingCancel(false);
			setCancelling(false);
		}
	};
	const share = async () => {
		const scores = order.bets
			.map((bet) =>
				formatScore(bet.homeScorePrediction, bet.awayScorePrediction),
			)
			.join(", ");
		const text = `Meu palpite no Bolão Celeste: ${homeTeam} ${scores} ${awayTeam}.`;
		try {
			if (navigator.share) {
				await navigator.share({ text, url: window.location.origin });
				return;
			}
			await copyText(`${text} ${window.location.origin}`);
			setAnnouncement("Palpite copiado para compartilhar.");
		} catch (reason) {
			if (reason instanceof DOMException && reason.name === "AbortError")
				return;
			setAnnouncement("Não foi possível compartilhar agora.");
		}
	};
	return (
		<div className="payment-step">
			<p className="sr-only" aria-live="polite">
				{announcement}
			</p>
			{confirmed ? (
				<div className="payment-confirmed" role="status">
					<Constellation className="confirmed-stars" lit />
					<h3>Você está no bolão</h3>
					<p>Pagamento confirmado. Agora é torcer.</p>
					<ul className="confirmed-scores">
						{order.bets.map((bet) => (
							<li key={bet.id}>
								<span className="confirmed-team">{homeTeam}</span>
								<strong>
									{formatScore(
										bet.homeScorePrediction,
										bet.awayScorePrediction,
									)}
								</strong>
								<span className="confirmed-team">{awayTeam}</span>
								<small>{plural(bet.tickets, "bilhete", "bilhetes")}</small>
							</li>
						))}
					</ul>
					<button
						type="button"
						className="client-button-secondary"
						onClick={() => void share()}
					>
						<Share2 size={16} aria-hidden="true" />
						Compartilhar meu palpite
					</button>
				</div>
			) : (
				<div
					className={`payment-status ${pending ? "is-pending" : "is-cancelled"}`}
					role="status"
				>
					{pending ? (
						<Clock3 size={30} aria-hidden="true" />
					) : (
						<CircleX size={30} aria-hidden="true" />
					)}
					<h3>{pending ? "Aguardando pagamento" : "Pedido cancelado"}</h3>
					<p>
						{pending
							? "Seu palpite entra no bolão assim que o pagamento for confirmado."
							: "O código PIX deste pedido não funciona mais e nenhum valor será cobrado."}
					</p>
				</div>
			)}
			<div className="payment-amount">
				<span>Pedido #{order.payment.id}</span>
				<strong>{formatCurrency(order.payment.amount)}</strong>
			</div>
			{!pending && !confirmed && canStartNew && (
				<button
					type="button"
					className="client-button-primary"
					onClick={() => onNewOrder(true)}
				>
					<PencilLine size={17} aria-hidden="true" />
					Corrigir placar e fazer novo pedido
				</button>
			)}
			{pending &&
				(pixCode ? (
					<div className="pix-payment">
						{qrCode && (
							<div className="pix-desktop">
								{/* eslint-disable-next-line @next/next/no-img-element */}
								<img
									className="pix-qr"
									src={`data:image/png;base64,${qrCode}`}
									alt="QR Code para pagamento PIX"
									width={208}
									height={208}
								/>
								<ol className="pix-instructions">
									<li>
										<span>Abra o app do seu banco no celular.</span>
									</li>
									<li>
										<span>
											Escolha <strong>Pagar com PIX</strong> e depois{" "}
											<strong>Ler QR Code</strong>.
										</span>
									</li>
									<li>
										<span>
											Aponte a câmera para o código e confirme{" "}
											{formatCurrency(order.payment.amount)}.
										</span>
									</li>
								</ol>
								<button
									type="button"
									className="text-link"
									onClick={() => void copyPix()}
								>
									<Copy size={15} aria-hidden="true" />
									{copied
										? "Código copiado"
										: "Prefere copiar? Copiar código PIX"}
								</button>
							</div>
						)}
						<div className={`pix-mobile${qrCode ? "" : " is-only"}`}>
							<ol className="pix-instructions">
								<li>
									<span>
										Toque em <strong>Copiar código PIX</strong>.
									</span>
								</li>
								<li>
									<span>
										No app do banco, escolha <strong>PIX Copia e Cola</strong> e
										cole o código.
									</span>
								</li>
							</ol>
							<label className="sr-only" htmlFor="pix-code">
								Código PIX copia e cola
							</label>
							<textarea
								id="pix-code"
								readOnly
								value={pixCode}
								rows={2}
								className="pix-code"
								onFocus={(event) => event.target.select()}
							/>
							<button
								type="button"
								className="client-button-primary"
								onClick={() => void copyPix()}
							>
								<Copy size={17} aria-hidden="true" />
								{copied ? "Código copiado" : "Copiar código PIX"}
							</button>
						</div>
						<p className="small-text muted">
							{order.payment.method === "pix_mercadopago"
								? "A confirmação é automática. O pedido fica salvo neste navegador e esta tela se atualiza quando o pagamento for identificado."
								: "O pagamento será conferido manualmente pela equipe do bolão. O pedido fica salvo neste navegador enquanto isso."}
						</p>
					</div>
				) : (
					<p className="notice">
						Este pedido não possui um código PIX disponível. Nenhum pagamento
						pode ser feito por esta tela. Você pode consultar o status abaixo.
					</p>
				))}
			{!confirmed && (
				<div className="order-summary">
					<h4>
						{homeTeam} × {awayTeam}
					</h4>
					{order.bets.map((bet) => (
						<div key={bet.id}>
							<span>
								{formatScore(bet.homeScorePrediction, bet.awayScorePrediction)}
							</span>
							<span>
								{plural(bet.tickets, "bilhete", "bilhetes")} ×{" "}
								{formatCurrency(bet.ticketPrice)}
							</span>
						</div>
					))}
				</div>
			)}
			{error && (
				<p role="alert" className="form-error">
					{error}
				</p>
			)}
			{pending && (
				<button
					type="button"
					className="client-button-secondary"
					disabled={checking}
					onClick={() => void check()}
				>
					<RefreshCw size={16} aria-hidden="true" />
					{checking ? "Consultando…" : "Consultar pagamento"}
				</button>
			)}
			{canCancel &&
				(confirmingCancel ? (
					<div className="cancel-confirm" role="group" aria-label="Cancelar pedido">
						<p>
							<strong>Cancelar o pedido #{order.payment.id}?</strong>
							<span>
								O código PIX deixa de funcionar. Seu placar fica salvo para você
								corrigir e fazer um novo pedido.
							</span>
						</p>
						<div className="cancel-actions">
							<button
								type="button"
								className="client-button-secondary"
								disabled={cancelling}
								onClick={() => setConfirmingCancel(false)}
							>
								Manter pedido
							</button>
							<button
								type="button"
								className="client-button-danger"
								disabled={cancelling}
								onClick={() => void cancelOrder()}
							>
								{cancelling ? "Cancelando…" : "Sim, cancelar"}
							</button>
						</div>
					</div>
				) : (
					<button
						type="button"
						className="text-link danger-link"
						onClick={() => setConfirmingCancel(true)}
					>
						Errou o placar? Cancelar este pedido
					</button>
				))}
			{accountOrder ? (
				<div className="payment-links">
					<Link href="/my-bets" className="text-link" onClick={onClose}>
						Ver meus palpites
					</Link>
					{confirmed && (
						<Link href="/leaderboard" className="text-link" onClick={onClose}>
							Ver ranking
						</Link>
					)}
				</div>
			) : (
				!user &&
				confirmed && (
					<div className="account-offer">
						<p>
							<strong>Quer entrar no ranking nos próximos jogos?</strong>
							<span>
								Este pedido foi feito sem conta e não soma pontos. Com uma
								conta, seus próximos palpites contam no ranking e ficam no seu
								histórico.
							</span>
						</p>
						<button
							type="button"
							className="client-button-secondary"
							onClick={() => {
								onClose();
								openRegistration({
									name: snapshot?.name ?? "",
									email: snapshot?.email ?? "",
									cpf: snapshot?.cpf ?? "",
									phone: snapshot?.phone ?? "",
									pixKey: snapshot?.pixKey ?? "",
								});
							}}
						>
							<UserRoundPlus size={16} aria-hidden="true" />
							Criar conta com estes dados
						</button>
					</div>
				)
			)}
			{confirmed && canStartNew && (
				<button
					type="button"
					className="text-link"
					onClick={() => onNewOrder(false)}
				>
					Fazer outro palpite nesta partida
				</button>
			)}
		</div>
	);
}
