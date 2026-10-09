export default function HeroBanner() {
	return (
		<section className="relative rounded-2xl overflow-hidden min-h-[220px] flex flex-col justify-end p-8 shadow-2xl group">
			{/* eslint-disable-next-line @next/next/no-img-element */}
			<img
				alt="Estádio"
				className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
				src="https://lh3.googleusercontent.com/aida-public/AB6AXuBFKYcKV51PJOVN4cqoQcSJ6GR6iZi26NE9SIzDvzX0BbMe-SGqXVQc9hHFvbG0r5QgIHHJ4Tz2ouSMR_NRPXVC5CuaJgauN2ZecfVi64-DiXlQYe90Wn2dh-raBXCMs0Uyj3504yPEuQYBmZanM7ZUl0yiu_lo3IxRVqi040fvvNBq6PUQ2TBbx8UPfO3ITgNB2cB7jeTyIDTPVSRvZ7DAO9Ir_z7fFiD6OqW6xJ2mTwV37Oe6-uSNEQu_GoPoNYGdy9Qp0sSwqJbx"
			/>
			<div className="absolute inset-0 bg-gradient-to-t from-background-dark via-background-dark/40 to-transparent" />

			<div className="relative z-10">
				<div className="flex items-center gap-2 mb-3">
					<span className="bg-emerald-700 text-white text-xs font-black px-2 py-1 rounded-full flex items-center gap-1 uppercase tracking-tighter">
						<span className="size-1.5 bg-white rounded-full" />
						Comunidade Celeste
					</span>
				</div>
				<h1 className="text-white text-3xl sm:text-4xl font-black leading-tight tracking-tight uppercase italic mb-2">
					Cada Jogo, Um Novo Palpite
				</h1>
				<p className="text-slate-200 max-w-lg font-medium text-sm">
					Acompanhe as partidas do Cruzeiro, faça seus palpites e veja os
					resultados da comunidade.
				</p>
			</div>
		</section>
	);
}
