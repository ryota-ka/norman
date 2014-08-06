class Util

  isWind: (val) ->
    switch val
      when 0, 1, 2, 3
        return true
      else
        return false
