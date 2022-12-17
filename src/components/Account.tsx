import { useEffect } from "react";
import axios from "axios";
import { useCookies } from "react-cookie";
import { Link } from 'react-router-dom';
import { Signin } from "./Signin";

const Account = () => {
    document.title = "Account Settings | Chess9b60";

    const [ cookies, setCookie ] = useCookies(['username', 'googleSession', 'googleEmail']);

    useEffect(() => {
        if (!cookies.googleSession)
            setCookie('username', '', { path: '/' });

        if (cookies.username === '' && cookies.googleSession && cookies.googleEmail) {
            // axios.post('http://localhost:8080/auth/user', {
            axios.post('https://chess9b60-api.herokuapp.com/auth/user', {
                token: cookies.googleSession,
                email: cookies.googleEmail,
            }).then(res => {
                if (res.status === 200) {
                    if (res.data.token === '') {
                        setCookie('username', '', { path: '/' });
                        setCookie('googleSession', '', { path: '/' });
                        setCookie('googleEmail', '', { path: '/' });
                        return;
                    }

                    setCookie('username', res.data.username, { path: '/' });
                }
            }).catch(e => {
                console.log('error!', e);
            });
        }

    }, [cookies.googleSession, cookies.googleEmail, cookies.username]);

    return (
        <main style={{display: "flex", justifyContent: "center", padding: "4em"}}>
            <div className="main-page">

                <div style={{display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center"}}>
                    {cookies.username === '' ? <>
                        <h2>You are not logged in</h2>
                        <p><i>Sign in to access account settings</i></p>
                        <Signin showLogout={false} nav={false} />
                    </> : <>
                        <h1>Hello, {cookies.username}</h1>
                        <p><i>Account settings coming soon!</i></p>
                        <Link className="homeButton link" to='/'>Home</Link>
                    </>}
                </div>
            </div>
        </main>
    );
}

export default Account;
