"use client";

import { motion, type Variants } from "framer-motion";
import { Box, type BoxProps } from "@mui/material";
import {
	forwardRef,
	type ReactNode,
	type ComponentProps,
	useMemo,
} from "react";

const RawMotionBox = motion.create(Box);

type MotionBoxProps = ComponentProps<typeof RawMotionBox>;

const MotionBox = forwardRef<HTMLDivElement, MotionBoxProps>(
	function MotionBox(props, ref) {
		return (
			<RawMotionBox ref={ref} {...({ ignoreStrict: true } as any)} {...props} />
		);
	}
);

type SafeBoxProps = Omit<
	BoxProps,
	"component" | "onAnimationStart" | "onDragStart" | "onDragEnd" | "onDrag"
>;

// ─── Variant Presets ────────────────────────────────────────────────

export const fadeSlideUp: Variants = {
	hidden: { opacity: 0, y: 32 },
	visible: {
		opacity: 1,
		y: 0,
		transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
	},
};

export const fadeIn: Variants = {
	hidden: { opacity: 0 },
	visible: {
		opacity: 1,
		transition: { duration: 0.7, ease: "easeOut" },
	},
};

export const scaleIn: Variants = {
	hidden: { opacity: 0, scale: 0.92 },
	visible: {
		opacity: 1,
		scale: 1,
		transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
	},
};

export const fadeSlideRight: Variants = {
	hidden: { opacity: 0, x: -40 },
	visible: {
		opacity: 1,
		x: 0,
		transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
	},
};

export const fadeSlideLeft: Variants = {
	hidden: { opacity: 0, x: 40 },
	visible: {
		opacity: 1,
		x: 0,
		transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
	},
};

export const staggerContainer: Variants = {
	hidden: {},
	visible: {
		transition: {
			staggerChildren: 0.12,
			delayChildren: 0.15,
		},
	},
};

export const staggerContainerFast: Variants = {
	hidden: {},
	visible: {
		transition: {
			staggerChildren: 0.08,
		},
	},
};

// ─── Animated Wrappers ──────────────────────────────────────────────

interface AnimatedSectionProps extends SafeBoxProps {
	children: ReactNode;
	variants?: Variants;
	delay?: number;
	viewportMargin?: string;
	viewportAmount?: number;
}

export const AnimatedSection = forwardRef<HTMLDivElement, AnimatedSectionProps>(
	function AnimatedSection(
		{
			children,
			variants = fadeSlideUp,
			delay = 0,
			viewportMargin = "-60px",
			viewportAmount,
			...props
		},
		ref
	) {
		return (
			<MotionBox
				ref={ref}
				initial='hidden'
				whileInView='visible'
				viewport={{
					once: true,
					margin: viewportMargin,
					amount: viewportAmount,
				}}
				variants={{
					hidden: variants.hidden,
					visible: {
						...((variants.visible as object) || {}),
						transition: {
							...(((variants.visible as Record<string, unknown>)
								?.transition as object) || {}),
							delay,
						},
					},
				}}
				{...props}
			>
				{children}
			</MotionBox>
		);
	}
);

interface StaggerGroupProps extends SafeBoxProps {
	children: ReactNode;
	fast?: boolean;
	viewportMargin?: string;
	viewportAmount?: number;
}

export const StaggerGroup = forwardRef<HTMLDivElement, StaggerGroupProps>(
	function StaggerGroup(
		{
			children,
			fast = false,
			viewportMargin = "-40px",
			viewportAmount,
			...props
		},
		ref
	) {
		return (
			<MotionBox
				ref={ref}
				initial='hidden'
				whileInView='visible'
				viewport={{
					once: true,
					margin: viewportMargin,
					amount: viewportAmount,
				}}
				variants={fast ? staggerContainerFast : staggerContainer}
				{...props}
			>
				{children}
			</MotionBox>
		);
	}
);

interface StaggerItemProps extends SafeBoxProps {
	children: ReactNode;
	variants?: Variants;
}

export const StaggerItem = forwardRef<HTMLDivElement, StaggerItemProps>(
	function StaggerItem({ children, variants = fadeSlideUp, ...props }, ref) {
		return (
			<MotionBox ref={ref} variants={variants} {...props}>
				{children}
			</MotionBox>
		);
	}
);

export const FloatingImage = forwardRef<
	HTMLDivElement,
	SafeBoxProps & { children: ReactNode }
