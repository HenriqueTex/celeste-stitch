"use client";

import { useId } from "react";
import { Minus, Plus } from "lucide-react";

export type Score = number | "";
export function validScore(value: Score) {
	return value !== "" && Number.isInteger(value) && value >= 0 && value <= 20;
}

export default function ScorePicker({
	team,
	value,
	onChange,
	club = false,
	disabled = false,
}: {
	team: string;
	value: Score;
	onChange: (value: Score) => void;
	club?: boolean;
	disabled?: boolean;
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
				min={0}
				max={20}
				step={1}
				required
				value={value}
				disabled={disabled}
				onChange={(event) => {
					const raw = event.target.value;
					if (raw === "") onChange("");
					else if (validScore(Number(raw))) onChange(Number(raw));
				}}
				className="score-value"
			/>
			<div className="score-steps">
				<button
					type="button"
					className="score-adjust"
					disabled={disabled || value === "" || value <= 0}
					aria-label={`Diminuir gols de ${team}`}
					onClick={() => onChange(Math.max(0, Number(value) - 1))}
				>
					<Minus size={18} aria-hidden="true" />
				</button>
				<button
					type="button"
					className="score-adjust"
					disabled={disabled || Number(value) >= 20}
					aria-label={`Aumentar gols de ${team}`}
					onClick={() => onChange(Math.min(20, Number(value) + 1))}
				>
					<Plus size={18} aria-hidden="true" />
				</button>
			</div>
		</div>
	);
}
