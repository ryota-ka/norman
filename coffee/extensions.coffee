Object.defineProperty Array.prototype, 'diff',
  value: (arr) ->
    return @.filter (i) ->
      return i not in arr


Object.defineProperty Array.prototype, 'keys',
  value: ->
    Object.keys(@)


Object.defineProperty Array.prototype, 'count',
  value: ->
    return @keys().length


Object.defineProperty Object.prototype, 'empty',
  value: ->
    return @count() == 0


Object.defineProperty Array.prototype, 'first',
  value: ->
    for key of @
      return @[key]


Object.defineProperty Array.prototype, 'last',
  value: ->
    keys = @keys()
    arr = @clean()
    return arr[keys[keys.length] - 1]


Object.defineProperty Array.prototype, 'clean',
  value: ->
    arr = []
    for elm in @
      arr.push elm if elm?
    return arr

Object.defineProperty Array.prototype, 'shuffle',
  value: ->
    i = @count()
    while (i)
        j = Math.floor(Math.random() * i)
        t = @[--i]
        @[i] = @[j]
        @[j] = t
    return @
