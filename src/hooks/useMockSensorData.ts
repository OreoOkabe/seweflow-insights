import { useState, useEffect, useCallback } from "react";

export interface SensorData {
  ph: number;
  temperature: number;
  tds: number;
  turbidity: number;
  flowRate: number;
  waterLevel: number;
}

export interface HistoricalData {
  ph: number[];
  temperature: number[];
  tds: number[];
  turbidity: number[];
  flowRate: number[];
  waterLevel: number[];
}

const generateSparklineData = (baseValue: number, variance: number, count: number = 30): number[] => {
  const data: number[] = [];
  let value = baseValue;
  for (let i = 0; i < count; i++) {
    value = value + (Math.random() - 0.5) * variance;
    data.push(value);
  }
  return data;
};

const initialSensorData: SensorData = {
  ph: 7.2,
  temperature: 24.5,
  tds: 450,
  turbidity: 12.5,
  flowRate: 85.3,
  waterLevel: 65.0,
};

export function useMockSensorData() {
  const [sensorData, setSensorData] = useState<SensorData>(initialSensorData);
  const [historicalData, setHistoricalData] = useState<HistoricalData>({
    ph: generateSparklineData(7.2, 0.3),
    temperature: generateSparklineData(24.5, 1),
    tds: generateSparklineData(450, 30),
    turbidity: generateSparklineData(12.5, 2),
    flowRate: generateSparklineData(85.3, 5),
    waterLevel: generateSparklineData(65, 3),
  });

  const updateSensorData = useCallback(() => {
    setSensorData((prev) => ({
      ph: Math.max(0, Math.min(14, prev.ph + (Math.random() - 0.5) * 0.2)),
      temperature: Math.max(10, Math.min(40, prev.temperature + (Math.random() - 0.5) * 0.5)),
      tds: Math.max(100, Math.min(1000, prev.tds + (Math.random() - 0.5) * 20)),
      turbidity: Math.max(0, Math.min(100, prev.turbidity + (Math.random() - 0.5) * 2)),
      flowRate: Math.max(0, Math.min(150, prev.flowRate + (Math.random() - 0.5) * 5)),
      waterLevel: Math.max(0, Math.min(100, prev.waterLevel + (Math.random() - 0.5) * 2)),
    }));

    setHistoricalData((prev) => ({
      ph: [...prev.ph.slice(1), sensorData.ph],
      temperature: [...prev.temperature.slice(1), sensorData.temperature],
      tds: [...prev.tds.slice(1), sensorData.tds],
      turbidity: [...prev.turbidity.slice(1), sensorData.turbidity],
      flowRate: [...prev.flowRate.slice(1), sensorData.flowRate],
      waterLevel: [...prev.waterLevel.slice(1), sensorData.waterLevel],
    }));
  }, [sensorData]);

  useEffect(() => {
    const interval = setInterval(updateSensorData, 2000);
    return () => clearInterval(interval);
  }, [updateSensorData]);

  const getRawTelemetry = useCallback(() => ({
    timestamp: new Date().toISOString(),
    device_id: "RPi-001",
    arduino_link: "ACTIVE",
    sensors: {
      ph: { value: sensorData.ph, unit: "pH", status: "OK" },
      temperature: { value: sensorData.temperature, unit: "°C", status: "OK" },
      tds: { value: sensorData.tds, unit: "ppm", status: "OK" },
      turbidity: { value: sensorData.turbidity, unit: "NTU", status: "OK" },
      flow_rate: { value: sensorData.flowRate, unit: "L/min", status: "OK" },
      water_level: { value: sensorData.waterLevel, unit: "%", status: "OK" },
    },
    ml_models: {
      gbm_classifier: {
        classification: "Optimal Flow",
        confidence: 0.94,
      },
      lstm_predictor: {
        forecast_horizon_min: 10,
        predicted_water_level: 68.5,
        predicted_ph: 7.1,
      },
    },
    gpio_status: {
      pump_hcl: "STANDBY",
      pump_naoh: "STANDBY",
      main_valve: "OPEN",
    },
  }), [sensorData]);

  return { sensorData, historicalData, getRawTelemetry };
}
