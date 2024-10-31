const originalTime = new Date().getTime();
let lastTime = originalTime;
let abortController;
let abortSignal;
let timeout;

const main = (useExperiment = false) => {
  // Disable the start buttons
  document.getElementById("start1").setAttribute("disabled", "true");
  document.getElementById("start2").setAttribute("disabled", "true");

  if (useExperiment) {
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        if (timeout) {
          clearTimeout(timeout);
        }
        if (abortController) {
          abortController.abort("Document was hidden, aborting request");
        }
      } else {
        console.warn("Document is visible again, re-attempting request");
        timeout = setTimeout(makeRequest, 2000);
      }
    });
  }
  let requestCount = 0;
  const outputElement = document.getElementById("output");
  const makeRequest = async () => {
    const url = "https://httpbin.org/post";
    const options = {
      mode: "cors",
      method: "post",
    }
    if (useExperiment) {
      abortController = new AbortController();
      abortSignal = abortController.signal;
      options.signal = abortSignal;
    }
    const response = await fetch(url, options);
    abortSignal = null;
    abortController = null;
    const time = new Date().getTime();

    if (response.ok) {
      requestCount++;
      // const responseJson = await response.json();
      const outputLine = `Response success [${response.status}] n=${requestCount}, time=${time}, delta=${time - lastTime}`;
      console.warn(outputLine);
      const newLine = document.createElement("div");
      const newContent = document.createTextNode(outputLine);
      newLine.appendChild(newContent);

      lastTime = time;
      timeout = setTimeout(makeRequest, 2000);
      outputElement.appendChild(newLine);
    } else {
      lastTime = time;
      timeout = setTimeout(makeRequest, 2000);
      throw new Error('HTTP error! Status: ' + response.status);
    }
  };

  timeout = setTimeout(() => {
    makeRequest();
  }, 2000);
};