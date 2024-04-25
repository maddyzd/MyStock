const http = require('http');
const url = require('url');
const fs = require('fs');
const MongoClient = require('mongodb').MongoClient;

const port = process.env.PORT || 3000;
const connStr = "your_mongodb_connection_string"; // Replace with your actual MongoDB connection string

http.createServer(function (req, res) {
    res.writeHead(200, {'Content-Type': 'text/html'});

    const urlObj = url.parse(req.url, true);
    const path = urlObj.pathname;

    if (path === "/") {
        fs.readFile('form.html', function(err, form) {
            if (err) {
                console.error("Error reading file:", err);
                res.writeHead(500, {'Content-Type': 'text/plain'});
                res.end("Error loading HTML file.");
            } else {
                res.write(form);
                res.end();
            }
        });
    } else if (path === "/process" && req.method === "GET") {
        const searchTerm = urlObj.query.searchTerm || '';
        const searchType = urlObj.query.searchType || 'name'; 

        MongoClient.connect(connStr, function(err, db) {
            if (err) { 
                console.log(err);
                res.write("Error connecting to database");
                res.end();
            } else {
                const dbo = db.db("Stock");
                const collection = dbo.collection('PublicCompanies');
                
                const query = searchType === "symbol" ? { "ticker": searchTerm } : { "company": searchTerm };

                collection.find(query).toArray(function(err, result) {
                    if (err) {
                        console.log(err);
                        res.write("Error fetching data from database");
                        res.end();
                    } else {
                        console.log("Success!");
                        res.write("<h3>Search Results</h3>");
                        result.forEach(function(doc) {
                            res.write(`<p>Company: ${doc.company}, Symbol: ${doc.ticker}, Price: ${doc.price}</p>`);
                        });
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
