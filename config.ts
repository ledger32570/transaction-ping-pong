/* eslint-disable no-process-env */

/**
 * Check the process.env global for the given key. If it does not exist,
 * throw an error since the app expects/requires that it exists in the environment.
 */
function getEnvValue(key: string) {
  if (process.env[key] !== undefined) {
    return process.env[key]!;
  }
  throw new Error(`env ${key} does not exist`);
}

/**
 * NODE_ENV: The environment that our web app is running in:
 *   - dev: Development mode, optimize for developers (logging, tooling, etc)
 *   - test: Test mode, optimize for test runners
 *   - production: Production/Staging mode, optimize for the end user & remove dev tooling
 */
export const NODE_ENV = getEnvValue("NODE_ENV");
export const PLATFORM_ENV = getEnvValue("PLATFORM_ENV");
export const IS_PRODUCTION = PLATFORM_ENV === "production";

/**
 * Palisade configuration
 */
export const PALISADE_API_GATEWAY_URI = getEnvValue("PALISADE_API_GATEWAY_URI");
export const API_CLIENT_ID = getEnvValue("API_CLIENT_ID");
export const API_CLIENT_SECRET = getEnvValue("API_CLIENT_SECRET");
export const ADDRESS_MANAGEMENT_API_CLIENT_ID = getEnvValue(
  "ADDRESS_MANAGEMENT_API_CLIENT_ID"
);

export const ADDRESS_MANAGEMENT_API_CLIENT_SECRET = getEnvValue(
  "ADDRESS_MANAGEMENT_API_CLIENT_SECRET"
);

export const PALISADE_SIGNER_VAULT_ID = getEnvValue("PALISADE_SIGNER_VAULT_ID");
export const PALISADE_SIGNER_WALLET_ID = getEnvValue(
  "PALISADE_SIGNER_WALLET_ID"
);
export const PALISADE_SIGNER_WALLET_ADDRESS = getEnvValue(
  "PALISADE_SIGNER_WALLET_ADDRESS"
);
export const PALISADE_SIGNER_WALLET_PUBLIC_KEY = getEnvValue(
  "PALISADE_SIGNER_WALLET_PUBLIC_KEY"
);

/**
 * Flare Configuration
 */

export const FLARE_MULTISIGN_BACKEND_API_URI = getEnvValue(
  "FLARE_MULTISIGN_BACKEND_API_URI"
);
export const FLARE_NETWORK = getEnvValue("FLARE_NETWORK");
export const FLARE_PROCESSOR_API_KEY = getEnvValue("FLARE_PROCESSOR_API_KEY");
export const FLARE_COLLECTOR_API_KEY = getEnvValue("FLARE_COLLECTOR_API_KEY");

export const FLARE_PROCESSOR_HOST = getEnvValue("FLARE_PROCESSOR_HOST");
export const FLARE_COLLECTOR_HOST = getEnvValue("FLARE_COLLECTOR_HOST");
