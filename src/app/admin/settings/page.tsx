"use client";

import { useEffect, useState } from "react";
import { useAdminAuth } from "@/components/AdminAuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { apiFetch } from "@/lib/api";
import type { AppSettings } from "@/lib/types";

export default function AdminSettingsPage() {
	const { adminToken, isAdminLoggedIn } = useAdminAuth();
	const [settings, setSettings] = useState<AppSettings | null>(null);

	useEffect(() => {
		if (!adminToken) return;
		void apiFetch<AppSettings>("/admin/settings", { token: adminToken }).then(setSettings);
	}, [adminToken]);

	if (!isAdminLoggedIn || !settings) return null;

	return (
		<Card className="max-w-2xl">
			<CardHeader>
				<CardTitle>Configurações Operacionais</CardTitle>
			</CardHeader>
			<CardContent className="grid gap-4">
				<div className="grid sm:grid-cols-2 gap-4">
					<div>
						<Label>Pontos exatos</Label>
						<Input
							type="number"
							value={settings.exactPoints}
							onChange={(e) =>
								setSettings({ ...settings, exactPoints: Number(e.target.value) })
							}
						/>
					</div>
					<div>
						<Label>Pontos parciais</Label>
						<Input
							type="number"
							value={settings.partialPoints}
							onChange={(e) =>
								setSettings({ ...settings, partialPoints: Number(e.target.value) })
							}
						/>
					</div>
				</div>
				<div className="grid sm:grid-cols-2 gap-4">
					<div>
						<Label>% para vencedores</Label>
						<Input
							type="number"
							value={settings.winnerPoolPercentage}
							onChange={(e) =>
								setSettings({
									...settings,
									winnerPoolPercentage: Number(e.target.value),
								})
							}
						/>
					</div>
					<div>
						<Label>% base jovem</Label>
						<Input
							type="number"
							value={settings.basePoolPercentage}
							onChange={(e) =>
								setSettings({
									...settings,
									basePoolPercentage: Number(e.target.value),
								})
							}
						/>
					</div>
				</div>
				<div>
					<Label>Preço padrão do bilhete</Label>
					<Input
						type="number"
						value={settings.defaultTicketPrice}
						onChange={(e) =>
							setSettings({
								...settings,
								defaultTicketPrice: Number(e.target.value),
							})
						}
					/>
				</div>
				<Button
					onClick={async () => {
						if (!adminToken) return;
						const data = await apiFetch<AppSettings>("/admin/settings", {
							method: "PATCH",
							token: adminToken,
							body: JSON.stringify({
								exactPoints: settings.exactPoints,
								partialPoints: settings.partialPoints,
								winnerPoolPercentage: settings.winnerPoolPercentage,
								basePoolPercentage: settings.basePoolPercentage,
								defaultTicketPrice: settings.defaultTicketPrice,
							}),
						});
						setSettings(data);
					}}
				>
					Salvar configurações
				</Button>
			</CardContent>
		</Card>
	);
}
