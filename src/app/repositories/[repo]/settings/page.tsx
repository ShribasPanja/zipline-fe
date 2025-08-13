"use client";

import { useParams } from "next/navigation";
import { useState } from "react";
import SecretsManager from "../../../../components/secrets/SecretsManager";

export default function RepositorySettingsPage() {
  const params = useParams();
  const [activeTab, setActiveTab] = useState("secrets");

  // Decode the repository full name from URL params
  const repoFullName = decodeURIComponent(params.repo as string);

  const tabs = [
    { id: "secrets", label: "Secrets", icon: "🔐" },
    { id: "general", label: "General", icon: "⚙️" },
    { id: "webhooks", label: "Webhooks", icon: "🔗" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-green-400 font-mono text-sm mb-2">
            <span>~/repositories/</span>
            <span className="text-green-300">{repoFullName}</span>
            <span>/settings</span>
          </div>
          <h1 className="text-3xl font-bold text-green-400 font-mono">
            Repository Settings
          </h1>
          <p className="text-gray-400 font-mono mt-2">
            Configure secrets, webhooks, and other repository-specific settings
          </p>
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="flex space-x-1 bg-gray-900/50 p-1 rounded-lg border border-gray-700/50">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-md font-mono text-sm transition-all ${
                  activeTab === tab.id
                    ? "bg-green-600/20 text-green-400 border border-green-500/30"
                    : "text-gray-400 hover:text-green-300 hover:bg-gray-800/50"
                }`}
              >
                <span>{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="min-h-[600px]">
          {activeTab === "secrets" && (
            <SecretsManager repoFullName={repoFullName} />
          )}

          {activeTab === "general" && (
            <div className="bg-black/90 border border-gray-500/30 rounded-lg p-6">
              <h2 className="text-xl font-bold text-gray-400 font-mono mb-4">
                General Settings
              </h2>
              <div className="text-gray-500 font-mono">
                General repository settings coming soon...
              </div>
            </div>
          )}

          {activeTab === "webhooks" && (
            <div className="bg-black/90 border border-gray-500/30 rounded-lg p-6">
              <h2 className="text-xl font-bold text-gray-400 font-mono mb-4">
                Webhook Settings
              </h2>
              <div className="text-gray-500 font-mono">
                Webhook configuration coming soon...
              </div>
            </div>
          )}
        </div>

        {/* Back Button */}
        <div className="mt-8">
          <button
            onClick={() => window.history.back()}
            className="flex items-center gap-2 px-4 py-2 bg-gray-800/50 text-gray-400 border border-gray-600/30 rounded font-mono hover:bg-gray-700/50 hover:text-green-400 transition-colors"
          >
            <span>←</span>
            Back to Repository
          </button>
        </div>
      </div>
    </div>
  );
}
