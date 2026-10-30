"use client";

import { useEffect, useState } from "react";
import { Pause, Play } from "lucide-react";
import { useResource } from "@/hooks/use-resource";
import type { ActivityFeedItem } from "@/lib/types";

const POLL_INTERVAL = 10_000;

export default function ActivityTicker() {
	const { data, error, loading, reload } = useResource<ActivityFeedItem[]>(
		"/activity-feed/confirmed",
	);
	const [paused, setPaused] = useState(false);
	const items = data?.slice(0, 5) ?? [];

	useEffect(() => {
		const refresh = () => {
			if (!document.hidden) reload();
		};
		const interval = window.setInterval(refresh, POLL_INTERVAL);
		document.addEventListener("visibilitychange", refresh);
		return () => {
			window.clearInterval(interval);
			document.removeEventListener("visibilitychange", refresh);
		};
	}, [reload]);

	return (
		<section
			className="client-activity-ticker"
			aria-label="Palpites confirmados recentemente"
		>
			<div className="activity-ticker-inner">
				<span className="activity-ticker-label">
					<span className="activity-ticker-dot" aria-hidden="true" />
					<span className="activity-ticker-label-text">
						{items.length > 0 ? "Confirmados agora" : "Atividade"}
					</span>
				</span>
				<div className="activity-ticker-viewport">
					{items.length > 0 ? (
						<>
							<span className="sr-only" aria-live="polite">
								{items[0].title}. {items[0].description}
							</span>
							<div
							key={items.map((item) => item.id).join("-")}
							className={`activity-ticker-track${paused ? " is-paused" : ""}`}
							aria-hidden="true"
							>
							{[0, 1].map((copy) => (
								<div className="activity-ticker-group" key={copy}>
									{items.map((item) => (
										<span className="activity-ticker-event" key={item.id}>
											<strong>{item.title}</strong>
											<span>{item.description}</span>
										</span>
									))}
								</div>
							))}
							</div>
						</>
					) : (
						<p className="activity-ticker-empty">
							{error
								? "Atividade indisponível no momento"
								: loading
									? "Carregando atividade recente"
									: "Aguardando novos palpites confirmados"}
						</p>
					)}
				</div>
				{items.length > 0 && (
					<button
					type="button"
					className="activity-ticker-control"
					aria-label={paused ? "Continuar animação" : "Pausar animação"}
					onClick={() => setPaused((value) => !value)}
					>
						{paused ? (
							<Play size={16} aria-hidden="true" />
						) : (
							<Pause size={16} aria-hidden="true" />
						)}
					</button>
				)}
			</div>
		</section>
	);
}
