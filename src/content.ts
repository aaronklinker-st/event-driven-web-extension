import { logMessage } from "./utils/logMessage";
import { messaging } from "./utils/messaging";

logMessage(console.log, "example.event");
logMessage(console.log, "example.test");
logMessage(console.log, "example.*");
logMessage(console.log, "*.event");
logMessage(console.log, "*.test");
logMessage(console.log, "*.b.*");
logMessage(console.log, "a.*");
logMessage(console.log, "background.tick");
logMessage(console.log, "content-script.tick");

setInterval(() => {
  messaging.emit("content-script.tick", location.href);
}, 1000);
