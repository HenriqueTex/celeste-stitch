"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import MaterialIcon from "@/components/icons/MaterialIcon";
import { useAuth } from "@/components/AuthContext";
import AuthModal from "@/components/AuthModal";
import ProfileModal from "@/components/ProfileModal";

const navLinks = [
	{ href: "/", label: "Início" },
	{ href: "/leaderboard", label: "Ranking" },
	{ href: "/matches", label: "Jogos" },
	{ href: "/my-bets", label: "Palpites" },
];

export default function Header() {
	const pathname = usePathname();
	const { user, isLoggedIn, logout } = useAuth();
	const [authModalOpen, setAuthModalOpen] = useState(false);
	const [profileModalOpen, setProfileModalOpen] = useState(false);
	const [initialView, setInitialView] = useState<
		"options" | "login" | "register"
	>("options");
	const [menuOpen, setMenuOpen] = useState(false);

	const openAuth = (view: "login" | "register") => {
		setInitialView(view);
		setAuthModalOpen(true);
	};

	return (
		<>
			<header className="sticky top-0 z-50 border-b border-white/10 bg-surface-dark/95 backdrop-blur-md">
				<div className="flex items-center justify-between px-4 sm:px-8 lg:px-10 h-14 sm:h-16">
					{/* ── Logo ── */}
					<Link href="/" className="flex items-center gap-2.5 shrink-0">
						<div className="size-8 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
							<MaterialIcon name="hub" className="text-lg font-bold" />
						</div>
						<div className="flex flex-col leading-none">
							<span className="text-base sm:text-lg font-black italic tracking-tight text-white">
								BOLÃO CELESTE
							</span>
							{/* Subtítulo só em desktop */}
							<span className="hidden sm:block text-[9px] font-bold uppercase tracking-widest text-primary/70">
								Comunidade de Torcedores
							</span>
						</div>
					</Link>

					{/* ── Desktop nav (lg+) ── */}
					<nav className="hidden lg:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
						{navLinks.map((link) => {
							const isActive =
								link.href === "/"
									? pathname === "/"
									: pathname.startsWith(link.href);
							return (
								<Link
									key={link.href}
									href={link.href}
									className={
										isActive
											? "text-primary text-sm font-bold border-b-2 border-primary pb-0.5"
											: "text-slate-400 hover:text-primary text-sm font-semibold transition-colors"
									}
								>
									{link.label}
								</Link>
							);
						})}
					</nav>

					{/* ── Right actions ── */}
					<div className="flex items-center gap-2 shrink-0">
						{isLoggedIn ? (
							<>
								{/* Notificações */}
								<button
									className="hidden sm:flex size-9 items-center justify-center rounded-xl bg-white/5 hover:bg-white/10 transition-colors relative"
									aria-label="Notificações"
								>
									<MaterialIcon
										name="notifications"
										className="text-[20px] text-slate-300"
									/>
									<span className="absolute top-1.5 right-1.5 size-2 bg-red-500 rounded-full border border-surface-dark" />
								</button>

								{/* Avatar + dropdown */}
								<div className="relative">
									<button
										onClick={() => setMenuOpen(!menuOpen)}
										className="size-9 rounded-full bg-gradient-to-tr from-primary to-blue-400 p-0.5 cursor-pointer"
									>
										<div className="size-full rounded-full bg-surface-dark flex items-center justify-center overflow-hidden text-white font-black text-sm">
											{user?.avatarUrl ? (
												// eslint-disable-next-line @next/next/no-img-element
												<img
													alt="Avatar"
													className="size-full object-cover"
													src={user.avatarUrl}
												/>
											) : (
												(user?.nickname ||
													user?.fullName ||
													user?.email)?.charAt(0).toUpperCase()
											)}
										</div>
									</button>

									{menuOpen && (
										<div
											className="absolute right-0 top-11 glass-panel rounded-xl p-2 min-w-[190px] animate-[modal-in_0.15s_ease-out] z-50 shadow-xl"
											onMouseLeave={() => setMenuOpen(false)}
										>
											<div className="px-3 py-2 border-b border-white/5 mb-1">
												<p className="font-bold text-sm truncate">
													{user?.nickname ||
														user?.fullName ||
														"Torcedor Celeste"}
												</p>
												<p className="text-[10px] text-slate-500 truncate">
													{user?.email}
												</p>
											</div>
											<button
												onClick={() => {
													setProfileModalOpen(true);
													setMenuOpen(false);
												}}
												className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-slate-200 hover:bg-white/5 transition-colors font-medium"
											>
												<MaterialIcon
													name="manage_accounts"
													className="text-base"
												/>
												Editar perfil
											</button>
											<button
												onClick={() => {
													void logout();
													setMenuOpen(false);
												}}
												className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-red-400 hover:bg-red-500/10 transition-colors font-medium"
											>
												<MaterialIcon
													name="logout"
													className="text-base"
												/>
												Sair
											</button>
										</div>
									)}
								</div>
							</>
						) : (
							<>
								<button
									onClick={() => openAuth("register")}
									className="px-3 sm:px-4 py-2 border-2 border-primary text-primary hover:bg-primary hover:text-white font-black text-[11px] rounded-lg transition-all uppercase tracking-wider"
								>
									Cadastre-se
								</button>
								<button
									onClick={() => openAuth("login")}
									className="px-3 sm:px-5 py-2 bg-primary hover:bg-blue-600 text-white font-black text-[11px] rounded-lg transition-colors shadow-lg shadow-primary/20 uppercase tracking-wider"
								>
									Entrar
								</button>
							</>
						)}
					</div>
				</div>
			</header>

			<AuthModal
				open={authModalOpen}
				initialView={initialView}
				onClose={() => {
					setAuthModalOpen(false);
					setInitialView("options");
				}}
			/>

			<ProfileModal
				open={profileModalOpen}
				onClose={() => setProfileModalOpen(false)}
			/>
		</>
	);
}
