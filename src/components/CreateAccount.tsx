import React, { useState } from "react";
import axios from "axios";
import { useCookies } from "react-cookie";
import { Navigate, useParams } from 'react-router-dom';

const CreateAccount = () => {
    document.title = "Create an Account | Chess9b60";
    const { tokenid } = useParams();
    const [ cookies, setCookie ] = useCookies(['idtoken', 'username', 'googleSession', 'googleEmail']);
    const [ username, setUsername ] = useState('');
    const [ success, setSuccess ] = useState(false);

    const updateUsername = (event: React.ChangeEvent<HTMLInputElement>) => {
        setUsername(event.target.value);
    }

    const create = async () => {
        if (!tokenid) {
            console.error('no google token id');
            return;
        }

        if (username.length < 3 || username.length > 20)
            return;

        if (!/^\w+$/.test(username))
            return;

        // const res = await axios.post('http://localhost:8080/auth/create', {
        const res = await axios.post('https://chess9b60-api.herokuapp.com/auth/create', {
            username: username,
            token: tokenid,
        });

        if (res.status === 200) {
            console.log('response data', res.data);

            if (res.data.error) {
                console.error(res.data.error);
                return;
            }
            if (!res.data || !res.data.token || !res.data.username || !res.data.email || !res.data.id) {
                console.error('invalid response');
                return;
            }

            setCookie('googleSession', res.data.token, { path: '/' });
            setCookie('googleEmail', res.data.email, { path: '/' });
            setCookie('idtoken', res.data.id, { path: '/' });
            setCookie('username', res.data.username, { path: '/' });
            setSuccess(true);
        }
    }

    return (
        <main style={{display: "flex", justifyContent: "center", padding: "4em"}}>
            <div className="main-page">
                <div style={{display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center"}}>
                    { success ? <Navigate to='/account'/> : <></>}
                    <h2>Create an Account</h2>
                    <form>
                        <label htmlFor="username">Username
                            <input type="text" name="username" onChange={updateUsername} />
                        </label>
                        <button type="button" onClick={create}>Create</button>
                    </form>
                </div>
            </div>
        </main>
    );
};

export default CreateAccount;
