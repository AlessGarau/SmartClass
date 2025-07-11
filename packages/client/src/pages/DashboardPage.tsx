import { useAuth } from '../contexts/auth/AuthContext';
import Button from '../components/Button/Button';

const DashboardTestPage = () => {
  const { user, logoutMutation } = useAuth();

  const handleLogout = async () => {
    logoutMutation.mutate();
  };

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <div className="flex items-center gap-4">
            <span>Bienvenue, {user?.firstName} {user?.lastName}</span>
            <Button label="Déconnexion" onClick={handleLogout} className="bg-red-500 hover:bg-red-600" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardTestPage;