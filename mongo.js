var http = require('http');
var url = require('url'); // Added 'url' module import
var fs = require('fs'); // Added 'fs' module import
var MongoClient = require('mongodb').MongoClient;
var port = process.env.PORT || 3000;
const connStr= "mongodb+srv://mdumon:mydb123@cluster0.rvujnyd.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

http.createServer(function (req, res) {
    res.writeHead(200, {'Content-Type': 'text/html'});
    var urlObj = url.parse(req.url, true); // Added 'var' keyword before 'urlObj'
    var path = urlObj.pathname;

    if (path == "/") {
        file = "form.html";
        fs.readFile(file, function(err, home) {
            if (err) {
                console.error("Error reading file:", err);
                res.writeHead(500, {'Content-Type': 'text/plain'});
                res.end("Error loading HTML file.");
            } else {
                res.write(home);
                res.end();
            }
        });
    } else if (path == "/process") { // Corrected the else if syntax
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
    } else {
        res.writeHead(404, {'Content-Type': 'text/plain'});
        res.end("Not Found");
    }
}).listen(port, () => {
    console.log(`Server running on port ${port}`);
});
