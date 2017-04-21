# `to-curried`

Convert JavaScript function to curried function.

## `toCurried(fn, arity, [argsFn])` ⇒ `function`|`*`

Transform the function into [functional programming](https://en.wikipedia.org/wiki/Functional_programming)
friendly function, like those in [`lodash`](https://github.com/lodash/lodash/wiki/FP-Guide)
and [`date-fns`](https://date-fns.org/docs/FP-Guide),
which support [currying](https://en.wikipedia.org/wiki/Currying)
and functional-style [function composing](https://medium.com/making-internets/why-using-chain-is-a-mistake-9bc1f80d51ba).

If `arity` is 0, `toCurried` calls a function immediately and returns its result.

**Returns**: `function`|`*` - the resulted curried function (or the constant if `arity` is 0)
**Throws**:

- `RangeError` `arity` must be non-negative number

**Arguments**:

| Param    | Type       | Description                                              |
|----------|------------|----------------------------------------------------------|
| fn       | `function` | the function to convert                                  |
| arity    | `number`   | the number of arguments of the resulted curried function |
| [argsFn] | `function` | callback that transforms the list of arguments           |

**Example**
```js
import toCurried from 'to-curried'

function map (mapFn, xs) {
  return xs.map(mapFn)
}

const curriedMap = toCurried(map, 2)
const multiplyEachBy2 = curriedMap(x => x * 2)
console.log(multiplyEachBy2([1, 2, 3, 4]))
//=> [2, 4, 6, 8]
```

**Example**
```js
// Change an order of arguments in curried function with optional callback:
import toCurried from 'to-curried'

function reduce (xs, reduceFn, initialValue) {
  return xs.reduce(reduceFn, initialValue)
}

const curriedReduce = toCurried(reduce, 3, args => args.reverse())
const sum = curriedReduce(0, (a, b) => a + b)
console.log(sum([1, 2, 3, 4]))
// => 10
```
