import { httpsCallable } from "firebase/functions";
import { functions } from "@/services/firebase";
import { logError, logEvent } from "@/services/firebase/log";
import { CloudFunctionResponse } from "./types";

export async function verifyRSVP() {
    const verifyFn = httpsCallable(functions, "verifyRSVP");
    try {
        const res = await verifyFn();
        const data = res.data as {
            status: number;
            verified: boolean;
            message?: string;
        };
        return data;
    } catch (e) {
        logEvent("error", {
            event: "verify_rsvp",
            message: (e as Error).message,
            name: (e as Error).name,
            stack: (e as Error).stack,
        });
        return {
            status: 500,
            verified: false,
            message: "Internal server error",
        };
    }
}

export async function withdrawRSVP() {
    const fn = httpsCallable<unknown, CloudFunctionResponse<void>>(
        functions,
        "withdrawRSVP"
    );
    try {
        const res = await fn();
        const data = res.data;
        return data;
    } catch (error) {
        logError(error as Error, "error_dismissing_rsvp");
        throw error;
    }
}

export async function joinWaitlist() {
    const fn = httpsCallable<unknown, CloudFunctionResponse<void>>(
        functions,
        "joinWaitlist"
    );
    try {
        const res = await fn();
        const data = res.data;
        return data;
    } catch (error) {
        logError(error as Error, "error_joining_waitlist");
        throw error;
    }
}
