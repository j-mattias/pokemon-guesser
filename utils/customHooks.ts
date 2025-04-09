import { useCallback } from "react";

// Get a new searchParams string by merging the current searchParams with
// a provided key/value pair.
export const useCreateQueryString = (searchParams: URLSearchParams) => {
    return useCallback(
        (query: string, value: string, clearParams = false) => {
            // If clearParams is true, remove all previous params (ex. page)
            const params = clearParams
                ? new URLSearchParams()
                : new URLSearchParams(searchParams.toString());
            params.set(query, value);

            return params.toString();
        },
        [searchParams]
    );
};
