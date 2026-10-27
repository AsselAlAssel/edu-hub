"use client";
import dynamic from "next/dynamic";
import Breadcrumb from "@/components/Breadcrumb/Breadcrumb";
import FolderExams from "./components/FolderExams";
import EmptyAddResources, {
	type AddKind,
} from "@/components/EmptyAddResources/EmptyAddResources";
import { PageHeader, PageShell } from "@/components/ui/PageShell";
import { EmptyState, ErrorState } from "@/components/ui/States";
import useProgress, { useWatchTracker } from "@/hooks/useProgress";
import { useResource } from "@/hooks/useResourceApi";
import useRole from "@/hooks/useRole";
import { SIGNIN_FILE_URL } from "@/libs/constant";
import {
	closestCenter,
	DndContext,
	KeyboardSensor,
	PointerSensor,
	pointerWithin,
	useSensor,
	useSensors,
	type Announcements,
	type CollisionDetection,
	type DragEndEvent,
	type DragOverEvent,
	type DragStartEvent,
} from "@dnd-kit/core";
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import CreateNewFolderOutlinedIcon from "@mui/icons-material/CreateNewFolderOutlined";
import InboxOutlinedIcon from "@mui/icons-material/InboxOutlined";
import SmartDisplayOutlinedIcon from "@mui/icons-material/SmartDisplayOutlined";
import UploadFileOutlinedIcon from "@mui/icons-material/UploadFileOutlined";
import { Button, ListItemIcon, Menu, MenuItem, Stack } from "@mui/material";
import type { ResourceVideo } from "@/libs/class";
import type { Folder, Video } from "@prisma/client";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import FilesSection from "./components/FilesSection";
import FolderSection from "./components/FolderSection";
import VideosSection from "./components/VideosSection";
import {
	getItemKind,
	kindLabel,
	resolveDrop,
	type ResourceData,
	type ResourceKind,
} from "./resourceDnd";
import { useResourceMutations } from "./useResourceMutations";

// Dialogs load on demand: admin forms (react-hook-form, dropzone, upload)
// never reach visitors, and the player code loads only when needed.
const AttachmentsForm = dynamic(() => import("@/components/AttachmentsForm"), {
	ssr: false,
});
const ChangeNameForm = dynamic(() => import("@/components/ChangeNameForm"), {
	ssr: false,
});
const FolderForm = dynamic(() => import("@/components/FolderForm"), {
	ssr: false,
});
const ConfirmDialog = dynamic(() => import("@/components/ui/ConfirmDialog"), {
	ssr: false,
});
const VideoForm = dynamic(() => import("@/components/VideoForm"), {
	ssr: false,
});
const VideoPlayer = dynamic(() => import("@/components/VideoPlayer"), {
	ssr: false,
});
const MoveDialog = dynamic(() => import("./components/MoveDialog"), {
	ssr: false,
});
const BunnyPlayer = dynamic(() => import("@/components/BunnyPlayer"), {
	ssr: false,
});
const PaywallDialog = dynamic(() => import("./components/PaywallDialog"), {
	ssr: false,
});
const PriceDialog = dynamic(() => import("./components/PriceDialog"), {
	ssr: false,
});

type Named = { id: string; name: string };
type DialogState =
	| { type: "create"; kind: AddKind }
	| { type: "rename"; kind: ResourceKind; item: Named }
	| { type: "delete"; kind: ResourceKind; item: Named }
	| { type: "move"; kind: "file" | "video"; item: Named }
	| { type: "play"; video: Video; startAt: number }
	| { type: "bunny"; video: Video }
	| { type: "paywall" }
	| { type: "price"; folder: Folder }
	| null;

