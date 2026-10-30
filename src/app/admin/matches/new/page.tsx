"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { useAdminAuth } from "@/components/AdminAuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import MatchSidesField, { toTeams } from "@/components/ui/MatchSidesField";
import DateTimePicker from "@/components/ui/DateTimePicker";
import { apiFetch } from "@/lib/api";
import type { AppSettings, Team } from "@/lib/types";

export default function NewMatchPage() {
	const { adminToken, isAdminLoggedIn } = useAdminAuth();
	const router = useRouter();
	const [settings, setSettings] = useState<AppSettings | null>(null);
	const [teams, setTeams] = useState<Team[]>([]);
	const [form, setForm] = useState({
		sides: { clubAtHome: true, opponent: "" },
		competition: "Brasileirão Série A",
		scheduledAt: "",
		bettingDeadlineAt: "",
		ticketPrice: "20",
		notes: "",
	});

	useEffect(() => {
		if (!adminToken) return;
		void apiFetch<AppSettings>("/admin/settings", { token: adminToken })
			.then((data) => {
				setSettings(data);
				setForm((current) => ({
					...current,
					ticketPrice: String(data.defaultTicketPrice),
				}));
			})
			.catch(() => setSettings(null));
		void apiFetch<Team[]>("/admin/teams", { token: adminToken })
			.then(setTeams)
			.catch(() => setTeams([]));
	}, [adminToken]);

	if (!isAdminLoggedIn) return null;

	return (
		<div className="space-y-6 max-w-2xl">
			<div className="flex items-center gap-3">
				<Button variant="ghost" size="icon" asChild>
					<Link href="/admin/matches">
						<ArrowLeft className="size-4" />
					</Link>
				</Button>
				<div>
					<h1 className="text-2xl font-bold tracking-tight">Nova Partida</h1>
					<p className="text-muted-foreground text-sm">
						Crie a partida e depois abra as apostas.
					</p>
				</div>
			</div>

			<Card>
				<CardHeader>
					<CardTitle>Dados da Partida</CardTitle>
				</CardHeader>
				<CardContent className="grid gap-4">
					<MatchSidesField
						teams={teams}
						value={form.sides}
						onChange={(sides) => setForm({ ...form, sides })}
					/>
					<div>
						<Label>Competição</Label>
						<Input
							value={form.competition}
							onChange={(e) => setForm({ ...form, competition: e.target.value })}
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
							onChange={(e) => setForm({ ...form, ticketPrice: e.target.value })}
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
					<div className="text-xs text-muted-foreground">
						Preço padrão atual: {settings?.defaultTicketPrice ?? 20}
					</div>
					<Button
						onClick={async () => {
							if (!adminToken) return;
							await apiFetch("/admin/matches", {
								method: "POST",
								token: adminToken,
								body: JSON.stringify({
									...toTeams(form.sides),
									competition: form.competition,
									scheduledAt: form.scheduledAt,
									bettingDeadlineAt: form.bettingDeadlineAt,
									ticketPrice: Number(form.ticketPrice),
									notes: form.notes,
								}),
							});
							router.push("/admin/matches");
						}}
					>
						Criar partida
					</Button>
				</CardContent>
			</Card>
		</div>
	);
}
