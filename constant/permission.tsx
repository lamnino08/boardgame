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
    finance: {
        path: "/finance/:path*",
        CheckPermission: async (request) => {
            const auth = await AuthCheck();
            if (!auth.isAuthenticated) {
                return NextResponse.redirect(new URL("/auth/sign-in", request?.url));
            }   
        },
    }
};

/**
 * Generate a regex pattern from the route path and extract parameter names.
 * @param path - Route path with placeholders, e.g., "/boardgame/:gameId/update".
 * @returns An object containing the regex and parameter names.
 */
const createRouteRegex = (path: string) => {
    const paramNames: { name: string; isWildcard: boolean }[] = [];

    const wildcardEndMatch = path.match(/^(.*)\/:([^/*]+)\*$/);
    if (wildcardEndMatch) {
        const base = wildcardEndMatch[1];
        const paramName = wildcardEndMatch[2];
        paramNames.push({ name: paramName, isWildcard: true });
        const regexPath = `${base}(?:\/(.*))?`;
        return {
            regex: new RegExp(`^${regexPath}$`),
            paramNames,
        };
    }

    // Mặc định như cũ
    const regexPath = path.replace(/:([^/*]+)(\*)?/g, (_, paramName, isWildcard) => {
        paramNames.push({ name: paramName, isWildcard: Boolean(isWildcard) });
        return isWildcard ? "(.*)" : "([^/]+)";
    });

    return {
        regex: new RegExp(`^${regexPath}$`),
        paramNames,
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

            const params = paramNames.reduce<Record<string, string>>((acc, { name }, index) => {
                acc[name] = match[index + 1];
                return acc;
            }, {});

            // console.log("Extracted Params:", params);

            const response = await route.CheckPermission(request, params);
            if (response instanceof NextResponse) {
                return response;
            }
        }
    }

    return null;
};
