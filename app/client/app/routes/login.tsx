import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { api } from "~/.client/Providers/trpc";

export default function login() {
    const [ username, setUsername ] = useState("");
    const [ password, setPassword ] = useState("");
    const [ loginAsAdmin, setLoginAsAdmin ] = useState(false);
    const [ loginError, setLoginError ] = useState(false);
    const navigate = useNavigate();

    async function submitLogin() {
        try {
            const res = await api.auth.login.query({
                username: username,
                password: password,
                loginAsAdmin: loginAsAdmin
            });
            
            navigate("/");
        } catch {
            setLoginError(true);
        }
    }

    return (
        <>
            <div className="w-full p-10 bg-black/10 height-minus-nav">
                { loginError ? (
                    <p className="bg-red-300 rounded-md mx-5 p-2">
                        Invalid Username or Password
                    </p>
                ) : null }
                <h1 className="text-2xl text-center py-2">Login</h1>
                <form onSubmit={(e) => { e.preventDefault(); e.stopPropagation(); submitLogin() }}>
                    <label htmlFor="usernameInput" className="text-xl px-5">Username</label>
                    <input type="text" name="username" id="usernameInput" className="rounded-md bg-white border-1 px-2" value={username} onChange={(e) => setUsername(e.target.value)}/>
                    <br className="py-5" />
                    <label htmlFor="passwordInput" className="text-xl px-5">Password</label>
                    <input type="password" name="password" id="passwordInput" className="rounded-md bg-white border-1 px-2" value={password} onChange={(e) => setPassword(e.target.value)} />
                    <br className="py-5" />
                    <label htmlFor="adminLoginInput" className="text-xl px-5">Login as Admin?</label>
                    <input type="checkbox" name="adminLogin" id="adminLoginInput" checked={loginAsAdmin} onChange={(e) => { setLoginAsAdmin(e.target.checked); }} />
                    <br className="py-5" />
                    <button type="submit" className="rounded-md bg-white mx-2 px-2 hover:border-2">Login</button>
                </form>
            </div>
        </>
    );
}