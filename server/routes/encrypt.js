 var CryptoJS = require("crypto-js");

var data = "Hello"

// Encrypt
// var ciphertext = CryptoJS.md5.encrypt(JSON.stringify(data), '3').toString();
var hash = CryptoJS.createHash("md5").update("example").digest("hex");
console.log("Cipher text",ciphertext)

// Decrypt
var bytes  = CryptoJS.sha256.decrypt(ciphertext, '3');
var decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));

console.log("Plain text",decryptedData) 

