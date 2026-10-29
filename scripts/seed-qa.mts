/* eslint-disable no-console -- CLI seed script: console output is its UI. */
/**
 * Rebuilds the QA database with test data for paid units and exams.
 * Wipes every collection first, so it refuses anything but a *-qa database.
 *
 *   npx prisma db push --skip-generate   (with DATABASE_URL from .env.qa.local)
 *   node --env-file=.env.qa.local scripts/seed-qa.mts
 *
 * Accounts (password Test1234!): admin@qa.test, paid@qa.test (owns the
 * second unit), free@qa.test (owns nothing).
 */
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { LexoRank } from "lexorank";

const dbName = new URL(process.env.DATABASE_URL ?? "").pathname.slice(1);
if (!dbName.endsWith("-qa")) {
	console.error(`Refusing to wipe "${dbName}": only a *-qa database.`);
	process.exit(1);
}

const prisma = new PrismaClient();
const PASSWORD = "Test1234!";
const PDF =
	"https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf";

let rank = LexoRank.middle();
const nextRank = () => (rank = rank.genNext()).toString();

const folder = (
	name: string,
	classId: string,
	parentFolderId: string,
	price?: number
) =>
	prisma.folder.create({
		data: { name, classId, parentFolderId, price, rank: nextRank() },
	});

const video = (name: string, ytId: string, folderId: string, classId: string) =>
	prisma.video.create({
		data: {
			name,
			videoId: ytId,
			url: `https://www.youtube.com/watch?v=${ytId}`,
			thumbnailUrl: `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`,
			folderId,
			classId,
			rank: nextRank(),
		},
	});

// A Bunny Stream video, as paid units use. The id is a dummy: access, the
// signed link and the watermark all work; Bunny's player says "not found".
let bunnyCount = 0;
const bunnyVideo = (name: string, folderId: string, classId: string) => {
	const uuid = `00000000-0000-4000-8000-${String(++bunnyCount).padStart(12, "0")}`;
	return prisma.video.create({
		data: {
			name,
			videoId: uuid,
			url: `https://iframe.mediadelivery.net/embed/123456/${uuid}`,
			thumbnailUrl: "",
			folderId,
			classId,
			rank: nextRank(),
		},
	});
};

async function wipe() {
	await prisma.examAttempt.deleteMany();
	await prisma.exam.deleteMany();
	await prisma.question.deleteMany();
	await prisma.videoProgress.deleteMany();
	await prisma.video.deleteMany();
	await prisma.file.deleteMany();
	// Folders point at each other; delete leaves first.
	while (await prisma.folder.count()) {
		const parents = await prisma.folder.findMany({
			where: { parentFolderId: { not: null } },
			select: { parentFolderId: true },
		});
		await prisma.folder.deleteMany({
			where: { id: { notIn: parents.map((p) => p.parentFolderId!) } },
		});
	}
	await prisma.class.deleteMany();
	await prisma.session.deleteMany();
	await prisma.account.deleteMany();
	await prisma.user.deleteMany();
	await prisma.landingPage.deleteMany();
}

