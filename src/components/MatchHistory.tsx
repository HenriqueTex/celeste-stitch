"use client";

import { useRef, useEffect } from "react";
import MaterialIcon from "@/components/icons/MaterialIcon";

interface MatchResult {
	opponent: string;
	score: string;
	result: "W" | "D" | "L";
	competition: string;
	date: string;
	image: string;
}

/* Chronological order: oldest → newest (left → right) */
const results: MatchResult[] = [
	{
		opponent: "vs Botafogo",
		score: "2 - 2",
		result: "D",
		competition: "Brasileirão",
		date: "Jan 18",
		image:
			"https://lh3.googleusercontent.com/aida-public/AB6AXuBJ2dqTBgz4V7S_wwkCkCJXVLaSyMiPixk4agbGEkmda2EAO0XgiuP9QrzQlzOp_STZ4A-VRKuluEyssKObJyV8nDJDxjEij4sybHG2qchgapVZYLqovytcv0V1i5DkaORSj_C4rtVdAn1lGjPgCrYG9Zz8VbWFDWhCEw1SBpQYg0wlqit8pC8q8mXywSSIOh5meJzkmL3oWPw556knS1aKRjko_G7ddpn0IlHGeh40NyPQihY5AJ-09hsTy53JFfiU3fanxxs5W87b",
	},
	{
		opponent: "vs Internacional",
		score: "0 - 1",
		result: "L",
		competition: "Brasileirão",
		date: "Jan 25",
		image:
			"https://lh3.googleusercontent.com/aida-public/AB6AXuDYUc6xhChyebhDy7ezMGEHGc7edhleSh0JYldNRXXeCFsAf3ou91YSbXHJ6C8YpA4HmI2iZjUdxjWY2yTsoPZt2LM34HObcqi_Uv6aZDJVDbIm2tW241U4v5zXbOzzjakuE5VO7u6PVxgZWICUvoAYw6YRpfHP55Q51QV0ScFkOllU31G7HTritT7dLIELC5w7mdrFkf6W2ltFpJCG4_3CEBtW8PS0wLQX1kmZ1nXi_944-wSAlXbYKy8omA1lfx9bKXvWXNmX9Slw",
	},
	{
		opponent: "vs São Paulo",
		score: "1 - 0",
		result: "W",
		competition: "Copa do Brasil",
		date: "Feb 1",
		image:
			"https://lh3.googleusercontent.com/aida-public/AB6AXuCke7tGSaf2EF6eU77cW8J0bHaU4XO6FdSAHcxuKTS5Gryd8bykFczljmGLvr3RvvbJaleFhAMbknxRUGi5UJihBrGZCzTGRQD-XDEoxj8nKbt_kiIJuorrkQh7yxr5RrRB74M1Va_iSAg8LXD7mSOrcE4TRViS24CNfL5ny3NtjZ0Q_zFlVwyFXGkstQHWLhJsjHJOwuP1GwM2usMolNJX1MxuBuMooT3pdCPjDgioyR9WYCW3Hiyy9AzGXuOgK8pJCtNz4phMPfSp",
	},
	{
		opponent: "vs Corinthians",
		score: "4 - 1",
		result: "W",
		competition: "Brasileirão",
		date: "Feb 8",
		image:
			"https://lh3.googleusercontent.com/aida-public/AB6AXuCJzv0zVB7FXODkdAjIB0aKhCpfJftD2YPqCu2b4az6-XlforRjIKu6I_F2cIUk9VZZnTQU6_tBGq73pEcyICwlANJu718wzbcnoM2yr1q49TKvvpitsWkWRYRQ9HCGzzCiz9wfj-2KwAXOtI4deL4DuiwlDjH8ZHCF0Nu8XEsG88bMyue-N37H-4_RfWOEHn9skFKtcvogZ_21mMF5usNxjfGdeRYItxaKTKRsofegPQtGp8YOgyEKcjGiCPHqh3ZwHGdEr6wOxnhz",
	},
	{
		opponent: "vs Grêmio",
		score: "0 - 2",
		result: "L",
		competition: "Libertadores",
		date: "Feb 15",
		image:
			"https://lh3.googleusercontent.com/aida-public/AB6AXuDYUc6xhChyebhDy7ezMGEHGc7edhleSh0JYldNRXXeCFsAf3ou91YSbXHJ6C8YpA4HmI2iZjUdxjWY2yTsoPZt2LM34HObcqi_Uv6aZDJVDbIm2tW241U4v5zXbOzzjakuE5VO7u6PVxgZWICUvoAYw6YRpfHP55Q51QV0ScFkOllU31G7HTritT7dLIELC5w7mdrFkf6W2ltFpJCG4_3CEBtW8PS0wLQX1kmZ1nXi_944-wSAlXbYKy8omA1lfx9bKXvWXNmX9Slw",
	},
	{
		opponent: "vs Fluminense",
		score: "3 - 0",
		result: "W",
		competition: "Brasileirão",
		date: "Feb 22",
		image:
			"https://lh3.googleusercontent.com/aida-public/AB6AXuBJ2dqTBgz4V7S_wwkCkCJXVLaSyMiPixk4agbGEkmda2EAO0XgiuP9QrzQlzOp_STZ4A-VRKuluEyssKObJyV8nDJDxjEij4sybHG2qchgapVZYLqovytcv0V1i5DkaORSj_C4rtVdAn1lGjPgCrYG9Zz8VbWFDWhCEw1SBpQYg0wlqit8pC8q8mXywSSIOh5meJzkmL3oWPw556knS1aKRjko_G7ddpn0IlHGeh40NyPQihY5AJ-09hsTy53JFfiU3fanxxs5W87b",
	},
	{
		opponent: "vs Palmeiras",
		score: "2 - 1",
		result: "W",
		competition: "Brasileirão",
		date: "Feb 28",
		image:
			"https://lh3.googleusercontent.com/aida-public/AB6AXuCJzv0zVB7FXODkdAjIB0aKhCpfJftD2YPqCu2b4az6-XlforRjIKu6I_F2cIUk9VZZnTQU6_tBGq73pEcyICwlANJu718wzbcnoM2yr1q49TKvvpitsWkWRYRQ9HCGzzCiz9wfj-2KwAXOtI4deL4DuiwlDjH8ZHCF0Nu8XEsG88bMyue-N37H-4_RfWOEHn9skFKtcvogZ_21mMF5usNxjfGdeRYItxaKTKRsofegPQtGp8YOgyEKcjGiCPHqh3ZwHGdEr6wOxnhz",
	},
	{
		opponent: "vs Flamengo",
		score: "0 - 0",
		result: "D",
		competition: "Copa do Brasil",
		date: "Mar 4",
		image:
			"https://lh3.googleusercontent.com/aida-public/AB6AXuDYUc6xhChyebhDy7ezMGEHGc7edhleSh0JYldNRXXeCFsAf3ou91YSbXHJ6C8YpA4HmI2iZjUdxjWY2yTsoPZt2LM34HObcqi_Uv6aZDJVDbIm2tW241U4v5zXbOzzjakuE5VO7u6PVxgZWICUvoAYw6YRpfHP55Q51QV0ScFkOllU31G7HTritT7dLIELC5w7mdrFkf6W2ltFpJCG4_3CEBtW8PS0wLQX1kmZ1nXi_944-wSAlXbYKy8omA1lfx9bKXvWXNmX9Slw",
	},
	{
		opponent: "vs Vasco",
		score: "2 - 0",
		result: "W",
		competition: "Brasileirão",
		date: "Mar 6",
		image:
			"https://lh3.googleusercontent.com/aida-public/AB6AXuCke7tGSaf2EF6eU77cW8J0bHaU4XO6FdSAHcxuKTS5Gryd8bykFczljmGLvr3RvvbJaleFhAMbknxRUGi5UJihBrGZCzTGRQD-XDEoxj8nKbt_kiIJuorrkQh7yxr5RrRB74M1Va_iSAg8LXD7mSOrcE4TRViS24CNfL5ny3NtjZ0Q_zFlVwyFXGkstQHWLhJsjHJOwuP1GwM2usMolNJX1MxuBuMooT3pdCPjDgioyR9WYCW3Hiyy9AzGXuOgK8pJCtNz4phMPfSp",
	},
	{
		opponent: "vs Atletico",
		score: "1 - 0",
		result: "W",
		competition: "Brasileirão",
		date: "Mar 8",
		image:
			"https://lh3.googleusercontent.com/aida-public/AB6AXuCke7tGSaf2EF6eU77cW8J0bHaU4XO6FdSAHcxuKTS5Gryd8bykFczljmGLvr3RvvbJaleFhAMbknxRUGi5UJihBrGZCzTGRQD-XDEoxj8nKbt_kiIJuorrkQh7yxr5RrRB74M1Va_iSAg8LXD7mSOrcE4TRViS24CNfL5ny3NtjZ0Q_zFlVwyFXGkstQHWLhJsjHJOwuP1GwM2usMolNJX1MxuBuMooT3pdCPjDgioyR9WYCW3Hiyy9AzGXuOgK8pJCtNz4phMPfSp",
	},
];

