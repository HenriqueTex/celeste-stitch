"use client";

import { useEffect, useState } from "react";
import QRCode from "qrcode";
import { ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { useAdminAuth } from "@/components/AdminAuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { apiFetch } from "@/lib/api";
import { copyText } from "@/lib/utils";

export default function AdminSecurityPage() {
	const { adminToken, isAdminLoggedIn, admin, refreshAdmin } = useAdminAuth();
	const [setup, setSetup] = useState<{ secret: string; otpauthUrl: string } | null>(null);
	const [qr, setQr] = useState("");
	const [code, setCode] = useState("");
	const [recoveryCodes, setRecoveryCodes] = useState<string[]>([]);
	const [busy, setBusy] = useState(false);

	useEffect(() => {
		if (!setup) return;
		void QRCode.toDataURL(setup.otpauthUrl, { margin: 1, width: 220 }).then(setQr);
	}, [setup]);

	if (!isAdminLoggedIn || !adminToken) return null;
	const enabled = Boolean(admin?.twoFactorEnabled);

	const run = async <T,>(path: string, body?: object) => {
		setBusy(true);
		try {
			return await apiFetch<T>(path, {
				method: "POST",
				token: adminToken,
				body: body ? JSON.stringify(body) : undefined,
			});
		} catch (error) {
			toast.error(error instanceof Error ? error.message : "Não foi possível concluir.");
			return null;
		} finally {
			setBusy(false);
		}
	};

	return (
		<div className="max-w-2xl space-y-6">
			<div>
				<h1 className="text-2xl font-bold tracking-tight">Segurança</h1>
				<p className="text-sm text-muted-foreground">
					Verificação em duas etapas: além da senha, o login pede um código do celular.
				</p>
			</div>

			{recoveryCodes.length > 0 && (
				<Card className="border-amber-500/50">
					<CardHeader>
						<CardTitle>Guarde seus códigos de recuperação</CardTitle>
						<CardDescription>
							Cada um entra uma única vez se você perder o celular. Eles não aparecem de novo.
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-3">
						<div className="grid grid-cols-2 gap-2 font-mono text-sm">
							{recoveryCodes.map((item) => (
								<span key={item} className="rounded border px-2 py-1">
									{item}
								</span>
							))}
						</div>
						<Button
							variant="outline"
							onClick={() =>
								void copyText(recoveryCodes.join("\n")).then(() => toast.success("Códigos copiados."))
							}
						>
							Copiar códigos
						</Button>
					</CardContent>
				</Card>
			)}

			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<ShieldCheck className="size-5" />
						Verificação em duas etapas {enabled ? "ativa" : "desligada"}
					</CardTitle>
					<CardDescription>
						Funciona com Google Authenticator, Microsoft Authenticator, Authy e similares.
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					{!enabled && !setup && (
						<Button
							disabled={busy}
							onClick={async () => {
								const result = await run<{ secret: string; otpauthUrl: string }>("/admin/2fa/setup");
								if (result) setSetup(result);
							}}
						>
							Ativar verificação em duas etapas
						</Button>
					)}

					{!enabled && setup && (
						<div className="grid gap-4 sm:grid-cols-[auto_1fr] sm:items-start">
							{/* eslint-disable-next-line @next/next/no-img-element */}
							{qr && <img src={qr} alt="QR code para o app autenticador" width={220} height={220} className="rounded bg-white p-2" />}
							<div className="space-y-3 text-sm">
								<p>1. Abra o app autenticador e escaneie o QR code.</p>
								<p className="text-muted-foreground">
									Sem câmera? Digite a chave: <code className="break-all">{setup.secret}</code>
								</p>
								<p>2. Digite o código de 6 dígitos que aparece no app.</p>
								<div className="grid gap-1.5">
									<Label htmlFor="enable-code">Código</Label>
									<Input
										id="enable-code"
										inputMode="numeric"
										autoComplete="one-time-code"
										value={code}
										onChange={(e) => setCode(e.target.value)}
									/>
								</div>
								<Button
									disabled={busy || code.trim().length < 6}
									onClick={async () => {
										const result = await run<{ recoveryCodes: string[] }>("/admin/2fa/enable", { code });
										if (!result) return;
										setRecoveryCodes(result.recoveryCodes);
										setSetup(null);
										setCode("");
										await refreshAdmin();
										toast.success("Verificação em duas etapas ativada.");
									}}
								>
									Confirmar e ativar
								</Button>
							</div>
						</div>
					)}

					{enabled && (
						<div className="grid gap-3 sm:max-w-sm">
							<p className="text-sm text-muted-foreground">
								Para desligar, informe um código do app (ou de recuperação).
							</p>
							<Input
								aria-label="Código para desligar"
								inputMode="numeric"
								value={code}
								onChange={(e) => setCode(e.target.value)}
							/>
							<Button
								variant="destructive"
								disabled={busy || code.trim().length < 6}
								onClick={async () => {
									const result = await run("/admin/2fa/disable", { code });
									if (!result) return;
									setCode("");
									setRecoveryCodes([]);
									await refreshAdmin();
									toast.success("Verificação em duas etapas desligada.");
								}}
							>
								Desligar
							</Button>
						</div>
					)}
				</CardContent>
			</Card>
		</div>
	);
}
