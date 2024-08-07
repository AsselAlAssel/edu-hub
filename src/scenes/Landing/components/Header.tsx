"use client";
import KeyboardDoubleArrowDownIcon from "@mui/icons-material/KeyboardDoubleArrowDown";
import { Box, Button, Stack } from "@mui/material";
import Image from "next/image";
import { useRouter } from "next/navigation";
import LandingImageHeader from "../../../../public/images/landing/landing-header.jpg";
import { StyledStack, StyledSubTitle, StyledTitle } from "./Styled";

const APP_BAR_HEIGHT = 80;

export default function Header() {
	const router = useRouter();
	return (
		<StyledStack
			flexDirection={{
				xs: "column",
				sm: "row",
			}}
			justifyContent={"center"}
			alignItems={"center"}
			sx={{
				height: `calc(100vh - ${APP_BAR_HEIGHT}px - 40px)`,
				position: "relative",
				px: 2,
			}}
		>
			<Stack direction={"row"} spacing={1.5}>
				<Stack
					direction={"column"}
					spacing={3}
					alignItems={{ xs: "center", sm: "flex-start" }}
				>
					<Box>
						<StyledTitle>مرحبًا بكم في عالم الفيزياء</StyledTitle>
					</Box>
					<Box>
						<StyledSubTitle
							sx={{
								color: "text.primary",
							}}
						>
							اكتشف عالم الفيزياء من خلال دروس ومقاطع فيديو شاملة ومفيدة
							<br />
							للأستاذ محمد انور صبح
						</StyledSubTitle>
					</Box>
					<Button
						onClick={() => {
							router.push("/#video");
						}}
					>
						شاهد الفيديو التعريفي
					</Button>
				</Stack>
				<Box
					sx={{
						display: {
							xs: "none",
							sm: "block",
							maxWidth: "500px",
						},
					}}
				>
					<Image
						src={LandingImageHeader}
						alt='landing-header'
						style={{
							width: "100%",
							height: "100%",
							transition: "all 0.5s",
							position: "relative",
							animation: "landingImgUpAndDown 5s linear infinite",
						}}
					/>
				</Box>
			</Stack>
			<Box
				sx={{
					position: "absolute",
					bottom: 0,
					width: "100%",
					display: "flex",
					justifyContent: "center",
				}}
			>
				<KeyboardDoubleArrowDownIcon
					style={{
						fontSize: "50px",
						animation: "landingRowUpAndDown 1.5s linear infinite",
						cursor: "pointer",
					}}
					onClick={() => {
						router.push("/#video");
					}}
				/>
			</Box>
		</StyledStack>
	);
}
