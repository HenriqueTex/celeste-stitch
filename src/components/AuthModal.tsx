"use client";

import { useEffect, useState } from "react";
import MaterialIcon from "@/components/icons/MaterialIcon";
import { useAuth } from "@/components/AuthContext";

type ModalView = "options" | "login" | "register";

export default function AuthModal({
	open,
	initialView = "options",
	onClose,
}: {
	open: boolean;
	initialView?: ModalView;
	onClose: () => void;
}) {
	const { login, register } = useAuth();
	const [view, setView] = useState<ModalView>(initialView);
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [cpf, setCpf] = useState("");
	const [phone, setPhone] = useState("");
	const [pixKey, setPixKey] = useState("");
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);

	const fmtCpf = (v: string) =>
		v
			.replace(/\D/g, "")
			.slice(0, 11)
			.replace(/(\d{3})(\d)/, "$1.$2")
			.replace(/(\d{3})\.(\d{3})(\d)/, "$1.$2.$3")
			.replace(/\.(\d{3})(\d)/, ".$1-$2");

	const fmtPhone = (v: string) =>
		v
			.replace(/\D/g, "")
			.slice(0, 11)
			.replace(/^(\d{2})(\d)/, "($1) $2")
			.replace(/(\d{5})(\d)/, "$1-$2");

	useEffect(() => {
		if (open) {
			setView(initialView);
		}
	}, [open, initialView]);

	if (!open) return null;

	const resetAndClose = () => {
		setView("options");
		setName("");
		setEmail("");
		setPassword("");
		setConfirmPassword("");
		setCpf("");
		setPhone("");
		setPixKey("");
		setError("");
		setLoading(false);
		onClose();
	};

	const handleLogin = async (e: React.FormEvent) => {
		e.preventDefault();
		setError("");
		if (!email || !password) {
			setError("Preencha todos os campos.");
			return;
		}

		try {
			setLoading(true);
			await login(email, password);
			resetAndClose();
		} catch (err) {
			setError(err instanceof Error ? err.message : "Não foi possível entrar.");
		} finally {
			setLoading(false);
		}
	};

	const handleRegister = async (e: React.FormEvent) => {
		e.preventDefault();
		setError("");
		if (
			!name ||
			!email ||
			!password ||
			!confirmPassword ||
			!cpf ||
			!phone ||
			!pixKey
		) {
			setError("Preencha todos os campos.");
			return;
		}
		if (password !== confirmPassword) {
			setError("As senhas não conferem.");
			return;
		}
		if (password.length < 8) {
			setError("A senha deve ter pelo menos 8 caracteres.");
			return;
		}
		if (cpf.replace(/\D/g, "").length < 11) {
			setError("CPF inválido.");
			return;
		}
		if (phone.replace(/\D/g, "").length < 10) {
			setError("Telefone inválido.");
			return;
		}

		try {
			setLoading(true);
			await register({ name, email, password, cpf, phone, pixKey });
			resetAndClose();
		} catch (err) {
			setError(err instanceof Error ? err.message : "Não foi possível criar a conta.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div
			className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4"
			onClick={resetAndClose}
		>
			<div
				className="glass-panel w-full max-w-sm rounded-2xl p-6 relative animate-[modal-in_0.2s_ease-out]"
				onClick={(e) => e.stopPropagation()}
			>
				<button
					onClick={resetAndClose}
					className="absolute top-4 right-4 size-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
					aria-label="Fechar"
				>
					<MaterialIcon name="close" className="text-sm" />
				</button>

				{view === "options" && (
					<div className="flex flex-col items-center text-center">
						<div className="size-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
							<MaterialIcon name="hub" className="text-primary text-3xl" />
						</div>
						<h3 className="font-black uppercase italic text-lg mb-1">
							Bolão Celeste
						</h3>
						<p className="text-sm text-slate-400 mb-6">
							Entre para palpitar, competir e ganhar prêmios!
						</p>

						<button
							onClick={() => setView("login")}
							disabled={loading}
							className="w-full py-3.5 bg-primary hover:bg-blue-600 text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-2 mb-3 disabled:opacity-60"
						>
							<MaterialIcon name="login" className="text-lg" />
							Entrar na Conta
						</button>
						<button
							onClick={() => setView("register")}
							disabled={loading}
							className="w-full py-3.5 border border-white/10 hover:bg-white/5 font-bold rounded-xl transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
						>
							<MaterialIcon name="person_add" className="text-lg" />
							Criar Conta
						</button>
					</div>
				)}

				{view === "login" && (
					<div>
						<button
							onClick={() => {
								setView("options");
								setError("");
							}}
							className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-300 mb-4 transition-colors"
						>
							<MaterialIcon name="arrow_back" className="text-sm" />
							Voltar
						</button>

						<h3 className="font-black uppercase italic text-lg mb-1">Entrar</h3>
						<p className="text-sm text-slate-400 mb-5">
							Acesse sua conta para continuar
						</p>

						<form onSubmit={handleLogin} className="flex flex-col gap-3">
							<label className="text-[10px] font-bold uppercase text-slate-500 tracking-wider">
								E-mail
								<input
									type="email"
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									placeholder="seu@email.com"
									className="mt-1 w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm font-medium placeholder:text-slate-600 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-colors"
								/>
							</label>
							<label className="text-[10px] font-bold uppercase text-slate-500 tracking-wider">
								Senha
								<input
									type="password"
									value={password}
									onChange={(e) => setPassword(e.target.value)}
									placeholder="••••••••"
									className="mt-1 w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm font-medium placeholder:text-slate-600 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-colors"
								/>
							</label>

							{error && (
								<p className="text-red-400 text-xs font-bold" role="alert">
									{error}
								</p>
							)}

							<button
								type="submit"
								disabled={loading}
								className="w-full py-3.5 bg-primary hover:bg-blue-600 text-white font-bold rounded-xl transition-colors mt-1 disabled:opacity-60"
							>
								{loading ? "Entrando..." : "Entrar"}
							</button>
						</form>
					</div>
				)}

				{view === "register" && (
					<div>
						<button
							onClick={() => {
								setView("options");
								setError("");
							}}
							className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-300 mb-4 transition-colors"
						>
							<MaterialIcon name="arrow_back" className="text-sm" />
							Voltar
						</button>

						<h3 className="font-black uppercase italic text-lg mb-1">
							Criar Conta
						</h3>
						<p className="text-sm text-slate-400 mb-5">
							Junte-se à comunidade cruzeirense
						</p>

						<form onSubmit={handleRegister} className="flex flex-col gap-3">
							<label className="text-[10px] font-bold uppercase text-slate-500 tracking-wider">
								Nome
								<input
									type="text"
									value={name}
									onChange={(e) => setName(e.target.value)}
									placeholder="Seu nome ou apelido"
									className="mt-1 w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm font-medium placeholder:text-slate-600 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-colors"
								/>
							</label>
							<label className="text-[10px] font-bold uppercase text-slate-500 tracking-wider">
								E-mail
								<input
									type="email"
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									placeholder="seu@email.com"
									className="mt-1 w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm font-medium placeholder:text-slate-600 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-colors"
								/>
							</label>
							<label className="text-[10px] font-bold uppercase text-slate-500 tracking-wider">
								Senha
								<input
									type="password"
									value={password}
									onChange={(e) => setPassword(e.target.value)}
									placeholder="Mín. 8 caracteres"
									className="mt-1 w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm font-medium placeholder:text-slate-600 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-colors"
								/>
							</label>
							<label className="text-[10px] font-bold uppercase text-slate-500 tracking-wider">
								Confirmar Senha
								<input
									type="password"
									value={confirmPassword}
									onChange={(e) => setConfirmPassword(e.target.value)}
									placeholder="Repita a senha"
									className="mt-1 w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm font-medium placeholder:text-slate-600 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-colors"
								/>
							</label>
							<label className="text-[10px] font-bold uppercase text-slate-500 tracking-wider">
								CPF
								<input
									type="text"
									value={cpf}
									onChange={(e) => setCpf(fmtCpf(e.target.value))}
									placeholder="000.000.000-00"
									className="mt-1 w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm font-medium placeholder:text-slate-600 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-colors"
								/>
							</label>
							<label className="text-[10px] font-bold uppercase text-slate-500 tracking-wider">
								WhatsApp / Telefone
								<input
									type="tel"
									value={phone}
									onChange={(e) => setPhone(fmtPhone(e.target.value))}
									placeholder="(31) 99999-9999"
									className="mt-1 w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm font-medium placeholder:text-slate-600 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-colors"
								/>
							</label>
							<label className="text-[10px] font-bold uppercase text-slate-500 tracking-wider">
								Chave PIX (para receber prêmios)
								<input
									type="text"
									value={pixKey}
									onChange={(e) => setPixKey(e.target.value)}
									placeholder="CPF, e-mail, celular ou chave aleatória"
									className="mt-1 w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm font-medium placeholder:text-slate-600 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-colors"
								/>
							</label>

							{error && (
								<p className="text-red-400 text-xs font-bold" role="alert">
									{error}
								</p>
							)}

							<button
								type="submit"
								disabled={loading}
								className="w-full py-3.5 bg-primary hover:bg-blue-600 text-white font-bold rounded-xl transition-colors mt-1 disabled:opacity-60"
							>
								{loading ? "Criando..." : "Criar Conta"}
							</button>
						</form>
					</div>
				)}
			</div>
		</div>
	);
}
