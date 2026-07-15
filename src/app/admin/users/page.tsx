"use client";

import { useEffect, useState } from "react";
import { useAdminAuth } from "@/components/AdminAuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { apiFetch } from "@/lib/api";
import type { AdminUserItem } from "@/lib/types";

export default function AdminUsersPage() {
	const { adminToken, isAdminLoggedIn } = useAdminAuth();
	const [query, setQuery] = useState("");
	const [users, setUsers] = useState<AdminUserItem[]>([]);

	const loadUsers = async (search = "") => {
		if (!adminToken) return;
		const path = search ? `/admin/users?q=${encodeURIComponent(search)}` : "/admin/users";
		const data = await apiFetch<AdminUserItem[]>(path, { token: adminToken });
		setUsers(data);
	};

	useEffect(() => {
		if (!adminToken) return;
		let cancelled = false;
		const path = query ? `/admin/users?q=${encodeURIComponent(query)}` : "/admin/users";
		void apiFetch<AdminUserItem[]>(path, { token: adminToken })
			.then((data) => {
				if (!cancelled) setUsers(data);
			})
			.catch(() => {
				if (!cancelled) setUsers([]);
			});
		return () => {
			cancelled = true;
		};
	}, [adminToken, query]);

	if (!isAdminLoggedIn) return null;

	return (
		<Card>
			<CardHeader>
				<CardTitle>Usuários</CardTitle>
			</CardHeader>
			<CardContent className="space-y-4">
				<Input
					placeholder="Buscar por nome, apelido ou e-mail"
					value={query}
					onChange={(e) => setQuery(e.target.value)}
				/>
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Usuário</TableHead>
							<TableHead>E-mail</TableHead>
							<TableHead>Status</TableHead>
							<TableHead>Stats</TableHead>
							<TableHead />
						</TableRow>
					</TableHeader>
					<TableBody>
						{users.map((user) => (
							<TableRow key={user.id}>
								<TableCell>{user.nickname || user.fullName || "Torcedor"}</TableCell>
								<TableCell>{user.email}</TableCell>
								<TableCell>
									<Badge variant={user.status === "active" ? "default" : "secondary"}>
										{user.status === "active" ? "Ativo" : "Bloqueado"}
									</Badge>
								</TableCell>
								<TableCell className="text-xs text-muted-foreground">
									{user.stats.bets} apostas · {user.stats.payments} pagamentos ·{" "}
									{user.stats.prizes} em prêmios
								</TableCell>
								<TableCell>
									<Button
										size="sm"
										variant="outline"
										onClick={async () => {
											if (!adminToken) return;
											await apiFetch(`/admin/users/${user.id}/status`, {
												method: "POST",
												token: adminToken,
												body: JSON.stringify({
													status: user.status === "active" ? "blocked" : "active",
												}),
											});
											await loadUsers(query);
										}}
									>
										{user.status === "active" ? "Bloquear" : "Reativar"}
									</Button>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</CardContent>
		</Card>
	);
}
