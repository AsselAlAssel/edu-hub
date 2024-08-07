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

export default function ContactUs() {
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
					<Stack justifyContent={"center"} spacing={2.5} alignItems={"center"}>
						<StyledContactUsIconButton
							onClick={() => {
								window.open("mailto:info@edentist.ai", "_blank");
							}}
						>
							<EmailOutlinedIcon />
						</StyledContactUsIconButton>
						<StyledSubTitle>البريد الإلكتروني</StyledSubTitle>
						<Box>
							<StyledContactUsText
								component={"a"}
								href={"mailto:info@edentist.ai"}
							>
								info@edentist.ai
							</StyledContactUsText>
						</Box>
					</Stack>
					<Stack justifyContent={"center"} spacing={2.5} alignItems={"center"}>
						<StyledContactUsIconButton>
							<LocationOnIcon />
						</StyledContactUsIconButton>
						<StyledSubTitle>العنوان</StyledSubTitle>
						<StyledContactUsText>نابلس، فلسطين</StyledContactUsText>
					</Stack>
					<Stack justifyContent={"center"} spacing={2.5} alignItems={"center"}>
						<StyledContactUsIconButton
							onClick={() => {
								window.open(`https://wa.me/97334384057`, "_blank");
							}}
						>
							<WhatsAppIcon />
						</StyledContactUsIconButton>
						<StyledSubTitle>الواتساب</StyledSubTitle>
						<StyledContactUsText
							component={"a"}
							href={`https://wa.me/97334384057`}
							target='_blank'
							rel='noopener noreferrer'
						>
							<span dir='ltr'>+973 343 840 57</span>
						</StyledContactUsText>
					</Stack>
				</Stack>
			</Box>
		</SectionTemplate>
	);
}
