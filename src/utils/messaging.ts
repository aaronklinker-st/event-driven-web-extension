import { createEventFramework } from "../plugins/event-framework";

export const messaging = createEventFramework<{
  "example.event": (arg: string) => void;
  "example.test": (arg: string) => void;
  "a.b.c.d": () => void;
  "background.tick": (count: number) => void;
  "content-script.tick": (url: string) => void;
}>();
