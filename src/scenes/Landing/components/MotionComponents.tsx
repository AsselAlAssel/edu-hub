"use client";

import { motion, type Variants } from "framer-motion";
import { Box, type BoxProps } from "@mui/material";
import { forwardRef, type ReactNode } from "react";

const MotionBox = motion.create(Box);

export const fadeSlideUp: Variants = {
	hidden: { opacity: 0, y: 30 },
	visible: {
		opacity: 1,
		y: 0,
		transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] },
	},
};

export const fadeIn: Variants = {
	hidden: { opacity: 0 },
	visible: {
		opacity: 1,
		transition: { duration: 0.6, ease: "easeOut" },
	},
};

export const scaleIn: Variants = {
	hidden: { opacity: 0, scale: 0.95 },
	visible: {
		opacity: 1,
		scale: 1,
		transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] },
	},
};

export const staggerContainer: Variants = {
	hidden: {},
	visible: {
		transition: {
			staggerChildren: 0.12,
			delayChildren: 0.1,
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

interface AnimatedSectionProps extends Omit<BoxProps, "component"> {
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
			viewportMargin = "-80px",
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

interface StaggerGroupProps extends Omit<BoxProps, "component"> {
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
				variants={fast ? staggerContainerFast : staggerContainer}
				{...props}
			>
				{children}
			</MotionBox>
		);
	}
);

interface StaggerItemProps extends Omit<BoxProps, "component"> {
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
	Omit<BoxProps, "component"> & { children: ReactNode }
>(function FloatingImage({ children, ...props }, ref) {
	return (
		<MotionBox
			ref={ref}
			initial={{ opacity: 0, scale: 0.92 }}
			animate={{ opacity: 1, scale: 1 }}
			transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1], delay: 0.3 }}
			{...props}
		>
			<MotionBox
				animate={{ y: [0, -8, 0] }}
				transition={{
					duration: 4,
					repeat: Infinity,
					ease: "easeInOut",
				}}
			>
				{children}
			</MotionBox>
		</MotionBox>
	);
});

export { MotionBox };
