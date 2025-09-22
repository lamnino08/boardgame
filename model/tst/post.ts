import { BaseModel } from "../base/base-model";

export interface Post extends BaseModel {
    name?: string;
    content?: string;
    avatar_url?: string;
    created_by_details: {
        id: number;
        name: string;
    };
    is_published: boolean;
}