"use client";

import { useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "@/components/ui/command";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import type { Team } from "@/lib/types";

type Props = {
	teams: Team[];
	value: string;
	onChange: (next: string) => void;
	placeholder?: string;
	emptyMessage?: string;
};

export default function TeamCombobox({
	teams,
	value,
	onChange,
	placeholder = "Selecione o visitante",
	emptyMessage = "Nenhum time encontrado.",
}: Props) {
	const [open, setOpen] = useState(false);
	const selected = teams.find((team) => team.name === value);

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button
					type="button"
					variant="outline"
					role="combobox"
					aria-expanded={open}
					className={cn(
						"w-full justify-between bg-zinc-900 hover:bg-zinc-800",
						!selected && "text-muted-foreground"
					)}
				>
					<span className="flex items-center gap-2 min-w-0">
						{selected?.logoUrl ? (
							// eslint-disable-next-line @next/next/no-img-element
							<img
								src={selected.logoUrl}
								alt=""
								className="size-5 object-contain shrink-0"
							/>
						) : null}
						<span className="truncate">
							{selected
								? `${selected.shortName} — ${selected.name}${selected.state ? ` (${selected.state})` : ""}`
								: placeholder}
						</span>
					</span>
					<ChevronsUpDown className="ml-2 size-4 opacity-50 shrink-0" />
				</Button>
			</PopoverTrigger>
			<PopoverContent
				className="w-[--radix-popover-trigger-width] p-0 bg-zinc-900 border-white/10"
				align="start"
			>
				<Command className="bg-transparent">
					<CommandInput placeholder="Buscar time..." className="h-9" />
					<CommandList>
						<CommandEmpty>{emptyMessage}</CommandEmpty>
						<CommandGroup>
							{teams.map((team) => {
								const label = `${team.shortName} — ${team.name}${team.state ? ` (${team.state})` : ""}`;
								return (
									<CommandItem
										key={team.id}
										value={`${team.name} ${team.shortName} ${team.state ?? ""}`}
										onSelect={() => {
											onChange(team.name);
											setOpen(false);
										}}
									>
										<Check
											className={cn(
												"mr-2 size-4",
												selected?.id === team.id ? "opacity-100" : "opacity-0"
											)}
										/>
										{team.logoUrl ? (
											// eslint-disable-next-line @next/next/no-img-element
											<img
												src={team.logoUrl}
												alt=""
												className="mr-2 size-5 object-contain shrink-0"
											/>
										) : (
											<span className="mr-2 size-5 shrink-0" />
										)}
										{label}
									</CommandItem>
								);
							})}
						</CommandGroup>
					</CommandList>
				</Command>
			</PopoverContent>
		</Popover>
	);
}
