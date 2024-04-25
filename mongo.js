var http = require('http');
var MongoClient = require('mongodb').MongoClient;
var port = process.env.PORT || 3000;
const connStr= "mongodb+srv://mdumon:mydb123@cluster0.rvujnyd.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/html'});
    urlObj = url.parse(req.url,true)
  path = urlObj.pathname;
  if (path == "/")
  {
    file="form.html";
    fs.readFile(file, function(err, home) {
    res.write(home);
    res.end();
    }) else if (path == "/process")
  
  MongoClient.connect(connStr, function(err, db) {
    if (err) { 
      console.log(err);
      res.write("Error connecting to database");
      res.end();
    } else {
      var dbo = db.db("Stock");
      var collection = dbo.collection('PublicCompanies');
      collection.find({}).toArray(function(err, result) {
        if (err) {
          console.log(err);
          res.write("Error fetching data from database");
          res.end();
        } else {
          console.log("Success!");
          res.write("<h3>Database Connection Successful!</h3>");
          res.write("<pre>" + JSON.stringify(result, null, 2) + "</pre>");
          res.end();
        }
        db.close();
      });
    }
  });
}).listen(port);
