"use client";
/* eslint-disable */
import CustomTextField from "@/components/CustomTextField";
import { useUpdateLandingPage } from "@/hooks/useLandingApis";
import {
	getYouTubeVideoID,
	isYouTubeVideo,
	youtubeRegex,
} from "@/libs/constant";
import LoadingButton from "@mui/lab/LoadingButton";
import { alpha, Box, Stack, Tab, Tabs, Typography } from "@mui/material";
import type { Theme } from "@mui/material/styles";
import { LandingPage } from "@prisma/client";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import ImageInput from "./ImageInput";
import PreviewLandingPage from "./PreviewLandingPage";
type LandingControlsProps = {
	landingData: LandingPage | null;
};
type formDataType = {
	headerTitle: string;
	headerSubtitle: string | null;
	headerImage: string | null;
	landingVideo: string | null;
	landingVideoId: string | null;
	aboutTitle: string;
	aboutSubtitle: string;
	aboutImage: string | null;
	whatsAppNumber: string;
	address: string;
	email: string;
};

const defaultValues = {
	headerTitle: "",
	headerSubtitle: "",
	headerImage: "",
	landingVideo: "",
	landingVideoId: "",
	aboutTitle: "",
	aboutSubtitle: "",
	aboutImage: "",
	whatsAppNumber: "",
	address: "",
	email: "",
};
enum TabValue {
	preview = "preview",
	edit = "edit",
}

const formSectionSx = (theme: Theme) => ({
	p: 3,
	borderRadius: "12px",
	border: "1px solid",
	borderColor:
		theme.palette.mode === "light"
			? theme.palette.border.secondary
			: theme.palette.divider,
	/* فاتح: خلفية مميزة عن البطاقة البيضاء — دارك: طبقة شفافة */
	backgroundColor:
		theme.palette.mode === "dark"
			? alpha(theme.palette.common.white, 0.05)
			: theme.palette.background["brand-section"],
});

