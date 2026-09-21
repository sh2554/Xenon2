let worker = null;
let workerReadyPromise = null;

/** Always use async stdin (SharedArrayBuffer stdin is unreliable in browsers). */
export const sabAvailable = false;

export function getPyodideWorker() {
  if (worker) return { worker, workerReadyPromise };

  worker = new Worker(new URL("./pyodide.worker.js", import.meta.url));

  workerReadyPromise = new Promise((resolve, reject) => {
    const onInit = (e) => {
      if (e.data.type === "ready") {
        worker.removeEventListener("message", onInit);
        resolve();
      } else if (e.data.type === "error") {
        worker.removeEventListener("message", onInit);
        reject(new Error(e.data.error));
      }
    };
    worker.addEventListener("message", onInit);
  });

  worker.postMessage({ type: "init", sab: null });
  return { worker, workerReadyPromise };
}

export function sendInputToWorker(text) {
  if (!worker) return;
  worker.postMessage({ type: "stdin_response", value: text ?? "" });
}
