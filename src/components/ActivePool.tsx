import { Info, Ticket, Users } from "lucide-react";
import { formatCurrency } from "@/lib/format";
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
			<p className="eyebrow">O bolão desta partida</p>
			<h2 id="pool-heading" className="pool-value">
				{formatCurrency(stats.revenue)}
			</h2>
			<p className="muted">arrecadados em pagamentos confirmados</p>
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
			</dl>
			<details className="pool-help">
				<summary>
					<Info size={16} aria-hidden="true" />
					Como funciona o bolão
				</summary>
				<div>
					<p>
						Cada bilhete registra um placar. A participação é válida após a
						confirmação do pagamento.
					</p>
					{distribution && (
						<p>
							{distribution.winners}% da arrecadação são destinados aos
							acertadores do placar exato, em proporção aos bilhetes vencedores.
							Os {distribution.base}% restantes seguem a distribuição do bolão.
						</p>
					)}
					<p>
						O total arrecadado não é um prêmio individual. Participantes incluem
						contas e pedidos de visitantes distintos.
					</p>
				</div>
			</details>
			{consensus && stats.tickets > 0 ? (
				<div className="consensus-note">
					<span>Um dos placares em destaque</span>
					<strong>
						{consensus.homeScore} × {consensus.awayScore}
					</strong>
					<p>
						{consensus.tickets} de {stats.tickets} bilhetes confirmados (
						{Math.round((consensus.tickets / stats.tickets) * 100)}%). São
						escolhas da comunidade.
					</p>
				</div>
			) : (
				<p className="empty-inline">Ainda sem palpites confirmados.</p>
			)}
		</aside>
	);
}
