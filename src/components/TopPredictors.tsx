import MaterialIcon from "@/components/icons/MaterialIcon";

const predictors = [
	{
		rank: 1,
		name: "Marco Polo",
		accuracy: "89%",
		points: "1,240 pts",
		bgColor: "bg-orange-400",
		image:
			"https://lh3.googleusercontent.com/aida-public/AB6AXuC4L1n_3lqytfPVrdO9jbJMsPY7UH2jXRqLhamrPELv0idmBOmAn9KU-WWkgsiyKHxRrZG28PWtmBeZ_43_hDwtYem1xe-e6op25Kp5BQPs-EAbrX8ZAWxGPVSoSNiylDm3ATQxPj9H_659Wmx9HU4t1btWtux634x8d43zYd-stNphYokHcI6PoKwnMRcjymTS-OV5B4d5RrXprVgKgWlAjEj6JSn8d5cO6PULFYi3A46MaBz32dr152dmmxIVaoB5SPP_uCMoS_Ii",
		highlight: true,
	},
	{
		rank: 2,
		name: "Julia Star",
		accuracy: "82%",
		points: "1,105 pts",
		bgColor: "bg-pink-400",
		image:
			"https://lh3.googleusercontent.com/aida-public/AB6AXuAvlZ8ikbsx9cCZsqGus2g9s_xMUq9dPnfa8XPjbNzG2nrtu0sbBGYHGD93PLUoHJXP23gn10uPQK5FBH-vv3WSoUTKWt8TCTbxG73GamKmSPSsFo_Y5KHnLya1P3Le-l9Jm4jRHzayxNGXzEviU2rYOHywOgi7zk5QQOn00N3jIpRsFSL1KTuAxkekPQ_xdzPnC3_dzg9gTWKI4TdlEOfJ8DUYwUCmG0-qn93qSQd5Dx3pTUVYx9X-Ar0bsNWk9yXf_XWJAN5xi9PR",
		highlight: false,
	},
	{
		rank: 3,
		name: "Tiago Fan",
		accuracy: "78%",
		points: "980 pts",
		bgColor: "bg-green-400",
		image:
			"https://lh3.googleusercontent.com/aida-public/AB6AXuAMLUWw-KYt5W-PEdDK91RY1Wo6b6LW8--hmSni_VsOcu1Ib0GqdgS5A-KTJctw3ucwuiyfDVe5DDfTdatXFb33ZH50Bma6C5THydqTlD26_UrkFeQh42jB_HrG5Utmb7-I_JyPjzudDEVUBk4Lm93Nl0U0NlVhuFlssQ63Dkv6aoHoBz6xzFNxNxbRUpn1_24OPgPGbRGVwoEoK4tlw4u2aNwwm46BxqP9KFocpYez_K9gL9I2WQb7Jl2eurGnyLgkWPUbrgKYQ6Bq",
		highlight: false,
	},
];

export default function TopPredictors() {
	return (
		<section className="glass-panel rounded-2xl p-6 border-b-4 border-b-accent">
			{/* Header */}
			<div className="flex items-center justify-between mb-6">
				<div className="flex items-center gap-2">
					<MaterialIcon name="military_tech" className="text-accent font-black" />
					<h3 className="font-black uppercase italic tracking-tight">
						Melhores Palpiteiros
					</h3>
				</div>
				<span className="text-[10px] font-bold text-slate-500">Semanal</span>
			</div>

			{/* Leaderboard rows */}
			<div className="space-y-4">
				{predictors.map((p) => (
					<div
						key={p.rank}
						className={`flex items-center justify-between p-3 rounded-xl transition-all ${p.highlight
							? "bg-accent/10 border border-accent/20 group hover:bg-accent/20"
							: "bg-white/5 border border-white/5"
							}`}
					>
						<div className="flex items-center gap-3">
							<span
								className={`font-black italic text-lg w-4 ${p.highlight ? "text-accent" : "text-slate-500"
									}`}
							>
								{p.rank}
							</span>
							<div
								className={`size-10 rounded-lg overflow-hidden ${p.highlight ? "border border-accent/30" : ""
									}`}
							>
								{/* eslint-disable-next-line @next/next/no-img-element */}
								<img
									alt={p.name}
									className={`${p.bgColor} size-full object-cover`}
									src={p.image}
								/>
							</div>
							<div>
								<p className="font-bold text-sm">{p.name}</p>
								<p
									className={`text-[10px] font-bold uppercase ${p.highlight ? "text-accent/80" : "text-slate-500"
										}`}
								>
									{p.accuracy} Acertos
								</p>
							</div>
						</div>
						<div className="text-right">
							<p className="text-xs font-black italic">{p.points}</p>
						</div>
					</div>
				))}
			</div>

			<button className="w-full mt-6 py-3 rounded-xl border border-white/10 text-xs font-bold hover:bg-white/5 transition-colors uppercase">
				Ver Ranking Completo
			</button>
		</section>
	);
}
