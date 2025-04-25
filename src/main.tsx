import React from "react";
import ReactDOM from "react-dom/client";

import { Toaster } from "@/components/ui/toaster";

import { Provider } from "@/components/ui/provider";
import { RoutesProvider, AuthProvider } from "@/providers";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import "./index.css";

// for funsies
console.log("If you found this, you are a curious one! 😄");
console.log("BUT we are not hiring at the moment ^_^");
console.log(`App version: ${APP_VERSION}`);
console.log(`App env: ${import.meta.env.MODE}`);

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <Provider>
            <QueryClientProvider client={queryClient}>
                <Toaster />
                <AuthProvider>
                    <RoutesProvider />
                </AuthProvider>
            </QueryClientProvider>
        </Provider>
    </React.StrictMode>
);
