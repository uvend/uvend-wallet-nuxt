/**
 * Composable for M2M/Hexing API calls
 * Fetches device readings, logs, and calculates daily usage
 * Uses server API routes to avoid CORS issues
 * 
 * NOTE: Currently using dummy data for testing
 * To switch back to real API calls, set USE_DUMMY_DATA to false
 */
const USE_DUMMY_DATA = true; // Set to false when API is working

export const useM2MApi = () => {
  const logRequest = (label: string, meta: Record<string, any> = {}) => {
    console.log(`[M2M API] ${label}`, meta)
  }

  const logError = (label: string, error: any, meta: Record<string, any> = {}) => {
    console.error(`[M2M API] ${label} failed`, {
      ...meta,
      message: error?.message,
      statusCode: error?.statusCode || error?.response?.status,
      statusMessage: error?.statusMessage || error?.response?.statusMessage,
      data: error?.data || error?.response?._data
    })
  }

  /**
   * Generate dummy device data
   */
  const getDummyDevice = (serial: string) => {
    return {
      id: Math.floor(Math.random() * 10000) + 1000,
      serial: serial,
      name: `Device ${serial}`,
      type_id: 'meter',
      status: 'active'
    };
  };

  /**
   * Generate dummy readings with cumulative kinetic data
   */
  const getDummyReadings = (deviceId: number) => {
    const readings = [];
    const now = new Date();
    
    // Generate readings for the last 30 days
    for (let i = 30; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      
      // Generate multiple readings per day (simulating hourly readings)
      for (let hour = 0; hour < 24; hour += 6) { // Every 6 hours
        const timestamp = new Date(date);
        timestamp.setHours(hour, 0, 0, 0);
        
        // Cumulative kinetic reading (increases over time)
        const baseValue = 10000 + (30 - i) * 50; // Base increases daily
        const hourValue = hour * 2; // Small increase per hour
        const value = baseValue + hourValue + Math.random() * 10; // Add some variance
        
        readings.push({
          id: readings.length + 1,
          device_id: deviceId,
          register_id: 1,
          name: 'Kinetic Energy',
          value: Math.round(value * 100) / 100,
          timestamp: timestamp.toISOString(),
          time: timestamp.toISOString(),
          created: timestamp.toISOString()
        });
      }
    }
    
    return readings;
  };

  /**
   * Generate dummy log entries
   */
  const getDummyLogEntries = (utilityType: string = 'electricity') => {
    const entries = [];
    const now = new Date();
    
    for (let i = 14; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const baseValue = utilityType === 'water' ? 45 : 120;
      const variance = utilityType === 'water' ? 25 : 60;
      const value = baseValue + Math.random() * variance;
      
      entries.push({
        timestamp: date.toISOString(),
        value: parseFloat(value.toFixed(2)),
        Value: parseFloat(value.toFixed(2)),
        reading: parseFloat(value.toFixed(2)),
        Reading: parseFloat(value.toFixed(2))
      });
    }
    
    return entries;
  };

  /**
   * Generate dummy period consumption log
   */
  const getDummyPeriodConsumption = () => {
    return {
      id: 1,
      name: 'Period Consumption',
      value: 1250.75,
      Value: 1250.75,
      consumption: 1250.75,
      Consumption: 1250.75,
      reading: 1250.75,
      Reading: 1250.75,
      timestamp: new Date().toISOString(),
      period: 'monthly',
      entries: getDummyLogEntries('electricity')
    };
  };

  /**
   * Get device by serial number
   */
  const getDeviceBySerial = async (serial: string) => {
    if (USE_DUMMY_DATA) {
      console.log(`[DUMMY] Getting device by serial: ${serial}`);
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 300));
      return getDummyDevice(serial);
    }
    
    try {
      logRequest('Request: device by serial', { serial });
      const response = await $fetch(`/api/m2m/devices/serial/${serial}`);
      console.log('[M2M API] Device fetched', { serial });
      return response;
    } catch (error) {
      logError('Request: device by serial', error, { serial });
      throw error;
    }
  };

  /**
   * Get device readings for a specific register
   * @param deviceId - Device ID
   * @param registerId - Register ID (optional, if not provided, gets all registers)
   */
  const getDeviceReadings = async (deviceId: number, registerId?: number) => {
    if (USE_DUMMY_DATA) {
      console.log(`[DUMMY] Getting device readings for device ID: ${deviceId}`);
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 400));
      return getDummyReadings(deviceId);
    }
    
    try {
      logRequest('Request: device readings', { deviceId, registerId });
      let url = `/api/m2m/devices/${deviceId}/registers/readings`;
      if (registerId) {
        url = `/api/m2m/devices/${deviceId}/registers/readings`;
      }
      const response = await $fetch(url);
      console.log('[M2M API] Device readings fetched', { deviceId, registerId });
      return response;
    } catch (error) {
      logError('Request: device readings', error, { deviceId, registerId });
      throw error;
    }
  };

  /**
   * Get device readings by serial number
   */
  const getDeviceReadingsBySerial = async (serial: string) => {
    try {
      const device: any = await getDeviceBySerial(serial);
      if (!device || !device.id) {
        throw new Error(`Device not found for serial: ${serial}`);
      }
      return await getDeviceReadings(device.id);
    } catch (error) {
      logError('Request: device readings by serial', error, { serial });
      throw error;
    }
  };

  /**
   * Get device log readings (for period consumption)
   * @param deviceId - Device ID
   * @param logId - Log ID
   * @param channelId - Channel ID (optional)
   */
  const getDeviceLogReadings = async (
    deviceId: number,
    logId: number,
    channelId?: number
  ) => {
    if (USE_DUMMY_DATA) {
      console.log(`[DUMMY] Getting log readings for device ID: ${deviceId}, log ID: ${logId}`);
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 300));
      return getDummyPeriodConsumption();
    }
    
    try {
      logRequest('Request: log readings', { deviceId, logId, channelId });
      let url = `/api/m2m/devices/${deviceId}/logs/${logId}/readings`;
      if (channelId) {
        url = `/api/m2m/devices/${deviceId}/logs/${logId}/readings?channelId=${channelId}`;
      }
      const response = await $fetch(url);
      console.log('[M2M API] Log readings fetched', { deviceId, logId, channelId });
      return response;
    } catch (error) {
      logError('Request: log readings', error, { deviceId, logId, channelId });
      throw error;
    }
  };

  /**
   * Get device log readings by serial number
   */
  const getDeviceLogReadingsBySerial = async (
    serial: string,
    logId: number,
    channelId?: number
  ) => {
    try {
      const device: any = await getDeviceBySerial(serial);
      if (!device || !device.id) {
        throw new Error(`Device not found for serial: ${serial}`);
      }
      return await getDeviceLogReadings(device.id, logId, channelId);
    } catch (error) {
      logError('Request: log readings by serial', error, { serial, logId, channelId });
      throw error;
    }
  };

  /**
   * Get all device logs
   */
  const getDeviceLogs = async (deviceId: number, options: { utilityType?: string } = {}) => {
    if (USE_DUMMY_DATA) {
      console.log(`[DUMMY] Getting device logs for device ID: ${deviceId}`);
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 300));
      return [
        {
          id: 1,
          name: 'Usage Trend',
          type: 'usage',
          device_id: deviceId,
          entries: getDummyLogEntries(options.utilityType)
        },
        getDummyPeriodConsumption()
      ];
    }
    
    try {
      logRequest('Request: device logs', { deviceId, utilityType: options.utilityType });
      const response = await $fetch(`/api/m2m/devices/${deviceId}/logs`);
      console.log('[M2M API] Device logs fetched', { deviceId });
      return response;
    } catch (error) {
      logError('Request: device logs', error, { deviceId, utilityType: options.utilityType });
      throw error;
    }
  };

  /**
   * Get logs by serial number
   */
  const getDeviceLogsBySerial = async (serial: string, options: { utilityType?: string } = {}) => {
    try {
      logRequest('Request: device logs by serial', { serial, utilityType: options.utilityType });
      const device: any = await getDeviceBySerial(serial);
      if (!device || !device.id) {
        throw new Error(`Device not found for serial: ${serial}`);
      }
      const logs = await getDeviceLogs(device.id, options);
      console.log('[M2M API] Device logs fetched by serial', { serial, deviceId: device.id });
      return logs;
    } catch (error) {
      logError('Request: device logs by serial', error, { serial, utilityType: options.utilityType });
      throw error;
    }
  };

  /**
   * Find period consumption log by name
   */
  const findPeriodConsumptionLog = async (deviceId: number) => {
    try {
      const logs = await getDeviceLogs(deviceId);
      // Find log with name containing "period consumption" (case insensitive)
      const periodLog = Array.isArray(logs) 
        ? logs.find((log: any) => 
            log.name && log.name.toLowerCase().includes('period consumption')
          )
        : null;
      return periodLog;
    } catch (error) {
      logError('Request: find period consumption log', error, { deviceId });
      return null;
    }
  };

  /**
   * Calculate daily usage from cumulative kinetic readings
   * @param readings - Array of readings with timestamp and value
   * @returns Array of daily usage objects
   */
  const calculateDailyUsage = (readings: any[]) => {
    if (!readings || readings.length === 0) {
      return [];
    }

    // Sort readings by timestamp
    const sortedReadings = [...readings].sort((a, b) => {
      const timeA = new Date(a.timestamp || a.time || a.created || 0).getTime();
      const timeB = new Date(b.timestamp || b.time || b.created || 0).getTime();
      return timeA - timeB;
    });

    // Group readings by date
    const readingsByDate = new Map<string, any[]>();
    
    sortedReadings.forEach((reading) => {
      const timestamp = reading.timestamp || reading.time || reading.created;
      if (!timestamp) return;
      
      const date = new Date(timestamp);
      const dateKey = date.toISOString().split('T')[0]; // YYYY-MM-DD
      
      if (!readingsByDate.has(dateKey)) {
        readingsByDate.set(dateKey, []);
      }
      readingsByDate.get(dateKey)!.push(reading);
    });

    // Calculate daily usage (difference between first and last reading of each day)
    const dailyUsage: Array<{ date: string; usage: number; readings: any[] }> = [];
    
    readingsByDate.forEach((dayReadings, date) => {
      if (dayReadings.length === 0) return;
      
      // Get the value from the reading (could be in different fields)
      const getValue = (reading: any) => {
        return reading.value || reading.Value || reading.reading || reading.Reading || 0;
      };
      
      // Sort by timestamp within the day
      dayReadings.sort((a, b) => {
        const timeA = new Date(a.timestamp || a.time || a.created || 0).getTime();
        const timeB = new Date(b.timestamp || b.time || b.created || 0).getTime();
        return timeA - timeB;
      });
      
      const firstReading = dayReadings[0];
      const lastReading = dayReadings[dayReadings.length - 1];
      
      const firstValue = getValue(firstReading);
      const lastValue = getValue(lastReading);
      
      // Daily usage is the difference (cumulative readings)
      const usage = Math.max(0, lastValue - firstValue);
      
      dailyUsage.push({
        date,
        usage,
        readings: dayReadings
      });
    });

    // Sort by date
    dailyUsage.sort((a, b) => a.date.localeCompare(b.date));
    
    return dailyUsage;
  };

  /**
   * Get daily usage for a device by serial number
   * @param serial - Device serial number
   * @param days - Number of days to fetch (default: 30)
   */
  const getDailyUsageBySerial = async (serial: string, days: number = 30) => {
    try {
      const device: any = await getDeviceBySerial(serial);
      if (!device || !device.id) {
        throw new Error(`Device not found for serial: ${serial}`);
      }

      // Get all register readings
      const readings = await getDeviceReadings(device.id);
      
      // Find kinetic register (usually cumulative)
      // This might need adjustment based on actual API response structure
      const kineticReadings = Array.isArray(readings) 
        ? readings.filter((r: any) => 
            r.name && r.name.toLowerCase().includes('kinetic')
          )
        : readings;

      const normalizedReadings = Array.isArray(kineticReadings) ? kineticReadings : [kineticReadings];

      // Calculate daily usage
      const dailyUsage = calculateDailyUsage(normalizedReadings as any[]);
      
      // Filter to last N days
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - days);
      const recentDailyUsage = dailyUsage.filter(
        (day) => new Date(day.date) >= cutoffDate
      );

      return recentDailyUsage;
    } catch (error) {
      logError('Request: daily usage by serial', error, { serial });
      throw error;
    }
  };

  /**
   * Get period consumption for a device by serial number
   */
  const getPeriodConsumptionBySerial = async (serial: string) => {
    try {
      const device: any = await getDeviceBySerial(serial);
      if (!device || !device.id) {
        throw new Error(`Device not found for serial: ${serial}`);
      }

      const periodLog = await findPeriodConsumptionLog(device.id);
      if (!periodLog) {
        return null;
      }

      const logReadings = await getDeviceLogReadings(device.id, periodLog.id);
      return logReadings;
    } catch (error) {
      logError('Request: period consumption by serial', error, { serial });
      return null;
    }
  };

  return {
    getDeviceBySerial,
    getDeviceReadings,
    getDeviceReadingsBySerial,
    getDeviceLogReadings,
    getDeviceLogReadingsBySerial,
    getDeviceLogs,
    getDeviceLogsBySerial,
    findPeriodConsumptionLog,
    calculateDailyUsage,
    getDailyUsageBySerial,
    getPeriodConsumptionBySerial,
  };
};

