import clientPromise from ".";

let client: any;
let db: any;
let Blink;

async function init() {
  if (db) return;
  try {
    client = await clientPromise;
    db = await client.db();
    Blink = await db.collection("Blink");
  } catch (error) {
    throw new Error("Failed to establish connection to database");
  }
}

(async () => {
  await init();
})();

export async function postBlink() {
  try {
  } catch (error) {}
}
