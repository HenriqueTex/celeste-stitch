import { getApiRoot } from "@/lib/api";

export type BadgeVariant = "default" | "secondary" | "outline" | "destructive";

export const paymentStatus: Record<string, { label: string; variant: BadgeVariant }> = {
	pending: { label: "Pendente", variant: "secondary" },
	confirmed: { label: "Confirmado", variant: "default" },
	cancelled: { label: "Cancelado", variant: "outline" },
	refund_pending: { label: "A estornar", variant: "destructive" },
	refunded: { label: "Estornado", variant: "outline" },
};

export const matchStatus: Record<string, string> = {
	draft: "Rascunho",
	open: "Aberta",
	closed: "Fechada",
	result_registered: "Resultado lançado",
	settled: "Liquidada",
	cancelled: "Cancelada",
};

/** Builds "?a=1&b=2" from the non-empty values. */
export function queryString(params: object) {
	const search = new URLSearchParams();
	for (const [key, value] of Object.entries(params) as [string, unknown][]) {
		if (value !== null && value !== undefined && value !== "") search.set(key, String(value));
	}
	const text = search.toString();
	return text ? `?${text}` : "";
}

/** Downloads an authenticated file (CSV export, receipt) through a temporary link. */
export async function downloadAdminFile(path: string, token: string, filename: string) {
	const response = await fetch(`${getApiRoot()}${path}`, {
		headers: { Authorization: `Bearer ${token}` },
	});
	if (!response.ok) throw new Error("Não foi possível baixar o arquivo.");
	const url = URL.createObjectURL(await response.blob());
	const link = document.createElement("a");
	link.href = url;
	link.download = filename;
	link.click();
	setTimeout(() => URL.revokeObjectURL(url), 10_000);
}

/** Opens an authenticated file (receipt) in a new tab. */
export async function openAdminFile(path: string, token: string) {
	const tab = window.open("", "_blank");
	const response = await fetch(`${getApiRoot()}${path}`, {
		headers: { Authorization: `Bearer ${token}` },
	});
	if (!response.ok) {
		tab?.close();
		throw new Error("Não foi possível abrir o arquivo.");
	}
	const url = URL.createObjectURL(await response.blob());
	if (tab) tab.location.href = url;
	else window.location.href = url;
}

/** wa.me link for a Brazilian mobile number. */
export function whatsappLink(phone: string) {
	const digits = phone.replace(/\D/g, "");
	return `https://wa.me/${digits.startsWith("55") ? digits : `55${digits}`}`;
}
