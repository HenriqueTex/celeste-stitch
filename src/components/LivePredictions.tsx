import MaterialIcon from "@/components/icons/MaterialIcon";

export default function LivePredictions() {
	return (
		<section>
			{/* Section header */}
			<div className="flex items-center justify-between mb-4">
				<div className="flex items-center gap-2">
					<MaterialIcon name="rss_feed" className="text-primary font-bold" />
					<h2 className="text-xl font-black uppercase italic tracking-tight">
						Palpites ao Vivo
					</h2>
				</div>
				<div className="flex gap-2">
					<button className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold border border-primary/20">
						Todos
					</button>
					<button className="px-3 py-1 rounded-full bg-slate-100 dark:bg-white/5 text-slate-500 text-xs font-bold border border-transparent">
						Em Alta
					</button>
				</div>
			</div>

			{/* Prediction cards */}
			<div className="flex flex-col gap-3">
				{/* Card 1 — Ana Maria */}
				<div className="glass-panel p-4 rounded-xl flex items-center justify-between border-l-4 border-l-success">
					<div className="flex items-center gap-4">
						<div className="size-12 rounded-full overflow-hidden border-2 border-white/10">
							{/* eslint-disable-next-line @next/next/no-img-element */}
							<img
								alt="Ana Maria"
								className="bg-blue-400 size-full object-cover"
								src="https://lh3.googleusercontent.com/aida-public/AB6AXuA5XSqTqmKXiBKt7_YmB9sC3RKNQOlf1MuB90lWNYqwb0N7bIzrVXousGqk42LJ1RnKnYwdEnshG2il5Hu5vYP7fGOdN7Fa0I473Y5bF3MBFrwIBzgQ596_gBOVRDuOaHfsRPUDVFlIS_IJ4GMzRiwXYV1YqeEZx4Isazl3zrXkHczc4T5E5F8ZTgUqgU-sZZA9f5UtK67cTiuADKkIirENw7RaMiu3LYKWxZhYO1x2FnfRpHULyY7EhY1GGaYVbPgVJXr8goXtObXo"
							/>
						</div>
						<div>
							<div className="flex items-center gap-2">
								<span className="font-bold text-sm">Ana Maria</span>
								<span className="text-[10px] bg-accent/20 text-accent px-1.5 py-0.5 rounded font-black">
									PRO
								</span>
								<span className="text-slate-500 text-[10px]">2m atrás</span>
							</div>
							<p className="text-xs text-slate-400 mt-0.5">
								Palpitou{" "}
								<span className="text-white font-bold italic">2-1</span> pro
								Cruzeiro.{" "}
								<span className="text-success text-[10px] font-bold ml-1">
									#FechadoComOCruzeiro
								</span>
							</p>
						</div>
					</div>
					<div className="flex items-center gap-2">
						<button className="size-8 rounded-lg flex items-center justify-center bg-white/5 hover:bg-white/10 transition-colors">
							<MaterialIcon name="favorite" className="text-sm" />
						</button>
						<button className="text-[10px] font-bold bg-primary px-3 py-1.5 rounded-lg">
							Copiar
						</button>
					</div>
				</div>

				{/* Card 2 — Beto Silva */}
				<div className="glass-panel p-4 rounded-xl flex items-center justify-between border-l-4 border-l-primary">
					<div className="flex items-center gap-4">
						<div className="size-12 rounded-full overflow-hidden border-2 border-white/10">
							{/* eslint-disable-next-line @next/next/no-img-element */}
							<img
								alt="Beto Silva"
								className="bg-indigo-400 size-full object-cover"
								src="https://lh3.googleusercontent.com/aida-public/AB6AXuAMYraDvaBERhLqt1etcdFd5J0xfjBhsSoRvKrc5JI_cAkdK5T8B_3d4LBg_sAaY0M1rokj-iuqo7XUeMS6Nq9CJ0L_bpxGzipjbHZbu8JMjJjHttXfg8HaTcLA5mocFuNf-rQNhxANf9kln1IJHhrqb2A_310gUkY6F1zZFCB8BZRtqfiAwmq1foT1jOM1aeV-6Udt7l58wOYjoAZ6LnKr2w83pn-Ad6dMF77Dh_pzgrHqFeCWH8kc7rXkpkxn6SgdIkegjw2VX0PZ"
							/>
						</div>
						<div>
							<div className="flex items-center gap-2">
								<span className="font-bold text-sm">Beto Silva</span>
								<span className="text-slate-500 text-[10px]">10m atrás</span>
							</div>
							<p className="text-xs text-slate-400 mt-0.5">
								Ganhou{" "}
								<span className="text-accent font-bold">R$ 420,00</span> na
								Rodada 24!{" "}
								<span className="text-primary text-[10px] font-bold ml-1">
									PLACAR EXATO
								</span>
							</p>
						</div>
					</div>
					<button className="size-8 rounded-lg flex items-center justify-center bg-white/5 hover:bg-white/10">
						<MaterialIcon name="share" className="text-sm" />
					</button>
				</div>
			</div>
		</section>
	);
}
