import { firestore } from "@/services/firebase";
import { APPLICATIONS_COLLECTION } from "@/services/firebase/collections";
import { logEvent } from "@/services/firebase/log";
import {
	Timestamp,
	addDoc,
	collection,
	getDocs,
	query,
	where,
} from "firebase/firestore";

import type { ApplicationData } from "@/components/forms/types";

/**
 * Submits an application to firebase
 */
export async function submitApplication(data: ApplicationData, uid: string) {
	const payload = {
		...data,
		applicantId: uid,
		timestamp: Timestamp.now(),
		hackathonYear: "2025",
		applicationStatus: "pending",
	} satisfies ApplicationData;

	try {
		const appsRef = collection(firestore, APPLICATIONS_COLLECTION);
		await addDoc(appsRef, payload);
	} catch (e) {
		logEvent("error", {
			event: "app_submit_error",
			message: (e as Error).message,
			name: (e as Error).name,
			stack: (e as Error).stack,
		});
		// pass this along so that the application page handles the error
		throw e;
	}
}

/**
 * Gets all the applications from a given user
 */
export async function getUserApplications(uid: string) {
	try {
		const colRef = collection(firestore, APPLICATIONS_COLLECTION);
		const q = query(colRef, where("applicantId", "==", uid));
		const snap = await getDocs(q);
		const apps: ApplicationData[] = [];
		snap.forEach((doc) => apps.push(doc.data() as ApplicationData));
		return apps;
	} catch (e) {
		logEvent("error", {
			event: "search_user_applications_error",
			message: (e as Error).message,
			name: (e as Error).name,
			stack: (e as Error).stack,
		});
	}

	return [];
}