export default function LandingControls(props: LandingControlsProps) {
	const { landingData } = props;
	const [selectedTab, setSelectedTab] = React.useState<TabValue>(TabValue.edit);

	const {
		control,
		handleSubmit,
		setError,
		clearErrors,
		setValue,
		watch,
		getValues,
	} = useForm<formDataType>({
		defaultValues: landingData
			? {
					headerTitle: landingData.headerTitle,
					headerSubtitle: landingData.headerSubtitle,
					headerImage: landingData.headerImage,
					landingVideo: landingData.landingVideo,
					landingVideoId: landingData.landingVideoId,
					aboutTitle: landingData.aboutTitle,
					aboutSubtitle: landingData.aboutSubtitle ?? undefined,
					aboutImage: landingData.aboutImage,
					whatsAppNumber: landingData.whatsAppNumber,
					address: landingData.address,
					email: landingData.email,
				}
			: defaultValues,
	});
	const { isUpdating, updateLandingPage } = useUpdateLandingPage();

	const submitForm = () => {
		handleSubmit(async (data) => {
			await updateLandingPage({
				headerTitle: data.headerTitle,
				headerSubtitle: data.headerSubtitle ?? undefined,
				headerImage: data.headerImage ?? undefined,
				landingVideo: data.landingVideo ?? undefined,
				landingVideoId: data.landingVideoId ?? undefined,
				aboutTitle: data.aboutTitle,
				aboutSubtitle: data.aboutSubtitle,
				aboutImage: data.aboutImage ?? undefined,
				whatsAppNumber: data.whatsAppNumber,
				address: data.address,
				email: data.email,
			});
			toast.success("تم تحديث الصفحة الرئيسية بنجاح");
		})();
	};

	return (
		<Stack
			spacing={3}
			flex={1}
			sx={(theme) => ({
				backgroundColor: theme.palette.background.paper,
				borderRadius: "16px",
				border: "1px solid",
				borderColor:
					theme.palette.mode === "light"
						? theme.palette.border.main
						: theme.palette.divider,
				boxShadow:
					theme.palette.mode === "dark"
						? `0 8px 28px ${alpha("#000", 0.35)}`
						: `0 1px 2px ${alpha("#0F172A", 0.05)}, 0 8px 24px ${alpha("#0F172A", 0.06)}`,
				p: { xs: 3, md: 4 },
			})}
		>
			<Typography
				variant='h5'
				textAlign='center'
				fontWeight={700}
				sx={(theme) => ({ color: theme.palette.text.primary })}
			>
				لوحة التحكم في الصفحة الرئيسية
			</Typography>
			<Tabs
				value={selectedTab}
				onChange={(e, newValue) => setSelectedTab(newValue)}
				textColor='primary'
				indicatorColor='primary'
				sx={(theme) => ({
					alignSelf: "center",
					"& .MuiTabs-flexContainer": {
						gap: 1,
					},
					"& .MuiTab-root": {
						color: theme.palette.text.secondary,
						fontWeight: 600,
					},
					"& .Mui-selected": {
						color: theme.palette.primary.main,
					},
				})}
			>
				<Tab label='معاينة' value={TabValue.preview} />
				<Tab label='تعديل' value={TabValue.edit} />
			</Tabs>
			{selectedTab === TabValue.preview ? (
				<PreviewLandingPage data={getValues()} />
			) : (
				<form>
					<Stack spacing={5}>
						<Stack spacing={2.5} sx={(theme) => formSectionSx(theme)}>
							<Typography
								variant='h6'
								fontWeight={700}
								sx={(theme) => ({ color: theme.palette.text.primary })}
							>
								القسم العلوي
							</Typography>
							<Controller
								name='headerTitle'
								control={control}
								rules={{ required: "هذا الحقل مطلوب" }}
								render={({ field, fieldState: { error } }) => (
									<CustomTextField
										label='عنوان القسم'
										fullWidth
										{...field}
										error={!!error}
										helperText={error?.message}
									/>
								)}
							/>
							<Controller
								name='headerSubtitle'
								control={control}
								render={({ field }) => (
									<CustomTextField
										label='العنوان الفرعي'
										fullWidth
										{...field}
										multiline
										minRows={3}
										maxRows={3}
									/>
								)}
							/>
							<Box>
								<ImageInput
									onChangeImage={(url) => {
										setValue("headerImage", url);
									}}
									imageSrc={watch("headerImage")}
									inputLabel='صورة القسم'
								/>
							</Box>
						</Stack>
						<Stack spacing={2.5} sx={(theme) => formSectionSx(theme)}>
							<Typography
								variant='h6'
								fontWeight={700}
								sx={(theme) => ({ color: theme.palette.text.primary })}
							>
								قسم الفيديو التعريفي
							</Typography>
							<Controller
								name='landingVideo'
								control={control}
								rules={{
									pattern: {
										value: youtubeRegex,
										message: "يجب ادخال رابط يوتيوب",
									},
								}}
								render={({ field, fieldState: { error } }) => (
									<CustomTextField
										label='رابط الفيديو'
										fullWidth
										{...field}
										error={!!error}
										helperText={error?.message}
										onBlur={(e) => {
											const url = e.target.value.trim() as string;
											if (!url) {
												return;
											}
											if (!isYouTubeVideo(url)) {
												setError("landingVideo", {
													message: "يجب ادخال رابط يوتيوب",
												});
												return;
											}
											clearErrors("landingVideo");
											const videoId = getYouTubeVideoID(url) as string;
											setValue("landingVideoId", videoId);
											field.onChange(url);
										}}
									/>
								)}
							/>
						</Stack>

						<Stack spacing={2.5} sx={(theme) => formSectionSx(theme)}>
							<Typography
								variant='h6'
								fontWeight={700}
								sx={(theme) => ({ color: theme.palette.text.primary })}
							>
								قسم عن المنصة
							</Typography>
							<Controller
								name='aboutTitle'
								control={control}
								rules={{ required: "هذا الحقل مطلوب" }}
								render={({ field, fieldState: { error } }) => (
									<CustomTextField
										label='عنوان القسم'
										fullWidth
										{...field}
										error={!!error}
										helperText={error?.message}
									/>
								)}
							/>
							<Controller
								name='aboutSubtitle'
								control={control}
								rules={{ required: "هذا الحقل مطلوب" }}
								render={({ field, fieldState: { error } }) => (
									<CustomTextField
										label='العنوان الفرعي'
										fullWidth
										{...field}
										error={!!error}
										helperText={error?.message}
										multiline
										minRows={3}
										maxRows={3}
									/>
								)}
							/>
							<Box>
								<ImageInput
									onChangeImage={(url) => {
										setValue("aboutImage", url);
									}}
									imageSrc={watch("aboutImage")}
									inputLabel='صورة القسم'
								/>
							</Box>
						</Stack>
						<Stack spacing={2.5} sx={(theme) => formSectionSx(theme)}>
							<Typography
								variant='h6'
								fontWeight={700}
								sx={(theme) => ({ color: theme.palette.text.primary })}
							>
								بيانات التواصل
							</Typography>
							<Controller
								name='whatsAppNumber'
								control={control}
								rules={{ required: "هذا الحقل مطلوب" }}
								render={({ field, fieldState: { error } }) => (
									<CustomTextField
										label='رقم الواتساب'
										fullWidth
										{...field}
										error={!!error}
										helperText={error?.message}
									/>
								)}
							/>
							<Controller
								name='address'
								control={control}
								rules={{ required: "هذا الحقل مطلوب" }}
								render={({ field, fieldState: { error } }) => (
									<CustomTextField
										label='العنوان'
										fullWidth
										{...field}
										error={!!error}
										helperText={error?.message}
									/>
								)}
							/>
							<Controller
								name='email'
								control={control}
								rules={{ required: "هذا الحقل مطلوب" }}
								render={({ field, fieldState: { error } }) => (
									<CustomTextField
										label='البريد الإلكتروني'
										fullWidth
										{...field}
										error={!!error}
										helperText={error?.message}
									/>
								)}
							/>
						</Stack>

						<Stack spacing={2} direction={"row"} justifyContent='flex-end'>
							<LoadingButton
								variant='contained'
								color='primary'
								sx={{
									width: "auto",
									px: 5,
									borderRadius: "10px",
								}}
								onClick={submitForm}
								loading={isUpdating}
							>
								حفظ
							</LoadingButton>
						</Stack>
					</Stack>
				</form>
			)}
		</Stack>
	);
}
