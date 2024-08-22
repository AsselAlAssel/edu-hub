"use client";
import KeyboardDoubleArrowDownIcon from "@mui/icons-material/KeyboardDoubleArrowDown";
import { Box, Button, Stack } from "@mui/material";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { StyledStack, StyledSubTitle, StyledTitle } from "./Styled";

const APP_BAR_HEIGHT = 80;
type HeaderProps = {
	headerTitle?: string;
	headerSubtitle?: string | null;
	headerImage?: string | null;
	isVideoExist: boolean;
};
export default function Header(props: HeaderProps) {
	const { headerTitle, headerSubtitle, headerImage, isVideoExist } = props;
	const router = useRouter();
	console.log("headerImage", !!headerImage);
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
					alignItems={
						!headerImage
							? { xs: "center", sm: "flex-start" }
							: { xs: "center", sm: "center" }
					}
				>
					<Box width={"100%"}>
						<StyledTitle
							sx={{
								textAlign: headerImage ? "left" : "center",
							}}
						>
							{headerTitle}
						</StyledTitle>
					</Box>
					<Box width={"100%"}>
						<StyledSubTitle
							sx={{
								color: "text.primary",
								textAlign: headerImage ? "left" : "center",
							}}
						>
							{headerSubtitle}
						</StyledSubTitle>
					</Box>

					<Button
						onClick={() => {
							if (isVideoExist) {
								router.push("/#video");
								return;
							}
							router.push("/classes");
						}}
						sx={{
							alignSelf: headerImage ? "flex-start" : "center",
						}}
					>
						{isVideoExist ? "شاهد الفيديو التعريفي" : "تعرف على الصفوف"}
					</Button>
				</Stack>
				{headerImage && (
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
							src={headerImage}
							alt='landing-header'
							layout='responsive'
							width={500}
							height={500}
							style={{
								width: "100%",
								height: "100%",
								transition: "all 0.5s",
								position: "relative",
								animation: "landingImgUpAndDown 5s linear infinite",
							}}
						/>
					</Box>
				)}
			</Stack>
			{isVideoExist && (
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
			)}
		</StyledStack>
	);
}
