"use client";

import { useEffect, useId, useState } from "react";
import MaterialIcon from "@/components/icons/MaterialIcon";
import { useAuth } from "@/components/AuthContext";
import { useModalAccessibility } from "@/hooks/use-modal-accessibility";

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

export default function ProfileModal({
	open,
	onClose,
}: {
	open: boolean;
	onClose: () => void;
}) {
	const { user, updateProfile } = useAuth();
	const [form, setForm] = useState({
		fullName: "",
		nickname: "",
		cpf: "",
		phone: "",
		pixKey: "",
	});
	const [error, setError] = useState("");
	const [success, setSuccess] = useState(false);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		if (open && user) {
			setForm({
				fullName: user.fullName ?? "",
				nickname: user.nickname ?? "",
				cpf: user.cpf ?? "",
				phone: user.phone ?? "",
				pixKey: user.pixKey ?? "",
			});
			setError("");
			setSuccess(false);
		}
	}, [open, user]);

	const titleId = useId();
	const dialogRef = useModalAccessibility(open, onClose);

	if (!open) return null;

	const handleSave = async (e: React.FormEvent) => {
		e.preventDefault();
		setError("");
		setSuccess(false);
		if (!form.fullName.trim()) {
			setError("Nome é obrigatório.");
			return;
		}
		if (form.cpf && form.cpf.replace(/\D/g, "").length < 11) {
			setError("CPF inválido.");
			return;
		}
		if (form.phone && form.phone.replace(/\D/g, "").length < 10) {
			setError("Telefone inválido.");
			return;
		}

		try {
			setLoading(true);
			await updateProfile(form);
			setSuccess(true);
		} catch (err) {
			setError(
				err instanceof Error ? err.message : "Não foi possível salvar o perfil."
			);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div
			className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm px-4"
			onClick={onClose}
		>
			<div
				ref={dialogRef}
				role="dialog"
				aria-modal="true"
				aria-labelledby={titleId}
				tabIndex={-1}
				className="glass-panel w-full max-w-md rounded-2xl overflow-hidden animate-[modal-in_0.2s_ease-out] max-h-[92dvh] flex flex-col"
				onClick={(e) => e.stopPropagation()}
			>
				<div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-white/8 shrink-0">
					<div>
						<h3 id={titleId} className="font-black text-base uppercase italic tracking-tight">
							Editar Perfil
						</h3>
						<p className="text-xs text-slate-300 font-bold mt-0.5">
							{user?.email}
						</p>
					</div>
					<button
						onClick={onClose}
						className="size-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
						aria-label="Fechar"
					>
						<MaterialIcon name="close" className="text-sm" />
					</button>
				</div>

				<form
					onSubmit={handleSave}
					className="overflow-y-auto px-5 py-5 flex-1 flex flex-col gap-4"
				>
					<div>
						<label className="text-xs font-black uppercase tracking-wider text-slate-300 mb-1 block">
							Nome completo
						</label>
						<input
							type="text"
							value={form.fullName}
							onChange={(e) =>
								setForm((f) => ({ ...f, fullName: e.target.value }))
							}
							placeholder="João da Silva"
							className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm font-medium placeholder:text-slate-600 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-colors"
						/>
					</div>

					<div>
						<label className="text-xs font-black uppercase tracking-wider text-slate-300 mb-1 block">
							Apelido
						</label>
						<input
							type="text"
							value={form.nickname}
							onChange={(e) =>
								setForm((f) => ({ ...f, nickname: e.target.value }))
							}
							placeholder="Como aparece no ranking"
							className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm font-medium placeholder:text-slate-600 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-colors"
						/>
					</div>

					<div>
						<label className="text-xs font-black uppercase tracking-wider text-slate-300 mb-1 block">
							CPF
						</label>
						<input
							type="text"
							value={form.cpf}
							onChange={(e) =>
								setForm((f) => ({ ...f, cpf: fmtCPF(e.target.value) }))
							}
							placeholder="000.000.000-00"
							className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm font-medium placeholder:text-slate-600 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-colors"
						/>
					</div>

					<div>
						<label className="text-xs font-black uppercase tracking-wider text-slate-300 mb-1 block">
							WhatsApp / Telefone
						</label>
						<input
							type="tel"
							value={form.phone}
							onChange={(e) =>
								setForm((f) => ({ ...f, phone: fmtPhone(e.target.value) }))
							}
							placeholder="(31) 99999-9999"
							className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm font-medium placeholder:text-slate-600 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-colors"
						/>
					</div>

					<div>
						<label className="text-xs font-black uppercase tracking-wider text-slate-300 mb-1 block">
							Chave PIX (para receber prêmios)
						</label>
						<input
							type="text"
							value={form.pixKey}
							onChange={(e) => setForm((f) => ({ ...f, pixKey: e.target.value }))}
							placeholder="CPF, e-mail, celular ou chave aleatória"
							className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm font-medium placeholder:text-slate-600 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-colors"
						/>
					</div>

					{error && (
						<p className="text-red-400 text-xs font-bold" role="alert">
							{error}
						</p>
					)}
					{success && (
						<p className="text-emerald-400 text-xs font-bold flex items-center gap-1">
							<MaterialIcon name="check_circle" className="text-sm" />
							Perfil atualizado com sucesso.
						</p>
					)}

					<button
						type="submit"
						disabled={loading}
						className="w-full py-4 bg-primary hover:bg-blue-600 text-white font-black rounded-xl transition-colors mt-2 flex items-center justify-center gap-2 disabled:opacity-60"
					>
						{loading ? "Salvando..." : "Salvar alterações"}
					</button>
				</form>
			</div>
		</div>
	);
}
