import rows from "./hvac-products.sample.json";
import type { HvacProduct } from "../schema/mep-product";

/** SAMPLE data: representative, verify against submittals, not sealed design. */
export const HVAC_SAMPLE_PRODUCTS = rows as unknown as HvacProduct[];
