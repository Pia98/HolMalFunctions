const functions = require('firebase-functions');

// The Firebase Admin SDK to access the Firebase Realtime Database.
const admin = require('firebase-admin');
admin.initializeApp();

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
 exports.helloWorld = functions.https.onRequest((request, response) => {
   console.log('helloWorld', 'Hello World!');
  response.send("Hello from Firebase!");
 });

exports.deleteItemDoneTrue = functions.database.ref('/item/{itemId}')
.onUpdate((change, context) => {
  const itemId = context.params.itemId;
  const before = change.before.val();
  const after = change.after.val();
  console.log('deleteItemDoneTrue', `ItemID: ${itemId} -
    its before value: ${before} -
    its after value: ${after}`);
  if((before.done === false) && (after.done === true)){
    return admin.database.ref('/item/' + itemId).remove();
  }else return null;
})
