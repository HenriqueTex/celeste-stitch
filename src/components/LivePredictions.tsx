"use client";
import { useState } from "react";
import { Ticket, Trophy, ChevronDown } from "lucide-react";
import { formatCurrency, formatRelativeTime } from "@/lib/format";
import type { ActivityFeedItem } from "@/lib/types";
export default function LivePredictions({
	items,
}: {
	items: ActivityFeedItem[];
}) {
	const [visible, setVisible] = useState(4);
	return (
		<section className="activity-section" aria-labelledby="activity-heading">
			<div className="section-heading">
				<h2 id="activity-heading">Atividade recente</h2>
				<span className="muted small-text">Da nossa comunidade</span>
			</div>
			<ul className="activity-list">
				{items.slice(0, visible).map((item) => {
					const prize = item.type === "prize_awarded";
					const title = prize
						? item.title.replace("ganhou prêmio", "teve um prêmio apurado")
						: item.title;
					return (
						<li key={item.id}>
							<span className="activity-icon">
								{prize ? (
									<Trophy size={18} aria-hidden="true" />
								) : (
									<Ticket size={18} aria-hidden="true" />
								)}
							</span>
							<div className="activity-copy">
								<p>{title}</p>
								<span>
									{item.description}
									{typeof item.metadata?.amount === "number" && (
										<> · {formatCurrency(item.metadata.amount)}</>
									)}
								</span>
							</div>
							<time dateTime={item.createdAt}>
								{formatRelativeTime(item.createdAt)}
							</time>
						</li>
					);
				})}
			</ul>
			{!items.length && (
				<p className="empty-inline">As novas participações aparecerão aqui.</p>
			)}
			{items.length > visible && (
				<button
					className="activity-more text-link"
					onClick={() => setVisible((count) => count + 4)}
				>
					Mostrar mais
					<ChevronDown size={16} aria-hidden="true" />
				</button>
			)}
		</section>
	);
}
