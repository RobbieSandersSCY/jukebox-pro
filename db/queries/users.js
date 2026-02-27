import db from "#db/client";
import bcrypt from "bcrypt";

/**
 *
 * @param {text} username
 * @param {text} password
 * @returns
 */
export async function createUser(username, password) {
  const sql = `
  INSERT INTO users
    (username, password)
  VALUES
    ($1, $2)
  RETURNING *
  `;
  const hashedPassword = await bcrypt.hash(password, 8);
  const {
    rows: [user],
  } = await db.query(sql, [username, hashedPassword]);
  return user;
}

export async function getUserByUsernameAndPassword(
  username,
  password,
) {
  // query for username
  const sql = `
  SELECT *
  FROM users
  WHERE username = $1
  `;
  const {
    rows: [user],
  } = await db.query(sql, [username]);
  // no user?
  if (!user) return null;
  // verify password is correct via verify
  const isValid = await bcrypt.compare(password, user.password);
  // doesnt match?
  if (!isValid) return null;
  // does match?
  return user;
}
