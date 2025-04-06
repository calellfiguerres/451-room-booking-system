import { useEffect } from "react";
import { useNavigate } from "react-router";
import { api } from "~/.client/Providers/trpc";

export default function Logout() {
    const navigate = useNavigate();

    useEffect(() => {
        api.auth.logout.mutate();
        navigate("/");
    }, []);

    // return (
    //     <h1 className="text-2xl text-center py-2">Logout</h1>
    // );
}