// ==============================================================================
// HOME PLATE - Delivery Provider Factory
// Enables clean switching and extensibility between logistics partners
// ==============================================================================

import { IDeliveryProvider, DeliveryProviderName } from "./types";
import { ShadowfaxDeliveryProvider } from "./shadowfax";

const shadowfaxInstance = new ShadowfaxDeliveryProvider();

/**
 * Returns the configured delivery provider instance.
 * Defaults to Shadowfax Hyperlocal Logistics.
 */
export function getDeliveryProvider(providerName?: DeliveryProviderName): IDeliveryProvider {
  const chosen = providerName || (process.env.DEFAULT_DELIVERY_PROVIDER as DeliveryProviderName) || "shadowfax";

  switch (chosen) {
    case "shadowfax":
    default:
      return shadowfaxInstance;
  }
}

export { shadowfaxInstance };
