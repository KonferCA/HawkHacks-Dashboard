import { functions } from "@/services/firebase";
import { logError } from "@/services/firebase/log";
import { httpsCallable } from "firebase/functions";
import type { CloudFunctionResponse } from "./types";

interface HackathonDates {
	year: string;
	dates: {
		start: string;
		end: string;
	};
}

export async function getHackathonDates(year: string) {
	const fn = httpsCallable<unknown, CloudFunctionResponse<HackathonDates>>(
		functions,
		"getHackathonDates",
		
	);
	try {
		const res = await fn({ year });
		const data = res.data;
		return data;
	} catch (error) {
		logError(error as Error, "error_getting_hackathon_dates");
		throw error;
	}
}
