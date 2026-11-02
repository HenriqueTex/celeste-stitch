"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, Copy, KeyRound, MessageCircle } from "lucide-react";
import { toast } from "sonner";
import { useAdminAuth } from "@/components/AdminAuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAdminResource } from "@/hooks/use-admin-resource";
import { apiFetch } from "@/lib/api";
import { paymentStatus, whatsappLink } from "@/lib/admin";
import { formatCurrency, formatDateTime } from "@/lib/format";
import { copyText } from "@/lib/utils";
import type { AdminUserDetail } from "@/lib/types";

const FIELDS = [
	{ key: "fullName", label: "Nome completo" },
	{ key: "nickname", label: "Apelido (aparece no ranking)" },
	{ key: "email", label: "E-mail" },
	{ key: "cpf", label: "CPF" },
	{ key: "phone", label: "Celular" },
	{ key: "pixKey", label: "Chave PIX" },
] as const;
type FieldKey = (typeof FIELDS)[number]["key"];

export default function AdminUserDetailPage() {
	const { id } = useParams<{ id: string }>();
	const { adminToken, isAdminLoggedIn } = useAdminAuth();
	const { data, reload } = useAdminResource<AdminUserDetail>(`/admin/users/${id}`);
	const [form, setForm] = useState<Record<FieldKey, string>>({
		fullName: "",
		nickname: "",
		email: "",
		cpf: "",
		phone: "",
		pixKey: "",
	});
	const [saving, setSaving] = useState(false);
	const [resetUrl, setResetUrl] = useState("");

	useEffect(() => {
		if (!data) return;
		const user = data.user;
		setForm({
			fullName: user.fullName ?? "",
			nickname: user.nickname ?? "",
			email: user.email,
			cpf: user.cpf ?? "",
			phone: user.phone ?? "",
			pixKey: user.pixKey ?? "",
		});
	}, [data]);

	if (!isAdminLoggedIn || !adminToken || !data) return null;
	const { user } = data;

	const save = async () => {
		setSaving(true);
		try {
			const changed = Object.fromEntries(
				FIELDS.filter(({ key }) => form[key] !== ((user[key] as string | null) ?? "")).map(
					({ key }) => [key, form[key]],
				),
			);
			await apiFetch(`/admin/users/${user.id}`, {
				method: "PATCH",
				token: adminToken,
				body: JSON.stringify(changed),
			});
			toast.success("Dados atualizados.");
			reload();
		} catch (error) {
			toast.error(error instanceof Error ? error.message : "Não foi possível salvar.");
		} finally {
			setSaving(false);
		}
	};

	const toggleBlock = async () => {
		await apiFetch(`/admin/users/${user.id}/status`, {
			method: "POST",
			token: adminToken,
			body: JSON.stringify({ status: user.status === "active" ? "blocked" : "active" }),
		});
		toast.success(user.status === "active" ? "Conta bloqueada." : "Conta reativada.");
		reload();
	};

	const issueReset = async () => {
		const result = await apiFetch<{ url: string; emailed: boolean }>(
			`/admin/users/${user.id}/password-reset`,
			{ method: "POST", token: adminToken },
		);
		setResetUrl(result.url);
		toast.success(
			result.emailed
				? "Link enviado por e-mail. Você também pode copiar abaixo."
				: "E-mail desligado: copie o link e envie ao torcedor.",
		);
	};

	return (
		<div className="max-w-5xl space-y-6">
			<div className="flex flex-wrap items-center justify-between gap-3">
				<div className="flex items-center gap-3">
					<Button variant="ghost" size="icon" asChild>
						<Link href="/admin/users" aria-label="Voltar para usuários">
							<ArrowLeft className="size-4" />
						</Link>
					</Button>
					<div>
						<h1 className="text-2xl font-bold tracking-tight">{user.fullName || user.email}</h1>
						<p className="text-sm text-muted-foreground">
							Cadastro em {formatDateTime(user.createdAt)}
							{user.lastLoginAt && ` · último acesso ${formatDateTime(user.lastLoginAt)}`}
						</p>
					</div>
				</div>
				<div className="flex flex-wrap gap-2">
					{user.phone && (
						<Button variant="outline" asChild>
							<a href={whatsappLink(user.phone)} target="_blank" rel="noreferrer">
								<MessageCircle className="mr-2 size-4" />
								WhatsApp
							</a>
						</Button>
					)}
					<Button variant="outline" onClick={() => void issueReset()}>
						<KeyRound className="mr-2 size-4" />
						Link de nova senha
					</Button>
					<Button variant={user.status === "active" ? "destructive" : "default"} onClick={() => void toggleBlock()}>
						{user.status === "active" ? "Bloquear" : "Reativar"}
					</Button>
				</div>
			</div>

			{resetUrl && (
				<div className="flex flex-wrap items-center gap-2 rounded-md border px-3 py-2 text-sm">
					<span className="truncate font-mono text-xs">{resetUrl}</span>
					<Button size="sm" variant="ghost" onClick={() => void copyText(resetUrl).then(() => toast.success("Link copiado."))}>
						<Copy className="mr-1 size-3" /> Copiar
					</Button>
					<span className="text-xs text-muted-foreground">Vale por 1 hora, uma vez.</span>
				</div>
			)}

			<div className="grid gap-4 sm:grid-cols-4">
				{[
					["Bilhetes", String(user.stats?.tickets ?? 0)],
					["Gasto", formatCurrency(user.stats?.spent ?? 0)],
					["Prêmios", formatCurrency(user.stats?.prizes ?? 0)],
					["Pontos", String(user.stats?.points ?? 0)],
				].map(([label, value]) => (
					<Card key={label}>
						<CardHeader className="pb-1">
							<CardDescription>{label}</CardDescription>
						</CardHeader>
						<CardContent className="text-xl font-bold tabular-nums">{value}</CardContent>
					</Card>
				))}
			</div>

			<Card>
				<CardHeader>
					<CardTitle>Dados</CardTitle>
					<CardDescription>Alterações ficam registradas na auditoria.</CardDescription>
				</CardHeader>
				<CardContent className="grid gap-4 sm:grid-cols-2">
					{FIELDS.map(({ key, label }) => (
						<div key={key} className="grid gap-1.5">
							<Label htmlFor={`user-${key}`}>{label}</Label>
							<Input
								id={`user-${key}`}
								value={form[key]}
								onChange={(event) => setForm({ ...form, [key]: event.target.value })}
							/>
						</div>
					))}
					<div className="sm:col-span-2">
						<Button onClick={() => void save()} disabled={saving}>
							{saving ? "Salvando…" : "Salvar dados"}
						</Button>
					</div>
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
								<TableHead>Partida</TableHead>
								<TableHead>Placares</TableHead>
								<TableHead className="text-right">Valor</TableHead>
								<TableHead>Status</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{data.orders.map((order) => {
								const badge = paymentStatus[order.status] ?? paymentStatus.pending;
								return (
									<TableRow key={order.id}>
										<TableCell>
											<div className="font-mono text-xs">#{order.id}</div>
											<div className="text-xs text-muted-foreground">{formatDateTime(order.createdAt)}</div>
										</TableCell>
										<TableCell>{order.match ? `${order.match.homeTeam} × ${order.match.awayTeam}` : "—"}</TableCell>
										<TableCell className="text-sm">
											{order.bets.map((bet) => (
												<div key={bet.id}>
													{bet.prediction} · {bet.tickets} bil.
													{bet.resultStatus && ` · ${bet.points} pts`}
												</div>
											))}
										</TableCell>
										<TableCell className="text-right tabular-nums">{formatCurrency(order.amount)}</TableCell>
										<TableCell>
											<Badge variant={badge.variant}>{badge.label}</Badge>
										</TableCell>
									</TableRow>
								);
							})}
							{!data.orders.length && (
								<TableRow>
									<TableCell colSpan={5} className="text-center text-muted-foreground">
										Nenhum pedido.
									</TableCell>
								</TableRow>
							)}
						</TableBody>
					</Table>
				</CardContent>
			</Card>

			{data.prizes.length > 0 && (
				<Card>
					<CardHeader>
						<CardTitle>Prêmios</CardTitle>
					</CardHeader>
					<CardContent>
						<Table>
							<TableBody>
								{data.prizes.map((prize) => (
									<TableRow key={prize.id}>
										<TableCell>{prize.match.homeTeam} × {prize.match.awayTeam}</TableCell>
										<TableCell className="text-right tabular-nums">{formatCurrency(prize.grossAmount)}</TableCell>
										<TableCell>
											<Badge variant={prize.status === "paid" ? "default" : "secondary"}>
												{prize.status === "paid" ? "Pago" : "A pagar"}
											</Badge>
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</CardContent>
				</Card>
			)}
		</div>
	);
}
