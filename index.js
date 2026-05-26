const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
dotenv.config();
const uri = process.env.MONGODB_URI;
const app = express();
const PORT = process.env.PORT || 8000;
app.use(cors());
app.use(express.json());

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

    const database = client.db("ideavault");
    const ideasCollection = database.collection("ideas");

    // Get Api
    app.get("/idea", async (req, res) => {
      const result = await ideasCollection.find().toArray();
      res.json(result);
    });

    // Post Api
    app.post("/idea", async (req, res) => {
      const ideaData = req.body;
      console.log(ideaData);
      const result = await ideasCollection.insertOne(ideaData);
      res.json(result);
    });
    

    // Idea Details page Get  Api
    app.get("/idea/:id", async (req, res) => {
      const { id } = req.params;
      const result = await ideasCollection.findOne({_id: new ObjectId(id)})
      res.json(result)
    });

     // Idea Details Updated Api
   app.patch("/idea/:id", async (req, res) => {
    const { id } = req.params;
    const updatedData = req.body
    const result = await ideasCollection.updateOne(
        
        {_id: new ObjectId(id)},
        {$set: updatedData }

    )

    res.json(result)
   })


    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!",
    );
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

// Get Api
app.get("/", (req, res) => {
  res.send("Hello, World!");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
