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
  const ref = change.after.ref.parent;

  console.log('deleteItemDoneTrue', `ItemID: ${itemId} -
    its before value: ${before.done} -
    its after value: ${after.done} -
    its time until delete: ${after.timeDone}`);
  if((before.done === false) && (after.done === true)){
    return ref.once("value", function(snapshot){
      var updates = {};
      snapshot.forEach(function(child){
        console.log('deleteItemDoneTrue', `is child done?: ${child.done}`);
        if(child.done === true){
          console.log('deleteItemDoneTrue', `childs time: ${child.timeDone}`);
          if((child.timeDone +1 ) === 10){
            udates[child.key] = null;
          }else{
            updates[child.timeDone] = child.timeDone +1;
          }
        }
      });
      return ref.update(updates);
    });
  }else return null;
});
