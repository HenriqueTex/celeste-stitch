"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { useAdminAuth } from "@/components/AdminAuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import TeamCombobox from "@/components/ui/TeamCombobox";
import DateTimePicker from "@/components/ui/DateTimePicker";
import { apiFetch } from "@/lib/api";
import type { MatchItem, Team } from "@/lib/types";

function toLocalIsoMinutes(value: string | null | undefined) {
	if (!value) return "";
	const date = new Date(value);
	if (Number.isNaN(date.getTime())) return "";
	const pad = (n: number) => String(n).padStart(2, "0");
	return (
		`${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}` +
		`T${pad(date.getHours())}:${pad(date.getMinutes())}`
	);
}

export default function EditMatchPage() {
	const { id } = useParams<{ id: string }>();
	const router = useRouter();
	const { adminToken, isAdminLoggedIn } = useAdminAuth();
	const [match, setMatch] = useState<MatchItem | null>(null);
	const [teams, setTeams] = useState<Team[]>([]);
	const [saving, setSaving] = useState(false);
	const [form, setForm] = useState({
		awayTeam: "",
		competition: "",
		scheduledAt: "",
		bettingDeadlineAt: "",
		ticketPrice: "",
		notes: "",
	});

	useEffect(() => {
		if (!adminToken || !id) return;
		void apiFetch<MatchItem>(`/admin/matches/${id}`, { token: adminToken }).then(
			(data) => {
				setMatch(data);
				setForm({
					awayTeam: data.awayTeam,
					competition: data.competition,
					scheduledAt: toLocalIsoMinutes(data.scheduledAt),
					bettingDeadlineAt: toLocalIsoMinutes(data.bettingDeadlineAt),
					ticketPrice: String(data.ticketPrice),
					notes: data.notes ?? "",
				});
			}
		);
		void apiFetch<Team[]>("/admin/teams", { token: adminToken })
			.then(setTeams)
			.catch(() => setTeams([]));
	}, [adminToken, id]);

	if (!isAdminLoggedIn || !match) return null;

	return (
		<div className="space-y-6 max-w-2xl">
			<div className="flex items-center gap-3">
				<Button variant="ghost" size="icon" asChild>
					<Link href="/admin/matches">
						<ArrowLeft className="size-4" />
					</Link>
				</Button>
				<div>
					<h1 className="text-2xl font-bold tracking-tight">Editar Partida</h1>
					<p className="text-muted-foreground text-sm">
						Ajuste os dados e mantenha o ciclo operacional da rodada.
					</p>
				</div>
			</div>

			<Card>
				<CardHeader>
					<CardTitle>
						{match.homeTeam} × {match.awayTeam}
					</CardTitle>
				</CardHeader>
				<CardContent className="grid gap-4">
					<div>
						<Label>Mandante</Label>
						<Input value="Cruzeiro" disabled readOnly />
					</div>
					<div className="grid gap-1.5">
						<Label>Visitante</Label>
						<TeamCombobox
							teams={teams.filter((team) => team.name !== "Cruzeiro")}
							value={form.awayTeam}
							onChange={(value) => setForm({ ...form, awayTeam: value })}
						/>
					</div>
					<div>
						<Label>Competição</Label>
						<Input
							value={form.competition}
							onChange={(e) =>
								setForm({ ...form, competition: e.target.value })
							}
						/>
					</div>
					<div className="grid sm:grid-cols-2 gap-4">
						<div className="grid gap-1.5">
							<Label>Data/Hora da partida</Label>
							<DateTimePicker
								value={form.scheduledAt}
								onChange={(next) => setForm({ ...form, scheduledAt: next })}
							/>
						</div>
						<div className="grid gap-1.5">
							<Label>Deadline das apostas</Label>
							<DateTimePicker
								value={form.bettingDeadlineAt}
								onChange={(next) =>
									setForm({ ...form, bettingDeadlineAt: next })
								}
							/>
						</div>
					</div>
					<div>
						<Label>Preço do bilhete</Label>
						<Input
							type="number"
							value={form.ticketPrice}
							onChange={(e) =>
								setForm({ ...form, ticketPrice: e.target.value })
							}
						/>
					</div>
					<div>
						<Label>Notas</Label>
						<Input
							value={form.notes}
							onChange={(e) => setForm({ ...form, notes: e.target.value })}
							placeholder="Opcional"
						/>
					</div>
					<Button
						disabled={saving}
						onClick={async () => {
							if (!adminToken) return;
							setSaving(true);
							try {
								await apiFetch(`/admin/matches/${match.id}`, {
									method: "PATCH",
									token: adminToken,
									body: JSON.stringify({
										awayTeam: form.awayTeam,
										competition: form.competition,
										scheduledAt: form.scheduledAt,
										bettingDeadlineAt: form.bettingDeadlineAt,
										ticketPrice: Number(form.ticketPrice),
										notes: form.notes,
									}),
								});
								router.push("/admin/matches");
							} finally {
								setSaving(false);
							}
						}}
					>
						{saving ? "Salvando..." : "Salvar alterações"}
					</Button>
				</CardContent>
			</Card>
		</div>
	);
}
