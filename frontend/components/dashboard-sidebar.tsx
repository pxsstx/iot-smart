"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Monitor,
  Activity,
  Users,
  BarChart3,
  Settings,
  Plus,
} from "lucide-react";
import { useState } from "react";

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const sidebarItems = [
  { id: "devices", label: "Devices", icon: Monitor },
  { id: "logs", label: "Device Logs", icon: Activity },
  { id: "users", label: "Users", icon: Users },
  { id: "analytics", label: "Analytics", icon: BarChart3 },
  { id: "settings", label: "Settings", icon: Settings },
];

export function DashboardSidebar({ activeTab, onTabChange }: SidebarProps) {
  return (
    <aside className="w-64 bg-gray-50 border-r border-gray-200 min-h-screen">
      <div className="p-6">
        <nav className="space-y-2">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            return (
              <Button
                key={item.id}
                variant={activeTab === item.id ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start",
                  activeTab === item.id &&
                    "bg-green-50 text-green-700 border-green-200"
                )}
                onClick={() => onTabChange(item.id)}
              >
                <Icon className="mr-3 h-4 w-4" />
                {item.label}
              </Button>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
