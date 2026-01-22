/**
 * Security Configuration
 * Central configuration for all security features
 */

export const SecurityConfig = {
  /**
   * API Secret Key for request signing
   * Should be set via environment variable in production
   */
  apiSecretKey: process.env.API_SECRET_KEY || process.env.NEXT_PUBLIC_API_SECRET_KEY || 'dev-secret-key-change-in-production',

  /**
   * Rate Limiting Configuration
   */
  rateLimit: {
    enabled: process.env.RATE_LIMIT_ENABLED !== 'false', // Enabled by default
    
    // Different limits for different endpoint types
    limits: {
      strict: {
        maxRequests: 3,
        windowMs: 60 * 1000, // 1 minute
      },
      normal: {
        maxRequests: 10,
        windowMs: 60 * 1000, // 1 minute
      },
      relaxed: {
        maxRequests: 20,
        windowMs: 60 * 1000, // 1 minute
      },
    },
  },

  /**
   * Request Signing Configuration
   */
  requestSigning: {
    enabled: process.env.REQUEST_SIGNING_ENABLED !== 'false', // Enabled by default
    algorithm: 'sha256' as const,
    maxTimestampDrift: 5 * 60 * 1000, // 5 minutes
  },

  /**
   * CSRF Protection Configuration
   */
  csrf: {
    enabled: process.env.CSRF_ENABLED !== 'false', // Enabled by default
    tokenExpiry: 60 * 60 * 1000, // 1 hour
  },

  /**
   * Origin Validation Configuration
   */
  origin: {
    allowedOrigins: [
      process.env.NEXT_PUBLIC_BASE_URL,
      'http://localhost:3000',
      'http://127.0.0.1:3000',
      'http://localhost:3001',
      'http://127.0.0.1:3001',
    ].filter(Boolean) as string[],
    
    requireHttpsInProduction: process.env.NODE_ENV === 'production',
  },
} as const;

/**
 * Type-safe security config
 */
export type SecurityConfigType = typeof SecurityConfig;
