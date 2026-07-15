"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { AdminAuthProvider, useAdminAuth } from "@/components/AdminAuthContext";
import { AdminSidebar } from "@/components/ui/layout/admin-sidebar";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";

export default function AdminLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<AdminAuthProvider>
			<div className="admin-root dark min-h-screen">
				<AdminLayoutInner>{children}</AdminLayoutInner>
			</div>
		</AdminAuthProvider>
	);
}

function AdminLayoutInner({ children }: { children: React.ReactNode }) {
	const { isAdminLoggedIn, isLoading } = useAdminAuth();
	const router = useRouter();
	const pathname = usePathname();
	const isLoginPage = pathname === "/admin/login";

	useEffect(() => {
		if (!isLoading && !isAdminLoggedIn && !isLoginPage) {
			router.replace("/admin/login");
		}
	}, [isAdminLoggedIn, isLoading, isLoginPage, router]);

	if (isLoading) {
		return <div className="min-h-screen bg-background" />;
	}

	return (
		<SidebarProvider>
			{isAdminLoggedIn && !isLoginPage && <AdminSidebar />}
			<SidebarInset>
				{isAdminLoggedIn && !isLoginPage && (
					<header className="flex h-12 shrink-0 items-center gap-2 border-b bg-background px-4">
						<SidebarTrigger className="-ml-1" />
						<Separator orientation="vertical" className="mr-2 h-4" />
						<span className="text-sm text-muted-foreground font-medium">
							Bolão Celeste — Admin
						</span>
					</header>
				)}
				<main className="flex-1 p-4">{children}</main>
			</SidebarInset>
		</SidebarProvider>
	);
}
