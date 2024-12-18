/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_MEDIA_SEARCH_API_URL: string;
    readonly VITE_MEDIA_BORROWING_API_URL: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}