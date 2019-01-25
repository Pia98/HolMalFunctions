const functions = require('firebase-functions');

// The Firebase Admin SDK to access the Firebase Realtime Database.
const admin = require('firebase-admin');
admin.initializeApp();

//this function triggers the realtime database
//it is called if an item is updated
//the timeDone of each item in the same household gets incremented
//only 10 done items will be saved
exports.deleteItemDoneTrue = functions.database.ref('/item/{itemId}')
.onUpdate((change, context) => {
  const itemId = context.params.itemId;
  const before = change.before.val();
  const after = change.after.val();
  const belongsToList = after.belongsTo;
  const ref = change.after.ref.parent;

  console.log('deleteItemDoneTrue', `ItemID: ${itemId} -
    its before value: ${before.done} -
    its after value: ${after.done} -
    its time until delete: ${after.timeDone}`);
  if((before.done === false) && (after.done === true)){
    return ref.once("value", function(snapshot){
      var updates = {};
      snapshot.forEach(function(child){
        console.log('deleteItemDoneTrue', `is child?: ${child.val().done}`);
        var value = child.val();
        if((value.done === true) && (value.belongsTo === belongsToList)){
          console.log('deleteItemDoneTrue', `childs time: ${value.timeDone}`);
          if((value.timeDone +1 ) > 10){
            updates[child.key] = null;
          }else{
            updates[child.key + "/timeDone"] = value.timeDone +1;
          }
        }
      });
      return ref.update(updates);
    });
  }else if((before.done === true) && (after.done === false)){
    return change.after.ref.update({ timeDone: 0 });
  }else return null;
});
