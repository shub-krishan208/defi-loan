import Database from "better-sqlite3";

const db = new Database("db.sqlite", { verbose: console.log });

// id (unique primary key), public_address, username (non unique), amount_approved, cibil, coll_path
const createTable = db.prepare(`
    CREATE TABLE IF NOT EXISTS ledger (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        public_address TEXT NOT NULL,
        username TEXT NOT NULL,
        amount_approved INTEGER NOT NULL,
        cibil INTEGER NOT NULL,
        coll_path TEXT NOT NULL
    );
`);

createTable.run();

function viewLedger() {
  const stmt = db.prepare("SELECT * FROM ledger");
  return stmt.all();
}

function findUser(user) {
  const stmt = db.prepare("SELECT * FROM ledger WHERE username = ?");
  return stmt.get(user);
}

function findColl(path) {
  const stmt = db.prepare("SELECT * FROM ledger WHERE coll_path = ?");
  return stmt.get(path);
}

function addEntry(pid, user, amt, cibil, path) {
  const stmt = db.prepare(
    `INSERT INTO users (public_address, username, amoutn_approved, cibil, coll_path) VALUES (?,?,?,?,?)`
  );
  const info = stmt.run(pid, user, amt, cibil, path);
  console.log(`New Loan added with loan id "${info.lastInsertRowid}"`);
}

export { findUser, addEntry, viewLedger };
