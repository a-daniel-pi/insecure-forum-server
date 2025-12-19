const argon2 = require('argon2');

function verifyPass(password) {
    // check if password is valid
    // longer than 8 characters
    // must include uppercase, special, numbers
    errors = []; // List of things wrong with password
    
    if (password.length < 8) {
        errors.push("Password must be 8 or more characters long");
    }
    
    if(!/[A-Z]/.test(password)) {
        errors.push("Password must include at least one uppercase letter");
    }
    
    if(!/[a-z]/.test(password)) {
        errors.push("Password must include at least one lowercase letter");
    }
    
    if(!/[0-9]/.test(password)) {
        errors.push("Password must include at least one number");
    }
    
    if(!/[`~!@#$%^&*()-=_+|;':",.<>?]/.test(password)) {
        errors.push("Password must include at least special character");
    }
    
    return errors;
}

async function hashPass(password) {
    const hashedPassword = await argon2.hash(password);
    return hashedPassword;
}

async function checkHash(password, hash) {
    const matched = await argon2.verify(hash, password);
    return matched;
}


module.exports = {verifyPass, hashPass, checkHash};