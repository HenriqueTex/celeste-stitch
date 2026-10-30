import type { Metadata } from "next";
import { DM_Serif_Display, Inter, Manrope } from "next/font/google";
import { AuthProvider } from "@/components/AuthContext";
import LayoutShell from "@/components/LayoutShell";
import "./globals.css";

const manrope = Manrope({
	subsets: ["latin"],
	weight: ["400", "500", "600", "700", "800"],
	variable: "--font-display",
	display: "swap",
});

const inter = Inter({
	subsets: ["latin"],
	variable: "--font-ui",
	display: "swap",
});

const editorial = DM_Serif_Display({
	subsets: ["latin"],
	weight: "400",
	variable: "--font-editorial",
	display: "swap",
});

export const metadata: Metadata = {
	title: "Bolão Celeste — Comunidade de Torcedores",
	description:
		"Acompanhe os jogos do Cruzeiro, escolha seus placares e participe da comunidade Bolão Celeste.",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="pt-BR" className="dark">
			<body
				className={`${manrope.variable} ${inter.variable} ${editorial.variable} font-display bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 min-h-screen relative overflow-x-hidden antialiased`}
			>
				<AuthProvider>
					<div className="relative z-10 flex flex-col min-h-screen">
						<LayoutShell>{children}</LayoutShell>
					</div>
				</AuthProvider>
			</body>
		</html>
	);
}
