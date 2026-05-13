import type { QueryKey, UseMutationOptions, UseMutationResult, UseQueryOptions, UseQueryResult } from "@tanstack/react-query";
import type { City, EmergencyContacts, GetEmergencyContactsParams, GetHospitalStatsParams, GetHospitalsParams, GetRecommendationParams, HealthStatus, Hospital, HospitalStats, HospitalUpdate, NewHospital, Recommendation } from "./api.schemas";
import { customFetch } from "../custom-fetch";
import type { ErrorType, BodyType } from "../custom-fetch";
type AwaitedInput<T> = PromiseLike<T> | T;
type Awaited<O> = O extends AwaitedInput<infer T> ? T : never;
type SecondParameter<T extends (...args: never) => unknown> = Parameters<T>[1];
/**
 * @summary Health check
 */
export declare const getHealthCheckUrl: () => string;
export declare const healthCheck: (options?: RequestInit) => Promise<HealthStatus>;
export declare const getHealthCheckQueryKey: () => readonly ["/api/healthz"];
export declare const getHealthCheckQueryOptions: <TData = Awaited<ReturnType<typeof healthCheck>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof healthCheck>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof healthCheck>>, TError, TData> & {
    queryKey: QueryKey;
};
export type HealthCheckQueryResult = NonNullable<Awaited<ReturnType<typeof healthCheck>>>;
export type HealthCheckQueryError = ErrorType<unknown>;
/**
 * @summary Health check
 */
export declare function useHealthCheck<TData = Awaited<ReturnType<typeof healthCheck>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof healthCheck>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Get all supported cities
 */
export declare const getGetCitiesUrl: () => string;
export declare const getCities: (options?: RequestInit) => Promise<City[]>;
export declare const getGetCitiesQueryKey: () => readonly ["/api/cities"];
export declare const getGetCitiesQueryOptions: <TData = Awaited<ReturnType<typeof getCities>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getCities>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getCities>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetCitiesQueryResult = NonNullable<Awaited<ReturnType<typeof getCities>>>;
export type GetCitiesQueryError = ErrorType<unknown>;
/**
 * @summary Get all supported cities
 */
export declare function useGetCities<TData = Awaited<ReturnType<typeof getCities>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getCities>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Get emergency contacts for a city
 */
