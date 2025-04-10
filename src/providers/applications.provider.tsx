import { createContext, useState, useContext, useEffect } from "react";
import { useAuth } from "./auth.provider";
import { getUserApplications } from "@/services/firebase/application";
import type { ApplicationData } from "@/components/forms/types";

interface ApplicationsContextValue {
    applications: ApplicationData[];
    refreshApplications: () => Promise<void>;
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
    const [applications, setApplications] = useState<ApplicationData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { currentUser } = useAuth();

    const refreshApplications = async () => {
        if (!currentUser) {
            setApplications([]);
            setIsLoading(false);
            return;
        }

        setIsLoading(true);
        try {
            const userApplications = await getUserApplications(currentUser.uid);

            setApplications(userApplications);
        } catch (error) {
            console.error("Error fetching user applications:", error);
            setApplications([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        refreshApplications();
    }, [currentUser]);

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
    const ctx = useContext(ApplicationsContext);
    return ctx.applications;
};
