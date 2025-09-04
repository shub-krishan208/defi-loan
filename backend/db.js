import Database from "better-sqlite3";

const db = new Database("db.sqlite", { verbose: console.log });

// id (unique primary key), public_address, username (non unique), amount_approved, cibil, coll_path
const createTable = db.prepare(`
    CREATE TABLE IF NOT EXISTS ledger (
        id INTEGER PRIMARY KEY AUTOINCREMENT, 
        public_address TEXT NOT NULL,
        username TEXT NOT NULL,
        cibil INTEGER NOT NULL,
        amount_approved INTEGER NOT NULL,
        coll_path TEXT NOT NULL
        token_id TEXT DEFAULT '0x1234...abc',
        interest REAL DEFAULT 8.5,
        repayment_term INTEGER DEFAULT 12,
        emi INTEGER NOT NULL,
        remaining_dues INTEGER NOT NULL,
        date_created INTEGER NOT NULL,
        next_due INTEGER NOT NULL,
        failures INTEGER DEFAULT 0
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

function makeUser(pid, name, cibil) {
  const stmt = db.prepare(
    `INSERT INTO ledger (public_address, username, cibil) VALUES (?,?,?)`
  );
  const info = stmt.run(pid, name, cibil);
  console.log(`New User added with loan id "${info.lastInsertRowid}"`);
}

function addColl(id, path) {
  const stmt = db.prepare("UPDATE ledger SET coll_path = ? WHERE id = ?");
  const info = stmt.run(path, id);
  console.log(`Updated collateral path: ${info.changes}`);
}

function makeLoan(amt, token_id, interest, term, emi, dues, date, next, id) {
  const stmt = db.prepare(
    `UPDATE ledger 
     SET amount_approved = ?, token_id = ?, interest = ?, repayment_term = ?, emi = ?, remaining_dues = ?, date_created = ?, next_due = ?
     WHERE id = ?`
  );
  const info = stmt.run(
    amt,
    token_id,
    interest,
    term,
    emi,
    dues,
    date,
    next,
    id
  );
  console.log(`New Loan added with loan id "${info.changes}"`);
}

function increaseFailure(id) {
  const stmt = db.prepare(
    "UPDATE ledger SET failures = failures + 1 WHERE id = ?"
  );
  const info = stmt.run(id);
  console.log(`Increased failures: ${info.changes}`);
}

function updateDues(next, id) {
  const stmt = db.prepare(`
    UPDATE ledger
    SET next_date = ?, remaining_dues = remaining_dues - emi
    WHERE id = ?`);
  const info = stmt.run(next, id);
  console.log(`Update date-time: ${info.changes}`);
}

function deleteEntry(id) {
  const stmt = db.prepare("DELETE FROM ledger WHERE id = ?");
  const info = stmt.run(id);
  console.log(`Deleted ${info.changes}.`);
}

export {
  viewLedger,
  findUser,
  findColl,
  makeUser,
  addColl,
  makeLoan,
  increaseFailure,
  updateDues,
  deleteEntry,
};
