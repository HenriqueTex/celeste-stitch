"use client";

import { useState } from "react";

export default function TeamBadge({
	name,
	src,
	small = false,
}: {
	name: string;
	src: string | null;
	small?: boolean;
}) {
	const [failedUrl, setFailedUrl] = useState<string | null>(null);
	return (
		<span className={`team-badge ${small ? "team-badge-small" : ""}`}>
			{src && src !== failedUrl ? (
				// eslint-disable-next-line @next/next/no-img-element
				<img
					src={src}
					alt=""
					width={small ? 32 : 56}
					height={small ? 32 : 56}
					onError={() => setFailedUrl(src)}
				/>
			) : (
				<span aria-hidden="true">
					{name
						.normalize("NFD")
						.replace(/[\u0300-\u036f]/g, "")
						.slice(0, 3)
						.toUpperCase()}
				</span>
			)}
		</span>
	);
}
