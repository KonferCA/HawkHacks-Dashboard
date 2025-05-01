import { firestore } from "@/services/firebase";
import { HACKATHON_METADATA_COLLECTION } from "@/services/firebase/collections";
import { logEvent } from "@/services/firebase/log";
import { doc, getDoc } from "firebase/firestore";
import type { Deadlines } from "./types";

export async function getDeadlines() {
	try {
		const docRef = doc(firestore, HACKATHON_METADATA_COLLECTION, "deadlines");
		const docSnap = await getDoc(docRef);
		if (docSnap.exists()) {
			return docSnap.data() as Deadlines;
		}
		return null;
	} catch (e) {
		logEvent("error", {
			event: "get_deadlines_error",
			message: (e as Error).message,
			name: (e as Error).name,
			stack: (e as Error).stack,
		});
		throw e;
	}
}
