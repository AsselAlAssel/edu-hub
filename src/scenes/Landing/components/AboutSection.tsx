import { Box, Stack } from "@mui/material";
import Image from "next/image";
import {
	StyledSectionSubTitle,
	StyledSectionTitle,
	StyledStack,
} from "./Styled";

export default function AboutSection(props: {
	aboutTitle?: string;
	aboutSubtitle?: string | null;
	aboutImage?: string | null;
}) {
	const { aboutTitle, aboutSubtitle, aboutImage } = props;
	return (
		<StyledStack
			id='about'
			sx={{
				position: "relative",
				px: 3,
				background:
					"linear-gradient(135deg, #0082D2 0%, #0094E8 50%, #005C94 100%)",
				overflow: "hidden",
			}}
		>
			<Image
				src={"/images/landing/half-circle1.svg"}
				alt=''
				width={129}
				height={235}
				style={{
					position: "absolute",
					top: "0",
					right: "0",
					zIndex: 0,
					opacity: 0.4,
				}}
			/>
			<Image
				src={"/images/landing/half-circle2.svg"}
				alt=''
				width={129}
				height={235}
				style={{
					position: "absolute",
					bottom: "0",
					left: "0",
					zIndex: 0,
					opacity: 0.4,
				}}
			/>
			<Stack
				flexDirection={"column"}
				justifyContent={"center"}
				alignItems={"center"}
				height={"100%"}
				maxWidth={"1100px"}
				margin={"auto"}
				spacing={4}
				sx={{ position: "relative", zIndex: 1 }}
			>
				<Box>
					<StyledSectionTitle>{aboutTitle}</StyledSectionTitle>
					<StyledSectionSubTitle>{aboutSubtitle}</StyledSectionSubTitle>
				</Box>
				{aboutImage && (
					<Box
						sx={{
							maxWidth: "420px",
							maxHeight: "320px",
							borderRadius: 3,
							overflow: "hidden",
							boxShadow: "0 12px 40px rgba(0,0,0,0.2)",
						}}
					>
						<Image
							src={aboutImage}
							alt='About'
							layout='responsive'
							width={420}
							height={320}
							style={{
								maxWidth: "420px",
								maxHeight: "320px",
								objectFit: "cover",
								width: "100%",
								height: "100%",
								position: "relative",
								zIndex: 1,
							}}
						/>
					</Box>
				)}
			</Stack>
		</StyledStack>
	);
}
