// The Cruzeiro do Sul (Crux), the five stars on the club crest.
const stars = [
	{ x: 50, y: 10, r: 10 },
	{ x: 20, y: 46, r: 9.5 },
	{ x: 80, y: 40, r: 9 },
	{ x: 63, y: 63, r: 6 },
	{ x: 47, y: 90, r: 11 },
];

function starPoints(cx: number, cy: number, r: number) {
	return Array.from({ length: 10 }, (_, index) => {
		const radius = index % 2 === 0 ? r : r * 0.42;
		const angle = (Math.PI / 5) * index - Math.PI / 2;
		return `${(cx + radius * Math.cos(angle)).toFixed(2)},${(cy + radius * Math.sin(angle)).toFixed(2)}`;
	}).join(" ");
}

export default function Constellation({
	className,
	lit = false,
}: {
	className?: string;
	lit?: boolean;
}) {
	return (
		<svg
			className={`constellation${lit ? " is-lit" : ""}${className ? ` ${className}` : ""}`}
			viewBox="0 0 100 100"
			aria-hidden="true"
			focusable="false"
		>
			{stars.map((star, index) => (
				<polygon
					key={index}
					points={starPoints(star.x, star.y, star.r)}
					style={{ "--star-index": index } as React.CSSProperties}
				/>
			))}
		</svg>
	);
}
