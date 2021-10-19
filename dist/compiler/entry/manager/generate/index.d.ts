declare type page = {
    path: string;
    root?: string;
    independent?: boolean;
};
declare type entry = {
    path: string;
    root?: string;
    page: boolean;
    name: string;
    components: Record<string, entry>;
};
export default function generateEntry(pages: page[], getName: (params: {
    path: string;
    root?: string;
    component?: boolean;
}) => string): entry[];
export {};
