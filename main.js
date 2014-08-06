(function() {
  $(function() {
    var s;
    s = io.connect('http://localhost:3000');
    console.dir(s);
    s.on('connect', function() {});
    s.on('disconnect', function() {});
    s.on('msg', function(data) { console.log(data); });
    return $('#rooms').children().on('click', function() {
      var index, list;
      console.log('hello!');
      index = $('#rooms').children().index(this);
      list = [405, 403, 402, 401, 305, 303, 302, 301, 205, 203, 202, 201, 105, 103, 102];
      if (index >= 0 && index <= 14) {
        return s.emit('room', list[index]);
      }
    });
  });

}).call(this);
