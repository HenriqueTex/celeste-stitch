"use client";

import { useState } from "react";
import { Copy, UserPlus } from "lucide-react";
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
import { formatDateTime } from "@/lib/format";
import { copyText } from "@/lib/utils";
import type { StaffMember } from "@/lib/types";

const ROLES = {
	admin: { label: "Administrador", hint: "Tudo, inclusive financeiro, prêmios, equipe e configurações." },
	operator: { label: "Operador", hint: "Partidas, times, pagamentos (consulta) e torcedores." },
};

export default function AdminStaffPage() {
	const { adminToken, isAdminLoggedIn, admin } = useAdminAuth();
	const { data: staff, reload } = useAdminResource<StaffMember[]>("/admin/staff");
	const [form, setForm] = useState({ fullName: "", email: "", role: "operator" });
	const [invite, setInvite] = useState("");

	if (!isAdminLoggedIn || !adminToken) return null;

	const call = async (path: string, body?: object, method = "POST") => {
		try {
			const result = await apiFetch<unknown>(path, {
				method,
				token: adminToken,
				body: body ? JSON.stringify(body) : undefined,
			});
			reload();
			return result;
		} catch (error) {
			toast.error(error instanceof Error ? error.message : "Não foi possível concluir.");
			return null;
		}
	};

	const create = async () => {
		const result = (await call("/admin/staff", form)) as { inviteUrl: string; emailed: boolean } | null;
		if (!result) return;
		setInvite(result.inviteUrl);
		setForm({ fullName: "", email: "", role: "operator" });
		toast.success(
			result.emailed
				? "Convite enviado por e-mail. O link também está abaixo."
				: "Membro criado. Envie o link abaixo para ele criar a senha.",
		);
	};

	return (
		<div className="max-w-5xl space-y-6">
			<div>
				<h1 className="text-2xl font-bold tracking-tight">Equipe</h1>
				<p className="text-sm text-muted-foreground">Quem acessa o admin e o que cada um pode fazer.</p>
			</div>

			<Card>
				<CardHeader>
					<CardTitle>Adicionar à equipe</CardTitle>
					<CardDescription>A pessoa recebe um link para criar a própria senha (vale 1 hora).</CardDescription>
				</CardHeader>
				<CardContent className="grid gap-4 sm:grid-cols-[1fr_1fr_auto_auto] sm:items-end">
					<div className="grid gap-1.5">
						<Label htmlFor="staff-name">Nome</Label>
						<Input id="staff-name" value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} />
					</div>
					<div className="grid gap-1.5">
						<Label htmlFor="staff-email">E-mail</Label>
						<Input id="staff-email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
					</div>
					<div className="grid gap-1.5">
						<Label htmlFor="staff-role">Papel</Label>
						<select
							id="staff-role"
							className="h-9 rounded-md border bg-background px-2 text-sm"
							value={form.role}
							onChange={(e) => setForm({ ...form, role: e.target.value })}
						>
							<option value="operator">Operador</option>
							<option value="admin">Administrador</option>
						</select>
					</div>
					<Button onClick={() => void create()} disabled={form.fullName.trim().length < 2 || !form.email.includes("@")}>
						<UserPlus className="mr-2 size-4" />
						Adicionar
					</Button>
					<p className="text-xs text-muted-foreground sm:col-span-4">
						{ROLES[form.role as keyof typeof ROLES].hint}
					</p>
				</CardContent>
				{invite && (
					<CardContent className="flex flex-wrap items-center gap-2 pt-0 text-sm">
						<span className="truncate font-mono text-xs">{invite}</span>
						<Button size="sm" variant="ghost" onClick={() => void copyText(invite).then(() => toast.success("Link copiado."))}>
							<Copy className="mr-1 size-3" /> Copiar
						</Button>
					</CardContent>
				)}
			</Card>

			<Card>
				<CardHeader>
					<CardTitle>Membros</CardTitle>
				</CardHeader>
				<CardContent className="overflow-x-auto">
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>Nome</TableHead>
								<TableHead>Papel</TableHead>
								<TableHead>2FA</TableHead>
								<TableHead>Último acesso</TableHead>
								<TableHead>Status</TableHead>
								<TableHead />
							</TableRow>
						</TableHeader>
						<TableBody>
							{staff?.map((member) => {
								const me = member.id === admin?.id;
								return (
									<TableRow key={member.id}>
										<TableCell>
											<div className="font-medium">
												{member.fullName ?? member.email}
												{me && <span className="text-muted-foreground"> (você)</span>}
											</div>
											<div className="text-xs text-muted-foreground">{member.email}</div>
										</TableCell>
										<TableCell>
											<select
												className="h-8 rounded-md border bg-background px-2 text-sm"
												value={member.role}
												disabled={me}
												aria-label={`Papel de ${member.email}`}
												onChange={(e) => void call(`/admin/staff/${member.id}`, { role: e.target.value }, "PATCH")}
											>
												<option value="operator">Operador</option>
												<option value="admin">Administrador</option>
											</select>
										</TableCell>
										<TableCell>
											<Badge variant={member.twoFactorEnabled ? "default" : "outline"}>
												{member.twoFactorEnabled ? "Ativo" : "Desligado"}
											</Badge>
										</TableCell>
										<TableCell className="text-sm text-muted-foreground">
											{member.lastLoginAt ? formatDateTime(member.lastLoginAt) : "Nunca"}
										</TableCell>
										<TableCell>
											<Badge variant={member.status === "active" ? "default" : "destructive"}>
												{member.status === "active" ? "Ativo" : "Bloqueado"}
											</Badge>
										</TableCell>
										<TableCell className="text-right">
											{!me && (
												<div className="flex justify-end gap-1">
													{member.twoFactorEnabled && (
														<Button size="sm" variant="ghost" onClick={() => void call(`/admin/staff/${member.id}/reset-2fa`)}>
															Resetar 2FA
														</Button>
													)}
													<Button
														size="sm"
														variant={member.status === "active" ? "destructive" : "outline"}
														onClick={() =>
															void call(
																`/admin/staff/${member.id}`,
																{ status: member.status === "active" ? "blocked" : "active" },
																"PATCH",
															)
														}
													>
														{member.status === "active" ? "Bloquear" : "Reativar"}
													</Button>
												</div>
											)}
										</TableCell>
									</TableRow>
								);
							})}
						</TableBody>
					</Table>
				</CardContent>
			</Card>
		</div>
	);
}
