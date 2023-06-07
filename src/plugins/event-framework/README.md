# Event Framework

Used to create an event-driven web extension. Emit events anywhere in your extension, and listen for them anywhere else.

Requires a background script to act as the "hub" that all events are forwarded through.

```ts
// messaging.ts
export const messaging = createEventFramework<{
  tick: () => void;
}>();
```

```ts
// background.ts
import "./messaging";
```

```ts
// popup.ts
import { messaging } from "./messaging";

messaging.on("tick", () => {
  console.log("Received 'tick' from content-script");
});
```

```ts
// content-script.ts
import { messaging } from "./messaging";

messaging.emit("tick");
```

## Features

- Supports wildcards when listening for events

  ```ts
  messaging.on("*.tick", () => {
    // ...
  });
  messaging.emit("background.tick");
  messaging.emit("content-script.tick");
  ```

- Automatically sets up long-lived port connections for each context
- Full TypeScript support, including wildcard variations
- Listening for an event once

  ```ts
  messaging.once("test", () => {
    // only executed once
  });

  messaging.emit("test");
  messaging.emit("test");
  ```

### Does not support

- Simple request and response API.

  <details>
  <summary>Example request/response code</summary>

  ```ts
  function request(): Promise<number> {
    return new Promise((res, rej) => {
      const requestId = Math.random();
      messaging.emit("getStringLength.request", requestId, "test");
      const unbindRes = messaging.on("getStringLength.response", (responseId, length) => {
        if (responseId !== requestId) return;

        unbindRes();
        unbindRej();
        res(length);
      });
      const unbindRej = messaging.on("getStringLength.error", (responseId, error) => {
        if (responseId !== requestId) return;

        unbindRes();
        unbindRej();
        res(length);
      });
    });
  }
  ```

  </details>
