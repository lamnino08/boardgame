import { guestAuthCheck } from "@/actions/graduate/guestAction";
import { AuthCheck } from "@/lib/auth";
import { NextResponse } from "next/server";

export interface PageRoute {
    path: string;
    CheckPermission: (request?: Request, params?: Record<string, string>) => Promise<NextResponse | void>;
}

export const pageRoutes: Record<string, PageRoute> = {
    sign_in: {
        path: "/auth/:path*",
        CheckPermission: async (request) => {
            const auth = await AuthCheck();
            if (auth.isAuthenticated) {
                return NextResponse.redirect(new URL("/", request?.url));
            }
        },
    },
    admin: {
        path: "/admin/:path*",
        CheckPermission: async (request) => {
            const auth = await AuthCheck();
            if (!auth.isAuthenticated) {
                return NextResponse.redirect(new URL("/auth/sign-in", request?.url));
            }
            if (auth.user?.role !== "admin") {
                return NextResponse.redirect(new URL("/", request?.url));
            }
        },
    },
    chat: {
        path: "/social/chat/:path*",
        CheckPermission: async (request) => {
            const auth = await AuthCheck();
            if (!auth.isAuthenticated) {
                return NextResponse.redirect(new URL("/auth/sign-in", request?.url));
            }
        },
    },
    social: {
        path: "/social/:path*",
        CheckPermission: async (request) => {
            const auth = await AuthCheck();
            if (!auth.isAuthenticated) {
                return NextResponse.redirect(new URL("/auth/sign-in", request?.url));
            }
        },
    },
    graduate: {
        path: "/graduate",
        CheckPermission: async (request) => {
            const guestAuth = await guestAuthCheck();
            if (guestAuth.isAuthenticated) {
                return NextResponse.redirect(new URL("/graduate/letter", request?.url));
            }
        }
    },
    graduate_in: {
        path: "/graduate/letter",
        CheckPermission: async (request) => {
            const guestAuth = await guestAuthCheck();
            if (!guestAuth.isAuthenticated) {
                console.log("herer");
                return NextResponse.redirect(new URL("/graduate", request?.url));
            }
        }
    }
};

/**
 * Generate a regex pattern from the route path and extract parameter names.
 * @param path - Route path with placeholders, e.g., "/boardgame/:gameId/update".
 * @returns An object containing the regex and parameter names.
 */
const createRouteRegex = (path: string) => {
    const paramNames: { name: string; isWildcard: boolean }[] = [];

    const regexPath = path.replace(/:([^/*]+)(\*)?/g, (_, paramName, isWildcard) => {
        paramNames.push({ name: paramName, isWildcard: Boolean(isWildcard) });
        return isWildcard ? "(.*)" : "([^/]+)";
    });

    return {
        regex: new RegExp(`^${regexPath}$`), // Full regex for matching
        paramNames, // List of parameters with information on whether they are wildcards
    };
};

/**
 * Match the current pathname with defined routes and extract parameters.
 * @param pathname - The URL pathname (e.g., "/boardgame/14/update").
 * @param request - The request object for permission checking.
 * @returns {Promise<NextResponse | null>} - Permission result.
 */
export const checkPagePermission = async (
    pathname: string,
    request: Request
): Promise<NextResponse | null> => {
    for (const route of Object.values(pageRoutes)) {
        const { regex, paramNames } = createRouteRegex(route.path);
        // console.log("Testing Pathname:", pathname);
        // console.log("Regex:", regex);

        const match = pathname.match(regex);

        if (match) {
            // console.log("Matched Route:", route.path);

            // Extract parameters
            const params = paramNames.reduce<Record<string, string>>((acc, { name }, index) => {
                acc[name] = match[index + 1];
                return acc;
            }, {});

            // console.log("Extracted Params:", params);

            // Check permissions for the matched route
            const response = await route.CheckPermission(request, params);
            if (response instanceof NextResponse) {
                return response;
            }
        }
    }

    return null;
};
