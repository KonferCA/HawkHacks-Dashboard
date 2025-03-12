import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { httpsCallable } from "firebase/functions";
import { firestore, functions } from "@/services/firebase";
import { logError } from "@/services/firebase/log";

import type {
    CloudFunctionResponse,
    EventItem,
} from "@/services/firebase/types";

export async function redeemItem(
    ticketId: string,
    itemId: string,
    action: "check" | "uncheck"
) {
    const fn = httpsCallable<unknown, CloudFunctionResponse<string[]>>(
        functions,
        "redeemItem"
    );
    try {
        const res = await fn({ ticketId, itemId, action });
        const data = res.data;
        return data;
    } catch (e) {
        logError(e as Error, "error_update_socials");
        throw e;
    }
}

export async function getRedeemableItems() {
    try {
        const eventsQ = query(
            collection(firestore, "events"),
            orderBy("startTime", "asc")
        );
        const eventSnap = await getDocs(eventsQ);
        const events: EventItem[] = [];
        eventSnap.forEach((doc) => events.push(doc.data() as EventItem));

        return events;
    } catch (e) {
        logError(e as Error, "error_getting_redeemable_items");
        throw e;
    }
}
