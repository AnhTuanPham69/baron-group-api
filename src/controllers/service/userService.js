//Firebase data
const db = require("../../config/firebaseService");
const docRef = db.collection("users");

exports.getOneUser = async (id) => {
    try {
      docRef.doc(id).get().then((data) => {
          if (data.exists) {
            const user = data.data().name
            console.log("username: "+ user);
              return user;
          } else {
              return 0;
          }
      });
    } catch (err) {
      console.log(err);
      return 0;
    }
}

exports.getListUser = async () => {
    try {
        const listUser = await docRef.get();
        const list = [];
        listUser.forEach(doc => {
          let id=doc.id;
          let data = doc.data();
          const user ={
            _id : id,
             _data: data
          }
          list.push(user);
        });
        if(!list){
          return false;
        }
        return list;
      } catch (err) {
        console.log(err);
        return false;
      }

}