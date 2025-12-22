import { logger } from './logger';

// Global error handler for unhandled promise rejections
export const setupGlobalErrorHandler = () => {
  // Handle unhandled promise rejections
  const originalHandler = ErrorUtils.getGlobalHandler();

  ErrorUtils.setGlobalHandler((error, isFatal) => {
    logger.error('Uncaught error', error, { isFatal });

    // Call the original handler
    if (originalHandler) {
      originalHandler(error, isFatal);
    }
  });

  // Handle unhandled promise rejections
  if (typeof global.Promise !== 'undefined') {
    const originalRejectionTracking = require('promise/setimmediate/rejection-tracking').enable;
    require('promise/setimmediate/rejection-tracking').enable({
      allRejections: true,
      onUnhandled: (id: string, error: Error) => {
        logger.error('Unhandled promise rejection', error, { id });
      },
      onHandled: () => {
        // Do nothing
      },
    });
  }
};

// Override console methods in production to also log to storage
export const setupConsoleOverride = () => {
  if (!__DEV__) {
    const originalError = console.error;
    const originalWarn = console.warn;

    console.error = (...args) => {
      logger.error(
        args[0]?.toString() || 'Error',
        args[1],
        args.slice(2)
      );
      originalError(...args);
    };

    console.warn = (...args) => {
      logger.warn(
        args[0]?.toString() || 'Warning',
        args.slice(1)
      );
      originalWarn(...args);
    };
  }
};
