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

interface ProfilePayload {
	fullName?: string;
	nickname?: string;
	cpf?: string;
	phone?: string;
	pixKey?: string;
	avatarUrl?: string;
}

export interface RegisterPayload {
	name: string;
	email: string;
	password: string;
	cpf: string;
	phone: string;
	pixKey: string;
}

interface AuthContextType {
	user: AuthUser | null;
	token: string | null;
	isLoggedIn: boolean;
	isLoading: boolean;
	login: (email: string, password: string) => Promise<void>;
	register: (payload: RegisterPayload) => Promise<void>;
	logout: () => Promise<void>;
	refreshProfile: () => Promise<void>;
	updateProfile: (payload: ProfilePayload) => Promise<AuthUser>;
}

const AuthContext = createContext<AuthContextType | null>(null);

const USER_KEY = "bolao_user";
const TOKEN_KEY = "bolao_token";

function persistSession(user: AuthUser | null, token: string | null) {
	if (typeof window === "undefined") return;

	if (user && token) {
		localStorage.setItem(USER_KEY, JSON.stringify(user));
		localStorage.setItem(TOKEN_KEY, token);
		return;
	}

	localStorage.removeItem(USER_KEY);
	localStorage.removeItem(TOKEN_KEY);
}

export function useAuth() {
	const ctx = useContext(AuthContext);
	if (!ctx) throw new Error("useAuth must be used within AuthProvider");
	return ctx;
}

export function AuthProvider({ children }: { children: ReactNode }) {
	const [user, setUser] = useState<AuthUser | null>(null);
	const [token, setToken] = useState<string | null>(null);
	const [hydrated, setHydrated] = useState(false);
	const isLoading = !hydrated;

	useEffect(() => {
		const timer = setTimeout(() => {
			const storedToken = localStorage.getItem(TOKEN_KEY);
			const storedUser = localStorage.getItem(USER_KEY);
			if (storedToken && storedUser) {
				try {
					setUser(JSON.parse(storedUser) as AuthUser);
					setToken(storedToken);
				} catch {
					persistSession(null, null);
				}
			}
			setHydrated(true);
		}, 0);
		return () => clearTimeout(timer);
	}, []);

	useEffect(() => {
		if (!token) return;
		let cancelled = false;

		apiFetch<AuthUser>("/account/profile", { token })
			.then((profile) => {
				if (cancelled) return;
				setUser(profile);
				persistSession(profile, token);
			})
			.catch((err) => {
				if (cancelled) return;
				if (err instanceof ApiError && (err.status === 401 || err.status === 403)) {
					setUser(null);
					setToken(null);
					persistSession(null, null);
				}
			});

		return () => {
			cancelled = true;
		};
	}, [token]);

	const refreshProfile = async () => {
		if (!token) return;
		const profile = await apiFetch<AuthUser>("/account/profile", { token });
		setUser(profile);
		persistSession(profile, token);
	};

	const login = async (email: string, password: string) => {
		const session = await apiFetch<{ user: AuthUser; token: string }>("/auth/login", {
			method: "POST",
			body: JSON.stringify({ email, password }),
		});
		setUser(session.user);
		setToken(session.token);
		persistSession(session.user, session.token);
	};

	const register = async (payload: RegisterPayload) => {
		const session = await apiFetch<{ user: AuthUser; token: string }>("/auth/signup", {
			method: "POST",
			body: JSON.stringify({
				fullName: payload.name,
				email: payload.email,
				password: payload.password,
				passwordConfirmation: payload.password,
				cpf: payload.cpf,
				phone: payload.phone,
				pixKey: payload.pixKey,
			}),
		});
		setUser(session.user);
		setToken(session.token);
		persistSession(session.user, session.token);
	};

	const logout = async () => {
		if (token) {
			try {
				await apiFetch("/account/logout", {
					method: "POST",
					token,
				});
			} catch {
				// Ignore logout race with expired token.
			}
		}
		setUser(null);
		setToken(null);
		persistSession(null, null);
	};

	const updateProfile = async (payload: ProfilePayload) => {
		if (!token) {
			throw new Error("Faça login para atualizar seu perfil.");
		}
		const profile = await apiFetch<AuthUser>("/account/profile", {
			method: "PATCH",
			token,
			body: JSON.stringify(payload),
		});
		setUser(profile);
		persistSession(profile, token);
		return profile;
	};

	const value: AuthContextType = {
		user,
		token,
		isLoggedIn: !!user && !!token,
		isLoading,
		login,
		register,
		logout,
		refreshProfile,
		updateProfile,
	};

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
