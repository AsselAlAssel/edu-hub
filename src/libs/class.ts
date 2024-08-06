import { prisma } from "./prismaDb";

// const signUrl = async (url: string, expirationTime = 3600) => {
// 	let parameterData = "",
// 		parameterDataUrl = "",
// 		signaturePath = "",
// 		hashableBase = "",
// 		token = "";
// 	const expires = Math.floor((new Date() as any) / 1000) + expirationTime;
// 	const parsedUrl = new URL(url);
// 	const parameters = new URL(url).searchParams;
// 	if (pathAllowed != "") {
// 		signaturePath = pathAllowed;
// 		parameters.set("token_path", signaturePath);
// 	} else {
// 		signaturePath = decodeURIComponent(parsedUrl.pathname);
// 	}
// 	parameters.sort();
// 	if (Array.from(parameters).length > 0) {
// 		parameters.forEach(function (value, key) {
// 			if (value == "") {
// 				return;
// 			}
// 			if (parameterData.length > 0) {
// 				parameterData += "&";
// 			}
// 			parameterData += key + "=" + value;
// 			parameterDataUrl +=
// 				"&" + key + "=" + queryString.stringify({ [key]: value });
// 		});
// 	}
// 	hashableBase =
// 		process.env.NEXT_BUNNYCDN_FILES_AUTHENTICATION_KEY +
// 		signaturePath +
// 		expires +
// 		(userIp != null ? userIp : "") +
// 		parameterData;
// 	token = Buffer.from(
// 		crypto.createHash("sha256").update(hashableBase).digest()
// 	).toString("base64");
// 	token = token
// 		.replace(/\n/g, "")
// 		.replace(/\+/g, "-")
// 		.replace(/\//g, "_")
// 		.replace(/=/g, "");
// 	if (isDirectory) {
// 		return (
// 			parsedUrl.protocol +
// 			"//" +
// 			parsedUrl.host +
// 			"/bcdn_token=" +
// 			token +
// 			parameterDataUrl +
// 			"&expires=" +
// 			expires +
// 			parsedUrl.pathname
// 		);
// 	} else {
// 		return (
// 			parsedUrl.protocol +
// 			"//" +
// 			parsedUrl.host +
// 			parsedUrl.pathname +
// 			"?token=" +
// 			token +
// 			parameterDataUrl +
// 			"&expires=" +
// 			expires
// 		);
// 	}
// };
// const createQuery = (videoId: string) => {
// 	const expired = Math.floor((new Date() as any) / 1000) + 3600;
// 	const token = crypto
// 		.createHash("sha256")
// 		.update(
// 			process.env.NEXT_BUNNYCDN_VIDEOS_AUTHENTICATION_KEY + videoId + expired
// 		)
// 		.digest("hex");
// 	return queryString.stringify({ token, expires: expired });
// };

// const expirationTime = 3600;
// const userIp = null;
// const isDirectory = false;
// const pathAllowed = "";

export const getClasses = async () => {
	const classes = await prisma.class.findMany({
		include: {
			folders: {
				where: {
					isRoot: true,
				},
			},
		},
	});

	return classes;
};

export const getClass = async (classId: string) => {
	const classData = await prisma.class.findUnique({
		where: {
			id: classId,
		},
		include: {
			folders: {
				where: {
					isRoot: true,
				},
			},
		},
	});

	return classData;
};

export const getResources = async (folderId: string) => {
	const folders = await prisma.folder.findMany({
		where: {
			parentFolderId: folderId,
		},
	});
	const videos = await prisma.video.findMany({
		where: {
			folderId: folderId,
		},
	});
	const files = await prisma.file.findMany({
		where: {
			folderId: folderId,
		},
	});

	const resourceData = {
		folders,
		files,
		videos,
	};

	return resourceData;
};
