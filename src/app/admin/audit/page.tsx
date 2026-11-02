"use client";

import { useState } from "react";
import { useAdminAuth } from "@/components/AdminAuthContext";
import Pager from "@/components/admin/Pager";
import PeriodFilter from "@/components/admin/PeriodFilter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useAdminResource } from "@/hooks/use-admin-resource";
import { queryString } from "@/lib/admin";
import { formatDateTime } from "@/lib/format";
import type { AuditLogItem, Paginated } from "@/lib/types";

const ACTIONS: Record<string, string> = {
	"match.created": "Criou partida",
	"match.updated": "Editou partida",
	"match.opened": "Abriu apostas",
	"match.closed": "Fechou apostas",
	"match.result_registered": "Lançou resultado",
	"match.settled": "Liquidou partida",
	"match.cancelled": "Cancelou partida",
	"payment.confirmed": "Confirmou pagamento",
	"payment.synced": "Consultou Mercado Pago",
	"payment.refunded": "Estornou pagamento",
	"prize.paid": "Pagou prêmio",
	"user.updated": "Editou torcedor",
	"user.status_updated": "Mudou status de torcedor",
	"user.password_reset_issued": "Gerou link de senha",
	"settings.updated": "Mudou configurações",
	"staff.created": "Adicionou à equipe",
	"staff.updated": "Mudou acesso da equipe",
	"staff.two_factor_enabled": "Ativou 2FA",
	"staff.two_factor_disabled": "Desativou 2FA",
	"staff.two_factor_reset": "Resetou 2FA de alguém",
};

const ENTITY_LINK: Record<string, (id: string) => string> = {
	match: (id) => `/admin/matches/${id}/report`,
	user: (id) => `/admin/users/${id}`,
	payment: (id) => `/admin/payments?q=${id}`,
};

export default function AdminAuditPage() {
	const { isAdminLoggedIn } = useAdminAuth();
	const [scope, setScope] = useState("");
	const [period, setPeriod] = useState({ from: "", to: "" });
	const [page, setPage] = useState(1);
	const { data } = useAdminResource<Paginated<AuditLogItem>>(
		`/admin/audit-logs${queryString({ action: scope, ...period, page })}`,
	);
	if (!isAdminLoggedIn) return null;

	return (
		<div className="space-y-6">
			<div className="flex flex-wrap items-end justify-between gap-4">
				<div>
					<h1 className="text-2xl font-bold tracking-tight">Auditoria</h1>
					<p className="text-sm text-muted-foreground">Tudo o que a equipe fez no admin.</p>
				</div>
				<div className="flex flex-wrap items-end gap-2">
					<select
						className="h-8 rounded-md border bg-background px-2 text-sm"
						value={scope}
						aria-label="Tipo de ação"
						onChange={(event) => {
							setScope(event.target.value);
							setPage(1);
						}}
					>
						<option value="">Todas as ações</option>
						<option value="match.">Partidas</option>
						<option value="payment.">Pagamentos</option>
						<option value="prize.">Prêmios</option>
						<option value="user.">Torcedores</option>
						<option value="staff.">Equipe</option>
						<option value="settings.">Configurações</option>
					</select>
					<PeriodFilter
						value={period}
						onChange={(next) => {
							setPeriod(next);
							setPage(1);
						}}
					/>
				</div>
			</div>
			<Card>
				<CardHeader>
					<CardTitle>Registro</CardTitle>
				</CardHeader>
				<CardContent className="overflow-x-auto">
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>Quando</TableHead>
								<TableHead>Quem</TableHead>
								<TableHead>Ação</TableHead>
								<TableHead>Item</TableHead>
								<TableHead>Detalhes</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{data?.data.map((log) => {
								const link = log.entityId ? ENTITY_LINK[log.entityType]?.(log.entityId) : undefined;
								return (
									<TableRow key={log.id}>
										<TableCell className="whitespace-nowrap text-sm">{formatDateTime(log.createdAt)}</TableCell>
										<TableCell className="text-sm">{log.admin?.name ?? "Sistema"}</TableCell>
										<TableCell className="text-sm">{ACTIONS[log.action] ?? log.action}</TableCell>
										<TableCell className="text-sm">
											{link ? (
												<a href={link} className="hover:underline">
													{log.entityType} #{log.entityId}
												</a>
											) : (
												`${log.entityType}${log.entityId ? ` #${log.entityId}` : ""}`
											)}
										</TableCell>
										<TableCell className="max-w-[360px]">
											{log.metadata && (
												<code className="block truncate text-xs text-muted-foreground" title={JSON.stringify(log.metadata, null, 2)}>
													{JSON.stringify(log.metadata)}
												</code>
											)}
										</TableCell>
									</TableRow>
								);
							})}
							{data && !data.data.length && (
								<TableRow>
									<TableCell colSpan={5} className="text-center text-muted-foreground">
										Nada registrado.
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
		</div>
	);
}
