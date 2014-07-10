http = require 'http'
socketio = require 'socket.io'
fs = require 'fs'

page = fs.readFileSync './index.html', 'utf-8'
script = fs.readFileSync './main.js', 'utf-8'
css = fs.readFileSync './css/style.css', 'utf-8'

server = http.createServer (req, res) ->
  switch req.url
    when '/', '/index.html'
      data = page
      contentType = 'text/html'
    when '/main.js'
      data = script
      contentType = 'text/javascript'
    when '/css/style.css'
      data = css
      contentType = 'text/css'
    else
      res.writeHead 404, {'Content-Type': 'text/html'}
      res.end '404: Not Found'
      return

  res.writeHead 200, {'Content-Type': contentType}
  res.end data

server.listen process.env.PORT || 3000

app = new App(socketio.listen(server))
app.init()
