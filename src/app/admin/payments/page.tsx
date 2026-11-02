"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Copy, Download, MoreHorizontal, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { useAdminAuth } from "@/components/AdminAuthContext";
import Pager from "@/components/admin/Pager";
import PeriodFilter from "@/components/admin/PeriodFilter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useAdminResource } from "@/hooks/use-admin-resource";
import { apiFetch, ApiError } from "@/lib/api";
import { downloadAdminFile, paymentStatus, queryString } from "@/lib/admin";
import { formatCurrency, formatDateTime } from "@/lib/format";
import { copyText } from "@/lib/utils";
import type { AdminPaymentItem, MatchItem, Paginated } from "@/lib/types";

type Action = { kind: "confirm" | "refund"; payment: AdminPaymentItem; force?: boolean } | null;

function PaymentsPage() {
	const { adminToken, isAdminLoggedIn, isAdmin } = useAdminAuth();
	const params = useSearchParams();
	const [status, setStatus] = useState(params.get("status") ?? "");
	const [matchId, setMatchId] = useState(params.get("matchId") ?? "");
	const [search, setSearch] = useState("");
	const [query, setQuery] = useState("");
	const [period, setPeriod] = useState({ from: "", to: "" });
	const [page, setPage] = useState(1);
	const [action, setAction] = useState<Action>(null);
	const [notes, setNotes] = useState("");
	const [reference, setReference] = useState("");
	const [busy, setBusy] = useState(false);

	const filters = { status, matchId, q: query, ...period };
	const { data, reload } = useAdminResource<Paginated<AdminPaymentItem>>(
		`/admin/payments${queryString({ ...filters, page })}`,
	);
	const { data: matches } = useAdminResource<MatchItem[]>("/admin/matches");

	if (!isAdminLoggedIn || !adminToken) return null;

	const filter = (apply: () => void) => {
		apply();
		setPage(1);
	};

	const sync = async (payment: AdminPaymentItem) => {
		try {
			const updated = await apiFetch<AdminPaymentItem>(`/admin/payments/${payment.id}/sync`, {
				method: "POST",
				token: adminToken,
			});
			toast.success(`Pedido #${payment.id}: Mercado Pago informa "${updated.providerStatus}".`);
			reload();
		} catch (error) {
			toast.error(error instanceof Error ? error.message : "Falha ao consultar.");
		}
	};

	const submitAction = async () => {
		if (!action) return;
		setBusy(true);
		try {
			if (action.kind === "confirm") {
				await apiFetch(`/admin/payments/${action.payment.id}/confirm`, {
					method: "POST",
					token: adminToken,
					body: JSON.stringify({ notes: notes || undefined, force: action.force ?? false }),
				});
				toast.success(`Pedido #${action.payment.id} confirmado.`);
			} else {
				await apiFetch(`/admin/payments/${action.payment.id}/refund`, {
					method: "POST",
					token: adminToken,
					body: JSON.stringify({ reference: reference || undefined, notes: notes || undefined }),
				});
				toast.success(`Pedido #${action.payment.id} estornado.`);
			}
			setAction(null);
			reload();
		} catch (error) {
			// The gateway disagrees with a manual confirmation: ask for a reason and force.
			if (error instanceof ApiError && error.status === 409 && action.kind === "confirm") {
				setAction({ ...action, force: true });
				toast.warning(error.message);
			} else {
				toast.error(error instanceof Error ? error.message : "Não foi possível concluir.");
				reload();
			}
		} finally {
			setBusy(false);
		}
	};

	return (
		<div className="space-y-6">
			<div className="flex flex-wrap items-end justify-between gap-4">
				<div>
					<h1 className="text-2xl font-bold tracking-tight">Pagamentos</h1>
					<p className="text-sm text-muted-foreground">
						Pedidos, conciliação com o Mercado Pago e estornos.
					</p>
				</div>
				<Button
					variant="outline"
					onClick={() =>
						void downloadAdminFile(
							`/admin/payments/export${queryString(filters)}`,
							adminToken,
							"pagamentos.csv",
						).catch(() => toast.error("Não foi possível exportar."))
					}
				>
					<Download className="mr-2 size-4" />
					Exportar CSV
				</Button>
			</div>

			<Card>
				<CardContent className="flex flex-wrap items-end gap-3 pt-6">
					<label className="grid gap-1 text-xs text-muted-foreground">
						Status
						<select
							className="h-9 rounded-md border bg-background px-2 text-sm text-foreground"
							value={status}
							onChange={(event) => filter(() => setStatus(event.target.value))}
						>
							<option value="">Todos</option>
							{Object.entries(paymentStatus).map(([value, item]) => (
								<option key={value} value={value}>
									{item.label}
								</option>
							))}
						</select>
					</label>
					<label className="grid gap-1 text-xs text-muted-foreground">
						Partida
						<select
							className="h-9 max-w-[240px] rounded-md border bg-background px-2 text-sm text-foreground"
							value={matchId}
							onChange={(event) => filter(() => setMatchId(event.target.value))}
						>
							<option value="">Todas</option>
							{matches?.map((match) => (
								<option key={match.id} value={match.id}>
									{match.homeTeam} × {match.awayTeam}
								</option>
							))}
						</select>
					</label>
					<form
						className="grid gap-1 text-xs text-muted-foreground"
						onSubmit={(event) => {
							event.preventDefault();
							filter(() => setQuery(search));
						}}
					>
						Buscar
						<Input
							className="h-9 w-[240px]"
							placeholder="Nome, e-mail, CPF, nº ou ID MP"
							value={search}
							onChange={(event) => setSearch(event.target.value)}
						/>
					</form>
					<PeriodFilter value={period} onChange={(next) => filter(() => setPeriod(next))} />
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle>Pedidos</CardTitle>
				</CardHeader>
				<CardContent className="overflow-x-auto">
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>Pedido</TableHead>
								<TableHead>Comprador</TableHead>
								<TableHead>Partida · placares</TableHead>
								<TableHead className="text-right">Valor</TableHead>
								<TableHead className="text-right">Tarifa / líquido</TableHead>
								<TableHead>Status</TableHead>
								<TableHead>Mercado Pago</TableHead>
								<TableHead />
							</TableRow>
						</TableHeader>
						<TableBody>
							{data?.data.map((payment) => {
								const badge = paymentStatus[payment.status] ?? paymentStatus.pending;
								return (
									<TableRow key={payment.id}>
										<TableCell>
											<div className="font-mono text-xs">#{payment.id}</div>
											<div className="text-xs text-muted-foreground">
												{formatDateTime(payment.createdAt)}
											</div>
										</TableCell>
										<TableCell>
											<div className="font-medium">{payment.buyer?.name ?? "—"}</div>
											<div className="text-xs text-muted-foreground">
												{payment.buyer?.email}
												{payment.buyer && !payment.buyer.userId && " · sem conta"}
											</div>
										</TableCell>
										<TableCell>
											<div>
												{payment.match ? `${payment.match.homeTeam} × ${payment.match.awayTeam}` : "—"}
											</div>
											<div className="text-xs text-muted-foreground">
												{payment.bets.map((bet) => `${bet.prediction} (${bet.tickets})`).join(", ")}
											</div>
										</TableCell>
										<TableCell className="text-right font-semibold tabular-nums">
											{formatCurrency(payment.amount)}
										</TableCell>
										<TableCell className="text-right text-xs tabular-nums text-muted-foreground">
											{payment.providerFee !== null ? formatCurrency(payment.providerFee) : "—"}
											<br />
											{payment.netAmount !== null ? formatCurrency(payment.netAmount) : "—"}
										</TableCell>
										<TableCell>
											<Badge variant={badge.variant}>{badge.label}</Badge>
											{payment.notes && (
												<div className="mt-1 max-w-[200px] truncate text-xs text-muted-foreground" title={payment.notes}>
													{payment.notes}
												</div>
											)}
										</TableCell>
										<TableCell>
											{payment.providerPaymentId ? (
												<button
													type="button"
													className="inline-flex items-center gap-1 font-mono text-xs hover:underline"
													title="Copiar ID do Mercado Pago"
													onClick={() =>
														void copyText(payment.providerPaymentId!).then(() =>
															toast.success("ID copiado. Busque-o em Atividade no Mercado Pago."),
														)
													}
												>
													{payment.providerPaymentId}
													<Copy className="size-3" />
												</button>
											) : (
												<span className="text-xs text-muted-foreground">manual</span>
											)}
											{payment.providerStatus && (
												<div className="text-xs text-muted-foreground">{payment.providerStatus}</div>
											)}
										</TableCell>
										<TableCell>
											<DropdownMenu>
												<DropdownMenuTrigger asChild>
													<Button variant="ghost" size="icon" className="size-7" aria-label={`Ações do pedido ${payment.id}`}>
														<MoreHorizontal className="size-4" />
													</Button>
												</DropdownMenuTrigger>
												<DropdownMenuContent align="end">
													{payment.providerPaymentId && (
														<DropdownMenuItem onClick={() => void sync(payment)}>
															<RefreshCw className="mr-2 size-4" />
															Consultar no Mercado Pago
														</DropdownMenuItem>
													)}
													{isAdmin && payment.status === "pending" && (
														<DropdownMenuItem
															onClick={() => {
																setNotes("");
																setAction({ kind: "confirm", payment });
															}}
														>
															Confirmar manualmente
														</DropdownMenuItem>
													)}
													{isAdmin && ["confirmed", "refund_pending"].includes(payment.status) && (
														<DropdownMenuItem
															onClick={() => {
																setNotes("");
																setReference("");
																setAction({ kind: "refund", payment });
															}}
														>
															{payment.status === "refund_pending" ? "Concluir estorno" : "Estornar"}
														</DropdownMenuItem>
													)}
												</DropdownMenuContent>
											</DropdownMenu>
										</TableCell>
									</TableRow>
								);
							})}
							{data && !data.data.length && (
								<TableRow>
									<TableCell colSpan={8} className="text-center text-muted-foreground">
										Nenhum pedido encontrado.
									</TableCell>
								</TableRow>
							)}
						</TableBody>
					</Table>
					{data && (
						<Pager page={data.meta.page} lastPage={data.meta.lastPage} total={data.meta.total} onPage={setPage} />
					)}
				</CardContent>
			</Card>

			<Dialog open={!!action} onOpenChange={(open) => !open && setAction(null)}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>
							{action?.kind === "confirm" ? "Confirmar pagamento" : "Estornar pedido"} #{action?.payment.id}
						</DialogTitle>
						<DialogDescription>
							{action?.kind === "confirm"
								? action.force
									? "O Mercado Pago não mostra este PIX como pago. Só confirme se você recebeu o dinheiro, e explique como."
									: "O sistema consulta o Mercado Pago antes de confirmar."
								: action?.payment.providerPaymentId
									? `Devolve ${formatCurrency(action.payment.amount)} pelo Mercado Pago. Se você já devolveu por fora, informe a referência.`
									: `Pagamento manual: devolva ${formatCurrency(action?.payment.amount ?? 0)} por PIX e informe a referência.`}
						</DialogDescription>
					</DialogHeader>
					<div className="grid gap-3">
						{action?.kind === "refund" && (
							<div className="grid gap-1.5">
								<Label htmlFor="refund-ref">Referência do estorno feito por fora (opcional)</Label>
								<Input id="refund-ref" value={reference} onChange={(event) => setReference(event.target.value)} />
							</div>
						)}
						<div className="grid gap-1.5">
							<Label htmlFor="action-notes">
								{action?.kind === "confirm" && action.force ? "Motivo (obrigatório)" : "Observação"}
							</Label>
							<Input id="action-notes" value={notes} onChange={(event) => setNotes(event.target.value)} />
						</div>
					</div>
					<DialogFooter>
						<Button variant="outline" onClick={() => setAction(null)}>
							Voltar
						</Button>
						<Button
							onClick={() => void submitAction()}
							disabled={
								busy ||
								(action?.kind === "confirm" && action.force && notes.trim().length < 5) ||
								(action?.kind === "refund" && !action.payment.providerPaymentId && !reference.trim())
							}
						>
							{busy ? "Aguarde…" : action?.kind === "confirm" ? "Confirmar" : "Estornar"}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	);
}

export default function AdminPaymentsPage() {
	return (
		<Suspense>
			<PaymentsPage />
		</Suspense>
	);
}
