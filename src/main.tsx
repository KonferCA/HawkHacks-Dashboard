import React from "react";
import ReactDOM from "react-dom/client";

import { Toaster } from "@/components/ui/toaster";

import { Provider } from "@/components/ui/provider";
import { AuthProvider, RoutesProvider } from "@/providers";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import "./index.css";

// for funsies
console.log("If you found this, you are a curious one! 😄");
console.log("BUT we are not hiring at the moment ^_^");
console.log(`App version: ${APP_VERSION}`);
console.log(`App env: ${import.meta.env.MODE}`);

const queryClient = new QueryClient();

const rootElement = document.getElementById("root");
if (!rootElement) {
	throw new Error("Element with id 'root' not found");
}

ReactDOM.createRoot(rootElement).render(
	<React.StrictMode>
		<Provider forcedTheme="light">
			<QueryClientProvider client={queryClient}>
				<Toaster />
				<AuthProvider>
					<RoutesProvider />
				</AuthProvider>
			</QueryClientProvider>
		</Provider>
	</React.StrictMode>,
);
