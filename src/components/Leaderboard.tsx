import MaterialIcon from "@/components/icons/MaterialIcon";

/* ── Mock Data ────────────────────────────────────────────────── */

const leaderboardData = [
	{
		rank: 1,
		name: "Marco Polo",
		accuracy: 89,
		points: 1240,
		streak: 7,
		image:
			"https://lh3.googleusercontent.com/aida-public/AB6AXuC4L1n_3lqytfPVrdO9jbJMsPY7UH2jXRqLhamrPELv0idmBOmAn9KU-WWkgsiyKHxRrZG28PWtmBeZ_43_hDwtYem1xe-e6op25Kp5BQPs-EAbrX8ZAWxGPVSoSNiylDm3ATQxPj9H_659Wmx9HU4t1btWtux634x8d43zYd-stNphYokHcI6PoKwnMRcjymTS-OV5B4d5RrXprVgKgWlAjEj6JSn8d5cO6PULFYi3A46MaBz32dr152dmmxIVaoB5SPP_uCMoS_Ii",
	},
	{
		rank: 2,
		name: "Julia Star",
		accuracy: 82,
		points: 1105,
		streak: 4,
		image:
			"https://lh3.googleusercontent.com/aida-public/AB6AXuAvlZ8ikbsx9cCZsqGus2g9s_xMUq9dPnfa8XPjbNzG2nrtu0sbBGYHGD93PLUoHJXP23gn10uPQK5FBH-vv3WSoUTKWt8TCTbxG73GamKmSPSsFo_Y5KHnLya1P3Le-l9Jm4jRHzayxNGXzEviU2rYOHywOgi7zk5QQOn00N3jIpRsFSL1KTuAxkekPQ_xdzPnC3_dzg9gTWKI4TdlEOfJ8DUYwUCmG0-qn93qSQd5Dx3pTUVYx9X-Ar0bsNWk9yXf_XWJAN5xi9PR",
	},
	{
		rank: 3,
		name: "Tiago Fan",
		accuracy: 78,
		points: 980,
		streak: 3,
		image:
			"https://lh3.googleusercontent.com/aida-public/AB6AXuAMLUWw-KYt5W-PEdDK91RY1Wo6b6LW8--hmSni_VsOcu1Ib0GqdgS5A-KTJctw3ucwuiyfDVe5DDfTdatXFb33ZH50Bma6C5THydqTlD26_UrkFeQh42jB_HrG5Utmb7-I_JyPjzudDEVUBk4Lm93Nl0U0NlVhuFlssQ63Dkv6aoHoBz6xzFNxNxbRUpn1_24OPgPGbRGVwoEoK4tlw4u2aNwwm46BxqP9KFocpYez_K9gL9I2WQb7Jl2eurGnyLgkWPUbrgKYQ6Bq",
	},
	{
		rank: 4,
		name: "Ana Celeste",
		accuracy: 75,
		points: 920,
		streak: 5,
		image: null,
	},
	{
		rank: 5,
		name: "Pedro Cruz",
		accuracy: 73,
		points: 870,
		streak: 2,
		image: null,
	},
	{
		rank: 6,
		name: "Lucas Minas",
		accuracy: 71,
		points: 845,
		streak: 0,
		image: null,
	},
	{
		rank: 7,
		name: "Fernanda BH",
		accuracy: 70,
		points: 810,
		streak: 1,
		image: null,
		isCurrentUser: true,
	},
	{
		rank: 8,
		name: "Gustavo Raposo",
		accuracy: 68,
		points: 785,
		streak: 0,
		image: null,
	},
	{
		rank: 9,
		name: "Camila Estrela",
		accuracy: 67,
		points: 752,
		streak: 3,
		image: null,
	},
	{
		rank: 10,
		name: "Rodrigo Pampulha",
		accuracy: 65,
		points: 730,
		streak: 0,
		image: null,
	},
	{
		rank: 11,
		name: "Letícia Fox",
		accuracy: 64,
		points: 700,
		streak: 1,
		image: null,
	},
	{
		rank: 12,
		name: "Bruno Cruzeiro",
		accuracy: 62,
		points: 680,
		streak: 0,
		image: null,
	},
	{
		rank: 13,
		name: "Isabela Mineira",
		accuracy: 60,
		points: 650,
		streak: 2,
		image: null,
	},
	{
		rank: 14,
		name: "Rafael Azul",
		accuracy: 59,
		points: 630,
		streak: 0,
		image: null,
	},
	{
		rank: 15,
		name: "Daniela Seis",
		accuracy: 57,
		points: 600,
		streak: 1,
		image: null,
	},
];

