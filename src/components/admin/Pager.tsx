"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Pager({
	page,
	lastPage,
	total,
	onPage,
}: {
	page: number;
	lastPage: number;
	total: number;
	onPage: (page: number) => void;
}) {
	return (
		<div className="flex items-center justify-between gap-3 pt-4 text-sm text-muted-foreground">
			<span>
				{total.toLocaleString("pt-BR")} {total === 1 ? "registro" : "registros"}
			</span>
			<div className="flex items-center gap-2">
				<Button
					variant="outline"
					size="sm"
					disabled={page <= 1}
					onClick={() => onPage(page - 1)}
					aria-label="Página anterior"
				>
					<ChevronLeft className="size-4" />
				</Button>
				<span>
					Página {page} de {Math.max(lastPage, 1)}
				</span>
				<Button
					variant="outline"
					size="sm"
					disabled={page >= lastPage}
					onClick={() => onPage(page + 1)}
					aria-label="Próxima página"
				>
					<ChevronRight className="size-4" />
				</Button>
			</div>
		</div>
	);
}
