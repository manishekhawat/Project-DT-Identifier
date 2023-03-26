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
