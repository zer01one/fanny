/**
 * Функциональная библиотека
 * @module FH
 */

; (function (name, definition) {
    if (typeof module !== 'undefined') module.exports = definition();
    else if (typeof define === 'function' && typeof define.amd === 'object') define(definition);
    else this[name] = definition();
}('FH', /** @lends module:FH */ function () {
    /**
     * Returns a curried version of the given function. The curried function takes a variable number of arguments
     * and returns a new function that takes the remaining arguments until the function is fully applied.
     *
     * @param {function} func - The function to be curried.
     * @return {function} A curried version of the given function.
     */
    function curry(func, prevParams = []) {
        return function (...params) {
            if (func.length <= (prevParams.length || 0) + params.length) return func(...prevParams, ...params);
            return curry(func, [...prevParams, ...params]);
        }
    }

    /**
     * A function that composes multiple functions into a single function.
     *
     * @param {function} funcs - The functions to compose.
     * @return {function} The composed function.
     */
    function compose(...funcs) {
        return function (param) {
            return funcs.reduceRight((arg, func) => func(arg), param);
        }
    }

    /**
     * A function that takes a function as a parameter and returns a new function that executes the given function and returns the parameter.
     *
     * @param {function} func - The function to be executed.
     * @return {function} A function that executes the given function and returns the parameter.
     */
    function identify(func) {
        return function (param) {
            return (func(), param);
        }
    }

    /**
     * A function that takes a function as a parameter and returns a new function that executes the given function and returns the parameter.
     *
     * @param {function} func - The function to be executed.
     * @return {function} A function that executes the given function and returns the parameter.
     */
    function tap(func) {
        return function (param) {
            return (func(param), param);
        }
    }

    /**
     * A function that takes multiple functions as arguments and applies each one to the parameter until one returns a truthy value.
     *
     * @param {function} func - A function to apply to the parameter.
     * @return {function} The first function that returns a truthy value when applied to the parameter.
     */
    function alt(...funcs) {
        return function (param) {
            return funcs.map(func => func(param)).find(Boolean);
        }
    }

    /**
     * Returns a function that executes a sequence of functions with a given parameter.
     *
     * @param {...function} funcs - The functions to be executed in sequence.
     * @return {function} A function that takes a parameter and executes the given functions in sequence.
     */
    function seq(...funcs) {
        return function (param) {
            funcs.forEach(func => func(param));
        }
    }

    /**
     * Returns a function that executes a sequence of functions with a given parameter.
     *
     * @param {function} join - The function to join the results of the executed functions.
     * @param {...function} funcs - The functions to be executed in sequence.
     * @return {function} A function that takes a parameter and executes the given functions in sequence.
     */
    function fork(join, ...funcs) {
        return function (param) {
            return join(...funcs.map(func => func(param)));
        }
    }

    /**
     * A function that takes multiple functions as arguments and applies each one to the parameter until one returns a truthy value.
     *
     * @param {function} alt - A function to handle errors or alternate behavior.
     * @param {function} func - The main function to apply to the parameter.
     * @return {function} A function that handles the execution of the functions.
     */
    function safe(alt, func) {
        return function (param) {
            try {
                return func(param);
            } catch (e) {
                return alt(e);
            }
        }
    }

    /**
     * A function that takes a function and returns a new function that returns a promise
     * after applying the given function to the parameter.
     *
     * @param {function} func - The function to be executed.
     * @return {function} A function that returns a promise.
     */
    function promising(func) {
        return function (param) {
            return new Promise((resolve, reject) => {
                safe(reject, compose(resolve, func))(param);
            })
        }
    }

    const cThen = curry(function (func, promise) {
        return promise.then(func);
    });

    const cCatch = curry(function (func, promise) {
        return promise.catch(func);
    });

    return {
        curry,
        compose,
        identify,
        tap,
        alt,
        seq,
        fork,
        safe,
        promising,
        cThen,
        cCatch
    }
}));