const resultBadge = {
	W: { label: "W", cls: "bg-success/20 text-success border-success/30" },
	D: { label: "D", cls: "bg-accent/20 text-accent border-accent/30" },
	L: { label: "L", cls: "bg-red-500/20 text-red-400 border-red-500/30" },
};

export default function MatchHistory() {
	const scrollRef = useRef<HTMLDivElement>(null);

	/* Auto-scroll to the rightmost (most recent) card on mount */
	useEffect(() => {
		const el = scrollRef.current;
		if (!el) return;

		/* Double rAF ensures layout is fully computed before scrolling */
		requestAnimationFrame(() => {
			requestAnimationFrame(() => {
				el.scrollTo({ left: el.scrollWidth, behavior: "instant" });
			});
		});
	}, []);

	return (
		<section>
			{/* Section header */}
			<div className="flex items-center justify-between mb-3 px-1">
				<div className="flex items-center gap-2">
					<MaterialIcon
						name="history"
						className="text-primary font-bold"
					/>
					<h2 className="text-lg font-black uppercase italic tracking-tight">
						Histórico de Jogos
					</h2>
				</div>

				{/* Scroll hint */}
				<div className="flex items-center gap-1 text-slate-500">
					<MaterialIcon
						name="swipe_left"
						className="text-sm"
					/>
					<span className="text-[10px] font-bold uppercase tracking-wider">
						Deslize
					</span>
				</div>
			</div>

			{/* Horizontal scrolling portrait cards — oldest left, newest right */}
			<div
				ref={scrollRef}
				className="flex w-full overflow-x-auto gap-3 pb-4 px-1 snap-x snap-mandatory [-ms-scrollbar-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
			>
				{results.map((match, i) => {
					const badge = resultBadge[match.result];
					const isLatest = i === results.length - 1;

					return (
						<div
							key={i}
							className={`flex-none w-36 snap-center ${isLatest ? "relative" : ""}`}
						>
							<div
								className={`w-full bg-center bg-no-repeat aspect-[3/4] bg-cover rounded-xl relative overflow-hidden group shadow-lg cursor-pointer transition-transform duration-300 hover:scale-[1.03] ${isLatest
									? "ring-2 ring-primary/40 shadow-primary/20"
									: ""
									}`}
								style={{
									backgroundImage: `url("${match.image}")`,
								}}
							>
								{/* Result badge — top-left */}
								<div className="absolute top-2 left-2 z-10">
									<span
										className={`inline-flex items-center justify-center size-7 rounded-lg text-[10px] font-black border ${badge.cls}`}
									>
										{badge.label}
									</span>
								</div>

								{/* "Latest" tag on most recent */}
								{isLatest && (
									<div className="absolute top-2 right-2 z-10">
										<span className="bg-primary/80 backdrop-blur-sm text-white text-[8px] font-black px-1.5 py-0.5 rounded-md uppercase tracking-widest">
											Último
										</span>
									</div>
								)}

								{/* Bottom gradient overlay with match info */}
								<div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent flex flex-col justify-end p-3">
									{/* Competition tag */}
									<span className="text-white/50 text-[8px] font-bold uppercase tracking-widest mb-0.5">
										{match.competition}
									</span>
									<span className="text-white/80 text-[10px] font-semibold uppercase tracking-wider mb-1">
										{match.opponent}
									</span>
									<p className="text-white text-xl font-black italic leading-none">
										{match.score}
									</p>
									{/* Date */}
									<span className="text-white/40 text-[9px] font-medium mt-1">
										{match.date}
									</span>
								</div>
							</div>
						</div>
					);
				})}
			</div>
		</section>
	);
}
