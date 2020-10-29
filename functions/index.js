const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();
const db = admin.firestore();

const express = require('express');
const api = express();
const bodyParser = require('body-parser');

const cors = require('cors')({origin: true});
api.use(cors);
api.use(bodyParser.json());
api.use(bodyParser.urlencoded({ extended: true }));

api.post('/login', async (req,res) => {
   let {email,password} = req.body;

   const snapshot = await db.collection("Employee")
                              .where('email','==', email)
                              .where('password','==', password)
                              .get();

   if(snapshot.empty){
      //jika password dan email salah
      res.json({
         success: false,
         info: 'Invalid email or password',
         employee: {}
      });
   }

   const uid = snapshot.docs[0].id;
   snapshot.forEach(doc =>{
      let user = doc.data();
      let {name,email} = user;

      if(user.job_id) {
         user.job_id.get().then(resp => {
            user.blabla = resp.data();
            let job_name = user.blabla.name;

            //jika normal
            res.json({
               success: true,
               employee: {
                  uid: uid,
                  name: name,
                  email: email,
                  job_name: job_name
               }
            });
         })
      }else{
         //jika tidak ada job_id
         res.json({
            success: true,
            employee: {
               uid: uid,
               name: name,
               email: email
            }
         });
      }
   })
})


exports.api = functions.https.onRequest(api);