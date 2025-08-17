"use client";

import { useState, useEffect } from "react";
import { useSecrets, SecretInput } from "../../hooks/useSecrets";

interface SecretsManagerProps {
  repoFullName: string;
}

export default function SecretsManager({ repoFullName }: SecretsManagerProps) {
  const {
    secrets,
    loading,
    error,
    saveSecret,
    bulkUpdateSecrets,
    deleteSecret,
    validateSecretKey,
    clearError,
  } = useSecrets(repoFullName);

  const [newSecret, setNewSecret] = useState({ key: "", value: "" });
  const [editingSecrets, setEditingSecrets] = useState<SecretInput[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});
  const [showValues, setShowValues] = useState<Record<string, boolean>>({});

  useEffect(() => {
    // Initialize editing secrets from existing secrets
    setEditingSecrets(secrets.map((s) => ({ key: s.key, value: "" })));
  }, [secrets]);

  const handleAddSecret = async () => {
    if (!newSecret.key.trim() || !newSecret.value.trim()) {
      return;
    }

    // Validate key format
    const validation = await validateSecretKey(newSecret.key);
    if (!validation.isValid) {
      setValidationErrors({ newSecret: validation.message });
      return;
    }

    const success = await saveSecret(newSecret.key, newSecret.value);
    if (success) {
      setNewSecret({ key: "", value: "" });
      setValidationErrors({});
    }
  };

  const handleBulkUpdate = async () => {
    // Only include secrets with values
    const secretsToUpdate = editingSecrets.filter((s) => s.value.trim() !== "");

    if (secretsToUpdate.length === 0) {
      return;
    }

    // Validate all keys
    const errors: Record<string, string> = {};
    for (const secret of secretsToUpdate) {
      const validation = await validateSecretKey(secret.key);
      if (!validation.isValid) {
        errors[secret.key] = validation.message;
      }
    }

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    const success = await bulkUpdateSecrets(secretsToUpdate);
    if (success) {
      setIsEditing(false);
      setEditingSecrets([]);
      setValidationErrors({});
    }
  };

  const handleDeleteSecret = async (key: string) => {
    if (confirm(`Are you sure you want to delete the secret "${key}"?`)) {
      await deleteSecret(key);
    }
  };

  const addEditingSecret = () => {
    setEditingSecrets([...editingSecrets, { key: "", value: "" }]);
  };

  const updateEditingSecret = (
    index: number,
    field: "key" | "value",
    value: string
  ) => {
    const updated = [...editingSecrets];
    updated[index][field] = value;
    setEditingSecrets(updated);
  };

  const removeEditingSecret = (index: number) => {
    const updated = editingSecrets.filter((_, i) => i !== index);
    setEditingSecrets(updated);
  };

  const toggleShowValue = (key: string) => {
    setShowValues((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  if (loading) {
    return (
      <div className="bg-black/90 border border-green-500/30 rounded-lg p-6">
        <div className="text-green-400 font-mono">Loading secrets...</div>
      </div>
    );
  }

  return (
    <div className="bg-black/90 border border-green-500/30 rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-green-400 font-mono">
          Repository Secrets
        </h2>
        <div className="flex gap-2">
          {!isEditing && secrets.length > 0 && (
            <button
              onClick={() => setIsEditing(true)}
              className="px-3 py-1 bg-yellow-600/20 text-yellow-400 border border-yellow-500/30 rounded font-mono text-sm hover:bg-yellow-600/30 transition-colors"
            >
              Edit All
            </button>
          )}
          {isEditing && (
            <>
              <button
                onClick={handleBulkUpdate}
                className="px-3 py-1 bg-green-600/20 text-green-400 border border-green-500/30 rounded font-mono text-sm hover:bg-green-600/30 transition-colors"
              >
                Save All
              </button>
              <button
                onClick={() => {
                  setIsEditing(false);
                  setEditingSecrets([]);
                  setValidationErrors({});
                }}
                className="px-3 py-1 bg-red-600/20 text-red-400 border border-red-500/30 rounded font-mono text-sm hover:bg-red-600/30 transition-colors"
              >
                Cancel
              </button>
            </>
          )}
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-900/20 border border-red-500/30 rounded text-red-400 font-mono text-sm">
          {error}
          <button
            onClick={clearError}
            className="ml-2 text-red-300 hover:text-red-100"
          >
            ✕
          </button>
        </div>
      )}

      {/* Existing Secrets */}
      {secrets.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-green-400 font-mono mb-3">
            Existing Secrets ({secrets.length})
          </h3>
          <div className="space-y-2">
            {secrets.map((secret) => (
              <div
                key={secret.key}
                className="flex items-center justify-between p-3 bg-gray-900/50 border border-gray-600/30 rounded"
              >
                <div className="flex-1">
                  <div className="font-mono text-green-300 font-semibold">
                    {secret.key}
                  </div>
                  <div className="text-xs text-gray-400 font-mono">
                    Updated: {new Date(secret.updatedAt).toLocaleString()}
                  </div>
                </div>
                <button
                  onClick={() => handleDeleteSecret(secret.key)}
                  className="px-2 py-1 bg-red-600/20 text-red-400 border border-red-500/30 rounded font-mono text-xs hover:bg-red-600/30 transition-colors"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Bulk Edit Mode */}
      {isEditing && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-yellow-400 font-mono mb-3">
            Update Secrets
          </h3>
          <div className="space-y-3">
            {editingSecrets.map((secret, index) => (
              <div key={index} className="flex gap-2 items-start">
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="SECRET_KEY"
                    value={secret.key}
                    onChange={(e) =>
                      updateEditingSecret(index, "key", e.target.value)
                    }
                    className="w-full px-3 py-2 bg-gray-900 border border-gray-600 rounded text-green-300 font-mono placeholder-gray-500 focus:border-green-500 focus:outline-none"
                  />
                  {validationErrors[secret.key] && (
                    <div className="text-red-400 text-xs font-mono mt-1">
                      {validationErrors[secret.key]}
                    </div>
                  )}
                </div>
                <div className="flex-1 relative">
                  <input
                    type={showValues[`edit-${index}`] ? "text" : "password"}
                    placeholder="secret_value"
                    value={secret.value}
                    onChange={(e) =>
                      updateEditingSecret(index, "value", e.target.value)
                    }
                    className="w-full px-3 py-2 bg-gray-900 border border-gray-600 rounded text-green-300 font-mono placeholder-gray-500 focus:border-green-500 focus:outline-none pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => toggleShowValue(`edit-${index}`)}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-200"
                  >
                    {showValues[`edit-${index}`] ? "👁️" : "👁️‍🗨️"}
                  </button>
                </div>
                <button
                  onClick={() => removeEditingSecret(index)}
                  className="px-2 py-2 bg-red-600/20 text-red-400 border border-red-500/30 rounded font-mono text-sm hover:bg-red-600/30 transition-colors"
                >
                  ✕
                </button>
              </div>
            ))}
            <button
              onClick={addEditingSecret}
              className="w-full py-2 border-2 border-dashed border-gray-600 rounded text-gray-400 font-mono hover:border-green-500 hover:text-green-400 transition-colors"
            >
              + Add Secret
            </button>
          </div>
        </div>
      )}

      {/* Add New Secret */}
      {!isEditing && (
        <div>
          <h3 className="text-lg font-semibold text-green-400 font-mono mb-3">
            Add New Secret
          </h3>
          <div className="space-y-3">
            <div>
              <input
                type="text"
                placeholder="SECRET_KEY (e.g., NPM_TOKEN, AWS_ACCESS_KEY_ID)"
                value={newSecret.key}
                onChange={(e) =>
                  setNewSecret({ ...newSecret, key: e.target.value })
                }
                className="w-full px-3 py-2 bg-gray-900 border border-gray-600 rounded text-green-300 font-mono placeholder-gray-500 focus:border-green-500 focus:outline-none"
              />
              {validationErrors.newSecret && (
                <div className="text-red-400 text-xs font-mono mt-1">
                  {validationErrors.newSecret}
                </div>
              )}
            </div>
            <div className="relative">
              <input
                type={showValues.newSecret ? "text" : "password"}
                placeholder="secret_value"
                value={newSecret.value}
                onChange={(e) =>
                  setNewSecret({ ...newSecret, value: e.target.value })
                }
                className="w-full px-3 py-2 bg-gray-900 border border-gray-600 rounded text-green-300 font-mono placeholder-gray-500 focus:border-green-500 focus:outline-none pr-10"
              />
              <button
                type="button"
                onClick={() => toggleShowValue("newSecret")}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-200"
              >
                {showValues.newSecret ? "👁️" : "👁️‍🗨️"}
              </button>
            </div>
            <button
              onClick={handleAddSecret}
              disabled={!newSecret.key.trim() || !newSecret.value.trim()}
              className="w-full py-2 bg-green-600/20 text-green-400 border border-green-500/30 rounded font-mono hover:bg-green-600/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Add Secret
            </button>
          </div>
        </div>
      )}

      {/* Help Text */}
      <div className="mt-6 p-4 bg-blue-900/20 border border-blue-500/30 rounded">
        <h4 className="text-blue-400 font-mono font-semibold mb-2">
          ℹ️ About Secrets
        </h4>
        <ul className="text-blue-300 font-mono text-sm space-y-1">
          <li>
            • Secret keys must be uppercase with underscores (e.g., NPM_TOKEN)
          </li>
          <li>• Values are encrypted before storage</li>
          <li>
            • Secrets are injected as environment variables into pipeline steps
          </li>
          <li>• Secret values are automatically hidden in logs</li>
          <li>• Examples: NPM_TOKEN, AWS_ACCESS_KEY_ID, DOCKER_PASSWORD</li>
        </ul>
      </div>
    </div>
  );
}
