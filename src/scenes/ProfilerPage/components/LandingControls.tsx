"use client";
import { GhostButton } from "@/components/ui/buttons";
import { FormField } from "@/components/ui/FormField";
import Surface from "@/components/ui/Surface";
import { useUpdateLandingPage } from "@/hooks/useLandingApis";
import { getYouTubeVideoID } from "@/libs/constant";
import { getErrorMessage } from "@/libs/errors";
import LoadingButton from "@mui/lab/LoadingButton";
import { Box, Stack, Tab, Tabs, Typography } from "@mui/material";
import type { LandingPage } from "@prisma/client";
import { useId, useState, type ReactNode } from "react";
import { Controller, useForm, type Control } from "react-hook-form";
import toast from "react-hot-toast";
import ImageInput from "./ImageInput";
import PreviewLandingPage from "./PreviewLandingPage";

export type LandingFormValues = {
	headerTitle: string;
	headerSubtitle: string;
	headerImage: string;
	landingVideo: string;
	aboutTitle: string;
	aboutSubtitle: string;
	aboutImage: string;
	whatsAppNumber: string;
	address: string;
	email: string;
};

export const toFormValues = (data: LandingPage | null): LandingFormValues => ({
	headerTitle: data?.headerTitle ?? "",
	headerSubtitle: data?.headerSubtitle ?? "",
	headerImage: data?.headerImage ?? "",
	landingVideo: data?.landingVideo ?? "",
	aboutTitle: data?.aboutTitle ?? "",
	aboutSubtitle: data?.aboutSubtitle ?? "",
	aboutImage: data?.aboutImage ?? "",
	whatsAppNumber: data?.whatsAppNumber ?? "",
	address: data?.address ?? "",
	email: data?.email ?? "",
});

const required = (label: string) => (value: string) =>
	!!value.trim() || `${label} مطلوب`;

function FormSection({
	title,
	description,
	children,
}: {
	title: string;
	description?: string;
	children: ReactNode;
}) {
	const id = useId();
	return (
		<Surface
			component='section'
			aria-labelledby={id}
			variant='secondary'
			sx={{ p: { xs: 2.5, md: 3 }, boxShadow: "none" }}
		>
			<Typography id={id} variant='h5' component='h2'>
				{title}
			</Typography>
			{description ? (
				<Typography variant='body2' sx={{ color: "text.secondary", mt: 0.5 }}>
					{description}
				</Typography>
			) : null}
			<Stack spacing={2.5} sx={{ mt: 2.5 }}>
				{children}
			</Stack>
		</Surface>
	);
}

function TextInput({
	control,
	name,
	label,
	rules,
	...props
}: {
	control: Control<LandingFormValues>;
	name: keyof LandingFormValues;
	label: string;
	rules?: Parameters<typeof Controller<LandingFormValues>>[0]["rules"];
} & Omit<React.ComponentProps<typeof FormField>, "name">) {
	return (
		<Controller
			name={name}
			control={control}
			rules={rules}
			render={({ field, fieldState: { error } }) => (
				<FormField
					{...field}
					{...props}
					label={label}
					error={!!error}
					helperText={error?.message ?? props.helperText}
				/>
			)}
		/>
	);
}

