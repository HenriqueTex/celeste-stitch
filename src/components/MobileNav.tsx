"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Goal, House, Plus, Ticket, Trophy } from "lucide-react";
import { useBetting } from "@/components/BettingContext";
const items = [
	{ href: "/", label: "Início", Icon: House },
	{ href: "/matches", label: "Jogos", Icon: Goal },
	{ href: "/leaderboard", label: "Ranking", Icon: Trophy },
	{ href: "/my-bets", label: "Meus palpites", Icon: Ticket },
];
export function focusScorePicker() {
	const panel = document.getElementById("palpite");
	if (!panel) return false;
	panel.scrollIntoView({ behavior: "smooth", block: "start" });
	panel
		.querySelector<HTMLInputElement>(".score-value:not(:disabled)")
		?.focus({ preventScroll: true });
	return true;
}
export default function MobileNav() {
	const pathname = usePathname();
	const router = useRouter();
	const { activeMatch, orderFor, openCheckout } = useBetting();
	const order = activeMatch ? orderFor(activeMatch.id) : undefined;
	const goToPicker = () => {
		if (activeMatch && order) {
			openCheckout(activeMatch, order);
			return;
		}
		if (!focusScorePicker()) router.push("/#palpite");
	};
	const renderItem = ({ href, label, Icon }: (typeof items)[number]) => {
		const active = href === "/" ? pathname === "/" : pathname?.startsWith(href);
		return (
			<Link
				key={href}
				href={href}
				aria-current={active ? "page" : undefined}
			>
				<Icon size={22} aria-hidden="true" />
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
				aria-label={order ? "Ver meu pedido" : "Fazer palpite"}
				onClick={goToPicker}
			>
				<Plus size={28} strokeWidth={2.5} aria-hidden="true" />
			</button>
			{items.slice(2).map(renderItem)}
		</nav>
	);
}
