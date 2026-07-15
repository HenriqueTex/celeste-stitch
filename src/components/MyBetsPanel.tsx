"use client";

import { useEffect, useMemo, useState } from "react";
import MaterialIcon from "@/components/icons/MaterialIcon";
import { useAuth } from "@/components/AuthContext";
import { apiFetch } from "@/lib/api";
import { formatCurrency, formatShortDate } from "@/lib/format";
import type { BetItem } from "@/lib/types";

const resultStyles = {
	exact: {
		label: "Exato",
		icon: "check_circle",
		cls: "text-success bg-success/10 border-success/20",
	},
	partial: {
		label: "Parcial",
		icon: "remove_circle",
		cls: "text-accent bg-accent/10 border-accent/20",
	},
	miss: {
		label: "Errou",
		icon: "cancel",
		cls: "text-red-400 bg-red-500/10 border-red-500/20",
	},
};

export default function MyBetsPanel() {
	const { isLoggedIn, token } = useAuth();
	const [bets, setBets] = useState<BetItem[]>([]);
	const [error, setError] = useState("");

	useEffect(() => {
		if (!token) return;

		void apiFetch<BetItem[]>("/account/bets", { token })
			.then((items) => {
				setBets(items);
				setError("");
			})
			.catch((err) => {
				setBets([]);
				setError(err instanceof Error ? err.message : "Falha ao carregar apostas.");
			});
	}, [token]);

	const stats = useMemo(() => {
		const totalPoints = bets.reduce((sum, item) => sum + item.points, 0);
		const exactCount = bets.filter((item) => item.resultStatus === "exact").length;
		const settled = bets.filter((item) => item.resultStatus).length;
		const accuracy = settled === 0 ? 0 : Math.round((exactCount / settled) * 100);
		return { totalPoints, exactCount, accuracy };
	}, [bets]);

	if (!isLoggedIn) {
		return (
			<div className="glass-panel rounded-2xl p-6 text-sm text-slate-400">
				Faça login para acompanhar seus palpites, pagamentos e premiações.
			</div>
		);
	}

	return (
		<div className="max-w-4xl mx-auto flex flex-col gap-6">
			<div className="flex items-center gap-2">
				<MaterialIcon name="wallet" className="text-accent font-black" />
				<h2 className="font-black uppercase italic tracking-tight text-lg">
					Meus Palpites
				</h2>
			</div>

			<div className="grid grid-cols-3 gap-3 sm:gap-4">
				<div className="glass-panel rounded-xl p-4 text-center">
					<p className="text-xl sm:text-2xl font-black italic text-primary">
						{stats.totalPoints}
					</p>
					<p className="text-[10px] font-bold uppercase text-slate-500 tracking-wide">
						Total de Pontos
					</p>
				</div>
				<div className="glass-panel rounded-xl p-4 text-center">
					<p className="text-xl sm:text-2xl font-black italic text-success">
						{stats.exactCount}
					</p>
					<p className="text-[10px] font-bold uppercase text-slate-500 tracking-wide">
						Placares Exatos
					</p>
				</div>
				<div className="glass-panel rounded-xl p-4 text-center">
					<p className="text-xl sm:text-2xl font-black italic text-accent">
						{stats.accuracy}%
					</p>
					<p className="text-[10px] font-bold uppercase text-slate-500 tracking-wide">
						Acurácia
					</p>
				</div>
			</div>

			{error && <div className="text-sm text-red-400">{error}</div>}

			<div className="glass-panel rounded-2xl overflow-hidden">
				<div className="grid grid-cols-[1fr_70px_90px_90px_80px] sm:grid-cols-[1fr_90px_120px_110px_90px] items-center px-4 sm:px-6 py-3 border-b border-white/5 text-[10px] font-bold uppercase text-slate-500 tracking-wider">
					<span>Jogo</span>
					<span className="text-center">Palpite</span>
					<span className="text-center">Pagamento</span>
					<span className="text-center">Resultado</span>
					<span className="text-right">Pontos</span>
				</div>

				{bets.length === 0 && (
					<div className="px-6 py-8 text-sm text-slate-400">
						Você ainda não registrou palpites.
					</div>
				)}

				{bets.map((bet) => {
					const style = bet.resultStatus ? resultStyles[bet.resultStatus] : null;
					return (
						<div
							key={bet.id}
							className="group grid grid-cols-[1fr_70px_90px_90px_80px] sm:grid-cols-[1fr_90px_120px_110px_90px] items-center px-4 sm:px-6 py-4 border-b border-white/[0.03] hover:bg-white/5 transition-colors"
						>
							<div>
								<p className="font-bold text-sm">
									{bet.match.homeTeam} vs {bet.match.awayTeam}
								</p>
								<p className="text-[10px] text-slate-500">
									{formatShortDate(bet.match.scheduledAt)} · {bet.tickets} bilhete(s)
								</p>
							</div>

							<p className="text-center text-sm font-black italic">
								{bet.homeScorePrediction} - {bet.awayScorePrediction}
							</p>

							<div className="text-center">
								<p className="text-xs font-bold uppercase text-primary">
									{bet.payment?.status === "confirmed" ? "Confirmado" : "Pendente"}
								</p>
								<p className="text-[10px] text-slate-500">
									{formatCurrency(bet.totalAmount)}
								</p>
							</div>

							<div className="flex justify-center">
								{style ? (
									<span
										className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-bold border ${style.cls}`}
									>
										<MaterialIcon name={style.icon} className="text-xs" />
										{style.label}
									</span>
								) : (
									<span className="text-[10px] font-bold text-slate-500 uppercase">
										Em aberto
									</span>
								)}
							</div>

							<p className="text-right text-xs font-black italic">
								{bet.points > 0 ? `+${bet.points}` : bet.points}
							</p>
						</div>
					);
				})}
			</div>
		</div>
	);
}
