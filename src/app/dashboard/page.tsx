"use client"; // This component runs on the client

import { useRouter } from "next/navigation";
import { Suspense } from "react";
import {
  useAuth,
  useGitHubRepositories,
  useActivities,
  usePipelineExecutions,
} from "@/hooks";
import {
  DashboardHeader,
  RepositoriesList,
  AuthenticationError,
  RecentActivities,
  PipelineExecutionsList,
} from "@/components/dashboard";
import { LoadingSpinner } from "@/components/ui";

function DashboardPageContent() {
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
  const {
    executions,
    stats,
    isLoading: executionsLoading,
    error: executionsError,
    refetch: refetchExecutions,
  } = usePipelineExecutions(undefined, 20);

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
            
            <PipelineExecutionsList
              executions={executions}
              stats={stats}
              isLoading={executionsLoading}
              error={executionsError}
              onRefresh={refetchExecutions}
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

export default function DashboardPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen p-8">
        <div className="max-w-4xl mx-auto">
          <LoadingSpinner text="Loading..." />
        </div>
      </div>
    }>
      <DashboardPageContent />
    </Suspense>
  );
}
