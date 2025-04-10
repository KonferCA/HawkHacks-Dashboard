import type { User } from "firebase/auth";
import type { ApplicationData } from "@/components/forms/types";

export type UserType =
    | "hacker"
    | "mentor"
    | "volunteer"
    | "speaker"
    | "sponsor"
    | "guest";

export interface UserWithClaims extends User {
    hawkAdmin: boolean;
    phoneVerified: boolean;
    rsvpVerified: boolean;
    type: UserType;
}

export type ProviderName = "github" | "google" | "apple";

export type AuthMethod = "none" | "credentials" | ProviderName;

export type AuthContextValue = {
    currentUser: UserWithClaims | null;
    userApp: ApplicationData | null | undefined;
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    createAccount: (email: string, password: string) => Promise<void>;
    resetPassword: (email: string) => Promise<void>;
    loginWithProvider: (name: ProviderName) => Promise<void>;
    reloadUser: () => Promise<void>;
    refreshUserApp: () => Promise<void>;
};
