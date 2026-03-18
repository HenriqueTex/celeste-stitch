import MaterialIcon from "@/components/icons/MaterialIcon";

export default function ActivePool() {
	return (
		<section className="glass-panel rounded-2xl p-6 bg-gradient-to-br from-surface-dark to-primary/20">
			<h3 className="font-black uppercase italic tracking-tight mb-4 flex items-center gap-2">
				<MaterialIcon name="payments" className="text-primary" />
				Bolão Ativo
			</h3>

			{/* Pot amount */}
			<div className="text-center py-4 bg-black/20 rounded-2xl border border-white/5 mb-6">
				<p className="text-[10px] font-bold text-slate-500 uppercase">
					Pote Atual
				</p>
				<p className="text-3xl font-black text-white italic">R$ 5.420,00</p>
			</div>

			{/* Distribution */}
			<div className="space-y-4">
				<div className="flex items-start gap-3">
					<div className="size-8 rounded-lg bg-primary/20 flex items-center justify-center shrink-0">
						<MaterialIcon
							name="celebration"
							className="text-primary text-lg font-bold"
						/>
					</div>
					<div>
						<p className="text-xs font-bold">90% Vencedores</p>
						<p className="text-[10px] text-slate-500">
							Distribuído entre todos os acertadores.
						</p>
					</div>
				</div>
				<div className="flex items-start gap-3">
					<div className="size-8 rounded-lg bg-accent/20 flex items-center justify-center shrink-0">
						<MaterialIcon
							name="volunteer_activism"
							className="text-accent text-lg font-bold"
						/>
					</div>
					<div>
						<p className="text-xs font-bold">10% Base Jovem</p>
						<p className="text-[10px] text-slate-500">
							Ajudando nossas futuras estrelas.
						</p>
					</div>
				</div>
			</div>
		</section>
	);
}
