/**
 * @name toCurried
 * @kind function
 * @summary Convert JavaScript function to curried function.
 *
 * @description
 * Transform the function into [functional programming]{@link https://en.wikipedia.org/wiki/Functional_programming}
 * friendly function, like those in [`lodash`]{@link https://github.com/lodash/lodash/wiki/FP-Guide}
 * and [`date-fns`]{@link https://date-fns.org/docs/FP-Guide},
 * which support [currying]{@link https://en.wikipedia.org/wiki/Currying}
 * and functional-style [function composing]{@link https://medium.com/making-internets/why-using-chain-is-a-mistake-9bc1f80d51ba}.
 *
 * If `arity` is 0, `toCurried` calls a function immediately and returns its result.
 *
 * @param {Function} fn - the function to convert
 * @param {Number} arity - the number of arguments of the resulted curried function
 * @param {Function} [argsFn] - callback that transforms the list of arguments
 * @returns {Function|*} the resulted curried function (or the constant if `arity` is 0)
 * @throws {RangeError} `arity` must be non-negative number
 *
 * @example
 * import toCurried from 'to-curried'
 *
 * function map (mapFn, xs) {
 *   return xs.map(mapFn)
 * }
 *
 * const curriedMap = toCurried(map, 2)
 * const multiplyEachBy2 = curriedMap(x => x * 2)
 * console.log(multiplyEachBy2([1, 2, 3, 4]))
 * //=> [2, 4, 6, 8]
 *
 * @example
 * // Change an order of arguments in curried function with optional callback:
 * import toCurried from 'to-curried'
 *
 * function reduce (xs, reduceFn, initialValue) {
 *   return xs.reduce(reduceFn, initialValue)
 * }
 *
 * const curriedReduce = toCurried(reduce, 3, args => args.reverse())
 * const sum = curriedReduce(0, (a, b) => a + b)
 * console.log(sum([1, 2, 3, 4]))
 * // => 10
 */
function toCurried (fn, arity, argsFn) {
  if (arity >= 0) {
    return toPartiallyAppliedCurried([], fn, arity, argsFn)
  }

  throw new RangeError('`arity` must be non-negative number')
}

function toPartiallyAppliedCurried (a, fn, arity, argsFn) {
  if (a.length >= arity) {
    var args = a.slice(0, arity)
    return fn.apply(null, argsFn ? argsFn(args) : args)
  }

  return function () {
    var args = Array.prototype.slice.call(arguments)
    return toPartiallyAppliedCurried(a.concat(args), fn, arity, argsFn)
  }
}

module.exports = toCurried
