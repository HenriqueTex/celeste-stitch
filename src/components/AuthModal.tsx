"use client";

import { useEffect, useId, useRef, useState } from "react";
import { LogIn, UserRoundPlus, X } from "lucide-react";
import { useAuth } from "@/components/AuthContext";
import ClientField from "@/components/ClientField";
import Constellation from "@/components/Constellation";
import { useModalAccessibility } from "@/hooks/use-modal-accessibility";
import { formatCpf, formatPhone } from "@/lib/format";

type ModalView = "options" | "login" | "register";
type FieldName =
	| "name"
	| "email"
	| "password"
	| "confirmation"
	| "cpf"
	| "phone"
	| "pixKey";
type Values = Record<FieldName, string>;
const emptyValues: Values = {
	name: "",
	email: "",
	password: "",
	confirmation: "",
	cpf: "",
	phone: "",
	pixKey: "",
};

function validate(view: ModalView, values: Values) {
	const errors: Partial<Record<FieldName, string>> = {};
	if (!values.email.includes("@"))
		errors.email = "Informe um e-mail válido, como nome@email.com.";
	if (!values.password) errors.password = "Informe sua senha.";
	if (view === "login") return errors;
	if (values.name.trim().length < 2) errors.name = "Informe seu nome.";
	if (values.password.length < 8)
		errors.password = "A senha precisa ter pelo menos 8 caracteres.";
	if (values.confirmation !== values.password)
		errors.confirmation = "As senhas precisam ser iguais.";
	if (values.cpf.replace(/\D/g, "").length !== 11)
		errors.cpf = "Informe os 11 dígitos do CPF.";
	if (values.phone.replace(/\D/g, "").length < 10)
		errors.phone = "Informe o celular com DDD, por exemplo (31) 99999-9999.";
	if (values.pixKey.trim().length < 3)
		errors.pixKey = "Informe uma chave PIX: CPF, e-mail, celular ou aleatória.";
	return errors;
}

