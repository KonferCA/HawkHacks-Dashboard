import { firestore, functions } from "@/services/firebase";
import { TICKETS_COLLECTION } from "@/services/firebase/collections";
import { logError } from "@/services/firebase/log";
import type {
	CloudFunctionResponse,
	ExtendedTicketData,
	TicketData,
	UserTicketData,
} from "@/services/firebase/types";
import { addDoc, collection } from "firebase/firestore";
import { httpsCallable } from "firebase/functions";

export async function getTicketData(id: string) {
	try {
		const fn = httpsCallable<unknown, CloudFunctionResponse<TicketData>>(
			functions,
			"getTicketData",
		);
		const { data } = await fn({ id });
		return data;
	} catch (e) {
		await logError(e as Error, "get_ticket_data_error");
		throw e;
	}
}

// admin view of the ticket
// includes information about the food/events the hacker has been to
export async function getExtendedTicketData(id: string) {
	try {
		const fn = httpsCallable<
			unknown,
			CloudFunctionResponse<ExtendedTicketData>
		>(functions, "getExtendedTicketData");
		const { data } = await fn({ id });
		return data;
	} catch (e) {
		await logError(e as Error, "get_extended_ticket_data_error");
		throw e;
	}
}

/**
 * Creates a new ticket entry in the collection 'tickets'.
 * A ticket is a QR code that identifies the user during the hackathon.
 * @returns {Promise<string>} the ticket id
 */
export async function createTicket(data: UserTicketData): Promise<string> {
	const docRef = await addDoc(collection(firestore, TICKETS_COLLECTION), data);
	return docRef.id;
}
