"use client";

import { useEffect, useMemo, useState } from "react";
import MaterialIcon from "@/components/icons/MaterialIcon";
import BetModal from "@/components/BetModal";
import { apiFetch } from "@/lib/api";
import { formatCurrency, formatDateTime } from "@/lib/format";
import type { MatchItem } from "@/lib/types";

function shortCode(name: string) {
	return name.slice(0, 3).toUpperCase();
}

export default function MatchPrediction() {
	const [homeScore, setHomeScore] = useState(2);
	const [awayScore, setAwayScore] = useState(0);
	const [betOpen, setBetOpen] = useState(false);
	const [matches, setMatches] = useState<MatchItem[]>([]);

	useEffect(() => {
		void apiFetch<MatchItem[]>("/matches/active")
			.then(setMatches)
			.catch(() => setMatches([]));
	}, []);

	const match = useMemo(
		() => matches.find((item) => item.status === "open") ?? matches[0] ?? null,
		[matches]
	);

	if (!match) {
		return (
			<section className="glass-panel rounded-2xl p-8 text-center text-slate-400">
				Nenhuma partida ativa disponível no momento.
			</section>
		);
	}

	const consensusTickets = match.stats.consensus?.tickets ?? 0;
	const consensusPercent =
		match.stats.tickets > 0
			? Math.min(100, Math.round((consensusTickets / match.stats.tickets) * 100))
			: 50;

	return (
		<>
			<section>
				<div className="glass-panel rounded-2xl overflow-hidden border-2 border-primary/30 relative">
					<div className="absolute top-0 right-0 p-4">
						<div className="bg-primary/20 text-primary text-[10px] font-black px-2 py-1 rounded-lg uppercase tracking-widest border border-primary/30">
							{match.status === "open" ? "Próxima Partida" : "Apostas Fechadas"}
						</div>
					</div>

					<div className="p-8">
						<div className="flex flex-col items-center mb-6">
							<div className="flex items-center justify-center gap-12 sm:gap-20">
								<div className="flex flex-col items-center gap-4">
									<div className="size-24 rounded-3xl bg-primary flex items-center justify-center shadow-[0_0_30px_rgba(45,63,239,0.4)] p-3 overflow-hidden">
										{match.homeTeamLogoUrl ? (
											// eslint-disable-next-line @next/next/no-img-element
											<img
												src={match.homeTeamLogoUrl}
												alt={match.homeTeam}
												className="size-full object-contain"
											/>
										) : (
											<MaterialIcon name="shield" className="text-5xl text-white" />
										)}
									</div>
									<span className="font-black italic text-xl">
										{shortCode(match.homeTeam)}
									</span>
								</div>

								<div className="text-4xl font-black italic text-slate-700">VS</div>

								<div className="flex flex-col items-center gap-4">
									<div className="size-24 rounded-3xl bg-surface-dark border-2 border-white/10 flex items-center justify-center p-3 overflow-hidden">
										{match.awayTeamLogoUrl ? (
											// eslint-disable-next-line @next/next/no-img-element
											<img
												src={match.awayTeamLogoUrl}
												alt={match.awayTeam}
												className="size-full object-contain"
											/>
										) : (
											<MaterialIcon
												name="sports_soccer"
												className="text-5xl text-slate-400"
											/>
										)}
									</div>
									<span className="font-black italic text-xl">
										{shortCode(match.awayTeam)}
									</span>
								</div>
							</div>
							<p className="text-xs text-slate-500 mt-4">
								{match.competition} · {formatDateTime(match.scheduledAt)}
							</p>
						</div>

						<div className="space-y-4 mb-8">
							<div className="flex items-center justify-between text-[11px] font-black uppercase tracking-wider">
								<span className="text-primary">
									Palpite líder: {consensusPercent}%
								</span>
								<span className="text-slate-500">
									encerramento {formatDateTime(match.bettingDeadlineAt)}
								</span>
							</div>
							<div className="h-3 w-full bg-slate-800 rounded-full overflow-hidden p-0.5">
								<div
									className="h-full bg-gradient-to-r from-primary to-blue-400 rounded-full transition-all duration-500"
									style={{ width: `${consensusPercent}%` }}
								/>
							</div>

							<div className="grid grid-cols-3 gap-2 text-center">
								<div className="bg-white/5 rounded-lg p-2 border border-white/10">
									<p className="text-[9px] text-slate-500 uppercase font-black">
										Placar Mais Votado
									</p>
									<p className="text-lg font-black italic text-primary">
										{match.stats.consensus
											? `${match.stats.consensus.homeScore} - ${match.stats.consensus.awayScore}`
											: "—"}
									</p>
								</div>
								<div className="bg-white/5 rounded-lg p-2 border border-white/10">
									<p className="text-[9px] text-slate-500 uppercase font-black">
										Total Apostado
									</p>
									<p className="text-lg font-black italic">
										{formatCurrency(match.stats.revenue)}
									</p>
								</div>
								<div className="bg-white/5 rounded-lg p-2 border border-white/10">
									<p className="text-[9px] text-slate-500 uppercase font-black">
										Participantes
									</p>
									<p className="text-lg font-black italic">
										{match.stats.participants.toLocaleString("pt-BR")}
									</p>
								</div>
							</div>
						</div>

						<div className="flex flex-col sm:flex-row items-center justify-center gap-4">
							<div className="flex items-center gap-4 bg-white/5 p-2 rounded-2xl border border-white/10 w-full sm:w-auto">
								<div className="flex items-center gap-2">
									<button
										onClick={() => setHomeScore(Math.max(0, homeScore - 1))}
										className="size-10 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-primary transition-colors"
									>
										<MaterialIcon name="remove" />
									</button>
									<span className="text-3xl font-black w-8 text-center italic">
										{homeScore}
									</span>
									<button
										onClick={() => setHomeScore(homeScore + 1)}
										className="size-10 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-primary transition-colors"
									>
										<MaterialIcon name="add" />
									</button>
								</div>

								<div className="h-8 w-px bg-white/10 mx-2" />

								<div className="flex items-center gap-2">
									<button
										onClick={() => setAwayScore(Math.max(0, awayScore - 1))}
										className="size-10 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-400 transition-colors"
									>
										<MaterialIcon name="remove" />
									</button>
									<span className="text-3xl font-black w-8 text-center italic">
										{awayScore}
									</span>
									<button
										onClick={() => setAwayScore(awayScore + 1)}
										className="size-10 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-400 transition-colors"
									>
										<MaterialIcon name="add" />
									</button>
								</div>
							</div>

							<button
								onClick={() => setBetOpen(true)}
								disabled={match.status !== "open"}
								className="w-full sm:w-64 py-5 bg-primary hover:bg-blue-600 text-white font-black text-lg rounded-2xl shadow-xl shadow-primary/20 transition-all flex items-center justify-center gap-3 uppercase italic tracking-tighter disabled:opacity-60 disabled:cursor-not-allowed"
							>
								{match.status === "open" ? "Fazer Meu Palpite" : "Apostas Encerradas"}
								<MaterialIcon name="rocket_launch" className="font-black" />
							</button>
						</div>
					</div>
				</div>
			</section>

			<BetModal
				open={betOpen}
				onClose={() => setBetOpen(false)}
				prediction={{ home: homeScore, away: awayScore }}
				match={match}
			/>
		</>
	);
}
