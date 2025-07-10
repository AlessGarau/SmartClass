import Input from "../components/Input/Input";
import Button from "../components/Button/Button";
import classroom from "../assets/classroom.png";

const LoginPage = () => {
    return (
        <div className="flex gap-4">
            <div className="w-1/2">
                <div className="flex flex-col gap-4 justify-center items-center h-screen p-15">
                    <h1 className="text-5xl font-bold text-center mb-10">BIENVENUE</h1>
                    <Input label="Mail" name="email" type="email" />
                    <Input label="Mot de passe" name="password" type="password" />
                    <Button label="Se connecter" className="w-full" />
                </div>
            </div>
            <img src={classroom} alt="" className="w-1/2 h-screen rounded-l-lg p-5" />
        </div>
    );
};

export default LoginPage;