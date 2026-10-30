"use client";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { ChevronDown, LogOut, UserRound } from "lucide-react";
import { useAuth } from "@/components/AuthContext";
import AuthModal from "@/components/AuthModal";
import ProfileModal from "@/components/ProfileModal";
const links = [
	{ href: "/", label: "Início" },
	{ href: "/matches", label: "Jogos" },
	{ href: "/leaderboard", label: "Ranking" },
	{ href: "/my-bets", label: "Meus palpites" },
];
type AuthRequest = {
	view: "login" | "register";
	values?: Record<string, string>;
};
export default function Header() {
	const pathname = usePathname();
	const { user, isLoggedIn, logout } = useAuth();
	const [auth, setAuth] = useState<AuthRequest | null>(null);
	const [profile, setProfile] = useState(false);
	const [menu, setMenu] = useState(false);
	const menuRef = useRef<HTMLDivElement>(null);
	const menuButton = useRef<HTMLButtonElement>(null);
	const displayName = user?.nickname || user?.fullName || user?.email || "";
	useEffect(() => {
		const request = (event: Event) =>
			setAuth((event as CustomEvent<AuthRequest>).detail);
		window.addEventListener("celeste:open-auth", request);
		return () => window.removeEventListener("celeste:open-auth", request);
	}, []);
	useEffect(() => {
		if (!menu) return;
		const outside = (event: PointerEvent) => {
			if (!menuRef.current?.contains(event.target as Node)) setMenu(false);
		};
		const escape = (event: KeyboardEvent) => {
			if (event.key === "Escape") {
				setMenu(false);
				menuButton.current?.focus();
			}
		};
		document.addEventListener("pointerdown", outside);
		document.addEventListener("keydown", escape);
		return () => {
			document.removeEventListener("pointerdown", outside);
			document.removeEventListener("keydown", escape);
		};
	}, [menu]);
	return (
		<>
			<header className="client-header">
				<div className="client-header-inner">
					<Link href="/" className="brand">
						{/* eslint-disable-next-line @next/next/no-img-element */}
						<img
							className="brand-mark"
							src="/brand/icon.svg"
							alt=""
							width={44}
							height={44}
						/>
						<span className="brand-wordmark">
							Bolão <strong>Celeste</strong>
						</span>
					</Link>
					<nav aria-label="Navegação principal" className="desktop-nav">
						{links.map((link) => (
							<Link
								key={link.href}
								href={link.href}
								aria-current={pathname === link.href ? "page" : undefined}
							>
								{link.label}
							</Link>
						))}
					</nav>
					{isLoggedIn ? (
						<div className="account-menu" ref={menuRef}>
							<button
								ref={menuButton}
								className="account-trigger"
								aria-label={`Conta de ${displayName}`}
								aria-expanded={menu}
								aria-controls="account-options"
								onClick={() => setMenu(!menu)}
							>
								<span className="avatar-letter" aria-hidden="true">
									{user?.avatarUrl ? (
										// eslint-disable-next-line @next/next/no-img-element
										<img src={user.avatarUrl} alt="" width={40} height={40} />
									) : (
										user?.initials || displayName.charAt(0)
									)}
								</span>
								<span className="account-name">{displayName}</span>
								<ChevronDown size={16} aria-hidden="true" />
							</button>
							{menu && (
								<div id="account-options" className="account-options">
									<p>{displayName}</p>
									<button
										onClick={() => {
											setProfile(true);
											setMenu(false);
										}}
									>
										<UserRound size={16} aria-hidden="true" />
										Editar perfil
									</button>
									<button
										onClick={() => {
											void logout();
											setMenu(false);
										}}
									>
										<LogOut size={16} aria-hidden="true" />
										Sair da conta
									</button>
								</div>
							)}
						</div>
					) : (
						<div className="header-actions">
							<button
								className="create-account-link"
								onClick={() => setAuth({ view: "register" })}
							>
								Criar conta
							</button>
							<button
								className="client-button-secondary"
								onClick={() => setAuth({ view: "login" })}
							>
								Entrar
							</button>
						</div>
					)}
				</div>
			</header>
			<AuthModal
				open={auth !== null}
				initialView={auth?.view ?? "login"}
				initialValues={auth?.values}
				onClose={() => setAuth(null)}
			/>
			<ProfileModal open={profile} onClose={() => setProfile(false)} />
		</>
	);
}
