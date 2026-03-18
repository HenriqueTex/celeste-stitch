import type { Metadata } from "next";
import MaterialIcon from "@/components/icons/MaterialIcon";

export const metadata: Metadata = {
	title: "Meus Palpites - Bolão Celeste",
	description:
		"Acompanhe seus palpites, ganhos e histórico de apostas.",
};

const bets = [
	{
		id: 1,
		match: "Cruzeiro vs Vasco",
		prediction: "2 - 0",
		actual: "2 - 0",
		result: "exact" as const,
		points: "+30 pts",
		date: "Mar 6",
	},
	{
		id: 2,
		match: "Cruzeiro vs Flamengo",
		prediction: "1 - 0",
		actual: "0 - 0",
		result: "miss" as const,
		points: "0 pts",
		date: "Mar 4",
	},
	{
		id: 3,
		match: "Cruzeiro vs Fluminense",
		prediction: "2 - 1",
		actual: "3 - 0",
		result: "partial" as const,
		points: "+10 pts",
		date: "Feb 22",
	},
	{
		id: 4,
		match: "Cruzeiro vs Palmeiras",
		prediction: "2 - 1",
		actual: "2 - 1",
		result: "exact" as const,
		points: "+30 pts",
		date: "Feb 28",
	},
	{
		id: 5,
		match: "Cruzeiro vs Grêmio",
		prediction: "1 - 1",
		actual: "0 - 2",
		result: "miss" as const,
		points: "0 pts",
		date: "Feb 15",
	},
	{
		id: 6,
		match: "Cruzeiro vs Corinthians",
		prediction: "3 - 0",
		actual: "4 - 1",
		result: "partial" as const,
		points: "+10 pts",
		date: "Feb 8",
	},
];

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

export default function MyBetsPage() {
	const totalPoints = bets.reduce((sum, b) => sum + parseInt(b.points) || 0, 0);
	const exactCount = bets.filter((b) => b.result === "exact").length;
	const accuracy = Math.round((exactCount / bets.length) * 100);

	return (
		<div className="max-w-4xl mx-auto flex flex-col gap-6">
			{/* Page header */}
			<div className="flex items-center gap-2">
				<MaterialIcon name="wallet" className="text-accent font-black" />
				<h2 className="font-black uppercase italic tracking-tight text-lg">
					Meus Palpites
				</h2>
			</div>

			{/* Stats row */}
			<div className="grid grid-cols-3 gap-3 sm:gap-4">
				<div className="glass-panel rounded-xl p-4 text-center">
					<p className="text-xl sm:text-2xl font-black italic text-primary">
						{totalPoints}
					</p>
					<p className="text-[10px] font-bold uppercase text-slate-500 tracking-wide">
						Total de Pontos
					</p>
				</div>
				<div className="glass-panel rounded-xl p-4 text-center">
					<p className="text-xl sm:text-2xl font-black italic text-success">
						{exactCount}
					</p>
					<p className="text-[10px] font-bold uppercase text-slate-500 tracking-wide">
						Placares Exatos
					</p>
				</div>
				<div className="glass-panel rounded-xl p-4 text-center">
					<p className="text-xl sm:text-2xl font-black italic text-accent">
						{accuracy}%
					</p>
					<p className="text-[10px] font-bold uppercase text-slate-500 tracking-wide">
						Acertos
					</p>
				</div>
			</div>

			{/* Bets list */}
			<div className="glass-panel rounded-2xl overflow-hidden">
				<div className="grid grid-cols-[1fr_70px_70px_80px_70px] sm:grid-cols-[1fr_90px_90px_100px_80px] items-center px-4 sm:px-6 py-3 border-b border-white/5 text-[10px] font-bold uppercase text-slate-500 tracking-wider">
					<span>Jogo</span>
					<span className="text-center">Palpite</span>
					<span className="text-center">Resultado</span>
					<span className="text-center">Status</span>
					<span className="text-right">Pontos</span>
				</div>

				{bets.map((bet) => {
					const style = resultStyles[bet.result];

					return (
						<div
							key={bet.id}
							className="group grid grid-cols-[1fr_70px_70px_80px_70px] sm:grid-cols-[1fr_90px_90px_100px_80px] items-center px-4 sm:px-6 py-4 border-b border-white/[0.03] hover:bg-white/5 transition-colors"
						>
							{/* Match */}
							<div>
								<p className="font-bold text-sm">{bet.match}</p>
								<p className="text-[10px] text-slate-500">{bet.date}</p>
							</div>

							{/* Prediction */}
							<p className="text-center text-sm font-black italic">
								{bet.prediction}
							</p>

							{/* Actual */}
							<p className="text-center text-sm font-black italic text-slate-400">
								{bet.actual}
							</p>

							{/* Status badge */}
							<div className="flex justify-center">
								<span
									className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-bold border ${style.cls}`}
								>
									<MaterialIcon
										name={style.icon}
										className="text-xs"
									/>
									{style.label}
								</span>
							</div>

							{/* Points */}
							<p
								className={`text-right text-xs font-black italic ${bet.result === "exact"
									? "text-success"
									: bet.result === "partial"
										? "text-accent"
										: "text-slate-600"
									}`}
							>
								{bet.points}
							</p>
						</div>
					);
				})}
			</div>
		</div>
	);
}
