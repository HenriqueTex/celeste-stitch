"use client";

import {
	createContext,
	useContext,
	useEffect,
	useState,
	type ReactNode,
} from "react";
import { apiFetch, ApiError } from "@/lib/api";
import type { AuthUser } from "@/lib/types";

interface AdminAuthContextType {
	admin: AuthUser | null;
	adminToken: string | null;
	isAdminLoggedIn: boolean;
	isLoading: boolean;
	adminLogin: (email: string, password: string) => Promise<void>;
	adminLogout: () => Promise<void>;
}

export const AdminAuthContext = createContext<AdminAuthContextType | null>(null);

const STORAGE_KEY = "bolao_admin";
const STORAGE_TOKEN_KEY = "bolao_admin_token";

function persistAdmin(admin: AuthUser | null, token: string | null) {
	if (typeof window === "undefined") return;

	if (admin && token) {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(admin));
		localStorage.setItem(STORAGE_TOKEN_KEY, token);
		return;
	}

	localStorage.removeItem(STORAGE_KEY);
	localStorage.removeItem(STORAGE_TOKEN_KEY);
}

export function useAdminAuth() {
	const ctx = useContext(AdminAuthContext);
	if (!ctx) throw new Error("useAdminAuth must be used within AdminAuthProvider");
	return ctx;
}

export function AdminAuthProvider({ children }: { children: ReactNode }) {
	const [admin, setAdmin] = useState<AuthUser | null>(null);
	const [adminToken, setAdminToken] = useState<string | null>(null);
	const [hydrated, setHydrated] = useState(false);
	const isLoading = !hydrated;

	useEffect(() => {
		const savedToken = localStorage.getItem(STORAGE_TOKEN_KEY);
		const savedAdmin = localStorage.getItem(STORAGE_KEY);
		if (savedToken && savedAdmin) {
			try {
				setAdmin(JSON.parse(savedAdmin) as AuthUser);
				setAdminToken(savedToken);
			} catch {
				persistAdmin(null, null);
			}
		}
		setHydrated(true);
	}, []);

	useEffect(() => {
		if (!adminToken) return;
		let cancelled = false;

		apiFetch<AuthUser>("/account/profile", { token: adminToken })
			.then((profile) => {
				if (cancelled) return;
				if (profile.role !== "admin") {
					setAdmin(null);
					setAdminToken(null);
					persistAdmin(null, null);
					return;
				}
				setAdmin(profile);
				persistAdmin(profile, adminToken);
			})
			.catch((err) => {
				if (cancelled) return;
				if (err instanceof ApiError && (err.status === 401 || err.status === 403)) {
					setAdmin(null);
					setAdminToken(null);
					persistAdmin(null, null);
				}
			});

		return () => {
			cancelled = true;
		};
	}, [adminToken]);

	const adminLogin = async (email: string, password: string) => {
		const session = await apiFetch<{ user: AuthUser; token: string }>(
			"/admin/auth/login",
			{
				method: "POST",
				body: JSON.stringify({ email, password }),
			}
		);
		setAdmin(session.user);
		setAdminToken(session.token);
		persistAdmin(session.user, session.token);
	};

	const adminLogout = async () => {
		if (adminToken) {
			try {
				await apiFetch("/account/logout", {
					method: "POST",
					token: adminToken,
				});
			} catch {
				// Ignore expired sessions during sign-out.
			}
		}
		setAdmin(null);
		setAdminToken(null);
		persistAdmin(null, null);
	};

	const value: AdminAuthContextType = {
		admin,
		adminToken,
		isAdminLoggedIn: !!admin && !!adminToken,
		isLoading,
		adminLogin,
		adminLogout,
	};

	return (
		<AdminAuthContext.Provider value={value}>
			{children}
		</AdminAuthContext.Provider>
	);
}
