
import { Box } from "@mui/material";
import crypto from 'crypto';
import queryString from 'query-string';
import Header from "./components/Header";


export default async function Landing() {

	const addCountries = (url: string, a: string | null, b: string | null) => {
		var tempUrl = url;
		if (a != null) {
			var tempUrlOne = new URL(tempUrl);
			tempUrl += ((tempUrlOne.search == "") ? "?" : "&") + "token_countries=" + a;
		}
		if (b != null) {
			var tempUrlTwo = new URL(tempUrl);
			tempUrl += ((tempUrlTwo.search == "") ? "?" : "&") + "token_countries_blocked=" + b;
		}
		return tempUrl;
	}

	const signUrl = async (url: string
		, securityKey: string
		, expirationTime = 3600, userIp: string | null = null
		, isDirectory = false
		, pathAllowed: string = ""
		, countriesAllowed: string | null = null
		, countriesBlocked: string | null = null
	) => {
		var parameterData = "", parameterDataUrl = "", signaturePath = "", hashableBase = "", token = "";
		var expires = Math.floor((new Date() as any) / 1000) + expirationTime;
		var url = addCountries(url, countriesAllowed, countriesBlocked);
		var parsedUrl = new URL(url);
		var parameters = (new URL(url)).searchParams;
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
				parameterDataUrl += "&" + key + "=" + queryString.stringify({ [key]: value });

			});
		}
		hashableBase = securityKey + signaturePath + expires + ((userIp != null) ? userIp : "") + parameterData;
		token = Buffer.from(crypto.createHash("sha256").update(hashableBase).digest()).toString("base64");
		token = token.replace(/\n/g, "").replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
		if (isDirectory) {
			return parsedUrl.protocol + "//" + parsedUrl.host + "/bcdn_token=" + token + parameterDataUrl + "&expires=" + expires + parsedUrl.pathname;
		} else {
			return parsedUrl.protocol + "//" + parsedUrl.host + parsedUrl.pathname + "?token=" + token + parameterDataUrl + "&expires=" + expires;
		}
	}
	const url = "https://iframe.mediadelivery.net/play/277191/e5fc5f49-efb1-4fa7-9f53-5a4f8ba22884";
	const securityKey = "c77350e8-5dcf-431a-9b3a-33aee3970ab2"
	const expirationTime = 3600;
	const userIp = null;
	const isDirectory = false;
	const pathAllowed = "";
	const countriesAllowed = null;
	const countriesBlocked = null;
	const signedUrl = await signUrl(url, securityKey, expirationTime, userIp, isDirectory, pathAllowed, countriesAllowed, countriesBlocked);
	console.log(signedUrl);

	const createQuery = (APIKey: string
		, videoId: string) => {
		const expired = Math.floor((new Date() as any) / 1000) + 3600;
		const token = crypto.createHash('sha256').update(APIKey + videoId + expired).digest('hex');
		return queryString.stringify({ token, expires: expired });

	}
	const APIKey = "c77350e8-5dcf-431a-9b3a-33aee3970ab2";
	const videoId = "e5fc5f49-efb1-4fa7-9f53-5a4f8ba22884";
	const query = createQuery(APIKey, videoId);
	console.log(111, query);
	const url2 = `https://iframe.mediadelivery.net/embed/277191/${videoId}?${query}`;
	console.log(11, url2);
	// <iframe
	// 			width={800}
	// 			height={500}
	// 			src={url2}
	// 			// src="https://iframe.mediadelivery.net/embed/277191/e5fc5f49-efb1-4fa7-9f53-5a4f8ba22884?token=1f6e33bc23ab7f1575cba34d5796377a0c88206c1a4cf30144eb359c428e6aed&expires=1722527359&autoplay=true&loop=false&muted=false&preload=true&responsive=true"
	// 			loading="lazy"
	// 			allow="accelerometer;gyroscope;autoplay;encrypted-media;picture-in-picture;"
	// 			allowFullScreen={true}
	// 		></iframe>
	return (
		<Box
			sx={{
				mt: -5,
			}}
		>
			<Header />
			{/*
		<PageContainer
		  sx={{
			maxWidth: "1440px !important",
		  }}
		>
		  <KeyPainPoints />
		  <Features />
		  <HowUseSystem />
		</PageContainer>
  
		<ContactUs />
		<Footer /> */}
		</Box>
	);


}

