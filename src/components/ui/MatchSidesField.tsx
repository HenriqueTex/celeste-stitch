"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import TeamCombobox from "@/components/ui/TeamCombobox";
import type { Team } from "@/lib/types";

const CLUB = "Cruzeiro";

export type MatchSides = { clubAtHome: boolean; opponent: string };

/** Every pool match is a Cruzeiro match; this maps the form back to home/away. */
export function toTeams({ clubAtHome, opponent }: MatchSides) {
	return clubAtHome
		? { homeTeam: CLUB, awayTeam: opponent }
		: { homeTeam: opponent, awayTeam: CLUB };
}

export function fromTeams(homeTeam: string, awayTeam: string): MatchSides {
	const clubAtHome = !/cruzeiro/i.test(awayTeam);
	return { clubAtHome, opponent: clubAtHome ? awayTeam : homeTeam };
}

export default function MatchSidesField({
	teams,
	value,
	onChange,
}: {
	teams: Team[];
	value: MatchSides;
	onChange: (value: MatchSides) => void;
}) {
	return (
		<>
			<div className="grid gap-1.5">
				<Label id="club-side-label">O Cruzeiro joga</Label>
				<div className="flex gap-2" role="group" aria-labelledby="club-side-label">
					{[
						{ atHome: true, label: "Em casa" },
						{ atHome: false, label: "Fora" },
					].map(({ atHome, label }) => (
						<Button
							key={label}
							type="button"
							variant={value.clubAtHome === atHome ? "default" : "outline"}
							aria-pressed={value.clubAtHome === atHome}
							onClick={() => onChange({ ...value, clubAtHome: atHome })}
						>
							{label}
						</Button>
					))}
				</div>
			</div>
			<div className="grid gap-1.5">
				<Label>Adversário</Label>
				<TeamCombobox
					teams={teams.filter((team) => team.name !== CLUB)}
					value={value.opponent}
					onChange={(opponent) => onChange({ ...value, opponent })}
				/>
			</div>
		</>
	);
}
