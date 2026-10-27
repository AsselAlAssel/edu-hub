"use client";
import AppDialog from "@/components/ui/AppDialog";
import {
	GhostButton,
	IconAction,
	SecondaryButton,
} from "@/components/ui/buttons";
import FormField from "@/components/ui/FormField";
import { getErrorMessage } from "@/libs/errors";
import { uploadToStorage } from "@/services/upload.service";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import AddPhotoAlternateOutlinedIcon from "@mui/icons-material/AddPhotoAlternateOutlined";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import LoadingButton from "@mui/lab/LoadingButton";
import { Autocomplete, Box, InputLabel, Radio, Stack } from "@mui/material";
import { alpha } from "@mui/material/styles";
import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { LETTERS, type Question } from "./api";

const MIN_OPTIONS = 2;

export default function QuestionDialog({
	question,
	defaultLesson,
	lessons,
	onClose,
	onSaved,
}: {
	/** null = a new question. */
	question: Question | null;
	defaultLesson?: string;
	lessons: string[];
	onClose: () => void;
	onSaved: () => void;
}) {
	const [lesson, setLesson] = useState(question?.lesson ?? defaultLesson ?? "");
	const [text, setText] = useState(question?.text ?? "");
	const [source, setSource] = useState(question?.source ?? "");
	const [image, setImage] = useState(question?.image ?? "");
	const [options, setOptions] = useState(question?.options ?? ["", "", "", ""]);
	const [correctIndex, setCorrectIndex] = useState(question?.correctIndex ?? 0);
	const [uploading, setUploading] = useState(false);
	const [saving, setSaving] = useState(false);
	const busy = uploading || saving;

	const upload = async (file?: File) => {
		if (!file) return;
		setUploading(true);
		try {
			setImage(await uploadToStorage(file, "image"));
		} catch (err) {
			toast.error(getErrorMessage(err, "فشل رفع الصورة"));
		} finally {
			setUploading(false);
		}
	};

	const removeOption = (i: number) => {
		setOptions(options.filter((_, j) => j !== i));
		if (correctIndex === i) setCorrectIndex(0);
		else if (correctIndex > i) setCorrectIndex(correctIndex - 1);
	};

	const save = async () => {
		setSaving(true);
		try {
			const body = { lesson, text, source, image, options, correctIndex };
			if (question)
				await axios.patch(`/api/exams/questions/${question.id}`, body);
			else await axios.post("/api/exams/questions", body);
			toast.success(question ? "تم تعديل السؤال" : "تمت إضافة السؤال");
			onSaved();
		} catch (err) {
			toast.error(getErrorMessage(err, "تعذّر حفظ السؤال"));
		} finally {
			setSaving(false);
		}
	};

	return (
		<AppDialog
			open
			onClose={onClose}
			busy={busy}
			maxWidth='md'
			title={question ? "تعديل سؤال" : "سؤال جديد"}
			onSubmit={() => void save()}
			actions={
				<>
					<SecondaryButton onClick={onClose} disabled={busy}>
						إلغاء
					</SecondaryButton>
					<LoadingButton
						type='submit'
						variant='contained'
						loading={saving}
						disabled={uploading}
					>
						حفظ السؤال
					</LoadingButton>
				</>
			}
		>
			<Stack spacing={2.5}>
				<Autocomplete
					freeSolo
					options={lessons}
					inputValue={lesson}
					onInputChange={(_, value) => setLesson(value)}
					renderInput={(params) => (
						<FormField
							{...params}
							label='الدرس'
							required
							helperText='اختر درساً موجوداً أو اكتب اسم درس جديد'
						/>
					)}
				/>
				<FormField
					label='نص السؤال'
					required
					multiline
					minRows={3}
					value={text}
					onChange={(e) => setText(e.target.value)}
				/>

				<Box>
					<InputLabel>رسم السؤال (اختياري)</InputLabel>
					{image ? (
						<Stack direction='row' alignItems='flex-start' gap={1}>
							<Box
								component='img'
								src={image}
								alt='رسم السؤال'
								sx={{
									maxWidth: "100%",
									maxHeight: 220,
									borderRadius: 2,
									border: 1,
									borderColor: "divider",
									bgcolor: "common.white",
								}}
							/>
							<IconAction
								label='إزالة الرسم'
								onClick={() => setImage("")}
								disabled={busy}
								sx={{ color: "error.main" }}
							>
								<DeleteOutlineRoundedIcon />
							</IconAction>
						</Stack>
					) : (
						<LoadingButton
							component='label'
							variant='outlined'
							loading={uploading}
							startIcon={<AddPhotoAlternateOutlinedIcon />}
						>
							رفع صورة
							<input
								hidden
								type='file'
								accept='image/png,image/jpeg,image/webp,image/gif'
								onChange={(e) => void upload(e.target.files?.[0])}
							/>
						</LoadingButton>
					)}
				</Box>

				<Box>
					<InputLabel required>الخيارات — حدّد الإجابة الصحيحة</InputLabel>
					<Stack spacing={1} role='radiogroup' aria-label='الإجابة الصحيحة'>
						{options.map((option, i) => {
							const correct = correctIndex === i;
							return (
								<Stack
									key={i}
									direction='row'
									alignItems='center'
									gap={1}
									sx={(theme) => ({
										p: 0.5,
										pe: 1,
										borderRadius: 2,
										border: 1,
										borderColor: correct ? "success.main" : "transparent",
										bgcolor: correct
											? alpha(theme.palette.success.main, 0.08)
											: "transparent",
									})}
								>
									<Radio
										color='success'
										checked={correct}
										onChange={() => setCorrectIndex(i)}
										inputProps={{
											"aria-label": `الخيار ${LETTERS[i]} هو الصحيح`,
										}}
									/>
									<FormField
										size='small'
										placeholder={`الخيار ${LETTERS[i]}`}
										inputProps={{ "aria-label": `نص الخيار ${LETTERS[i]}` }}
										value={option}
										onChange={(e) =>
											setOptions(
												options.map((o, j) => (j === i ? e.target.value : o))
											)
										}
									/>
									<IconAction
										label={`حذف الخيار ${LETTERS[i]}`}
										disabled={options.length <= MIN_OPTIONS}
										onClick={() => removeOption(i)}
										sx={{ color: "error.main" }}
									>
										<CloseRoundedIcon />
									</IconAction>
								</Stack>
							);
						})}
					</Stack>
					{options.length < LETTERS.length ? (
						<GhostButton
							startIcon={<AddRoundedIcon />}
							onClick={() => setOptions([...options, ""])}
							sx={{ mt: 1 }}
						>
							إضافة خيار
						</GhostButton>
					) : null}
				</Box>

				<FormField
					label='المصدر (اختياري)'
					placeholder='مثال: وزاري 2021 – الدورة الأولى'
					value={source}
					onChange={(e) => setSource(e.target.value)}
				/>
			</Stack>
		</AppDialog>
	);
}
