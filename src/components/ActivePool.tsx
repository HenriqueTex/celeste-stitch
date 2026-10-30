import { Info, Target, Ticket, Trophy, Users } from "lucide-react";
import Constellation from "@/components/Constellation";
import { formatCurrency, formatScore } from "@/lib/format";
import type { HomeResponse, MatchItem } from "@/lib/types";
export default function ActivePool({
	match,
	distribution,
}: {
	match: MatchItem;
	distribution?: HomeResponse["poolDistribution"];
}) {
	const stats = match.stats;
	const consensus = stats.consensus;
	return (
		<aside className="pool-summary" aria-labelledby="pool-heading">
			<Constellation className="pool-stars" />
			<h2 id="pool-heading" className="pool-title">
				Bolão desta partida
			</h2>
			<p className="pool-value">{formatCurrency(stats.revenue)}</p>
			<p className="muted">em bilhetes com pagamento confirmado</p>
			{distribution && (
				<p className="pool-prize">
					<Trophy size={18} aria-hidden="true" />
					<span>
						<strong>{distribution.winners}% vai para quem cravar o placar,</strong>{" "}
						dividido entre os bilhetes vencedores.
					</span>
				</p>
			)}
			<dl className="pool-numbers">
				<div>
					<dt>
						<Users size={18} aria-hidden="true" />
						Participantes
					</dt>
					<dd>{stats.participants}</dd>
				</div>
				<div>
					<dt>
						<Ticket size={18} aria-hidden="true" />
						Bilhetes confirmados
					</dt>
					<dd>{stats.tickets}</dd>
				</div>
				{consensus && stats.tickets > 0 && (
					<div>
						<dt>
							<Target size={18} aria-hidden="true" />
							Placar mais escolhido
						</dt>
						<dd>{formatScore(consensus.homeScore, consensus.awayScore)}</dd>
					</div>
				)}
			</dl>
			<section className="pool-help" aria-labelledby="pool-help-heading">
				<h3 id="pool-help-heading">
					<Info size={16} aria-hidden="true" />
					Como funciona o bolão
				</h3>
				<div>
					<p>
						Cada bilhete registra um placar e participa depois que o pagamento é
						confirmado.
					</p>
					{distribution && (
						<p>
							{distribution.winners}% da arrecadação vai para os acertadores do
							placar exato, em proporção aos bilhetes vencedores. Os{" "}
							{distribution.base}% restantes seguem a distribuição do bolão.
						</p>
					)}
					<p>
						No ranking, o placar exato vale a pontuação máxima. Acertar só o
						vencedor ou o empate vale pontos parciais. Pedidos feitos sem conta
						não entram no ranking.
					</p>
				</div>
			</section>
		</aside>
	);
}
