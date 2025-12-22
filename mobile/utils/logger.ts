import AsyncStorage from '@react-native-async-storage/async-storage';

const IS_DEV = __DEV__;
const MAX_LOGS = 100;
const LOGS_KEY = '@nightvibe_error_logs';

interface ErrorLog {
  timestamp: string;
  message: string;
  stack?: string;
  context?: any;
  level: 'error' | 'warn' | 'info';
}

class Logger {
  private async saveLogs(logs: ErrorLog[]) {
    try {
      await AsyncStorage.setItem(LOGS_KEY, JSON.stringify(logs));
    } catch (e) {
      // Silently fail if we can't save logs
    }
  }

  private async getStoredLogs(): Promise<ErrorLog[]> {
    try {
      const logs = await AsyncStorage.getItem(LOGS_KEY);
      return logs ? JSON.parse(logs) : [];
    } catch {
      return [];
    }
  }

  private async addLog(log: ErrorLog) {
    const logs = await this.getStoredLogs();
    logs.unshift(log);

    // Keep only the latest MAX_LOGS entries
    if (logs.length > MAX_LOGS) {
      logs.splice(MAX_LOGS);
    }

    await this.saveLogs(logs);
  }

  async error(message: string, error?: Error | any, context?: any) {
    const errorLog: ErrorLog = {
      timestamp: new Date().toISOString(),
      message,
      stack: error?.stack || error?.message,
      context,
      level: 'error',
    };

    // In development, also console.error for immediate visibility
    if (IS_DEV) {
      console.error('[ERROR]', message, error, context);
    }

    // Save to storage in production
    if (!IS_DEV) {
      await this.addLog(errorLog);
      // TODO: Send to backend API for monitoring
      // this.sendToBackend(errorLog);
    }
  }

  async warn(message: string, context?: any) {
    const warnLog: ErrorLog = {
      timestamp: new Date().toISOString(),
      message,
      context,
      level: 'warn',
    };

    if (IS_DEV) {
      console.warn('[WARN]', message, context);
    }

    if (!IS_DEV) {
      await this.addLog(warnLog);
    }
  }

  async info(message: string, context?: any) {
    const infoLog: ErrorLog = {
      timestamp: new Date().toISOString(),
      message,
      context,
      level: 'info',
    };

    if (IS_DEV) {
      console.log('[INFO]', message, context);
    }

    // Only save errors and warnings in production, not info
  }

  async getLogs(): Promise<ErrorLog[]> {
    return this.getStoredLogs();
  }

  async clearLogs() {
    try {
      await AsyncStorage.removeItem(LOGS_KEY);
    } catch (e) {
      // Silently fail
    }
  }

  async exportLogs(): Promise<string> {
    const logs = await this.getStoredLogs();
    return JSON.stringify(logs, null, 2);
  }

  // TODO: Implement when you have a backend endpoint
  // private async sendToBackend(log: ErrorLog) {
  //   try {
  //     await fetch('YOUR_API_ENDPOINT/logs', {
  //       method: 'POST',
  //       headers: { 'Content-Type': 'application/json' },
  //       body: JSON.stringify(log),
  //     });
  //   } catch (e) {
  //     // Silently fail - we don't want logging to crash the app
  //   }
  // }
}

export const logger = new Logger();
