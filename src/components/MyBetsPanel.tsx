"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, Ticket } from "lucide-react";
import AuthModal from "@/components/AuthModal";
import { useAuth } from "@/components/AuthContext";
import { useBetting } from "@/components/BettingContext";
import { apiFetch } from "@/lib/api";
import {
	formatCurrency,
	formatMatchDate,
	formatScore,
	plural,
} from "@/lib/format";
import type { BetItem, BetOrderResponse } from "@/lib/types";

const paymentLabels: Record<string, { label: string; tone: string }> = {
	pending: { label: "Aguardando pagamento", tone: "is-pending" },
	confirmed: { label: "Pago", tone: "is-confirmed" },
	cancelled: { label: "Cancelado", tone: "is-cancelled" },
};
const resultLabels = {
	exact: { label: "Placar exato", tone: "is-confirmed" },
	partial: { label: "Acertou o resultado", tone: "is-partial" },
	miss: { label: "Não pontuou", tone: "is-muted" },
};

function isOpenFor(order: BetOrderResponse) {
	return (
		order.match.status === "open" &&
		new Date(order.match.bettingDeadlineAt).getTime() > Date.now()
	);
}

function groupOrders(bets: BetItem[]) {
	const groups = new Map<string, BetOrderResponse>();
	for (const bet of bets) {
		const key = bet.paymentId ? `p${bet.paymentId}` : `b${bet.id}`;
		const group = groups.get(key);
		if (group) group.bets.push(bet);
		else if (bet.payment)
			groups.set(key, { match: bet.match, payment: bet.payment, bets: [bet] });
	}
	return [...groups.values()];
}

function OrderCard({
	order,
	onOpen,
}: {
	order: BetOrderResponse;
	onOpen: (order: BetOrderResponse) => void;
}) {
	const status = paymentLabels[order.payment.status] ?? paymentLabels.cancelled;
	const pending = order.payment.status === "pending";
	const canPay = pending && isOpenFor(order);
	return (
		<li className="order-card" data-tone={status.tone}>
			<div className="order-card-heading">
				<div>
					<h3>
						{order.match.homeTeam} × {order.match.awayTeam}
					</h3>
					<p>
						{order.match.competition} · {formatMatchDate(order.match.scheduledAt)}
					</p>
				</div>
				<span className={`status-badge ${status.tone}`}>{status.label}</span>
			</div>
			<ul className="order-bets">
				{order.bets.map((bet) => {
					const result = bet.resultStatus ? resultLabels[bet.resultStatus] : null;
					return (
						<li key={bet.id}>
							<strong className="bet-score">
								{formatScore(bet.homeScorePrediction, bet.awayScorePrediction)}
							</strong>
							<span className="muted">
								{plural(bet.tickets, "bilhete", "bilhetes")}
							</span>
							{result ? (
								<span className={`result-badge ${result.tone}`}>
									{result.label}
									{bet.points > 0 && ` · +${bet.points} pts`}
								</span>
							) : (
								order.payment.status === "confirmed" && (
									<span className="result-badge is-muted">Aguardando o jogo</span>
								)
							)}
						</li>
					);
				})}
			</ul>
			<div className="order-card-footer">
				<span>
					Pedido #{order.payment.id} ·{" "}
					<strong>{formatCurrency(order.payment.amount)}</strong>
				</span>
				{canPay ? (
					<button
						type="button"
						className="client-button-primary"
						onClick={() => onOpen(order)}
					>
						Pagar agora
						<ArrowRight size={16} aria-hidden="true" />
					</button>
				) : (
					<button
						type="button"
						className="text-link"
						onClick={() => onOpen(order)}
					>
						Ver pedido
					</button>
				)}
			</div>
		</li>
	);
}

function OrderSection({
	title,
	orders,
	onOpen,
}: {
	title: string;
	orders: BetOrderResponse[];
	onOpen: (order: BetOrderResponse) => void;
}) {
	if (!orders.length) return null;
	return (
		<section className="order-section" aria-label={title}>
			<div className="section-heading">
				<h2>{title}</h2>
				<span className="muted small-text">
					{plural(orders.length, "pedido", "pedidos")}
				</span>
			</div>
			<ul className="order-list">
				{orders.map((order) => (
					<OrderCard key={order.payment.id} order={order} onOpen={onOpen} />
				))}
			</ul>
		</section>
	);
}

