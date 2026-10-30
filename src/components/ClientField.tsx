import { useId, type InputHTMLAttributes } from "react";

export default function ClientField({
	label,
	hint,
	error,
	...input
}: InputHTMLAttributes<HTMLInputElement> & {
	label: string;
	hint?: string;
	error?: string;
}) {
	const id = useId();
	const describedBy = error ? `${id}-error` : hint ? `${id}-hint` : undefined;
	return (
		<div className="checkout-field">
			<label htmlFor={id}>{label}</label>
			<input
				id={id}
				aria-invalid={error ? true : undefined}
				aria-describedby={describedBy}
				{...input}
			/>
			{error ? (
				<small id={`${id}-error`} className="field-error">
					{error}
				</small>
			) : (
				hint && <small id={`${id}-hint`}>{hint}</small>
			)}
		</div>
	);
}
