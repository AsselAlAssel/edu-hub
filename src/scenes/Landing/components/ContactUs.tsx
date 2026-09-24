"use client";
import IconTile from "@/components/ui/IconTile";
import { Stagger, StaggerItem } from "@/components/ui/motion";
import { Section, SectionHeader } from "@/components/ui/Section";
import Surface from "@/components/ui/Surface";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import PlaceOutlinedIcon from "@mui/icons-material/PlaceOutlined";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import { Box, Typography } from "@mui/material";
import type { ReactNode } from "react";

type ContactItem = {
	key: string;
	icon: ReactNode;
	tone: "primary" | "secondary" | "success";
	label: string;
	value: string;
	href: string;
	external: boolean;
	ltr?: boolean;
	actionLabel: string;
};

export const whatsappDigits = (value: string) => value.replace(/\D/g, "");

export function buildContactItems({
	email,
	address,
	whatsappNumber,
}: {
	email?: string;
	address?: string;
	whatsappNumber?: string;
}): ContactItem[] {
	const items: ContactItem[] = [];
	if (email) {
		items.push({
			key: "email",
			icon: <EmailOutlinedIcon />,
			tone: "primary",
			label: "البريد الإلكتروني",
			value: email,
			href: `mailto:${email}`,
			external: false,
			ltr: true,
			actionLabel: `راسلنا على ${email}`,
		});
	}
	if (address) {
		items.push({
			key: "address",
			icon: <PlaceOutlinedIcon />,
			tone: "secondary",
			label: "العنوان",
			value: address,
			href: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`,
			external: true,
			actionLabel: `عرض ${address} على الخريطة (يفتح في نافذة جديدة)`,
		});
	}
	const digits = whatsappNumber ? whatsappDigits(whatsappNumber) : "";
	if (digits) {
		items.push({
			key: "whatsapp",
			icon: <WhatsAppIcon />,
			tone: "success",
			label: "واتساب",
			value: `+${digits}`,
			href: `https://wa.me/${digits}`,
			external: true,
			ltr: true,
			actionLabel: `محادثة واتساب مع ‎+${digits} (يفتح في نافذة جديدة)`,
		});
	}
	return items;
}

export default function ContactUs(props: {
	whatsappNumber?: string;
	address?: string;
	email?: string;
}) {
	const items = buildContactItems(props);

	return (
		<Section id='contact' aria-labelledby='contact-title'>
			<SectionHeader
				titleId='contact-title'
				eyebrow='تواصل معنا'
				title={
					<>
						ابقَ <span className='qa-gradient-text'>على تواصل</span>
					</>
				}
				description='لا تتردد في التواصل لأي استفسار عن الدروس أو المنصة.'
			/>
			{items.length ? (
				<Stagger>
					<Box
						component='ul'
						sx={{
							listStyle: "none",
							m: 0,
							p: 0,
							display: "grid",
							gap: 2.5,
							maxWidth: 1140,
							mx: "auto",
							gridTemplateColumns: {
								xs: "1fr",
								md: `repeat(${items.length}, minmax(0, 1fr))`,
							},
						}}
					>
						{items.map((item) => (
							<StaggerItem as='li' key={item.key}>
								<Box
									component='a'
									href={item.href}
									aria-label={item.actionLabel}
									{...(item.external && {
										target: "_blank",
										rel: "noopener noreferrer",
									})}
									sx={(theme) => ({
										display: "block",
										height: "100%",
										textDecoration: "none",
										color: "inherit",
										borderRadius: `${theme.tokens.radii.lg}px`,
									})}
								>
									<Surface
										interactive
										padding={3}
										sx={{
											display: "flex",
											alignItems: "center",
											gap: 2,
											height: "100%",
											"&:hover .qa-icon-tile svg": { transform: "scale(1.12)" },
										}}
									>
										<IconTile tone={item.tone}>{item.icon}</IconTile>
										<Box sx={{ minWidth: 0 }}>
											<Typography
												variant='subtitle2'
												component='span'
												sx={{ color: "text.secondary", display: "block" }}
											>
												{item.label}
											</Typography>
											<Typography
												component='span'
												dir={item.ltr ? "ltr" : undefined}
												sx={{
													display: "block",
													fontWeight: 600,
													fontSize: "0.9375rem",
													color: "text.primary",
													overflowWrap: "anywhere",
													textAlign: "start",
												}}
											>
												{item.value}
											</Typography>
										</Box>
									</Surface>
								</Box>
							</StaggerItem>
						))}
					</Box>
				</Stagger>
			) : null}
		</Section>
	);
}
