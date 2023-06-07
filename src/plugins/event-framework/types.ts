import { EventsMap } from "nanoevents";

export interface EventFramework<TEventsMap extends EventsMap> {
  /**
   * Emits an event throughout the entire extension.
   */
  emit<TName extends keyof TEventsMap>(name: TName, ...args: Parameters<TEventsMap[TName]>): void;

  /**
   * Listens to an event. Returns a function that can be used to remove the listener.
   *
   * Events are checked against the pattern using
   * [minimatch](https://www.npmjs.com/package/minimatch). Any events that match the pattern will
   * trigger the callback.
   */
  on<TName extends ExpandPattern<keyof TEventsMap>>(
    name: TName,
    cb: (...args: TName extends keyof TEventsMap ? Parameters<TEventsMap[TName]> : any[]) => void
  ): () => void;

  /**
   * Same as `on`, but automatically calls the returned `unbind` function after the callback is ran
   * once.
   */
  once<TName extends ExpandPattern<keyof TEventsMap>>(
    name: TName,
    cb: (...args: TName extends keyof TEventsMap ? Parameters<TEventsMap[TName]> : any[]) => void
  ): () => void;
}

/**
 * Converts a string with periods in it to a union of strings with periods in them with * between the periods.
 *
 * @example
 * "a.b" -> "a.b" | "*.b" | "a.*" | "*"
 * "a.b.c" -> "a.b.c" | "*.b.c" | "a.*.c" | "a.b.*" | "*.b.*" | "a.*" | "*.c" | "*"
 */
export type ExpandPattern<TString> = TString extends `${infer T}.${infer U}`
  ? SimplifyPattern<`${"*" | SimplifyPattern<ExpandPattern<T>>}.${
      | "*"
      | SimplifyPattern<ExpandPattern<U>>}`>
  : TString;

/**
 * Merges `*.*` into `*` recursively.
 *
 * @example
 * "a.*.*" -> "a.*"
 * "*.*.c" -> "*.c"
 * "a.*.*.d" -> "a.*.d"
 * "a.*.*.*.e" -> "a.*.e"
 */
export type SimplifyPattern<TUnion> = TUnion extends `*.*`
  ? `*`
  : TUnion extends `*.*.${infer T}`
  ? SimplifyPattern<`*.${T}`>
  : TUnion extends `${infer T}.*.*`
  ? SimplifyPattern<`${T}.*`>
  : TUnion extends `${infer T}.*.*.${infer U}`
  ? SimplifyPattern<`${T}.*.${U}`>
  : TUnion;
