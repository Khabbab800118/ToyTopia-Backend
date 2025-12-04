const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 3000;
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

// middleware
app.use(cors());
app.use(express.json());

// mongodb
const uri =
  "mongodb+srv://toytopia-admin:7UF4vhBeq8TjFmBg@cluster0.lgceapw.mongodb.net/?appName=Cluster0";

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});
async function run() {
  try {
    await client.connect();

    const db = client.db("toytopia-db");
    const toyCollection = db.collection("toys");
    const userCollection = db.collection("users");

    // create user
    app.post("/users", async (req, res) => {
      const newUser = req.body;
      const result = await userCollection.insertOne(newUser);
      res.send(result);
    });

    // create
    app.post("/toys", async (req, res) => {
      const newToy = req.body;
      const result = await toyCollection.insertOne(newToy);
      res.send(result);
    });

    // get all products
    app.get("/toys", async (req, res) => {
      const email = req.query.email;
      let query = {};
      if (email) {
        query = { sellerEmail: email };
      }
      const cursor = toyCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });

    // read
    app.get("/toys/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await toyCollection.findOne(query);
      res.send(result);
    });

    // update
    app.patch("/toys/:id", async (req, res) => {
      const id = req.params.id;
      const updatedToy = req.body;
      const query = { _id: new ObjectId(id) };
      const updateDoc = {
        $set: updatedToy,
      };
      const result = await toyCollection.updateOne(query, updateDoc);
      res.send(result);
    });

    // delete
    app.delete("/toys/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await toyCollection.deleteOne(query);
      res.send(result);
    });

    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("running");
});
app.listen(port, () => {
  console.log(`port:${port}`);
});

// 7UF4vhBeq8TjFmBg
// toytopia-admin
