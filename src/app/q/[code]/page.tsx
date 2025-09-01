"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Loader from "@/components/Loader";
import { Button } from "@/components/ui/button";

interface QRScanResult {
  success: boolean;
  qrCode?: {
    id: number;
    code: string;
    category: string;
    name?: string;
    description?: string;
    metadata?: Record<string, unknown>;
  };
  catalogueItem?: {
    title?: string;
    artist_creator?: string;
    year?: number;
    description?: string;
    location?: string;
  };
  action?: {
    success: boolean;
    type: "redirect" | "wifi" | "prompt" | "display" | "api" | "error";
    data?: {
      url?: string;
      ssid?: string;
      password?: string;
      security?: string;
      prompt?: string;
      autoExecute?: boolean;
      component?: string;
      props?: Record<string, unknown>;
      endpoint?: string;
      method?: string;
      headers?: Record<string, string>;
      body?: unknown;
    };
    error?: string;
  };
  scanCount?: number;
  error?: string;
}

export default function QRScannerPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const router = useRouter();
  const resolvedParams = use(params);
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState<QRScanResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    handleQRCode(resolvedParams.code);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resolvedParams.code]);

  const handleQRCode = async (code: string) => {
    try {
      const response = await fetch(`/api/q/${code}`);
      const data: QRScanResult = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to process QR code");
      }

      setResult(data);

      // Handle different action types
      if (data.action) {
        switch (data.action.type) {
          case "redirect":
            // Redirect to external URL
            if (data.action.data?.url) {
              window.location.href = data.action.data.url;
            }
            break;

          case "wifi":
            // Generate WiFi connection string
            handleWiFiConnection(data.action.data);
            break;

          case "prompt":
            // Redirect to main chat with prompt
            const prompt = encodeURIComponent(data.action.data?.prompt || "");
            const autoExecute = data.action.data?.autoExecute ? "1" : "0";
            router.push(`/?prompt=${prompt}&execute=${autoExecute}`);
            break;

          case "display":
            // Component will be rendered below
            break;

          case "api":
            // Execute API call
            handleAPICall(data.action.data);
            break;

          case "error":
            setError(data.action.error || "Action failed");
            break;
        }
      }
    } catch (err) {
      console.error("Error processing QR code:", err);
      setError(
        err instanceof Error ? err.message : "Failed to process QR code"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleWiFiConnection = (
    data: Record<string, unknown> | undefined
  ) => {
    if (!data) return;

    const { ssid, password, security = "WPA" } = data;
    const wifiString = `WIFI:T:${security};S:${ssid};P:${password};;`;

    // For mobile devices, this might trigger WiFi connection
    // For desktop, show the credentials
    if (/iPhone|iPad|Android/i.test(navigator.userAgent)) {
      window.location.href = wifiString;
    }
  };

  const handleAPICall = async (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: Record<string, any> | undefined
  ) => {
    if (!data) return;

    try {
      const response = await fetch(data.url || data.endpoint, {
        method: data.method || "POST",
        headers: data.headers || { "Content-Type": "application/json" },
        body: data.body ? JSON.stringify(data.body) : undefined,
      });

      if (!response.ok) {
        throw new Error("API call failed");
      }
    } catch (err) {
      console.error("API call error:", err);
      setError("Failed to execute action");
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-4">
        <h1 className="text-2xl font-semibold text-red-600">Error</h1>
        <p className="text-gray-600">{error}</p>
        <Button onClick={() => router.push("/")}>Go Home</Button>
      </div>
    );
  }

  // Display component for catalogue items or events
  if (result?.action?.type === "display") {
    const { component, props } = result.action.data || {};

    if (component === "CatalogueItem" && result.catalogueItem) {
      return (
        <div className="container mx-auto p-6">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-4">
              {result.catalogueItem.title}
            </h1>
            {result.catalogueItem.artist_creator && (
              <p className="text-xl text-gray-600 mb-2">
                by {result.catalogueItem.artist_creator}
              </p>
            )}
            {result.catalogueItem.year && (
              <p className="text-lg text-gray-500 mb-4">
                {result.catalogueItem.year}
              </p>
            )}
            {result.catalogueItem.description && (
              <div className="prose max-w-none mb-6">
                <p>{result.catalogueItem.description}</p>
              </div>
            )}
            {result.catalogueItem.location && (
              <p className="text-sm text-gray-500">
                📍 {result.catalogueItem.location}
              </p>
            )}
            <div className="mt-8 pt-4 border-t">
              <p className="text-sm text-gray-400">
                Scanned {result.scanCount} time
                {result.scanCount !== 1 ? "s" : ""}
              </p>
            </div>
          </div>
        </div>
      );
    }

    if (component === "EventDetails") {
      return (
        <div className="container mx-auto p-6">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-4">{String(props?.title || '')}</h1>
            <p className="text-lg mb-4">{String(props?.description || '')}</p>
            {props?.date ? <p className="text-md mb-2">📅 {String(props.date)}</p> : null}
            {props?.location ? (
              <p className="text-md mb-4">📍 {String(props.location)}</p>
            ) : null}
            <Button className="mr-2">RSVP</Button>
            <Button variant="outline">Add to Calendar</Button>
          </div>
        </div>
      );
    }
  }

  // WiFi display for desktop
  if (result?.action?.type === "wifi") {
    const { ssid, password } = result.action.data || {};
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-4">
        <h1 className="text-2xl font-semibold">WiFi Network</h1>
        <div className="rounded-lg border p-6">
          <p className="mb-2">
            <strong>Network:</strong> {ssid}
          </p>
          <p>
            <strong>Password:</strong> {password}
          </p>
        </div>
        <p className="text-sm text-gray-500">
          {/iPhone|iPad|Android/i.test(navigator.userAgent)
            ? "Your device should prompt to connect"
            : "Enter these credentials to connect"}
        </p>
      </div>
    );
  }

  // Default display for unhandled cases
  return (
    <div className="flex h-screen flex-col items-center justify-center gap-4">
      <h1 className="text-2xl font-semibold">QR Code Scanned</h1>
      {result?.qrCode?.name && <p className="text-lg">{result.qrCode.name}</p>}
      {result?.qrCode?.description && (
        <p className="text-gray-600">{result.qrCode.description}</p>
      )}
      <Button onClick={() => router.push("/")}>Go Home</Button>
    </div>
  );
}
