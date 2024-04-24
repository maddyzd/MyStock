const MongoClient = require('mongodb').MongoClient;
const connStr= "mongodb+srv://mdumon:<password>@cluster0.rvujnyd.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
	  
console.log('hey')
  MongoClient.connect(connStr, function(err, db) {
    
  if(err) { console.log(err); }
  else {
    var dbo = db.db("Stock");
	  var collection = dbo.collection('Companies');
    console.log("Success!");
	  db.close();
  }
});