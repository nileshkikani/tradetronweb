import CryptoJS from 'crypto-js';

const useEncryption = () => {
    const key = process.env.ENCRYPTION_KEY;
    const secretKey = CryptoJS.enc.Utf8.parse(key);

    const encryptField = (field) => {
        return CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(field), secretKey, {
            mode: CryptoJS.mode.ECB,
            padding: CryptoJS.pad.Pkcs7,
        }).toString().toString(CryptoJS.enc.Base64);
    };

    // angle creds encryption
    const encryptAngelCredentials = (data) => {
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


    // dhan cred encryption
    const encryptDhanCredentials = (data) => {
        return {
            client_id: encryptField(data.client_id),
            access_token: encryptField(data.access_token),
        };
    };

    return { encryptAngelCredentials, encryptKotakCredentials,encryptDhanCredentials };
};

export default useEncryption;