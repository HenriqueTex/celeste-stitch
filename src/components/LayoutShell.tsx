"use client";
import { usePathname } from "next/navigation";
import Header from "@/components/Header";
import ActivityTicker from "@/components/ActivityTicker";
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
			{pathname === "/" && <div className="editorial-art" aria-hidden="true" />}
			<BettingProvider>
				<a className="skip-link" href="#main-content">
					Ir para o conteúdo
				</a>
				<Header />
				<ActivityTicker />
				<main id="main-content" className="client-main" tabIndex={-1}>
					{children}
				</main>
				<footer className="client-footer">
					{/* eslint-disable-next-line @next/next/no-img-element */}
					<img
						className="footer-logo"
						src="/brand/logo-light.png"
						alt="Bolão Celeste"
						width={142}
						height={36}
						loading="lazy"
					/>
					<span>Uma comunidade. A mesma paixão.</span>
				</footer>
				<MobileNav />
			</BettingProvider>
		</div>
	);
}
