import Input from "../components/Input/Input";
import Button from "../components/Button/Button";
import classroom from "../assets/classroom.png";
import logo from "../assets/logo.png";
import { useState } from "react";
import { useAuth } from "../contexts/auth/AuthContext";
import { Navigate, useNavigate } from "react-router";
import { userQueryOptions } from "../api/queryOptions";
import { useQueryClient } from "@tanstack/react-query";

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const queryClient = useQueryClient();
    const { loginMutation, isAuthenticated, isLoading } = useAuth();
    const navigate = useNavigate();

    if (isAuthenticated) {
        return <Navigate to="/dashboard" replace />;
    }

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        loginMutation.mutate({ email, password }, {
            onSuccess: () => {
                queryClient.setQueryData(userQueryOptions.me().queryKey, { data: loginMutation.data });
                navigate('/dashboard');
            }
        });
    };

    return (
        <div className="flex gap-4">
            <div className="w-full sm:w-1/2 relative">
                <img src={logo} alt="logo" className="w-[200px] p-5 mx-auto absolute top-0 left-0" />
                <form onSubmit={handleSubmit} className="flex flex-col gap-7 max-w-[600px] mx-auto justify-center h-screen px-10">
                    <h1 className="text-3xl sm:text-5xl font-bold text-center mb-10">BIENVENUE</h1>
                    {loginMutation.isError && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                            Une erreur est survenue lors de la connexion. Veuillez réessayer.
                        </div>
                    )}
                    <Input label="Mail :" name="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                    <Input label="Mot de passe :" name="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    <Button label={isLoading ? "Connexion..." : "Se connecter"} className="w-full cursor-pointer hover:bg-primary/80" type="submit" disabled={isLoading} />
                </form>
            </div>
            <img src={classroom} alt="" className="w-0 sm:w-1/2 h-screen rounded-l-lg p-5 hidden sm:block" />
        </div>
    );
};

export default LoginPage;