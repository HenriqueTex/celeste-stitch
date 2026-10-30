const API_ROOT =
	process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ??
	"http://localhost:3333/api/v1";

export class ApiError extends Error {
	status: number;
	/** Set when the API names the failure, e.g. a refusal it fully rolled back. */
	code?: string;

	constructor(message: string, status: number, code?: string) {
		super(message);
		this.status = status;
		this.code = code;
	}
}

/** Validator errors arrive in English; translate the ones a person can act on. */
function validationMessage(error?: { rule?: string; field?: string }) {
	if (error?.rule === "database.unique" && error.field === "email")
		return "Já existe uma conta com este e-mail. Entre para continuar.";
	return undefined;
}

type RequestOptions = RequestInit & {
	token?: string | null;
};

export async function apiFetch<T>(
	path: string,
	options: RequestOptions = {},
): Promise<T> {
	const headers = new Headers(options.headers ?? {});
	headers.set("Accept", "application/json");

	// FormData sets its own multipart boundary.
	if (
		options.body &&
		!(options.body instanceof FormData) &&
		!headers.has("Content-Type")
	) {
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
		if (options.signal?.aborted) throw err;
		console.error(`[api] ${method} ${url} — falha de rede`, err);
		throw new ApiError(
			"Não foi possível conectar. Confira sua conexão e tente novamente.",
			0,
		);
	}

	const data = await response.json().catch(() => null);

	if (!response.ok) {
		console.error(
			`[api] ${method} ${url} → ${response.status}`,
			data ?? "(sem corpo de resposta)",
		);
		throw new ApiError(
			data?.message ??
				validationMessage(data?.errors?.[0]) ??
				"Não foi possível concluir a requisição.",
			response.status,
			typeof data?.code === "string" ? data.code : undefined,
		);
	}

	return data as T;
}

export function getApiRoot() {
	return API_ROOT;
}
