"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Goal, House, Plus, Ticket, Trophy } from "lucide-react";
import { useBetting } from "@/components/BettingContext";
import { acceptsPicks } from "@/components/MatchPrediction";
import { useResource } from "@/hooks/use-resource";
import type { MatchItem } from "@/lib/types";
const items = [
	{ href: "/", label: "Início", Icon: House },
	{ href: "/matches", label: "Jogos", Icon: Goal },
	{ href: "/leaderboard", label: "Ranking", Icon: Trophy },
	{ href: "/my-bets", label: "Meus palpites", Icon: Ticket },
];
export default function MobileNav() {
	const pathname = usePathname();
	const router = useRouter();
	const { activeMatch, orderFor, openCheckout } = useBetting();
	const { data: activeMatches } = useResource<MatchItem[]>("/matches/active");
	// The match on screen wins; elsewhere, the next match still taking picks.
	const target =
		activeMatch && (orderFor(activeMatch.id) || acceptsPicks(activeMatch))
			? activeMatch
			: (activeMatches ?? [])
					.filter(acceptsPicks)
					.sort((a, b) => a.scheduledAt.localeCompare(b.scheduledAt))[0];
	// Opens the checkout on its review step, the same screen "Revisar palpite" leads to.
	// A closed match with an order opens that order instead.
	const goToPicker = () => {
		if (!target) router.push("/matches");
		else if (acceptsPicks(target)) openCheckout(target);
		else openCheckout(target, orderFor(target.id));
	};
	const renderItem = ({ href, label, Icon }: (typeof items)[number]) => {
		const active = href === "/" ? pathname === "/" : pathname?.startsWith(href);
		return (
			<Link
				key={href}
				href={href}
				aria-current={active ? "page" : undefined}
			>
				<Icon size={20} aria-hidden="true" />
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
				aria-label={
					target && !acceptsPicks(target) ? "Ver meu pedido" : "Fazer palpite"
				}
				onClick={goToPicker}
			>
				<Plus size={24} strokeWidth={2.5} aria-hidden="true" />
			</button>
			{items.slice(2).map(renderItem)}
		</nav>
	);
}
