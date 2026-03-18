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
		<div className="lg:hidden sticky bottom-0 z-50 bg-surface-dark/95 border-t border-white/10 backdrop-blur-md px-6 py-3 flex justify-between items-center">
			{navItems.slice(0, 2).map((item) => {
				const isActive = item.href === "/"
					? pathname === "/"
					: pathname.startsWith(item.href);

				return (
					<Link
						key={item.href}
						href={item.href}
						className={`flex flex-col items-center gap-1 ${isActive ? "text-primary" : "text-slate-500"}`}
					>
						<MaterialIcon name={item.icon} className={isActive ? "" : "text-slate-500"} />
						<span className="text-[10px] font-bold">{item.label}</span>
					</Link>
				);
			})}

			{/* Floating center button */}
			<div className="-mt-8 size-14 rounded-full bg-primary flex items-center justify-center shadow-lg shadow-primary/40 border-4 border-background-dark">
				<MaterialIcon name="add" className="text-white font-black text-2xl" />
			</div>

			{navItems.slice(2).map((item) => {
				const isActive = pathname.startsWith(item.href);

				return (
					<Link
						key={item.href}
						href={item.href}
						className={`flex flex-col items-center gap-1 ${isActive ? "text-primary" : "text-slate-500"}`}
					>
						<MaterialIcon name={item.icon} className={isActive ? "" : "text-slate-500"} />
						<span className="text-[10px] font-bold">{item.label}</span>
					</Link>
				);
			})}
		</div>
	);
}
