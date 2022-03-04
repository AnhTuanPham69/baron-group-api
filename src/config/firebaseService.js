const { initializeApp, applicationDefault, cert } = require('firebase-admin/app');
const { getFirestore, Timestamp, FieldValue } = require('firebase-admin/firestore');
const serviceAccount = 
require("./learnex-application-6e09b-firebase-adminsdk-p1igi-2bc0bc970c.json");
initializeApp({
    credential: cert(serviceAccount)
  });
  const db = getFirestore();

module.exports = db;

