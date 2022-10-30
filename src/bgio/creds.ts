import * as dotenv from 'dotenv';

export const creds = () => {
    if (process.env.NODE_ENV === "production") {
        return { accessKeyId:     process.env.REACT_APP_AWS_KEY_ID!,
                 secretAccessKey: process.env.REACT_APP_AWS_SECRET_KEY! };
    }
    dotenv.config();
    return { accessKeyId:     process.env.AWS_KEY_ID!,
             secretAccessKey: process.env.AWS_SECRET_KEY! };
};
