"use client";

import { useEffect, useState } from "react";
import MaterialIcon from "@/components/icons/MaterialIcon";
import Link from "next/link";
import { apiFetch } from "@/lib/api";
import type { LeaderboardRow } from "@/lib/types";

export default function Leaderboard() {
	const [rows, setRows] = useState<LeaderboardRow[]>([]);

	useEffect(() => {
		void apiFetch<LeaderboardRow[]>("/leaderboard")
			.then(setRows)
			.catch(() => setRows([]));
	}, []);

	return (
		<div className="flex flex-col gap-6">
			<div className="flex items-center gap-2">
				<MaterialIcon name="leaderboard" className="text-accent text-2xl" />
				<h1 className="font-black uppercase italic tracking-tight text-lg">
					Ranking Geral
				</h1>
			</div>

			<div className="grid grid-cols-3 gap-3 sm:gap-4">
				<div className="glass-panel rounded-xl p-4 text-center">
					<p className="text-xl sm:text-2xl font-black italic">
						{rows.length}
					</p>
					<p className="text-xs font-bold uppercase text-slate-300 tracking-wide">
						Rankeados
					</p>
				</div>
				<div className="glass-panel rounded-xl p-4 text-center">
					<p className="text-xl sm:text-2xl font-black italic text-accent">
						{rows[0]?.points?.toLocaleString("pt-BR") ?? 0}
					</p>
					<p className="text-xs font-bold uppercase text-slate-300 tracking-wide">
						Líder Atual
					</p>
				</div>
				<div className="glass-panel rounded-xl p-4 text-center">
					<p className="text-xl sm:text-2xl font-black italic text-success">
						{rows.length ? Math.max(...rows.map((row) => row.accuracy)) : 0}%
					</p>
					<p className="text-xs font-bold uppercase text-slate-300 tracking-wide">
						Melhor Acurácia
					</p>
				</div>
			</div>

			<div className="glass-panel rounded-2xl overflow-hidden">
				<div className="grid grid-cols-[50px_1fr_90px_90px] items-center px-4 sm:px-6 py-3 border-b border-white/5 text-xs font-bold uppercase text-slate-300 tracking-wider">
					<span>Pos.</span>
					<span>Palpiteiro</span>
					<span className="text-center">Acertos</span>
					<span className="text-right">Pontos</span>
				</div>

				{rows.length === 0 && (
					<div className="flex flex-col items-center gap-3 px-6 py-10 text-center">
						<MaterialIcon name="emoji_events" className="text-3xl text-accent" />
						<p className="text-sm text-slate-300">
							O ranking aparece após a apuração da primeira partida.
						</p>
						<Link href="/matches" className="rounded-lg border border-primary px-4 py-2 text-sm font-bold text-blue-300 hover:bg-primary/20 focus-visible:outline-2 focus-visible:outline-white transition-colors">
							Ver jogos
					</Link>
					</div>
				)}

				{rows.map((row) => (
					<div
						key={row.userId}
						className="grid grid-cols-[50px_1fr_90px_90px] items-center px-4 sm:px-6 py-4 border-b border-white/[0.03] hover:bg-white/5 transition-colors"
					>
						<p className="font-black italic text-accent">{row.rank}</p>
						<div className="flex items-center gap-3">
							<div className="size-10 rounded-full bg-primary/10 border border-white/10 flex items-center justify-center font-black overflow-hidden">
								{row.avatarUrl ? (
									// eslint-disable-next-line @next/next/no-img-element
									<img
										alt={row.name}
										src={row.avatarUrl}
										className="size-full object-cover"
									/>
								) : (
									row.name.charAt(0)
								)}
							</div>
							<div>
								<p className="font-bold text-sm">{row.name}</p>
								<p className="text-xs text-slate-300">
									{row.exactHits} placares exatos
								</p>
							</div>
						</div>
						<p className="text-center text-sm font-black italic text-success">
							{row.accuracy}%
						</p>
						<p className="text-right text-sm font-black italic">
							{row.points.toLocaleString("pt-BR")}
						</p>
					</div>
				))}
			</div>
		</div>
	);
}
