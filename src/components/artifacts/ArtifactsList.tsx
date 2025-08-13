import { useState } from "react";
import { useArtifacts } from "@/hooks";

interface ArtifactsListProps {
  executionId: string;
  isCollapsed?: boolean;
}

const ArtifactsList = ({
  executionId,
  isCollapsed = false,
}: ArtifactsListProps) => {
  const { artifacts, loading, error, downloadArtifact, formatFileSize } =
    useArtifacts(executionId);
  const [expanded, setExpanded] = useState(!isCollapsed);
  const [downloading, setDownloading] = useState<string | null>(null);

  const handleDownload = async (stepName: string, fileName: string) => {
    const downloadKey = `${stepName}/${fileName}`;
    try {
      setDownloading(downloadKey);
      await downloadArtifact(executionId, stepName, fileName);
    } catch (error: any) {
      console.error("Download failed:", error);
      // Could show toast notification here
    } finally {
      setDownloading(null);
    }
  };

  const groupedArtifacts = artifacts.reduce((groups, artifact) => {
    const step = artifact.stepName;
    if (!groups[step]) {
      groups[step] = [];
    }
    groups[step].push(artifact);
    return groups;
  }, {} as Record<string, typeof artifacts>);

  if (loading) {
    return (
      <div className="bg-black border border-gray-700 rounded-lg font-mono">
        <div className="bg-gray-900 border-b border-gray-700 px-4 py-2">
          <span className="text-green-400">zipline@artifacts:~/loading</span>
        </div>
        <div className="p-4">
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <div className="animate-spin w-4 h-4 border border-green-400 border-t-transparent rounded-full"></div>
            Loading artifacts...
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-black border border-gray-700 rounded-lg font-mono">
        <div className="bg-gray-900 border-b border-gray-700 px-4 py-2">
          <span className="text-red-400">zipline@artifacts:~/error</span>
        </div>
        <div className="p-4">
          <div className="text-red-400 text-sm mb-2">
            ✗ Failed to load artifacts
          </div>
          <div className="text-gray-500 text-xs">{error}</div>
        </div>
      </div>
    );
  }

  if (artifacts.length === 0) {
    return (
      <div className="bg-black border border-gray-700 rounded-lg font-mono">
        <div className="bg-gray-900 border-b border-gray-700 px-4 py-2">
          <span className="text-gray-400">zipline@artifacts:~/empty</span>
        </div>
        <div className="p-4">
          <div className="text-gray-500 text-sm">
            📦 No artifacts found for this execution
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-black border border-gray-700 rounded-lg font-mono">
      <div className="bg-gray-900 border-b border-gray-700 px-4 py-2 flex items-center justify-between">
        <span className="text-green-400">
          zipline@artifacts:~/{artifacts.length}_found
        </span>
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-gray-400 hover:text-green-400 transition-colors text-sm"
        >
          {expanded ? "collapse" : "expand"}
        </button>
      </div>

      {expanded && (
        <div className="p-4">
          <div className="text-green-400 mb-4 text-sm">
            === Artifacts ({artifacts.length}) ===
          </div>

          <div className="space-y-4">
            {Object.entries(groupedArtifacts).map(
              ([stepName, stepArtifacts]) => (
                <div key={stepName} className="border border-gray-800 rounded">
                  <div className="bg-gray-950 px-3 py-2 border-b border-gray-800">
                    <div className="flex items-center gap-2">
                      <span className="text-cyan-400 text-sm font-bold">
                        📋 {stepName}
                      </span>
                      <span className="text-gray-500 text-xs">
                        ({stepArtifacts.length} artifacts)
                      </span>
                    </div>
                  </div>

                  <div className="p-3 space-y-2">
                    {stepArtifacts.map((artifact) => {
                      const downloadKey = `${artifact.stepName}/${artifact.fileName}`;
                      const isDownloading = downloading === downloadKey;

                      return (
                        <div
                          key={artifact.key}
                          className="flex items-center justify-between bg-gray-900 p-2 rounded border border-gray-700 hover:border-gray-600 transition-colors"
                        >
                          <div className="flex items-center gap-3 flex-1">
                            <span className="text-blue-400 text-sm">📦</span>
                            <div className="flex-1">
                              <div className="text-gray-300 text-sm font-mono">
                                {artifact.fileName}
                              </div>
                              <div className="text-gray-500 text-xs flex items-center gap-2">
                                <span>{formatFileSize(artifact.size)}</span>
                                <span>•</span>
                                <span>
                                  {new Date(
                                    artifact.lastModified
                                  ).toLocaleString()}
                                </span>
                              </div>
                            </div>
                          </div>

                          <button
                            onClick={() =>
                              handleDownload(
                                artifact.stepName,
                                artifact.fileName
                              )
                            }
                            disabled={isDownloading}
                            className="text-xs px-3 py-1 rounded border transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-green-400 hover:text-green-300 border-green-400/30 hover:bg-green-400/10"
                          >
                            {isDownloading ? (
                              <span className="flex items-center gap-1">
                                <div className="w-3 h-3 border border-green-400 border-t-transparent rounded-full animate-spin"></div>
                                downloading...
                              </span>
                            ) : (
                              "download"
                            )}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      )}

      <div className="bg-gray-900 border-t border-gray-700 px-4 py-2 text-xs text-gray-500">
        <div className="flex justify-between">
          <span>
            Total: {artifacts.length} artifacts | Size:{" "}
            {formatFileSize(artifacts.reduce((sum, a) => sum + a.size, 0))}
          </span>
          <span>Zipline Artifact Manager</span>
        </div>
      </div>
    </div>
  );
};

export default ArtifactsList;
