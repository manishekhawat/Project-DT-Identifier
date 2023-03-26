class ErrorTracker {
  private apiKey: string;
  private apiUrl: string;
  private clientInfo: object;

  // @ts-ignore
  constructor(apiKey: string, apiUrl: string) {
    this.apiKey = apiKey;
    this.apiUrl = apiUrl;
    this.clientInfo = this.getClientInfo();
    this.setupErrorHandling();
    this.wrapXMLHttpRequest();
    this.interceptConsoleErrors();
  }

  private getClientInfo(): object {
    if (typeof window != "undefined") {
      // Retrieve information about the client environment
      const { userAgent, language, platform } = navigator;
      const { width: screenWidth, height: screenHeight } = screen;
      const browserName = this.getBrowserName();
      const browserVersion = this.getBrowserVersion();
      return {
        userAgent,
        language,
        platform,
        screenWidth,
        screenHeight,
        browserName,
        browserVersion,
      };
    } else {
      return {
        node: true,
        nodeVersion: process.version,
      };
    }
  }

  getBrowserName() {
    if (typeof window != "undefined") {
      // Retrieve the name of the current browser
      const userAgent = navigator.userAgent;
      switch (true) {
        case /Chrome/.test(userAgent):
          return "Chrome";
        case /Firefox/.test(userAgent):
          return "Firefox";
        case /Safari/.test(userAgent):
          return "Safari";
        case /Edge/.test(userAgent):
          return "Edge";
        case /MSIE|Trident/.test(userAgent):
          return "IE";
        default:
          return "Unknown";
      }
    } else {
      return {
        node: true,
        nodeVersion: process.version,
      };
    }
  }

  private getBrowserVersion() {
    // Retrieve the version of the current browser
    if (typeof window != "undefined") {
      const userAgent = navigator.userAgent;
      const regex = /(Chrome|Firefox|Safari|Edge|MSIE|Trident)\/([\d\.]+)/;
      const match = userAgent.match(regex);
      return match ? match[2] : "Unknown";
    } else {
      return {
        node: true,
        nodeVersion: process.version,
      };
    }
  }

  setupErrorHandling(): void {
    // Set up error handling to capture and report errors
    if (typeof window != "undefined") {
      window.addEventListener("error", (event) => {
        const errorObj = {
          message: event.message,
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno,
          stack: event.error?.stack ?? null,
          clientInfo: this.clientInfo,
        };
        this.maskedReportError(errorObj);
      });
      window.addEventListener("unhandledrejection", (event: any) => {
        const errorObj = {
          message: event.reason?.message ?? "Unhandled Promise rejection",
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno,
          stack: event.reason?.stack ?? null,
          clientInfo: this.clientInfo,
        };
        this.maskedReportError(errorObj);
      });
    } else {
      process.on("uncaughtException", (error) => {
        const errorObj = {
          message: error.message,
          stack: error.stack,
          filename:
            error instanceof Error
              ? error.stack?.split("\n")[1]?.split(":")[0] ?? ""
              : null,
          lineno:
            error instanceof Error
              ? parseInt(error.stack?.split("\n")[1]?.split(":")[1] ?? "")
              : 0 || 0,
          colno:
            error instanceof Error
              ? parseInt(error.stack?.split("\n")[1]?.split(":")[2] ?? "")
              : 0 || 0,

          clientInfo: this.clientInfo,
        };
        this.maskedReportError(errorObj);
      });

      process.on("unhandledRejection", (reason, promise) => {
        const errorObj = {
          message:
            reason instanceof Error
              ? reason.message
              : "Unhandled Promise rejection",
          stack: reason instanceof Error ? reason.stack : null,
          filename:
            reason instanceof Error
              ? reason.stack?.split("\n")[1]?.split(":")[0] ?? ""
              : null,
          lineno:
            reason instanceof Error
              ? parseInt(reason.stack?.split("\n")[1]?.split(":")[1] ?? "")
              : 0 || 0,
          colno:
            reason instanceof Error
              ? parseInt(reason.stack?.split("\n")[1]?.split(":")[2] ?? "")
              : 0 || 0,

          clientInfo: this.clientInfo,
        };
        this.maskedReportError(errorObj);
      });
    }
  }

  wrapXMLHttpRequest(): void {
    // Wrap the XMLHttpRequest object to capture and report errors
    if (typeof window != "undefined") {
      const oldXMLHttpRequest = XMLHttpRequest;
      // @ts-ignore
      XMLHttpRequest = function () {
        const xhr = new oldXMLHttpRequest();
        xhr.addEventListener("error", (error) => {
          const errorObj = {
            message: "AJAX error",
            // @ts-ignore
            clientInfo: this.clientInfo,
          };
          // @ts-ignore
          this.maskedReportError(errorObj);
        });
        return xhr;
      }.bind(this);
    }
  }

  interceptConsoleErrors(): void {
    // Intercept errors logged to the console using console.error
    const oldConsoleError = console.error;
    console.error = (...args) => {
      try {
        throw new Error();
      } catch (error: any) {
        const errorObj = {
          message: JSON.stringify(args.join(" ")),
          filename: error.stack?.split("\n")[2]?.split(":")[0] ?? "",
          lineno:
            parseInt(error.stack?.split("\n")[2]?.split(":")[1] ?? "") || 0,
          colno:
            parseInt(error.stack?.split("\n")[2]?.split(":")[2] ?? "") || 0,
          stack: error.stack,
          clientInfo: this.clientInfo,
        };
        this.maskedReportError(errorObj);
        oldConsoleError.apply(console, args);
      }
    };
  }

  private maskedReportError(errorObj: object): void {
    this.reportError(this.maskPII(errorObj));
  }

  private async reportError(errorObj: object): Promise<void> {
    if (this.apiUrl) {
      const response = await fetch(this.apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-ApiKey": this.apiKey,
        },
        body: JSON.stringify(errorObj),
      });

      if (!response.ok) {
        const networkErrorObj = {
          message:
            "Network error occurred while sending error data to the server",
          error: response.statusText,
          clientInfo: this.clientInfo,
          originalError: errorObj,
        };
        console.error(networkErrorObj);
      }
    } else {
      console.log(errorObj);
    }
  }

  private maskPII(error: object): object {
    const piiRegex =
      /(^\d{3}-?\d{2}-?\d{4}$)|(^\d{4}-?\d{4}-?\d{4}-?\d{4}$)|(^4\d{3}([\ \-]|\d)\d{4}([\ \-]|\d)\d{4}([\ \-]|\d)\d{4}$)|(^\d{3}\.\d{3}\.\d{3}\-\d{2}$)|(^\d{9}$)|(^\d{10}$)|(^\d{11}$)/gm;
    // @ts-ignore
    if (error.message) {
      // @ts-ignore
      error.message = error.message.replace(piiRegex, "********");
    }
    // @ts-ignore
    if (error.stack) {
      // @ts-ignore
      error.stack = error.stack.replace(piiRegex, "********");
    }
    return error;
  }
}

module.exports = ErrorTracker;
