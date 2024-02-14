const { MongoClient } = require("mongodb");

async function handler(req, res) {
  if (req.method === "POST") {
    try {
      console.log(process.env.MONGODB_SRV);
      const client = await MongoClient.connect(
        "mongodb+srv://roushankumarsingh2018:Raushan@cluster0.uh9dynj.mongodb.net/meetups?retryWrites=true&w=majority"
      );
      const db = client.db();
      const meetupsCollection = db.collection("meetups");
      const result = await meetupsCollection.insertOne(req.body);
      console.log(result);
      client.close();
      res.status(201).json({ message: "Meetup added successfully" });
    } catch (error) {
      console.log(error);
    }
  }
}
export default handler;
