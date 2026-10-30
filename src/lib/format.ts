export function formatCurrency(value: number) {
	return value.toLocaleString("pt-BR", {
		style: "currency",
		currency: "BRL",
	});
}

export function formatShortDate(value: string) {
	return new Intl.DateTimeFormat("pt-BR", {
		timeZone: "America/Sao_Paulo",
		day: "2-digit",
		month: "short",
	}).format(new Date(value));
}

export function formatDateTime(value: string) {
	return new Intl.DateTimeFormat("pt-BR", {
		timeZone: "America/Sao_Paulo",
		day: "2-digit",
		month: "2-digit",
		year: "numeric",
		hour: "2-digit",
		minute: "2-digit",
	}).format(new Date(value));
}

export function formatMatchDate(value: string) {
	return new Intl.DateTimeFormat("pt-BR", {
		timeZone: "America/Sao_Paulo",
		day: "numeric",
		month: "short",
		hour: "2-digit",
		minute: "2-digit",
	}).format(new Date(value));
}

export function formatRelativeTime(value: string) {
	const diff = Date.now() - new Date(value).getTime();
	const minutes = Math.max(1, Math.round(diff / 60000));

	if (minutes < 60) return `há ${minutes} min`;
	const hours = Math.round(minutes / 60);
	if (hours < 24) return `há ${hours} h`;
	const days = Math.round(hours / 24);
	return days === 1 ? "há 1 dia" : `há ${days} dias`;
}

export function formatScore(home: number, away: number) {
	return `${home} × ${away}`;
}

export function plural(count: number, one: string, many: string) {
	return `${count} ${count === 1 ? one : many}`;
}

export function formatCpf(value: string) {
	return value
		.replace(/\D/g, "")
		.slice(0, 11)
		.replace(/(\d{3})(\d)/, "$1.$2")
		.replace(/(\d{3})\.(\d{3})(\d)/, "$1.$2.$3")
		.replace(/\.(\d{3})(\d)/, ".$1-$2");
}

export function formatPhone(value: string) {
	return value
		.replace(/\D/g, "")
		.slice(0, 11)
		.replace(/^(\d{2})(\d)/, "($1) $2")
		.replace(/(\d{5})(\d)/, "$1-$2");
}

export function isClubTeam(name: string) {
	return /cruzeiro/i.test(name);
}
