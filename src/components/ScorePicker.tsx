"use client";

import { useId } from "react";
import { Minus, Plus } from "lucide-react";
import { isClubTeam } from "@/lib/format";
import type { MatchItem } from "@/lib/types";

export type Score = number | "";
export function validScore(value: Score) {
	return value !== "" && Number.isInteger(value) && value >= 0 && value <= 20;
}

/** Picks back Cruzeiro: any win or a draw. Cruzeiro can never be predicted to lose. */
export function allowedPick(match: MatchItem, home: Score, away: Score) {
	if (!validScore(home) || !validScore(away)) return false;
	if (isClubTeam(match.homeTeam)) return Number(home) >= Number(away);
	if (isClubTeam(match.awayTeam)) return Number(away) >= Number(home);
	return true;
}

/** Score range for one side, given the other side's score. */
export function scoreBounds(
	match: MatchItem,
	side: "home" | "away",
	other: Score,
) {
	const team = side === "home" ? match.homeTeam : match.awayTeam;
	const rival = side === "home" ? match.awayTeam : match.homeTeam;
	const otherGoals = validScore(other) ? Number(other) : 0;
	if (isClubTeam(team)) return { min: otherGoals, max: 20 };
	if (isClubTeam(rival)) return { min: 0, max: validScore(other) ? otherGoals : 20 };
	return { min: 0, max: 20 };
}

export default function ScorePicker({
	team,
	value,
	onChange,
	club = false,
	disabled = false,
	min = 0,
	max = 20,
}: {
	team: string;
	value: Score;
	onChange: (value: Score) => void;
	club?: boolean;
	disabled?: boolean;
	min?: number;
	max?: number;
}) {
	const id = useId();
	return (
		<div className={`score-picker${club ? " is-club" : ""}`}>
			<label htmlFor={id} className="sr-only">
				Gols de {team}
			</label>
			<input
				id={id}
				type="number"
				inputMode="numeric"
				min={min}
				max={max}
				step={1}
				required
				value={value}
				disabled={disabled}
				onChange={(event) => {
					const raw = event.target.value;
					const goals = Number(raw);
					if (raw === "") onChange("");
					else if (validScore(goals) && goals >= min && goals <= max) onChange(goals);
				}}
				className="score-value"
			/>
			<div className="score-steps">
				<button
					type="button"
					className="score-adjust"
					disabled={disabled || value === "" || value <= min}
					aria-label={`Diminuir gols de ${team}`}
					onClick={() => onChange(Math.max(min, Number(value) - 1))}
				>
					<Minus size={18} aria-hidden="true" />
				</button>
				<button
					type="button"
					className="score-adjust"
					disabled={disabled || Number(value) >= max}
					aria-label={`Aumentar gols de ${team}`}
					onClick={() => onChange(Math.min(max, Number(value) + 1))}
				>
					<Plus size={18} aria-hidden="true" />
				</button>
			</div>
		</div>
	);
}
