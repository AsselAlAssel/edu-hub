import AudiotrackOutlinedIcon from "@mui/icons-material/AudiotrackOutlined";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import FolderZipOutlinedIcon from "@mui/icons-material/FolderZipOutlined";
import ImageOutlinedIcon from "@mui/icons-material/ImageOutlined";
import InsertDriveFileOutlinedIcon from "@mui/icons-material/InsertDriveFileOutlined";
import MovieOutlinedIcon from "@mui/icons-material/MovieOutlined";
import PictureAsPdfOutlinedIcon from "@mui/icons-material/PictureAsPdfOutlined";
import SlideshowOutlinedIcon from "@mui/icons-material/SlideshowOutlined";
import TableChartOutlinedIcon from "@mui/icons-material/TableChartOutlined";
import type { ReactNode } from "react";

type Tone = "primary" | "secondary" | "success" | "warning" | "error" | "info";

export type FileTypeInfo = { label: string; tone: Tone; icon: ReactNode };

const TYPES: Record<string, FileTypeInfo> = {
	pdf: { label: "ملف PDF", tone: "error", icon: <PictureAsPdfOutlinedIcon /> },
	doc: {
		label: "مستند Word",
		tone: "primary",
		icon: <DescriptionOutlinedIcon />,
	},
	docx: {
		label: "مستند Word",
		tone: "primary",
		icon: <DescriptionOutlinedIcon />,
	},
	txt: { label: "ملف نصي", tone: "primary", icon: <DescriptionOutlinedIcon /> },
	xls: {
		label: "جدول Excel",
		tone: "success",
		icon: <TableChartOutlinedIcon />,
	},
	xlsx: {
		label: "جدول Excel",
		tone: "success",
		icon: <TableChartOutlinedIcon />,
	},
	ppt: {
		label: "عرض تقديمي",
		tone: "warning",
		icon: <SlideshowOutlinedIcon />,
	},
	pptx: {
		label: "عرض تقديمي",
		tone: "warning",
		icon: <SlideshowOutlinedIcon />,
	},
	jpg: { label: "صورة", tone: "secondary", icon: <ImageOutlinedIcon /> },
	jpeg: { label: "صورة", tone: "secondary", icon: <ImageOutlinedIcon /> },
	png: { label: "صورة", tone: "secondary", icon: <ImageOutlinedIcon /> },
	gif: { label: "صورة", tone: "secondary", icon: <ImageOutlinedIcon /> },
	webp: { label: "صورة", tone: "secondary", icon: <ImageOutlinedIcon /> },
	mp3: { label: "ملف صوتي", tone: "info", icon: <AudiotrackOutlinedIcon /> },
	mp4: { label: "ملف فيديو", tone: "info", icon: <MovieOutlinedIcon /> },
	zip: { label: "ملف مضغوط", tone: "warning", icon: <FolderZipOutlinedIcon /> },
};

export function getFileTypeInfo(type: string): FileTypeInfo {
	return (
		TYPES[type.toLowerCase()] ?? {
			label: "ملف",
			tone: "primary",
			icon: <InsertDriveFileOutlinedIcon />,
		}
	);
}
