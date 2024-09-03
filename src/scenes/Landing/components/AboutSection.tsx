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
				px: 2,
				background: "rgba(0, 130, 210, 1)",
			}}
		>
			<Image
				src={"/images/landing/half-circle1.svg"}
				alt='Half Circle'
				width={129}
				height={235}
				style={{
					position: "absolute",
					top: "0",
					right: "0",
					zIndex: 0,
				}}
			/>
			<Image
				src={"/images/landing/half-circle2.svg"}
				alt='Half Circle'
				width={129}
				height={235}
				style={{
					position: "absolute",
					bottom: "0",
					left: "0",
					zIndex: 0,
				}}
			/>
			<Stack
				flexDirection={"column"}
				justifyContent={"center"}
				alignItems={"center"}
				height={"100%"}
				maxWidth={"1200px"}
				margin={"auto"}
				spacing={3}
			>
				<Box>
					<StyledSectionTitle> {aboutTitle} </StyledSectionTitle>
					<StyledSectionSubTitle>{aboutSubtitle}</StyledSectionSubTitle>
				</Box>
				{aboutImage && (
					<Box
						sx={{
							maxWidth: "400px",
							maxHeight: "300px",
						}}
					>
						<Image
							src={aboutImage}
							alt='About'
							layout='responsive'
							width={400}
							height={300}
							style={{
								maxWidth: "400",
								maxHeight: "300",
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
