"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Loader from "@/components/Loader";
import {
  CATEGORY_ACTION_MAP,
  ACTION_TYPES,
  getActionIcon,
} from "@/lib/qr/actions";
import { QR_CATEGORIES } from "@/lib/qr/categories";

export default function EditQRCodePage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const resolvedParams = use(params);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [qrCode, setQRCode] = useState<any>(null);
  const [actions, setActions] = useState<any[]>([]);
  const [newAction, setNewAction] = useState({
    action_type: "",
    action_data: {},
    priority: 0,
    requires_auth: false,
  });

  useEffect(() => {
    fetchQRCode();
  }, [resolvedParams.id]);

  const fetchQRCode = async () => {
    try {
      const response = await fetch("/api/admin/qr");
      const data = await response.json();

      const code = data.data?.find((qr: any) => qr.id === parseInt(resolvedParams.id));
      if (code) {
        setQRCode(code);
        setActions(code.qr_actions || []);

        // Set default action type based on category
        const availableActions =
          CATEGORY_ACTION_MAP[
            code.category as keyof typeof CATEGORY_ACTION_MAP
          ];
        if (availableActions?.length > 0) {
          setNewAction((prev) => ({
            ...prev,
            action_type: availableActions[0],
          }));
        }
      }
    } catch (error) {
      console.error("Failed to fetch QR code:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveAction = async () => {
    setSaving(true);
    try {
      const response = await fetch("/api/admin/qr/actions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          qr_code_id: parseInt(resolvedParams.id),
          ...newAction,
        }),
      });

      if (response.ok) {
        await fetchQRCode();
        setNewAction({
          action_type: "",
          action_data: {},
          priority: 0,
          requires_auth: false,
        });
      }
    } catch (error) {
      console.error("Failed to save action:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateQRCode = async () => {
    setSaving(true);
    try {
      await fetch("/api/admin/qr", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: parseInt(resolvedParams.id),
          name: qrCode.name,
          description: qrCode.description,
        }),
      });
      router.push("/admin/qr-codes");
    } catch (error) {
      console.error("Failed to update QR code:", error);
    } finally {
      setSaving(false);
    }
  };

  const renderActionDataFields = () => {
    switch (newAction.action_type) {
      case ACTION_TYPES.CONNECT_WIFI:
        return (
          <>
            <Input
              placeholder="Network SSID"
              onChange={(e) =>
                setNewAction({
                  ...newAction,
                  action_data: {
                    ...newAction.action_data,
                    ssid: e.target.value,
                  },
                })
              }
            />
            <Input
              placeholder="Password"
              type="password"
              onChange={(e) =>
                setNewAction({
                  ...newAction,
                  action_data: {
                    ...newAction.action_data,
                    password: e.target.value,
                  },
                })
              }
            />
            <select
              className="w-full rounded border p-2"
              onChange={(e) =>
                setNewAction({
                  ...newAction,
                  action_data: {
                    ...newAction.action_data,
                    security: e.target.value,
                  },
                })
              }
            >
              <option value="WPA">WPA/WPA2</option>
              <option value="WEP">WEP</option>
              <option value="nopass">Open</option>
            </select>
          </>
        );

      case ACTION_TYPES.INJECT_PROMPT:
      case ACTION_TYPES.EXECUTE_PROMPT:
        return (
          <textarea
            className="w-full rounded border p-2"
            placeholder="Enter the prompt text"
            rows={3}
            onChange={(e) =>
              setNewAction({
                ...newAction,
                action_data: { prompt: e.target.value },
              })
            }
          />
        );

      case ACTION_TYPES.REDIRECT_URL:
        return (
          <Input
            placeholder="https://example.com"
            onChange={(e) =>
              setNewAction({
                ...newAction,
                action_data: { url: e.target.value },
              })
            }
          />
        );

      case ACTION_TYPES.OPEN_PROFILE:
        return (
          <>
            <select
              className="w-full rounded border p-2"
              onChange={(e) =>
                setNewAction({
                  ...newAction,
                  action_data: {
                    ...newAction.action_data,
                    platform: e.target.value,
                  },
                })
              }
            >
              <option value="github">GitHub</option>
              <option value="linkedin">LinkedIn</option>
              <option value="instagram">Instagram</option>
              <option value="twitter">Twitter/X</option>
            </select>
            <Input
              placeholder="Username"
              onChange={(e) =>
                setNewAction({
                  ...newAction,
                  action_data: {
                    ...newAction.action_data,
                    username: e.target.value,
                  },
                })
              }
            />
          </>
        );

      default:
        return (
          <textarea
            className="w-full rounded border p-2"
            placeholder="Action data (JSON)"
            rows={3}
            onChange={(e) => {
              try {
                const data = JSON.parse(e.target.value);
                setNewAction({ ...newAction, action_data: data });
              } catch {}
            }}
          />
        );
    }
  };

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (!qrCode) {
    return (
      <div className="flex h-full items-center justify-center">
        <p>QR Code not found</p>
      </div>
    );
  }

  const availableActions =
    CATEGORY_ACTION_MAP[qrCode.category as keyof typeof CATEGORY_ACTION_MAP] ||
    [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">
          Edit QR Code: {qrCode.code}
        </h2>
        <Button
          variant="outline"
          onClick={() => router.push("/admin/qr-codes")}
        >
          ← Back
        </Button>
      </div>

      {/* QR Code Details */}
      <div className="rounded-lg border p-6">
        <h3 className="mb-4 text-lg font-medium">Details</h3>
        <div className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium">Category</label>
            <div className="flex items-center gap-2 text-sm">
              <span>{QR_CATEGORIES[qrCode.category as keyof typeof QR_CATEGORIES]?.icon}</span>
              <span>{QR_CATEGORIES[qrCode.category as keyof typeof QR_CATEGORIES]?.name}</span>
            </div>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium">Name</label>
            <Input
              value={qrCode.name || ""}
              onChange={(e) => setQRCode({ ...qrCode, name: e.target.value })}
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium">Description</label>
            <textarea
              className="w-full rounded border p-2"
              rows={3}
              value={qrCode.description || ""}
              onChange={(e) =>
                setQRCode({ ...qrCode, description: e.target.value })
              }
            />
          </div>
          <Button onClick={handleUpdateQRCode} disabled={saving}>
            {saving ? "Saving..." : "Save Details"}
          </Button>
        </div>
      </div>

      {/* Actions */}
      <div className="rounded-lg border p-6">
        <h3 className="mb-4 text-lg font-medium">Actions</h3>

        {/* Existing Actions */}
        {actions.length > 0 ? (
          <div className="mb-4 space-y-2">
            {actions.map((action) => (
              <div
                key={action.id}
                className="flex items-center gap-2 rounded-md border p-3 text-sm"
              >
                <span>{getActionIcon(action.action_type)}</span>
                <span className="flex-1 font-mono text-xs">{action.action_type}</span>
                <span className="text-xs text-gray-500">
                  Priority: {action.priority}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="mb-4 text-sm text-gray-500">No actions configured</p>
        )}

        {/* Add New Action */}
        <div className="space-y-4 border-t pt-4">
          <h4 className="text-sm font-medium">Add New Action</h4>

          <select
            className="w-full rounded border p-2"
            value={newAction.action_type}
            onChange={(e) =>
              setNewAction({ ...newAction, action_type: e.target.value })
            }
          >
            <option value="">Select action type</option>
            {availableActions.map((actionType) => (
              <option key={actionType} value={actionType}>
                {getActionIcon(actionType)} {actionType}
              </option>
            ))}
          </select>

          {newAction.action_type && (
            <>
              {renderActionDataFields()}

              <div className="flex items-center gap-4">
                <Input
                  type="number"
                  placeholder="Priority"
                  value={newAction.priority}
                  onChange={(e) =>
                    setNewAction({
                      ...newAction,
                      priority: parseInt(e.target.value) || 0,
                    })
                  }
                />
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={newAction.requires_auth}
                    onChange={(e) =>
                      setNewAction({
                        ...newAction,
                        requires_auth: e.target.checked,
                      })
                    }
                  />
                  Requires Auth
                </label>
              </div>

              <Button onClick={handleSaveAction} disabled={saving}>
                Add Action
              </Button>
            </>
          )}
        </div>
      </div>

      {/* QR Code Preview */}
      <div className="rounded-lg border p-6">
        <h3 className="mb-4 text-lg font-medium">QR Code Preview</h3>
        <div className="flex flex-col items-center space-y-4">
          <img
            src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
              `${window.location.origin}/q/${qrCode.code}`
            )}`}
            alt="QR Code"
            className="rounded-lg border"
          />
          <div className="text-center">
            <p className="font-mono text-sm text-gray-600 dark:text-gray-400">
              {window.location.origin}/q/{qrCode.code}
            </p>
            <div className="mt-2 flex justify-center gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => window.open(`/q/${qrCode.code}`, "_blank")}
              >
                Test
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  const url = `${window.location.origin}/q/${qrCode.code}`;
                  const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(url)}`;
                  window.open(qrApiUrl, "_blank");
                }}
              >
                Download
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
