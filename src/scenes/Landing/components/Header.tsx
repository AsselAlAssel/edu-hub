"use client";
import { Box, Button, Stack } from "@mui/material";
import Image from "next/image";
import { useRouter } from "nextjs-toploader/app";
import { StyledStack, StyledSubTitle, StyledTitle } from "./Styled";

const APP_BAR_HEIGHT = 72;
type HeaderProps = {
	headerTitle?: string;
	headerSubtitle?: string | null;
	headerImage?: string | null;
	isVideoExist: boolean;
};
export default function Header(props: HeaderProps) {
	const { headerTitle, headerSubtitle, headerImage } = props;
	const router = useRouter();
	return (
		<StyledStack
			sx={{
				height: `calc(100vh - ${APP_BAR_HEIGHT}px)`,
				minHeight: "540px",
				maxHeight: "900px",
				position: "relative",
				px: 3,
				backgroundImage:
					"linear-gradient(135deg, #006DB3 0%, #0094E8 40%, #005C94 100%)",
				overflow: "hidden",
				"&::before": {
					content: '""',
					position: "absolute",
					top: 0,
					right: 0,
					bottom: 0,
					left: 0,
					background:
						"radial-gradient(ellipse at 30% 20%, rgba(255,255,255,0.08) 0%, transparent 60%)",
					pointerEvents: "none",
				},
			}}
		>
			<Stack
				flexDirection={{
					xs: "column",
					sm: "row",
				}}
				justifyContent={"center"}
				alignItems={"center"}
				height={"100%"}
				maxWidth={"1200px"}
				margin={"auto"}
				sx={{ position: "relative", zIndex: 1 }}
			>
				<Stack direction={"row"} spacing={4} alignItems={"center"}>
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
									textAlign: headerImage ? "start" : "center",
									color: "primary.contrastText",
								}}
							>
								{headerTitle}
							</StyledTitle>
						</Box>
						{headerSubtitle && (
							<Box width={"100%"}>
								<StyledSubTitle
									sx={{
										color: "primary.contrastText",
										textAlign: headerImage ? "start" : "center",
										fontWeight: 500,
									}}
								>
									{headerSubtitle}
								</StyledSubTitle>
							</Box>
						)}

						<Button
							onClick={() => {
								router.push("/classes");
							}}
							size='large'
							sx={(theme) => ({
								alignSelf: headerImage ? "flex-start" : "center",
								backgroundColor: "primary.contrastText",
								color: "#0082D2",
								borderColor: "transparent",
								borderRadius: 2,
								fontWeight: 700,
								fontSize: "1.0625rem",
								px: 4,
								"&:hover": {
									backgroundColor: "rgba(255,255,255,0.92) !important",
									color: "#005991",
									boxShadow: "0 8px 24px rgba(0,0,0,0.15) !important",
								},
								[theme.breakpoints.down("sm")]: {
									width: "100%",
								},
							})}
						>
							تعرف على الصفوف
						</Button>
					</Stack>
					{headerImage && (
						<Box
							sx={{
								display: {
									xs: "none",
									sm: "block",
								},
								maxWidth: "560px",
								width: "100%",
								flexShrink: 0,
							}}
						>
							<Image
								src={headerImage}
								alt='landing-header'
								layout='responsive'
								width={560}
								height={320}
								style={{
									width: "100%",
									height: "100%",
									maxHeight: "340px",
									maxWidth: "560px",
									transition: "transform 0.5s ease",
									position: "relative",
									borderRadius: "12px",
								}}
							/>
						</Box>
					)}
				</Stack>
			</Stack>
		</StyledStack>
	);
}
