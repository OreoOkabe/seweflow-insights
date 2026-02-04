import { useState, useMemo, useCallback } from "react";
import {
  Thermometer,
  Droplets,
  Activity,
  Waves,
  Gauge,
  FlaskConical,
  Code2,
} from "lucide-react";
import { Header } from "@/components/dashboard/Header";
import { ParameterCard } from "@/components/dashboard/ParameterCard";
import { AIInsights } from "@/components/dashboard/AIInsights";
import { DosingLogs } from "@/components/dashboard/DosingLogs";
import { NotificationCenter } from "@/components/dashboard/NotificationCenter";
import { TelemetryModal } from "@/components/dashboard/TelemetryModal";
import { useSensorData } from "@/hooks/useSensorData";
import { StatusType } from "@/components/dashboard/StatusTag";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const mockNotifications = [
  {
    id: "1",
    type: "heartbeat" as const,
    title: "System Heartbeat",
    message: "All sensors reporting normal.",
    timestamp: "14:32",
    read: false,
  },
  {
    id: "2",
    type: "threshold" as const,
    title: "TDS Alert",
    message: "TDS approaching upper threshold (950 ppm).",
    timestamp: "14:28",
    read: false,
  },
  {
    id: "3",
    type: "maintenance" as const,
    title: "Calibration Due",
    message: "pH sensor calibration recommended.",
    timestamp: "13:45",
    read: true,
  },
];

const mockDosingLogs = [
  {
    id: "1",
    timestamp: "14:25",
    chemical: "HCl Solution",
    reason: "Neutralizing high alkalinity",
    amount: "25mL",
    industry: "Metal",
  },
  {
    id: "2",
    timestamp: "13:58",
    chemical: "NaOH Solution",
    reason: "Breaking down organic compounds",
    amount: "40mL",
    industry: "Paper",
  },
  {
    id: "3",
    timestamp: "12:45",
    chemical: "NaOH Solution",
    reason: "pH correction",
    amount: "30mL",
    industry: "Textile",
  },
];

