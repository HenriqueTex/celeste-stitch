import type { Metadata } from "next";
import { Suspense } from "react";
import PasswordResetPanel from "@/components/PasswordResetPanel";

export const metadata: Metadata = {
	title: "Redefinir senha — Bolão Celeste",
	description: "Crie uma nova senha para sua conta no Bolão Celeste.",
};

export default function PasswordResetPage() {
	return (
		<Suspense>
			<PasswordResetPanel />
		</Suspense>
	);
}
