"use client";

import { useEffect, useState } from "react";
import MaterialIcon from "@/components/icons/MaterialIcon";
import { apiFetch } from "@/lib/api";
import type { LeaderboardRow } from "@/lib/types";

export default function TopPredictors() {
	const [predictors, setPredictors] = useState<LeaderboardRow[]>([]);

	useEffect(() => {
		void apiFetch<LeaderboardRow[]>("/leaderboard")
			.then((rows) => setPredictors(rows.slice(0, 3)))
			.catch(() => setPredictors([]));
	}, []);

	return (
		<section className="glass-panel rounded-2xl p-6 border-b-4 border-b-accent">
			<div className="flex items-center justify-between mb-6">
				<div className="flex items-center gap-2">
					<MaterialIcon name="military_tech" className="text-accent font-black" />
					<h3 className="font-black uppercase italic tracking-tight">
						Melhores Palpiteiros
					</h3>
				</div>
				<span className="text-xs font-bold text-slate-300">Geral</span>
			</div>

			<div className="space-y-4">
				{predictors.length === 0 && (
					<div className="text-xs text-slate-300">
						O ranking aparecerá assim que as partidas forem liquidadas.
					</div>
				)}

				{predictors.map((player, index) => (
					<div
						key={player.userId}
						className={`flex items-center justify-between p-3 rounded-xl transition-all ${
							index === 0
								? "bg-accent/10 border border-accent/20"
								: "bg-white/5 border border-white/5"
						}`}
					>
						<div className="flex items-center gap-3">
							<span
								className={`font-black italic text-lg w-4 ${
									index === 0 ? "text-accent" : "text-slate-300"
								}`}
							>
								{player.rank}
							</span>
							<div className="size-10 rounded-lg overflow-hidden bg-primary/10 border border-white/10 flex items-center justify-center font-black">
								{player.avatarUrl ? (
									// eslint-disable-next-line @next/next/no-img-element
									<img
										alt={player.name}
										className="size-full object-cover"
										src={player.avatarUrl}
									/>
								) : (
									player.name.charAt(0)
								)}
							</div>
							<div>
								<p className="font-bold text-sm">{player.name}</p>
								<p className="text-xs font-bold uppercase text-slate-300">
									{player.accuracy}% acertos
								</p>
							</div>
						</div>
						<div className="text-right">
							<p className="text-xs font-black italic">
								{player.points.toLocaleString("pt-BR")} pts
							</p>
						</div>
					</div>
				))}
			</div>
		</section>
	);
}
