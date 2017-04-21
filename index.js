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

function toCurried (fn, arity, argsFn) {
  return toPartiallyAppliedCurried([], fn, arity, argsFn)
}

module.exports = toCurried
