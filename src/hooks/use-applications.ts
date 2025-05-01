import type { ApplicationData } from "@/components/forms/types";
import { useUser } from "@/providers";
import { getUserApplications } from "@/services/firebase/application";
import { getDeadlines } from "@/services/firebase/deadlines";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { isAfter, isBefore, parseISO } from "date-fns";
import { useCallback } from "react";

export type ApplicationsHookValue = {
	applications: ApplicationData[];
	deadlines: {
		beforeStart: boolean;
		afterClose: boolean;
		inRange: boolean;
	};
	refreshApplications: () => Promise<void>;
	isLoading: boolean;
};

/**
 * Hook for accessing application data
 */
export const useApplications = () => {
	const { user } = useUser();
	const queryClient = useQueryClient();

	const { data: applications = [], isLoading: loadingApplications } = useQuery({
		queryKey: ["applications"],
		queryFn: async () => {
			if (!user) return [];
			return await getUserApplications(user.uid);
		},
		initialData: [],
		enabled: !!user,
		refetchOnWindowFocus: false,
		refetchOnMount: false,
	});

	const { data: deadlines, isLoading: loadingDeadlines } = useQuery({
		queryKey: ["deadlines"],
		queryFn: async () => {
			try {
				const deadlines = await getDeadlines();
				// sanity check that nothing is undefined or empty string
				if (!deadlines || !deadlines.appStartDate || !deadlines.appCloseDate)
					return {
						beforeStart: false,
						afterClose: false,
						inRange: false,
					};
				const today = new Date();
				const startDate = parseISO(deadlines.appStartDate);
				const closeDate = parseISO(deadlines.appCloseDate);
				const before = isBefore(today, startDate);
				const after = isAfter(today, closeDate);
				const between = !before && !after;
				return {
					beforeStart: before,
					afterClose: after,
					inRange: between,
				};
			} catch (error) {
				console.error(error);
				return {
					beforeStart: false,
					afterClose: false,
					inRange: false,
				};
			}
		},
		initialData: {
			beforeStart: false,
			afterClose: false,
			inRange: false,
		},
		enabled: !!user,
		refetchOnWindowFocus: false,
		refetchOnMount: false,
	});

	/**
	 * Invalidates and refreshes the applications query
	 */
	const refreshApplications = useCallback(() => {
		return queryClient.invalidateQueries({ queryKey: ["applications"] });
	}, [queryClient]);

	return {
		deadlines,
		applications,
		refreshApplications,
		isLoading: loadingApplications || loadingDeadlines,
	} satisfies ApplicationsHookValue;
};
