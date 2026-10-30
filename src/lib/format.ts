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

export function formatWeekdayDate(value: string) {
	return new Intl.DateTimeFormat("pt-BR", {
		timeZone: "America/Sao_Paulo",
		weekday: "long",
		day: "numeric",
		month: "short",
	}).format(new Date(value));
}

export function formatTime(value: string) {
	return new Intl.DateTimeFormat("pt-BR", {
		timeZone: "America/Sao_Paulo",
		hour: "2-digit",
		minute: "2-digit",
	}).format(new Date(value));
}

/** Day and abbreviated month, split for a stacked date block. */
export function formatDayMonth(value: string) {
	const parts = new Intl.DateTimeFormat("pt-BR", {
		timeZone: "America/Sao_Paulo",
		day: "2-digit",
		month: "short",
	}).formatToParts(new Date(value));
	return {
		day: parts.find((part) => part.type === "day")?.value ?? "",
		month: (parts.find((part) => part.type === "month")?.value ?? "").replace(".", ""),
	};
}

/** Calendar days until a date in Brasília time: "Hoje", "Amanhã", "Em 3 dias". */
export function formatCountdown(value: string, now = Date.now()) {
	const day = (time: number) =>
		new Intl.DateTimeFormat("en-CA", { timeZone: "America/Sao_Paulo" }).format(
			new Date(time),
		);
	const days = Math.round(
		(Date.parse(day(new Date(value).getTime())) - Date.parse(day(now))) /
			86_400_000,
	);
	if (days <= 0) return "Hoje";
	if (days === 1) return "Amanhã";
	return `Em ${days} dias`;
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
