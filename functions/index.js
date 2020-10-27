const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();
const db = admin.firestore();

// Create and Deploy Your First Cloud Functions
// https://firebase.google.com/docs/functions/write-firebase-functions

exports.helloWorld = functions.https.onRequest(async(request, response) => {
  functions.logger.info("Hello logs!", {structuredData: true});
  response.send("Hello from Palangka!");
});

exports.getData = functions.https.onRequest((req, res) => {
    db.collection("Employee").get().then(function(querySnapshot){
        querySnapshot.forEach(doc => {
           console.log(doc.data());
           return res.send(doc.data());
        });
      }).catch(err => {
         console.log('Error getting documents', err);
      });
});

