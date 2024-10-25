import CryptoJS from 'crypto-js';

const useEncryption = (encryptionKey) => {
    const secretKey = CryptoJS.enc.Utf8.parse(encryptionKey);

    const encryptField = (field) => {
        return CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(field), secretKey, {
            mode: CryptoJS.mode.ECB,
            padding: CryptoJS.pad.Pkcs7,
        }).toString().toString(CryptoJS.enc.Base64);
    };

    // angle creds encryption
    const encryptAngelCredentials = (data) => {
        console.log('ddddd',data)
        return {
            client_code: encryptField(data.client_code),
            password: encryptField(data.password),
            api_key: encryptField(data.api_key),
            totp: encryptField(data.totp),
        };
    };

    // kotak creds encryption
    const encryptKotakCredentials = (data) => {
        return {
            consumer_key: encryptField(data.consumer_key),
            consumer_secret: encryptField(data.consumer_secret),
            username: encryptField(data.username),
            password: encryptField(data.password),
            neo_fin_key: encryptField(data.neo_fin_key),
            mobile_no: encryptField(`+91${data.mobile_no}`),
            login_password: encryptField(data.login_password),
            mpin: encryptField(data.mpin),
        };
    };

    return { encryptAngelCredentials, encryptKotakCredentials };
};

export default useEncryption;