interface Player {
	rank: number;
	name: string;
	accuracy: number;
	points: number;
	streak: number;
	image: string | null;
	isCurrentUser?: boolean;
}

/* ── Stats Cards ──────────────────────────────────────────────── */

function StatsCards() {
	return (
		<div className="grid grid-cols-3 gap-3 sm:gap-4">
			<div className="glass-panel rounded-xl p-4 text-center">
				<MaterialIcon
					name="groups"
					className="text-primary text-2xl mb-1"
				/>
				<p className="text-xl sm:text-2xl font-black italic">1.247</p>
				<p className="text-[10px] font-bold uppercase text-slate-500 tracking-wide">
					Participantes
				</p>
			</div>
			<div className="glass-panel rounded-xl p-4 text-center">
				<MaterialIcon
					name="emoji_events"
					className="text-accent text-2xl mb-1"
				/>
				<p className="text-xl sm:text-2xl font-black italic text-accent">
					#7
				</p>
				<p className="text-[10px] font-bold uppercase text-slate-500 tracking-wide">
					Sua Posição
				</p>
			</div>
			<div className="glass-panel rounded-xl p-4 text-center">
				<MaterialIcon
					name="target"
					className="text-success text-2xl mb-1"
				/>
				<p className="text-xl sm:text-2xl font-black italic text-success">
					70%
				</p>
				<p className="text-[10px] font-bold uppercase text-slate-500 tracking-wide">
					Acertos
				</p>
			</div>
		</div>
	);
}

/* ── Podium ───────────────────────────────────────────────────── */

function PodiumCard({
	player,
	size,
}: {
	player: Player;
	size: "lg" | "md";
}) {
	const isFirst = size === "lg";

	return (
		<div
			className={`flex flex-col items-center ${isFirst ? "order-1 sm:order-2" : player.rank === 2 ? "order-2 sm:order-1" : "order-3"}`}
		>
			{/* Crown for 1st */}
			{isFirst && (
				<MaterialIcon
					name="workspace_premium"
					filled
					className="text-accent text-3xl mb-1 drop-shadow-[0_0_8px_rgba(245,158,11,0.6)]"
				/>
			)}

			{/* Avatar */}
			<div
				className={`relative rounded-full p-[2px] ${isFirst
					? "size-20 sm:size-24 glow-gold bg-gradient-to-b from-accent to-amber-600"
					: "size-14 sm:size-18 bg-gradient-to-b from-primary to-blue-500"
					}`}
			>
				<div className="size-full rounded-full bg-surface-dark overflow-hidden">
					{player.image ? (
						// eslint-disable-next-line @next/next/no-img-element
						<img
							alt={player.name}
							src={player.image}
							className="size-full object-cover"
						/>
					) : (
						<div className="size-full flex items-center justify-center text-slate-500 font-black text-lg">
							{player.name.charAt(0)}
						</div>
					)}
				</div>
				{/* Rank badge */}
				<span
					className={`absolute -bottom-1 left-1/2 -translate-x-1/2 font-black italic text-xs rounded-full flex items-center justify-center ${isFirst
						? "size-7 bg-accent text-background-dark"
						: "size-6 bg-primary text-white"
						}`}
				>
					{player.rank}
				</span>
			</div>

			{/* Info */}
			<p
				className={`font-bold mt-3 ${isFirst ? "text-sm" : "text-xs"} text-center truncate max-w-[90px] sm:max-w-[120px]`}
			>
				{player.name}
			</p>
			<p
				className={`font-black italic ${isFirst ? "text-lg text-accent" : "text-sm text-primary"}`}
			>
				{player.points.toLocaleString()} pts
			</p>
			<p className="text-[10px] font-bold text-slate-500">
				{player.accuracy}% acertos
			</p>
		</div>
	);
}

function Podium({ players }: { players: Player[] }) {
	const top3 = players.slice(0, 3);
	return (
		<div className="glass-panel rounded-2xl p-6 sm:p-8">
			<div className="flex items-end justify-center gap-6 sm:gap-10 pb-2">
				{top3.map((p) => (
					<PodiumCard
						key={p.rank}
						player={p}
						size={p.rank === 1 ? "lg" : "md"}
					/>
				))}
			</div>
		</div>
	);
}

