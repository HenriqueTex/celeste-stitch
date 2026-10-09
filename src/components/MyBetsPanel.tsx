"use client";

import { useEffect, useMemo, useState } from "react";
import MaterialIcon from "@/components/icons/MaterialIcon";
import AuthModal from "@/components/AuthModal";
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
	const [authModalOpen, setAuthModalOpen] = useState(false);

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
			<>
				<section className="glass-panel mx-auto max-w-2xl rounded-2xl p-8 text-center">
					<MaterialIcon name="wallet" className="text-4xl text-accent" />
					<h1 className="mt-3 text-2xl font-black uppercase italic">Meus Palpites</h1>
					<p className="mt-2 text-sm text-slate-300">
						Entre para acompanhar seus palpites, pagamentos e premiações.
					</p>
					<button onClick={() => setAuthModalOpen(true)} className="mt-5 rounded-xl bg-primary px-6 py-3 font-bold text-white hover:bg-blue-600 focus-visible:outline-2 focus-visible:outline-white transition-colors">
						Entrar na minha conta
					</button>
				</section>
				<AuthModal open={authModalOpen} initialView="login" onClose={() => setAuthModalOpen(false)} />
			</>
		);
	}

	return (
		<div className="max-w-4xl mx-auto flex flex-col gap-6">
			<div className="flex items-center gap-2">
				<MaterialIcon name="wallet" className="text-accent font-black" />
				<h1 className="font-black uppercase italic tracking-tight text-lg">
					Meus Palpites
				</h1>
			</div>

			<div className="grid grid-cols-3 gap-3 sm:gap-4">
				<div className="glass-panel rounded-xl p-4 text-center">
					<p className="text-xl sm:text-2xl font-black italic text-primary">
						{stats.totalPoints}
					</p>
					<p className="text-xs font-bold uppercase text-slate-300 tracking-wide">
						Total de Pontos
					</p>
				</div>
				<div className="glass-panel rounded-xl p-4 text-center">
					<p className="text-xl sm:text-2xl font-black italic text-success">
						{stats.exactCount}
					</p>
					<p className="text-xs font-bold uppercase text-slate-300 tracking-wide">
						Placares Exatos
					</p>
				</div>
				<div className="glass-panel rounded-xl p-4 text-center">
					<p className="text-xl sm:text-2xl font-black italic text-accent">
						{stats.accuracy}%
					</p>
					<p className="text-xs font-bold uppercase text-slate-300 tracking-wide">
						Acurácia
					</p>
				</div>
			</div>

			{error && <div className="text-sm text-red-400">{error}</div>}

			<div className="glass-panel rounded-2xl overflow-hidden">
				<div className="hidden sm:grid grid-cols-[1fr_90px_120px_110px_90px] items-center px-6 py-3 border-b border-white/5 text-xs font-bold uppercase text-slate-300 tracking-wider">
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
						className="group flex flex-col gap-3 sm:grid sm:grid-cols-[1fr_90px_120px_110px_90px] sm:items-center px-4 sm:px-6 py-4 border-b border-white/[0.03] hover:bg-white/5 transition-colors"
						>
						<div className="min-w-0">
								<p className="font-bold text-sm">
									{bet.match.homeTeam} vs {bet.match.awayTeam}
								</p>
								<p className="text-xs text-slate-300">
									{formatShortDate(bet.match.scheduledAt)} · {bet.tickets} bilhete(s)
								</p>
							</div>

						<div className="grid grid-cols-2 gap-3 sm:contents">
							<div className="text-sm font-black italic sm:text-center">
								<span className="block sm:hidden text-xs not-italic font-medium text-slate-300">Palpite</span>
								{bet.homeScorePrediction} - {bet.awayScorePrediction}
							</div>

							<div className="sm:text-center">
								<span className="block sm:hidden text-xs text-slate-300">Pagamento</span>
								<p className="text-xs font-bold uppercase text-blue-300">
									{bet.payment?.status === "confirmed" ? "Confirmado" : "Pendente"}
								</p>
								<p className="text-xs text-slate-300">
									{formatCurrency(bet.totalAmount)}
								</p>
							</div>

							<div className="flex flex-col items-start sm:items-center sm:justify-center">
								<span className="block sm:hidden text-xs text-slate-300">Resultado</span>
								{style ? (
									<span
										className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-bold border ${style.cls}`}
									>
										<MaterialIcon name={style.icon} className="text-xs" />
										{style.label}
									</span>
								) : (
									<span className="text-xs font-bold text-slate-300 uppercase">
										Em aberto
									</span>
								)}
							</div>

							<div className="text-xs font-black italic sm:text-right">
								<span className="block sm:hidden text-xs not-italic font-medium text-slate-300">Pontos</span>
								{bet.points > 0 ? `+${bet.points}` : bet.points}
							</div>
						</div>
						</div>
					);
				})}
			</div>
		</div>
	);
}
