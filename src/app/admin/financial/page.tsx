"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAdminAuth } from "@/components/AdminAuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { apiFetch } from "@/lib/api";
import { formatCurrency } from "@/lib/format";
import type { DashboardResponse } from "@/lib/types";

export default function AdminFinancialPage() {
	const { adminToken, isAdminLoggedIn } = useAdminAuth();
	const [data, setData] = useState<DashboardResponse | null>(null);

	useEffect(() => {
		if (!adminToken) return;
		void apiFetch<DashboardResponse>("/admin/dashboard", { token: adminToken }).then(setData);
	}, [adminToken]);

	if (!isAdminLoggedIn) return null;

	return (
		<div className="space-y-6">
			<div>
				<h1 className="text-2xl font-bold tracking-tight">Financeiro</h1>
				<p className="text-muted-foreground text-sm">
					Atalho para conciliação manual de pagamentos e prêmios.
				</p>
			</div>

			<div className="grid gap-4 md:grid-cols-2">
				<Card>
					<CardHeader>
						<CardTitle>Pagamentos</CardTitle>
						<CardDescription>
							{data?.metrics.pendingPayments ?? 0} pendente(s)
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-3">
						<p className="text-sm text-muted-foreground">
							Receita confirmada: {formatCurrency(data?.metrics.grossRevenue ?? 0)}
						</p>
						<Button asChild>
							<Link href="/admin/payments">Abrir pagamentos</Link>
						</Button>
					</CardContent>
				</Card>
				<Card>
					<CardHeader>
						<CardTitle>Prêmios</CardTitle>
						<CardDescription>Baixa manual de vencedores</CardDescription>
					</CardHeader>
					<CardContent className="space-y-3">
						<p className="text-sm text-muted-foreground">
							Reservado: {formatCurrency(data?.metrics.prizesReserved ?? 0)}
						</p>
						<Button asChild variant="outline">
							<Link href="/admin/prizes">Abrir prêmios</Link>
						</Button>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
