"use client";

import { useCallback, useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";

export function useResource<T>(path: string) {
	const [data, setData] = useState<T | null>(null);
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(true);
	const [revision, setRevision] = useState(0);
	const reload = useCallback(() => setRevision((value) => value + 1), []);

	useEffect(() => {
		const controller = new AbortController();
		void apiFetch<T>(path, { signal: controller.signal })
			.then((value) => {
				setData(value);
				setError("");
			})
			.catch((reason) => {
				if (!controller.signal.aborted)
					setError(
						reason instanceof Error
							? reason.message
							: "Não foi possível carregar os dados.",
					);
			})
			.finally(() => {
				if (!controller.signal.aborted) setLoading(false);
			});
		return () => controller.abort();
	}, [path, revision]);

	useEffect(() => {
		window.addEventListener("celeste:payment-confirmed", reload);
		return () =>
			window.removeEventListener("celeste:payment-confirmed", reload);
	}, [reload]);

	return { data, error, loading, reload };
}