/** Landing page CMS: edit + live preview, validated before saving. */
export default function LandingControls({
	landingData,
}: {
	landingData: LandingPage | null;
}) {
	const [tab, setTab] = useState<"edit" | "preview">("edit");
	const {
		control,
		handleSubmit,
		setValue,
		watch,
		getValues,
		reset,
		formState,
	} = useForm<LandingFormValues>({
		defaultValues: toFormValues(landingData),
		mode: "onTouched",
	});
	const { isUpdating, updateLandingPage } = useUpdateLandingPage();

	const save = handleSubmit(
		async (values) => {
			try {
				const saved = (await updateLandingPage({
					...values,
					landingVideoId: getYouTubeVideoID(values.landingVideo) ?? undefined,
				})) as LandingPage;
				reset(toFormValues(saved));
				toast.success("تم حفظ الصفحة الرئيسية");
			} catch (error) {
				toast.error(getErrorMessage(error, "تعذّر حفظ التغييرات"));
			}
		},
		() => {
			setTab("edit");
			toast.error("راجع الحقول المطلوبة قبل الحفظ");
		}
	);

	return (
		<Stack spacing={3} sx={{ minWidth: 0, flex: 1 }}>
			<Tabs
				value={tab}
				onChange={(_, value) => setTab(value)}
				aria-label='وضع المحرر'
			>
				<Tab
					label='تعديل'
					value='edit'
					id='cms-tab-edit'
					aria-controls='cms-panel-edit'
				/>
				<Tab
					label='معاينة'
					value='preview'
					id='cms-tab-preview'
					aria-controls='cms-panel-preview'
				/>
			</Tabs>

			<Box
				role='tabpanel'
				id='cms-panel-preview'
				aria-labelledby='cms-tab-preview'
				hidden={tab !== "preview"}
			>
				{tab === "preview" ? <PreviewLandingPage data={getValues()} /> : null}
			</Box>

			<Box
				component='form'
				noValidate
				onSubmit={(event) => {
					event.preventDefault();
					void save();
				}}
				role='tabpanel'
				id='cms-panel-edit'
				aria-labelledby='cms-tab-edit'
				hidden={tab !== "edit"}
			>
				<Stack spacing={3}>
					<FormSection
						title='القسم الرئيسي'
						description='أول ما يراه الزائر: العنوان، الوصف والصورة.'
					>
						<TextInput
							control={control}
							name='headerTitle'
							label='العنوان الرئيسي'
							required
							rules={{ validate: required("العنوان الرئيسي") }}
						/>
						<TextInput
							control={control}
							name='headerSubtitle'
							label='الوصف'
							multiline
							minRows={3}
						/>
						<ImageInput
							inputLabel='صورة القسم الرئيسي'
							imageSrc={watch("headerImage") || null}
							onChangeImage={(url) =>
								setValue("headerImage", url ?? "", { shouldDirty: true })
							}
						/>
					</FormSection>

					<FormSection
						title='الفيديو التعريفي'
						description='اختياري. اتركه فارغاً لإخفاء قسم الفيديو.'
					>
						<TextInput
							control={control}
							name='landingVideo'
							label='رابط يوتيوب'
							type='url'
							placeholder='https://www.youtube.com/watch?v=…'
							inputProps={{ dir: "ltr" }}
							rules={{
								validate: (value: string) =>
									!value.trim() ||
									!!getYouTubeVideoID(value.trim()) ||
									"أدخل رابط فيديو صالحاً من يوتيوب",
							}}
						/>
					</FormSection>

					<FormSection title='قسم «عن المنصة»'>
						<TextInput
							control={control}
							name='aboutTitle'
							label='العنوان'
							required
							rules={{ validate: required("العنوان") }}
						/>
						<TextInput
							control={control}
							name='aboutSubtitle'
							label='النص التعريفي'
							multiline
							minRows={4}
						/>
						<ImageInput
							inputLabel='صورة القسم'
							imageSrc={watch("aboutImage") || null}
							onChangeImage={(url) =>
								setValue("aboutImage", url ?? "", { shouldDirty: true })
							}
						/>
					</FormSection>

					<FormSection title='بيانات التواصل'>
						<TextInput
							control={control}
							name='email'
							label='البريد الإلكتروني'
							type='email'
							autoComplete='email'
							required
							inputProps={{ dir: "ltr" }}
							rules={{
								validate: (value: string) =>
									!value.trim()
										? "البريد الإلكتروني مطلوب"
										: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim()) ||
											"أدخل بريداً إلكترونياً صالحاً",
							}}
						/>
						<TextInput
							control={control}
							name='whatsAppNumber'
							label='رقم واتساب'
							type='tel'
							inputMode='tel'
							required
							helperText='بالصيغة الدولية بدون + أو أصفار بادئة، مثال: 972597408236'
							inputProps={{ dir: "ltr" }}
							rules={{
								validate: (value: string) =>
									/^\d{6,15}$/.test(value.replace(/[\s+-]/g, "")) ||
									"أدخل رقماً صالحاً (6–15 رقماً)",
							}}
						/>
						<TextInput
							control={control}
							name='address'
							label='العنوان'
							required
							rules={{ validate: required("العنوان") }}
						/>
					</FormSection>
				</Stack>

				<Surface
					variant='elevated'
					sx={{
						position: "sticky",
						bottom: 16,
						mt: 3,
						p: 1.5,
						px: 2,
						display: "flex",
						alignItems: "center",
						justifyContent: "space-between",
						gap: 2,
						zIndex: 5,
					}}
				>
					<Typography
						variant='body2'
						role='status'
						sx={{
							color: formState.isDirty ? "warning.main" : "text.secondary",
							fontWeight: 700,
						}}
					>
						{formState.isDirty
							? "لديك تغييرات غير محفوظة"
							: "كل التغييرات محفوظة"}
					</Typography>
					<Stack direction='row' gap={1}>
						<GhostButton
							disabled={!formState.isDirty || isUpdating}
							onClick={() => reset()}
						>
							تراجع
						</GhostButton>
						<LoadingButton
							type='submit'
							variant='contained'
							loading={isUpdating}
							disabled={!formState.isDirty}
						>
							حفظ التغييرات
						</LoadingButton>
					</Stack>
				</Surface>
			</Box>
		</Stack>
	);
}
