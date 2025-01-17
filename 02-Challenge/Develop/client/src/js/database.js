import { openDB } from 'idb';

// Initialize the database
const initdb = async () =>
  openDB('jate', 1, {
    upgrade(db) {
      if (db.objectStoreNames.contains('jate')) {
        console.log('jate database already exists');
        return;
      }
      db.createObjectStore('jate', { keyPath: 'id', autoIncrement: true });
      console.log('jate database created');
    },
  });

// Add logic to a method that accepts some content and adds it to the database
export const putDb = async (content) => {
  console.log('PUT to the database');

  // Create a connection to the database and specify the version
  const jateDb = await openDB('jate', 1);

  // Create a new transaction and specify the database and data privileges
  const tx = jateDb.transaction('jate', 'readwrite');

  // Open the desired object store
  const store = tx.objectStore('jate');

  // Use the .put() method to add or update content in the database
  const request = store.put({ id: 1, value: content }); // Always use id: 1 to overwrite the existing content

  // Get confirmation of the request
  const result = await request;
  console.log('Data saved to the database', result);
};

// Add logic for a method that gets all the content from the database
export const getDb = async () => {
  console.log('GET from the database');

  // Create a connection to the database and specify the version
  const jateDb = await openDB('jate', 1);

  // Create a new transaction and specify the database and data privileges
  const tx = jateDb.transaction('jate', 'readonly');

  // Open the desired object store
  const store = tx.objectStore('jate');

  // Use the .get() method to retrieve content with id: 1
  const request = store.get(1);

  // Get confirmation of the request
  const result = await request;
  console.log('Retrieved data from the database', result?.value);
  return result?.value;
};

// Start the database
initdb();