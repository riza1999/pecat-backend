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

api.post('/getSchedule', async (req,res) => {
   let {uid} = req.body;
   let kirim = [];

   employeeRef = db.collection('Employee').doc(uid);

   const snapshot = await db.collection("Schedule")
                              .where('employee_id','==', employeeRef)
                              .get();


   
   if(snapshot.empty){
      res.json({
         status: 'No Schedule',
         schedule: {}
      })
   }

   let lengthSchedule = snapshot.size;
   var ctr = 0;
   snapshot.forEach(doc =>{
      let hasil = doc.data();
      let start_date = hasil.start_date._seconds;
      let end_date = hasil.end_date._seconds;

      if(hasil.site_id){
         hasil.site_id.get().then(resp =>{
            ctr++;
            hasil.blabla = resp.data();
            let site_name = hasil.blabla.name;
            kirim.push({
               start_date: start_date,
               end_date: end_date,
               site_name: site_name
            })
            if(ctr===lengthSchedule) res.json({response: kirim});
         })
      }
   })
})

exports.api = functions.https.onRequest(api);