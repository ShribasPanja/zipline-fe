import { Button } from "@/components/ui";

interface AuthenticationErrorProps {
  onBackToLogin: () => void;
}

const AuthenticationError = ({ onBackToLogin }: AuthenticationErrorProps) => {
  return (
    <div>
      <p className="text-red-600 text-lg">No authentication token found.</p>
      <Button onClick={onBackToLogin} className="mt-4">
        Go Back to Login
      </Button>
    </div>
  );
};

export default AuthenticationError;
