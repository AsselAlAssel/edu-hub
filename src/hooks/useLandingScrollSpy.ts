"use client";

import {
	LANDING_NAV_SECTION_IDS as SECTION_IDS,
	type LandingSectionId,
} from "@/types/landingNav";
import { useEffect, useState } from "react";

export type { LandingSectionId };

/**
 * Active landing section for the header links. A section is "active" while it
 * crosses a band just under the sticky header.
 */
export function useLandingScrollSpy(enabled: boolean): LandingSectionId | null {
	const [active, setActive] = useState<LandingSectionId | null>(
		enabled ? "home" : null
	);

	useEffect(() => {
		if (!enabled || typeof IntersectionObserver === "undefined") {
			setActive(null);
			return;
		}

		const visible = new Map<LandingSectionId, boolean>();
		const observer = new IntersectionObserver(
			(entries) => {
				for (const entry of entries) {
					visible.set(
						entry.target.id as LandingSectionId,
						entry.isIntersecting
					);
				}
				const current = [...SECTION_IDS]
					.reverse()
					.find((id) => visible.get(id));
				if (current) setActive(current);
			},
			{ rootMargin: "-96px 0px -55% 0px" }
		);

		for (const id of SECTION_IDS) {
			const element = document.getElementById(id);
			if (element) observer.observe(element);
		}
		return () => observer.disconnect();
	}, [enabled]);

	return enabled ? active : null;
}
