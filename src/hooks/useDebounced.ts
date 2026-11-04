import { useEffect, useState } from "react";

/** Waits until typing pauses before the value is used for a request. */
export default function useDebounced<T>(value: T, delay: number) {
	const [debounced, setDebounced] = useState(value);
	useEffect(() => {
		const timer = setTimeout(() => setDebounced(value), delay);
		return () => clearTimeout(timer);
	}, [value, delay]);
	return debounced;
}
