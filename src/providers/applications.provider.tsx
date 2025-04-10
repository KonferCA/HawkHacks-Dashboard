import { createContext, useContext, useCallback } from "react";
import { useUser } from "./auth.provider";
import { getUserApplications } from "@/services/firebase/application";
import type { ApplicationData } from "@/components/forms/types";
import { useQuery, useQueryClient } from "@tanstack/react-query";

interface ApplicationsContextValue {
    applications: ApplicationData[];
    refreshApplications: () => void;
    isLoading: boolean;
}

const ApplicationsContext = createContext<ApplicationsContextValue>({
    applications: [],
    refreshApplications: async () => {},
    isLoading: false,
});

export const ApplicationsProvider = ({
    children,
}: {
    children: React.ReactNode;
}) => {
    const user = useUser();
    const queryClient = useQueryClient();
    const { data: applications, isLoading } = useQuery({
        queryKey: ["applications"],
        queryFn: async () => {
            if (!user) return [];
            return await getUserApplications(user.uid);
        },
        initialData: [],
        enabled: !!user,
    });

    const refreshApplications = useCallback(() => {
        queryClient.invalidateQueries({ queryKey: ["applications"] });
    }, [user, queryClient]);

    return (
        <ApplicationsContext.Provider
            value={{
                applications,
                refreshApplications,
                isLoading,
            }}
        >
            {children}
        </ApplicationsContext.Provider>
    );
};

export const useApplications = () => {
    return useContext(ApplicationsContext);
};
