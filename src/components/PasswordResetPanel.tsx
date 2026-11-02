"use client";

import { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import ClientField from "@/components/ClientField";
import { apiFetch } from "@/lib/api";

/** Without a token: asks for the e-mail. With one (from the e-mailed link): sets the new password. */
export default function PasswordResetPanel() {
	const token = useSearchParams().get("token");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmation, setConfirmation] = useState("");
	const [error, setError] = useState("");
	const [done, setDone] = useState("");
	const [loading, setLoading] = useState(false);

	const submit = async (event: React.FormEvent) => {
		event.preventDefault();
		setError("");
		if (token) {
			if (password.length < 8) return setError("A senha precisa ter pelo menos 8 caracteres.");
			if (password !== confirmation) return setError("As senhas precisam ser iguais.");
		} else if (!/^\S+@\S+\.\S+$/.test(email)) {
			return setError("Informe um e-mail válido, como nome@email.com.");
		}
		setLoading(true);
		try {
			const response = await apiFetch<{ message: string }>(
				token ? "/auth/reset-password" : "/auth/forgot-password",
				{
					method: "POST",
					body: JSON.stringify(
						token ? { token, password, passwordConfirmation: confirmation } : { email },
					),
				},
			);
			setDone(response.message);
		} catch (reason) {
			setError(reason instanceof Error ? reason.message : "Não foi possível continuar.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<section className="client-panel reset-panel" aria-labelledby="reset-heading">
			<h1 id="reset-heading">{token ? "Criar nova senha" : "Esqueci minha senha"}</h1>
			{done ? (
				<div className="identity-form">
					<p role="status">{done}</p>
					<Link href="/" className="client-button-primary">
						Voltar ao bolão
					</Link>
				</div>
			) : (
				<form className="identity-form" noValidate onSubmit={submit}>
					<p className="muted">
						{token
							? "Escolha uma senha com pelo menos 8 caracteres."
							: "Informe o e-mail da sua conta. Enviaremos um link para criar uma nova senha."}
					</p>
					{token ? (
						<>
							<ClientField
								label="Nova senha"
								type="password"
								autoComplete="new-password"
								value={password}
								onChange={(event) => setPassword(event.target.value)}
							/>
							<ClientField
								label="Confirme a nova senha"
								type="password"
								autoComplete="new-password"
								value={confirmation}
								onChange={(event) => setConfirmation(event.target.value)}
							/>
						</>
					) : (
						<ClientField
							label="E-mail"
							type="email"
							autoComplete="email"
							value={email}
							onChange={(event) => setEmail(event.target.value)}
						/>
					)}
					{error && (
						<p className="form-error" role="alert">
							{error}
						</p>
					)}
					<button type="submit" className="client-button-primary" disabled={loading}>
						{loading ? "Aguarde…" : token ? "Salvar nova senha" : "Enviar link"}
					</button>
				</form>
			)}
		</section>
	);
}
