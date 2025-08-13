"use client";

import { useParams, useRouter } from "next/navigation";
import { ArtifactsList } from "@/components/artifacts";

export default function ArtifactsPage() {
  const params = useParams();
  const router = useRouter();
  const executionId = params.executionId as string;

  return (
    <div className="min-h-screen bg-black text-green-400 font-mono flex flex-col">
      {/* Header */}
      <div className="bg-gray-900 border-b border-gray-700 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="text-gray-400 hover:text-green-400 transition-colors"
          >
            ← Back
          </button>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-orange-400"></div>
            <span className="text-lg font-bold">Artifacts</span>
          </div>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <span className="text-gray-400">Execution ID:</span>
          <span className="text-orange-400 font-mono">{executionId}</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-green-400 mb-2">
              Pipeline Artifacts
            </h1>
            <p className="text-gray-400 text-sm">
              Download and manage artifacts generated during pipeline execution
            </p>
          </div>

          <ArtifactsList executionId={executionId} isCollapsed={false} />
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gray-950 border-t border-gray-700 px-6 py-3 flex items-center justify-between text-xs">
        <span className="text-gray-500">
          $ zipline artifacts --execution-id {executionId} --list --download
        </span>
        <span className="text-gray-500">Zipline Artifact Manager</span>
      </div>
    </div>
  );
}
