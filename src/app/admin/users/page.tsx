"use client";

import { useState } from "react";
import Link from "next/link";
import { Download } from "lucide-react";
import { toast } from "sonner";
import { useAdminAuth } from "@/components/AdminAuthContext";
import Pager from "@/components/admin/Pager";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useAdminResource } from "@/hooks/use-admin-resource";
import { downloadAdminFile, queryString } from "@/lib/admin";
import { formatCurrency, formatShortDate } from "@/lib/format";
import type { AdminUserItem, Paginated } from "@/lib/types";

export default function AdminUsersPage() {
	const { adminToken, isAdminLoggedIn } = useAdminAuth();
	const [search, setSearch] = useState("");
	const [query, setQuery] = useState("");
	const [status, setStatus] = useState("");
	const [page, setPage] = useState(1);
	const { data } = useAdminResource<Paginated<AdminUserItem>>(
		`/admin/users${queryString({ q: query, status, page })}`,
	);

	if (!isAdminLoggedIn || !adminToken) return null;

	return (
		<div className="space-y-6">
			<div className="flex flex-wrap items-end justify-between gap-4">
				<div>
					<h1 className="text-2xl font-bold tracking-tight">Usuários</h1>
					<p className="text-sm text-muted-foreground">Torcedores com conta no bolão.</p>
				</div>
				<Button
					variant="outline"
					onClick={() =>
						void downloadAdminFile(
							`/admin/users/export${queryString({ q: query, status })}`,
							adminToken,
							"usuarios.csv",
						).catch(() => toast.error("Não foi possível exportar."))
					}
				>
					<Download className="mr-2 size-4" />
					Exportar CSV
				</Button>
			</div>

			<Card>
				<CardHeader className="flex flex-row flex-wrap items-end justify-between gap-3">
					<CardTitle>Torcedores</CardTitle>
					<div className="flex flex-wrap gap-2">
						<form
							onSubmit={(event) => {
								event.preventDefault();
								setQuery(search);
								setPage(1);
							}}
						>
							<Input
								className="h-9 w-[260px]"
								placeholder="Nome, apelido, e-mail, CPF ou celular"
								value={search}
								onChange={(event) => setSearch(event.target.value)}
							/>
						</form>
						<select
							className="h-9 rounded-md border bg-background px-2 text-sm"
							value={status}
							aria-label="Status"
							onChange={(event) => {
								setStatus(event.target.value);
								setPage(1);
							}}
						>
							<option value="">Todos</option>
							<option value="active">Ativos</option>
							<option value="blocked">Bloqueados</option>
						</select>
					</div>
				</CardHeader>
				<CardContent className="overflow-x-auto">
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>Torcedor</TableHead>
								<TableHead>Contato</TableHead>
								<TableHead className="text-right">Bilhetes</TableHead>
								<TableHead className="text-right">Gasto</TableHead>
								<TableHead className="text-right">Prêmios</TableHead>
								<TableHead className="text-right">Pontos</TableHead>
								<TableHead>Status</TableHead>
								<TableHead>Cadastro</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{data?.data.map((user) => (
								<TableRow key={user.id}>
									<TableCell>
										<Link href={`/admin/users/${user.id}`} className="font-medium hover:underline">
											{user.fullName || user.email}
										</Link>
										{user.nickname && (
											<div className="text-xs text-muted-foreground">{user.nickname}</div>
										)}
									</TableCell>
									<TableCell className="text-sm">
										<div>{user.email}</div>
										<div className="text-xs text-muted-foreground">{user.phone ?? "—"}</div>
									</TableCell>
									<TableCell className="text-right tabular-nums">{user.stats.tickets}</TableCell>
									<TableCell className="text-right tabular-nums">{formatCurrency(user.stats.spent)}</TableCell>
									<TableCell className="text-right tabular-nums">{formatCurrency(user.stats.prizes)}</TableCell>
									<TableCell className="text-right tabular-nums">{user.stats.points}</TableCell>
									<TableCell>
										<Badge variant={user.status === "active" ? "default" : "destructive"}>
											{user.status === "active" ? "Ativo" : "Bloqueado"}
										</Badge>
									</TableCell>
									<TableCell className="text-sm text-muted-foreground">
										{user.createdAt ? formatShortDate(user.createdAt) : "—"}
									</TableCell>
								</TableRow>
							))}
							{data && !data.data.length && (
								<TableRow>
									<TableCell colSpan={8} className="text-center text-muted-foreground">
										Nenhum torcedor encontrado.
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
