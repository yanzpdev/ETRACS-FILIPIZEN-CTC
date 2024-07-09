import { openDatabaseAsync } from 'expo-sqlite';
import uuid from 'react-native-uuid';
import CryptoES from "crypto-es";

const secretKey = process.env.EXPO_PUBLIC_SECRET_KEY;

export const setupDatabase = async () => {
  try {
    const db = await openDatabaseAsync('users.db');
    await db.execAsync(
      `
        PRAGMA journal_mode = WAL;
        CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, email TEXT, password TEXT, ticketsIssued INTEGER DEFAULT 0);
        CREATE TABLE IF NOT EXISTS session (id INTEGER PRIMARY KEY AUTOINCREMENT, userId INTEGER, token TEXT, FOREIGN KEY(userId) REFERENCES users(id));
        CREATE TABLE IF NOT EXISTS violators (id INTEGER PRIMARY KEY AUTOINCREMENT, userId INTEGER, firstName TEXT, middleName TEXT, lastName TEXT, contactNum TEXT, email TEXT, address TEXT, violations TEXT, signature TEXT, FOREIGN KEY(userId) REFERENCES users(id));
      `
    );
    // INSERT INTO users (email, password) VALUES ('admin', '123');
    // DELETE FROM violators where (id = '13');

    // INSERT INTO violators (firstName, middleName, lastName, contactNum, address, violations, signature ) 
    // VALUES (
    //   'Arris Ian', 
    //   'Durana', 
    //   'Peralta', 
    //   '09667954151', 
    //   'Cebu City, Cebu', 
    //   'testViolation', 
    //   'testSignature' 
    // );

    // await db.execAsync(
    //   `DELETE from users where (email = "peraltaarris07@gmail.com");`
    // );
    
    return db;
  } 
  
  catch (error) {
    console.error('Error setting up database:', error);
    return null;
  }    
};

const generateToken = (userId) => {
  const rawToken = uuid.v4() + userId.toString();
  const encryptedToken = CryptoES.AES.encrypt(rawToken, secretKey).toString();
  return encryptedToken;
};

export const validateLogin = async (email, password, callback) => {
  const db = await setupDatabase();

  try {
    if (!db) {
      console.error('validateLogin - Database not initialized.');
      callback(false);
      return;
    }

    else {
      console.log('Database initialized successfully.');
      const result = await db.getAllAsync('SELECT * FROM users WHERE email = ?', [email]);

      if (result.length === 0) {
        callback('doesNotExist');
      } 
      
      else {
        const user = result[0];
        if (password === '') {
          callback('emptyPassword');
        } 
        
        else if (user.password !== password) {
          callback('wrongPassword');
        } 
        
        else {
          const token = generateToken(user.id);
          await db.runAsync('INSERT INTO session (userId, token) VALUES (?, ?)', user.id, token); 
          callback(true);
          const tokenData = await db.getAllAsync('SELECT * from session');
          // console.log('token data - server side: ', tokenData);
        }
      }
    }
  } 
  
  catch (error) {
    console.error('Error validating login:', error);
    callback(false);
  }
};

export const saveTicketRecord = async (userId, record) => {
  const db = await setupDatabase();
  
  try {
    if (!db) {
      console.error('saveTicketRecord - Database not initialized.');
      callback(null);
      return;
    }

    const violationsJson = JSON.stringify(record.violations);
    await db.runAsync(`
      INSERT INTO violators (userId, fullName, contactNum, address, violations, signature) VALUES (?, ?, ?, ?, ?, ?)
      `, userId, record.fullName, record.contactNum, record.address, violationsJson, record.signature
    ); 
    const res = await db.getAllAsync('SELECT * FROM violators where userId = ?', userId);
    console.log("violators: ", JSON.parse(res[0].violations));
  }

  catch (error) {
    console.error('Error inserting ticket data:', error);
    return null;
  }   
}

export const countOffense = async (userId, violation) => {
  const db = await setupDatabase();

  try {
    const res = await db.getAllAsync('SELECT violations FROM violators where userId = ?', userId);
    console.log(res);
  }

  catch (error) {

  }
}

export const getSession = async (callback) => {
  const db = await setupDatabase();

  try {
    if (!db) {
      console.error('getSession - Database not initialized.');
      callback(null);
      return;
    }

    const result = await db.getAllAsync(
      'SELECT users.id, users.email, session.token FROM session JOIN users ON session.userId = users.id LIMIT 1;' // check code again for error ";"
    );

    if (result.length > 0) {
      callback(result[0]);
    } 
    
    else {
      callback(null);
    }
  } 
  
  catch (error) {
    console.error('Error fetching session:', error);
    callback(null);
  }
};

export const clearSession = async () => {
  const db = await setupDatabase();

  try {
    if (!db) {
      console.error('clearSession - Database not initialized.');
      return;
    }

    await db.execAsync('DELETE FROM session');
    console.log('Session cleared successfully.');
  } 
  
  catch (error) {
    console.error('Error clearing session:', error);
  }
};

export const displayUsers = async () => {
  const db = await setupDatabase();

  try {
    if (!db) {
      console.error('displayUsers - Database not initialized.');
      return;
    }

    const result = await db.execAsync('SELECT * FROM users');
    return result;
  } 
  
  catch (error) {
    console.error('Error clearing session:', error);
  }
}

export const displayTickets = async () => {
  const db = await setupDatabase();

  try {
    if (!db) {
      console.error('displayUsers - Database not initialized.');
      return;
    }

    const result = await db.execAsync('SELECT * FROM violators');
    return result;
  } 
  
  catch (error) {
    console.error('Error clearing session:', error);
  }
}

export const checkViolatorExists = async (firstName, middleName, lastName) => {
  const db = await setupDatabase();
  const query = 'SELECT * FROM violators WHERE firstName LIKE ? ORDER BY firstName ASC';
  const patternFirstName = `%${firstName}%`;
  const patternMiddleName = `%${middleName}%`;
  const patternLastName = `%${lastName}%`;
  const result = await db.getAllAsync(query, [patternFirstName, patternMiddleName, patternLastName]);
  
  return result;
}
