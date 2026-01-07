import { ErrorType } from '3a-ecommerce-types';

export interface AppError {
  type: ErrorType;
  message: string;
  originalError?: any;
  statusCode?: number;
}

export class ErrorHandler {
  static handle(error: any): AppError {
    if (error.code === 'ECONNABORTED' || error.message === 'Network Error') {
      return {
        type: ErrorType.NETWORK_ERROR,
        message: 'Unable to connect to the server. Please check your internet connection.',
        originalError: error,
      };
    }

    if (error.response) {
      const { status, data } = error.response;

      switch (status) {
        case 401:
          return {
            type: ErrorType.AUTHENTICATION_ERROR,
            message: data?.message || 'Authentication failed. Please log in again.',
            statusCode: status,
            originalError: error,
          };

        case 403:
          return {
            type: ErrorType.AUTHORIZATION_ERROR,
            message: data?.message || 'You do not have permission to perform this action.',
            statusCode: status,
            originalError: error,
          };

        case 404:
          return {
            type: ErrorType.NOT_FOUND_ERROR,
            message: data?.message || 'The requested resource was not found.',
            statusCode: status,
            originalError: error,
          };

        case 422:
          return {
            type: ErrorType.VALIDATION_ERROR,
            message: data?.message || 'Invalid input data.',
            statusCode: status,
            originalError: error,
          };

        case 500:
        case 502:
        case 503:
        case 504:
          return {
            type: ErrorType.SERVER_ERROR,
            message: data?.message || 'A server error occurred. Please try again later.',
            statusCode: status,
            originalError: error,
          };

        default:
          return {
            type: ErrorType.UNKNOWN_ERROR,
            message: data?.message || 'An unexpected error occurred.',
            statusCode: status,
            originalError: error,
          };
      }
    }

    if (error.graphQLErrors && error.graphQLErrors.length > 0) {
      const gqlError = error.graphQLErrors[0];
      return {
        type: ErrorType.UNKNOWN_ERROR,
        message: gqlError.message || 'A GraphQL error occurred.',
        originalError: error,
      };
    }

    return {
      type: ErrorType.UNKNOWN_ERROR,
      message: error.message || 'An unexpected error occurred.',
      originalError: error,
    };
  }

  static getErrorMessage(error: any): string {
    return this.handle(error).message;
  }

  static isAuthError(error: any): boolean {
    const handled = this.handle(error);
    return (
      handled.type === ErrorType.AUTHENTICATION_ERROR ||
      handled.type === ErrorType.AUTHORIZATION_ERROR
    );
  }

  static shouldRetry(error: any): boolean {
    const handled = this.handle(error);
    return handled.type === ErrorType.NETWORK_ERROR || handled.type === ErrorType.SERVER_ERROR;
  }
}

export interface NotificationOptions {
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  duration?: number;
}

export class ErrorNotifier {
  private static notifyCallback?: (options: NotificationOptions) => void;

  static setNotifyCallback(callback: (options: NotificationOptions) => void): void {
    this.notifyCallback = callback;
  }

  static notifyError(error: any): void {
    const handled = ErrorHandler.handle(error);
    if (this.notifyCallback) {
      this.notifyCallback({
        type: 'error',
        message: handled.message,
        duration: 5000,
      });
    }
  }

  static notifySuccess(message: string): void {
    if (this.notifyCallback) {
      this.notifyCallback({
        type: 'success',
        message,
        duration: 3000,
      });
    }
  }

  static notifyWarning(message: string): void {
    if (this.notifyCallback) {
      this.notifyCallback({
        type: 'warning',
        message,
        duration: 4000,
      });
    }
  }

  static notifyInfo(message: string): void {
    if (this.notifyCallback) {
      this.notifyCallback({
        type: 'info',
        message,
        duration: 3000,
      });
    }
  }
}
