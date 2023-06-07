import { logMessage } from "./utils/logMessage";
import { messaging } from "./utils/messaging";

logMessage(console.log, "example.event");
logMessage(console.log, "example.test");
logMessage(console.log, "example.*");
logMessage(console.log, "*.event");
logMessage(console.log, "*.test");
logMessage(console.log, "*.b.*");
logMessage(console.log, "a.*");
logMessage(console.log, "*.tick");

let count = 0;
setInterval(() => {
  messaging.emit("background.tick", count++);
}, 5000);
