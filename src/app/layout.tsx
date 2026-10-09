import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import { AuthProvider } from "@/components/AuthContext";
import LayoutShell from "@/components/LayoutShell";
import "./globals.css";

const manrope = Manrope({
	subsets: ["latin"],
	weight: ["400", "500", "600", "700", "800"],
	variable: "--font-display",
	display: "swap",
});

export const metadata: Metadata = {
	title: "Bolão Celeste - Comunidade de Torcedores",
	description:
		"Junte-se a mais de 50.000 torcedores palpitando nos jogos do Cruzeiro.",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="pt-BR" className="dark">
			<head>
				{/* eslint-disable-next-line @next/next/no-page-custom-font */}
				<link
					href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
					rel="stylesheet"
				/>
			</head>
			<body
				className={`${manrope.variable} font-display bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 min-h-screen relative overflow-x-hidden antialiased`}
			>
				<AuthProvider>
					{/* Starry sky background */}
					<div className="absolute inset-0 z-0 pointer-events-none starry-bg" />

					<div className="relative z-10 flex flex-col min-h-screen">
						<LayoutShell>{children}</LayoutShell>
					</div>
				</AuthProvider>
			</body>
		</html>
	);
}