>(function FloatingImage({ children, ...props }, ref) {
	return (
		<MotionBox
			ref={ref}
			initial={{ opacity: 0, scale: 0.88, y: 20 }}
			animate={{ opacity: 1, scale: 1, y: 0 }}
			transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.4 }}
			{...props}
		>
			<MotionBox
				animate={{ y: [0, -10, 0] }}
				transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
			>
				{children}
			</MotionBox>
		</MotionBox>
	);
});

// ─── Decorative Elements ────────────────────────────────────────────

export function GlowOrb({
	color = "rgba(0,180,216,0.35)",
	size = 400,
	top,
	left,
	right,
	bottom,
	delay = 0,
}: {
	color?: string;
	size?: number;
	top?: string | number;
	left?: string | number;
	right?: string | number;
	bottom?: string | number;
	delay?: number;
}) {
	return (
		<Box
			sx={{
				position: "absolute",
				top,
				left,
				right,
				bottom,
				width: size,
				height: size,
				borderRadius: "50%",
				background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
				filter: "blur(80px)",
				pointerEvents: "none",
				zIndex: 0,
				animation: `glowPulse 8s ease-in-out ${delay}s infinite`,
				"@keyframes glowPulse": {
					"0%, 100%": { transform: "scale(1)", opacity: 0.3 },
					"50%": { transform: "scale(1.2)", opacity: 0.5 },
				},
				willChange: "transform, opacity",
			}}
		/>
	);
}

export function OrbitRing({
	size = 500,
	duration = 20,
	color = "rgba(0,180,216,0.08)",
	top,
	left,
	right,
	bottom,
}: {
	size?: number;
	duration?: number;
	color?: string;
	top?: string | number;
	left?: string | number;
	right?: string | number;
	bottom?: string | number;
}) {
	return (
		<Box
			sx={{
				position: "absolute",
				top,
				left,
				right,
				bottom,
				width: size,
				height: size,
				borderRadius: "50%",
				border: `1px solid ${color}`,
				pointerEvents: "none",
				zIndex: 0,
				animation: `orbitSpin ${duration}s linear infinite`,
				"@keyframes orbitSpin": {
					"0%": { transform: "rotate(0deg)" },
					"100%": { transform: "rotate(360deg)" },
				},
				willChange: "transform",
			}}
		/>
	);
}

export function GridPattern() {
	return (
		<Box
			sx={{
				position: "absolute",
				inset: 0,
				backgroundImage: `
					linear-gradient(rgba(0,180,216,0.03) 1px, transparent 1px),
					linear-gradient(90deg, rgba(0,180,216,0.03) 1px, transparent 1px)
				`,
				backgroundSize: "60px 60px",
				pointerEvents: "none",
				zIndex: 0,
				maskImage:
					"radial-gradient(ellipse 60% 60% at 50% 50%, black 20%, transparent 70%)",
				WebkitMaskImage:
					"radial-gradient(ellipse 60% 60% at 50% 50%, black 20%, transparent 70%)",
			}}
		/>
	);
}

interface FloatingParticleProps {
	count?: number;
}

export function FloatingParticles({ count = 12 }: FloatingParticleProps) {
	const particles = useMemo(
		() =>
			Array.from({ length: count }, (_, i) => ({
				id: i,
				x: `${(i * 37 + 13) % 100}%`,
				y: `${(i * 53 + 7) % 100}%`,
				size: 1.5 + (i % 3),
				delay: (i * 0.6) % 5,
				duration: 4 + (i % 4),
			})),
		[count]
	);

	return (
		<Box
			sx={{
				position: "absolute",
				inset: 0,
				overflow: "hidden",
				pointerEvents: "none",
				zIndex: 0,
				"@keyframes particleFloat": {
					"0%, 100%": { opacity: 0, transform: "translateY(0)" },
					"50%": { opacity: 0.6, transform: "translateY(-30px)" },
				},
			}}
		>
			{particles.map((p) => (
				<Box
					key={p.id}
					sx={{
						position: "absolute",
						left: p.x,
						top: p.y,
						width: p.size,
						height: p.size,
						borderRadius: "50%",
						backgroundColor: "rgba(0,180,216,0.5)",
						animation: `particleFloat ${p.duration}s ease-in-out ${p.delay}s infinite`,
						willChange: "transform, opacity",
					}}
				/>
			))}
		</Box>
	);
}

export { MotionBox };
