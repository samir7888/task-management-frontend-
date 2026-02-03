import { apiClient } from '@/service/api';
import { keepPreviousData, useQuery, UseQueryOptions } from '@tanstack/react-query';
import axios from "axios";

export type UseFetchDataOptions<TData> = {
    queryKey: string[],
    endpoint: string;
    queryString?: string,
    options?: Omit<UseQueryOptions<TData>, 'queryKey' | 'queryFn'>
}

/**
 * Custom hook to fetch data using React Query.
 * @param {string} queryKey - Unique key for the query.
 * @param {Object} options - Additional options for the useQuery hook.
 * @returns {Object} - Contains data, error, loading status, etc.
 */

export const useFetchData = <TData>({
    queryKey,
    options,
    queryString = '',
    endpoint,
}: UseFetchDataOptions<TData>) => {
    const url = `/${endpoint}${queryString ? `?${queryString}` : ''}`;
    return useQuery<TData>({
        queryKey: queryKey,
        queryFn: async () => {
            const response = await apiClient.get<TData>(url);
            return response.data;
        },
        placeholderData: keepPreviousData,
        ...options,
    });
};