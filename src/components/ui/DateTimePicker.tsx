"use client";

import { useState } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

type Props = {
	value: string;
	onChange: (next: string) => void;
	placeholder?: string;
};

function parseValue(value: string) {
	if (!value) return { date: undefined as Date | undefined, time: "20:00" };
	const date = new Date(value);
	if (Number.isNaN(date.getTime())) return { date: undefined, time: "20:00" };
	const hh = String(date.getHours()).padStart(2, "0");
	const mm = String(date.getMinutes()).padStart(2, "0");
	return { date, time: `${hh}:${mm}` };
}

function toLocalIsoMinutes(date: Date) {
	const pad = (n: number) => String(n).padStart(2, "0");
	return (
		`${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}` +
		`T${pad(date.getHours())}:${pad(date.getMinutes())}`
	);
}

export default function DateTimePicker({
	value,
	onChange,
	placeholder = "Selecione data e hora",
}: Props) {
	const [open, setOpen] = useState(false);
	const initial = parseValue(value);
	const [draftDate, setDraftDate] = useState<Date | undefined>(initial.date);
	const [draftTime, setDraftTime] = useState<string>(initial.time);

	const handleOpenChange = (next: boolean) => {
		if (next) {
			const parsed = parseValue(value);
			setDraftDate(parsed.date);
			setDraftTime(parsed.time);
		}
		setOpen(next);
	};

	const confirm = () => {
		if (!draftDate) return;
		const [h, m] = draftTime.split(":").map(Number);
		const next = new Date(draftDate);
		next.setHours(h || 0, m || 0, 0, 0);
		onChange(toLocalIsoMinutes(next));
		setOpen(false);
	};

	const label = value
		? format(new Date(value), "dd 'de' MMM, yyyy HH:mm", { locale: ptBR })
		: placeholder;

	return (
		<Popover open={open} onOpenChange={handleOpenChange}>
			<PopoverTrigger asChild>
				<Button
					type="button"
					variant="outline"
					className={cn(
						"w-full justify-start text-left font-normal",
						!value && "text-muted-foreground"
					)}
				>
					<CalendarIcon className="mr-2 size-4" />
					{label}
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-auto p-0 bg-black border-white/10" align="start">
				<Calendar
					mode="single"
					selected={draftDate}
					onSelect={setDraftDate}
					captionLayout="dropdown"
					locale={ptBR}
				/>
				<div className="flex items-center gap-2 border-t p-3">
					<Input
						type="time"
						value={draftTime}
						onChange={(e) => setDraftTime(e.target.value)}
						className="w-32"
					/>
					<div className="ml-auto flex gap-2">
						<Button
							type="button"
							variant="ghost"
							size="sm"
							onClick={() => setOpen(false)}
						>
							Cancelar
						</Button>
						<Button
							type="button"
							size="sm"
							disabled={!draftDate}
							onClick={confirm}
						>
							Confirmar
						</Button>
					</div>
				</div>
			</PopoverContent>
		</Popover>
	);
}
