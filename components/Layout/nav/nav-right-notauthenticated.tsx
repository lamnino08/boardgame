'use client';

import Button from "@/components/ui/common/button/button";
import { useRouter } from "next/navigation";

export const NavRightNotAuthenticated = () => {
    const router = useRouter();

    return (
        <div className="flex space-x-4 items-center">
            <Button
                variant="outline"
                onClick={() => router.push("/auth/sign-in")}
            >
                Sign in
            </Button>
            <Button
                variant="primary"
                onClick={() => router.push("/auth/sign-up")}
            >
                Sign up
            </Button>
        </div>
    );
};
