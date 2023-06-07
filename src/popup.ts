import { logMessage } from "./utils/logMessage";
import { messaging } from "./utils/messaging";
import { getCurrentTime } from "./utils/time";

const eventForm = document.querySelector<HTMLFormElement>("#form")!;
const eventInput = document.querySelector<HTMLInputElement>("#event")!;
const argInput = document.querySelector<HTMLInputElement>("#arg")!;
const logsList = document.querySelector<HTMLInputElement>("#logs")!;
const clearBtn = document.querySelector<HTMLInputElement>("#clear")!;

eventForm.onsubmit = (e) => {
  e.preventDefault();
  const event = eventInput.value;
  const arg = argInput.value;
  messaging.emit(event as any, arg);
};

clearBtn.onclick = (e) => {
  e.stopPropagation();
  e.preventDefault();
  logsList.innerHTML = "";
};

function log(...args: any[]) {
  const text = args.join(" ");
  console.log(...args);
  const logItem = document.createElement("li");
  logItem.textContent = `${getCurrentTime()} - ${text}`;
  logsList.insertBefore(logItem, logsList.firstChild);
}

logMessage(log, "example.event");
logMessage(log, "example.test");
logMessage(log, "example.*");
logMessage(log, "*.event");
logMessage(log, "*.test");
logMessage(log, "*.b.*");
logMessage(log, "a.*");
logMessage(log, "background.tick");
logMessage(log, "content-script.tick");
