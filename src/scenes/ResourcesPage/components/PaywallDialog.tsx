"use client";
import {
	GoogleLogo,
	signInWithGoogle,
} from "@/components/Auth/GoogleSigninDialog";
import AppDialog from "@/components/ui/AppDialog";
import { SecondaryButton } from "@/components/ui/buttons";
import type { Unit } from "@/libs/access";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import { Button, Stack, Typography } from "@mui/material";

/** "الصف العاشر" stays as is; "العاشر" becomes "الصف العاشر". */
const classLabel = (name: string) =>
	/^(ال)?صف/.test(name.trim()) ? name.trim() : `الصف ${name.trim()}`;

/** wa.me link with a ready, polite message naming the unit and class. */
export const subscribeLink = (
	number: string,
	unit: Unit,
	className: string,
	renew = false
) =>
	`https://wa.me/${number}?text=${encodeURIComponent(
		[
			"السلام عليكم ورحمة الله،",
			`أرغب ${renew ? "بتجديد اشتراكي" : "بالاشتراك"} في «${unit.name}» من ${classLabel(className)} (${unit.price} ₪).`,
			"أرجو تزويدي بطريقة الدفع، وشكراً جزيلاً.",
		].join("\n")
	)}`;

const dateFormat = new Intl.DateTimeFormat("ar", { dateStyle: "long" });

/** Locked paid-unit content: price + subscribe on WhatsApp (sign in first). */
export default function PaywallDialog({
	open,
	onClose,
	unit,
	className,
	whatsAppNumber,
	signedIn,
	expiredAt = null,
}: {
	open: boolean;
	onClose: () => void;
	unit: Unit | null;
	className: string;
	whatsAppNumber: string | null;
	signedIn: boolean;
	/** Set when the student had the unit and the year ran out. */
	expiredAt?: string | null;
}) {
	if (!unit?.price) return null;
	const renew = !!expiredAt;
	return (
		<AppDialog
			open={open}
			onClose={onClose}
			title={`«${unit.name}» للمشتركين`}
			actions={<SecondaryButton onClick={onClose}>إغلاق</SecondaryButton>}
		>
			<Stack spacing={2} alignItems='center' textAlign='center'>
				<LockOutlinedIcon sx={{ fontSize: 40, color: "primary.main" }} />
				<Typography>
					{renew
						? `انتهى اشتراكك في هذه الوحدة بتاريخ ${dateFormat.format(new Date(expiredAt))}. جدّد اشتراكك لتفتح لك من جديد.`
						: "فيديوهات وملفات هذه الوحدة متاحة بعد الاشتراك فيها، حتى 31 آب من العام القادم."}
				</Typography>
				<Typography variant='h5' component='p' sx={{ fontWeight: 800 }}>
					{unit.price} ₪
				</Typography>
				{signedIn ? null : (
					<>
						<Typography variant='body2' sx={{ color: "text.secondary" }}>
							سجّل دخولك أولاً حتى نفتح الوحدة على حسابك بعد الدفع.
						</Typography>
						<Button
							variant='outlined'
							startIcon={<GoogleLogo />}
							onClick={signInWithGoogle}
						>
							تسجيل الدخول
						</Button>
					</>
				)}
				{whatsAppNumber ? (
					<Button
						variant='contained'
						color='success'
						startIcon={<WhatsAppIcon />}
						href={subscribeLink(whatsAppNumber, unit, className, renew)}
						target='_blank'
						rel='noopener noreferrer'
					>
						{renew ? "جدّد عبر واتساب" : "اشترك عبر واتساب"}
					</Button>
				) : null}
			</Stack>
		</AppDialog>
	);
}
