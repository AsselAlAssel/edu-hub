"use client";
import {
	MotionConfig,
	motion,
	useAnimationControls,
	useInView,
	useMotionValue,
	useReducedMotion,
	useSpring,
	type MotionValue,
	type Variants,
} from "framer-motion";
import {
	useEffect,
	useLayoutEffect,
	useRef,
	useState,
	type CSSProperties,
	type ReactNode,
	type RefObject,
} from "react";
import { motion as tokens } from "../../../theme/tokens";

const { ease, reveal, stagger } = tokens.fm;

// Layout effect on the client (runs before paint), plain effect on the server.
const useIsomorphicLayoutEffect =
	typeof window === "undefined" ? useEffect : useLayoutEffect;

/**
 * App-wide motion settings. `reducedMotion="user"` makes Framer Motion drop
 * transform/layout animation (keeping opacity fades) only for users who ask
 * for reduced motion — everyone else gets the full experience.
 */
export function MotionProvider({ children }: { children: ReactNode }) {
	return (
		<MotionConfig reducedMotion='user' transition={{ duration: reveal, ease }}>
			{children}
		</MotionConfig>
	);
}

export const revealVariants: Variants = {
	hidden: { opacity: 0, y: 28 },
	visible: { opacity: 1, y: 0, transition: { duration: reveal, ease } },
};

export const itemVariants: Variants = {
	hidden: { opacity: 0, y: 22, scale: 0.98 },
	visible: {
		opacity: 1,
		y: 0,
		scale: 1,
		transition: { duration: 0.5, ease },
	},
};

type BaseProps = {
	children: ReactNode;
	className?: string;
	style?: CSSProperties;
	id?: string;
};

/**
 * Scroll reveal that never hides content by default: the server HTML (and
 * no-JS / non-scrolling tools) shows everything. After mount, only elements
 * still below the fold are switched to "hidden", then revealed on entry —
 * so the swap is never visible to the user.
 */
function useScrollReveal() {
	const ref = useRef<HTMLDivElement>(null);
	const controls = useAnimationControls();
	const inView = useInView(ref, { once: true, amount: 0.12 });
	const [armed, setArmed] = useState(false);

	useIsomorphicLayoutEffect(() => {
		const top = ref.current?.getBoundingClientRect().top ?? 0;
		if (top > window.innerHeight) {
			controls.set("hidden");
			setArmed(true);
		}
	}, [controls]);

	useEffect(() => {
		if (armed && inView) void controls.start("visible");
	}, [armed, inView, controls]);

	return { ref, controls };
}

/** Fades + lifts its content in once when it scrolls into view. */
export function Reveal({
	children,
	delay = 0,
	y,
	...props
}: BaseProps & { delay?: number; y?: number }) {
	const { ref, controls } = useScrollReveal();
	return (
		<motion.div
			ref={ref}
			initial={false}
			animate={controls}
			variants={{
				hidden: { opacity: 0, y: y ?? 28 },
				visible: {
					opacity: 1,
					y: 0,
					transition: { duration: reveal, ease, delay },
				},
			}}
			{...props}
		>
			{children}
		</motion.div>
	);
}

/**
 * Staggers every descendant <StaggerItem> (variants propagate through plain
 * DOM, so the grid itself can stay an MUI Box). Scroll-triggered like
 * <Reveal>; `onMount` plays on mount instead — only for client-only UI
 * such as the mobile drawer (it starts hidden).
 */
export function Stagger({
	children,
	delay = 0,
	gap = stagger,
	onMount = false,
	...props
}: BaseProps & { delay?: number; gap?: number; onMount?: boolean }) {
	const { ref, controls } = useScrollReveal();
	const trigger = onMount
		? { initial: "hidden", animate: "visible" }
		: { ref, initial: false as const, animate: controls };
	return (
		<motion.div
			{...trigger}
			variants={{
				hidden: {},
				visible: {
					transition: { staggerChildren: gap, delayChildren: delay },
				},
			}}
			{...props}
		>
			{children}
		</motion.div>
	);
}

/** Child of <Stagger>. `as="li"` keeps list semantics inside a <ul> grid. */
export function StaggerItem({
	children,
	as = "div",
	...props
}: BaseProps & { as?: "div" | "li" }) {
	const Component = as === "li" ? motion.li : motion.div;
	return (
		<Component variants={itemVariants} {...props}>
			{children}
		</Component>
	);
}

/**
 * Entrance for a page's main content (CSS: runs from the server HTML and on
 * every client navigation, since each route mounts a fresh node).
 */
export function PageTransition({ children }: { children: ReactNode }) {
	return <div className='qa-page'>{children}</div>;
}

/**
 * Staggered CSS entrance for items already in the first viewport (card grids).
 * `index` sets the delay; reduced motion collapses it via globals.css.
 */
export function RiseItem({
	children,
	index,
	as: Component = "div",
	style,
	...props
}: BaseProps & { index: number; as?: "div" | "li" }) {
	return (
		<Component
			className='qa-rise'
			style={{ ...style, ["--i" as string]: index }}
			{...props}
		>
			{children}
		</Component>
	);
}

/**
 * Pointer position over `ref`, normalised to −1…1 and spring-smoothed.
 * Inert for touch pointers and for users who prefer reduced motion.
 */
export function usePointerParallax(ref: RefObject<HTMLElement>): {
	x: MotionValue<number>;
	y: MotionValue<number>;
} {
	const reduce = useReducedMotion();
	const rawX = useMotionValue(0);
	const rawY = useMotionValue(0);
	const x = useSpring(rawX, { stiffness: 90, damping: 20, mass: 0.6 });
	const y = useSpring(rawY, { stiffness: 90, damping: 20, mass: 0.6 });

	useEffect(() => {
		const node = ref.current;
		if (!node || reduce) return;
		if (!window.matchMedia?.("(pointer: fine)").matches) return;

		let frame = 0;
		const onMove = (event: PointerEvent) => {
			cancelAnimationFrame(frame);
			frame = requestAnimationFrame(() => {
				const rect = node.getBoundingClientRect();
				rawX.set(((event.clientX - rect.left) / rect.width) * 2 - 1);
				rawY.set(((event.clientY - rect.top) / rect.height) * 2 - 1);
			});
		};
		const onLeave = () => {
			rawX.set(0);
			rawY.set(0);
		};
		node.addEventListener("pointermove", onMove);
		node.addEventListener("pointerleave", onLeave);
		return () => {
			cancelAnimationFrame(frame);
			node.removeEventListener("pointermove", onMove);
			node.removeEventListener("pointerleave", onLeave);
		};
	}, [ref, reduce, rawX, rawY]);

	return { x, y };
}
