'use client'

import React, { useEffect, useState, useTransition } from "react"; // Added useTransition
import { Post } from "@/model/tst/post";
import { PostTitle } from "./postTitle";
import { ApiResponse } from "@/lib/api/api-helper";
import { deletePost, updateContent, updateTitle, update_published } from "@/actions/tst/TSTPostAction"; // Added update_published
import { EAlertType, useAlert } from "@/contexts/alert-context";
import { AuthCheck } from "@/lib/auth";
import { UserRole } from "@/model/user/user";
import PostContent from "./postContent";
import Button from "@/components/ui/common/button/button";
import { SaveIcon, ShareIcon } from "@/components/icons";
import PostThumbnail from "./postThumnail";
import { formatDate } from "@/utils/date";
import { useRouter } from "next/navigation";
import { Toggle } from "@/components/ui/form/base-component/toggle";

interface PostDetailProps {
  postPromise: Promise<ApiResponse<Post | undefined>>;
  authPromise: Promise<ApiResponse<AuthCheck>>
}

export const PostDetail: React.FC<PostDetailProps> = ({ postPromise, authPromise }) => {
  const [post, setPost] = useState<Post | undefined>(undefined);
  const [content, setContent] = useState<string>('');
  const [hasContentChanged, setHasContentChanged] = useState(false);
  const [auth, setAuth] = useState<AuthCheck | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [isPublished, setIsPublished] = useState(false); // State for published status
  const [isPending, startTransition] = useTransition(); // For toggle loading state

  const showAlert = useAlert();
  const router = useRouter();

  useEffect(() => {
    let isMounted = true;
    Promise.all([postPromise, authPromise]).then(([postRes, authRes]) => {
      if (!isMounted) return;
      setPost(postRes.data);
      setContent(postRes.data?.content || '');
      setAuth(authRes.data);
      setIsPublished(postRes.data?.is_published || false); // Initialize isPublished
      setLoading(false);
    });
    return () => {
      isMounted = false;
    };
  }, [postPromise, authPromise]);

  const handleTitleChange = async (title: string) => {
    if (!post) return;
    if (title == post.name) return;

    const response = await updateTitle(post?.id, title || '')

    if (!response.meta.success) {
      showAlert(response.meta.external_message, EAlertType.ERROR);
    }
  };

  const handleContentChange = (newContent: string) => {
    setContent(newContent);
    setHasContentChanged(newContent !== (post?.content || ''));
  };

  const handleSaveContent = async () => {
    if (!post) return;
    const response = await updateContent(post.id, content)
    if (!response.meta.success) {
      showAlert(response.meta.external_message, EAlertType.ERROR);
      return
    }
    setHasContentChanged(false);
  };

  const handleDeletePost = async () => {
    if (!post) return;
    const reponse = await deletePost(post.id);

    if (!reponse.meta.success) {
      showAlert(reponse.meta.external_message, EAlertType.ERROR);
    }

    router.push('/');
  }

  const handleTogglePublished = async (checked: boolean) => {
    if (!post) return;
    setIsPublished(checked); // Optimistic update
    startTransition(async () => {
      const response = await update_published(post.id, checked);
      if (!response.meta.success) {
        setIsPublished(!checked); // Revert on failure
        showAlert(response.meta.external_message || "Failed to update published status.", EAlertType.ERROR);
      }
    });
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!post) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px] text-center">
        <svg width="48" height="48" fill="none" className="mb-4 text-gray-400" viewBox="0 0 24 24">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" fill="currentColor" />
        </svg>
        <h2 className="text-2xl font-bold mb-2 text-text-promary">Post not found</h2>
        <p className="text-text-secondary">The post you are looking for does not exist or has been removed.</p>
      </div>
    );
  }

  return (
    <article className="w-full">
      <PostTitle title={post.name} onChange={handleTitleChange} allowEdit={auth?.user?.role == UserRole.Admin} />

      <div className="flex items-center justify-between mt-2 mb-4 pl-2">
        <p className="text-sm text-text-secondary">
          {post.created_at ? formatDate(post.created_at) : 'Unknown'}
        </p>
        <div className="flex gap-2 items-center"> {/* Added items-center for vertical alignment */}
          {auth?.user?.role == UserRole.Admin && (
            <Toggle
              label="Published"
              value={isPublished}
              onChange={handleTogglePublished}
              disabled={isPending}
              color={isPublished ? "blue" : "red"}
            />
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              if (navigator.share) {
                navigator.share({
                  title: post.name,
                  text: 'Check out this post',
                  url: window.location.href
                });
              } else {
                navigator.clipboard.writeText(window.location.href);
                showAlert('Link copied to clipboard!', EAlertType.SUCCESS);
              }
            }}
          >
            Share {ShareIcon}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              if (!auth?.isAuthenticated) {
                showAlert("You need to login to save blog", EAlertType.WARNING)
              }
            }}
          >
            Save {SaveIcon}
          </Button>
        </div>
      </div>

      <PostThumbnail
        post={post}
        allowEdit={auth?.user?.role == UserRole.Admin}
      />

      <div className="w-full mt-4">
        <PostContent
          content={content}
          onChange={handleContentChange}
          allowEdit={auth?.user?.role == UserRole.Admin}
        />

        <div className="mt-4 flex items-end justify-end gap-2">
          {hasContentChanged && (
            <Button
              variant="primary"
              size="md"
              onClick={handleSaveContent}
            >
              Save Content
            </Button>
          )}
          {auth?.user?.role == UserRole.Admin &&
            <Button
              variant="danger"
              size="md"
              onClick={handleDeletePost}
            >
              delete
            </Button>
          }
        </div>
      </div>
    </article>
  );
};
