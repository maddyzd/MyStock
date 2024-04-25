const http = require('http');
const MongoClient = require('mongodb').MongoClient;

const port = process.env.PORT || 3000;
const connStr = "your-mongodb-connection-string"; // Update with your MongoDB connection string

http.createServer(function (req, res) {
    res.writeHead(200, {'Content-Type': 'text/plain'});

    const path = req.url;

    if (path === "/process") {
        MongoClient.connect(connStr, function(err, db) {
            if (err) { 
                console.log(err);
                res.write("Error connecting to database");
                res.end();
            } else {
                const dbo = db.db("Stock"); // Update with your database name
                const collection = dbo.collection('PublicCompanies'); // Update with your collection name
                console.log("Connected to database");

                db.close();
                res.write("Connected to database");
                res.end();
            }
        });
    } else {
        res.writeHead(404, {'Content-Type': 'text/plain'});
        res.end("Not Found");
    }
}).listen(port, () => {
    console.log(`Server running on port ${port}`);
});
