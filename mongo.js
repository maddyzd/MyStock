const http = require('http');
const url = require('url');
const fs = require('fs');
const MongoClient = require('mongodb').MongoClient;

const port = process.env.PORT || 3000;
const connStr = "mongodb+srv://mdumon:mydb123@cluster0.rvujnyd.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

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
        // Get the form data
        const queryData = urlObj.query;
        const searchTerm = queryData.searchTerm || '';
        const searchType = queryData.searchType || 'name';

        // Connect to MongoDB and perform database operations
        MongoClient.connect(connStr, function(err, db) {
            if (err) { 
                console.log(err);
                res.write("Error connecting to database");
                res.end();
            } else {
                const dbo = db.db("Stock");
                const collection = dbo.collection('PublicCompanies');
                
                // Use searchType and searchTerm to query the database
                const query = searchType === "symbol" ? { "ticker": searchTerm } : { "company": searchTerm };
                
                collection.find(query).toArray(function(err, result) {
                    if (err) {
                        console.log(err);
                        res.write("Error fetching data from database");
                        res.end();
                    } else {
                        console.log("Query Result:", result);
                        res.write("Query Successful. Check console for results.");
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
