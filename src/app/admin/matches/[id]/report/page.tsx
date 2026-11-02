"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { useAdminAuth } from "@/components/AdminAuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useAdminResource } from "@/hooks/use-admin-resource";
import { matchStatus, paymentStatus } from "@/lib/admin";
import { formatCurrency, formatDateTime } from "@/lib/format";
import type { MatchReport } from "@/lib/types";

export default function MatchReportPage() {
	const { id } = useParams<{ id: string }>();
	const { isAdminLoggedIn } = useAdminAuth();
	const { data, error } = useAdminResource<MatchReport>(`/admin/matches/${id}/report`);

	if (!isAdminLoggedIn) return null;
	if (error) return <p className="text-sm text-destructive">{error}</p>;
	if (!data) return null;
	const { match, pool } = data;
	const confirmed = data.payments.confirmed;
	const maxTickets = Math.max(1, ...data.distribution.map((row) => row.tickets));

	const figures = [
		["Arrecadado", formatCurrency(pool.revenue), `${match.stats.tickets} bilhetes · ${match.stats.participants} participantes`],
		["Pote dos ganhadores", formatCurrency(pool.prizePool), `${pool.rules.winnerPoolPercentage}% da arrecadação${pool.bonus ? ` + ${formatCurrency(pool.bonus)} acumulado` : ""}`],
		["Parte da casa", formatCurrency(pool.houseShare), `Tarifas MP: ${formatCurrency(confirmed?.fees ?? 0)}`],
		["Líquido recebido", formatCurrency(confirmed?.net ?? 0), `${confirmed?.orders ?? 0} pedidos confirmados`],
	];

	return (
		<div className="max-w-6xl space-y-6">
			<div className="flex flex-wrap items-center gap-3">
				<Button variant="ghost" size="icon" asChild>
					<Link href="/admin/matches" aria-label="Voltar para partidas">
						<ArrowLeft className="size-4" />
					</Link>
				</Button>
				<div className="flex-1">
					<h1 className="text-2xl font-bold tracking-tight">
						{match.homeTeam} × {match.awayTeam}
						{data.result && ` · ${data.result.homeScore} × ${data.result.awayScore}`}
					</h1>
					<p className="text-sm text-muted-foreground">
						{match.competition} · {formatDateTime(match.scheduledAt)} · regras: cravada{" "}
						{pool.rules.exactPoints} pts, resultado {pool.rules.partialPoints} pts
					</p>
				</div>
				<Badge variant="outline">{matchStatus[match.status] ?? match.status}</Badge>
			</div>

			{match.status === "cancelled" && (
				<p className="rounded-md border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm">
					Cancelada{match.cancelReason ? `: ${match.cancelReason}` : ""}.
				</p>
			)}
			{!!match.pool?.carriedOver && (
				<p className="rounded-md border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-sm">
					Ninguém cravou o placar: {formatCurrency(match.pool.carriedOver)} acumularam
					{match.pool.carriedOverToMatchId ? (
						<>
							{" "}para a{" "}
							<Link className="underline" href={`/admin/matches/${match.pool.carriedOverToMatchId}/report`}>
								próxima partida
							</Link>
							.
						</>
					) : (
						" e vão para a próxima partida que for aberta."
					)}
				</p>
			)}

			<div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
				{figures.map(([label, value, hint]) => (
					<Card key={label}>
						<CardHeader className="pb-1">
							<CardDescription>{label}</CardDescription>
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold tabular-nums">{value}</div>
							<p className="mt-1 text-xs text-muted-foreground">{hint}</p>
						</CardContent>
					</Card>
				))}
			</div>

			<div className="grid gap-6 lg:grid-cols-[2fr_3fr]">
				<Card>
					<CardHeader>
						<CardTitle>Placares apostados</CardTitle>
						<CardDescription>Quanto cada bilhete leva se esse for o placar final.</CardDescription>
					</CardHeader>
					<CardContent className="space-y-3">
						{data.distribution.map((row) => (
							<div key={`${row.homeScore}x${row.awayScore}`} className="grid gap-1">
								<div className="flex items-baseline justify-between text-sm">
									<span className={`font-semibold tabular-nums ${row.isResult ? "text-emerald-400" : ""}`}>
										{row.homeScore} × {row.awayScore}
										{row.isResult && " · resultado"}
									</span>
									<span className="text-muted-foreground">
										{row.tickets} bil. · {row.bettors} pessoa(s) · {formatCurrency(row.payoutPerTicket)}/bil.
									</span>
								</div>
								<div className="h-2 rounded bg-muted">
									<div
										className={`h-2 rounded ${row.isResult ? "bg-emerald-500" : "bg-blue-500"}`}
										style={{ width: `${(row.tickets / maxTickets) * 100}%` }}
									/>
								</div>
							</div>
						))}
						{!data.distribution.length && (
							<p className="text-sm text-muted-foreground">Nenhum palpite confirmado ainda.</p>
						)}
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>Pedidos por status</CardTitle>
					</CardHeader>
					<CardContent>
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Status</TableHead>
									<TableHead className="text-right">Pedidos</TableHead>
									<TableHead className="text-right">Valor</TableHead>
									<TableHead className="text-right">Tarifas</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{Object.entries(data.payments).map(([status, row]) => (
									<TableRow key={status}>
										<TableCell>
											<Link href={`/admin/payments?status=${status}&matchId=${match.id}`} className="hover:underline">
												{paymentStatus[status]?.label ?? status}
											</Link>
										</TableCell>
										<TableCell className="text-right tabular-nums">{row.orders}</TableCell>
										<TableCell className="text-right tabular-nums">{formatCurrency(row.amount)}</TableCell>
										<TableCell className="text-right tabular-nums">{formatCurrency(row.fees)}</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</CardContent>
				</Card>
			</div>

			<Card>
				<CardHeader>
					<CardTitle>Apostadores ({data.bettors.length})</CardTitle>
				</CardHeader>
				<CardContent className="overflow-x-auto">
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>Nome</TableHead>
								<TableHead>Palpite</TableHead>
								<TableHead className="text-right">Bilhetes</TableHead>
								<TableHead className="text-right">Valor</TableHead>
								<TableHead>Resultado</TableHead>
								<TableHead>Pedido</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{data.bettors.map((bettor) => (
								<TableRow key={bettor.betId}>
									<TableCell>
										{bettor.userId ? (
											<Link href={`/admin/users/${bettor.userId}`} className="font-medium hover:underline">
												{bettor.name}
											</Link>
										) : (
											<span className="font-medium">{bettor.name}</span>
										)}
										<div className="text-xs text-muted-foreground">
											{bettor.nickname ?? (bettor.userId ? "" : "sem conta")} {bettor.email}
										</div>
									</TableCell>
									<TableCell className="font-semibold tabular-nums">
										{bettor.homeScore} × {bettor.awayScore}
									</TableCell>
									<TableCell className="text-right tabular-nums">{bettor.tickets}</TableCell>
									<TableCell className="text-right tabular-nums">{formatCurrency(bettor.amount)}</TableCell>
									<TableCell>
										{bettor.resultStatus
											? `${bettor.resultStatus === "exact" ? "Cravou" : bettor.resultStatus === "partial" ? "Acertou o resultado" : "Errou"} · ${bettor.points} pts`
											: "—"}
									</TableCell>
									<TableCell className="font-mono text-xs">#{bettor.paymentId}</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</CardContent>
			</Card>

			{data.prizes.length > 0 && (
				<Card>
					<CardHeader>
						<CardTitle>Prêmios</CardTitle>
					</CardHeader>
					<CardContent className="flex flex-wrap gap-3 text-sm">
						{data.prizes.map((prize) => (
							<Link key={prize.id} href="/admin/prizes" className="rounded-md border px-3 py-2">
								{formatCurrency(prize.grossAmount)} · {prize.status === "paid" ? "pago" : "a pagar"}
							</Link>
						))}
					</CardContent>
				</Card>
			)}
		</div>
	);
}
