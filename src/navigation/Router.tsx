import {
    BrowserRouter,
    useRoutes as useReactRouterRoutes,
} from "react-router-dom";
import { LoadingAnimation } from "@/components";
import { useRouter } from "@/providers/routes.provider";
// import { useAuth } from "@/providers/auth.provider";
// import { useEffect } from "react";

const InnerRouter = () => {
    const { routes: routes, loadingRoutes } = useRouter();
    // const { currentUser, userApp } = useAuth();
    const availableRoutes = useReactRouterRoutes(routes);
    // const navigate = useNavigate();

    // useEffect(() => {
    //     if (!currentUser) return;
    //
    //     if (
    //         currentUser.type === "hacker" &&
    //         userApp &&
    //         userApp.accepted &&
    //         !currentUser.rsvpVerified
    //     ) {
    //         navigate(paths.verifyRSVP);
    //     }
    // }, [currentUser, userApp]);

    if (loadingRoutes) return <LoadingAnimation />;

    return availableRoutes;
};

export const Router = () => {
    return (
        <BrowserRouter>
            <InnerRouter />
        </BrowserRouter>
    );
};
