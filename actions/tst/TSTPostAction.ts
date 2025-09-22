'use server'

import { FilterParams } from "@/components/ui/view/datal-list-view";
import { API_ENDPOINTS } from "@/constant/api/api-endpoint";
import { EAPIMethod, RequestHelper } from "@/lib/api/api-helper";
import { Post } from "@/model/tst/post";
import { updateContentPostSchema, updateNamePostSchema, updatePublished, updateThumbnailPostSchema } from "@/validations/tst/PostValidation";

export const createPost = async () => {
    const response = await RequestHelper<string>({
        method: EAPIMethod.POST,
        url: API_ENDPOINTS.TST.post.create()
    })

    return response;
}

export const getPost= async(id: string) => {
    const response = await RequestHelper<Post>({
        method: EAPIMethod.GET,
        url: API_ENDPOINTS.TST.post.get_post(id)
    })

    return response;
}

export const getPosts = async(params: FilterParams<Post>) => {
    const response = await RequestHelper<Post[]>({
        method: EAPIMethod.GET,
        url: API_ENDPOINTS.TST.post.getPosts(params)
    })

    return response;
}

export const updateTitle = async (id: string, title: string) => {
    console.log(title)
    return await RequestHelper({
        method: EAPIMethod.PUT,
        url: API_ENDPOINTS.TST.post.update_title(id),
        data: { name: title },
        validationSchema: updateNamePostSchema
    })
}

export const updateContent = async (id: string, content: string) => {
    return await RequestHelper({
        method: EAPIMethod.PUT,
        url: API_ENDPOINTS.TST.post.update_content(id),
        data: { content: content },
        validationSchema: updateContentPostSchema
    })
}

export const updateThumbnail = async (id: string, thumbnail: string) => {
    return await RequestHelper({
        method: EAPIMethod.PUT,
        url: API_ENDPOINTS.TST.post.update_thumbnail(id),
        data: { avatar_url: thumbnail },
        validationSchema: updateThumbnailPostSchema
    })
}

export const update_published = async (id: string, is_published: boolean) => {
    return await RequestHelper({
        method: EAPIMethod.PUT,
        url: API_ENDPOINTS.TST.post.update_published(id),
        data: { is_published: is_published },
        validationSchema: updatePublished
    })
}

export const deletePost = async (id: string) => {
    return await RequestHelper({
        method: EAPIMethod.DELETE,
        url: API_ENDPOINTS.TST.post.delete(id),
    })
}
