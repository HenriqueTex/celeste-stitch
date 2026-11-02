"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export interface Period {
	from: string;
	to: string;
}

const iso = (date: Date) => date.toLocaleDateString("en-CA", { timeZone: "America/Sao_Paulo" });

function preset(days: number | null): Period {
	if (days === null) return { from: "", to: "" };
	const to = new Date();
	const from = new Date(to.getTime() - (days - 1) * 86_400_000);
	return { from: iso(from), to: iso(to) };
}

const PRESETS = [
	{ label: "7 dias", days: 7 },
	{ label: "30 dias", days: 30 },
	{ label: "90 dias", days: 90 },
	{ label: "Tudo", days: null },
];

/** Quick ranges plus custom dates (Brasília calendar days). */
export default function PeriodFilter({
	value,
	onChange,
}: {
	value: Period;
	onChange: (period: Period) => void;
}) {
	return (
		<div className="flex flex-wrap items-end gap-2">
			{PRESETS.map((item) => {
				const candidate = preset(item.days);
				const active = candidate.from === value.from && candidate.to === value.to;
				return (
					<Button
						key={item.label}
						variant={active ? "default" : "outline"}
						size="sm"
						onClick={() => onChange(candidate)}
					>
						{item.label}
					</Button>
				);
			})}
			<label className="grid gap-1 text-xs text-muted-foreground">
				De
				<Input
					type="date"
					className="h-8 w-[150px]"
					value={value.from}
					onChange={(event) => onChange({ ...value, from: event.target.value })}
				/>
			</label>
			<label className="grid gap-1 text-xs text-muted-foreground">
				Até
				<Input
					type="date"
					className="h-8 w-[150px]"
					value={value.to}
					onChange={(event) => onChange({ ...value, to: event.target.value })}
				/>
			</label>
		</div>
	);
}

export const last30Days = () => preset(30);
