"use client";

import { useEffect, useRef, useState } from "react";
import { apiFetch } from "@/lib/api";
import { formatShortDate } from "@/lib/format";
import type { MatchItem } from "@/lib/types";

export default function MatchHistory() {
	const scrollRef = useRef<HTMLDivElement>(null);
	const [results, setResults] = useState<MatchItem[]>([]);

	useEffect(() => {
		void apiFetch<MatchItem[]>("/matches/history")
			.then(setResults)
			.catch(() => setResults([]));
	}, []);

	useEffect(() => {
		const el = scrollRef.current;
		if (!el) return;
		requestAnimationFrame(() => {
			el.scrollTo({ left: el.scrollWidth, behavior: "auto" });
		});
	}, [results]);

	return (
		<section>
			<div className="flex items-center justify-between mb-3 px-1">
				<div className="flex items-center gap-2">
					<span className="material-symbols-outlined text-primary text-[20px]">
						history
					</span>
					<h2 className="text-sm sm:text-base font-black uppercase italic tracking-tight">
						Histórico de Jogos
					</h2>
				</div>
			</div>

			<div
				ref={scrollRef}
				className="flex gap-2.5 overflow-x-auto pb-2 px-1 snap-x snap-mandatory [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
			>
				{results.length === 0 && (
					<div className="glass-panel rounded-xl p-4 text-sm text-slate-400">
						Os resultados aparecem aqui assim que o admin registra e liquida as partidas.
					</div>
				)}

				{results.map((match, i) => {
					const isLatest = i === 0;
					const outcome =
						match.result && match.result.homeScore > match.result.awayScore
							? "V"
							: match.result && match.result.homeScore < match.result.awayScore
								? "D"
								: "E";

					return (
						<div
							key={match.id}
							className="flex-none w-[calc(45vw-12px)] sm:w-44 lg:w-48 snap-start"
						>
							<div
								className={`relative rounded-xl overflow-hidden border border-white/10 bg-surface-dark min-h-48 p-4 flex flex-col justify-between ${
									isLatest ? "ring-2 ring-primary/50" : ""
								}`}
							>
								<div className="flex items-start justify-between">
									<span className="inline-flex items-center justify-center w-7 h-7 rounded-lg text-[11px] font-black border bg-primary/20 border-primary/40 text-primary">
										{outcome}
									</span>
									{isLatest && (
										<span className="bg-primary/80 text-white text-[8px] font-black px-1.5 py-0.5 rounded-md uppercase tracking-widest">
											Último
										</span>
									)}
								</div>
								<div>
									<p className="text-slate-300 text-[11px] font-bold uppercase tracking-wide mb-0.5">
										{match.competition}
									</p>
									<p className="text-white/90 text-[11px] font-semibold uppercase tracking-wide leading-tight mb-1">
										{match.homeTeam} x {match.awayTeam}
									</p>
									<p className="text-white text-2xl font-black italic leading-none">
										{match.result
											? `${match.result.homeScore} - ${match.result.awayScore}`
											: "—"}
									</p>
									<p className="text-slate-300 text-xs font-medium mt-1">
										{formatShortDate(match.scheduledAt)}
									</p>
								</div>
							</div>
						</div>
					);
				})}
			</div>
		</section>
	);
}
