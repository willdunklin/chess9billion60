const accessKey = process.env.NODE_ENV === "production" ? process.env.REACT_APP_AWS_KEY_ID : require("../secret.js").accessKey;
const secretKey = process.env.NODE_ENV === "production" ? process.env.REACT_APP_AWS_SECRET_KEY : require("../secret.js").secretKey;

export const creds = { 
    accessKeyId: accessKey,
    secretAccessKey: secretKey
}