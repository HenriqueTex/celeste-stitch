"use client";
import { useId, type ReactNode } from "react";
import { ChevronDown } from "lucide-react";

export default function ExpandableRow({
	open,
	onToggle,
	summary,
	children,
	className,
}: {
	open: boolean;
	onToggle: () => void;
	summary: ReactNode;
	children: ReactNode;
	className?: string;
}) {
	const id = useId();
	return (
		<li
			className={`expand-item${open ? " is-open" : ""}${className ? ` ${className}` : ""}`}
		>
			<button
				type="button"
				className="expand-row"
				aria-expanded={open}
				aria-controls={id}
				onClick={onToggle}
			>
				{summary}
				<ChevronDown className="expand-chevron" size={18} aria-hidden="true" />
			</button>
			<div id={id} className="expand-panel" inert={!open}>
				<div className="expand-panel-inner">
					<div className="expand-content">{children}</div>
				</div>
			</div>
		</li>
	);
}
