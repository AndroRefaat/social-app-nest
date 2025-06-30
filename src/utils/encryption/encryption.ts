
import * as CryptoJs from 'crypto-js';

export const encrypt = (plainText: string, secretKey: string = process.env.ENCRYPT_KEY!): string => {
    return CryptoJs.AES.encrypt(plainText, secretKey).toString()
}

export const decrypt = (cipherText: string, secretKey: string = process.env.ENCRYPT_KEY!): string => {
    const bytes = CryptoJs.AES.decrypt(cipherText, secretKey);
    return bytes.toString(CryptoJs.enc.Utf8);
}