/* ── Ranking Table ────────────────────────────────────────────── */

function RankingTable({ players }: { players: Player[] }) {
	const rest = players.slice(3);

	return (
		<div className="glass-panel rounded-2xl overflow-hidden">
			{/* Table header */}
			<div className="grid grid-cols-[40px_1fr_80px_80px_50px] sm:grid-cols-[50px_1fr_100px_100px_70px] items-center px-4 sm:px-6 py-3 border-b border-white/5 text-[10px] font-bold uppercase text-slate-500 tracking-wider">
				<span>#</span>
				<span>Jogador</span>
				<span className="text-center">Acertos</span>
				<span className="text-right">Pontos</span>
				<span className="text-center">
					<MaterialIcon name="local_fire_department" className="text-xs" />
				</span>
			</div>

			{/* Rows */}
			{rest.map((p) => (
				<div
					key={p.rank}
					className={`group grid grid-cols-[40px_1fr_80px_80px_50px] sm:grid-cols-[50px_1fr_100px_100px_70px] items-center px-4 sm:px-6 py-3 transition-colors border-b border-white/[0.03] hover:bg-white/5 ${p.isCurrentUser
						? "bg-primary/10 border-l-2 border-l-primary"
						: ""
						}`}
				>
					{/* Rank */}
					<span
						className={`font-black italic text-sm ${p.isCurrentUser ? "text-primary" : "text-slate-500"}`}
					>
						{p.rank}
					</span>

					{/* Player info */}
					<div className="flex items-center gap-3 min-w-0">
						<div
							className={`size-8 rounded-lg flex-shrink-0 overflow-hidden ${p.isCurrentUser
								? "ring-1 ring-primary/30"
								: ""
								}`}
						>
							{p.image ? (
								// eslint-disable-next-line @next/next/no-img-element
								<img
									alt={p.name}
									src={p.image}
									className="size-full object-cover"
								/>
							) : (
								<div className="size-full bg-white/10 flex items-center justify-center text-slate-400 font-bold text-xs">
									{p.name.charAt(0)}
								</div>
							)}
						</div>
						<div className="min-w-0">
							<p className="font-bold text-sm truncate">
								{p.name}
								{p.isCurrentUser && (
									<span className="ml-2 text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
										You
									</span>
								)}
							</p>
						</div>
					</div>

					{/* Accuracy bar */}
					<div className="flex flex-col items-center gap-1">
						<span className="text-xs font-bold">{p.accuracy}%</span>
						<div className="w-full h-1 rounded-full bg-white/10 overflow-hidden">
							<div
								className="h-full rounded-full bg-primary bar-fill"
								style={
									{
										"--bar-width": `${p.accuracy}%`,
									} as React.CSSProperties
								}
							/>
						</div>
					</div>

					{/* Points */}
					<p className="text-right text-xs font-black italic">
						{p.points.toLocaleString()} pts
					</p>

					{/* Streak */}
					<div className="flex items-center justify-center gap-0.5">
						{p.streak > 0 ? (
							<>
								<MaterialIcon
									name="local_fire_department"
									className="text-orange-400 text-sm"
								/>
								<span className="text-xs font-bold text-orange-400">
									{p.streak}
								</span>
							</>
						) : (
							<span className="text-xs text-slate-600">—</span>
						)}
					</div>
				</div>
			))}
		</div>
	);
}

/* ── Main Component ───────────────────────────────────────────── */

export default function Leaderboard() {
	return (
		<section className="flex flex-col gap-6">
			{/* Section header */}
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-2">
					<MaterialIcon
						name="leaderboard"
						className="text-accent font-black"
					/>
					<h2 className="font-black uppercase italic tracking-tight text-lg">
						Leaderboard
					</h2>
				</div>

				{/* Period filters */}
				<div className="flex gap-2">
					{["Semanal", "Mensal", "Geral"].map((period, i) => (
						<button
							key={period}
							className={`text-[10px] font-bold uppercase px-3 py-1.5 rounded-lg transition-colors ${i === 0
								? "bg-primary/15 text-primary border border-primary/20"
								: "text-slate-500 hover:text-slate-300 hover:bg-white/5"
								}`}
						>
							{period}
						</button>
					))}
				</div>
			</div>

			{/* Stats overview */}
			<StatsCards />

			{/* Podium top 3 */}
			<Podium players={leaderboardData} />

			{/* Ranking table */}
			<RankingTable players={leaderboardData} />
		</section>
	);
}
