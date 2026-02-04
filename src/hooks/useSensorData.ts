import { useState, useEffect, useCallback } from "react";
import { externalSupabase } from "@/lib/externalSupabase";

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

const defaultSensorData: SensorData = {
  ph: 0,
  temperature: 0,
  tds: 0,
  turbidity: 0,
  flowRate: 0,
  waterLevel: 0,
};

const defaultAIData: AIData = {
  classification: "Loading...",
  confidence: 0,
  lstmPredPh: 0,
  lstmPredTds: 0,
  lstmPredTurb: 0,
};

export function useSensorData() {
  const [sensorData, setSensorData] = useState<SensorData>(defaultSensorData);
  const [aiData, setAIData] = useState<AIData>(defaultAIData);
  const [historicalData, setHistoricalData] = useState<HistoricalData>({
    ph: [],
    temperature: [],
    tds: [],
    turbidity: [],
    flowRate: [],
    waterLevel: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLatestReading = useCallback(async () => {
    try {
      const { data, error: fetchError } = await externalSupabase
        .from("sensor_readings")
        .select("*")
        .order("timestamp", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (fetchError) {
        console.error("Error fetching sensor data:", fetchError);
        setError(fetchError.message);
        return;
      }

      if (data) {
        // Map your table columns to dashboard fields
        // Your columns: pH, TDS, Turb, Temp, level, Flow, timestamp
        setSensorData({
          ph: data.pH ?? 0,
          temperature: data.Temp ?? 0,
          tds: data.TDS ?? 0,
          turbidity: data.Turb ?? 0,
          flowRate: data.Flow ?? 0,
          waterLevel: data.level ?? 0,
        });
        
        // Map AI columns
        setAIData({
          classification: data.ai_state ?? "Unknown",
          confidence: Math.round((data.ai_confidence ?? 0) * 100),
          lstmPredPh: data.lstm_pred_ph ?? 0,
          lstmPredTds: data.lstm_pred_tds ?? 0,
          lstmPredTurb: data.lstm_pred_turb ?? 0,
        });
        
        setError(null);
      }
    } catch (err) {
      console.error("Unexpected error:", err);
      setError("Failed to fetch sensor data");
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchHistoricalData = useCallback(async () => {
    try {
      const { data, error: fetchError } = await externalSupabase
        .from("sensor_readings")
        .select("*")
        .order("timestamp", { ascending: false })
        .limit(30);

      if (fetchError) {
        console.error("Error fetching historical data:", fetchError);
        return;
      }

      if (data && data.length > 0) {
        // Reverse to get chronological order for sparklines
        const reversed = [...data].reverse();
        setHistoricalData({
          ph: reversed.map((d) => d.pH ?? 0),
          temperature: reversed.map((d) => d.Temp ?? 0),
          tds: reversed.map((d) => d.TDS ?? 0),
          turbidity: reversed.map((d) => d.Turb ?? 0),
          flowRate: reversed.map((d) => d.Flow ?? 0),
          waterLevel: reversed.map((d) => d.level ?? 0),
        });
      }
    } catch (err) {
      console.error("Unexpected error fetching historical:", err);
    }
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchLatestReading();
    fetchHistoricalData();
  }, [fetchLatestReading, fetchHistoricalData]);

  // Poll for updates every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      fetchLatestReading();
      fetchHistoricalData();
    }, 5000);
    return () => clearInterval(interval);
  }, [fetchLatestReading, fetchHistoricalData]);

  const getRawTelemetry = useCallback(
    () => ({
      timestamp: new Date().toISOString(),
      device_id: "External-Supabase",
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
