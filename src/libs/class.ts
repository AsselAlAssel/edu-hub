import crypto from "crypto";
import queryString from "query-string";
import { prisma } from "./prismaDb";
import { getIsAuthorized } from "./uitls";

const signUrl = async (
	url: string,
	securityKey: string,
	expirationTime = 3600,
	userIp: string | null = null,
	isDirectory = false,
	pathAllowed: string = ""
) => {
	let parameterData = "",
		parameterDataUrl = "",
		signaturePath = "",
		hashableBase = "",
		token = "";
	const expires = Math.floor((new Date() as any) / 1000) + expirationTime;
	const parsedUrl = new URL(url);
	const parameters = new URL(url).searchParams;
	if (pathAllowed != "") {
		signaturePath = pathAllowed;
		parameters.set("token_path", signaturePath);
	} else {
		signaturePath = decodeURIComponent(parsedUrl.pathname);
	}
	parameters.sort();
	if (Array.from(parameters).length > 0) {
		parameters.forEach(function (value, key) {
			if (value == "") {
				return;
			}
			if (parameterData.length > 0) {
				parameterData += "&";
			}
			parameterData += key + "=" + value;
			parameterDataUrl +=
				"&" + key + "=" + queryString.stringify({ [key]: value });
		});
	}
	hashableBase =
		securityKey +
		signaturePath +
		expires +
		(userIp != null ? userIp : "") +
		parameterData;
	token = Buffer.from(
		crypto.createHash("sha256").update(hashableBase).digest()
	).toString("base64");
	token = token
		.replace(/\n/g, "")
		.replace(/\+/g, "-")
		.replace(/\//g, "_")
		.replace(/=/g, "");
	if (isDirectory) {
		return (
			parsedUrl.protocol +
			"//" +
			parsedUrl.host +
			"/bcdn_token=" +
			token +
			parameterDataUrl +
			"&expires=" +
			expires +
			parsedUrl.pathname
		);
	} else {
		return (
			parsedUrl.protocol +
			"//" +
			parsedUrl.host +
			parsedUrl.pathname +
			"?token=" +
			token +
			parameterDataUrl +
			"&expires=" +
			expires
		);
	}
};

const securityKey = "ca30ea94-171e-4804-a9dc-31e332400289";
const expirationTime = 3600;
const userIp = null;
const isDirectory = false;
const pathAllowed = "";

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
	const isAuthorized = await getIsAuthorized();
	const folders = await prisma.folder.findMany({
		where: {
			parentFolderId: folderId,
		},
	});
	let resources = await prisma.resource.findMany({
		where: {
			folderId: folderId,
		},
	});
	if (!isAuthorized) {
		resources =
			resources?.map((resource) => {
				if (resource) {
					return {
						...resource,
						url: "#",
					};
				}
				return resource;
			}) || [];
	}
	if (isAuthorized) {
		resources = await Promise.all(
			resources.map(async (resource) => {
				console.log(11111111, resource.url);
				return {
					...resource,
					url: await signUrl(
						resource.url,
						securityKey,
						expirationTime,
						userIp,
						isDirectory,
						pathAllowed
					),
				};
			})
		);
	}
	const resourceData = {
		folders,
		resources,
	};

	return resourceData;
};
