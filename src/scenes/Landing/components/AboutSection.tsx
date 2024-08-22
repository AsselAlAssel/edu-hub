import { Box, Stack } from "@mui/material";
import Image from "next/image";
import { StyledSectionSubTitle, StyledSectionTitle } from "./Styled";

export default function AboutSection(props: {
	aboutTitle?: string;
	aboutSubtitle?: string | null;
	aboutImage?: string | null;
}) {
	const { aboutTitle, aboutSubtitle, aboutImage } = props;
	return (
		<Stack
			direction={{
				xs: "column",
				sm: "row",
			}}
			justifyContent={"space-between"}
			alignItems={"center"}
			gap={5}
			pt={11}
			id='about'
		>
			<Box>
				<StyledSectionTitle> {aboutTitle} </StyledSectionTitle>
				<StyledSectionSubTitle>{aboutSubtitle}</StyledSectionSubTitle>
			</Box>
			{aboutImage && (
				<Box>
					<Image
						src={aboutImage}
						alt='About'
						layout='responsive'
						width={500}
						height={500}
					/>
				</Box>
			)}
		</Stack>
	);
}
