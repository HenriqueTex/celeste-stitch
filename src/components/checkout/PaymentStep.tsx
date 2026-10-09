"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { CheckCircle2, Clock3, Copy, RefreshCw, CircleX } from "lucide-react";
import { apiFetch } from "@/lib/api";
import { formatCurrency } from "@/lib/format";
import { useAuth } from "@/components/AuthContext";
import type { BetOrderResponse, PaymentStatusResponse } from "@/lib/types";

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
	onNewOrder: () => void;
	canStartNew: boolean;
}) {
	const { user } = useAuth();
	const accountOrder = user && order.bets.some((bet) => bet.userId === user.id);
	const [checking, setChecking] = useState(false);
	const [error, setError] = useState("");
	const [copied, setCopied] = useState(false);
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
	return (
		<div className="payment-step">
			<div
				className={`payment-status ${confirmed ? "is-confirmed" : pending ? "is-pending" : "is-cancelled"}`}
				role="status"
			>
				{confirmed ? (
					<CheckCircle2 size={30} aria-hidden="true" />
				) : pending ? (
					<Clock3 size={30} aria-hidden="true" />
				) : (
					<CircleX size={30} aria-hidden="true" />
				)}
				<h3>
					{confirmed
						? "Palpite confirmado"
						: pending
							? "Aguardando confirmação"
							: "Pagamento cancelado"}
				</h3>
				<p>
					{confirmed
						? "Pagamento confirmado. Seu palpite está participando."
						: pending
							? "Seu palpite participa após a confirmação do pagamento."
							: "Este pedido não está participando do bolão."}
				</p>
			</div>
			<div className="payment-amount">
				<span>Pedido #{order.payment.id}</span>
				<strong>{formatCurrency(order.payment.amount)}</strong>
			</div>
			{pending &&
				(pixCode ? (
					<div className="pix-payment">
						{order.payment.pixQrCodeBase64 && (
							// eslint-disable-next-line @next/next/no-img-element
							<img
								className="pix-qr"
								src={`data:image/png;base64,${order.payment.pixQrCodeBase64}`}
								alt="QR Code para pagamento PIX"
								width={180}
								height={180}
							/>
						)}
						<p className="muted">
							Copie o código e pague no aplicativo do seu banco.
						</p>
						<label className="sr-only" htmlFor="pix-code">
							Código PIX
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
							className="client-button-primary"
							onClick={async () => {
								try {
									await navigator.clipboard.writeText(pixCode);
									setCopied(true);
									setError("");
								} catch {
									setError(
										"Não foi possível copiar. Selecione o código acima e copie manualmente.",
									);
								}
							}}
						>
							<Copy size={17} aria-hidden="true" />
							{copied ? "Código copiado" : "Copiar código PIX"}
						</button>
						<p className="small-text muted">
							{order.payment.method === "pix_mercadopago"
								? "A confirmação é automática. Esta tela será atualizada quando o pagamento for identificado."
								: "O pagamento será conferido manualmente pela equipe do bolão."}
						</p>
					</div>
				) : (
					<p className="notice">
						Este pedido não possui um código PIX disponível. Nenhum pagamento
						pode ser feito por esta tela. Você pode consultar o status abaixo.
					</p>
				))}
			<div className="order-summary">
				<h4>
					{order.match.homeTeam} × {order.match.awayTeam}
				</h4>
				{order.bets.map((bet) => (
					<div key={bet.id}>
						<span>
							{bet.homeScorePrediction} × {bet.awayScorePrediction}
						</span>
						<span>
							{bet.tickets} {bet.tickets === 1 ? "bilhete" : "bilhetes"}
						</span>
					</div>
				))}
			</div>
			{error && (
				<p role="alert" className="form-error">
					{error}
				</p>
			)}
			{pending && (
				<button
					className="client-button-secondary"
					disabled={checking}
					onClick={() => void check()}
				>
					<RefreshCw size={16} aria-hidden="true" />
					{checking ? "Consultando…" : "Consultar pagamento"}
				</button>
			)}
			{accountOrder ? (
				<Link href="/my-bets" className="text-link" onClick={onClose}>
					Ver meus palpites
				</Link>
			) : (
				<p className="small-text muted">
					Este pedido foi feito sem conta. Guarde este resumo; ele permanece
					disponível enquanto esta sessão estiver aberta.
				</p>
			)}
			{!pending && canStartNew && (
				<button className="text-link" onClick={onNewOrder}>
					Fazer outro palpite nesta partida
				</button>
			)}
		</div>
	);
}
