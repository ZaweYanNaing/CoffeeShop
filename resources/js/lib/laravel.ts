export type LaravelResourceCollection<T> = { data: T[] } | T[];

export function unwrapResourceCollection<T>(payload: LaravelResourceCollection<T> | unknown): T[] {
    if (Array.isArray(payload)) {
        return payload;
    }

    if (payload && typeof payload === 'object' && 'data' in payload && Array.isArray((payload as any).data)) {
        return (payload as any).data as T[];
    }

    return [];
}

