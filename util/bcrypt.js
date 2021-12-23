const bcrypt = require('bcrypt');

async function encrypt (pass) {
    hashedPass = await bcrypt.hash(pass, 12);
    return hashedPass;
};

async function decrypt (pass, hashedPass) {
    const compare = await bcrypt.compare(pass, hashedPass);
    return compare;
};

module.exports = {
    encrypt,
    decrypt
}