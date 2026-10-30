"use client";

import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useRef,
	useState,
	type ReactNode,
} from "react";
import { usePathname } from "next/navigation";
import { Clock3 } from "lucide-react";
import type {
	BetOrderResponse,
	MatchItem,
	PaymentStatusResponse,
} from "@/lib/types";
import type { Score } from "@/components/ScorePicker";
import { useAuth } from "@/components/AuthContext";
import BetModal from "@/components/BetModal";
import { createId } from "@/lib/utils";
import { apiFetch } from "@/lib/api";
import { formatCurrency, plural } from "@/lib/format";

export interface PredictionLine {
	id: string;
	home: Score;
	away: Score;
	tickets: number;
}
const initialLines: PredictionLine[] = [
	{ id: "first", home: 0, away: 0, tickets: 1 },
];
interface StoredOrder {
	order: BetOrderResponse;
	ownerId: number | null;
}
interface BettingState {
	linesFor: (id: number) => PredictionLine[];
	updateLines: (id: number, lines: PredictionLine[]) => void;
	openCheckout: (match: MatchItem, order?: BetOrderResponse) => void;
	orderFor: (id: number) => BetOrderResponse | undefined;
	savedOrders: BetOrderResponse[];
	activeMatch: MatchItem | null;
	setActiveMatch: (match: MatchItem | null) => void;
}
const BettingContext = createContext<BettingState | null>(null);
const ORDERS_KEY = "bolao_orders";
const ORDER_RETENTION = 7 * 24 * 60 * 60 * 1000;

function readStoredOrders() {
	try {
		const raw = localStorage.getItem(ORDERS_KEY);
		const parsed = raw ? (JSON.parse(raw) as Record<number, StoredOrder>) : {};
		const cutoff = Date.now() - ORDER_RETENTION;
		return Object.fromEntries(
			Object.entries(parsed).filter(
				([, entry]) =>
					new Date(entry.order.match.scheduledAt).getTime() > cutoff,
			),
		) as Record<number, StoredOrder>;
	} catch {
		return {};
	}
}

export function useBetting() {
	const context = useContext(BettingContext);
	if (!context) throw new Error("BettingProvider ausente");
	return context;
}

