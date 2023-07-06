const MongoClient = require('mongodb').MongoClient,
      Hash = require('../utility/hash.js'),
      container = require('../di/main.js');

const crypt = container.resolve('crypt');

const uri = `mongodb://${process.env.DBHOST}:${process.env.DBPORT}/${process.env.DBNAME}`;

let client = new MongoClient(
  uri,
  { useNewUrlParser: true }
  ), db = null;

const init = async () => {
  try {
    await client.connect();
    db = client.db(process.env.DBNAME);
    if(process.env.TRUNCATE==='true'){
      console.log('Flushing data!');
      await truncate();
    }
  } catch (error) {
    console.log(error);
  }
};

const verifyCredentials = async ({email, phoneNumber}) => {
  let returnValue = false;
  try{
    const users = db.collection('users');
    const user = await users.findOne({
      $or: [
        { email: crypt.encrypt(email) },
        { phoneNumber: crypt.encrypt(phoneNumber) }
        ] } );
    if (user) {
      returnValue = true;
    }
  }
  catch(error){
    returnValue = true;
    console.log(error);
  }
  return returnValue;
};

const userExists = async (email, password) => {
  let returnValue={error: 'user could not be found'};
  try {
    const users = db.collection('users');
    const user = await users.findOne( { email: crypt.encrypt(email) } );
    if (user && await Hash.check(password, user.salt, user.password)){
        delete user._id
        returnValue = { data: user };
    }
  }
  catch (error) {
    returnValue = { error };
  }
  return returnValue;
};

const createUser = async user => {
  let returnValue = {};
  try {
    const users = db.collection('users');
    const hps = await Hash.hash(user.password);
    await users.insertOne({
      userId: user.userId, firstName: crypt.encrypt(user.firstName),
      lastName: crypt.encrypt(user.lastName), salt: hps.salt,
      email: crypt.encrypt(user.email), password: hps.password,
      age: user.age, phoneNumber: crypt.encrypt(user.phoneNumber)
    });
    returnValue = {hps};
  } catch (error) {
    console.log(error);
    returnValue = {error};
  }
  return returnValue;
};

const updateUser = async (userId, user) => {
  let returnValue = null;
  try {
    const users = db.collection('users');
    const result = await users.updateOne({ userId }, { $set: user });
    if (result.matchedCount !== 1){
      returnValue = 'user not found';
    }
  } catch (error) {
    returnValue = error;
  }
  return returnValue;
};

const updatePassword = async (user, newPassword) => {
  let returnValue = 'user not found';
  try{
    const users = db.collection('users');
    const hps = await Hash.hash(newPassword, user.salt);
    const result = await users.updateOne({ userId: user.userId }, { $set: { password: hps.password } });
    if (result.matchedCount === 1){
      returnValue = null;
    }
  }
  catch(error){
    console.log(error);
    returnValue = error;
  }
  return returnValue;
}

const truncate = async () => {
  try{
    await db.collection('users').drop();
  }
  catch(error){
    console.log(error);
  }
}

module.exports={
  init, verifyCredentials, userExists,
  createUser, updateUser, updatePassword
};