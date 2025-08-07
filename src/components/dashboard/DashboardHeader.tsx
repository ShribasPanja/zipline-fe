import { Button } from "@/components/ui";

interface DashboardHeaderProps {
  onLogout: () => void;
  hasToken: boolean;
}

const DashboardHeader = ({ onLogout, hasToken }: DashboardHeaderProps) => {
  return (
    <div className="flex justify-between items-center mb-8">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      {hasToken && (
        <Button variant="danger" onClick={onLogout}>
          Logout
        </Button>
      )}
    </div>
  );
};

export default DashboardHeader;