export function BettingProvider({ children }: { children: ReactNode }) {
	const { user } = useAuth();
	const pathname = usePathname();
	const [drafts, setDrafts] = useState<Record<number, PredictionLine[]>>({});
	const [orders, setOrders] = useState<Record<number, StoredOrder>>({});
	const [hydrated, setHydrated] = useState(false);
	const [uncertainMatches, setUncertainMatches] = useState<
		Record<number, boolean>
	>({});
	const [match, setMatch] = useState<MatchItem | null>(null);
	const [activeMatch, setActiveMatch] = useState<MatchItem | null>(null);
	const [open, setOpen] = useState(false);
	useEffect(() => {
		const timer = setTimeout(() => {
			setOrders(readStoredOrders());
			setHydrated(true);
		}, 0);
		return () => clearTimeout(timer);
	}, []);
	useEffect(() => {
		if (!hydrated) return;
		try {
			localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
		} catch {
			// Storage can be unavailable (private mode); the order stays in memory.
		}
	}, [orders, hydrated]);
	const visible = (entry?: StoredOrder) =>
		entry && (entry.ownerId === null || entry.ownerId === user?.id)
			? entry.order
			: undefined;
	// A cancelled order no longer locks the match; only the checkout still shows it.
	const orderFor = (id: number) => {
		const order = visible(orders[id]);
		return order?.payment.status === "cancelled" ? undefined : order;
	};
	const savedOrders = Object.values(orders)
		.map((entry) => visible(entry))
		.filter((order): order is BetOrderResponse => Boolean(order));
	const linesFor = (id: number) => drafts[id] ?? initialLines;
	const updateLines = (id: number, lines: PredictionLine[]) =>
		setDrafts((previous) => ({ ...previous, [id]: lines }));
	const saveOrder = useCallback(
		(order: BetOrderResponse) =>
			setOrders((previous) => ({
				...previous,
				[order.match.id]: {
					order,
					ownerId:
						previous[order.match.id]?.order.payment.id === order.payment.id
							? previous[order.match.id].ownerId
							: (user?.id ?? null),
				},
			})),
		[user?.id],
	);
	const openCheckout = (selected: MatchItem, order?: BetOrderResponse) => {
		if (!order && orders[selected.id]?.order.payment.status === "cancelled")
			setOrders((current) => {
				const next = { ...current };
				delete next[selected.id];
				return next;
			});
		if (order) {
			saveOrder(order);
			updateLines(
				selected.id,
				order.bets.map((bet) => ({
					id: String(bet.id),
					home: bet.homeScorePrediction,
					away: bet.awayScorePrediction,
					tickets: bet.tickets,
				})),
			);
			setUncertainMatches((previous) => ({
				...previous,
				[selected.id]: false,
			}));
		}
		setMatch(selected);
		setOpen(true);
	};

	return (
		<BettingContext.Provider
			value={{
				linesFor,
				updateLines,
				orderFor,
				savedOrders,
				activeMatch,
				setActiveMatch,
				openCheckout,
			}}
		>
			{children}
			{!open && pathname !== "/my-bets" && (
				<PendingOrderNotice
					orders={savedOrders.filter(
						(order) =>
							order.payment.status === "pending" &&
							// The prediction panel already shows this order.
							!(
								order.match.id === activeMatch?.id &&
								(pathname === "/" || pathname === "/matches")
							),
					)}
					onOpen={(order) => openCheckout(order.match, order)}
					onUpdate={saveOrder}
				/>
			)}
			{match && (
				<BetModal
					key={match.id}
					open={open}
					onClose={() => setOpen(false)}
					match={match}
					onMatchChange={setMatch}
					lines={linesFor(match.id)}
					onLinesChange={(lines) => updateLines(match.id, lines)}
					order={visible(orders[match.id])}
					onOrderChange={saveOrder}
					uncertain={Boolean(uncertainMatches[match.id])}
					onUncertain={() =>
						setUncertainMatches((previous) => ({
							...previous,
							[match.id]: true,
						}))
					}
					onUncertainResolved={() =>
						setUncertainMatches((previous) => ({
							...previous,
							[match.id]: false,
						}))
					}
					onNewOrder={(keepLines) => {
						const previous = visible(orders[match.id]);
						setOrders((current) => {
							const next = { ...current };
							delete next[match.id];
							return next;
						});
						updateLines(
							match.id,
							keepLines && previous
								? previous.bets.map((bet) => ({
										id: createId(),
										home: bet.homeScorePrediction,
										away: bet.awayScorePrediction,
										tickets: bet.tickets,
									}))
								: initialLines,
						);
					}}
				/>
			)}
		</BettingContext.Provider>
	);
}

function PendingOrderNotice({
	orders,
	onOpen,
	onUpdate,
}: {
	orders: BetOrderResponse[];
	onOpen: (order: BetOrderResponse) => void;
	onUpdate: (order: BetOrderResponse) => void;
}) {
	const latest = useRef({ orders, onUpdate });
	useEffect(() => {
		latest.current = { orders, onUpdate };
	}, [orders, onUpdate]);
	const ids = orders.map((order) => order.payment.id).join(",");
	useEffect(() => {
		if (!ids) return;
		const check = () => {
			if (document.hidden) return;
			for (const order of latest.current.orders)
				void apiFetch<PaymentStatusResponse>(
					`/payments/${order.payment.id}/status`,
				)
					.then((result) => {
						if (result.status === order.payment.status) return;
						latest.current.onUpdate({
							...order,
							payment: { ...order.payment, ...result },
						});
						if (result.status === "confirmed")
							window.dispatchEvent(new Event("celeste:payment-confirmed"));
					})
					.catch(() => undefined);
		};
		check();
		const interval = setInterval(check, 15_000);
		document.addEventListener("visibilitychange", check);
		return () => {
			clearInterval(interval);
			document.removeEventListener("visibilitychange", check);
		};
	}, [ids]);
	const order = orders[0];
	if (!order) return null;
	return (
		<div className="pending-order" role="status">
			<Clock3 size={18} aria-hidden="true" />
			<p>
				<strong>Pedido #{order.payment.id} aguardando pagamento</strong>
				<span>
					{order.match.homeTeam} × {order.match.awayTeam} ·{" "}
					{formatCurrency(order.payment.amount)}
					{orders.length > 1 &&
						` · ${plural(orders.length - 1, "outro pendente", "outros pendentes")}`}
				</span>
			</p>
			<button
				type="button"
				className="client-button-secondary"
				onClick={() => onOpen(order)}
			>
				Ver pedido
			</button>
		</div>
	);
}
