import { useState, useEffect, useCallback } from "react";

export interface SensorData {
  ph: number;
  temperature: number;
  tds: number;
  turbidity: number;
  flowRate: number;
  waterLevel: number;
}

export interface AIData {
  classification: string;
  confidence: number;
  lstmPredPh: number;
  lstmPredTds: number;
  lstmPredTurb: number;
}

export interface HistoricalData {
  ph: number[];
  temperature: number[];
  tds: number[];
  turbidity: number[];
  flowRate: number[];
  waterLevel: number[];
}

// Helper to generate random value within range with slight fluctuation
const randomInRange = (min: number, max: number): number => {
  return min + Math.random() * (max - min);
};

// Helper to add slight fluctuation to existing value within bounds
const fluctuate = (current: number, min: number, max: number, variance: number): number => {
  const change = (Math.random() - 0.5) * variance;
  return Math.max(min, Math.min(max, current + change));
};

// Generate initial historical data with 20 points
const generateInitialHistory = (): HistoricalData => {
  const count = 20;
  const history: HistoricalData = {
    ph: [],
    temperature: [],
    tds: [],
    turbidity: [],
    flowRate: [],
    waterLevel: [],
  };

  let ph = 7.1, temp = 24.5, tds = 225, turb = 2.0, flow = 12.3, level = 65.0;

  for (let i = 0; i < count; i++) {
    ph = fluctuate(ph, 6.8, 7.4, 0.1);
    temp = fluctuate(temp, 22, 28, 0.5);
    tds = fluctuate(tds, 200, 250, 10);
    turb = fluctuate(turb, 1.0, 3.0, 0.3);
    flow = fluctuate(flow, 10.5, 14.2, 0.5);
    level = fluctuate(level, 62.0, 68.5, 1.0);

    history.ph.push(Number(ph.toFixed(2)));
    history.temperature.push(Number(temp.toFixed(1)));
    history.tds.push(Number(tds.toFixed(0)));
    history.turbidity.push(Number(turb.toFixed(2)));
    history.flowRate.push(Number(flow.toFixed(1)));
    history.waterLevel.push(Number(level.toFixed(1)));
  }

  return history;
};

export function useSensorData() {
  const [sensorData, setSensorData] = useState<SensorData>({
    ph: 7.1,
    temperature: 24.5,
    tds: 225,
    turbidity: 2.0,
    flowRate: 12.3,
    waterLevel: 65.0,
  });

  const [aiData, setAIData] = useState<AIData>({
    classification: "Optimal Flow",
    confidence: 95,
    lstmPredPh: 7.1,
    lstmPredTds: 225,
    lstmPredTurb: 2.0,
  });

  const [historicalData, setHistoricalData] = useState<HistoricalData>(() => generateInitialHistory());
  const [loading] = useState(false);
  const [error] = useState<string | null>(null);

  // Simulate polling by updating values every 5 seconds
  const updateMockData = useCallback(() => {
    setSensorData((prev) => ({
      ph: Number(fluctuate(prev.ph, 6.8, 7.4, 0.08).toFixed(2)),
      temperature: Number(fluctuate(prev.temperature, 22, 28, 0.3).toFixed(1)),
      tds: Number(fluctuate(prev.tds, 200, 250, 8).toFixed(0)),
      turbidity: Number(fluctuate(prev.turbidity, 1.0, 3.0, 0.2).toFixed(2)),
      flowRate: Number(fluctuate(prev.flowRate, 10.5, 14.2, 0.4).toFixed(1)),
      waterLevel: Number(fluctuate(prev.waterLevel, 62.0, 68.5, 0.8).toFixed(1)),
    }));

    setAIData((prev) => ({
      classification: "Optimal Flow",
      confidence: Math.round(fluctuate(prev.confidence, 92, 99, 1)),
      lstmPredPh: Number(randomInRange(6.8, 7.4).toFixed(2)),
      lstmPredTds: Number(randomInRange(200, 250).toFixed(0)),
      lstmPredTurb: Number(randomInRange(1.0, 3.0).toFixed(2)),
    }));

    // Update historical data by shifting and adding new value
    setHistoricalData((prev) => ({
      ph: [...prev.ph.slice(1), Number(fluctuate(prev.ph[prev.ph.length - 1], 6.8, 7.4, 0.08).toFixed(2))],
      temperature: [...prev.temperature.slice(1), Number(fluctuate(prev.temperature[prev.temperature.length - 1], 22, 28, 0.3).toFixed(1))],
      tds: [...prev.tds.slice(1), Number(fluctuate(prev.tds[prev.tds.length - 1], 200, 250, 8).toFixed(0))],
      turbidity: [...prev.turbidity.slice(1), Number(fluctuate(prev.turbidity[prev.turbidity.length - 1], 1.0, 3.0, 0.2).toFixed(2))],
      flowRate: [...prev.flowRate.slice(1), Number(fluctuate(prev.flowRate[prev.flowRate.length - 1], 10.5, 14.2, 0.4).toFixed(1))],
      waterLevel: [...prev.waterLevel.slice(1), Number(fluctuate(prev.waterLevel[prev.waterLevel.length - 1], 62.0, 68.5, 0.8).toFixed(1))],
    }));
  }, []);

  // Simulate polling every 5 seconds
  useEffect(() => {
    const interval = setInterval(updateMockData, 5000);
    return () => clearInterval(interval);
  }, [updateMockData]);

  const getRawTelemetry = useCallback(
    () => ({
      timestamp: new Date().toISOString(),
      device_id: "Mock-Generator",
      arduino_link: "SIMULATED",
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
          classification: aiData.classification,
          confidence: aiData.confidence / 100,
        },
        lstm_predictor: {
          forecast_horizon_min: 10,
          predicted_ph: aiData.lstmPredPh,
          predicted_tds: aiData.lstmPredTds,
          predicted_turb: aiData.lstmPredTurb,
        },
      },
      gpio_status: {
        pump_hcl: "STANDBY",
        pump_naoh: "STANDBY",
        main_valve: "OPEN",
      },
    }),
    [sensorData, aiData]
  );

  return { sensorData, historicalData, aiData, getRawTelemetry, loading, error };
}
