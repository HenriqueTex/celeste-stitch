"use client";
import { useId, useRef, useState } from "react";
import { ArrowRight, LogIn, UserRound } from "lucide-react";
import { useAuth } from "@/components/AuthContext";

export type IdentityMode =
	| "choice"
	| "account"
	| "login"
	| "register"
	| "guest";
export interface GuestData {
	name: string;
	email: string;
	cpf: string;
	phone: string;
	pixKey: string;
}
type FieldName = keyof GuestData | "password" | "confirmation";
const labels: Record<FieldName, string> = {
	name: "Nome completo",
	email: "E-mail",
	cpf: "CPF",
	phone: "Telefone",
	pixKey: "Chave PIX para receber prêmios",
	password: "Senha",
	confirmation: "Confirme a senha",
};

export default function IdentificationStep({
	mode,
	onModeChange,
	onReady,
	onBusy,
	onError,
}: {
	mode: IdentityMode;
	onModeChange: (mode: IdentityMode) => void;
	onReady: (guest?: GuestData) => Promise<void>;
	onBusy: (value: boolean) => void;
	onError: (message: string) => void;
}) {
	const { user, login, register, updateProfile } = useAuth();
	const [fields, setFields] = useState<Partial<Record<FieldName, string>>>({});
	const lock = useRef(false);
	const prefix = useId();
	const value = (name: FieldName) =>
		fields[name] ??
		(name === "name"
			? user?.fullName
			: name === "email"
				? user?.email
				: name === "cpf"
					? user?.cpf
					: name === "phone"
						? user?.phone
						: name === "pixKey"
							? user?.pixKey
							: "") ??
		"";
	const activeMode = user ? "account" : mode === "account" ? "choice" : mode;
	const switchMode = (next: IdentityMode) => {
		onError("");
		onModeChange(next);
	};
	if (activeMode === "choice")
		return (
			<div className="identity-choice">
				<h3>Como você quer continuar?</h3>
				<p className="muted">
					Seu placar está salvo. Escolha a opção que preferir.
				</p>
				<button className="identity-option" onClick={() => switchMode("login")}>
					<LogIn size={21} aria-hidden="true" />
					<span>
						<strong>Entrar na minha conta</strong>
						<small>Acompanhe seus palpites e participe do ranking.</small>
					</span>
					<ArrowRight size={18} aria-hidden="true" />
				</button>
				<button className="identity-option" onClick={() => switchMode("guest")}>
					<UserRound size={21} aria-hidden="true" />
					<span>
						<strong>Continuar sem conta</strong>
						<small>Sem histórico pessoal ou pontos no ranking.</small>
					</span>
					<ArrowRight size={18} aria-hidden="true" />
				</button>
				<p className="muted">
					Ainda não tem uma conta?{" "}
					<button className="text-link" onClick={() => switchMode("register")}>
						Criar conta
					</button>
				</p>
			</div>
		);

	const renderField = (name: FieldName) => {
		const id = prefix + name;
		const password = name === "password" || name === "confirmation";
		return (
			<div className="checkout-field" key={name}>
				<label htmlFor={id}>{labels[name]}</label>
				<input
					id={id}
					name={name}
					value={value(name)}
					required
					type={
						password
							? "password"
							: name === "email"
								? "email"
								: name === "phone"
									? "tel"
									: "text"
					}
					autoComplete={
						name === "name"
							? "name"
							: name === "email"
								? "email"
								: name === "phone"
									? "tel"
									: password
										? activeMode === "login"
											? "current-password"
											: "new-password"
										: "off"
					}
					inputMode={name === "cpf" ? "numeric" : undefined}
					minLength={
						name === "cpf"
							? 11
							: name === "phone"
								? 10
								: password && activeMode !== "login"
									? 8
									: name === "pixKey"
										? 3
										: name === "name"
											? 2
											: undefined
					}
					maxLength={
						name === "cpf"
							? 14
							: name === "phone"
								? 20
								: password
									? 32
									: name === "name"
										? 120
										: 140
					}
					onChange={(event) =>
						setFields((previous) => ({
							...previous,
							[name]: event.target.value,
						}))
					}
				/>
				{name === "pixKey" && (
					<small>Usada para o recebimento de um eventual prêmio.</small>
				)}
			</div>
		);
	};
	return (
		<form
			id="checkout-identity"
			className="identity-form"
			onSubmit={async (event) => {
				event.preventDefault();
				if (lock.current) return;
				lock.current = true;
				onBusy(true);
				onError("");
				try {
					if (activeMode === "login") {
						await login(value("email"), value("password"));
						onModeChange("account");
						return;
					}
					if (
						value("cpf").replace(/\D/g, "").length !== 11 ||
						value("phone").replace(/\D/g, "").length < 10
					)
						throw new Error("Confira o CPF (11 dígitos) e o telefone com DDD.");
					if (activeMode === "register") {
						if (value("password") !== value("confirmation"))
							throw new Error("As senhas precisam ser iguais.");
						await register({
							name: value("name"),
							email: value("email"),
							password: value("password"),
							cpf: value("cpf"),
							phone: value("phone"),
							pixKey: value("pixKey"),
						});
						onModeChange("account");
						return;
					}
					if (user) {
						const missing: { cpf?: string; phone?: string; pixKey?: string } =
							{};
						if (!user.cpf) missing.cpf = value("cpf");
						if (!user.phone) missing.phone = value("phone");
						if (!user.pixKey) missing.pixKey = value("pixKey");
						if (Object.keys(missing).length) await updateProfile(missing);
						await onReady();
					} else
						await onReady({
							name: value("name"),
							email: value("email"),
							cpf: value("cpf"),
							phone: value("phone"),
							pixKey: value("pixKey"),
						});
				} catch (reason) {
					onError(
						reason instanceof Error
							? reason.message
							: "Não foi possível continuar.",
					);
				} finally {
					lock.current = false;
					onBusy(false);
				}
			}}
		>
			{user ? (
				<>
					<h3>Seus dados</h3>
					<div className="identity-account">
						<strong>{user.fullName || user.nickname}</strong>
						<span>{user.email}</span>
					</div>
					{!user.cpf || !user.phone || !user.pixKey ? (
						<p className="muted">
							Complete os dados abaixo para continuar com seu palpite.
						</p>
					) : (
						<p className="muted">
							Cadastro completo. Confira o valor abaixo para gerar o pagamento.
						</p>
					)}
					{!user.cpf && renderField("cpf")}
					{!user.phone && renderField("phone")}
					{!user.pixKey && renderField("pixKey")}
				</>
			) : (
				<>
					<h3>
						{activeMode === "login"
							? "Entre na sua conta"
							: activeMode === "register"
								? "Crie sua conta"
								: "Seus dados para o palpite"}
					</h3>
					{activeMode === "guest" && (
						<p className="muted">
							Precisamos destes dados para identificar seu pagamento e um
							eventual prêmio. Este palpite não entra no ranking.
						</p>
					)}
					{activeMode !== "login" && renderField("name")}
					{renderField("email")}
					{activeMode !== "guest" && renderField("password")}
					{activeMode === "register" && renderField("confirmation")}
					{activeMode !== "login" && (
						<>
							{renderField("cpf")}
							{renderField("phone")}
							{renderField("pixKey")}
						</>
					)}
					<button
						type="button"
						className="text-link"
						onClick={() => switchMode("choice")}
					>
						Escolher outra forma de continuar
					</button>
				</>
			)}
		</form>
	);
}
