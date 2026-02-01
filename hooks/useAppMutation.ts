import { useMutation, UseMutationResult, useQueryClient } from '@tanstack/react-query';
import { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import { apiClient } from '../service/api';
import { toast } from 'sonner';

interface MutationParams<TData, TResponse> {
    endpoint: string;
    invalidateTags?: string[] | string[][];
    id?: string;
    method: 'post' | 'patch' | 'delete';
    data?: TData;
    config?: AxiosRequestConfig;
    toastOnError?: boolean;
    toastOnSuccess?: boolean;
    onSuccess?: (data: AxiosResponse<TResponse>) => void;
    onError?: (error: unknown) => void;
}

export const useAppMutation = <TData, TResponse>(): UseMutationResult<
    AxiosResponse<TResponse>,
    unknown,
    MutationParams<TData, TResponse>
> => {
    const axios = apiClient;

    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ endpoint, method, data, config, id = '' }) => {
            try {
                const response = axios[method](`/${endpoint}${id ? `/${id}` : ''}`, data, config);
                return response;
            } catch (error) {
                throw error;
            }
        },
        onError(error, variables) {
            if (error instanceof AxiosError) {
                if (variables.toastOnError ?? true) {
                    const message = error.response?.data?.message;
                    if (message instanceof Object && 'message' in message) {
                        toast.error(message.message);
                    } else if (typeof message === 'string') {
                        toast.error(message);
                    } else {
                        toast.error(error.message);
                    }
                }
            } else if (error instanceof Error) {
                (variables.toastOnError ?? true) && toast.error(`${error.message}`);
            }

            variables.onError?.(error);
            console.log(error)
        },
        onSuccess(data, variables) {
            if (variables.invalidateTags?.length) {
                if (variables.invalidateTags[0] instanceof Array) {
                    for (const tag of variables.invalidateTags) {
                        queryClient.invalidateQueries({
                            queryKey: tag as string[],
                        })
                    }
                } else {
                    queryClient.invalidateQueries({
                        queryKey: variables.invalidateTags as string[],
                    })
                }
            }

            variables.onSuccess?.(data);
            (variables.toastOnSuccess ?? true) && toast.success(data.data.message ?? 'Success!');
        },
    })
};