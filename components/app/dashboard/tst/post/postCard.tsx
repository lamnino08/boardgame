import Image from "next/image";
import { Calendar } from "lucide-react";
import { Post } from "@/model/tst/post";

interface PostCardProps {
    post: Post;
    onClick?: () => void;
}

export default function PostCard({ post, onClick }: PostCardProps) {
    return (
        <div className="flex w-full">
            {/* Thumbnail bên trái */}
            {post.avatar_url && (
                <div className="relative w-48 h-36 flex-shrink-0">
                    <Image
                        src={post.avatar_url}
                        alt={post.name || ""}
                        fill
                        className="object-cover"
                    />
                </div>
            )}

            {/* Nội dung bên phải */}
            <div className="flex flex-col justify-between p-4 flex-1">
                <div className="space-y-2">
                    {/* Tiêu đề */}
                    <h3 className="text-base font-semibold line-clamp-2">
                        {post.name}
                    </h3>

                    {/* Ngày tạo */}
                    <div className="flex items-center text-sm text-muted-foreground space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>
                            {new Date(post.created_at).toLocaleDateString("vi-VN", {
                                day: "2-digit",
                                month: "2-digit",
                                year: "numeric",
                            })}
                        </span>
                    </div>

                    {/* Trích nội dung */}
                    <p
                        className="text-sm text-muted-foreground line-clamp-2"
                        dangerouslySetInnerHTML={{ __html: post.content || "" }}
                    />
                </div>
            </div>
        </div>
    );
}
