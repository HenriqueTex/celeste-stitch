"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import type { BetOrderResponse, MatchItem } from "@/lib/types";
import type { Score } from "@/components/ScorePicker";
import { useAuth } from "@/components/AuthContext";
import BetModal from "@/components/BetModal";

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
	activeMatch: MatchItem | null;
	setActiveMatch: (match: MatchItem | null) => void;
}
const BettingContext = createContext<BettingState | null>(null);

export function useBetting() {
	const context = useContext(BettingContext);
	if (!context) throw new Error("BettingProvider ausente");
	return context;
}

export function BettingProvider({ children }: { children: ReactNode }) {
	const { user } = useAuth();
	const [drafts, setDrafts] = useState<Record<number, PredictionLine[]>>({});
	const [orders, setOrders] = useState<Record<number, StoredOrder>>({});
	const [uncertainMatches, setUncertainMatches] = useState<
		Record<number, boolean>
	>({});
	const [match, setMatch] = useState<MatchItem | null>(null);
	const [activeMatch, setActiveMatch] = useState<MatchItem | null>(null);
	const [open, setOpen] = useState(false);
	const orderFor = (id: number) => {
		const entry = orders[id];
		return entry && (entry.ownerId === null || entry.ownerId === user?.id)
			? entry.order
			: undefined;
	};
	const linesFor = (id: number) => drafts[id] ?? initialLines;
	const updateLines = (id: number, lines: PredictionLine[]) =>
		setDrafts((previous) => ({ ...previous, [id]: lines }));
	const saveOrder = (order: BetOrderResponse) =>
		setOrders((previous) => ({
			...previous,
			[order.match.id]: {
				order,
				ownerId:
					previous[order.match.id]?.order.payment.id === order.payment.id
						? previous[order.match.id].ownerId
						: (user?.id ?? null),
			},
		}));

	return (
		<BettingContext.Provider
			value={{
				linesFor,
				updateLines,
				orderFor,
				activeMatch,
				setActiveMatch,
				openCheckout: (selected, order) => {
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
				},
			}}
		>
			{children}
			{match && (
				<BetModal
					key={match.id}
					open={open}
					onClose={() => setOpen(false)}
					match={match}
					onMatchChange={setMatch}
					lines={linesFor(match.id)}
					onLinesChange={(lines) => updateLines(match.id, lines)}
					order={orderFor(match.id)}
					onOrderChange={saveOrder}
					uncertain={Boolean(uncertainMatches[match.id])}
					onUncertain={() =>
						setUncertainMatches((previous) => ({
							...previous,
							[match.id]: true,
						}))
					}
					onNewOrder={() => {
						setOrders((previous) => {
							const next = { ...previous };
							delete next[match.id];
							return next;
						});
						updateLines(match.id, initialLines);
					}}
				/>
			)}
		</BettingContext.Provider>
	);
}
