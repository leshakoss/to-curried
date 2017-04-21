# `to-curried`

Transforms your functions into [functional programming](https://en.wikipedia.org/wiki/Functional_programming)
friendly functions, like those in [`lodash`](https://github.com/lodash/lodash/wiki/FP-Guide)
and [`date-fns`](https://date-fns.org/docs/FP-Guide),
which support [currying](https://en.wikipedia.org/wiki/Currying)
and functional-style [function composing](https://medium.com/making-internets/why-using-chain-is-a-mistake-9bc1f80d51ba).

```javascript
import toCurried from 'to-curried'

function map (mapFn, xs) {
  return xs.map(mapFn)
}

const curriedMap = toCurried(
  map, // function to transform
  2 // number of arguments of the resulted curried function
)

const multiplyEachBy2 = curriedMap(x => x * 2)

console.log(multiplyEachBy2([1, 2, 3, 4]))
//=> [2, 4, 6, 8]
```

Change an order of arguments in curried function with optional callback:

```javascript
import toCurried from 'to-curried'

function reduce (xs, reduceFn, initialValue) {
  return xs.reduce(reduceFn, initialValue)
}

const curriedReduce = toCurried(reduce, 3, args => args.reverse())

const sum = curriedReduce(0, (a, b) => a + b)

console.log(sum([1, 2, 3, 4]))
// => 10
```
