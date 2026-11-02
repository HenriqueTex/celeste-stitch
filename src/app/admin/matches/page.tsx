"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
	Plus,
	MoreHorizontal,
	CheckCircle2,
	Circle,
	Lock,
	FileClock,
} from "lucide-react";
import { useAdminAuth } from "@/components/AdminAuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { apiFetch } from "@/lib/api";
import { formatCurrency, formatDateTime } from "@/lib/format";
import type { MatchItem } from "@/lib/types";

const statusConfig: Record<
	string,
	{ label: string; variant: "default" | "secondary" | "outline"; icon: React.ElementType }
> = {
	draft: { label: "Rascunho", variant: "outline", icon: FileClock },
	open: { label: "Aberto", variant: "default", icon: Circle },
	closed: { label: "Fechado", variant: "secondary", icon: Lock },
	result_registered: { label: "Resultado", variant: "secondary", icon: CheckCircle2 },
	settled: { label: "Liquidado", variant: "outline", icon: CheckCircle2 },
	cancelled: { label: "Cancelado", variant: "outline", icon: Lock },
};

export default function AdminMatchesPage() {
	const { isAdminLoggedIn, isAdmin, isLoading, adminToken } = useAdminAuth();
	const router = useRouter();
	const [tab, setTab] = useState("all");
	const [matches, setMatches] = useState<MatchItem[]>([]);
	const [resultDialog, setResultDialog] = useState<MatchItem | null>(null);
	const [resultHome, setResultHome] = useState("");
	const [resultAway, setResultAway] = useState("");
	const [cancelDialog, setCancelDialog] = useState<MatchItem | null>(null);
	const [cancelReason, setCancelReason] = useState("");

	const loadMatches = async () => {
		if (!adminToken) return;
		const data = await apiFetch<MatchItem[]>("/admin/matches", { token: adminToken });
		setMatches(data);
	};

	useEffect(() => {
		if (!isLoading && !isAdminLoggedIn) router.replace("/admin/login");
	}, [isAdminLoggedIn, isLoading, router]);

	useEffect(() => {
		if (!adminToken) return;
		let cancelled = false;
		void apiFetch<MatchItem[]>("/admin/matches", { token: adminToken })
			.then((data) => {
				if (!cancelled) setMatches(data);
			})
			.catch(() => {
				if (!cancelled) setMatches([]);
			});
		return () => {
			cancelled = true;
		};
	}, [adminToken]);

	const filtered = useMemo(
		() => (tab === "all" ? matches : matches.filter((m) => m.status === tab)),
		[matches, tab]
	);

	async function runAction<T = unknown>(
		path: string,
		method = "POST",
		body?: Record<string, unknown>,
	): Promise<T | null> {
		if (!adminToken) return null;
		try {
			return await apiFetch<T>(path, {
				method,
				token: adminToken,
				body: body ? JSON.stringify(body) : undefined,
			});
		} catch (error) {
			toast.error(error instanceof Error ? error.message : "Não foi possível concluir.");
			return null;
		} finally {
			await loadMatches();
		}
	}

	async function settle(match: MatchItem) {
		const response = await runAction<{
			summary: { winners: number; prizePool: number; carryover: number; alreadySettled?: boolean };
		}>(`/admin/matches/${match.id}/settle`);
		if (!response) return;
		const { summary } = response;
		if (summary.alreadySettled) toast.info("Esta partida já estava liquidada.");
		else if (summary.winners > 0)
			toast.success(
				`${summary.winners} ganhador(es) dividem ${formatCurrency(summary.prizePool)}. Veja em Prêmios.`,
			);
		else
			toast.success(
				`Ninguém cravou: ${formatCurrency(summary.carryover)} acumulam para a próxima partida.`,
			);
	}

	if (!isAdminLoggedIn) return null;

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-2xl font-bold tracking-tight">Partidas</h1>
					<p className="text-muted-foreground text-sm">
						Gerencie abertura, fechamento, resultados e liquidação.
					</p>
				</div>
				<Button asChild>
					<Link href="/admin/matches/new">
						<Plus className="mr-2 size-4" />
						Nova Partida
					</Link>
				</Button>
			</div>

			<Tabs value={tab} onValueChange={setTab}>
				<TabsList>
					<TabsTrigger value="all">Todas</TabsTrigger>
					<TabsTrigger value="draft">Rascunhos</TabsTrigger>
					<TabsTrigger value="open">Abertas</TabsTrigger>
					<TabsTrigger value="closed">Fechadas</TabsTrigger>
					<TabsTrigger value="settled">Liquidadas</TabsTrigger>
					<TabsTrigger value="cancelled">Canceladas</TabsTrigger>
				</TabsList>
			</Tabs>

			<Card>
				<CardHeader>
					<CardTitle>Lista de Partidas</CardTitle>
					<CardDescription>
						{filtered.length} partida{filtered.length !== 1 ? "s" : ""}
					</CardDescription>
				</CardHeader>
				<CardContent>
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>Partida</TableHead>
								<TableHead>Competição</TableHead>
								<TableHead>Data</TableHead>
								<TableHead>Status</TableHead>
								<TableHead className="text-center">Bilhetes</TableHead>
								<TableHead className="text-right">Receita</TableHead>
								<TableHead>Resultado</TableHead>
								<TableHead />
							</TableRow>
						</TableHeader>
						<TableBody>
							{filtered.map((match) => {
								const config = statusConfig[match.status] ?? statusConfig.draft;
								const Icon = config.icon;
								return (
									<TableRow key={match.id}>
										<TableCell className="font-semibold">
											{match.homeTeam} × {match.awayTeam}
										</TableCell>
										<TableCell className="text-muted-foreground text-sm">
											{match.competition}
										</TableCell>
										<TableCell className="text-sm">
											{formatDateTime(match.scheduledAt)}
										</TableCell>
										<TableCell>
											<Badge variant={config.variant} className="gap-1">
												<Icon className="size-3" />
												{config.label}
											</Badge>
										</TableCell>
										<TableCell className="text-center">
											{match.stats.tickets}
										</TableCell>
										<TableCell className="text-right font-semibold">
											{formatCurrency(match.stats.revenue)}
										</TableCell>
										<TableCell>
											{match.result
												? `${match.result.homeScore} - ${match.result.awayScore}`
												: "—"}
											{!!match.pool?.bonus && (
												<div className="text-xs text-amber-500">
													+{formatCurrency(match.pool.bonus)} acumulado
												</div>
											)}
										</TableCell>
										<TableCell>
											<DropdownMenu>
												<DropdownMenuTrigger asChild>
													<Button variant="ghost" size="icon" className="size-7">
														<MoreHorizontal className="size-4" />
													</Button>
												</DropdownMenuTrigger>
												<DropdownMenuContent align="end">
													<DropdownMenuItem asChild>
														<Link href={`/admin/matches/${match.id}/report`}>Relatório</Link>
													</DropdownMenuItem>
													{["draft", "open", "closed"].includes(match.status) && (
														<DropdownMenuItem asChild>
															<Link href={`/admin/matches/${match.id}`}>Editar</Link>
														</DropdownMenuItem>
													)}
													{(match.status === "draft" || match.status === "closed") && (
														<DropdownMenuItem
															onClick={() => void runAction(`/admin/matches/${match.id}/open`)}
														>
															{match.status === "closed" ? "Reabrir apostas" : "Abrir apostas"}
														</DropdownMenuItem>
													)}
													{match.status === "open" && (
														<DropdownMenuItem
															onClick={() => void runAction(`/admin/matches/${match.id}/close`)}
														>
															Fechar apostas
														</DropdownMenuItem>
													)}
													{["open", "closed", "result_registered"].includes(match.status) && (
														<DropdownMenuItem
															onClick={() => {
																setResultDialog(match);
																setResultHome(match.result?.homeScore?.toString() ?? "");
																setResultAway(match.result?.awayScore?.toString() ?? "");
															}}
														>
															Registrar resultado
														</DropdownMenuItem>
													)}
													{isAdmin && match.status === "result_registered" && (
														<DropdownMenuItem onClick={() => void settle(match)}>
															Liquidar partida
														</DropdownMenuItem>
													)}
													{isAdmin && !["settled", "cancelled"].includes(match.status) && (
														<DropdownMenuItem
															className="text-destructive"
															onClick={() => {
																setCancelReason("");
																setCancelDialog(match);
															}}
														>
															Cancelar partida
														</DropdownMenuItem>
													)}
												</DropdownMenuContent>
											</DropdownMenu>
										</TableCell>
									</TableRow>
								);
							})}
						</TableBody>
					</Table>
				</CardContent>
			</Card>

			<Dialog open={!!resultDialog} onOpenChange={() => setResultDialog(null)}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Registrar Resultado</DialogTitle>
						<DialogDescription>
							{resultDialog?.homeTeam} × {resultDialog?.awayTeam}
						</DialogDescription>
					</DialogHeader>
					<div className="grid grid-cols-2 gap-3 py-2">
						<Input
							type="number"
							min={0}
							placeholder="Mandante"
							value={resultHome}
							onChange={(e) => setResultHome(e.target.value)}
						/>
						<Input
							type="number"
							min={0}
							placeholder="Visitante"
							value={resultAway}
							onChange={(e) => setResultAway(e.target.value)}
						/>
					</div>
					<DialogFooter>
						<Button variant="outline" onClick={() => setResultDialog(null)}>
							Cancelar
						</Button>
						<Button
							onClick={async () => {
								if (!resultDialog) return;
								await runAction(`/admin/matches/${resultDialog.id}/result`, "POST", {
									homeScore: Number(resultHome),
									awayScore: Number(resultAway),
								});
								setResultDialog(null);
							}}
							disabled={resultHome === "" || resultAway === ""}
						>
							Confirmar resultado
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
			<Dialog open={!!cancelDialog} onOpenChange={() => setCancelDialog(null)}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Cancelar partida</DialogTitle>
						<DialogDescription>
							{cancelDialog?.homeTeam} × {cancelDialog?.awayTeam}: os PIX pendentes são cancelados e
							os pagamentos confirmados são estornados pelo Mercado Pago. Não dá para desfazer.
						</DialogDescription>
					</DialogHeader>
					<Input
						placeholder="Motivo (ex.: jogo adiado sem data)"
						value={cancelReason}
						onChange={(e) => setCancelReason(e.target.value)}
					/>
					<DialogFooter>
						<Button variant="outline" onClick={() => setCancelDialog(null)}>
							Voltar
						</Button>
						<Button
							variant="destructive"
							disabled={cancelReason.trim().length < 3}
							onClick={async () => {
								if (!cancelDialog) return;
								const response = await runAction<{
									summary: { refunded: number; pendingCancelled: number; needsAttention: unknown[] };
								}>(`/admin/matches/${cancelDialog.id}/cancel`, "POST", { reason: cancelReason });
								setCancelDialog(null);
								if (!response) return;
								const { summary } = response;
								toast.success(
									`Partida cancelada: ${summary.refunded} estorno(s), ${summary.pendingCancelled} PIX pendente(s) cancelado(s).`,
								);
								if (summary.needsAttention.length)
									toast.warning(
										`${summary.needsAttention.length} pedido(s) precisam de estorno manual em Pagamentos.`,
									);
							}}
						>
							Cancelar e estornar
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	);
}
