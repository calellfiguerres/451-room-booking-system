import { useState } from "react";
import { api } from "~/.client/Providers/trpc";

export default function Signup() {
    const [ firstName, setFirstName ] = useState("");
    const [ lastName, setLastName ] = useState("");
    const [ username, setUsername ] = useState("");
    const [ password, setPassword ] = useState("");
    const [ passwordConfirm, setPasswordConfirm ] = useState("");
    const [ signupAsAdmin, setSignupAsAdmin ] = useState(false);

    const [ isError, setIsError ] = useState(false);
    const [ errorMsg, setErrorMsg ] = useState("");

    async function submitSignup() {
        if (password !== passwordConfirm) {
            setIsError(true);
            setErrorMsg("Passwords must match");
            return;
        } else {
            setIsError(false);
            setErrorMsg("");
        }

        await api.admin.signup.mutate({
            firstname: firstName,
            lastname: lastName,
            username: username,
            password: password,
            signupAsAdmin: signupAsAdmin
        });
    }
    
    return (
        <>
            <div className="w-full p-10 bg-black/10 height-minus-nav">
                { isError ? (
                    <p className="bg-red-300 rounded-md mx-5 p-2">
                        {errorMsg}
                    </p>
                ) : null }
                <h1 className="text-2xl text-center py-2">Signup</h1>
                <form onSubmit={(e) => { e.preventDefault(); e.stopPropagation(); submitSignup(); }}>
                    <label htmlFor="firstNameInput" className="text-xl px-5">First Name</label>
                    <input type="text" name="firstName" id="firstNameInput" className="rounded-md bg-white border-1 px-2" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                    <br className="py-5" />

                    <label htmlFor="lastNameInput" className="text-xl px-5">Last Name</label>
                    <input type="text" name="lastName" id="lastNameInput" className="rounded-md bg-white border-1 px-2" value={lastName} onChange={(e) => setLastName(e.target.value)} />
                    <br className="py-5" />

                    <label htmlFor="usernameInput" className="text-xl px-5">Username</label>
                    <input type="text" name="username" id="usernameInput" className="rounded-md bg-white border-1 px-2" value={username} onChange={(e) => setUsername(e.target.value)} />
                    <br className="py-5" />
                    
                    <label htmlFor="passwordInput" className="text-xl px-5">Password</label>
                    <input type="password" name="password" id="passwordInput" className="rounded-md bg-white border-1 px-2" value={password} onChange={(e) => setPassword(e.target.value)} />
                    <br className="py-5" />

                    <label htmlFor="passwordConfirmInput" className="text-xl px-5">Confirm Password</label>
                    <input type="password" name="passwordConfirm" id="passwordConfirmInput" className="rounded-md bg-white border-1 px-2" value={passwordConfirm} onChange={(e) => setPasswordConfirm(e.target.value)} />
                    <br className="py-5" />

                    <label htmlFor="adminLoginInput" className="text-xl px-5">Login as Admin?</label>
                    <input type="checkbox" name="adminLogin" id="adminLoginInput" checked={signupAsAdmin} onChange={(e) => { setSignupAsAdmin(e.target.checked); }} />
                    <br className="py-5" />

                    <button type="submit" className="rounded-md bg-white mx-2 px-2 hover:border-2">Login</button>
                </form>
            </div>
        </>
    );
}