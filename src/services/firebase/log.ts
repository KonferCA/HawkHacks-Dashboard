import { httpsCallable } from "firebase/functions";
import { functions } from ".";

export async function logEvent(
	type: "error" | "info" | "log",
	data: Record<string, unknown>,
) {
	try {
		const logFn = httpsCallable(functions, "logEvent");
		await logFn({ type, data });
	} catch (e) {
		console.error(e);
		console.warn("Failed to log in cloud.");
	}
}

export async function logError(e: Error, event: string) {
	await logEvent("error", {
		event,
		message: (e as Error).message,
		name: (e as Error).name,
	});
}
