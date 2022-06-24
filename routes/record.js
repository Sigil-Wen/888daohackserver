const { response } = require("express");
const express = require("express");
 
// recordRoutes is an instance of the express router.
// We use it to define our routes.
// The router will be added as a middleware and will take control of requests starting with path /record.
const recordRoutes = express.Router();
 
// This will help us connect to the database
const dbo = require("../db/conn");
 
// This help convert the id from string to ObjectId for the _id.
const ObjectId = require("mongodb").ObjectId;
 
 // TODO: Adding the routes for servicing NFT metadata
recordRoutes.route('/').get((req,response) => {
  response.json("Hello world! Welcome to the 888dao hackathon backend :3 ")
})

// This section will help you get a list of all the records.
recordRoutes.route("/record").get(function (req, res) {
 let db_connect = dbo.getDb("users");
 db_connect
   .collection("users")
   .find({})
   .toArray(function (err, result) {
     if (err) throw err;
     res.json(result);
   });
});
 
// This section will help you get a single record by id
recordRoutes.route("/record/:id").get(function (req, res) {
 let db_connect = dbo.getDb();
 let myquery = { _id: ObjectId( req.params.id )};
 db_connect
     .collection("users")
     .findOne(myquery, function (err, result) {
       if (err) throw err;
       res.json(result);
     });
});
 
// This section will help you create a new record.
recordRoutes.route("/record/add").post(function (req, response) {
 let db_connect = dbo.getDb();
 let myobj = {
   name: req.body.name,
   year: req.body.year,
   address: req.body.address,
   email: req.body.email,
 };
 db_connect.collection("users").insertOne(myobj, function (err, res) {
   if (err) throw err;
   response.json(res);
 });
});
 
// This section will help you update a record by id.
recordRoutes.route("/update/:id").post(function (req, response) {
 let db_connect = dbo.getDb(); 
 let myquery = { _id: ObjectId( req.params.id )}; 
 let newvalues = {   
   $set: {     
    name: req.body.name,
    year: req.body.year,
    address: req.body.address,
    email: req.body.email,  
   }, 
  }
});

//Trying to create a new route that updates eth via addresses 
recordRoutes.route("/address/:address").post(function (req, response) {
  let db_connect = dbo.getDb(); 
  let myquery = { _id: ObjectId( req.params.address )}; 
  let newvalues = {   
    $set: {     
     name: req.body.name,
     year: req.body.year,
     address: req.body.address,
     email: req.body.email,  
    }, 
   }
 });
 
// This section will help you delete a record
recordRoutes.route("/:id").delete((req, response) => {
 let db_connect = dbo.getDb();
 let myquery = { _id: ObjectId( req.params.id )};
 db_connect.collection("records").deleteOne(myquery, function (err, obj) {
   if (err) throw err;
   console.log("1 document deleted");
   response.json(obj);
 });
});



recordRoutes.route('/metadata/:ethaddress').get((req,response) => {

  let db_connect = dbo.getDb();
  let myquery = { address: String( req.params.ethaddress )};
  db_connect
      .collection("users")
      .findOne(myquery, function (err, result) {
        if (err) throw err;
        let nftMetadata = {}
        nftMetadata.name = result.name + " | Year of the " + convertToZodiac(result.year);
        nftMetadata.description = "Okay this is epic"
        nftMetadata.image = "https://i.redd.it/a1zcxisgjls71.png" //Need to build a way to serve the image :0 
        nftMetadata.animation_url = "https://i.redd.it/a1zcxisgjls71.png" // Not needed at the moment
        nftMetadata.external_url = "https://i.redd.it/a1zcxisgjls71.png"
        nftMetadata.attributes = "{}"
        response.json(nftMetadata);
      });

})

// This section will query the image.
recordRoutes.route("/image").post(function (req, response) {

});


// Create routes to accesss images 

//Date to zodiac conversions
function convertToZodiac(year){
  let zodiac = [
    "Rat",
    "Ox",
    "Tiger",
    "Rabbit",
    "Dragon",
    "Snake",
    "Horse",
    "Goat",
    "Monkey",
    "Rooster",
    "Dog",
    "Pig"
  ]
  return zodiac[(year - 4) % 12]
}

 
module.exports = recordRoutes;