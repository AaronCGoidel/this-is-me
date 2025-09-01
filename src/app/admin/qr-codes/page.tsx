"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { QR_CATEGORIES, type QRCategory } from "@/lib/qr/categories";
import Loader from "@/components/Loader";

interface QRCode {
  id: number;
  code: string;
  category: string;
  base58_id: string;
  name?: string;
  description?: string;
  is_active: boolean;
  scan_count: number;
  last_scanned_at?: string;
  created_at: string;
  qr_actions?: any[];
  catalogue_items?: any;
}

export default function QRCodesAdminPage() {
  const [qrCodes, setQRCodes] = useState<QRCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<QRCategory | "all">(
    "all"
  );
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [generateForm, setGenerateForm] = useState({
    category: "C" as QRCategory,
    count: 1,
    namePrefix: "",
  });
  const [showInitMessage, setShowInitMessage] = useState(false);

  useEffect(() => {
    fetchQRCodes();
  }, [selectedCategory]);

  const fetchQRCodes = async () => {
    try {
      const params = new URLSearchParams();
      if (selectedCategory !== "all") {
        params.append("category", selectedCategory);
      }

      const response = await fetch(`/api/admin/qr?${params}`);
      const data = await response.json();

      if (response.ok) {
        setQRCodes(data.data || []);
      }
    } catch (error) {
      console.error("Failed to fetch QR codes:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate = async () => {
    try {
      const response = await fetch("/api/admin/qr", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(generateForm),
      });

      if (response.ok) {
        setShowGenerateModal(false);
        fetchQRCodes();
        setGenerateForm({ category: "C", count: 1, namePrefix: "" });
      }
    } catch (error) {
      console.error("Failed to generate QR codes:", error);
    }
  };

  const toggleActive = async (id: number, isActive: boolean) => {
    try {
      await fetch("/api/admin/qr", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, is_active: !isActive }),
      });
      fetchQRCodes();
    } catch (error) {
      console.error("Failed to toggle QR code:", error);
    }
  };

  const deleteQRCode = async (id: number) => {
    if (!confirm("Are you sure you want to delete this QR code?")) return;

    try {
      await fetch("/api/admin/qr", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      fetchQRCodes();
    } catch (error) {
      console.error("Failed to delete QR code:", error);
    }
  };

  const getQRCodeURL = (code: string) => {
    const baseURL = window.location.origin;
    return `${baseURL}/q/${code}`;
  };

  const downloadQRCode = async (code: string, name?: string) => {
    const url = getQRCodeURL(code);
    const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(
      url
    )}`;

    try {
      const response = await fetch(qrApiUrl);
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = downloadUrl;
      a.download = `qr-${name || code}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error("Failed to download QR code:", error);
    }
  };

  const initializeQRCodes = async () => {
    try {
      const response = await fetch("/api/admin/qr/init", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      const data = await response.json();
      
      if (response.ok) {
        setShowInitMessage(true);
        fetchQRCodes();
        setTimeout(() => setShowInitMessage(false), 3000);
      } else {
        console.error("Init failed:", data);
      }
    } catch (error) {
      console.error("Failed to initialize QR codes:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">QR Codes</h2>
        <Button onClick={() => setShowGenerateModal(true)}>
          Generate New
        </Button>
      </div>

      {showInitMessage && (
        <div className="rounded-md bg-green-50 p-3 text-sm text-green-800 dark:bg-green-900/20 dark:text-green-400">
          Sample QR codes initialized successfully!
        </div>
      )}

      {/* Category Filter Pills */}
      <div className="flex flex-wrap gap-2">
        <button
          className={`rounded-full px-3 py-1 text-sm transition-colors ${
            selectedCategory === "all"
              ? "bg-black text-white dark:bg-white dark:text-black"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
          }`}
          onClick={() => setSelectedCategory("all")}
        >
          All
        </button>
        {Object.entries(QR_CATEGORIES).map(([key, cat]) => (
          <button
            key={key}
            className={`rounded-full px-3 py-1 text-sm transition-colors ${
              selectedCategory === key
                ? "bg-black text-white dark:bg-white dark:text-black"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
            }`}
            onClick={() => setSelectedCategory(key as QRCategory)}
          >
            <span className="mr-1">{cat.icon}</span>
            {cat.name}
          </button>
        ))}
      </div>

      {/* QR Codes Table */}
      <table className="w-full table-auto border-collapse">
        <thead>
          <tr className="text-left border-b">
            <th className="py-2">Code</th>
            <th className="py-2">Name</th>
            <th className="py-2">Category</th>
            <th className="py-2 text-center">Scans</th>
            <th className="py-2">Last Scanned</th>
            <th className="py-2"></th>
          </tr>
        </thead>
        <tbody>
          {qrCodes.map((qr) => (
            <tr
              key={qr.id}
              className="border-b hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              <td className="py-3">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm">{qr.code}</span>
                  {!qr.is_active && (
                    <span className="rounded-full bg-gray-200 px-2 py-0.5 text-xs text-gray-600 dark:bg-gray-700 dark:text-gray-400">
                      Inactive
                    </span>
                  )}
                </div>
              </td>
              <td className="py-3">
                <div>
                  <div className="font-medium">
                    {qr.name || <span className="text-gray-400">Unnamed</span>}
                  </div>
                  {qr.description && (
                    <div className="text-sm text-gray-500">{qr.description}</div>
                  )}
                </div>
              </td>
              <td className="py-3">
                <span className="inline-flex items-center gap-1 text-sm">
                  <span>{QR_CATEGORIES[qr.category as QRCategory]?.icon}</span>
                  <span>{QR_CATEGORIES[qr.category as QRCategory]?.name}</span>
                </span>
              </td>
              <td className="py-3 text-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {qr.scan_count}
                </span>
              </td>
              <td className="py-3">
                <span className="text-sm text-gray-500">
                  {qr.last_scanned_at
                    ? new Date(qr.last_scanned_at).toLocaleDateString()
                    : "Never"}
                </span>
              </td>
              <td className="py-3 text-right">
                <div className="flex items-center justify-end gap-2">
                  <button
                    onClick={() => window.open(getQRCodeURL(qr.code), "_blank")}
                    className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
                  >
                    View
                  </button>
                  <span className="text-gray-300 dark:text-gray-600">·</span>
                  <button
                    onClick={() => downloadQRCode(qr.code, qr.name)}
                    className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
                  >
                    Download
                  </button>
                  <span className="text-gray-300 dark:text-gray-600">·</span>
                  <Link
                    href={`/admin/qr-codes/${qr.id}`}
                    className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
                  >
                    Edit
                  </Link>
                </div>
              </td>
            </tr>
          ))}
          {qrCodes.length === 0 && (
            <tr>
              <td colSpan={6} className="py-8 text-center">
                <div className="space-y-3">
                  <p className="text-gray-500">
                    {selectedCategory === "all"
                      ? "No QR codes yet."
                      : `No QR codes in the ${QR_CATEGORIES[selectedCategory as QRCategory]?.name} category.`}
                  </p>
                  {selectedCategory === "all" && (
                    <div className="flex justify-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={initializeQRCodes}
                      >
                        Initialize Sample Codes
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => setShowGenerateModal(true)}
                      >
                        Generate New
                      </Button>
                    </div>
                  )}
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Generate Modal */}
      {showGenerateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl dark:bg-gray-900">
            <h3 className="mb-4 text-lg font-semibold">Generate QR Codes</h3>

            <div className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium">
                  Category
                </label>
                <select
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-500 dark:border-gray-700 dark:bg-gray-800"
                  value={generateForm.category}
                  onChange={(e) =>
                    setGenerateForm({
                      ...generateForm,
                      category: e.target.value as QRCategory,
                    })
                  }
                >
                  {Object.entries(QR_CATEGORIES).map(([key, cat]) => (
                    <option key={key} value={key}>
                      {cat.icon} {cat.name} — {cat.description}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium">
                  Number of codes
                </label>
                <Input
                  type="number"
                  min="1"
                  max="100"
                  value={generateForm.count}
                  onChange={(e) =>
                    setGenerateForm({
                      ...generateForm,
                      count: parseInt(e.target.value) || 1,
                    })
                  }
                  className="w-full"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium">
                  Name prefix
                  <span className="ml-1 font-normal text-gray-500">
                    (optional)
                  </span>
                </label>
                <Input
                  value={generateForm.namePrefix}
                  onChange={(e) =>
                    setGenerateForm({
                      ...generateForm,
                      namePrefix: e.target.value,
                    })
                  }
                  placeholder="e.g., Living Room Art"
                  className="w-full"
                />
                {generateForm.namePrefix && (
                  <p className="mt-1 text-xs text-gray-500">
                    Will create: {generateForm.namePrefix} 1,{" "}
                    {generateForm.namePrefix} 2, etc.
                  </p>
                )}
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setShowGenerateModal(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleGenerate}>
                Generate {generateForm.count} Code{generateForm.count !== 1 ? "s" : ""}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
