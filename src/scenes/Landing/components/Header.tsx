"use client";
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
	const { headerTitle, headerSubtitle, headerImage } = props;
	const router = useRouter();
	return (
		<StyledStack
			sx={{
				height: `calc(100vh - ${APP_BAR_HEIGHT}px)`,
				position: "relative",
				px: 2,
				backgroundImage:
					"linear-gradient(68.51deg, #00A5FF 0%, rgba(5, 138, 210, 0.7) 46.8%, #005C94 100%)",
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
				maxWidth={"1220px"}
				margin={"auto"}
			>
				<Stack direction={"row"} spacing={3} alignItems={"center"}>
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
									color: "primary.contrastText",
								}}
							>
								{headerTitle}
							</StyledTitle>
						</Box>
						<Box width={"100%"}>
							<StyledSubTitle
								sx={{
									color: "primary.contrastText",
									textAlign: headerImage ? "left" : "center",
									fontWeight: 600,
									lineHeight: "22px",
									fontSize: { xs: "16px", sm: "18px" },
								}}
							>
								{headerSubtitle}
							</StyledSubTitle>
						</Box>

						<Button
							onClick={() => {
								router.push("/classes");
							}}
							sx={(theme) => ({
								alignSelf: headerImage ? "flex-start" : "center",
								backgroundColor: "primary.contrastText",
								color: "rgba(0, 130, 210, 1)",
								borderRadius: 1.5,
								"&:hover": {
									backgroundColor: "rgba(0, 130, 210, 0.8)",
									color: "primary.contrastText",
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
									maxWidth: "600px",
									width: "100%",
								},
							}}
						>
							<Image
								src={headerImage}
								alt='landing-header'
								layout='responsive'
								width={600}
								height={320}
								style={{
									width: "100%",
									height: "100%",
									maxHeight: "320px",
									maxWidth: "600px",
									transition: "all 0.5s",
									position: "relative",
								}}
							/>
						</Box>
					)}
				</Stack>
			</Stack>
		</StyledStack>
	);
}
