var http = require('http'),
    url = require('url');
var server = http.createServer().listen(8989, '0.0.0.0');
var fs = require('fs');
      fs.writeFile('result.txt','',function (err) {
          if (err) throw err;
          console.log('It\'s saved!');
      });
var ping = require("net-ping");
var session = ping.createSession();
var parents = ['192.168.1.', '192.168.2.'];

server.on('request', function(req, res) {
  var url_parts = url.parse(req.url, true);
  switch(url_parts.pathname) {
    case '/':
      res.writeHead(200, { 'Content-Type': 'text/html', 'Trailer': 'Content-MD5'});
      res.write('<html lang="zh-cn"><head><meta charset="utf8">');
      res.write('<script type="text/javascript">function sleep(n){ var start=new Date().getTime(); while(true) if(new Date().getTime()-start>n) break;}</script>');
      res.write('<script type="text/javascript">function check(){ var xmlhttp; xmlhttp=new XMLHttpRequest();xmlhttp.open("GET","/check",true); xmlhttp.send(); sleep(6000) ; location.reload();}</script>');
      res.write('<title>ip 使用情况</title></head><body>');
      res.write('<button type="button" onclick="check()">检测</button>');
      res.write('<h1>红色为ping不通的ip  </h1>');
      for (var i = 0; i < parents.length; i++) {
          targets = [];
          for (var j = 1; j < 255 ; j++) {
             targets.push(parents[i] + j); 
          }
          res.write('<div style="float: left; margin-left: 23px;">');
          res.write('<h3>' + parents[i] + 'x</h3>');
          for (var j = 0; j < targets.length; j++) {
              res.write('<a style="color: #690" id=' + targets[j].replace(/\./g,'') + '>' + targets[j] + '</a><br />');
          }
          res.write('</div>');
      }
      //res.write('<script>document.getElementById("1010215").style.color = "blue";</script>');
      res.write(fs.readFileSync('result.txt') + '');
      res.write('</body></html>');
      break;
    case '/check':
      fs.writeFile('result.txt','',function (err) {
          if (err) throw err;
          console.log('It\'s saved!');
      });
      for (var i = 0; i < parents.length; i++) {
          targets = [];
          for (var j = 1; j < 255 ; j++) {
             targets.push(parents[i] + j); 
          }
          for (var j = 0; j < targets.length; j++) {
              session.pingHost(targets[j], function(error, target){
                  if(error)
                      fs.appendFileSync('result.txt','<script>document.getElementById(' + target.replace(/\./g,'') + ').style.color = "red";</script>');
                  else
                      console.log(target + ": Alive");
              });
          }
      }
    default:
      res.write('Unknown path: ' + JSON.stringify(url_parts));
      res.writeHead(404, { 'Content-Type': 'text/plain', 'Trailer': 'Content-MD5'});
  }
  res.end();
});
console.log("server initialized");
