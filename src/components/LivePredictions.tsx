"use client";

import { useEffect, useState } from "react";
import MaterialIcon from "@/components/icons/MaterialIcon";
import { apiFetch } from "@/lib/api";
import { formatCurrency, formatRelativeTime } from "@/lib/format";
import type { ActivityFeedItem } from "@/lib/types";

export default function LivePredictions() {
	const [items, setItems] = useState<ActivityFeedItem[]>([]);

	useEffect(() => {
		void apiFetch<ActivityFeedItem[]>("/activity-feed")
			.then(setItems)
			.catch(() => setItems([]));
	}, []);

	return (
		<section>
			<div className="flex items-center justify-between mb-4">
				<div className="flex items-center gap-2">
					<MaterialIcon name="rss_feed" className="text-primary font-bold" />
					<h2 className="text-xl font-black uppercase italic tracking-tight">
						Palpites ao Vivo
					</h2>
				</div>
				<span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold border border-primary/20">
					{items.length} eventos
				</span>
			</div>

			<div className="flex flex-col gap-3">
				{items.length === 0 && (
					<div className="glass-panel p-4 rounded-xl text-sm text-slate-400">
						O feed de atividade vai aparecer aqui assim que surgirem apostas e prêmios.
					</div>
				)}

				{items.map((item) => {
					const amount =
						typeof item.metadata?.amount === "number"
							? formatCurrency(item.metadata.amount)
							: null;
					return (
						<div
							key={item.id}
							className="glass-panel p-4 rounded-xl flex items-center justify-between border-l-4 border-l-primary"
						>
							<div className="flex items-center gap-4">
								<div className="size-12 rounded-full bg-primary/10 flex items-center justify-center border border-white/10">
									<MaterialIcon
										name={
											item.type === "prize_awarded"
												? "emoji_events"
												: "sports_soccer"
										}
										className="text-primary text-xl"
									/>
								</div>
								<div>
									<div className="flex items-center gap-2">
										<span className="font-bold text-sm">{item.title}</span>
										<span className="text-slate-300 text-xs">
											{formatRelativeTime(item.createdAt)}
										</span>
									</div>
									<p className="text-xs text-slate-400 mt-0.5">
										{item.description}
										{amount && (
											<span className="text-accent font-bold ml-1">
												{amount}
											</span>
										)}
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
