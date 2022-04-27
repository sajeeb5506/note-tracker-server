

const express = require('express');
const { json } = require('express/lib/response');
const app = express();
const { MongoClient, ServerApiVersion ,ObjectId} = require('mongodb');
const cors = require('cors');
const port = process.env.PORT || 5000;
require('dotenv').config()

//middlewear
app.use(cors());
app.use(express.json());






const uri = `mongodb+srv://${process.env.NOTE_USER}:${process.env.NOTE_PASS}@cluster0.4qb7o.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
    try{
        await client.connect();
        const noteColection =  client.db("notesTracker").collection("notes");
        console.log('connected to db...')

         //get api to read all notes

          app.get('/notes', async(req,res)=>{
            const q =req.query
            const cursor = noteColection.find(q);
            const result = await cursor.toArray();


            res.send(result);
          })


         //creat notesTracker
          app.post('/note',async(req,res)=>{
                
        const data= req.body;
        const result = await noteColection.insertOne(data);

       
            res.send(result);

          })

         //update notesTracker

         app.put('/note/:id',async(req,res)=>{
             const id = req.params.id
             const data= req.body;
             const filter = { _id: ObjectId(id) };
             const options = { upsert: true };
             const updateDoc = {
                $set: {
                  user:data.user,text:data.text,
                },
              };
              const result = await noteColection.updateOne(filter, updateDoc, options);
              res.send(result);
         })
 


         //delete notesTracker

         app.delete('/note/:id',async(req,res)=>{  
             const id  = req.params.id;
             const  data = req.body;
              const filter = {_id:ObjectId(id)}
              const result = await noteColection.deleteOne(filter);
              res.send(result);

         })
 


    }
    finally{
        // await client.close();
    }
}
run().catch(console.dir);

app.get('/',(req,res)=>{
 
    res.send('hello world!!')
})


app.listen(port, ()=>{
    console.log('ok done',port);

});


