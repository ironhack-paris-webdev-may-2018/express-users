const bcrypt = require("bcrypt");

// Encrypt passwords for:
//   1. Sign Up
//   2. Seed file for creating users
const encryptedPassword = bcrypt.hashSync("swordfish", 10);
console.log(encryptedPassword);

const otherPassword = bcrypt.hashSync("", 10);
console.log(otherPassword);


// Compare passwords for:
//   1. Log In
console.log( bcrypt.compareSync("blah", encryptedPassword) );
console.log( bcrypt.compareSync("swordfish", encryptedPassword) );
