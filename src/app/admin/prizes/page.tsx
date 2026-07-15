"use client";

import { useEffect, useState } from "react";
import { useAdminAuth } from "@/components/AdminAuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { apiFetch } from "@/lib/api";
import { formatCurrency, formatDateTime } from "@/lib/format";
import type { AdminPrizeItem } from "@/lib/types";

export default function AdminPrizesPage() {
	const { adminToken, isAdminLoggedIn } = useAdminAuth();
	const [prizes, setPrizes] = useState<AdminPrizeItem[]>([]);

	const loadPrizes = async () => {
		if (!adminToken) return;
		const data = await apiFetch<AdminPrizeItem[]>("/admin/prizes", { token: adminToken });
		setPrizes(data);
	};

	useEffect(() => {
		if (!adminToken) return;
		let cancelled = false;
		void apiFetch<AdminPrizeItem[]>("/admin/prizes", { token: adminToken })
			.then((data) => {
				if (!cancelled) setPrizes(data);
			})
			.catch(() => {
				if (!cancelled) setPrizes([]);
			});
		return () => {
			cancelled = true;
		};
	}, [adminToken]);

	if (!isAdminLoggedIn) return null;

	return (
		<Card>
			<CardHeader>
				<CardTitle>Prêmios</CardTitle>
			</CardHeader>
			<CardContent>
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>ID</TableHead>
							<TableHead>Usuário</TableHead>
							<TableHead>Partida</TableHead>
							<TableHead className="text-right">Valor</TableHead>
							<TableHead>Status</TableHead>
							<TableHead>Criado em</TableHead>
							<TableHead />
						</TableRow>
					</TableHeader>
					<TableBody>
						{prizes.map((prize) => (
							<TableRow key={prize.id}>
								<TableCell>#{prize.id}</TableCell>
								<TableCell>{prize.bet.snapshotName}</TableCell>
								<TableCell>
									{prize.match.homeTeam} × {prize.match.awayTeam}
								</TableCell>
								<TableCell className="text-right">
									{formatCurrency(prize.grossAmount)}
								</TableCell>
								<TableCell>
									<Badge variant={prize.status === "paid" ? "default" : "secondary"}>
										{prize.status === "paid" ? "Pago" : "Pendente"}
									</Badge>
								</TableCell>
								<TableCell>{formatDateTime(prize.createdAt)}</TableCell>
								<TableCell>
									{prize.status !== "paid" && (
										<Button
											size="sm"
											onClick={async () => {
												if (!adminToken) return;
												await apiFetch(`/admin/prizes/${prize.id}/pay`, {
													method: "POST",
													token: adminToken,
													body: JSON.stringify({}),
												});
												await loadPrizes();
											}}
										>
											Marcar pago
										</Button>
									)}
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</CardContent>
		</Card>
	);
}
