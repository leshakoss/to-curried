const assert = require('assert')
const toCurried = require('.')

describe('toCurried', function () {
  function fn (a, b, c) {
    return 'a b c'
      .replace('a', a)
      .replace('b', b)
      .replace('c', c)
  }

  context('no `argsFn` specified', function () {
    context('arity of converted function === arity of initial function', function () {
      it('allows arguments to be curried (and reverses their order)', function () {
        var curriedFn = toCurried(fn, 3)
        assert.equal(curriedFn(1)(2)(3), '1 2 3')
      })

      it('allows to group arguments', function () {
        var curriedFn = toCurried(fn, 3)
        assert.equal(curriedFn(1, 2)(3), '1 2 3')
        assert.equal(curriedFn(1)(2, 3), '1 2 3')
      })

      it('allows the function to be called with all arguments in the reversed order', function () {
        var curriedFn = toCurried(fn, 3)
        assert.equal(curriedFn(1, 2, 3), '1 2 3')
      })

      it('ignores calls without curried arguments', function () {
        var curriedFn = toCurried(fn, 3)
        assert.equal(curriedFn()()(1, 2)()()(3), '1 2 3')
      })

      it('ignores extra curried arguments in the last group', function () {
        var curriedFn = toCurried(fn, 3)
        assert.equal(curriedFn(1, 2, 3, 4, 5, 6), '1 2 3')
        assert.equal(curriedFn(1)(2)(3, 4, 5, 6), '1 2 3')
      })
    })

    context('arity of converted function < arity of initial function', function () {
      it('calls the initial function with a short list of arguments', function () {
        var curriedFn = toCurried(fn, 2)
        assert.equal(curriedFn(1)(2), '1 2 undefined')
        assert.equal(curriedFn(1, 2), '1 2 undefined')
      })

      it('ignores extra curried arguments in the last group', function () {
        var curriedFn = toCurried(fn, 2)
        assert.equal(curriedFn(1)(2, 3), '1 2 undefined')
        assert.equal(curriedFn(1, 2, 3), '1 2 undefined')
      })
    })

    context('arity of converted function > arity of initial function', function () {
      it('works, but ignores the extra arguments', function () {
        var curriedFn = toCurried(fn, 4)
        assert.equal(curriedFn(1)(2)(3)(4), '1 2 3')
        assert.equal(curriedFn(1, 2, 3, 4), '1 2 3')
      })
    })

    context('arity of converted function === 0', function () {
      it('returns the constant instead of function', function () {
        var result = toCurried(fn, 0)
        assert.equal(result, 'undefined undefined undefined')
      })
    })
  })

  context('`argsFn` is specified', function () {
    context('`argsFn` is `(args) => args.reverse()`', function () {
      function argsFn (args) {
        return args.reverse()
      }

      context('arity of converted function === arity of initial function', function () {
        it('allows arguments to be curried (and reverses their order)', function () {
          var curriedFn = toCurried(fn, 3, argsFn)
          assert.equal(curriedFn(3)(2)(1), '1 2 3')
        })

        it('allows to group arguments', function () {
          var curriedFn = toCurried(fn, 3, argsFn)
          assert.equal(curriedFn(3, 2)(1), '1 2 3')
          assert.equal(curriedFn(3)(2, 1), '1 2 3')
        })

        it('allows the function to be called with all arguments in the reversed order', function () {
          var curriedFn = toCurried(fn, 3, argsFn)
          assert.equal(curriedFn(3, 2, 1), '1 2 3')
        })

        it('ignores calls without curried arguments', function () {
          var curriedFn = toCurried(fn, 3, argsFn)
          assert.equal(curriedFn()()(3, 2)()()(1), '1 2 3')
        })

        it('ignores extra curried arguments in the last group', function () {
          var curriedFn = toCurried(fn, 3, argsFn)
          assert.equal(curriedFn(3, 2, 1, 0, -1, -2), '1 2 3')
          assert.equal(curriedFn(3)(2)(1, 0, -1, -2), '1 2 3')
        })
      })

      context('arity of converted function < arity of initial function', function () {
        it('calls the initial function with a short list of arguments', function () {
          var curriedFn = toCurried(fn, 2, argsFn)
          assert.equal(curriedFn(2)(1), '1 2 undefined')
          assert.equal(curriedFn(2, 1), '1 2 undefined')
        })

        it('ignores extra curried arguments in the last group', function () {
          var curriedFn = toCurried(fn, 2, argsFn)
          assert.equal(curriedFn(3)(2, 1), '2 3 undefined')
          assert.equal(curriedFn(3, 2, 1), '2 3 undefined')
        })
      })

      context('arity of converted function > arity of initial function', function () {
        it('works, but ignores the extra arguments', function () {
          var curriedFn = toCurried(fn, 4, argsFn)
          assert.equal(curriedFn(4)(3)(2)(1), '1 2 3')
          assert.equal(curriedFn(4, 3, 2, 1), '1 2 3')
        })
      })

      context('arity of converted function === 0', function () {
        it('returns the constant instead of function', function () {
          var result = toCurried(fn, 0, argsFn)
          assert.equal(result, 'undefined undefined undefined')
        })
      })
    })

    context('`argsFn` is `([c, d, b, a]) => ([a, b, c, d])`', function () {
      function argsFn (args) {
        return [args[3], args[2], args[0], args[1]]
      }

      function abcdFn (a, b, c, d) {
        return 'a b c d'
          .replace('a', a)
          .replace('b', b)
          .replace('c', c)
          .replace('d', d)
      }

      it('works as expected', function () {
        var cdbaFn = toCurried(abcdFn, 4, argsFn)
        assert.equal(cdbaFn(3)(4)(2)(1), '1 2 3 4')
      })
    })
  })

  context('examples from README', function () {
    describe('the first example', function () {
      it('works as expected', function () {
        function map (mapFn, xs) {
          return xs.map(mapFn)
        }

        var curriedMap = toCurried(map, 2)
        var multiplyEachBy2 = curriedMap(function(x) {return x * 2})

        assert.deepEqual(multiplyEachBy2([1, 2, 3, 4]), [2, 4, 6, 8])
      })
    })

    describe('the second example', function () {
      it('works as expected', function () {
        function reduce (xs, reduceFn, initialValue) {
          return xs.reduce(reduceFn, initialValue)
        }

        var curriedReduce = toCurried(reduce, 3, function (args) {return args.reverse()})
        var sum = curriedReduce(0, function (a, b) {return a + b})

        assert.equal(sum([1, 2, 3, 4]), 10)
      })
    })
  })
})
