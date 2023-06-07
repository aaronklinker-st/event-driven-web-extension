# Event-Driven Web Extension Demo

This is an example extension that uses [`nanoevents`](https://www.npmjs.com/package/nanoevents) and [`mimimatch`](https://www.npmjs.com/package/minimatch) to create an event-driven framework for chrome extensions. Internally, it uses long-lived port connections provided by the extension API to send events to all active JS contexts of the extension.

In this extension, there are 3 contexts:

1. Persistent background script
2. Content script for `<all_urls>`
3. Popup

The background and content scripts emit `*.tick` events. The popup emits events based on a form, while displaying and logging all the events it receives.

## Try it out

```sh
pnpm i
pnpm dev
```

Stay on the <chrome://new-tab> or <chrome://extensions> page and open the popup. Notice how it receives the `background.tick` event from our background script.

Next, open a tab to <https://google.com> and open the popup again. Notice how it now receives the `content-script.tick` event in addition to the background's tick.

> If you open more tabs to any URL the content script runs in, more ticks will be received by the popup.

Finally, mess around with the form in the popup, seeing how wildcards work, and which events are triggered for different variations of event names.
