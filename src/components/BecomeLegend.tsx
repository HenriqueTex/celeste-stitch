import MaterialIcon from "@/components/icons/MaterialIcon";

export default function BecomeLegend() {
	return (
		<section className="bg-gradient-to-tr from-accent to-yellow-600 rounded-2xl p-1">
			<div className="bg-surface-dark rounded-[calc(1rem-2px)] p-6 flex flex-col items-center text-center">
				<MaterialIcon name="stars" className="text-4xl text-accent mb-2" />
				<h4 className="font-black uppercase italic text-sm">
					Torne-se uma Lenda
				</h4>
				<p className="text-[11px] text-slate-400 mt-1 mb-4">
					Complete 10 palpites para desbloquear a Medalha Elite e dobrar
					seus pontos!
				</p>
				<div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
					<div className="bg-accent h-full" style={{ width: "60%" }} />
				</div>
				<p className="text-[10px] font-bold mt-2 text-accent">
					6 / 10 Palpites
				</p>
			</div>
		</section>
	);
}
