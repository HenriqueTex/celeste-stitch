"use client";

import { useCallback, useEffect, useId, useMemo, useState } from "react";
import MaterialIcon from "@/components/icons/MaterialIcon";
import { useAuth } from "@/components/AuthContext";
import { useModalAccessibility } from "@/hooks/use-modal-accessibility";
import { apiFetch } from "@/lib/api";
import { formatCurrency } from "@/lib/format";
import type {
	BetOrderResponse,
	MatchItem,
	PaymentItem,
	PaymentStatusResponse,
} from "@/lib/types";

type Step =
	| "choice"
	| "login"
	| "register"
	| "data"
	| "lineup"
	| "payment"
	| "confirmation";

interface PredictionLine {
	id: string;
	home: number;
	away: number;
	tickets: number;
}

type Mode = "authenticated" | "guest";

interface BetModalProps {
	open: boolean;
	onClose: () => void;
	prediction: { home: number; away: number };
	match: MatchItem | null;
}

interface BetData {
	name: string;
	cpf: string;
	email: string;
	phone: string;
	pixKey: string;
}

const STEPS_AUTH: Step[] = ["lineup", "payment", "confirmation"];
const STEPS_GUEST: Step[] = ["data", "lineup", "payment", "confirmation"];

function makeLineId() {
	return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function fmtCPF(v: string) {
	return v
		.replace(/\D/g, "")
		.slice(0, 11)
		.replace(/(\d{3})(\d)/, "$1.$2")
		.replace(/(\d{3})\.(\d{3})(\d)/, "$1.$2.$3")
		.replace(/\.(\d{3})(\d)/, ".$1-$2");
}

function fmtPhone(v: string) {
	return v
		.replace(/\D/g, "")
		.slice(0, 11)
		.replace(/^(\d{2})(\d)/, "($1) $2")
		.replace(/(\d{5})(\d)/, "$1-$2");
}

function generateQR(content: string) {
	return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(content)}`;
}

function FieldLabel({ children }: { children: React.ReactNode }) {
	return (
		<label className="text-xs font-black uppercase tracking-wider text-slate-300 mb-1 block">
			{children}
		</label>
	);
}

function Input({
	value,
	onChange,
	placeholder,
	type = "text",
	disabled,
}: {
	value: string;
	onChange: (v: string) => void;
	placeholder?: string;
	type?: string;
	disabled?: boolean;
}) {
	return (
		<input
			type={type}
			value={value}
			onChange={(e) => onChange(e.target.value)}
			placeholder={placeholder}
			disabled={disabled}
			className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm font-medium placeholder:text-slate-600 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
		/>
	);
}

function StepIndicator({ current, mode }: { current: Step; mode: Mode }) {
	const steps = mode === "guest" ? STEPS_GUEST : STEPS_AUTH;
	if (!steps.includes(current)) return null;
	const idx = steps.indexOf(current);
	return (
		<div className="flex items-center justify-center gap-2 mb-6">
			{steps.map((s, i) => (
				<div key={s} className="flex items-center gap-2">
					<div
						className={`size-6 rounded-full flex items-center justify-center text-xs font-black transition-all ${
							i < idx
								? "bg-emerald-500 text-white"
								: i === idx
									? "bg-primary text-white"
									: "bg-white/10 text-slate-300"
						}`}
					>
						{i < idx ? <MaterialIcon name="check" className="text-[12px]" /> : i + 1}
					</div>
					{i < steps.length - 1 && (
						<div
							className={`w-8 h-0.5 rounded ${
								i < idx ? "bg-emerald-500" : "bg-white/10"
							}`}
						/>
					)}
				</div>
			))}
		</div>
	);
}

export default function BetModal({
	open,
	onClose,
	prediction,
	match,
}: BetModalProps) {
	const { user, token, isLoggedIn, login, register } = useAuth();
	const [mode, setMode] = useState<Mode>("authenticated");
	const [step, setStep] = useState<Step>("choice");
	const [lines, setLines] = useState<PredictionLine[]>([]);
	const [pixCopied, setPixCopied] = useState(false);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");
	const [order, setOrder] = useState<{
		bets: BetOrderResponse["bets"];
		payment: PaymentItem;
	} | null>(null);
	const [paymentStatus, setPaymentStatus] = useState<string | null>(null);
	const [data, setData] = useState<BetData>({
		name: "",
		cpf: "",
		email: "",
		phone: "",
		pixKey: "",
	});
	const [errors, setErrors] = useState<Partial<BetData>>({});
	const [authForm, setAuthForm] = useState({
		name: "",
		email: "",
		password: "",
		confirmPassword: "",
		cpf: "",
		phone: "",
		pixKey: "",
	});

	useEffect(() => {
		if (!open) return;
		setLines([
			{
				id: makeLineId(),
				home: prediction.home,
				away: prediction.away,
				tickets: 1,
			},
		]);
		if (isLoggedIn) {
			setMode("authenticated");
			setStep("lineup");
		} else {
			setStep("choice");
		}
	}, [open, isLoggedIn, prediction.home, prediction.away]);

	useEffect(() => {
		if (open && mode === "authenticated" && user) {
			setData({
				name: user.fullName || user.nickname || "",
				cpf: user.cpf || "",
				email: user.email || "",
				phone: user.phone || "",
				pixKey: user.pixKey || "",
			});
		}
	}, [open, mode, user]);

	useEffect(() => {
		if (!open || !order) return;
		if (step !== "payment" && step !== "confirmation") return;
		if ((paymentStatus ?? order.payment.status) !== "pending") return;

		const interval = setInterval(async () => {
			try {
				const result = await apiFetch<PaymentStatusResponse>(
					`/payments/${order.payment.id}/status`
				);
				if (result.status !== "pending") {
					setPaymentStatus(result.status);
				}
			} catch {
				// tenta de novo na próxima rodada
			}
		}, 5000);

		return () => clearInterval(interval);
	}, [open, order, step, paymentStatus]);

	useEffect(() => {
		if (step === "payment" && paymentStatus === "confirmed") {
			setStep("confirmation");
		}
	}, [step, paymentStatus]);

	const handleClose = useCallback(() => {
		setStep("choice");
		setMode("authenticated");
		setLines([]);
		setPixCopied(false);
		setLoading(false);
		setError("");
		setErrors({});
		setOrder(null);
		setPaymentStatus(null);
		setData({ name: "", cpf: "", email: "", phone: "", pixKey: "" });
		setAuthForm({
			name: "",
			email: "",
			password: "",
			confirmPassword: "",
			cpf: "",
			phone: "",
			pixKey: "",
		});
		onClose();
	}, [onClose]);
	const titleId = useId();
	const dialogRef = useModalAccessibility(open && Boolean(match), handleClose);

	const totalTickets = useMemo(
		() => lines.reduce((sum, l) => sum + l.tickets, 0),
		[lines]
	);
	const total = useMemo(
		() => totalTickets * Number(match?.ticketPrice ?? 0),
		[totalTickets, match?.ticketPrice]
	);

	if (!open || !match) return null;

	function validateData() {
		const e: Partial<BetData> = {};
		if (!data.name.trim()) e.name = "Obrigatório";
		if (data.cpf.replace(/\D/g, "").length < 11) e.cpf = "CPF inválido";
		if (!data.email.includes("@")) e.email = "E-mail inválido";
		if (data.phone.replace(/\D/g, "").length < 10) e.phone = "Telefone inválido";
		if (!data.pixKey.trim()) e.pixKey = "Obrigatório";
		setErrors(e);
		return Object.keys(e).length === 0;
	}

	function handleDataNext() {
		// Only used by guest mode — authenticated users skip this step.
		if (!validateData()) return;
		setStep("lineup");
	}

	function updateLine(id: string, patch: Partial<PredictionLine>) {
		setLines((prev) => prev.map((l) => (l.id === id ? { ...l, ...patch } : l)));
	}

	function addLine() {
		setLines((prev) => [
			...prev,
			{ id: makeLineId(), home: 0, away: 0, tickets: 1 },
		]);
	}

	function removeLine(id: string) {
		setLines((prev) => (prev.length > 1 ? prev.filter((l) => l.id !== id) : prev));
	}

	async function handleCreateBet() {
		if (lines.length === 0) return;
		const predictions = lines.map((l) => ({
			homeScorePrediction: l.home,
			awayScorePrediction: l.away,
			tickets: l.tickets,
		}));

		try {
			setLoading(true);
			setError("");
			const response =
				mode === "authenticated" && token
					? await apiFetch<BetOrderResponse>("/bets", {
							method: "POST",
							token,
							body: JSON.stringify({
								matchId: match?.id,
								predictions,
							}),
						})
					: await apiFetch<BetOrderResponse>("/bets/guest", {
							method: "POST",
							body: JSON.stringify({
								matchId: match?.id,
								predictions,
								name: data.name,
								cpf: data.cpf,
								email: data.email,
								phone: data.phone,
								pixKey: data.pixKey,
							}),
						});
			setOrder({ bets: response.bets, payment: response.payment });
			setStep("payment");
		} catch (err) {
			setError(err instanceof Error ? err.message : "Não foi possível criar a aposta.");
		} finally {
			setLoading(false);
		}
	}

	async function handleLogin() {
		if (!authForm.email || !authForm.password) {
			setError("Preencha e-mail e senha.");
			return;
		}
		try {
			setLoading(true);
			setError("");
			await login(authForm.email, authForm.password);
			setMode("authenticated");
			setStep("lineup");
		} catch (err) {
			setError(err instanceof Error ? err.message : "Não foi possível entrar.");
		} finally {
			setLoading(false);
		}
	}

	async function handleRegister() {
		if (
			!authForm.name ||
			!authForm.email ||
			!authForm.password ||
			!authForm.confirmPassword ||
			!authForm.cpf ||
			!authForm.phone ||
			!authForm.pixKey
		) {
			setError("Preencha todos os campos.");
			return;
		}
		if (authForm.password !== authForm.confirmPassword) {
			setError("Senhas não conferem.");
			return;
		}
		if (authForm.cpf.replace(/\D/g, "").length < 11) {
			setError("CPF inválido.");
			return;
		}
		if (authForm.phone.replace(/\D/g, "").length < 10) {
			setError("Telefone inválido.");
			return;
		}
		try {
			setLoading(true);
			setError("");
			await register({
				name: authForm.name,
				email: authForm.email,
				password: authForm.password,
				cpf: authForm.cpf,
				phone: authForm.phone,
				pixKey: authForm.pixKey,
			});
			setMode("authenticated");
			setStep("lineup");
		} catch (err) {
			setError(err instanceof Error ? err.message : "Não foi possível cadastrar.");
		} finally {
			setLoading(false);
		}
	}

	const headerLabel = `${match.homeTeam} × ${match.awayTeam}`;
	const pixCode = order?.payment?.pixCode ?? "";
	const maxTicketsPerLine = 50;

	return (
		<div
			className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-sm px-0 sm:px-4"
			onClick={handleClose}
		>
			<div
				ref={dialogRef}
				role="dialog"
				aria-modal="true"
				aria-labelledby={titleId}
				tabIndex={-1}
				className="glass-panel w-full sm:max-w-md rounded-t-2xl sm:rounded-2xl overflow-hidden animate-[modal-in_0.25s_ease-out] max-h-[92dvh] flex flex-col"
				onClick={(e) => e.stopPropagation()}
			>
				<div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-white/8 shrink-0">
					<div>
						<h3 id={titleId} className="font-black text-base uppercase italic tracking-tight">
							{step === "confirmation"
								? "Palpite Registrado!"
								: step === "login"
									? "Entrar"
									: step === "register"
										? "Criar conta"
										: "Fazer Palpite"}
						</h3>
						<p className="text-xs text-slate-300 font-bold mt-0.5">
							{headerLabel} · {formatCurrency(match.ticketPrice)}/bilhete
						</p>
					</div>
					<button
						onClick={handleClose}
						className="size-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
						aria-label="Fechar"
					>
						<MaterialIcon name="close" className="text-sm" />
					</button>
				</div>

				<div className="px-5 pt-4 shrink-0">
					<StepIndicator current={step} mode={mode} />
				</div>

				<div className="overflow-y-auto px-5 pb-5 flex-1">
					{step === "choice" && (
						<div className="flex flex-col gap-3 pt-2">
							<p className="text-xs text-slate-400 text-center mb-2">
								Como você quer fazer este palpite?
							</p>

							<button
								onClick={() => {
									setError("");
									setStep("login");
								}}
								className="w-full py-4 bg-primary hover:bg-blue-600 text-white font-black rounded-xl transition-colors flex items-center justify-center gap-3"
							>
								<MaterialIcon name="login" className="text-lg" />
								Entrar
							</button>

							<button
								onClick={() => {
									setError("");
									setStep("register");
								}}
								className="w-full py-4 border-2 border-primary text-primary hover:bg-primary hover:text-white font-black rounded-xl transition-colors flex items-center justify-center gap-3"
							>
								<MaterialIcon name="person_add" className="text-lg" />
								Cadastrar
							</button>

							<div className="flex items-center gap-3 my-2">
								<div className="flex-1 h-px bg-white/10" />
								<span className="text-xs text-slate-300 uppercase font-black tracking-widest">
									ou
								</span>
								<div className="flex-1 h-px bg-white/10" />
							</div>

							<button
								onClick={() => {
									setError("");
									setMode("guest");
									setStep("data");
								}}
								className="w-full py-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-black rounded-xl transition-colors flex items-center justify-center gap-3"
							>
								<MaterialIcon name="visibility" className="text-lg" />
								Apostar como Visitante
							</button>

							<p className="text-xs text-slate-300 text-center mt-3 leading-relaxed">
								Como visitante você não terá histórico salvo de palpites.
								Os dados (CPF, telefone e PIX) ainda são obrigatórios para
								recebermos o pagamento e enviarmos o prêmio.
							</p>
						</div>
					)}

					{step === "login" && (
						<div className="flex flex-col gap-4">
							<div>
								<FieldLabel>E-mail</FieldLabel>
								<Input
									type="email"
									value={authForm.email}
									onChange={(v) => setAuthForm((f) => ({ ...f, email: v }))}
									placeholder="seu@email.com"
								/>
							</div>
							<div>
								<FieldLabel>Senha</FieldLabel>
								<Input
									type="password"
									value={authForm.password}
									onChange={(v) => setAuthForm((f) => ({ ...f, password: v }))}
									placeholder="••••••••"
								/>
							</div>

							{error && <p className="text-red-400 text-xs font-bold">{error}</p>}

							<div className="flex gap-3">
								<button
									onClick={() => {
										setError("");
										setStep("choice");
									}}
									className="px-5 py-4 bg-white/5 hover:bg-white/10 font-bold rounded-xl transition-colors"
								>
									<MaterialIcon name="arrow_back" />
								</button>
								<button
									onClick={() => void handleLogin()}
									disabled={loading}
									className="flex-1 py-4 bg-primary hover:bg-blue-600 text-white font-black rounded-xl transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
								>
									{loading ? "Entrando..." : "Entrar e continuar"}
								</button>
							</div>
						</div>
					)}

					{step === "register" && (
						<div className="flex flex-col gap-4">
							<div>
								<FieldLabel>Nome completo</FieldLabel>
								<Input
									value={authForm.name}
									onChange={(v) => setAuthForm((f) => ({ ...f, name: v }))}
									placeholder="João da Silva"
								/>
							</div>
							<div>
								<FieldLabel>E-mail</FieldLabel>
								<Input
									type="email"
									value={authForm.email}
									onChange={(v) => setAuthForm((f) => ({ ...f, email: v }))}
									placeholder="seu@email.com"
								/>
							</div>
							<div>
								<FieldLabel>Senha</FieldLabel>
								<Input
									type="password"
									value={authForm.password}
									onChange={(v) => setAuthForm((f) => ({ ...f, password: v }))}
									placeholder="••••••••"
								/>
							</div>
							<div>
								<FieldLabel>Confirmar senha</FieldLabel>
								<Input
									type="password"
									value={authForm.confirmPassword}
									onChange={(v) =>
										setAuthForm((f) => ({ ...f, confirmPassword: v }))
									}
									placeholder="••••••••"
								/>
							</div>
							<div>
								<FieldLabel>CPF</FieldLabel>
								<Input
									value={authForm.cpf}
									onChange={(v) =>
										setAuthForm((f) => ({ ...f, cpf: fmtCPF(v) }))
									}
									placeholder="000.000.000-00"
								/>
							</div>
							<div>
								<FieldLabel>WhatsApp / Telefone</FieldLabel>
								<Input
									type="tel"
									value={authForm.phone}
									onChange={(v) =>
										setAuthForm((f) => ({ ...f, phone: fmtPhone(v) }))
									}
									placeholder="(31) 99999-9999"
								/>
							</div>
							<div>
								<FieldLabel>Chave PIX (para receber prêmios)</FieldLabel>
								<Input
									value={authForm.pixKey}
									onChange={(v) => setAuthForm((f) => ({ ...f, pixKey: v }))}
									placeholder="CPF, e-mail, celular ou chave aleatória"
								/>
							</div>

							{error && <p className="text-red-400 text-xs font-bold">{error}</p>}

							<div className="flex gap-3">
								<button
									onClick={() => {
										setError("");
										setStep("choice");
									}}
									className="px-5 py-4 bg-white/5 hover:bg-white/10 font-bold rounded-xl transition-colors"
								>
									<MaterialIcon name="arrow_back" />
								</button>
								<button
									onClick={() => void handleRegister()}
									disabled={loading}
									className="flex-1 py-4 bg-primary hover:bg-blue-600 text-white font-black rounded-xl transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
								>
									{loading ? "Cadastrando..." : "Cadastrar e continuar"}
								</button>
							</div>
						</div>
					)}

					{step === "data" && (
						<div className="flex flex-col gap-4">
							{mode === "guest" && (
								<div className="rounded-xl border border-amber-500/20 bg-amber-500/10 px-4 py-3 text-xs text-amber-300">
									Apostando como visitante. Preencha seus dados para recebermos o
									pagamento e enviarmos o prêmio em caso de vitória.
								</div>
							)}

							<div>
								<FieldLabel>Nome completo</FieldLabel>
								<Input
									value={data.name}
									onChange={(v) => setData((d) => ({ ...d, name: v }))}
									placeholder="João da Silva"
								/>
								{errors.name && (
									<p className="text-red-400 text-xs mt-1">{errors.name}</p>
								)}
							</div>

							<div>
								<FieldLabel>CPF</FieldLabel>
								<Input
									value={data.cpf}
									onChange={(v) => setData((d) => ({ ...d, cpf: fmtCPF(v) }))}
									placeholder="000.000.000-00"
								/>
								{errors.cpf && (
									<p className="text-red-400 text-xs mt-1">{errors.cpf}</p>
								)}
							</div>

							<div>
								<FieldLabel>E-mail</FieldLabel>
								<Input
									type="email"
									value={data.email}
									onChange={(v) => setData((d) => ({ ...d, email: v }))}
									placeholder="seu@email.com"
									disabled={mode === "authenticated"}
								/>
								{errors.email && (
									<p className="text-red-400 text-xs mt-1">{errors.email}</p>
								)}
							</div>

							<div>
								<FieldLabel>WhatsApp / Telefone</FieldLabel>
								<Input
									type="tel"
									value={data.phone}
									onChange={(v) => setData((d) => ({ ...d, phone: fmtPhone(v) }))}
									placeholder="(31) 99999-9999"
								/>
								{errors.phone && (
									<p className="text-red-400 text-xs mt-1">{errors.phone}</p>
								)}
							</div>

							<div>
								<FieldLabel>Chave PIX para receber prêmio</FieldLabel>
								<Input
									value={data.pixKey}
									onChange={(v) => setData((d) => ({ ...d, pixKey: v }))}
									placeholder="CPF, e-mail, celular ou chave aleatória"
								/>
								{errors.pixKey && (
									<p className="text-red-400 text-xs mt-1">{errors.pixKey}</p>
								)}
							</div>

							{error && <p className="text-red-400 text-xs font-bold">{error}</p>}

							<button
								onClick={() => void handleDataNext()}
								disabled={loading}
								className="w-full py-4 bg-primary hover:bg-blue-600 text-white font-black rounded-xl transition-colors mt-2 flex items-center justify-center gap-2 disabled:opacity-60"
							>
								{loading ? "Salvando..." : "Continuar"}
								<MaterialIcon name="arrow_forward" className="text-lg" />
							</button>
						</div>
					)}

					{step === "lineup" && (
						<div className="flex flex-col gap-4">
							<p className="text-xs text-slate-400 text-center">
								Edite o placar, adicione bilhetes ou inclua outros placares para
								esta partida.
							</p>

							{lines.map((line, idx) => {
								const lineTotal =
									line.tickets * Number(match.ticketPrice ?? 0);
								return (
									<div
										key={line.id}
										className="bg-white/3 border border-white/8 rounded-xl p-4 flex flex-col gap-3"
									>
										<div className="flex items-center justify-between">
											<p className="text-xs font-bold uppercase tracking-widest text-primary">
												Palpite {idx + 1}
											</p>
											{lines.length > 1 && (
												<button
													onClick={() => removeLine(line.id)}
													className="size-7 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 flex items-center justify-center transition-colors"
													aria-label="Remover palpite"
												>
													<MaterialIcon name="delete" className="text-sm" />
												</button>
											)}
										</div>

										<div className="flex items-center justify-center gap-3">
											<div className="flex flex-col items-center gap-1.5 flex-1">
												<span className="text-xs font-black uppercase tracking-wider text-slate-300">
													{match.homeTeam}
												</span>
												<div className="flex items-center gap-1">
													<button
														onClick={() =>
															updateLine(line.id, {
																home: Math.max(0, line.home - 1),
															})
														}
														className="size-8 rounded-lg bg-white/8 hover:bg-white/14 flex items-center justify-center transition-colors"
													>
														<MaterialIcon name="remove" className="text-sm" />
													</button>
													<span className="text-2xl font-black italic w-8 text-center">
														{line.home}
													</span>
													<button
														onClick={() =>
															updateLine(line.id, {
																home: Math.min(20, line.home + 1),
															})
														}
														className="size-8 rounded-lg bg-white/8 hover:bg-white/14 flex items-center justify-center transition-colors"
													>
														<MaterialIcon name="add" className="text-sm" />
													</button>
												</div>
											</div>

											<span className="text-xl font-black italic text-slate-600 px-1">
												×
											</span>

											<div className="flex flex-col items-center gap-1.5 flex-1">
												<span className="text-xs font-black uppercase tracking-wider text-slate-300">
													{match.awayTeam}
												</span>
												<div className="flex items-center gap-1">
													<button
														onClick={() =>
															updateLine(line.id, {
																away: Math.max(0, line.away - 1),
															})
														}
														className="size-8 rounded-lg bg-white/8 hover:bg-white/14 flex items-center justify-center transition-colors"
													>
														<MaterialIcon name="remove" className="text-sm" />
													</button>
													<span className="text-2xl font-black italic w-8 text-center">
														{line.away}
													</span>
													<button
														onClick={() =>
															updateLine(line.id, {
																away: Math.min(20, line.away + 1),
															})
														}
														className="size-8 rounded-lg bg-white/8 hover:bg-white/14 flex items-center justify-center transition-colors"
													>
														<MaterialIcon name="add" className="text-sm" />
													</button>
												</div>
											</div>
										</div>

										<div className="h-px bg-white/5" />

										<div className="flex items-center justify-between">
											<div>
												<p className="text-xs font-black uppercase tracking-wider text-slate-300">
													Bilhetes
												</p>
												<div className="flex items-center gap-2 mt-1">
													<button
														onClick={() =>
															updateLine(line.id, {
																tickets: Math.max(1, line.tickets - 1),
															})
														}
														className="size-7 rounded-md bg-white/8 hover:bg-white/14 flex items-center justify-center transition-colors"
														disabled={line.tickets <= 1}
													>
														<MaterialIcon name="remove" className="text-xs" />
													</button>
													<span className="text-base font-black italic w-7 text-center">
														{line.tickets}
													</span>
													<button
														onClick={() =>
															updateLine(line.id, {
																tickets: Math.min(
																	maxTicketsPerLine,
																	line.tickets + 1
																),
															})
														}
														className="size-7 rounded-md bg-white/8 hover:bg-white/14 flex items-center justify-center transition-colors"
													>
														<MaterialIcon name="add" className="text-xs" />
													</button>
												</div>
											</div>
											<div className="text-right">
												<p className="text-xs font-black uppercase tracking-wider text-slate-300">
													Subtotal
												</p>
												<p className="text-base font-black italic text-primary">
													{formatCurrency(lineTotal)}
												</p>
											</div>
										</div>
									</div>
								);
							})}

							<button
								onClick={addLine}
								className="w-full py-3 border-2 border-dashed border-white/15 hover:border-primary/50 text-slate-400 hover:text-primary font-bold rounded-xl transition-colors flex items-center justify-center gap-2"
							>
								<MaterialIcon name="add" className="text-lg" />
								Adicionar outro placar
							</button>

							<div className="bg-primary/10 border border-primary/20 rounded-xl p-4 flex items-center justify-between">
								<div>
									<p className="text-xs text-primary font-bold uppercase tracking-wider">
										{lines.length}{" "}
										{lines.length === 1 ? "palpite" : "palpites"} ·{" "}
										{totalTickets}{" "}
										{totalTickets === 1 ? "bilhete" : "bilhetes"}
									</p>
									<p className="text-3xl font-black italic">
										{formatCurrency(total)}
									</p>
								</div>
								<div className="text-right">
									<p className="text-xs text-slate-300 font-bold uppercase">
										Pagamento
									</p>
									<p className="text-lg font-black italic text-emerald-400">
										PIX manual
									</p>
								</div>
							</div>

							{error && <p className="text-red-400 text-xs font-bold">{error}</p>}

							<div className="flex gap-3">
								{mode === "guest" && (
									<button
										onClick={() => setStep("data")}
										className="px-5 py-4 bg-white/5 hover:bg-white/10 font-bold rounded-xl transition-colors"
									>
										<MaterialIcon name="arrow_back" />
									</button>
								)}
								<button
									onClick={() => void handleCreateBet()}
									disabled={loading}
									className="flex-1 py-4 bg-primary hover:bg-blue-600 text-white font-black rounded-xl transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
								>
									<MaterialIcon name="pix" className="text-lg" />
									{loading ? "Gerando cobrança..." : "Gerar PIX"}
								</button>
							</div>
						</div>
					)}

					{step === "payment" && order && (
						<div className="flex flex-col gap-4">
							<div className="flex items-center justify-center gap-2 bg-amber-500/10 border border-amber-500/20 rounded-xl px-4 py-2.5">
								<MaterialIcon name="timer" className="text-amber-400 text-lg" />
								<p className="text-xs font-black text-amber-400">
									Aguarde a confirmação manual do pagamento pelo admin
								</p>
							</div>

							<div className="text-center bg-primary/10 border border-primary/20 rounded-xl py-4">
								<p className="text-xs font-bold text-primary uppercase tracking-widest mb-1">
									Valor a pagar
								</p>
								<p className="text-4xl font-black italic">
									{formatCurrency(Number(order.payment.amount))}
								</p>
								<p className="text-xs text-slate-300 mt-1">
									Pedido #{order.payment.id} · {order.bets.length}{" "}
									{order.bets.length === 1 ? "palpite" : "palpites"} ·{" "}
									{headerLabel}
								</p>
							</div>

							<div className="flex flex-col items-center gap-3">
								<div className="bg-white p-3 rounded-2xl shadow-lg shadow-black/30">
									{/* eslint-disable-next-line @next/next/no-img-element */}
									<img
										src={
											order.payment.pixQrCodeBase64
												? `data:image/png;base64,${order.payment.pixQrCodeBase64}`
												: generateQR(pixCode)
										}
										alt="QR Code PIX"
										width={180}
										height={180}
										className="block"
									/>
								</div>
								<p className="text-[11px] text-slate-300 text-center">
									Escaneie com o app do seu banco ou copie o código PIX abaixo.
								</p>
							</div>

							<div>
								<FieldLabel>Código PIX</FieldLabel>
								<div className="flex gap-2">
									<div className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-xs font-mono text-slate-400 overflow-hidden text-ellipsis whitespace-nowrap">
										{pixCode}
									</div>
									<button
										onClick={() => {
											navigator.clipboard.writeText(pixCode);
											setPixCopied(true);
											setTimeout(() => setPixCopied(false), 3000);
										}}
										className={`px-4 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 ${
											pixCopied
												? "bg-emerald-500 text-white"
												: "bg-primary hover:bg-blue-600 text-white"
										}`}
									>
										<MaterialIcon
											name={pixCopied ? "check" : "content_copy"}
											className="text-sm"
										/>
										{pixCopied ? "Copiado!" : "Copiar"}
									</button>
								</div>
							</div>

							<div className="bg-white/3 border border-white/8 rounded-xl p-4 space-y-2 text-xs text-slate-400">
								<p>1. Faça o PIX usando o QR Code ou o código copiado.</p>
								<p>
									2.{" "}
									{order.payment.method === "pix_mercadopago"
										? "A confirmação é automática — esta tela atualiza sozinha assim que o pagamento for identificado."
										: "O pagamento ficará como pendente até confirmação manual."}
								</p>
								<p>
									3.{" "}
									{mode === "authenticated"
										? 'Você poderá acompanhar o status em "Meus Palpites".'
										: "Guarde o número do Pedido — você precisará dele para consultar o status."}
								</p>
							</div>

							{(paymentStatus ?? order.payment.status) === "pending" && (
								<div className="flex items-center justify-center gap-2 text-xs font-bold text-amber-400">
									<span className="size-2 rounded-full bg-amber-400 animate-pulse" />
									Aguardando pagamento…
								</div>
							)}
							{paymentStatus === "cancelled" && (
								<div className="flex items-center justify-center gap-2 text-xs font-bold text-red-400">
									<MaterialIcon name="cancel" className="text-sm" />
									Pagamento cancelado ou expirado. Crie um novo palpite.
								</div>
							)}

							<button
								onClick={() => setStep("confirmation")}
								className="w-full py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-black rounded-xl transition-colors flex items-center justify-center gap-2"
							>
								<MaterialIcon name="check_circle" className="text-lg" />
								Ver resumo do pedido
							</button>
						</div>
					)}

					{step === "confirmation" && order && (
						<div className="flex flex-col items-center text-center gap-5 py-4">
							<div className="relative">
								<div className="size-24 rounded-full bg-emerald-500/20 flex items-center justify-center">
									<MaterialIcon
										name="check_circle"
										className="text-emerald-400 text-5xl"
									/>
								</div>
							</div>

							<div>
								<h4 className="text-2xl font-black italic uppercase">
									{order.bets.length === 1
										? "Palpite Criado!"
										: "Palpites Criados!"}
								</h4>
								<p className="text-sm text-slate-400 mt-1">
									{(paymentStatus ?? order.payment.status) === "confirmed"
										? "Pagamento confirmado. Boa sorte!"
										: order.payment.method === "pix_mercadopago"
											? "Assim que o PIX for identificado, o pagamento é confirmado automaticamente."
											: "O pagamento está pendente de confirmação manual."}
								</p>
							</div>

							<div className="w-full bg-white/3 border border-white/8 rounded-2xl p-4 space-y-3 text-left">
								<div className="flex flex-col gap-2">
									<span className="text-[11px] text-slate-300 font-bold uppercase">
										Palpites ({order.bets.length})
									</span>
									{order.bets.map((bet) => (
										<div
											key={bet.id}
											className="flex justify-between text-sm font-black italic"
										>
											<span>
												{bet.homeScorePrediction} × {bet.awayScorePrediction}
											</span>
											<span className="text-slate-400 font-medium">
												{bet.tickets}{" "}
												{bet.tickets === 1 ? "bilhete" : "bilhetes"}
											</span>
										</div>
									))}
								</div>
								<div className="h-px bg-white/5" />
								<div className="flex justify-between">
									<span className="text-[11px] text-slate-300 font-bold uppercase">
										Total de bilhetes
									</span>
									<span className="text-sm font-black">{totalTickets}</span>
								</div>
								<div className="h-px bg-white/5" />
								<div className="flex justify-between">
									<span className="text-[11px] text-slate-300 font-bold uppercase">
										Status
									</span>
									{(() => {
										const status = paymentStatus ?? order.payment.status;
										const label =
											status === "confirmed"
												? "Confirmado"
												: status === "pending"
													? "Pendente"
													: status === "cancelled"
														? "Cancelado"
														: status;
										const color =
											status === "confirmed"
												? "text-emerald-400"
												: status === "cancelled"
													? "text-red-400"
													: "text-amber-400";
										return (
											<span className={`text-sm font-black ${color}`}>
												{label}
											</span>
										);
									})()}
								</div>
								<div className="h-px bg-white/5" />
								<div className="flex justify-between">
									<span className="text-[11px] text-slate-300 font-bold uppercase">
										Valor
									</span>
									<span className="text-sm font-black text-primary">
										{formatCurrency(Number(order.payment.amount))}
									</span>
								</div>
							</div>

							<button
								onClick={handleClose}
								className="w-full py-4 bg-primary hover:bg-blue-600 text-white font-black rounded-xl transition-colors"
							>
								Fechar
							</button>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
