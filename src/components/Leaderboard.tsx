"use client";
import Link from "next/link";
import { useAuth } from "@/components/AuthContext";
import { useResource } from "@/hooks/use-resource";
import type { LeaderboardRow } from "@/lib/types";

export default function Leaderboard() {
	const { data, loading, error, reload } =
		useResource<LeaderboardRow[]>("/leaderboard");
	const { user } = useAuth();
	const rows = data ?? [];
	const mine = user ? rows.find((row) => row.userId === user.id) : undefined;
	return (
		<div className="home-dashboard">
			<div className="page-intro">
				<h1>Ranking geral</h1>
				<p>Veja quem está acertando os resultados do Cruzeiro.</p>
			</div>
			{loading ? (
				<div className="client-panel" role="status">
					Carregando o ranking…
				</div>
			) : error ? (
				<div className="client-panel error-panel" role="alert">
					<p>Não foi possível carregar o ranking.</p>
					<button className="client-button-secondary" onClick={reload}>
						Tentar novamente
					</button>
				</div>
			) : rows.length ? (
				<>
					<dl className="ranking-summary">
						<div>
							<dt>Torcedores no ranking</dt>
							<dd>{rows.length}</dd>
						</div>
						<div>
							<dt>Pontos do líder</dt>
							<dd>{rows[0].points}</dd>
						</div>
						{mine ? (
							<div className="is-mine">
								<dt>Sua posição</dt>
								<dd>{mine.rank}º</dd>
							</div>
						) : (
							<div>
								<dt>Placares exatos do líder</dt>
								<dd>{rows[0].exactHits}</dd>
							</div>
						)}
					</dl>
					<section
						className="client-panel full-ranking"
						aria-label="Classificação dos participantes"
					>
						<div className="full-ranking-header">
							<span>Posição</span>
							<span>Torcedor</span>
							<span>Pontos</span>
						</div>
						<ol className="ranking-preview">
							{rows.map((row) => (
								<li
									key={row.userId}
									className={row.userId === mine?.userId ? "is-mine" : undefined}
									aria-current={row.userId === mine?.userId ? "true" : undefined}
								>
									<span className="rank-number">
										{row.rank.toString().padStart(2, "0")}
									</span>
									<span className="rank-person">
										<strong>
											{row.name}
											{row.userId === mine?.userId && (
												<span className="you-tag">você</span>
											)}
										</strong>
										<small>
											{row.exactHits}{" "}
											{row.exactHits === 1 ? "placar exato" : "placares exatos"}
										</small>
									</span>
									<strong className="rank-points">
										{row.points.toLocaleString("pt-BR")}
									</strong>
								</li>
							))}
						</ol>
					</section>
					<p className="small-text muted">
						Classificação por pontos acumulados nas partidas apuradas. O placar
						exato vale a pontuação máxima; acertar só o vencedor ou o empate vale
						pontos parciais. Pedidos feitos sem conta não entram no ranking.
					</p>
				</>
			) : (
				<div className="client-panel empty-panel">
					<h2>O ranking começa com os resultados</h2>
					<p>A classificação aparece após a apuração da primeira partida.</p>
					<Link href="/matches" className="text-link">
						Ver jogos disponíveis
					</Link>
				</div>
			)}
		</div>
	);
}
