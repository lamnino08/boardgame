import z from "zod";

export const updateNamePostSchema = z.object({
    name: z.string().max(100, "Title of post must not exceed 100 charaters")
})

export const updateContentPostSchema = z.object({
    content: z.string()
});

export const updateThumbnailPostSchema = z.object({
    avatar_url: z.string()
});

export const updatePublished = z.object({
    is_published: z.boolean(),
});
