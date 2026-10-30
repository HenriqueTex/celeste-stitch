"use client";

import { useEffect, useRef, useState } from "react";
import { ImageUp, Loader2 } from "lucide-react";
import { useAdminAuth } from "@/components/AdminAuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { apiFetch } from "@/lib/api";
import type { Team } from "@/lib/types";

const LOGO_TYPES = ["image/png", "image/jpeg", "image/webp", "image/svg+xml"];
const LOGO_MAX_BYTES = 2 * 1024 * 1024;

function TeamRow({
	team,
	token,
	onChange,
}: {
	team: Team;
	token: string;
	onChange: (team: Team) => void;
}) {
	const input = useRef<HTMLInputElement>(null);
	const [busy, setBusy] = useState(false);
	const [error, setError] = useState("");

	const upload = async (file: File | undefined) => {
		setError("");
		if (!file) return;
		if (!LOGO_TYPES.includes(file.type)) {
			setError("Use PNG, JPG, WebP ou SVG.");
			return;
		}
		if (file.size > LOGO_MAX_BYTES) {
			setError("O escudo pode ter no máximo 2 MB.");
			return;
		}
		const body = new FormData();
		body.append("logo", file);
		try {
			setBusy(true);
			onChange(
				await apiFetch<Team>(`/admin/teams/${team.id}/logo`, {
					method: "POST",
					token,
					body,
				}),
			);
		} catch (reason) {
			setError(reason instanceof Error ? reason.message : "Não foi possível enviar.");
		} finally {
			setBusy(false);
			if (input.current) input.current.value = "";
		}
	};

	return (
		<li className="flex items-center gap-4 py-3">
			<div className="flex size-14 shrink-0 items-center justify-center rounded-lg border bg-muted/40">
				{team.logoUrl ? (
					// eslint-disable-next-line @next/next/no-img-element
					<img
						src={team.logoUrl}
						alt={`Escudo do ${team.name}`}
						className="size-12 object-contain"
					/>
				) : (
					<span className="text-xs font-semibold text-muted-foreground">
						{team.shortName}
					</span>
				)}
			</div>
			<div className="min-w-0 flex-1">
				<p className="truncate font-medium">{team.name}</p>
				<p className="text-sm text-muted-foreground">
					{team.state ?? "—"}
					{!team.logoUrl && " · sem escudo"}
				</p>
				{error && (
					<p className="text-sm text-destructive" role="alert">
						{error}
					</p>
				)}
			</div>
			<input
				ref={input}
				type="file"
				accept={LOGO_TYPES.join(",")}
				hidden
				onChange={(event) => void upload(event.target.files?.[0])}
			/>
			<Button
				variant="outline"
				size="sm"
				disabled={busy}
				onClick={() => input.current?.click()}
			>
				{busy ? (
					<Loader2 className="size-4 animate-spin" aria-hidden="true" />
				) : (
					<ImageUp className="size-4" aria-hidden="true" />
				)}
				{busy ? "Enviando…" : team.logoUrl ? "Trocar escudo" : "Enviar escudo"}
			</Button>
		</li>
	);
}

export default function AdminTeamsPage() {
	const { adminToken, isAdminLoggedIn } = useAdminAuth();
	const [teams, setTeams] = useState<Team[] | null>(null);

	useEffect(() => {
		if (!adminToken) return;
		void apiFetch<Team[]>("/admin/teams", { token: adminToken }).then(setTeams);
	}, [adminToken]);

	if (!isAdminLoggedIn || !adminToken || !teams) return null;

	return (
		<Card className="max-w-3xl">
			<CardHeader>
				<CardTitle>Times e escudos</CardTitle>
				<p className="text-sm text-muted-foreground">
					O escudo aparece no placar e nos jogos. PNG, JPG, WebP ou SVG, até 2 MB.
				</p>
			</CardHeader>
			<CardContent>
				<ul className="divide-y">
					{teams.map((team) => (
						<TeamRow
							key={team.id}
							team={team}
							token={adminToken}
							onChange={(updated) =>
								setTeams((current) =>
									(current ?? []).map((item) => (item.id === updated.id ? updated : item)),
								)
							}
						/>
					))}
				</ul>
			</CardContent>
		</Card>
	);
}
