const MongoClient = require("mongodb").MongoClient;
const uri = process.env.MONGO_URI;
let _db;

const connectMongoDB = async () => {
  try {
    const client = await MongoClient.connect(uri, { useNewUrlParser: true });
    _db = client.db("farmersmargin-users");
    console.log("Yay! Connected with mongodb");
  } catch (err) {
    throw err;
  }
};

const getMongoDB = () => _db;

const disconnectMongoDB = () => _db.close();

module.exports = { connectMongoDB, getMongoDB, disconnectMongoDB };
