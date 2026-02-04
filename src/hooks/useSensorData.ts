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

// Post-filtration sample data - derived from raw logs with filtration improvement
const POST_FILTRATION_SAMPLES = [
  { turbidity: 0.32, tds: 245, ph: 7.45 },
  { turbidity: 0.28, tds: 218, ph: 7.52 },
  { turbidity: 0.41, tds: 276, ph: 7.38 },
  { turbidity: 0.19, tds: 192, ph: 7.65 },
  { turbidity: 0.35, tds: 258, ph: 7.48 },
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

  let temp = 24.5, flow = 14.0, level = 66.5;

  for (let i = 0; i < count; i++) {
    const sample = POST_FILTRATION_SAMPLES[i % POST_FILTRATION_SAMPLES.length];
    temp = fluctuate(temp, 22, 28, 0.5);
    flow = fluctuate(flow, 13.0, 15.0, 0.3);
    level = fluctuate(level, 65.0, 68.0, 0.4);

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
    const sample = POST_FILTRATION_SAMPLES[0];
    return {
      ph: sample.ph,
      temperature: 24.5,
      tds: sample.tds,
      turbidity: sample.turbidity,
      flowRate: 14.0,
      waterLevel: 66.5,
    };
  });

  const [aiData, setAIData] = useState<AIData>(() => {
    const sample = POST_FILTRATION_SAMPLES[0];
    return {
      classification: "Safe - Non-Potable",
      confidence: 97,
      lstmPredPh: sample.ph,
      lstmPredTds: sample.tds,
      lstmPredTurb: sample.turbidity,
    };
  });

  const [historicalData, setHistoricalData] = useState<HistoricalData>(() => generateInitialHistory());
  const [loading] = useState(false);
  const [error] = useState<string | null>(null);

  // Rotate through post-filtration samples every 5 seconds
  const updateMockData = useCallback(() => {
    sampleIndexRef.current = (sampleIndexRef.current + 1) % POST_FILTRATION_SAMPLES.length;
    const sample = POST_FILTRATION_SAMPLES[sampleIndexRef.current];

    setSensorData((prev) => ({
      ph: sample.ph,
      temperature: Number(fluctuate(prev.temperature, 22, 28, 0.3).toFixed(1)),
      tds: sample.tds,
      turbidity: sample.turbidity,
      flowRate: Number(fluctuate(prev.flowRate, 13.0, 15.0, 0.3).toFixed(1)),
      waterLevel: Number(fluctuate(prev.waterLevel, 65.0, 68.0, 0.4).toFixed(1)),
    }));

    setAIData((prev) => ({
      classification: "Safe - Non-Potable",
      confidence: Math.round(fluctuate(prev.confidence, 96, 99, 0.5)),
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
      flowRate: [...prev.flowRate.slice(1), Number(fluctuate(prev.flowRate[prev.flowRate.length - 1], 13.0, 15.0, 0.3).toFixed(1))],
      waterLevel: [...prev.waterLevel.slice(1), Number(fluctuate(prev.waterLevel[prev.waterLevel.length - 1], 65.0, 68.0, 0.4).toFixed(1))],
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
