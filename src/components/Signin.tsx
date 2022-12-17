import { useEffect, useState } from "react";
import { GoogleLogin, GoogleLogout, GoogleLoginResponse, GoogleLoginResponseOffline } from 'react-google-login';
import { gapi } from 'gapi-script';
import { useCookies } from "react-cookie";
import { nanoid } from 'nanoid';
import { Navigate, Link } from 'react-router-dom';
import axios from "axios";


export const Signin = (props: { showLogout: boolean; nav: boolean }) => {
    const [ cookies, setCookie ] = useCookies(['idtoken', 'username', 'googleSession', 'googleEmail']);
    const clientId: string = import.meta.env.VITE_GOOGLE_LOGIN || 'invalid';

    const [ createAccount, setCreateAccount ] = useState<boolean>(false);
    const [ tokenid, setTokenid ] = useState('');

    useEffect(() => {
        const initClient = () => {
            gapi.client.init({
                clientId: clientId,
                scope: 'openid'
            });
        };
        gapi.load('client:auth2', initClient);
    });

    const onSuccess = async (google_res: GoogleLoginResponse | GoogleLoginResponseOffline) => {
        if('profileObj' in google_res) {
            // const res = await axios.post('http://localhost:8080/auth/google', {
            const res = await axios.post('https://chess9b60-api.herokuapp.com/auth/google', {
                token: google_res.tokenId
            });
            if (res.status !== 200 || !res.data)
                return;

            if (res.data.token === '') {
                setTokenid(google_res.tokenId);
                setCreateAccount(true);
                return;
            }

            setCookie('googleSession', res.data.token, { path: '/' });
            setCookie('googleEmail', res.data.email, { path: '/' });
            setCookie('idtoken', res.data.id, { path: '/' });
            setCookie('username', res.data.username, { path: '/' });
        }
    };

    const onFailure = (err: any) => {
        console.log('failed', err);
    };

    const logOut = () => {
        setCookie('username', '', { path: '/' });
        setCookie('idtoken', nanoid(), { path: '/' });
        setCookie('googleSession', '', { path: '/' });
        setCookie('googleEmail', '', { path: '/' });
    };

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

                    setCookie('idtoken', res.data.id, { path: '/' });
                    setCookie('username', res.data.username, { path: '/' });
                }
            }).catch(e => {
                console.log('error!', e);
            });
        }
    }, [cookies.username, cookies.googleSession, cookies.googleEmail]);

    useEffect(() => {
        if (createAccount) {
            setCreateAccount(false);
        }
    }, [createAccount]);

    return (
        <>
        { createAccount ? <Navigate to={`/account/create/${tokenid}`}/> : <></> }
        { cookies.googleSession ?
            <>
                { props.showLogout ?
                <div className={props.nav ? "signin signinNav" : "signin signinPage"} style={{display: 'flex', justifyContent: 'space-around'}}>
                    <p><Link to='/account'><p>{cookies.username}</p></Link></p>
                    <GoogleLogout
                        clientId={clientId}
                        buttonText="Logout"
                        onLogoutSuccess={logOut}
                        icon={false}
                    />
                </div>
                :
                <></>
                }
            </>
            :
            <div className={props.nav ? "signin signinNav" : "signin signinPage"} style={{display: 'flex', justifyContent: 'center'}}>
                <GoogleLogin
                    clientId={clientId}
                    buttonText="Sign in with Google"
                    onSuccess={onSuccess}
                    onFailure={onFailure}
                    cookiePolicy={'single_host_origin'}
                    icon={false}
                />
            </div>
        }
        </>
    );
}