import { isBefore, isAfter, parseISO } from "date-fns";

/**
 * Checks if the given date is neither before the start date nor after the end date
 * (i.e., it checks if the date is within the range, inclusive of boundaries)
 */
export function isDateInRange(
	dateToCheck: Date,
	startDateString: string,
	endDateString: string,
): boolean {
	// Parse the ISO strings
	const startDate = parseISO(startDateString);
	const endDate = parseISO(endDateString);

	// Check if dateToCheck is before the start date
	const isBeforeStartDate = isBefore(dateToCheck, startDate);

	// Check if dateToCheck is after the end date
	const isAfterEndDate = isAfter(dateToCheck, endDate);

	// Return true if dateToCheck is NOT before start date AND NOT after end date
	return !isBeforeStartDate && !isAfterEndDate;
}