export default function MyBetsPanel() {
	const { isLoggedIn, isLoading, token } = useAuth();
	const { openCheckout, savedOrders } = useBetting();
	const [bets, setBets] = useState<BetItem[] | null>(null);
	const [error, setError] = useState("");
	const [authModalOpen, setAuthModalOpen] = useState(false);
	const guestOrders = savedOrders.filter((order) =>
		order.bets.every((bet) => !bet.userId),
	);
	const open = (order: BetOrderResponse) => openCheckout(order.match, order);

	useEffect(() => {
		if (!token) return;
		let cancelled = false;
		const load = () =>
			void apiFetch<BetItem[]>("/account/bets", { token })
				.then((items) => {
					if (cancelled) return;
					setBets(items);
					setError("");
				})
				.catch((reason) => {
					if (cancelled) return;
					setBets([]);
					setError(
						reason instanceof Error
							? reason.message
							: "Não foi possível carregar seus palpites.",
					);
				});
		load();
		window.addEventListener("celeste:payment-confirmed", load);
		window.addEventListener("celeste:payment-cancelled", load);
		return () => {
			cancelled = true;
			window.removeEventListener("celeste:payment-confirmed", load);
			window.removeEventListener("celeste:payment-cancelled", load);
		};
	}, [token]);

	const { toPay, upcoming, settled, cancelledOrders, stats } = useMemo(() => {
		const orders = groupOrders(bets ?? []);
		const settledOrders = orders.filter((order) =>
			order.bets.some((bet) => bet.resultStatus),
		);
		return {
			toPay: orders.filter((order) => order.payment.status === "pending"),
			upcoming: orders.filter(
				(order) =>
					order.payment.status === "confirmed" &&
					!settledOrders.includes(order),
			),
			settled: settledOrders,
			cancelledOrders: orders.filter(
				(order) =>
					order.payment.status !== "pending" &&
					order.payment.status !== "confirmed" &&
					!settledOrders.includes(order),
			),
			stats: {
				points: (bets ?? []).reduce((sum, bet) => sum + bet.points, 0),
				exact: (bets ?? []).filter((bet) => bet.resultStatus === "exact")
					.length,
				settled: (bets ?? []).filter((bet) => bet.resultStatus).length,
			},
		};
	}, [bets]);

	const intro = (
		<div className="page-intro">
			<h1>Meus palpites</h1>
			<p>Acompanhe pagamentos, resultados e os pontos de cada placar.</p>
		</div>
	);

	if (!isLoggedIn) {
		return (
			<div className="home-dashboard narrow-page">
				{intro}
				{isLoading ? (
					<div className="client-panel" role="status">
						Carregando…
					</div>
				) : (
					<section className="client-panel empty-panel">
						<Ticket size={28} aria-hidden="true" />
						<h2>Entre para ver seu histórico</h2>
						<p>
							Com sua conta você acompanha pagamentos, resultados e sua posição
							no ranking.
						</p>
						<button
							type="button"
							className="client-button-primary"
							onClick={() => setAuthModalOpen(true)}
						>
							Entrar na minha conta
						</button>
					</section>
				)}
				<OrderSection
					title="Pedidos sem conta neste navegador"
					orders={guestOrders}
					onOpen={open}
				/>
				<AuthModal
					open={authModalOpen}
					initialView="login"
					onClose={() => setAuthModalOpen(false)}
				/>
			</div>
		);
	}

	return (
		<div className="home-dashboard narrow-page">
			{intro}
			<dl className="ranking-summary">
				<div>
					<dt>Pontos</dt>
					<dd>{stats.points.toLocaleString("pt-BR")}</dd>
				</div>
				<div>
					<dt>Placares exatos</dt>
					<dd>{stats.exact}</dd>
				</div>
				<div>
					<dt>Palpites apurados</dt>
					<dd>{stats.settled}</dd>
				</div>
			</dl>
			{error && (
				<p className="form-error" role="alert">
					{error}
				</p>
			)}
			{bets === null ? (
				<div className="client-panel" role="status">
					Carregando seus palpites…
				</div>
			) : bets.length === 0 && !error ? (
				<section className="client-panel empty-panel">
					<Ticket size={28} aria-hidden="true" />
					<h2>Nenhum palpite ainda</h2>
					<p>Escolha o placar do próximo jogo do Cruzeiro para começar.</p>
					<Link href="/#palpite" className="client-button-primary">
						Fazer meu palpite
					</Link>
				</section>
			) : (
				<>
					<OrderSection title="Para pagar" orders={toPay} onOpen={open} />
					<OrderSection title="Próximos jogos" orders={upcoming} onOpen={open} />
					<OrderSection title="Resultados" orders={settled} onOpen={open} />
					<OrderSection
						title="Cancelados"
						orders={cancelledOrders}
						onOpen={open}
					/>
				</>
			)}
			<OrderSection
				title="Pedidos sem conta neste navegador"
				orders={guestOrders}
				onOpen={open}
			/>
		</div>
	);
}
