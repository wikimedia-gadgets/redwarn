/*
 * Assistance type declarations and other syntactic sugar.
 */

/**
 * Accepts T and promises returning T.
 */
declare type PromiseOrNot<T> = Promise<T> | T;
/**
 * Accepts T and arrays containing T.
 */
declare type ArrayOrNot<T> = T | T[];
