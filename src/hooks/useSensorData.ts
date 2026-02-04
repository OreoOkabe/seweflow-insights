import { useState, useEffect, useCallback, useRef } from "react";

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

// Real-world sample data from testing logs
const REAL_SAMPLES = [
  { turbidity: 2.91, tds: 818, ph: 7.44 },
  { turbidity: 4.83, tds: 1932, ph: 7.19 },
  { turbidity: 0.54, tds: 767, ph: 8.50 },
  { turbidity: 0.62, tds: 719, ph: 8.41 },
  { turbidity: 0.62, tds: 673, ph: 8.19 },
];

// Helper to add slight fluctuation within bounds
const fluctuate = (current: number, min: number, max: number, variance: number): number => {
  const change = (Math.random() - 0.5) * variance;
  return Math.max(min, Math.min(max, current + change));
};

// Generate initial historical data using the real samples
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

  let temp = 24.5, flow = 11.8, level = 65.0;

  for (let i = 0; i < count; i++) {
    const sample = REAL_SAMPLES[i % REAL_SAMPLES.length];
    temp = fluctuate(temp, 22, 28, 0.5);
    flow = fluctuate(flow, 11.2, 12.5, 0.3);
    level = fluctuate(level, 64.0, 66.0, 0.4);

    history.ph.push(sample.ph);
    history.temperature.push(Number(temp.toFixed(1)));
    history.tds.push(sample.tds);
    history.turbidity.push(sample.turbidity);
    history.flowRate.push(Number(flow.toFixed(1)));
    history.waterLevel.push(Number(level.toFixed(1)));
  }

  return history;
};

export function useSensorData() {
  const sampleIndexRef = useRef(0);
  
  const [sensorData, setSensorData] = useState<SensorData>(() => {
    const sample = REAL_SAMPLES[0];
    return {
      ph: sample.ph,
      temperature: 24.5,
      tds: sample.tds,
      turbidity: sample.turbidity,
      flowRate: 11.8,
      waterLevel: 65.0,
    };
  });

  const [aiData, setAIData] = useState<AIData>(() => {
    const sample = REAL_SAMPLES[0];
    return {
      classification: "Optimal Flow",
      confidence: 95,
      lstmPredPh: sample.ph,
      lstmPredTds: sample.tds,
      lstmPredTurb: sample.turbidity,
    };
  });

  const [historicalData, setHistoricalData] = useState<HistoricalData>(() => generateInitialHistory());
  const [loading] = useState(false);
  const [error] = useState<string | null>(null);

  // Rotate through real samples every 5 seconds
  const updateMockData = useCallback(() => {
    sampleIndexRef.current = (sampleIndexRef.current + 1) % REAL_SAMPLES.length;
    const sample = REAL_SAMPLES[sampleIndexRef.current];

    setSensorData((prev) => ({
      ph: sample.ph,
      temperature: Number(fluctuate(prev.temperature, 22, 28, 0.3).toFixed(1)),
      tds: sample.tds,
      turbidity: sample.turbidity,
      flowRate: Number(fluctuate(prev.flowRate, 11.2, 12.5, 0.3).toFixed(1)),
      waterLevel: Number(fluctuate(prev.waterLevel, 64.0, 66.0, 0.4).toFixed(1)),
    }));

    setAIData((prev) => ({
      classification: sample.tds > 1500 ? "High-Acidity Waste" : sample.turbidity > 3 ? "Low-Level Contamination" : "Optimal Flow",
      confidence: Math.round(fluctuate(prev.confidence, 92, 99, 1)),
      lstmPredPh: sample.ph,
      lstmPredTds: sample.tds,
      lstmPredTurb: sample.turbidity,
    }));

    // Update historical data by shifting and adding new sample values
    setHistoricalData((prev) => ({
      ph: [...prev.ph.slice(1), sample.ph],
      temperature: [...prev.temperature.slice(1), Number(fluctuate(prev.temperature[prev.temperature.length - 1], 22, 28, 0.3).toFixed(1))],
      tds: [...prev.tds.slice(1), sample.tds],
      turbidity: [...prev.turbidity.slice(1), sample.turbidity],
      flowRate: [...prev.flowRate.slice(1), Number(fluctuate(prev.flowRate[prev.flowRate.length - 1], 11.2, 12.5, 0.3).toFixed(1))],
      waterLevel: [...prev.waterLevel.slice(1), Number(fluctuate(prev.waterLevel[prev.waterLevel.length - 1], 64.0, 66.0, 0.4).toFixed(1))],
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
