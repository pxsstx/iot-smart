"use client";

import { useState } from "react";
import { useLiffContext } from "@/components/liff-provider";
import { LoginScreen } from "@/components/login-screen";
import { DashboardHeader } from "@/components/dashboard-header";
import { DashboardSidebar } from "@/components/dashboard-sidebar";
import { DeviceList } from "@/components/device-list";
import { DeviceLogs } from "@/components/device-logs";
import { Loader2 } from "lucide-react";

export default function HomePage() {
  const { isLoggedIn, isLoading } = useLiffContext();
  const [activeTab, setActiveTab] = useState("devices");
  const [selectedDeviceId, setSelectedDeviceId] = useState<
    string | undefined
  >();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!isLoggedIn) {
    return <LoginScreen />;
  }

  const handleViewLogs = (deviceId: string) => {
    setSelectedDeviceId(deviceId);
    setActiveTab("logs");
  };

  const renderContent = () => {
    switch (activeTab) {
      case "devices":
        return <DeviceList onViewLogs={handleViewLogs} />;
      case "logs":
        return <DeviceLogs deviceId={selectedDeviceId} />;
      case "users":
        return <div className="p-6">Users - Coming Soon</div>;
      case "analytics":
        return <div className="p-6">Analytics - Coming Soon</div>;
      case "settings":
        return <div className="p-6">Settings - Coming Soon</div>;
      default:
        return <DeviceList onViewLogs={handleViewLogs} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />
      <div className="flex">
        <DashboardSidebar activeTab={activeTab} onTabChange={setActiveTab} />
        <main className="flex-1 p-6">{renderContent()}</main>
      </div>
    </div>
  );
}