export default function Index() {
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isTelemetryOpen, setIsTelemetryOpen] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const { sensorData, historicalData, getRawTelemetry, loading, error } = useSensorData();

  const getStatus = (param: string, value: number): StatusType => {
    switch (param) {
      case "ph":
        if (value < 5 || value > 9) return "critical";
        if (value < 6 || value > 8.5) return "warning";
        return "filtering";
      case "temperature":
        if (value > 35) return "warning";
        return "optimal";
      case "tds":
        if (value > 900) return "critical";
        if (value > 700) return "warning";
        return "filtering";
      case "turbidity":
        if (value > 50) return "critical";
        if (value > 25) return "dosing";
        return "filtering";
      case "flowRate":
        if (value < 20) return "stagnant";
        if (value < 40) return "warning";
        return "optimal";
      case "waterLevel":
        if (value > 90) return "critical";
        if (value > 80) return "warning";
        return "optimal";
      default:
        return "optimal";
    }
  };

  const unreadCount = mockNotifications.filter((n) => !n.read).length;

  const aiClassification = useMemo(() => {
    if (sensorData.waterLevel > 85) return "Critical Blockage";
    if (sensorData.ph < 5 || sensorData.ph > 9) return "High-Acidity Waste";
    if (sensorData.tds > 800) return "Low-Level Contamination";
    return "Optimal Flow";
  }, [sensorData]);

  const aiConfidence = useMemo(() => {
    return Math.floor(85 + Math.random() * 12);
  }, [sensorData]);

  const alertMessage =
    sensorData.waterLevel > 75
      ? `Potential overflow in ${Math.floor(10 - (sensorData.waterLevel - 75) / 2)} minutes`
      : undefined;

  const handleDownloadStats = useCallback(() => {
    const stats = {
      exportDate: new Date().toISOString(),
      sensorData: sensorData,
      historicalData: historicalData,
      aiAnalysis: {
        classification: aiClassification,
        confidence: aiConfidence,
      },
      dosingLogs: mockDosingLogs,
      systemStatus: "online",
    };

    const blob = new Blob([JSON.stringify(stats, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `salain-stats-${new Date().toISOString().split("T")[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success("Statistics exported successfully");
  }, [sensorData, historicalData, aiClassification, aiConfidence]);

  return (
    <div className="min-h-screen bg-background">
      <Header
        onOpenNotifications={() => setIsNotificationOpen(true)}
        onToggleAdvanced={() => setShowAdvanced(!showAdvanced)}
        onDownloadStats={handleDownloadStats}
        notificationCount={unreadCount}
        systemStatus="online"
        showAdvanced={showAdvanced}
      />

      <main className="container mx-auto py-6 space-y-6">
        {/* 6-Parameter Grid */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-foreground">
              Live Sensors
            </h2>
            {showAdvanced && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsTelemetryOpen(true)}
                className="gap-2"
              >
                <Code2 className="w-4 h-4" />
                Raw Data
              </Button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <ParameterCard
              title="pH Level"
              value={sensorData.ph}
              unit="pH"
              status={getStatus("ph", sensorData.ph)}
              sparklineData={historicalData.ph}
              icon={<FlaskConical className="w-5 h-5" />}
              minRange={6.5}
              maxRange={8.5}
              showAdvanced={showAdvanced}
            />
            <ParameterCard
              title="Temperature"
              value={sensorData.temperature}
              unit="°C"
              status={getStatus("temperature", sensorData.temperature)}
              sparklineData={historicalData.temperature}
              icon={<Thermometer className="w-5 h-5" />}
              minRange={15}
              maxRange={35}
              showAdvanced={showAdvanced}
            />
            <ParameterCard
              title="TDS"
              value={sensorData.tds}
              unit="ppm"
              status={getStatus("tds", sensorData.tds)}
              sparklineData={historicalData.tds}
              icon={<Droplets className="w-5 h-5" />}
              minRange={200}
              maxRange={800}
              showAdvanced={showAdvanced}
            />
            <ParameterCard
              title="Turbidity"
              value={sensorData.turbidity}
              unit="NTU"
              status={getStatus("turbidity", sensorData.turbidity)}
              sparklineData={historicalData.turbidity}
              icon={<Waves className="w-5 h-5" />}
              minRange={0}
              maxRange={25}
              showAdvanced={showAdvanced}
            />
            <ParameterCard
              title="Flow Rate"
              value={sensorData.flowRate}
              unit="L/min"
              status={getStatus("flowRate", sensorData.flowRate)}
              sparklineData={historicalData.flowRate}
              icon={<Activity className="w-5 h-5" />}
              minRange={40}
              maxRange={120}
              showAdvanced={showAdvanced}
            />
            <ParameterCard
              title="Water Level"
              value={sensorData.waterLevel}
              unit="%"
              status={getStatus("waterLevel", sensorData.waterLevel)}
              sparklineData={historicalData.waterLevel}
              icon={<Gauge className="w-5 h-5" />}
              minRange={20}
              maxRange={80}
              showAdvanced={showAdvanced}
            />
          </div>
        </section>

        {/* AI & Dosing Section */}
        <section>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <AIInsights
              classification={aiClassification}
              confidence={aiConfidence}
              alertMessage={alertMessage}
              showAdvanced={showAdvanced}
            />
            <DosingLogs 
              logs={mockDosingLogs} 
              showAdvanced={showAdvanced}
            />
          </div>
        </section>
      </main>

      {/* Notification Center */}
      <NotificationCenter
        notifications={mockNotifications}
        isOpen={isNotificationOpen}
        onClose={() => setIsNotificationOpen(false)}
      />

      {/* Telemetry Modal */}
      <TelemetryModal
        isOpen={isTelemetryOpen}
        onClose={() => setIsTelemetryOpen(false)}
        data={getRawTelemetry()}
      />
    </div>
  );
}
