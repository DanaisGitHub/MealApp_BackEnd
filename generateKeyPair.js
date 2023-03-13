"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const crypto_1 = __importDefault(require("crypto"));
const fs_1 = __importDefault(require("fs"));
function genKeyPair() {
    // Generates an object where the keys are stored in properties `privateKey` and `publicKey`
    const keyPair = crypto_1.default.generateKeyPairSync('rsa', {
        modulusLength: 4096,
        publicKeyEncoding: {
            type: 'pkcs1',
            format: 'pem' // Most common formatting choice
        },
        privateKeyEncoding: {
            type: 'pkcs1',
            format: 'pem' // Most common formatting choice
        }
    });
    // Create the public key file
    fs_1.default.writeFileSync(__dirname + '/id_rsa_pub.pem', keyPair.publicKey);
    // Create the private key file
    fs_1.default.writeFileSync(__dirname + '/id_rsa_priv.pem', keyPair.privateKey);
}
// Generate the keypair
genKeyPair();
