export function formatCurrency(value: number) {
	return value.toLocaleString("pt-BR", {
		style: "currency",
		currency: "BRL",
	});
}

export function formatShortDate(value: string) {
	return new Intl.DateTimeFormat("pt-BR", {
		day: "2-digit",
		month: "short",
	}).format(new Date(value));
}

export function formatDateTime(value: string) {
	return new Intl.DateTimeFormat("pt-BR", {
		day: "2-digit",
		month: "2-digit",
		year: "numeric",
		hour: "2-digit",
		minute: "2-digit",
	}).format(new Date(value));
}

export function formatRelativeTime(value: string) {
	const diff = Date.now() - new Date(value).getTime();
	const minutes = Math.max(1, Math.round(diff / 60000));

	if (minutes < 60) return `${minutes}m atrás`;
	const hours = Math.round(minutes / 60);
	if (hours < 24) return `${hours}h atrás`;
	const days = Math.round(hours / 24);
	return `${days}d atrás`;
}
