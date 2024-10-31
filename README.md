# ios-webkit-background-throttling-sandbox
This repository is a reproduction and experiment sandbox for an issue seen on iOS 18 devices. Thus far, the issue has been reproduced in Mobile Safari on iOS 18 and Chrome on iOS 18.

### Steps to reproduce:

**Note**: This appears to only be reproducible on an actual iOS device and does not occur in the iOS Simulator.

1. Open a webpage that contains JavaScript that triggers a network request on a timer (using `setTimeout`). The specific reproduction uses a timer that repeats after being run, but the issue should occur in other cases as well. One such webpage is the one in this repository and is hosted here: https://shawyu-okta.github.io/ios-webkit-background-throttling-sandbox
1. Perform an action needed to trigger the timer(s) to start. In the case of this reproduction, click "Start".
1. Watch the browser's network requests tab. For iOS, connect your device to a computer running macOS and open Safari, enable "Developer Tools", and select your device from the "Developer" menu to open the console for the attached iOS device.
1. Put the browser (e.g. Safari) into the background by going to the home screen or switching to a different application.
1. Notice that the polling stops running when the browser is no longer in the foreground.
1. Bring the browser back into the foreground by re-opening it or switching back to it.
1. Note that the timer resumes, triggers the request, but the request hangs without completing (note the spinner next to the request and that the request never completes)

### Reproduction application notes:
The application logs some helpful output showing how long passed (in milliseconds) between each request, which can be useful to see if the requests are being run at regular intervals or if they were suspended for any period of time. We expect that the requests should be fired (and logged) approximately every 2000ms, which is how long the `setTimeout` timer is set for. In practice the delta between requests has variability due to the time it takes to make the request itself, and since JavaScript timers are not perfectly precise.

The output log is written both to the DOM as well as the browser console. Below is an example of the output log:

```
// Format:
// HTTP Code, request number, epoch timestamp, time since last request (ms)
Response success [200] n=1, time=1730406297705, delta=3523
Response success [200] n=2, time=1730406297705, delta=2091
Response success [200] n=3, time=1730406300778, delta=3073
Response success [200] n=4, time=1730406302868, delta=2090
```