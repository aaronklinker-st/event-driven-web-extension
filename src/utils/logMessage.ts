import { messaging } from "./messaging";

export function logMessage(
  log: (...args: any[]) => void,
  name: Parameters<typeof messaging.on>[0]
) {
  messaging.on(name, (...args: any[]) => log(`[event] ${name}`, ...args));
}
