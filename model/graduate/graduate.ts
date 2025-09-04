import { BaseModel } from "@/model/base/base-model";

export interface GuestAuthCheck {
    isAuthenticated: boolean;
    guest?: GuestAuthen
}

export interface GuestAuthen {
    id: string;
    name: string;
}

export interface Message extends BaseModel {
    content: string
}

export interface Memory extends BaseModel {
    caption: string,
    images: MemoryImage[],
}

export interface MemoryImage extends BaseModel {
    memory_id: string;
    image_url: string;
}
