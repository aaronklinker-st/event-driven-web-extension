import { DefaultEvents, EventsMap, createNanoEvents } from "nanoevents";
import browser from "webextension-polyfill";
import { minimatch } from "minimatch";
import { EventFramework } from "./types";

/**
 * Initializes the PubSub event framework based around long-lived extension messaging ports.
 */
export function createEventFramework<
  TEventsMap extends EventsMap = DefaultEvents
>(): EventFramework<TEventsMap> {
  // Unique ID that prevents emitting the same event multiple times in a single context.
  const instanceId = Math.random();

  // This emitter emits a single event, "all", that's first argument is the name of the event. This
  // is  because we don't have a way to listen to all events, and we need to be able to do that.
  const emitter = createNanoEvents<{
    all: <TName extends keyof TEventsMap>(
      name: TName,
      processedInstanceIds: number[],
      ...args: Parameters<TEventsMap[TName]>
    ) => void;
  }>();

  // Works with MV2 and MV3.
  const isBackground =
    typeof window == "undefined" || window === browser.extension?.getBackgroundPage?.();

  let ports: browser.Runtime.Port[] = [];

  const addPort = (port: browser.Runtime.Port) => {
    ports.push(port);

    // Listen for messages from the port.
    port.onMessage.addListener((message: any) => {
      if (message.type !== MESSAGE_TYPE || message.processedInstanceIds.includes(instanceId))
        return;

      message.processedInstanceIds.push(instanceId);
      emitter.emit("all", message.name, message.processedInstanceIds, ...message.args);
    });

    // Remove the port on disconnect.
    port.onDisconnect.addListener(() => {
      ports.splice(ports.indexOf(port), 1);
    });
  };

  if (isBackground) {
    // Initialize the "hub" port in the background
    browser.runtime.onConnect.addListener((port) => {
      if (port.name === PORT_NAME) addPort(port);
    });
  } else {
    // Connect to the background's "hub" port
    const port = browser.runtime.connect({ name: PORT_NAME });
    addPort(port);
  }

  emitter.on("all", (name, processedInstanceIds, ...args) => {
    ports.forEach((port) => {
      port.postMessage({ type: MESSAGE_TYPE, name, processedInstanceIds, args });
    });
  });

  return {
    emit(name, ...args) {
      emitter.emit("all", name, [instanceId], ...args);
    },
    on(name, cb) {
      return emitter.on("all", (triggeredName, _, ...args) => {
        if (minimatch(triggeredName as string, name as string)) {
          // @ts-expect-error
          cb(...args);
        }
      });
    },
    once(name, cb) {
      const unbind = this.on(name, (...args) => {
        unbind();
        cb(...args);
      });
      return unbind;
    },
  };
}

const PORT_NAME = "@event-framework/events";
const MESSAGE_TYPE = "@event-framework/emit-event";
