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
      const result = await ideasCollection.findOne({ _id: new ObjectId(id) });
      res.json(result);
    });

    // Idea Details Updated Api
    app.patch("/idea/:id", async (req, res) => {
      const { id } = req.params;
      const updatedData = req.body;
      const result = await ideasCollection.updateOne(
        { _id: new ObjectId(id) },
        { $set: updatedData },
      );

      res.json(result);
    });

    // Delete Api
    app.delete("/idea/:id", async (req, res) => {
      const { id } = req.params;
      const result = await ideasCollection.deleteOne({ _id: new ObjectId(id) });

      res.json(result);
    });

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
  res.send(`
    <!DOCTYPE html>
    <html lang="bn">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to My Server</title>
        <style>
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }
            body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                height: 100vh;
                display: flex;
                justify-content: center;
                align-items: center;
                color: #fff;
            }
            .welcome-card {
                background: rgba(255, 255, 255, 0.1);
                backdrop-filter: blur(10px);
                border: 1px solid rgba(255, 255, 255, 0.2);
                padding: 3rem 2rem;
                border-radius: 20px;
                text-align: center;
                box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.3);
                max-width: 500px;
                width: 90%;
                animation: fadeIn 1.5s ease-in-out;
            }
            h1 {
                font-size: 2.5rem;
                margin-bottom: 1rem;
                letter-spacing: 1px;
            }
            p {
                font-size: 1.1rem;
                color: #e0e0e0;
                line-height: 1.6;
                margin-bottom: 2rem;
            }
            .status-badge {
                display: inline-block;
                background: #4ade80;
                color: #111827;
                padding: 0.5rem 1.5rem;
                border-radius: 50px;
                font-weight: bold;
                font-size: 0.9rem;
                text-transform: uppercase;
                box-shadow: 0 4px 15px rgba(74, 222, 128, 0.4);
            }
            @keyframes fadeIn {
                from { opacity: 0; transform: translateY(-20px); }
                to { opacity: 1; transform: translateY(0); }
            }
        </style>
    </head>
    <body>

        <div class="welcome-card">
            <h1>👋 স্বাগতম!</h1>
            <p>আপনার Express.js সার্ভারটি সফলভাবে রান হয়েছে। এটি এখন ক্লায়েন্ট রিকোয়েস্ট গ্রহণ করার জন্য সম্পূর্ণ প্রস্তুত।</p>
            <span class="status-badge">Server is Online</span>
        </div>

    </body>
    </html>
  `);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
