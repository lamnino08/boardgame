export const TypeByLink = (url: string) : string => {
    const extension = url.split('.').pop()?.toUpperCase() || "UNKNOWN";
    return extension;
}