export default function AuthModal({
	open,
	initialView = "options",
	initialValues,
	onClose,
}: {
	open: boolean;
	initialView?: ModalView;
	initialValues?: Partial<Values>;
	onClose: () => void;
}) {
	const { login, register } = useAuth();
	const [view, setView] = useState<ModalView>(initialView);
	const [values, setValues] = useState<Values>(emptyValues);
	const [errors, setErrors] = useState<Partial<Record<FieldName, string>>>({});
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);
	const formRef = useRef<HTMLFormElement>(null);

	useEffect(() => {
		if (!open) return;
		setView(initialView);
		setValues({
			...emptyValues,
			...initialValues,
			cpf: formatCpf(initialValues?.cpf ?? ""),
			phone: formatPhone(initialValues?.phone ?? ""),
		});
		setErrors({});
		setError("");
	}, [open, initialView, initialValues]);

	const close = () => {
		if (loading) return;
		onClose();
	};
	const titleId = useId();
	const dialogRef = useModalAccessibility(open, close);

	if (!open) return null;

	const switchView = (next: ModalView) => {
		setView(next);
		setErrors({});
		setError("");
	};
	const field = (name: FieldName) => ({
		value: values[name],
		error: errors[name],
		onChange: (event: React.ChangeEvent<HTMLInputElement>) => {
			const raw = event.target.value;
			setValues((previous) => ({
				...previous,
				[name]:
					name === "cpf"
						? formatCpf(raw)
						: name === "phone"
							? formatPhone(raw)
							: raw,
			}));
			if (errors[name])
				setErrors((previous) => ({ ...previous, [name]: undefined }));
		},
	});

	const submit = async (event: React.FormEvent) => {
		event.preventDefault();
		setError("");
		const found = validate(view, values);
		setErrors(found);
		if (Object.keys(found).length) {
			requestAnimationFrame(() =>
				formRef.current
					?.querySelector<HTMLInputElement>("[aria-invalid='true']")
					?.focus(),
			);
			return;
		}
		try {
			setLoading(true);
			if (view === "login") await login(values.email, values.password);
			else
				await register({
					name: values.name,
					email: values.email,
					password: values.password,
					cpf: values.cpf,
					phone: values.phone,
					pixKey: values.pixKey,
				});
			onClose();
		} catch (reason) {
			setError(
				reason instanceof Error
					? reason.message
					: view === "login"
						? "Não foi possível entrar. Confira e-mail e senha."
						: "Não foi possível criar a conta. Tente novamente.",
			);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="client-modal-backdrop" onClick={close}>
			<div
				ref={dialogRef}
				role="dialog"
				aria-modal="true"
				aria-labelledby={titleId}
				tabIndex={-1}
				className="client-dialog"
				onClick={(event) => event.stopPropagation()}
			>
				<header className="client-dialog-header">
					<h2 id={titleId}>
						{view === "login"
							? "Entrar"
							: view === "register"
								? "Criar conta"
								: "Bolão Celeste"}
					</h2>
					<button
						type="button"
						className="icon-button"
						onClick={close}
						aria-label="Fechar"
					>
						<X size={20} aria-hidden="true" />
					</button>
				</header>

				{view === "options" ? (
					<div className="client-dialog-body auth-options">
						<Constellation className="auth-stars" />
						<p className="muted">
							Entre para acompanhar seus palpites e disputar o ranking da
							torcida.
						</p>
						<button
							type="button"
							className="client-button-primary"
							onClick={() => switchView("login")}
						>
							<LogIn size={18} aria-hidden="true" />
							Entrar na minha conta
						</button>
						<button
							type="button"
							className="client-button-secondary"
							onClick={() => switchView("register")}
						>
							<UserRoundPlus size={18} aria-hidden="true" />
							Criar conta
						</button>
					</div>
				) : (
					<form
						ref={formRef}
						noValidate
						onSubmit={submit}
						className="client-dialog-body identity-form"
					>
						{view === "register" && (
							<p className="muted">
								Com uma conta, seus palpites somam pontos no ranking e ficam no
								seu histórico.
							</p>
						)}
						{view === "register" && (
							<ClientField
								label="Nome completo"
								autoComplete="name"
								{...field("name")}
							/>
						)}
						<ClientField
							label="E-mail"
							type="email"
							autoComplete="email"
							{...field("email")}
						/>
						<ClientField
							label="Senha"
							type="password"
							autoComplete={
								view === "login" ? "current-password" : "new-password"
							}
							hint={view === "register" ? "Pelo menos 8 caracteres." : undefined}
							{...field("password")}
						/>
						{view === "register" && (
							<>
								<ClientField
									label="Confirme a senha"
									type="password"
									autoComplete="new-password"
									{...field("confirmation")}
								/>
								<ClientField
									label="CPF"
									inputMode="numeric"
									autoComplete="off"
									hint="Identifica quem fez o pagamento dos palpites."
									{...field("cpf")}
								/>
								<ClientField
									label="Celular com DDD"
									type="tel"
									autoComplete="tel"
									{...field("phone")}
								/>
								<ClientField
									label="Chave PIX para receber prêmios"
									autoComplete="off"
									hint="CPF, e-mail, celular ou chave aleatória."
									{...field("pixKey")}
								/>
							</>
						)}
						{error && (
							<p className="form-error" role="alert">
								{error}
							</p>
						)}
						<button
							type="submit"
							disabled={loading}
							className="client-button-primary"
						>
							{loading
								? view === "login"
									? "Entrando…"
									: "Criando conta…"
								: view === "login"
									? "Entrar"
									: "Criar conta"}
						</button>
						<p className="muted auth-switch">
							{view === "login" ? "Ainda não tem conta?" : "Já tem conta?"}{" "}
							<button
								type="button"
								className="text-link"
								onClick={() =>
									switchView(view === "login" ? "register" : "login")
								}
							>
								{view === "login" ? "Criar conta" : "Entrar"}
							</button>
						</p>
					</form>
				)}
			</div>
		</div>
	);
}
