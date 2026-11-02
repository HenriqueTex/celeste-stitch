"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import { useAdminAuth } from "@/components/AdminAuthContext";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const loginSchema = z.object({
	email: z.string().email("E-mail inválido"),
	password: z.string().min(6, "Mínimo 6 caracteres"),
});
type LoginForm = z.infer<typeof loginSchema>;

export default function AdminLoginPage() {
	const { adminLogin } = useAdminAuth();
	const router = useRouter();
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);
	// Second step for accounts with two-factor authentication.
	const [needsCode, setNeedsCode] = useState(false);
	const [code, setCode] = useState("");

	const form = useForm<LoginForm>({
		resolver: zodResolver(loginSchema),
		defaultValues: { email: "", password: "" },
	});

	async function onSubmit(values: LoginForm) {
		setError("");
		setLoading(true);
		try {
			const { twoFactorRequired } = await adminLogin(
				values.email,
				values.password,
				needsCode ? code : undefined,
			);
			if (twoFactorRequired) {
				setNeedsCode(true);
				return;
			}
			router.replace("/admin");
		} catch (err) {
			setError(
				err instanceof Error
					? err.message
					: "Credenciais inválidas. Verifique e-mail e senha."
			);
		} finally {
			setLoading(false);
		}
	}

	return (
		<div className="admin-root flex min-h-screen items-center justify-center bg-background p-4">
			<Card className="w-full max-w-sm shadow-lg">
				<CardHeader className="text-center">
					{/* eslint-disable-next-line @next/next/no-img-element */}
					<img
						src="/brand/icon.svg"
						alt=""
						width={48}
						height={48}
						className="mx-auto mb-2 size-12"
					/>
					<CardTitle className="text-xl">Acesso Administrativo</CardTitle>
					<CardDescription>Bolão Celeste — Painel de gestão</CardDescription>
				</CardHeader>
				<CardContent>
					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
							<FormField
								control={form.control}
								name="email"
								render={({ field }) => (
									<FormItem>
										<FormLabel>E-mail</FormLabel>
										<FormControl>
											<Input
												type="email"
												placeholder="admin@bolaoceleste.com"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="password"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Senha</FormLabel>
										<FormControl>
											<Input type="password" placeholder="••••••" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							{needsCode && (
								<div className="grid gap-2">
									<label htmlFor="admin-2fa" className="text-sm font-medium">
										Código de verificação
									</label>
									<Input
										id="admin-2fa"
										inputMode="numeric"
										autoComplete="one-time-code"
										autoFocus
										placeholder="000000"
										value={code}
										onChange={(event) => setCode(event.target.value)}
									/>
									<p className="text-xs text-muted-foreground">
										Use o código do app autenticador ou um código de recuperação.
									</p>
								</div>
							)}
							{error && (
								<p className="text-sm text-destructive">{error}</p>
							)}
							<Button
								type="submit"
								className="w-full"
								disabled={loading || (needsCode && code.trim().length < 6)}
							>
								{loading ? (
									<>
										<Loader2 className="mr-2 size-4 animate-spin" />
										Entrando...
									</>
								) : (
									needsCode ? "Verificar e entrar" : "Entrar"
								)}
							</Button>
						</form>
					</Form>
				</CardContent>
			</Card>
		</div>
	);
}
