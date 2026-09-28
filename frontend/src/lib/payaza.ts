/* eslint-disable @typescript-eslint/no-explicit-any */
import * as PayazaModule from "payaza-web-sdk";

const mod: any = PayazaModule;

export function createCheckout(
  config: Record<string, unknown>,
  onResult: (result: unknown) => void,
  onClose: () => void
) {
  // The package is CommonJS; depending on the bundler the class can sit at
  // mod, mod.default, or mod.default.default
  const Ctor = [mod?.default?.default, mod?.default, mod].find(
    (c) => typeof c === "function"
  );

  if (Ctor) {
    try {
      return new Ctor({ ...config, callback: onResult, onClose });
    } catch (err) {
      console.error("Payaza constructor failed, trying setup():", err);
    }
  }

  // Documented alternative: PayazaCheckout.setup(config)
  const setup = mod?.setup ?? mod?.default?.setup ?? mod?.default?.default?.setup;
  if (typeof setup === "function") {
    const checkout = setup(config);
    checkout.setCallback(onResult);
    checkout.setOnClose(onClose);
    return checkout;
  }

  console.error("payaza-web-sdk exports:", Object.keys(mod), typeof mod.default);
  throw new Error("Could not initialise Payaza SDK");
}
