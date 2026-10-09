"use client";

import { usePathname } from "next/navigation";
import Header from "@/components/Header";
import MobileNav from "@/components/MobileNav";

export default function LayoutShell({
	children,
}: {
	children: React.ReactNode;
}) {
	const pathname = usePathname();
	const isAdminRoute = pathname?.startsWith("/admin") ?? false;

	if (isAdminRoute) {
		return <>{children}</>;
	}

	return (
		<>
			<Header />
			<main className="flex-1 flex justify-center pt-6 pb-28 px-4 sm:px-8 lg:pb-6">
				<div className="w-full max-w-[1200px]">{children}</div>
			</main>
			<MobileNav />
		</>
	);
}
