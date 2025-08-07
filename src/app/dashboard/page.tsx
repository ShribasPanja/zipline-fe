"use client"; // This component runs on the client

import { useRouter } from "next/navigation";
import { useAuth, useGitHubRepositories, useActivities } from "@/hooks";
import {
  DashboardHeader,
  RepositoriesList,
  NextStepsGuide,
  AuthenticationError,
  RecentActivities,
} from "@/components/dashboard";
import { LoadingSpinner } from "@/components/ui";

export default function DashboardPage() {
  const router = useRouter();
  const { token, isLoading: authLoading, logout, isAuthenticated } = useAuth();
  const {
    repositories,
    isLoading: reposLoading,
    error,
    refetch,
  } = useGitHubRepositories(token);
  const {
    activities,
    isLoading: activitiesLoading,
    error: activitiesError,
    refetch: refetchActivities,
  } = useActivities(token, 15);

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const handleBackToLogin = () => {
    router.push("/");
  };

  if (authLoading) {
    return (
      <div className="min-h-screen p-8">
        <div className="max-w-4xl mx-auto">
          <LoadingSpinner text="Loading..." />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <DashboardHeader onLogout={handleLogout} hasToken={isAuthenticated} />

        {isAuthenticated ? (
          <div className="space-y-8">
            <RepositoriesList
              repositories={repositories}
              isLoading={reposLoading}
              error={error}
              onRefresh={refetch}
              token={token}
            />

            <RecentActivities
              activities={activities}
              isLoading={activitiesLoading}
              error={activitiesError}
              onRefresh={refetchActivities}
            />
          </div>
        ) : (
          <AuthenticationError onBackToLogin={handleBackToLogin} />
        )}

        {/* <NextStepsGuide /> */}
      </div>
    </div>
  );
}
