"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import MaterialIcon from "@/components/icons/MaterialIcon";

const navItems = [
	{ href: "/", icon: "hub", label: "Início" },
	{ href: "/matches", icon: "sports_soccer", label: "Jogos" },
	{ href: "/leaderboard", icon: "leaderboard", label: "Ranking" },
	{ href: "/my-bets", icon: "wallet", label: "Meus Palpites" },
];

export default function MobileNav() {
	const pathname = usePathname();

	return (
		<nav aria-label="Navegação principal" className="lg:hidden fixed inset-x-0 bottom-0 z-50 bg-surface-dark/95 border-t border-white/10 backdrop-blur-md px-3 py-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] flex justify-between items-center">
			{navItems.slice(0, 2).map((item) => {
				const isActive = item.href === "/"
					? pathname === "/"
					: pathname.startsWith(item.href);

				return (
					<Link
						key={item.href}
						href={item.href}
						className={`flex min-w-12 min-h-11 flex-col items-center justify-center gap-0.5 ${isActive ? "text-blue-300" : "text-slate-300"}`}
						aria-current={isActive ? "page" : undefined}
					>
						<MaterialIcon name={item.icon} />
						<span className="text-[11px] font-bold">{item.label}</span>
					</Link>
				);
			})}

			<Link href="/matches" aria-label="Ver jogos e fazer um palpite" className="-mt-8 size-14 rounded-full bg-primary flex items-center justify-center shadow-lg shadow-primary/40 border-4 border-background-dark focus-visible:outline-2 focus-visible:outline-white">
				<MaterialIcon name="add" className="text-white font-black text-2xl" />
			</Link>

			{navItems.slice(2).map((item) => {
				const isActive = pathname.startsWith(item.href);

				return (
					<Link
						key={item.href}
						href={item.href}
						className={`flex min-w-12 min-h-11 flex-col items-center justify-center gap-0.5 ${isActive ? "text-blue-300" : "text-slate-300"}`}
						aria-current={isActive ? "page" : undefined}
					>
						<MaterialIcon name={item.icon} />
						<span className="text-[11px] font-bold">{item.label}</span>
					</Link>
				);
			})}
		</nav>
	);
}
