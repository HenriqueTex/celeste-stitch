"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import MaterialIcon from "@/components/icons/MaterialIcon";

const navLinks = [
	{ href: "/", label: "Início" },
	{ href: "/leaderboard", label: "Ranking" },
	{ href: "/matches", label: "Jogos" },
];

export default function Header() {
	const pathname = usePathname();

	return (
		<header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-slate-200 dark:border-white/10 px-6 sm:px-10 py-4 bg-surface-light/80 dark:bg-surface-dark/95 backdrop-blur-md sticky top-0 z-50">
			{/* Logo */}
			<Link href="/" className="flex items-center gap-4 text-primary dark:text-white">
				<div className="size-8 text-primary bg-primary/10 rounded-lg flex items-center justify-center">
					<MaterialIcon name="hub" className="font-bold" />
				</div>
				<div>
					<h2 className="text-xl font-black leading-tight tracking-tight italic">
						BOLÃO CELESTE
					</h2>
					<span className="text-[10px] font-bold uppercase tracking-widest text-primary/70">
						Comunidade de Torcedores
					</span>
				</div>
			</Link>

			{/* Right side */}
			<div className="flex flex-1 justify-end gap-6 sm:gap-8">
				{/* Desktop nav */}
				<nav className="hidden lg:flex items-center gap-8">
					{navLinks.map((link) => {
						const isActive = link.href === "/"
							? pathname === "/"
							: pathname.startsWith(link.href);

						return (
							<Link
								key={link.href}
								href={link.href}
								className={
									isActive
										? "text-primary dark:text-blue-400 text-sm font-bold border-b-2 border-primary"
										: "text-slate-600 dark:text-slate-400 hover:text-primary dark:hover:text-blue-400 text-sm font-semibold transition-colors"
								}
							>
								{link.label}
							</Link>
						);
					})}
				</nav>

				{/* Actions */}
				<div className="flex items-center gap-3">
					<button
						className="flex items-center justify-center size-10 rounded-xl bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 transition-colors text-slate-700 dark:text-slate-200 relative"
						aria-label="Notificações"
					>
						<MaterialIcon name="notifications" className="text-[20px]" />
						<span className="absolute top-2 right-2 size-2 bg-red-500 rounded-full border-2 border-surface-dark" />
					</button>
					<div className="size-10 rounded-full bg-gradient-to-tr from-primary to-blue-400 p-0.5">
						<div className="size-full rounded-full bg-surface-dark flex items-center justify-center overflow-hidden">
							{/* eslint-disable-next-line @next/next/no-img-element */}
							<img
								alt="User avatar"
								className="size-full object-cover"
								src="https://lh3.googleusercontent.com/aida-public/AB6AXuB1WicAuHonvHV7Wbn_icYNUH8XPR5kBTxbJ3zPQiHuTjQBWITOegnNCKFGX8Ca1TNXvOqoxTiKOM0hLnkZU7jdof9_0z6Ys7KaSaj1b7Q-P-33gwsSoiFTejYbNQnamON8Lhjp5h5ehQP90I5eR8UH5bOmHQc-Rkr_5v4xTsQl_lrxfpJO94VCrrwcFc115veHQKba2tgO_7NAQZoh_hyvbWbooJOSr8dF3TVE8dwNOHOnudGRZaeOE8bq77bPmR1kxPsm-fB3_HDm"
							/>
						</div>
					</div>
				</div>
			</div>
		</header>
	);
}
