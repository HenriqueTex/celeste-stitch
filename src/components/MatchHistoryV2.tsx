import MaterialIcon from "@/components/icons/MaterialIcon";

interface MatchResult {
	opponent: string;
	score: string;
	result: "W" | "D" | "L";
	competition: string;
	date: string;
	image: string;
}

const results: MatchResult[] = [
	{
		opponent: "Atlético",
		score: "1 - 0",
		result: "W",
		competition: "Brasileirão Série A",
		date: "Mar 8",
		image:
			"https://lh3.googleusercontent.com/aida-public/AB6AXuCke7tGSaf2EF6eU77cW8J0bHaU4XO6FdSAHcxuKTS5Gryd8bykFczljmGLvr3RvvbJaleFhAMbknxRUGi5UJihBrGZCzTGRQD-XDEoxj8nKbt_kiIJuorrkQh7yxr5RrRB74M1Va_iSAg8LXD7mSOrcE4TRViS24CNfL5ny3NtjZ0Q_zFlVwyFXGkstQHWLhJsjHJOwuP1GwM2usMolNJX1MxuBuMooT3pdCPjDgioyR9WYCW3Hiyy9AzGXuOgK8pJCtNz4phMPfSp",
	},
	{
		opponent: "Flamengo",
		score: "0 - 0",
		result: "D",
		competition: "Copa do Brasil",
		date: "Mar 4",
		image:
			"https://lh3.googleusercontent.com/aida-public/AB6AXuDYUc6xhChyebhDy7ezMGEHGc7edhleSh0JYldNRXXeCFsAf3ou91YSbXHJ6C8YpA4HmI2iZjUdxjWY2yTsoPZt2LM34HObcqi_Uv6aZDJVDbIm2tW241U4v5zXbOzzjakuE5VO7u6PVxgZWICUvoAYw6YRpfHP55Q51QV0ScFkOllU31G7HTritT7dLIELC5w7mdrFkf6W2ltFpJCG4_3CEBtW8PS0wLQX1kmZ1nXi_944-wSAlXbYKy8omA1lfx9bKXvWXNmX9Slw",
	},
	{
		opponent: "Palmeiras",
		score: "2 - 1",
		result: "W",
		competition: "Brasileirão Série A",
		date: "Feb 28",
		image:
			"https://lh3.googleusercontent.com/aida-public/AB6AXuCJzv0zVB7FXODkdAjIB0aKhCpfJftD2YPqCu2b4az6-XlforRjIKu6I_F2cIUk9VZZnTQU6_tBGq73pEcyICwlANJu718wzbcnoM2yr1q49TKvvpitsWkWRYRQ9HCGzzCiz9wfj-2KwAXOtI4deL4DuiwlDjH8ZHCF0Nu8XEsG88bMyue-N37H-4_RfWOEHn9skFKtcvogZ_21mMF5usNxjfGdeRYItxaKTKRsofegPQtGp8YOgyEKcjGiCPHqh3ZwHGdEr6wOxnhz",
	},
	{
		opponent: "Fluminense",
		score: "3 - 0",
		result: "W",
		competition: "Brasileirão Série A",
		date: "Feb 22",
		image:
			"https://lh3.googleusercontent.com/aida-public/AB6AXuBJ2dqTBgz4V7S_wwkCkCJXVLaSyMiPixk4agbGEkmda2EAO0XgiuP9QrzQlzOp_STZ4A-VRKuluEyssKObJyV8nDJDxjEij4sybHG2qchgapVZYLqovytcv0V1i5DkaORSj_C4rtVdAn1lGjPgCrYG9Zz8VbWFDWhCEw1SBpQYg0wlqit8pC8q8mXywSSIOh5meJzkmL3oWPw556knS1aKRjko_G7ddpn0IlHGeh40NyPQihY5AJ-09hsTy53JFfiU3fanxxs5W87b",
	},
];

const resultConfig = {
	W: {
		label: "W",
		bg: "bg-success/15",
		text: "text-success",
		border: "border-success/25",
	},
	D: {
		label: "D",
		bg: "bg-accent/15",
		text: "text-accent",
		border: "border-accent/25",
	},
	L: {
		label: "L",
		bg: "bg-red-500/15",
		text: "text-red-400",
		border: "border-red-500/25",
	},
};

export default function MatchHistoryV2() {
	return (
		<section className="glass-panel rounded-2xl border-b-4 border-b-primary overflow-hidden">
			{/* Header */}
			<div className="flex items-center justify-between p-6 pb-0">
				<div className="flex items-center gap-2">
					<MaterialIcon
						name="history"
						className="text-primary font-black"
					/>
					<h3 className="font-black uppercase italic tracking-tight">
						Match History
					</h3>
				</div>
				<span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
					Last 4
				</span>
			</div>

			{/* Form indicator */}
			<div className="flex items-center gap-1.5 px-6 pt-3 pb-1">
				<span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mr-1">
					Form
				</span>
				{results.map((m, i) => {
					const cfg = resultConfig[m.result];
					return (
						<span
							key={i}
							className={`size-5 rounded-md flex items-center justify-center text-[9px] font-black ${cfg.bg} ${cfg.text} ${cfg.border} border`}
						>
							{cfg.label}
						</span>
					);
				})}
			</div>

			{/* Match rows */}
			<div className="p-4 space-y-2">
				{results.map((match, i) => {
					const cfg = resultConfig[match.result];
					return (
						<div
							key={i}
							className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/[0.08] transition-colors cursor-pointer group"
						>
							{/* Result badge */}
							<div
								className={`size-9 rounded-lg flex items-center justify-center text-xs font-black shrink-0 border ${cfg.bg} ${cfg.text} ${cfg.border}`}
							>
								{cfg.label}
							</div>

							{/* Match image thumbnail */}
							<div className="size-9 rounded-lg overflow-hidden shrink-0 border border-white/10">
								{/* eslint-disable-next-line @next/next/no-img-element */}
								<img
									alt={`vs ${match.opponent}`}
									className="size-full object-cover"
									src={match.image}
								/>
							</div>

							{/* Match info */}
							<div className="flex-1 min-w-0">
								<p className="font-bold text-sm truncate">
									vs {match.opponent}
								</p>
								<div className="flex items-center gap-2">
									<span className="text-[10px] text-slate-500 font-medium">
										{match.competition}
									</span>
									<span className="size-0.5 rounded-full bg-slate-600" />
									<span className="text-[10px] text-slate-500 font-medium">
										{match.date}
									</span>
								</div>
							</div>

							{/* Score */}
							<div className="text-right shrink-0">
								<p className="text-lg font-black italic leading-none">
									{match.score}
								</p>
							</div>

							{/* Arrow */}
							<MaterialIcon
								name="chevron_right"
								className="text-slate-600 text-lg group-hover:text-slate-400 transition-colors shrink-0"
							/>
						</div>
					);
				})}
			</div>

			{/* CTA */}
			<div className="px-4 pb-4">
				<button className="w-full py-3 rounded-xl border border-white/10 text-xs font-bold hover:bg-white/5 transition-colors uppercase cursor-pointer">
					View Full History
				</button>
			</div>
		</section>
	);
}
