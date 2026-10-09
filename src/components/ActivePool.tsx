"use client";

import { useEffect, useState } from "react";
import MaterialIcon from "@/components/icons/MaterialIcon";
import { apiFetch } from "@/lib/api";
import { formatCurrency } from "@/lib/format";
import type { HomeResponse } from "@/lib/types";

export default function ActivePool() {
	const [data, setData] = useState<HomeResponse | null>(null);
	const participants = data?.participantsCount ?? 0;

	useEffect(() => {
		void apiFetch<HomeResponse>("/home").then(setData).catch(() => setData(null));
	}, []);

	return (
		<section className="glass-panel rounded-2xl p-6 bg-gradient-to-br from-surface-dark to-primary/20">
			<h3 className="font-black uppercase italic tracking-tight mb-4 flex items-center gap-2">
				<MaterialIcon name="payments" className="text-primary" />
				Bolão Celeste
			</h3>

			<div className="text-center py-4 bg-black/20 rounded-2xl border border-white/5 mb-6">
				<p className="text-xs font-bold text-slate-300 uppercase">
					{data?.nextMatch ? "Pote da Partida" : "Aguardando nova partida"}
				</p>
				<p className="text-3xl font-black text-white italic">
					{data?.nextMatch ? formatCurrency(data.activePoolAmount) : "—"}
				</p>
				<p className="text-xs text-slate-300 mt-1">
					{participants} {participants === 1 ? "torcedor cadastrado" : "torcedores cadastrados"}
				</p>
			</div>

			{data?.poolDistribution && (
				<div className="space-y-4">
					<div className="flex items-start gap-3">
						<div className="size-8 rounded-lg bg-primary/20 flex items-center justify-center shrink-0">
							<MaterialIcon name="celebration" className="text-primary text-lg" />
						</div>
						<div>
							<p className="text-xs font-bold">{data.poolDistribution.winners}% Vencedores</p>
							<p className="text-xs text-slate-300">
								Rateio proporcional entre os acertadores exatos.
							</p>
						</div>
					</div>
					<div className="flex items-start gap-3">
						<div className="size-8 rounded-lg bg-accent/20 flex items-center justify-center shrink-0">
							<MaterialIcon name="volunteer_activism" className="text-accent text-lg" />
						</div>
						<div>
							<p className="text-xs font-bold">{data.poolDistribution.base}% Base Jovem</p>
							<p className="text-xs text-slate-300">
								Percentual destinado à Base Jovem.
							</p>
						</div>
					</div>
				</div>
			)}
		</section>
	);
}
