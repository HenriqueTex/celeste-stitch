"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Camera, CircleCheck, X } from "lucide-react";
import { useAuth } from "@/components/AuthContext";
import ClientField from "@/components/ClientField";
import { useModalAccessibility } from "@/hooks/use-modal-accessibility";
import { formatCpf, formatPhone } from "@/lib/format";

type FieldName = "fullName" | "nickname" | "cpf" | "phone" | "pixKey";

const AVATAR_TYPES = ["image/png", "image/jpeg", "image/webp"];
const AVATAR_MAX_BYTES = 2 * 1024 * 1024;

export default function ProfileModal({
	open,
	onClose,
}: {
	open: boolean;
	onClose: () => void;
}) {
	const { user, updateProfile, updateAvatar } = useAuth();
	const avatarInput = useRef<HTMLInputElement>(null);
	const [avatarBusy, setAvatarBusy] = useState(false);
	const [avatarError, setAvatarError] = useState("");
	const [form, setForm] = useState<Record<FieldName, string>>({
		fullName: "",
		nickname: "",
		cpf: "",
		phone: "",
		pixKey: "",
	});
	const [errors, setErrors] = useState<Partial<Record<FieldName, string>>>({});
	const [error, setError] = useState("");
	const [success, setSuccess] = useState(false);
	const [loading, setLoading] = useState(false);

	const seeded = useRef(false);
	useEffect(() => {
		if (!open) {
			seeded.current = false;
			return;
		}
		if (user && !seeded.current) {
			seeded.current = true;
			setForm({
				fullName: user.fullName ?? "",
				nickname: user.nickname ?? "",
				cpf: formatCpf(user.cpf ?? ""),
				phone: formatPhone(user.phone ?? ""),
				pixKey: user.pixKey ?? "",
			});
			setErrors({});
			setError("");
			setSuccess(false);
		}
	}, [open, user]);

	const titleId = useId();
	const dialogRef = useModalAccessibility(open, onClose);

	if (!open) return null;

	const field = (name: FieldName) => ({
		value: form[name],
		error: errors[name],
		onChange: (event: React.ChangeEvent<HTMLInputElement>) => {
			const raw = event.target.value;
			setSuccess(false);
			setForm((previous) => ({
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

	const changeAvatar = async (file: File | null) => {
		setAvatarError("");
		if (file && !AVATAR_TYPES.includes(file.type)) {
			setAvatarError("Use uma imagem PNG, JPG ou WebP.");
			return;
		}
		if (file && file.size > AVATAR_MAX_BYTES) {
			setAvatarError("A foto pode ter no máximo 2 MB.");
			return;
		}
		try {
			setAvatarBusy(true);
			await updateAvatar(file);
		} catch (reason) {
			setAvatarError(
				reason instanceof Error ? reason.message : "Não foi possível salvar a foto.",
			);
		} finally {
			setAvatarBusy(false);
			if (avatarInput.current) avatarInput.current.value = "";
		}
	};

	const handleSave = async (event: React.FormEvent) => {
		event.preventDefault();
		setError("");
		setSuccess(false);
		const found: Partial<Record<FieldName, string>> = {};
		if (!form.fullName.trim()) found.fullName = "Informe seu nome.";
		if (form.cpf && form.cpf.replace(/\D/g, "").length !== 11)
			found.cpf = "Informe os 11 dígitos do CPF.";
		if (form.phone && form.phone.replace(/\D/g, "").length < 10)
			found.phone = "Informe o celular com DDD, por exemplo (31) 99999-9999.";
		setErrors(found);
		if (Object.keys(found).length) return;

		try {
			setLoading(true);
			await updateProfile(form);
			setSuccess(true);
		} catch (reason) {
			setError(
				reason instanceof Error
					? reason.message
					: "Não foi possível salvar o perfil.",
			);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="client-modal-backdrop" onClick={onClose}>
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
					<div>
						<h2 id={titleId}>Editar perfil</h2>
						<p className="muted small-text">{user?.email}</p>
					</div>
					<button
						type="button"
						className="icon-button"
						onClick={onClose}
						aria-label="Fechar"
					>
						<X size={20} aria-hidden="true" />
					</button>
				</header>

				<div className="avatar-field">
					<span className="avatar-preview" aria-hidden="true">
						{user?.avatarUrl ? (
							// eslint-disable-next-line @next/next/no-img-element
							<img src={user.avatarUrl} alt="" width={72} height={72} />
						) : (
							user?.initials
						)}
					</span>
					<div className="avatar-actions">
						<input
							ref={avatarInput}
							type="file"
							accept={AVATAR_TYPES.join(",")}
							hidden
							onChange={(event) => void changeAvatar(event.target.files?.[0] ?? null)}
						/>
						<button
							type="button"
							className="client-button-secondary"
							disabled={avatarBusy}
							onClick={() => avatarInput.current?.click()}
						>
							<Camera size={17} aria-hidden="true" />
							{avatarBusy
								? "Enviando…"
								: user?.avatarUrl
									? "Trocar foto"
									: "Adicionar foto"}
						</button>
						{user?.avatarUrl && !avatarBusy && (
							<button
								type="button"
								className="text-link danger-link"
								onClick={() => void changeAvatar(null)}
							>
								Remover foto
							</button>
						)}
						<small>PNG, JPG ou WebP, até 2 MB.</small>
					</div>
					{avatarError && (
						<p className="form-error" role="alert">
							{avatarError}
						</p>
					)}
				</div>

				<form
					noValidate
					onSubmit={handleSave}
					className="client-dialog-body identity-form"
				>
					<ClientField
						label="Nome completo"
						autoComplete="name"
						{...field("fullName")}
					/>
					<ClientField
						label="Apelido"
						autoComplete="nickname"
						hint="É assim que você aparece no ranking."
						{...field("nickname")}
					/>
					<ClientField
						label="CPF"
						inputMode="numeric"
						autoComplete="off"
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

					{error && (
						<p className="form-error" role="alert">
							{error}
						</p>
					)}
					<p className="form-success" role="status">
						{success && (
							<>
								<CircleCheck size={16} aria-hidden="true" />
								Perfil atualizado.
							</>
						)}
					</p>

					<button
						type="submit"
						disabled={loading}
						className="client-button-primary"
					>
						{loading ? "Salvando…" : "Salvar alterações"}
					</button>
				</form>
			</div>
		</div>
	);
}
