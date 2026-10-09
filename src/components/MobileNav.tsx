"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Goal, House, Plus, Ticket, Trophy } from "lucide-react";
import { useBetting } from "@/components/BettingContext";
import { apiFetch } from "@/lib/api";
import type { HomeResponse } from "@/lib/types";
const items = [
	{ href: "/", label: "Início", Icon: House },
	{ href: "/matches", label: "Jogos", Icon: Goal },
	{ href: "/leaderboard", label: "Ranking", Icon: Trophy },
	{ href: "/my-bets", label: "Meus palpites", Icon: Ticket },
];
export default function MobileNav() {
	const pathname = usePathname();
	const router = useRouter();
	const { activeMatch, setActiveMatch, openCheckout } = useBetting();
	const [loading, setLoading] = useState(false);
	const reviewPalpite = async () => {
		if (loading) return;
		if (activeMatch) {
			openCheckout(activeMatch);
			return;
		}
		setLoading(true);
		try {
			const home = await apiFetch<HomeResponse>("/home");
			const now = Date.now();
			const match = (home.matches ?? []).find(
				(item) =>
					item.status === "open" &&
					new Date(item.scheduledAt).getTime() > now &&
					new Date(item.bettingDeadlineAt).getTime() > now,
			) ?? home.nextMatch;
			if (match) {
				setActiveMatch(match);
				openCheckout(match);
			} else router.push("/matches#palpite");
		} catch {
			router.push("/matches#palpite");
		} finally {
			setLoading(false);
		}
	};
	const renderItem = ({ href, label, Icon }: (typeof items)[number]) => {
		const active = href === "/" ? pathname === "/" : pathname?.startsWith(href);
		return (
			<Link
				key={href}
				href={href}
				aria-current={active ? "page" : undefined}
			>
				<Icon size={23} aria-hidden="true" />
				<span>{label}</span>
			</Link>
		);
	};
	return (
		<nav className="client-mobile-nav" aria-label="Navegação principal">
			{items.slice(0, 2).map(renderItem)}
			<button
				type="button"
				className="mobile-nav-action"
				aria-label={loading ? "Carregando palpite" : "Revisar palpite"}
				aria-busy={loading}
				disabled={loading}
				onClick={() => void reviewPalpite()}
			>
				<Plus size={28} strokeWidth={2.5} aria-hidden="true" />
			</button>
			{items.slice(2).map(renderItem)}
		</nav>
	);
}
