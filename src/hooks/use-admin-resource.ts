"use client";

import { useCallback, useEffect, useState } from "react";
import { useAdminAuth } from "@/components/AdminAuthContext";
import { apiFetch } from "@/lib/api";

/** Loads an admin endpoint with the staff token; `path` null waits. */
export function useAdminResource<T>(path: string | null) {
	const { adminToken } = useAdminAuth();
	const [data, setData] = useState<T | null>(null);
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(true);
	const [revision, setRevision] = useState(0);
	const reload = useCallback(() => setRevision((value) => value + 1), []);

	useEffect(() => {
		if (!adminToken || !path) return;
		// Earlier data stays on screen while a new page or filter loads.
		const controller = new AbortController();
		void apiFetch<T>(path, { token: adminToken, signal: controller.signal })
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
	}, [adminToken, path, revision]);

	return { data, error, loading, reload };
}
