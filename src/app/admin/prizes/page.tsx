"use client";

import { useState } from "react";
import { Copy, FileText, MessageCircle } from "lucide-react";
import { toast } from "sonner";
import { useAdminAuth } from "@/components/AdminAuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useAdminResource } from "@/hooks/use-admin-resource";
import { apiFetch } from "@/lib/api";
import { openAdminFile, queryString, whatsappLink } from "@/lib/admin";
import { formatCurrency, formatDateTime } from "@/lib/format";
import { copyText } from "@/lib/utils";
import type { AdminPrizeItem } from "@/lib/types";

const RECEIPT_TYPES = ["application/pdf", "image/png", "image/jpeg", "image/webp"];

export default function AdminPrizesPage() {
	const { adminToken, isAdminLoggedIn } = useAdminAuth();
	const [status, setStatus] = useState("pending");
	const { data: prizes, reload } = useAdminResource<AdminPrizeItem[]>(
		`/admin/prizes${queryString({ status })}`,
	);
	const [paying, setPaying] = useState<AdminPrizeItem | null>(null);
	const [reference, setReference] = useState("");
	const [receipt, setReceipt] = useState<File | null>(null);
	const [busy, setBusy] = useState(false);

	if (!isAdminLoggedIn || !adminToken) return null;
	const pendingTotal = (prizes ?? [])
		.filter((prize) => prize.status === "pending")
		.reduce((sum, prize) => sum + prize.grossAmount, 0);

	const pay = async () => {
		if (!paying) return;
		if (receipt && (!RECEIPT_TYPES.includes(receipt.type) || receipt.size > 5 * 1024 * 1024)) {
			toast.error("Comprovante: PDF, PNG, JPG ou WebP de até 5 MB.");
			return;
		}
		const body = new FormData();
		if (reference.trim()) body.append("paymentReference", reference.trim());
		if (receipt) body.append("receipt", receipt);
		setBusy(true);
		try {
			await apiFetch(`/admin/prizes/${paying.id}/pay`, { method: "POST", token: adminToken, body });
			toast.success(`Prêmio de ${formatCurrency(paying.grossAmount)} marcado como pago.`);
			setPaying(null);
			reload();
		} catch (error) {
			toast.error(error instanceof Error ? error.message : "Não foi possível registrar.");
		} finally {
			setBusy(false);
		}
	};

	return (
		<div className="space-y-6">
			<div className="flex flex-wrap items-end justify-between gap-4">
				<div>
					<h1 className="text-2xl font-bold tracking-tight">Prêmios</h1>
					<p className="text-sm text-muted-foreground">
						Envie o PIX para a chave do ganhador e registre o pagamento com o comprovante.
					</p>
				</div>
				<select
					className="h-9 rounded-md border bg-background px-2 text-sm"
					value={status}
					aria-label="Status"
					onChange={(event) => setStatus(event.target.value)}
				>
					<option value="pending">A pagar</option>
					<option value="paid">Pagos</option>
					<option value="">Todos</option>
				</select>
			</div>

			<Card>
				<CardHeader>
					<CardTitle>{status === "pending" ? "A pagar" : "Prêmios"}</CardTitle>
					{status === "pending" && (
						<CardDescription>Total a pagar: {formatCurrency(pendingTotal)}</CardDescription>
					)}
				</CardHeader>
				<CardContent className="overflow-x-auto">
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>Ganhador</TableHead>
								<TableHead>Chave PIX</TableHead>
								<TableHead>Partida · palpite</TableHead>
								<TableHead className="text-right">Valor</TableHead>
								<TableHead>Status</TableHead>
								<TableHead />
							</TableRow>
						</TableHeader>
						<TableBody>
							{prizes?.map((prize) => (
								<TableRow key={prize.id}>
									<TableCell>
										<div className="font-medium">{prize.winner.name}</div>
										<div className="text-xs text-muted-foreground">
											CPF {prize.winner.cpf} · {prize.winner.email}
											{prize.winner.guest && " · sem conta"}
										</div>
									</TableCell>
									<TableCell>
										<button
											type="button"
											className="inline-flex items-center gap-1 font-mono text-sm hover:underline"
											onClick={() =>
												void copyText(prize.winner.pixKey).then(() => toast.success("Chave PIX copiada."))
											}
										>
											{prize.winner.pixKey}
											<Copy className="size-3" />
										</button>
									</TableCell>
									<TableCell className="text-sm">
										<div>{prize.match.homeTeam} × {prize.match.awayTeam}</div>
										<div className="text-xs text-muted-foreground">
											{prize.bet.prediction} · {prize.bet.tickets} bil.
										</div>
									</TableCell>
									<TableCell className="text-right font-semibold tabular-nums">
										{formatCurrency(prize.grossAmount)}
									</TableCell>
									<TableCell>
										<Badge variant={prize.status === "paid" ? "default" : "secondary"}>
											{prize.status === "paid" ? "Pago" : "A pagar"}
										</Badge>
										{prize.paidAt && (
											<div className="text-xs text-muted-foreground">{formatDateTime(prize.paidAt)}</div>
										)}
									</TableCell>
									<TableCell>
										<div className="flex justify-end gap-1">
											<Button variant="ghost" size="icon" className="size-8" asChild>
												<a href={whatsappLink(prize.winner.phone)} target="_blank" rel="noreferrer" aria-label={`WhatsApp de ${prize.winner.name}`}>
													<MessageCircle className="size-4" />
												</a>
											</Button>
											{prize.hasReceipt && (
												<Button
													variant="ghost"
													size="icon"
													className="size-8"
													aria-label="Ver comprovante"
													onClick={() =>
														void openAdminFile(`/admin/prizes/${prize.id}/receipt`, adminToken).catch(() =>
															toast.error("Não foi possível abrir o comprovante."),
														)
													}
												>
													<FileText className="size-4" />
												</Button>
											)}
											{prize.status !== "paid" && (
												<Button
													size="sm"
													onClick={() => {
														setReference("");
														setReceipt(null);
														setPaying(prize);
													}}
												>
													Registrar pagamento
												</Button>
											)}
										</div>
									</TableCell>
								</TableRow>
							))}
							{prizes && !prizes.length && (
								<TableRow>
									<TableCell colSpan={6} className="text-center text-muted-foreground">
										Nenhum prêmio aqui.
									</TableCell>
								</TableRow>
							)}
						</TableBody>
					</Table>
				</CardContent>
			</Card>

			<Dialog open={!!paying} onOpenChange={(open) => !open && setPaying(null)}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Registrar pagamento do prêmio</DialogTitle>
						<DialogDescription>
							{paying && `${formatCurrency(paying.grossAmount)} para ${paying.winner.name}, chave ${paying.winner.pixKey}. O ganhador recebe um e-mail de confirmação.`}
						</DialogDescription>
					</DialogHeader>
					<div className="grid gap-3">
						<div className="grid gap-1.5">
							<Label htmlFor="prize-ref">ID da transação PIX (opcional)</Label>
							<Input id="prize-ref" value={reference} onChange={(event) => setReference(event.target.value)} />
						</div>
						<div className="grid gap-1.5">
							<Label htmlFor="prize-receipt">Comprovante (PDF ou imagem, até 5 MB)</Label>
							<Input
								id="prize-receipt"
								type="file"
								accept={RECEIPT_TYPES.join(",")}
								onChange={(event) => setReceipt(event.target.files?.[0] ?? null)}
							/>
						</div>
					</div>
					<DialogFooter>
						<Button variant="outline" onClick={() => setPaying(null)}>
							Voltar
						</Button>
						<Button onClick={() => void pay()} disabled={busy}>
							{busy ? "Enviando…" : "Marcar como pago"}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	);
}
