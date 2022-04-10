const express = require('express');
const cors = require('cors');
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config();
const { MongoClient, ServerApiVersion } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.znysc.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run() {
    try { 
      await client.connect();
      const database = client.db("TravelWarrior")
      const packageCollection = database.collection('package')
      const orderCollection = database.collection('order')
      // insert data using post
      app.post('/package',async(req,res)=>{
        const package = req.body.data;
        const result = await packageCollection.insertOne(package)
        res.json(result)
      }) 
      // get data
      app.get('/allPackages',async(req,res)=>{
        const allPackages = packageCollection.find({})
        const result = await allPackages.toArray()
        res.send(result)
      })
      // find a service using id
      app.get('/package/:id',async(req,res)=>{
        const id = req.params.id
        const query = {_id : ObjectId(id)}
        const result  = await packageCollection.findOne(query)
        res.send(result)
      })
      // add Order 
      app.post('/placeOrder',async(req,res)=>{
         const order =  req.body.data;
         const result = await orderCollection.insertOne(order)
         res.send(result)
      })
      // my orders
      app.get('/orders',async(req,res)=>{
       const orders = orderCollection.find({});
       const allOrders = await orders.toArray()
       res.send(allOrders)
      })
      // delete order
      app.delete('/deleteOrder/:id',async(req,res)=>{
        const id = req.params.id;
        const query = {_id:ObjectId(id)}
        const result = await orderCollection.deleteOne(query)
        res.send(result)
      })
    } finally {
      // Ensures that the client will close when you finish/error
    //   await client.close();
    }
  }
  run().catch(console.dir);
app.get('/',(req,res)=>{
    res.send('Travel Warrior Server is Running ')
});

app.listen(port,()=>{
    console.log('Running Port',port)
});