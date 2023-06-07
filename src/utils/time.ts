/**
 * Returns the current time in format: `hh:mm:ss.sss`
 */
export function getCurrentTime(): string {
  return new Date().toISOString().split("T")[1].replace("Z", "");
}
