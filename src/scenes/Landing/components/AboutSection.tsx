import { Box, Stack } from "@mui/material";
import Image from "next/image";
import { StyledSectionSubTitle, StyledSectionTitle } from "./Styled";

export default function AboutSection() {
	return (
		<Stack
			direction={{
				xs: "column",
				sm: "row",
			}}
			justifyContent={"space-between"}
			alignItems={"center"}
			gap={5}
			py={15}
			id='about'
		>
			<Box>
				<StyledSectionTitle>عن هذه المنصة</StyledSectionTitle>
				<StyledSectionSubTitle>
					منصة تعليمية متكاملة تهدف إلى تسهيل عملية التعلم والتعليم في مادة
					الفيزياء للطلاب. توفر المنصة محتوى غني وشامل يشمل فيديوهات تعليمية،
					شروحات مفصلة، وملفات دراسية متنوعة. تم تصميم المنصة لتكون مصدرًا
					موثوقًا وفعالًا لدعم الطلاب في فهم المفاهيم الفيزيائية بطرق تفاعلية
					وممتعة. ستجد في المنصة موارد تعزز من تجربة التعلم وتساعدك في تحقيق
					أهدافك الدراسية بكفاءة.
				</StyledSectionSubTitle>
			</Box>
			<Box>
				<Image
					src={"/images/landing/landing-header.jpg"}
					alt='About'
					layout='responsive'
					width={500}
					height={500}
				/>
			</Box>
		</Stack>
	);
}
