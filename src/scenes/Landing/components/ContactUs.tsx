"use client";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import { Box, Stack } from "@mui/material";
import SectionTemplate from "./SectionTemplate";
import {
	StyledContactUsIconButton,
	StyledContactUsText,
	StyledSectionTitle,
	StyledSubTitle,
} from "./Styled";

export default function ContactUs(props: {
	whatsappNumber?: string;
	address?: string;
	email?: string;
}) {
	const { whatsappNumber, address, email } = props;
	return (
		<SectionTemplate
			sx={{
				paddingLeft: "80px",
				paddingRight: "80px",
				backgroundColor: "#00426B",
				alignItems: "center",
			}}
			id='contact'
		>
			<Box mb={6}>
				<StyledSubTitle
					sx={{
						color: "#73CAFF",
						mb: 1.5,
						textAlign: "center",
					}}
				>
					إتصل بنا
				</StyledSubTitle>
				<StyledSectionTitle
					color={"#fff"}
					sx={{
						textAlign: "center",
					}}
				>
					إبقى على تواصل
				</StyledSectionTitle>
				<StyledSubTitle
					sx={{
						color: "#73CAFF",
						mt: 1.5,
						textAlign: "center",
					}}
				>
					لا تتردد في التواصل معنا لأي استفسار أو مساعدة
				</StyledSubTitle>
			</Box>
			<Box
				sx={{
					maxWidth: "1280px",
					margin: "auto",
				}}
			>
				<Stack
					direction={{ xs: "column", sm: "row" }}
					spacing={4}
					justifyContent={"space-between"}
				>
					<Box
						sx={(theme) => ({
							flex: 1,
							display: "flex",
							justifyContent: "flex-start",
							marginRight: "auto",
							[theme.breakpoints.down("sm")]: {
								marginRight: "0",
								justifyContent: "center",
							},
						})}
					>
						<Stack
							justifyContent={"center"}
							spacing={2.5}
							alignItems={"center"}
						>
							<StyledContactUsIconButton
								onClick={() => {
									window.open(`mailto:${email}`, "_blank");
								}}
							>
								<EmailOutlinedIcon />
							</StyledContactUsIconButton>
							<StyledSubTitle>البريد الإلكتروني</StyledSubTitle>
							<Box>
								<StyledContactUsText
									component={"a"}
									href={`mailto:${email}`}
									target='_blank'
								>
									{email}
								</StyledContactUsText>
							</Box>
						</Stack>
					</Box>
					<Stack justifyContent={"center"} spacing={2.5} alignItems={"center"}>
						<StyledContactUsIconButton>
							<LocationOnIcon />
						</StyledContactUsIconButton>
						<StyledSubTitle>العنوان</StyledSubTitle>
						<StyledContactUsText>{address}</StyledContactUsText>
					</Stack>
					<Box
						sx={(theme) => ({
							flex: 1,
							display: "flex",
							justifyContent: "flex-end",
							marginLeft: "auto",
							[theme.breakpoints.down("sm")]: {
								marginLeft: "0",
								justifyContent: "center",
							},
						})}
					>
						<Stack
							spacing={2.5}
							justifyContent={"center"}
							alignItems={"center"}
							width={"auto"}
						>
							<StyledContactUsIconButton
								onClick={() => {
									window.open(`https://wa.me/${whatsappNumber}`, "_blank");
								}}
							>
								<WhatsAppIcon />
							</StyledContactUsIconButton>
							<StyledSubTitle>الواتساب</StyledSubTitle>
							<StyledContactUsText
								component={"a"}
								href={`https://wa.me/${whatsappNumber}`}
								target='_blank'
								rel='noopener noreferrer'
							>
								<span dir='ltr'>+{whatsappNumber}</span>
							</StyledContactUsText>
						</Stack>
					</Box>
				</Stack>
			</Box>
		</SectionTemplate>
	);
}
