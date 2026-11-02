"use client";

import { useState } from "react";
import Link from "next/link";
import { useAdminAuth } from "@/components/AdminAuthContext";
import PeriodFilter from "@/components/admin/PeriodFilter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useAdminResource } from "@/hooks/use-admin-resource";
import { matchStatus, queryString } from "@/lib/admin";
import { formatCurrency, formatDateTime } from "@/lib/format";
import type { FinancialMatchRow } from "@/lib/types";

const columns: { key: keyof FinancialMatchRow; label: string; hint?: string }[] = [
	{ key: "revenue", label: "Arrecadado" },
	{ key: "providerFees", label: "Tarifas MP" },
	{ key: "bonusReceived", label: "Acumulado recebido", hint: "Pote de jogos anteriores sem acerto" },
	{ key: "prizePool", label: "Pote dos ganhadores" },
	{ key: "prizes", label: "Prêmios" },
	{ key: "carriedOver", label: "Acumulou p/ próximo" },
	{ key: "refunded", label: "Estornado" },
	{ key: "net", label: "Resultado da casa", hint: "Parte da casa − tarifas" },
];

export default function AdminFinancialPage() {
	const { isAdminLoggedIn } = useAdminAuth();
	const [period, setPeriod] = useState({ from: "", to: "" });
	const { data } = useAdminResource<{ matches: FinancialMatchRow[] }>(
		`/admin/financial${queryString(period)}`,
	);
	if (!isAdminLoggedIn) return null;
	const rows = data?.matches ?? [];
	const total = (key: keyof FinancialMatchRow) =>
		rows.reduce((sum, row) => sum + Number(row[key] ?? 0), 0);

	return (
		<div className="space-y-6">
			<div className="flex flex-wrap items-end justify-between gap-4">
				<div>
					<h1 className="text-2xl font-bold tracking-tight">Financeiro</h1>
					<p className="text-sm text-muted-foreground">
						Resultado de cada partida: arrecadação, tarifas, prêmios e acumulados.
					</p>
				</div>
				<PeriodFilter value={period} onChange={setPeriod} />
			</div>

			<Card>
				<CardHeader>
					<CardTitle>Por partida</CardTitle>
					<CardDescription>
						Partidas pela data do jogo. Quando ninguém crava o placar, o pote passa para a
						próxima partida.
					</CardDescription>
				</CardHeader>
				<CardContent className="overflow-x-auto">
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>Partida</TableHead>
								<TableHead>Status</TableHead>
								{columns.map((column) => (
									<TableHead key={column.key} className="text-right" title={column.hint}>
										{column.label}
									</TableHead>
								))}
							</TableRow>
						</TableHeader>
						<TableBody>
							{rows.map((row) => (
								<TableRow key={row.id}>
									<TableCell>
										<Link href={`/admin/matches/${row.id}/report`} className="font-medium hover:underline">
											{row.label}
										</Link>
										<div className="text-xs text-muted-foreground">
											{formatDateTime(row.scheduledAt)}
										</div>
									</TableCell>
									<TableCell>
										<Badge variant="outline">{matchStatus[row.status] ?? row.status}</Badge>
									</TableCell>
									{columns.map((column) => (
										<TableCell key={column.key} className="text-right tabular-nums">
											{formatCurrency(Number(row[column.key] ?? 0))}
										</TableCell>
									))}
								</TableRow>
							))}
							{!rows.length && (
								<TableRow>
									<TableCell colSpan={columns.length + 2} className="text-center text-muted-foreground">
										Nenhuma partida no período.
									</TableCell>
								</TableRow>
							)}
						</TableBody>
						{rows.length > 1 && (
							<TableFooter>
								<TableRow>
									<TableCell colSpan={2} className="font-semibold">
										Total
									</TableCell>
									{columns.map((column) => (
										<TableCell key={column.key} className="text-right font-semibold tabular-nums">
											{column.key === "bonusReceived" || column.key === "prizePool"
												? "—"
												: formatCurrency(total(column.key))}
										</TableCell>
									))}
								</TableRow>
							</TableFooter>
						)}
					</Table>
				</CardContent>
			</Card>
		</div>
	);
}
