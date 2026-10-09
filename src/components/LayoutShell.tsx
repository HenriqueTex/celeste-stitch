"use client";
import { usePathname } from "next/navigation";
import Header from "@/components/Header";
import MobileNav from "@/components/MobileNav";
import { BettingProvider } from "@/components/BettingContext";
export default function LayoutShell({
	children,
}: {
	children: React.ReactNode;
}) {
	const pathname = usePathname();
	if (pathname?.startsWith("/admin")) return <>{children}</>;
	return (
		<div className="client-shell">
			<div className="starry-bg" aria-hidden="true" />
			<BettingProvider>
				<a className="skip-link" href="#main-content">
					Ir para o conteúdo
				</a>
				<Header />
				<main id="main-content" className="client-main" tabIndex={-1}>
					{children}
				</main>
				<footer className="client-footer">
					<span>Bolão Celeste</span>
					<span>Uma comunidade. A mesma paixão.</span>
				</footer>
				<MobileNav />
			</BettingProvider>
		</div>
	);
}
