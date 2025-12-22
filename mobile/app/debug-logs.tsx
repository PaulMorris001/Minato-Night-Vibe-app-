import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Share,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import { logger } from '../utils/logger';

export default function DebugLogsScreen() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadLogs = async () => {
    setLoading(true);
    const fetchedLogs = await logger.getLogs();
    setLogs(fetchedLogs);
    setLoading(false);
  };

  useEffect(() => {
    loadLogs();
  }, []);

  const handleClearLogs = () => {
    Alert.alert(
      'Clear Logs',
      'Are you sure you want to clear all error logs?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: async () => {
            await logger.clearLogs();
            setLogs([]);
          },
        },
      ]
    );
  };

  const handleExportLogs = async () => {
    try {
      const logsText = await logger.exportLogs();
      await Share.share({
        message: logsText,
        title: 'NightVibe Error Logs',
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to export logs');
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'error':
        return '#ef4444';
      case 'warn':
        return '#f59e0b';
      case 'info':
        return '#3b82f6';
      default:
        return '#6b7280';
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Debug Logs</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity onPress={loadLogs} style={styles.actionButton}>
            <Text style={styles.actionButtonText}>Refresh</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleExportLogs} style={styles.actionButton}>
            <Text style={styles.actionButtonText}>Export</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleClearLogs} style={styles.clearButton}>
            <Text style={styles.clearButtonText}>Clear</Text>
          </TouchableOpacity>
        </View>
      </View>

      {loading ? (
        <View style={styles.centerContainer}>
          <Text style={styles.emptyText}>Loading logs...</Text>
        </View>
      ) : logs.length === 0 ? (
        <View style={styles.centerContainer}>
          <Text style={styles.emptyText}>No error logs found</Text>
          <Text style={styles.emptySubtext}>
            Errors will be logged here in production mode
          </Text>
        </View>
      ) : (
        <ScrollView style={styles.logsList}>
          {logs.map((log, index) => (
            <View key={index} style={styles.logItem}>
              <View style={styles.logHeader}>
                <View
                  style={[
                    styles.levelBadge,
                    { backgroundColor: getLevelColor(log.level) },
                  ]}
                >
                  <Text style={styles.levelText}>{log.level.toUpperCase()}</Text>
                </View>
                <Text style={styles.timestamp}>
                  {new Date(log.timestamp).toLocaleString()}
                </Text>
              </View>
              <Text style={styles.logMessage}>{log.message}</Text>
              {log.stack && (
                <Text style={styles.logStack} numberOfLines={3}>
                  {log.stack}
                </Text>
              )}
              {log.context && (
                <Text style={styles.logContext}>
                  Context: {JSON.stringify(log.context)}
                </Text>
              )}
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    paddingTop: 60,
    paddingBottom: 16,
    paddingHorizontal: 16,
    backgroundColor: '#111',
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  backButton: {
    marginBottom: 8,
  },
  backButtonText: {
    color: '#3b82f6',
    fontSize: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 12,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#1f2937',
    borderRadius: 6,
  },
  actionButtonText: {
    color: '#3b82f6',
    fontSize: 14,
  },
  clearButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#7f1d1d',
    borderRadius: 6,
  },
  clearButtonText: {
    color: '#ef4444',
    fontSize: 14,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    color: '#9ca3af',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
  },
  logsList: {
    flex: 1,
  },
  logItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#1f2937',
  },
  logHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  levelBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  levelText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  timestamp: {
    color: '#6b7280',
    fontSize: 12,
  },
  logMessage: {
    color: '#fff',
    fontSize: 14,
    marginBottom: 4,
  },
  logStack: {
    color: '#9ca3af',
    fontSize: 12,
    fontFamily: 'monospace',
    marginTop: 4,
  },
  logContext: {
    color: '#6b7280',
    fontSize: 12,
    marginTop: 4,
  },
});
