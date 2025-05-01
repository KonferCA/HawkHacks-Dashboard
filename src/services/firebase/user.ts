import { functions } from "@/services/firebase";
import { logError } from "@/services/firebase/log";
import type { CloudFunctionResponse, Socials } from "@/services/firebase/types";
import { httpsCallable } from "firebase/functions";

export async function verifyGitHubEmail(token: string, email: string) {
	const verifyFn = httpsCallable(functions, "verifyGitHubEmail");
	try {
		await verifyFn({ token, email });
	} catch (e) {
		console.error(e);
		return false;
	}

	return true;
}

export async function getSocials() {
	const fn = httpsCallable<unknown, CloudFunctionResponse<Socials>>(
		functions,
		"requestSocials",
	);
	try {
		const res = await fn();
		const data = res.data;
		return data;
	} catch (e) {
		logError(e as Error, "error_get_socials");
		throw e;
	}
}

export async function updateSocials(socials: Socials) {
	const fn = httpsCallable<unknown, CloudFunctionResponse<Socials>>(
		functions,
		"updateSocials",
	);
	try {
		const res = await fn(socials);
		const data = res.data;
		return data;
	} catch (e) {
		logError(e as Error, "error_update_socials");
		throw e;
	}
}
