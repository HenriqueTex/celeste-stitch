"use client";

import { useState } from "react";
import Link from "next/link";
import {
	AlertTriangle,
	DollarSign,
	Landmark,
	Percent,
	Ticket,
	Trophy,
	TrendingUp,
	UserPlus,
} from "lucide-react";
import { Bar, BarChart, CartesianGrid, Tooltip, XAxis, YAxis } from "recharts";
import { useAdminAuth } from "@/components/AdminAuthContext";
import PeriodFilter, { last30Days } from "@/components/admin/PeriodFilter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useAdminResource } from "@/hooks/use-admin-resource";
import { paymentStatus, queryString } from "@/lib/admin";
import { formatCurrency, formatDateTime } from "@/lib/format";
import type { DashboardResponse } from "@/lib/types";

/** "2026-11-05" -> "05/11" */
const shortDay = (day: string) => `${day.slice(8, 10)}/${day.slice(5, 7)}`;

const cards = [
	{ key: "grossRevenue", title: "Receita confirmada", icon: DollarSign, money: true },
	{ key: "providerFees", title: "Tarifas Mercado Pago", icon: Percent, money: true },
	{ key: "prizesReserved", title: "Prêmios gerados", icon: Trophy, money: true },
	{ key: "margin", title: "Resultado do bolão", icon: TrendingUp, money: true },
	{ key: "ticketsSold", title: "Bilhetes vendidos", icon: Ticket, money: false },
	{ key: "orders", title: "Pedidos confirmados", icon: Landmark, money: false },
	{ key: "newUsers", title: "Novos cadastros", icon: UserPlus, money: false },
	{ key: "refunded", title: "Estornado", icon: AlertTriangle, money: true },
] as const;

export default function AdminDashboardPage() {
	const { isAdminLoggedIn } = useAdminAuth();
	const [period, setPeriod] = useState(last30Days);
	const { data } = useAdminResource<DashboardResponse>(
		`/admin/dashboard${queryString(period)}`,
	);

	if (!isAdminLoggedIn) return null;
	const metrics = data?.metrics;

	return (
		<div className="space-y-6">
			<div className="flex flex-wrap items-end justify-between gap-4">
				<div>
					<h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
					<p className="text-sm text-muted-foreground">
						Receita, tarifas e prêmios no período (horário de Brasília).
					</p>
				</div>
				<PeriodFilter value={period} onChange={setPeriod} />
			</div>

			{metrics && (metrics.pendingPayments > 0 || metrics.refundPending > 0 || metrics.prizesPending > 0) && (
				<div className="flex flex-wrap gap-2 text-sm">
					{metrics.prizesPending > 0 && (
						<Link href="/admin/prizes" className="rounded-md border border-amber-500/40 bg-amber-500/10 px-3 py-1.5">
							{formatCurrency(metrics.prizesPending)} em prêmios a pagar
						</Link>
					)}
					{metrics.refundPending > 0 && (
						<Link href="/admin/payments?status=refund_pending" className="rounded-md border border-red-500/40 bg-red-500/10 px-3 py-1.5">
							{metrics.refundPending} pedido(s) a estornar
						</Link>
					)}
					{metrics.pendingPayments > 0 && (
						<Link href="/admin/payments?status=pending" className="rounded-md border px-3 py-1.5 text-muted-foreground">
							{metrics.pendingPayments} PIX aguardando pagamento
						</Link>
					)}
				</div>
			)}

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
							<div className="text-2xl font-bold tabular-nums">
								{card.money
									? formatCurrency(Number(metrics?.[card.key] ?? 0))
									: Number(metrics?.[card.key] ?? 0).toLocaleString("pt-BR")}
							</div>
							{card.key === "margin" && (
								<p className="mt-1 text-xs text-muted-foreground">
									Receita − tarifas − prêmios. Líquido recebido:{" "}
									{formatCurrency(metrics?.netRevenue ?? 0)}
								</p>
							)}
						</CardContent>
					</Card>
				))}
			</div>

			<Card>
				<CardHeader>
					<CardTitle>Receita por dia</CardTitle>
					<CardDescription>Pagamentos confirmados</CardDescription>
				</CardHeader>
				<CardContent>
					{data?.series.length ? (
						<div className="w-full overflow-x-auto">
							<BarChart
								width={Math.max(560, data.series.length * 28)}
								height={240}
								data={data.series}
								margin={{ left: 8, right: 8 }}
							>
								<CartesianGrid vertical={false} strokeOpacity={0.15} />
								<XAxis
									dataKey="day"
									tickFormatter={shortDay}
									fontSize={12}
									tickLine={false}
								/>
								<YAxis
									fontSize={12}
									tickLine={false}
									axisLine={false}
									tickFormatter={(value: number) => `R$ ${value}`}
								/>
								<Tooltip
									formatter={(value) => formatCurrency(Number(value))}
									labelFormatter={(day) => shortDay(String(day))}
									contentStyle={{ background: "#0f172a", border: "1px solid #334155" }}
								/>
								<Bar dataKey="revenue" name="Receita" fill="#3b6cf6" radius={[4, 4, 0, 0]} />
							</BarChart>
						</div>
					) : (
						<p className="text-sm text-muted-foreground">Sem pagamentos no período.</p>
					)}
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle>Últimos pedidos</CardTitle>
				</CardHeader>
				<CardContent>
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>Pedido</TableHead>
								<TableHead>Comprador</TableHead>
								<TableHead>Partida</TableHead>
								<TableHead className="text-right">Valor</TableHead>
								<TableHead>Status</TableHead>
								<TableHead>Data</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{data?.recentPayments?.map((payment) => {
								const status = paymentStatus[payment.status] ?? paymentStatus.pending;
								return (
									<TableRow key={payment.id}>
										<TableCell className="font-mono text-xs">#{payment.id}</TableCell>
										<TableCell>{payment.userName}</TableCell>
										<TableCell>{payment.matchLabel}</TableCell>
										<TableCell className="text-right font-semibold">
											{formatCurrency(payment.amount)}
										</TableCell>
										<TableCell>
											<Badge variant={status.variant}>{status.label}</Badge>
										</TableCell>
										<TableCell className="text-muted-foreground">
											{formatDateTime(payment.createdAt)}
										</TableCell>
									</TableRow>
								);
							})}
							{!data?.recentPayments?.length && (
								<TableRow>
									<TableCell colSpan={6} className="text-center text-muted-foreground">
										Nenhum pedido ainda.
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
