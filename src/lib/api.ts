const API_ROOT =
	process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ??
	"http://localhost:3333/api/v1";

export class ApiError extends Error {
	status: number;

	constructor(message: string, status: number) {
		super(message);
		this.status = status;
	}
}

type RequestOptions = RequestInit & {
	token?: string | null;
};

export async function apiFetch<T>(
	path: string,
	options: RequestOptions = {}
): Promise<T> {
	const headers = new Headers(options.headers ?? {});
	headers.set("Accept", "application/json");

	if (options.body && !headers.has("Content-Type")) {
		headers.set("Content-Type", "application/json");
	}

	if (options.token) {
		headers.set("Authorization", `Bearer ${options.token}`);
	}

	const method = options.method ?? "GET";
	const url = `${API_ROOT}${path}`;

	let response: Response;
	try {
		response = await fetch(url, {
			...options,
			headers,
			cache: "no-store",
		});
	} catch (err) {
		console.error(`[api] ${method} ${url} — falha de rede`, err);
		throw new ApiError(
			"Não foi possível conectar à API. Verifique se o servidor está no ar.",
			0
		);
	}

	const data = await response.json().catch(() => null);

	if (!response.ok) {
		console.error(
			`[api] ${method} ${url} → ${response.status}`,
			data ?? "(sem corpo de resposta)"
		);
		throw new ApiError(
			data?.message ?? "Não foi possível concluir a requisição.",
			response.status
		);
	}

	return data as T;
}

export function getApiRoot() {
	return API_ROOT;
}
