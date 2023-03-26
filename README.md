# @techbana/error-log-capture

### This package helps capture any javascript errors occuring on browser & node server and can send the info to given API endpoint

> ### _PS: While this package can do what it promises but yet, this package is still under development and **NOT ready for production use**. Please contribute back if you are able to find bugs/issues or want to contribute feature update to the package._

> _Keeping this package as open source for everyone to know how custom logging and error tracking is/could be implemented._

### Install

`npm i @techbana/error-log-capture`

### Usage

Simple

```

import ErrorTracker from "@techbana/error-log-capture";

const tracker = new ErrorTracker();

```

### Server side captured log:

```

{
  message: 'Something went wrong',
  stack: 'Error: Something went wrong\n' +
    '    at myFunction (/Users/xxxx/Project/example.js:8:9)\n' +
    '    at Object.<anonymous> (/Users/xxxx/Project/example.js:11:1)\n' +
    '    at Module._compile (node:internal/modules/cjs/loader:1205:14)\n' +
    '    at Module._extensions..js (node:internal/modules/cjs/loader:1259:10)\n' +
    '    at Module.load (node:internal/modules/cjs/loader:1068:32)\n' +
    '    at Module._load (node:internal/modules/cjs/loader:909:12)\n' +
    '    at Function.executeUserEntryPoint [as runMain] (node:internal/modules/run_main:82:12)\n' +
    '    at node:internal/main/run_main_module:23:47',
  filename: '    at myFunction (/Users/xxxx/Project/example.js',
  lineno: 8,
  colno: 9,
  clientInfo: { node: true, nodeVersion: 'v19.1.0' }
}
```

### Client side captured log

```

{
    "message": "\"We caught you\"",
    "filename": "",
    "lineno": 0,
    "colno": 3000,
    "stack": "Error\n    at console.error (http://localhost:3000/static/js/bundle.js:3567:15)\n    at http://localhost:3000/static/js/bundle.js:436:13\n    at onKeyup (http://localhost:3000/static/js/bundle.js:2119:26)",
    "clientInfo": {
        "userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36",
        "language": "en-GB",
        "platform": "MacIntel",
        "screenWidth": 1440,
        "screenHeight": 900,
        "browserName": "Chrome",
        "browserVersion": "111.0.0.0"
    }
}

```

Configure API Key and API endpoint

```

const tracker = new ErrorTracker("your-api-key","your-api-endpoint");

```

### Features:

- Regular expression is used to match different formats of Personal Identifiable Information (PII) numbers such as social security numbers, credit card numbers and mask them before sending logs to log aggregator through API
  - Social Security Number (SSN) in the format of XXX-XX-XXXX or XXXXXXXXX
  - Credit card number in the format of XXXX-XXXX-XXXX-XXXX or XXXXXXXXXXXXXXXX with or without dashes or spaces between digits. This regex supports only Visa cards.
  - CVV number in the format of XXX or XXXX
  - Phone number in the format of XXX-XXX-XXXX, XXX.XXX.XXXX or XXXXXXXXXX
- Captures client side error
- Captures error, unhandledrejection event on window
- Intercepts XHR calls and console.error as well to capture error logs
- Captures nodejs server side errors
- Captures uncaughtException, unhandledRejection on node server side
- Feasibility to use API endpoint and API key for thirdparty log capture tool, it will send it to that endpoint automatically if it find the apiUrl configured.
- Capture below information for client side
  - userAgent
  - language
  - platform
  - screen width
  - screen height
  - browser name
  - browser version
- Capture below information for node side
  - node (true)
  - node version
- Capture below error information
  - message
  - filename
  - lineno
  - colno
  - stack
