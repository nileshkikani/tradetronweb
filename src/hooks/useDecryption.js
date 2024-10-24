import CryptoJS from 'crypto-js';

const useDecryption = (encryptionKey) => {
    const secretKey = CryptoJS.enc.Utf8.parse(encryptionKey);

    const decryptField = (encryptedField) => {
        const decrypted = CryptoJS.AES.decrypt(encryptedField, secretKey, {
            mode: CryptoJS.mode.ECB,
            padding: CryptoJS.pad.Pkcs7,
        });
        return decrypted.toString(CryptoJS.enc.Utf8);
    };

    return { decryptField };
};

export default useDecryption;
