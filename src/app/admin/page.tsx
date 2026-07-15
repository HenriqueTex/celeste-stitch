"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
	DollarSign,
	Ticket,
	Trophy,
	TrendingUp,
} from "lucide-react";
import { useAdminAuth } from "@/components/AdminAuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { apiFetch } from "@/lib/api";
import { formatCurrency, formatDateTime } from "@/lib/format";
import type { DashboardResponse } from "@/lib/types";

const cards = [
	{ key: "grossRevenue", title: "Receita Bruta", icon: DollarSign },
	{ key: "ticketsSold", title: "Bilhetes Vendidos", icon: Ticket },
	{ key: "prizesReserved", title: "Prêmios Reservados", icon: Trophy },
	{ key: "margin", title: "Margem Operacional", icon: TrendingUp },
] as const;

export default function AdminDashboardPage() {
	const { isAdminLoggedIn, isLoading, adminToken } = useAdminAuth();
	const router = useRouter();
	const [data, setData] = useState<DashboardResponse | null>(null);

	useEffect(() => {
		if (!isLoading && !isAdminLoggedIn) router.replace("/admin/login");
	}, [isAdminLoggedIn, isLoading, router]);

	useEffect(() => {
		if (!adminToken) return;
		void apiFetch<DashboardResponse>("/admin/dashboard", { token: adminToken })
			.then(setData)
			.catch(() => setData(null));
	}, [adminToken]);

	if (!isAdminLoggedIn) return null;

	return (
		<div className="space-y-6">
			<div>
				<h1 className="text-2xl font-bold tracking-tight">Dashboard Financeiro</h1>
				<p className="text-muted-foreground text-sm">
					Visão geral da operação do bolão.
				</p>
			</div>

			<div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
				{cards.map((card) => (
					<Card key={card.key}>
						<CardHeader className="flex flex-row items-center justify-between pb-2">
							<CardTitle className="text-sm font-medium text-muted-foreground">
								{card.title}
							</CardTitle>
							<card.icon className="size-4 text-muted-foreground" />
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">
								{card.key === "ticketsSold"
									? data?.metrics.ticketsSold?.toLocaleString("pt-BR") ?? "0"
									: formatCurrency(
											Number(data?.metrics[card.key] ?? 0)
									  )}
							</div>
						</CardContent>
					</Card>
				))}
			</div>

			<Card>
				<CardHeader>
					<CardTitle>Últimos Pagamentos</CardTitle>
					<CardDescription>
						{data?.metrics.pendingPayments ?? 0} pagamento(s) pendente(s)
					</CardDescription>
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
							</TableRow>
						</TableHeader>
						<TableBody>
							{data?.recentPayments?.map((payment) => (
								<TableRow key={payment.id}>
									<TableCell className="font-mono text-xs">
										#{payment.id}
									</TableCell>
									<TableCell>{payment.userName}</TableCell>
									<TableCell>{payment.matchLabel}</TableCell>
									<TableCell className="text-right font-semibold">
										{formatCurrency(payment.amount)}
									</TableCell>
									<TableCell>
										<Badge
											variant={
												payment.status === "confirmed" ? "default" : "secondary"
											}
										>
											{payment.status === "confirmed" ? "Confirmado" : "Pendente"}
										</Badge>
									</TableCell>
									<TableCell className="text-muted-foreground">
										{formatDateTime(payment.createdAt)}
									</TableCell>
								</TableRow>
							))}
							{!data?.recentPayments?.length && (
								<TableRow>
									<TableCell colSpan={6} className="text-center text-muted-foreground">
										Nenhum pagamento encontrado.
									</TableCell>
								</TableRow>
							)}
						</TableBody>
					</Table>
				</CardContent>
			</Card>
		</div>
	);
}
