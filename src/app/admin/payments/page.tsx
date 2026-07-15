"use client";

import { useEffect, useState } from "react";
import { useAdminAuth } from "@/components/AdminAuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { apiFetch } from "@/lib/api";
import { formatCurrency, formatDateTime } from "@/lib/format";
import type { AdminPaymentItem } from "@/lib/types";

export default function AdminPaymentsPage() {
	const { adminToken, isAdminLoggedIn } = useAdminAuth();
	const [payments, setPayments] = useState<AdminPaymentItem[]>([]);

	const loadPayments = async () => {
		if (!adminToken) return;
		const data = await apiFetch<AdminPaymentItem[]>("/admin/payments", { token: adminToken });
		setPayments(data);
	};

	useEffect(() => {
		if (!adminToken) return;
		let cancelled = false;
		void apiFetch<AdminPaymentItem[]>("/admin/payments", { token: adminToken })
			.then((data) => {
				if (!cancelled) setPayments(data);
			})
			.catch(() => {
				if (!cancelled) setPayments([]);
			});
		return () => {
			cancelled = true;
		};
	}, [adminToken]);

	if (!isAdminLoggedIn) return null;

	return (
		<Card>
			<CardHeader>
				<CardTitle>Pagamentos</CardTitle>
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
							<TableHead>Data</TableHead>
							<TableHead />
						</TableRow>
					</TableHeader>
					<TableBody>
						{payments.map((payment) => (
							<TableRow key={payment.id}>
								<TableCell>#{payment.id}</TableCell>
								<TableCell>{payment.bet?.snapshotName ?? "—"}</TableCell>
								<TableCell>
									{payment.match
										? `${payment.match.homeTeam} × ${payment.match.awayTeam}`
										: "—"}
								</TableCell>
								<TableCell className="text-right">
									{formatCurrency(payment.amount)}
								</TableCell>
								<TableCell>
									<Badge variant={payment.status === "confirmed" ? "default" : "secondary"}>
										{payment.status === "confirmed" ? "Confirmado" : "Pendente"}
									</Badge>
								</TableCell>
								<TableCell>{formatDateTime(payment.createdAt)}</TableCell>
								<TableCell>
									{payment.status !== "confirmed" && (
										<Button
											size="sm"
											onClick={async () => {
												if (!adminToken) return;
												await apiFetch(`/admin/payments/${payment.id}/confirm`, {
													method: "POST",
													token: adminToken,
													body: JSON.stringify({}),
												});
												await loadPayments();
											}}
										>
											Confirmar
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
