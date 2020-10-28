const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();
const db = admin.firestore();

const express = require('express');
const api = express();

const cors = require('cors')({origin: true});
api.use(cors);

api.get('/cat', (req, res) => {
   res.send('CAT');
});

api.get('/getDataEmployee', (req,res) => {
   db.collection("Employee").get().then(function(querySnapshot){
      querySnapshot.forEach(doc => {
         let hasil = doc.data();
         let {name,email} = hasil;

         if(hasil.job_id) {
            hasil.job_id.get().then(resp => {
               hasil.blabla = resp.data();
               let job_name = hasil.blabla.name;

               return res.json({
                  name: name,
                  email: email,
                  job_name: job_name
               });
            })
         }else{
            return res.json({
               name: name,
               email: email
            });
         }
      });
    }).catch(err => {
       console.log('Error getting documents', err);
    });
})

exports.api = functions.https.onRequest(api);