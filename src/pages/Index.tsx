import { useState, useMemo } from "react";
import {
  Thermometer,
  Droplets,
  Activity,
  Waves,
  Gauge,
  FlaskConical,
} from "lucide-react";
import { Header } from "@/components/dashboard/Header";
import { ParameterCard } from "@/components/dashboard/ParameterCard";
import { AIInsights } from "@/components/dashboard/AIInsights";
import { DosingLogs } from "@/components/dashboard/DosingLogs";
import { NotificationCenter } from "@/components/dashboard/NotificationCenter";
import { TelemetryModal } from "@/components/dashboard/TelemetryModal";
import { useMockSensorData } from "@/hooks/useMockSensorData";
import { StatusType } from "@/components/dashboard/StatusTag";

const mockNotifications = [
  {
    id: "1",
    type: "heartbeat" as const,
    title: "System Heartbeat",
    message: "RPi-Arduino link established. All sensors reporting normal.",
    timestamp: "14:32:05",
    read: false,
  },
  {
    id: "2",
    type: "threshold" as const,
    title: "TDS Threshold Alert",
    message: "TDS levels approaching upper threshold (950 ppm). Monitor closely.",
    timestamp: "14:28:41",
    read: false,
  },
  {
    id: "3",
    type: "maintenance" as const,
    title: "Sensor Calibration Due",
    message: "pH sensor calibration recommended. Last calibration: 14 days ago.",
    timestamp: "13:45:22",
    read: true,
  },
  {
    id: "4",
    type: "heartbeat" as const,
    title: "ML Models Updated",
    message: "GBM and LSTM models retrained with latest 24h data batch.",
    timestamp: "12:00:00",
    read: true,
  },
];

const mockDosingLogs = [
  {
    id: "1",
    timestamp: "14:25:33",
    chemical: "Hydrochloric Acid (HCl)",
    reason: "Neutralizing high alkalinity detected in waste stream",
    amount: "25mL",
    industry: "Metal Industry",
  },
  {
    id: "2",
    timestamp: "13:58:12",
    chemical: "Sodium Hydroxide (NaOH)",
    reason: "Breaking down organic lignin compounds in effluent",
    amount: "40mL",
    industry: "Paper/Textile",
  },
  {
    id: "3",
    timestamp: "12:45:08",
    chemical: "Sodium Hydroxide (NaOH)",
    reason: "pH correction for acidic industrial discharge",
    amount: "30mL",
    industry: "Paper/Textile",
  },
];

const mockPredictionData = [
  { time: "0", waterLevel: 65, ph: 7.2 },
  { time: "2", waterLevel: 67, ph: 7.1 },
  { time: "4", waterLevel: 70, ph: 7.0 },
  { time: "6", waterLevel: 74, ph: 6.9 },
  { time: "8", waterLevel: 79, ph: 6.8 },
  { time: "10", waterLevel: 83, ph: 6.7 },
];

export default function Index() {
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isTelemetryOpen, setIsTelemetryOpen] = useState(false);
  const { sensorData, historicalData, getRawTelemetry } = useMockSensorData();

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
      ? `Notification: AI predicts potential overflow in T-minus ${Math.floor(10 - (sensorData.waterLevel - 75) / 2)} minutes.`
      : undefined;

  return (
    <div className="min-h-screen bg-background scanlines">
      <Header
        onOpenNotifications={() => setIsNotificationOpen(true)}
        onOpenTelemetry={() => setIsTelemetryOpen(true)}
        notificationCount={unreadCount}
        systemStatus="online"
      />

      <main className="container mx-auto p-6 space-y-6">
        {/* 6-Parameter Hero Grid */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <div className="glow-line flex-1" />
            <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-[0.3em]">
              Sensor Array — Live Telemetry
            </h2>
            <div className="glow-line flex-1" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <ParameterCard
              title="pH Level"
              value={sensorData.ph}
              unit="pH"
              status={getStatus("ph", sensorData.ph)}
              sparklineData={historicalData.ph}
              icon={<FlaskConical className="w-4 h-4" />}
              minRange={6.5}
              maxRange={8.5}
            />
            <ParameterCard
              title="Temperature"
              value={sensorData.temperature}
              unit="°C"
              status={getStatus("temperature", sensorData.temperature)}
              sparklineData={historicalData.temperature}
              icon={<Thermometer className="w-4 h-4" />}
              minRange={15}
              maxRange={35}
            />
            <ParameterCard
              title="TDS"
              value={sensorData.tds}
              unit="ppm"
              status={getStatus("tds", sensorData.tds)}
              sparklineData={historicalData.tds}
              icon={<Droplets className="w-4 h-4" />}
              minRange={200}
              maxRange={800}
            />
            <ParameterCard
              title="Turbidity"
              value={sensorData.turbidity}
              unit="NTU"
              status={getStatus("turbidity", sensorData.turbidity)}
              sparklineData={historicalData.turbidity}
              icon={<Waves className="w-4 h-4" />}
              minRange={0}
              maxRange={25}
            />
            <ParameterCard
              title="Flow Rate"
              value={sensorData.flowRate}
              unit="L/min"
              status={getStatus("flowRate", sensorData.flowRate)}
              sparklineData={historicalData.flowRate}
              icon={<Activity className="w-4 h-4" />}
              minRange={40}
              maxRange={120}
            />
            <ParameterCard
              title="Water Level"
              value={sensorData.waterLevel}
              unit="%"
              status={getStatus("waterLevel", sensorData.waterLevel)}
              sparklineData={historicalData.waterLevel}
              icon={<Gauge className="w-4 h-4" />}
              minRange={20}
              maxRange={80}
            />
          </div>
        </section>

        {/* AI Insights */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <div className="glow-line flex-1" />
            <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-[0.3em]">
              Smart AI Layer — GBM & LSTM Insights
            </h2>
            <div className="glow-line flex-1" />
          </div>

          <AIInsights
            classification={aiClassification}
            confidence={aiConfidence}
            prediction={mockPredictionData}
            alertMessage={alertMessage}
          />
        </section>

        {/* Chemical Dosing */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <div className="glow-line flex-1" />
            <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-[0.3em]">
              Logical Actuation — Chemical Integration
            </h2>
            <div className="glow-line flex-1" />
          </div>

          <DosingLogs logs={mockDosingLogs} />
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