export declare const getGetEmergencyContactsUrl: (params?: GetEmergencyContactsParams) => string;
export declare const getEmergencyContacts: (params?: GetEmergencyContactsParams, options?: RequestInit) => Promise<EmergencyContacts>;
export declare const getGetEmergencyContactsQueryKey: (params?: GetEmergencyContactsParams) => readonly ["/api/emergency-contacts", ...GetEmergencyContactsParams[]];
export declare const getGetEmergencyContactsQueryOptions: <TData = Awaited<ReturnType<typeof getEmergencyContacts>>, TError = ErrorType<unknown>>(params?: GetEmergencyContactsParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getEmergencyContacts>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getEmergencyContacts>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetEmergencyContactsQueryResult = NonNullable<Awaited<ReturnType<typeof getEmergencyContacts>>>;
export type GetEmergencyContactsQueryError = ErrorType<unknown>;
/**
 * @summary Get emergency contacts for a city
 */
export declare function useGetEmergencyContacts<TData = Awaited<ReturnType<typeof getEmergencyContacts>>, TError = ErrorType<unknown>>(params?: GetEmergencyContactsParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getEmergencyContacts>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Get hospitals filtered by city and other criteria
 */
export declare const getGetHospitalsUrl: (params?: GetHospitalsParams) => string;
export declare const getHospitals: (params?: GetHospitalsParams, options?: RequestInit) => Promise<Hospital[]>;
export declare const getGetHospitalsQueryKey: (params?: GetHospitalsParams) => readonly ["/api/hospitals", ...GetHospitalsParams[]];
export declare const getGetHospitalsQueryOptions: <TData = Awaited<ReturnType<typeof getHospitals>>, TError = ErrorType<unknown>>(params?: GetHospitalsParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getHospitals>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getHospitals>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetHospitalsQueryResult = NonNullable<Awaited<ReturnType<typeof getHospitals>>>;
export type GetHospitalsQueryError = ErrorType<unknown>;
/**
 * @summary Get hospitals filtered by city and other criteria
 */
export declare function useGetHospitals<TData = Awaited<ReturnType<typeof getHospitals>>, TError = ErrorType<unknown>>(params?: GetHospitalsParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getHospitals>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Add a new hospital
 */
export declare const getAddHospitalUrl: () => string;
export declare const addHospital: (newHospital: NewHospital, options?: RequestInit) => Promise<Hospital>;
export declare const getAddHospitalMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof addHospital>>, TError, {
        data: BodyType<NewHospital>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof addHospital>>, TError, {
    data: BodyType<NewHospital>;
}, TContext>;
export type AddHospitalMutationResult = NonNullable<Awaited<ReturnType<typeof addHospital>>>;
export type AddHospitalMutationBody = BodyType<NewHospital>;
export type AddHospitalMutationError = ErrorType<unknown>;
/**
 * @summary Add a new hospital
 */
export declare const useAddHospital: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof addHospital>>, TError, {
        data: BodyType<NewHospital>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof addHospital>>, TError, {
    data: BodyType<NewHospital>;
}, TContext>;
/**
 * @summary Get aggregate stats for a city
 */
export declare const getGetHospitalStatsUrl: (params?: GetHospitalStatsParams) => string;
export declare const getHospitalStats: (params?: GetHospitalStatsParams, options?: RequestInit) => Promise<HospitalStats>;
export declare const getGetHospitalStatsQueryKey: (params?: GetHospitalStatsParams) => readonly ["/api/hospitals/stats", ...GetHospitalStatsParams[]];
export declare const getGetHospitalStatsQueryOptions: <TData = Awaited<ReturnType<typeof getHospitalStats>>, TError = ErrorType<unknown>>(params?: GetHospitalStatsParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getHospitalStats>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getHospitalStats>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetHospitalStatsQueryResult = NonNullable<Awaited<ReturnType<typeof getHospitalStats>>>;
export type GetHospitalStatsQueryError = ErrorType<unknown>;
/**
 * @summary Get aggregate stats for a city
 */
export declare function useGetHospitalStats<TData = Awaited<ReturnType<typeof getHospitalStats>>, TError = ErrorType<unknown>>(params?: GetHospitalStatsParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getHospitalStats>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Get AI recommendation
 */
export declare const getGetRecommendationUrl: (params?: GetRecommendationParams) => string;
export declare const getRecommendation: (params?: GetRecommendationParams, options?: RequestInit) => Promise<Recommendation>;
export declare const getGetRecommendationQueryKey: (params?: GetRecommendationParams) => readonly ["/api/hospitals/recommend", ...GetRecommendationParams[]];
export declare const getGetRecommendationQueryOptions: <TData = Awaited<ReturnType<typeof getRecommendation>>, TError = ErrorType<unknown>>(params?: GetRecommendationParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getRecommendation>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getRecommendation>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetRecommendationQueryResult = NonNullable<Awaited<ReturnType<typeof getRecommendation>>>;
export type GetRecommendationQueryError = ErrorType<unknown>;
/**
 * @summary Get AI recommendation
 */
export declare function useGetRecommendation<TData = Awaited<ReturnType<typeof getRecommendation>>, TError = ErrorType<unknown>>(params?: GetRecommendationParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getRecommendation>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Get a single hospital
 */
export declare const getGetHospitalUrl: (id: string) => string;
export declare const getHospital: (id: string, options?: RequestInit) => Promise<Hospital>;
export declare const getGetHospitalQueryKey: (id: string) => readonly [`/api/hospitals/${string}`];
export declare const getGetHospitalQueryOptions: <TData = Awaited<ReturnType<typeof getHospital>>, TError = ErrorType<void>>(id: string, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getHospital>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getHospital>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetHospitalQueryResult = NonNullable<Awaited<ReturnType<typeof getHospital>>>;
export type GetHospitalQueryError = ErrorType<void>;
/**
 * @summary Get a single hospital
 */
export declare function useGetHospital<TData = Awaited<ReturnType<typeof getHospital>>, TError = ErrorType<void>>(id: string, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getHospital>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Update hospital availability
 */
export declare const getUpdateHospitalUrl: (id: string) => string;
export declare const updateHospital: (id: string, hospitalUpdate: HospitalUpdate, options?: RequestInit) => Promise<Hospital>;
export declare const getUpdateHospitalMutationOptions: <TError = ErrorType<void>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateHospital>>, TError, {
        id: string;
        data: BodyType<HospitalUpdate>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof updateHospital>>, TError, {
    id: string;
    data: BodyType<HospitalUpdate>;
}, TContext>;
export type UpdateHospitalMutationResult = NonNullable<Awaited<ReturnType<typeof updateHospital>>>;
export type UpdateHospitalMutationBody = BodyType<HospitalUpdate>;
export type UpdateHospitalMutationError = ErrorType<void>;
/**
 * @summary Update hospital availability
 */
export declare const useUpdateHospital: <TError = ErrorType<void>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateHospital>>, TError, {
        id: string;
        data: BodyType<HospitalUpdate>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof updateHospital>>, TError, {
    id: string;
    data: BodyType<HospitalUpdate>;
}, TContext>;
export {};
//# sourceMappingURL=api.d.ts.map