/** "4 مجلدات · 6 فيديوهات · 3 ملفات" from real counts. */
export function summarizeResources(data: ResourceData) {
	const parts = [
		[data.folders.length, "مجلد", "مجلدات"],
		[data.videos.length, "فيديو", "فيديوهات"],
		// Locked files (guests) aren't counted: the page doesn't reveal them.
		[
			data.files.filter((file) => file.url !== SIGNIN_FILE_URL).length,
			"ملف",
			"ملفات",
		],
	] as const;
	return parts
		.filter(([count]) => count > 0)
		.map(([count, one, many]) => `${count} ${count === 1 ? one : many}`)
		.join(" · ");
}

const dndScreenReaderInstructions = {
	draggable:
		"لالتقاط العنصر اضغط مسافة أو Enter، ثم استخدم الأسهم لتغيير موضعه، واضغط مسافة للإفلات أو Escape للإلغاء.",
};

export default function ResourcesPage({
	resources,
	folderId,
	isRootFolder,
	className,
	classId,
	breadcrumb,
}: {
	resources: ResourceData;
	folderId: string;
	isRootFolder: boolean;
	className: string;
	classId: string;
	breadcrumb: { id: string; name: string }[];
}) {
	const { isAdmin } = useRole();
	const { data: swrData, error, mutate } = useResource({ folderId, resources });
	const data: ResourceData = swrData ?? resources;
	const { folders, files, videos } = data;
	const actions = useResourceMutations(folderId, classId);
	const progress = useProgress();
	const tracker = useWatchTracker(progress.save, progress.signedIn && !isAdmin);
	// The cached page is the guest view: no file links, every paid unit locked.
	// Once the user is known, fetch their own view (links, bought units).
	const access = data.access;
	const hasLockedFiles = files.some((file) => file.url === SIGNIN_FILE_URL);
	const hasPaidContent =
		!!access?.unit?.price || folders.some((folder) => folder.price);
	const loadViewer = progress.signedIn && (hasLockedFiles || hasPaidContent);
	const [viewerLoaded, setViewerLoaded] = useState(false);
	useEffect(() => {
		if (loadViewer) void mutate().finally(() => setViewerLoaded(true));
	}, [loadViewer, mutate]);
	// Decided on the server (getResources); admins always play.
	const isLocked = (video: ResourceVideo) => !isAdmin && !!video.locked;

	const [dialog, setDialog] = useState<DialogState>(null);
	const [addMenuAnchor, setAddMenuAnchor] = useState<HTMLElement | null>(null);
	const [draggedKind, setDraggedKind] = useState<ResourceKind | null>(null);
	const [overFolderId, setOverFolderId] = useState<string | null>(null);
	const draggedKindRef = useRef<ResourceKind | null>(null);
	const close = () => {
		if (dialog?.type === "play") tracker.stop();
		setDialog(null);
	};
	const play = (video: ResourceVideo) => {
		if (isLocked(video)) return setDialog({ type: "paywall" });
		// Bunny playback is not tracked: its iframe reports no position.
		if (video.isBunny) return setDialog({ type: "bunny", video });
		const saved = progress.byVideo.get(video.id);
		tracker.start(video.id, saved);
		setDialog({ type: "play", video, startAt: saved?.position ?? 0 });
	};

	// "Continue watching" links (…/folder/<id>?v=<videoId>) open the video at
	// its saved position: wait for progress and for the viewer's own resources
	// (the cached ones lock every paid video), then drop ?v from the URL.
	// (window, not useSearchParams: that would opt this ISR page out of SSR.)
	const deepLinkHandled = useRef(false);
	useEffect(() => {
		if (deepLinkHandled.current || !progress.ready) return;
		if (loadViewer && !viewerLoaded) return;
		deepLinkHandled.current = true;
		const url = new URL(window.location.href);
		const video = videos.find((item) => item.id === url.searchParams.get("v"));
		if (!url.searchParams.has("v")) return;
		url.searchParams.delete("v");
		window.history.replaceState(window.history.state, "", url);
		if (video) play(video);
		// eslint-disable-next-line react-hooks/exhaustive-deps -- runs once, when the viewer is known
	}, [progress.ready, loadViewer, viewerLoaded]);

	const title = isRootFolder
		? className
		: (breadcrumb[breadcrumb.length - 1]?.name ?? className);
	const summary = summarizeResources(data);
	const isEmpty = !folders.length && !files.length && !videos.length;

	const sensors = useSensors(
		useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
		useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
	);

	// Files/videos snap to folders under the pointer; otherwise only same-kind targets count.
	const collisionDetection = useCallback<CollisionDetection>(
		(args) => {
			const kind = draggedKindRef.current;
			const center = closestCenter(args);
			if (kind === "file" || kind === "video") {
				const folderHits = pointerWithin(args).filter((hit) =>
					folders.some((folder) => folder.id === hit.id)
				);
				if (folderHits.length) return folderHits;
				const same: { id: string }[] = kind === "file" ? files : videos;
				return center.filter((hit) => same.some((item) => item.id === hit.id));
			}
			if (kind === "folder") {
				return center.filter((hit) =>
					folders.some((folder) => folder.id === hit.id)
				);
			}
			return center;
		},
		[folders, files, videos]
	);

	const nameOf = useCallback(
		(id: string | number) =>
			[...folders, ...files, ...videos].find((item) => item.id === id)?.name ??
			"",
		[folders, files, videos]
	);

	const announcements = useMemo<Announcements>(
		() => ({
			onDragStart: ({ active }) => `تم التقاط «${nameOf(active.id)}».`,
			onDragOver: ({ active, over }) =>
				over
					? `«${nameOf(active.id)}» فوق «${nameOf(over.id)}».`
					: `«${nameOf(active.id)}» خارج أي هدف.`,
			onDragEnd: ({ active, over }) =>
				over
					? `تم إفلات «${nameOf(active.id)}» عند «${nameOf(over.id)}».`
					: `تم إفلات «${nameOf(active.id)}».`,
			onDragCancel: ({ active }) => `أُلغي سحب «${nameOf(active.id)}».`,
		}),
		[nameOf]
	);

	const resetDrag = () => {
		draggedKindRef.current = null;
		setDraggedKind(null);
		setOverFolderId(null);
	};

	const handleDragStart = ({ active }: DragStartEvent) => {
		const kind = getItemKind(data, String(active.id));
		draggedKindRef.current = kind;
		setDraggedKind(kind);
	};

	const handleDragOver = ({ active, over }: DragOverEvent) => {
		const activeKind = getItemKind(data, String(active.id));
		const overIsFolder =
			!!over && folders.some((folder) => folder.id === over.id);
		setOverFolderId(
			overIsFolder && (activeKind === "file" || activeKind === "video")
				? String(over.id)
				: null
		);
	};

	const handleDragEnd = async ({ active, over }: DragEndEvent) => {
		resetDrag();
		const drop = resolveDrop(
			data,
			String(active.id),
			over ? String(over.id) : null
		);
		if (drop.type === "move") {
			await actions.move(
				drop.kind,
				drop.id,
				drop.targetFolderId,
				nameOf(drop.targetFolderId)
			);
		} else if (drop.type === "reorder") {
			await actions.reorder(
				drop.kind,
				drop.sorted,
				drop.moved.id,
				drop.beforeRank,
				drop.afterRank
			);
		}
	};

	const openCreate = (kind: AddKind) => {
		setAddMenuAnchor(null);
		setDialog({ type: "create", kind });
	};
	const rename = (kind: ResourceKind) => (item: Named) =>
		setDialog({ type: "rename", kind, item });
	const remove = (kind: ResourceKind) => (item: Named) =>
		setDialog({ type: "delete", kind, item });
	const move = (kind: "file" | "video") =>
		folders.length
			? (item: Named) => setDialog({ type: "move", kind, item })
			: undefined;
	const closeOn = (ok: boolean) => {
		if (ok) close();
	};

	const sections = (
		<Stack spacing={{ xs: 5, md: 6 }}>
			<FolderSection
				folders={folders}
				isAdmin={isAdmin}
				isDraggingItem={draggedKind === "file" || draggedKind === "video"}
				overFolderId={overFolderId}
				onCreate={() => openCreate("folder")}
				onRename={rename("folder")}
				onDelete={remove("folder")}
				ownedUnitIds={access?.ownedUnitIds}
				onPrice={
					isAdmin && isRootFolder
						? (folder) => setDialog({ type: "price", folder })
						: undefined
				}
			/>
			<VideosSection
				videos={videos}
				isAdmin={isAdmin}
				isLocked={isLocked}
				onAdd={() => openCreate("video")}
				onPlay={play}
				progress={progress}
				onRename={rename("video")}
				onDelete={remove("video")}
				onMove={move("video")}
			/>
			<FilesSection
				files={files}
				isAdmin={isAdmin}
				onAdd={() => openCreate("file")}
				onRename={rename("file")}
				onDelete={remove("file")}
				onMove={move("file")}
				onSubscribe={() => setDialog({ type: "paywall" })}
			/>
		</Stack>
	);

	let content;
	if (error && !swrData) {
		content = (
			<ErrorState
				action={
					<Button variant='outlined' onClick={() => void mutate()}>
						إعادة المحاولة
					</Button>
				}
			/>
		);
	} else if (isEmpty) {
		content = isAdmin ? (
			<EmptyAddResources onAdd={openCreate} />
		) : (
			<EmptyState
				icon={<InboxOutlinedIcon />}
				title='لا يوجد محتوى هنا بعد'
				description='ستتم إضافة الشروحات والملفات قريباً.'
			/>
		);
	} else if (isAdmin) {
		content = (
			<DndContext
				sensors={sensors}
				collisionDetection={collisionDetection}
				accessibility={{
					announcements,
					screenReaderInstructions: dndScreenReaderInstructions,
				}}
				onDragStart={handleDragStart}
				onDragOver={handleDragOver}
				onDragEnd={(event) => void handleDragEnd(event)}
				onDragCancel={resetDrag}
			>
				{sections}
			</DndContext>
		);
	} else {
		content = sections;
	}

	return (
		<PageShell>
			<PageHeader
				eyebrow={isRootFolder ? "الصف" : className}
				title={title}
				description={summary || undefined}
				actions={
					<>
						<FolderExams
							folderId={folderId}
							folderName={title}
							isAdmin={isAdmin}
							onSubscribe={() => setDialog({ type: "paywall" })}
						/>
						{isAdmin ? (
							<>
								<Button
									startIcon={<AddRoundedIcon />}
									aria-haspopup='menu'
									aria-expanded={!!addMenuAnchor}
									onClick={(event) => setAddMenuAnchor(event.currentTarget)}
								>
									إضافة محتوى
								</Button>
								<Menu
									anchorEl={addMenuAnchor}
									open={!!addMenuAnchor}
									onClose={() => setAddMenuAnchor(null)}
									anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
									transformOrigin={{ vertical: "top", horizontal: "left" }}
								>
									<MenuItem onClick={() => openCreate("folder")}>
										<ListItemIcon>
											<CreateNewFolderOutlinedIcon fontSize='small' />
										</ListItemIcon>
										مجلد جديد
									</MenuItem>
									<MenuItem onClick={() => openCreate("video")}>
										<ListItemIcon>
											<SmartDisplayOutlinedIcon fontSize='small' />
										</ListItemIcon>
										إضافة فيديو
									</MenuItem>
									<MenuItem onClick={() => openCreate("file")}>
										<ListItemIcon>
											<UploadFileOutlinedIcon fontSize='small' />
										</ListItemIcon>
										رفع ملف
									</MenuItem>
								</Menu>
							</>
						) : null}
					</>
				}
			>
				<Stack sx={{ mb: 2 }}>
					<Breadcrumb
						breadcrumb={breadcrumb}
						classId={classId}
						folderId={folderId}
						className={className}
					/>
				</Stack>
			</PageHeader>

			{content}

			{isAdmin ? (
				<>
					<FolderForm
						open={dialog?.type === "create" && dialog.kind === "folder"}
						handleClose={close}
						busy={actions.pending === "folder"}
						withPrice={isRootFolder}
						onSubmit={async (name, price) =>
							closeOn(await actions.createFolder(name, price))
						}
					/>
					<VideoForm
						open={dialog?.type === "create" && dialog.kind === "video"}
						handleClose={close}
						busy={actions.pending === "video"}
						onSubmit={async (values) => closeOn(await actions.addVideo(values))}
					/>
					<AttachmentsForm
						open={dialog?.type === "create" && dialog.kind === "file"}
						handleClose={close}
						busy={actions.pending === "file"}
						onSubmit={async (file, name) =>
							closeOn(await actions.uploadFile(file, name))
						}
					/>
					<ChangeNameForm
						open={dialog?.type === "rename"}
						handleClose={close}
						title={
							dialog?.type === "rename"
								? `إعادة تسمية ${kindLabel[dialog.kind]}`
								: ""
						}
						name={dialog?.type === "rename" ? dialog.item.name : ""}
						label='الاسم الجديد'
						submitLabel='حفظ الاسم'
						isUpdatingName={actions.pending === "rename"}
						onSubmit={async (name) => {
							if (dialog?.type !== "rename") return;
							close();
							await actions.rename(dialog.kind, dialog.item.id, name);
						}}
					/>
					<ConfirmDialog
						open={dialog?.type === "delete"}
						title={
							dialog?.type === "delete" ? `حذف ${kindLabel[dialog.kind]}` : ""
						}
						description={
							dialog?.type === "delete"
								? dialog.kind === "folder"
									? `سيتم حذف «${dialog.item.name}» مع كل ما بداخله من مجلدات وفيديوهات وملفات. لا يمكن التراجع عن ذلك.`
									: `هل تريد حذف «${dialog.item.name}»؟ لا يمكن التراجع عن ذلك.`
								: ""
						}
						loading={actions.pending === "delete"}
						onClose={close}
						onConfirm={async () => {
							if (dialog?.type !== "delete") return;
							close();
							await actions.remove(dialog.kind, dialog.item.id);
						}}
					/>
					<PriceDialog
						folder={dialog?.type === "price" ? dialog.folder : null}
						onClose={close}
						onSaved={() => void mutate()}
					/>
					<MoveDialog
						open={dialog?.type === "move"}
						itemName={dialog?.type === "move" ? dialog.item.name : ""}
						folders={folders}
						busy={false}
						onClose={close}
						onMove={async (target: Folder) => {
							if (dialog?.type !== "move") return;
							close();
							await actions.move(
								dialog.kind,
								dialog.item.id,
								target.id,
								target.name
							);
						}}
					/>
				</>
			) : null}

			<VideoPlayer
				open={dialog?.type === "play"}
				handleClose={close}
				url={dialog?.type === "play" ? dialog.video.url : ""}
				title={dialog?.type === "play" ? dialog.video.name : undefined}
				startAt={dialog?.type === "play" ? dialog.startAt : 0}
				onProgress={tracker.onProgress}
			/>
			<BunnyPlayer
				open={dialog?.type === "bunny"}
				handleClose={close}
				videoId={dialog?.type === "bunny" ? dialog.video.id : ""}
				title={dialog?.type === "bunny" ? dialog.video.name : undefined}
			/>
			<PaywallDialog
				open={dialog?.type === "paywall"}
				onClose={close}
				unit={access?.unit ?? null}
				className={className}
				whatsAppNumber={access?.whatsAppNumber ?? null}
				signedIn={progress.signedIn}
			/>
		</PageShell>
	);
}
