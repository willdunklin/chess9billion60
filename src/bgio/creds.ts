import { accessKey, secretKey } from "../secret";

const access = process.env.NODE_ENV === "production" ? process.env.REACT_APP_AWS_KEY_ID! : accessKey;
const secret = process.env.NODE_ENV === "production" ? process.env.REACT_APP_AWS_SECRET_KEY! : secretKey;

export const creds = {
    accessKeyId: access,
    secretAccessKey: secret
};
