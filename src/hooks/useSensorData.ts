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

export function useSensorData() {
  const [sensorData, setSensorData] = useState<SensorData>(defaultSensorData);
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
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (fetchError) {
        console.error("Error fetching sensor data:", fetchError);
        setError(fetchError.message);
        return;
      }

      if (data) {
        // Map your table columns to dashboard fields
        // Adjust these mappings if your column names differ
        setSensorData({
          ph: data.ph ?? 0,
          temperature: data.temperature ?? 0,
          tds: data.tds ?? 0,
          turbidity: data.turbidity ?? 0,
          flowRate: data.flow_rate ?? data.flowRate ?? 0,
          waterLevel: data.water_level ?? data.waterLevel ?? 0,
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
        .order("created_at", { ascending: false })
        .limit(30);

      if (fetchError) {
        console.error("Error fetching historical data:", fetchError);
        return;
      }

      if (data && data.length > 0) {
        // Reverse to get chronological order for sparklines
        const reversed = [...data].reverse();
        setHistoricalData({
          ph: reversed.map((d) => d.ph ?? 0),
          temperature: reversed.map((d) => d.temperature ?? 0),
          tds: reversed.map((d) => d.tds ?? 0),
          turbidity: reversed.map((d) => d.turbidity ?? 0),
          flowRate: reversed.map((d) => d.flow_rate ?? d.flowRate ?? 0),
          waterLevel: reversed.map((d) => d.water_level ?? d.waterLevel ?? 0),
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
    }),
    [sensorData]
  );

  return { sensorData, historicalData, getRawTelemetry, loading, error };
}
