import MaterialIcon from "@/components/icons/MaterialIcon";
import Link from "next/link";

export default function BecomeLegend() {
	return (
		<section className="bg-gradient-to-tr from-accent to-yellow-600 rounded-2xl p-1">
			<div className="bg-surface-dark rounded-[calc(1rem-2px)] p-6 flex flex-col items-center text-center">
				<MaterialIcon name="sports_soccer" className="text-4xl text-accent mb-2" />
				<h4 className="font-black uppercase italic text-sm">
					Participe do Bolão
				</h4>
				<p className="text-sm text-slate-300 mt-2 mb-4">
					Veja as próximas partidas e participe quando os palpites estiverem abertos.
				</p>
				<Link href="/matches" className="rounded-lg bg-accent px-5 py-2.5 text-sm font-bold text-background-dark hover:bg-yellow-400 focus-visible:outline-2 focus-visible:outline-white transition-colors">
					Ver jogos
				</Link>
			</div>
		</section>
	);
}
