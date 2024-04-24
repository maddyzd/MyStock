var http = require('http');
var url = require('url');
var qs = require('querystring');
var MongoClient = require('mongodb').MongoClient;
var port = process.env.PORT || 3000;
const connStr = "mongodb+srv://mdumon:mydb123@cluster0.rvujnyd.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

http.createServer(function (req, res) {
    res.writeHead(200, { 'Content-Type': 'text/html' });

    // Parse the URL and extract the path
    var urlObj = url.parse(req.url, true);
    var path = urlObj.pathname;

    if (path === "/") {
        // Serve the HTML form
        fs.readFile('form.html', function (err, form) {
            if (err) {
                console.error("Error reading file:", err);
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end("Error loading HTML file.");
            } else {
                res.write(form);
                res.end();
            }
        });
    } else if (path === "/process" && req.method === "POST") {
        // Handle form submission
        var body = '';
        req.on('data', chunk => { body += chunk.toString(); });
        req.on('end', () => {
            var formData = qs.parse(body);
            var searchTerm = formData.searchTerm || '';
            var searchType = formData.searchType || 'name'; // Default to search by name

            MongoClient.connect(connStr, function (err, db) {
                if (err) {
                    console.log(err);
                    res.write("Error connecting to database");
                    res.end();
                } else {
                    var dbo = db.db("Stock");
                    var collection = dbo.collection('PublicCompanies');
                    var query = searchType === "name" ? { "company": searchTerm } : { "ticker": searchTerm };
                    collection.find(query).toArray(function (err, result) {
                        if (err) {
                            console.log(err);
                            res.write("Error fetching data from database");
                            res.end();
                        } else {
                            console.log("Success!");
                            res.write("<h3>Search Results</h3>");
                            result.forEach(function (doc) {
                                res.write(`<p>Company: ${doc.company}, Ticker: ${doc.ticker}, Price: ${doc.price}</p>`);
                            });
                            res.end();
                        }
                        db.close();
                    });
                }
            });
        });
    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end("Not Found");
    }
}).listen(port, () => {
    console.log(`Server running on port ${port}`);
});
