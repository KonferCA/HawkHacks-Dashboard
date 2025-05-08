import { getFirestore } from "firebase-admin/firestore";
import { error as logError } from "firebase-functions/logger";
import { onCall } from "firebase-functions/v2/https";
import type { Context } from "./types";
import { HttpStatus, response } from "./utils";

const HACKATHONS_COLLECTION = "hackathon";
interface HackathonDates {
	year: string;
	dates: {
		start: string;
		end: string;
	};
}

export const getHackathonDates = onCall<HackathonDates, any, any>(
  async ({ data }, res) => {
    const context = res as Context;
    if (!context?.auth)
      return response(HttpStatus.UNAUTHORIZED, { message: "unauthorized" });

    const func = "getHackathonDates";

    try {
      const res = await getFirestore()
        .collection(HACKATHONS_COLLECTION)
        .where("id", "==", data.year)
        .get();
      return response(HttpStatus.OK, { data: res });
    } catch (error) {
      logError(`Failed to get user Hackathon Dates for year ${data.year}`, {
        error,
        func,
      });
      return response(HttpStatus.INTERNAL_SERVER_ERROR, {
        message: "Could not get hackathon dates",
      });
    }
  }
);

