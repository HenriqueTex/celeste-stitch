"use client";
import { LoadingMatch, MatchWorkspace } from "@/components/MatchPrediction";
import MatchHistory from "@/components/MatchHistory";
import TopPredictors from "@/components/TopPredictors";
import LivePredictions from "@/components/LivePredictions";
import { useResource } from "@/hooks/use-resource";
import type { HomeResponse } from "@/lib/types";
export default function HomeDashboard() {
	const { data, loading, error, reload } = useResource<HomeResponse>("/home");
	return (
		<div className="home-dashboard">
			<div className="page-intro">
				<p className="eyebrow">O próximo jogo começa com você</p>
				<h1>Qual vai ser o placar?</h1>
				<p>Escolha o resultado da próxima partida do Cruzeiro.</p>
			</div>
			{loading ? (
				<LoadingMatch />
			) : error ? (
				<div className="client-panel error-panel" role="alert">
					<h2>Não foi possível carregar o bolão</h2>
					<p>Confira sua conexão e tente novamente.</p>
					<button className="client-button-secondary" onClick={reload}>
						Tentar novamente
					</button>
				</div>
			) : (
				data && (
					<MatchWorkspace
						matches={data.matches ?? (data.nextMatch ? [data.nextMatch] : [])}
						distribution={data.poolDistribution}
					/>
				)
			)}
			<div className="support-grid">
				<MatchHistory compact />
				{data && <TopPredictors rows={data.topPredictors} />}
			</div>
			{data && <LivePredictions items={data.activityFeed} />}
		</div>
	);
}
