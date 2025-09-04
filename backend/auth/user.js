import Database from "better-sqlite3";
import bcrypt from "bcryptjs";
const db = new Database("user.sqlite", { verbose: console.log });

// id (unique primary key), public_address, username (non unique), amount_approved, cibil, coll_path
const createTable = db.prepare(`
    CREATE TABLE IF NOT EXISTS user (
        id INTEGER PRIMARY KEY AUTOINCREMENT, 
        public_address TEXT NOT NULL,
        username TEXT NOT NULL,
        password TEXT NOT NULL,
        cibil INTEGER DEFAULT 0,
        hasLoan INTEGER DEFAULT 0
    );
`);

createTable.run();

function viewUser() {
  const stmt = db.prepare("SELECT * FROM user");
  return stmt.all();
}

function addUser(user, password) {
  const stmt = db.prepare("INSERT INTO user (username, password) VALUES (?,?)");
  const info = stmt.run(user, password);
  console.log(`New user added: ${info.lastInsertRowid}`);
}

function findUser(user) {
  const stmt = db.prepare("SELECT * FROM user WHERE username = ?");
  return stmt.get(user);
}

function findUserByID(id) {
  const stmt = db.prepare("SELECT * FROM user WHERE id = ?");
  return stmt.get(id);
}

function deleteUser(id) {
  const stmt = db.prepare("DELETE FROM user WHERE id = ?");
  const info = stmt.run(id);
  console.log(`Deleted ${info.changes}.`);
}

async function defaultUser() {
  const username = "admin@example.com";
  const plainPassword = "password123";

  // check if admin already exists
  const stmtFind = db.prepare("SELECT * FROM user WHERE username = ?");
  const existing = stmtFind.get(username);

  if (existing) {
    console.log("Default admin user already exists.");
    return;
  }

  // hash the password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(plainPassword, salt);

  // insert default admin with dummy values for required cols
  const stmtInsert = db.prepare(
    "INSERT INTO user (public_address, username, password) VALUES (?, ?, ?)"
  );
  const info = stmtInsert.run(
    "0x0000000000000000000000000000000000000000",
    username,
    hashedPassword
  );

  console.log(`Default admin user created: ${info.lastInsertRowid}`);
}

export { viewUser, deleteUser, findUser, addUser, findUserByID, defaultUser };
