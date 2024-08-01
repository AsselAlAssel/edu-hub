import { Box } from "@mui/material";
import { StyledSectionSubTitle, StyledSectionTitle } from "./Styled";

export default function AboutSection() {
	return (
		<Box
			sx={{
				my: 10,
			}}
			id='about'
		>
			<StyledSectionTitle>عن هذه المنصة</StyledSectionTitle>
			<StyledSectionSubTitle>
				منصة تعليمية تهدف إلى تسهيل عملية التعلم والتعليم في مادة الفيزياء
				للطلاب
			</StyledSectionSubTitle>
			{/* add some data here */}
		</Box>
	);
}
