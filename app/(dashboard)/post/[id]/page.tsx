'use server'

import { getPost } from "@/actions/tst/TSTPostAction";
import { authCheck } from "@/actions/user";
import { PostDetail } from "@/components/app/dashboard/tst/post/PostDetail";
import { Metadata, ResolvingMetadata } from 'next';

interface PageProps {
    params: { id: string };
}

export async function generateMetadata(
  { params }: PageProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const id = params.id;
  const post = await getPost(id);
 
  if (!post.data) {
    return {
        title: 'Post Not Found'
    }
  }
 
  return {
    title: post.data.title,
  }
}

const Page = async ({ params }: PageProps) => {
    const authen = authCheck();
    const { id } = await params;
    const postPromise = getPost(id);

    return <PostDetail postPromise={postPromise} authPromise={authen}/>;
};

export default Page;