async function seed() {
	console.log(`Seeding ${dbName}...`);
	await wipe();

	await prisma.landingPage.create({
		data: {
			headerTitle: "منصة QA",
			headerSubtitle: "بيانات تجريبية",
			aboutTitle: "عن المنصة",
			whatsAppNumber: "970599000000",
			address: "رام الله",
			email: "qa@test.local",
		},
	});

	// Classes: one visible with free + paid units, one hidden (admins only).
	const math = await prisma.class.create({
		data: { name: "رياضيات - QA", description: "صف تجريبي" },
	});
	const hiddenClass = await prisma.class.create({
		data: { name: "صف مخفي - QA", hidden: true },
	});
	const hiddenRoot = await prisma.folder.create({
		data: { name: "Root Folder", classId: hiddenClass.id, isRoot: true },
	});
	const hiddenUnit = await folder(
		"وحدة الصف المخفي",
		hiddenClass.id,
		hiddenRoot.id
	);
	await video("فيديو مخفي", "dQw4w9WgXcQ", hiddenUnit.id, hiddenClass.id);
	const root = await prisma.folder.create({
		data: { name: "Root Folder", classId: math.id, isRoot: true },
	});

	const free = await folder("الوحدة الأولى (مجانية)", math.id, root.id);
	const freeLesson = await folder("الدرس الأول", math.id, free.id);
	const owned = await folder(
		"الوحدة الثانية (مدفوعة، مفتوحة لـ paid)",
		math.id,
		root.id,
		50
	);
	const ownedLesson = await folder("الدرس الأول", math.id, owned.id);
	const locked = await folder(
		"الوحدة الثالثة (مدفوعة، مقفلة)",
		math.id,
		root.id,
		30
	);

	const v1 = await video("مقدمة", "dQw4w9WgXcQ", freeLesson.id, math.id);
	await video("شرح الدرس", "jNQXAC9IVRw", freeLesson.id, math.id);
	await bunnyVideo("فيديو Bunny مجاني", freeLesson.id, math.id);
	await bunnyVideo("فيديو الوحدة المدفوعة", owned.id, math.id);
	await bunnyVideo("درس مدفوع", ownedLesson.id, math.id);
	await bunnyVideo("فيديو مقفل", locked.id, math.id);
	for (const f of [free, owned, locked])
		await prisma.file.create({
			data: {
				name: `ملخص ${f.name}`,
				url: PDF,
				type: "pdf",
				folderId: f.id,
				classId: math.id,
				rank: nextRank(),
			},
		});

	// Users.
	const password = await bcrypt.hash(PASSWORD, 10);
	await prisma.user.create({
		data: { name: "QA Admin", email: "admin@qa.test", password, role: "ADMIN" },
	});
	const paid = await prisma.user.create({
		data: {
			name: "طالب مشترك",
			email: "paid@qa.test",
			password,
			unlockedUnitIds: [owned.id],
		},
	});
	await prisma.user.create({
		data: { name: "طالب مجاني", email: "free@qa.test", password },
	});
	await prisma.videoProgress.create({
		data: {
			userId: paid.id,
			videoId: v1.id,
			position: 30,
			watched: 30,
			completed: true,
		},
	});

	// Question bank + one exam per unlock rule / access case.
	const q = (
		lesson: string,
		text: string,
		options: string[],
		correctIndex: number,
		source?: string
	) =>
		prisma.question.create({
			data: { lesson, text, options, correctIndex, source },
		});
	const qs = [
		await q(
			"التفاضل",
			"مشتقة x² هي؟",
			["x", "2x", "x²", "2"],
			1,
			"وزاري 2021 – الدورة الأولى"
		),
		await q(
			"التفاضل",
			"مشتقة الثابت هي؟",
			["0", "1", "الثابت نفسه", "غير معرفة"],
			0
		),
		await q(
			"التفاضل",
			"مشتقة sin x هي؟",
			["-cos x", "cos x", "sin x", "tan x"],
			1
		),
		await q(
			"التكامل",
			"تكامل 2x dx هو؟",
			["x² + c", "2x² + c", "x + c", "2 + c"],
			0,
			"وزاري 2022"
		),
		await q("التكامل", "تكامل 0 dx هو؟", ["0", "c", "x", "1"], 1),
		await q(
			"النهايات",
			"نهاية 1/x عندما x → ∞ هي؟",
			["1", "∞", "0", "غير موجودة"],
			2
		),
	];
	const ids = (...i: number[]) => i.map((n) => qs[n].id);
	const exam = (
		title: string,
		folderId: string,
		questionIds: string[],
		unlockRule = "ALWAYS"
	) =>
		prisma.exam.create({ data: { title, folderId, questionIds, unlockRule } });

	const e1 = await exam("اختبار مفتوح (ALWAYS)", free.id, ids(0, 1, 2));
	await exam(
		"اختبار بعد فيديوهات الدرس (FOLDER)",
		freeLesson.id,
		ids(0, 3),
		"FOLDER"
	);
	await exam("اختبار بعد كل الوحدة (TREE)", owned.id, ids(3, 4, 5), "TREE");
	await exam("اختبار الوحدة المقفلة", locked.id, ids(1, 5));
	await exam("اختبار الصف المخفي", hiddenUnit.id, ids(0));
	await prisma.examAttempt.create({
		data: { examId: e1.id, userId: paid.id, correct: 2, total: 3 },
	});

	console.log(
		`Done. Logins (password ${PASSWORD}): admin@qa.test, paid@qa.test, free@qa.test`
	);
}

seed()
	.catch((e) => {
		console.error(e);
		process.exitCode = 1;
	})
	.finally(() => prisma.$disconnect());
