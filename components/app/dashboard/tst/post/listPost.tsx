'use client'

import { createPost, getPosts } from "@/actions/tst/TSTPostAction";
import { DataListView, FilterParams } from "@/components/ui/view/datal-list-view"
import { ApiResponse } from "@/lib/api/api-helper";
import { AuthCheck } from "@/lib/auth";
import { Post } from "@/model/tst/post";
import { UserRole } from "@/model/user/user";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { EAlertType, useAlert } from "@/contexts/alert-context";
import PostCard from "./postCard";
import { DropdownOption } from "@/components/ui/form/base-component/dropdown";

interface ListPostProps {
    userInforPromise: Promise<ApiResponse<AuthCheck>>;
}

export const ListPost = ({ userInforPromise }: ListPostProps) => {
    const [userAuth, setUserAuthen] = useState<AuthCheck | undefined>(undefined);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isCreating, setIsCreating] = useState(false);

    const router = useRouter();
    const showAlert = useAlert();

    useEffect(() => {
        const checkAuth = async () => {
            try {
                if (isCreating) return;
                setIsCreating(true);
                const response = await userInforPromise;
                setIsCreating(false);
                setUserAuthen(response.data);
            } catch (error) {
                console.error("Authentication check failed:", error);
                setUserAuthen(undefined);
            } finally {
                setIsLoading(false);
            }
        };

        checkAuth();
    }, [userInforPromise]);

    const publishedOptions: DropdownOption[] = [
        {
            label: "All",
            value: '',
        },
        {
            label: "Published",
            value: 'true',
        },
        {
            label: "Unpublished",
            value: 'false',
        },
    ];

    if (isLoading) {
        return null;
    }

    return (
        <div className="w-full flex">
            <DataListView<Post>
                header={{
                    actions: [
                        {
                            text: "Create new post",
                            condition: userAuth?.user?.role == UserRole.Admin,
                            onClick: async () => {
                                const response = await createPost();
                                if (response.meta.success && response.data) {
                                    router.replace(`/post/${response.data}`);
                                    return;
                                }

                                showAlert(response.meta.external_message, EAlertType.ERROR)
                            },
                        }
                    ],
                    filters: [
                        {
                            key: "is_published",
                            options: publishedOptions,
                            placeholder: "Published",
                            enable: userAuth?.user?.role == UserRole.Admin,
                        }
                    ]
                }}
                fetchData={getPosts}
                card={{
                    content: (item) => <PostCard post={item} />,
                    className: "grid-cols-1 gap-6"
                }}
                onRowClick={((post) => router.push(`/post/${post.id}`))}
            />
        </div>
    );
};
