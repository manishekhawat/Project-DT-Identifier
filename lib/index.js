"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
class ErrorTracker {
    // @ts-ignore
    constructor(apiKey, apiUrl) {
        this.apiKey = apiKey;
        this.apiUrl = apiUrl;
        this.clientInfo = this.getClientInfo();
        this.setupErrorHandling();
        this.wrapXMLHttpRequest();
        this.interceptConsoleErrors();
    }
    getClientInfo() {
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
        }
        else {
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
        }
        else {
            return {
                node: true,
                nodeVersion: process.version,
            };
        }
    }
    getBrowserVersion() {
        // Retrieve the version of the current browser
        if (typeof window != "undefined") {
            const userAgent = navigator.userAgent;
            const regex = /(Chrome|Firefox|Safari|Edge|MSIE|Trident)\/([\d\.]+)/;
            const match = userAgent.match(regex);
            return match ? match[2] : "Unknown";
        }
        else {
            return {
                node: true,
                nodeVersion: process.version,
            };
        }
    }
    setupErrorHandling() {
        // Set up error handling to capture and report errors
        if (typeof window != "undefined") {
            window.addEventListener("error", (event) => {
                var _a, _b;
                const errorObj = {
                    message: event.message,
                    filename: event.filename,
                    lineno: event.lineno,
                    colno: event.colno,
                    stack: (_b = (_a = event.error) === null || _a === void 0 ? void 0 : _a.stack) !== null && _b !== void 0 ? _b : null,
                    clientInfo: this.clientInfo,
                };
                this.maskedReportError(errorObj);
            });
            window.addEventListener("unhandledrejection", (event) => {
                var _a, _b, _c, _d;
                const errorObj = {
                    message: (_b = (_a = event.reason) === null || _a === void 0 ? void 0 : _a.message) !== null && _b !== void 0 ? _b : "Unhandled Promise rejection",
                    filename: event.filename,
                    lineno: event.lineno,
                    colno: event.colno,
                    stack: (_d = (_c = event.reason) === null || _c === void 0 ? void 0 : _c.stack) !== null && _d !== void 0 ? _d : null,
                    clientInfo: this.clientInfo,
                };
                this.maskedReportError(errorObj);
            });
        }
        else {
            process.on("uncaughtException", (error) => {
                var _a, _b, _c, _d, _e, _f, _g, _h, _j;
                const errorObj = {
                    message: error.message,
                    stack: error.stack,
                    filename: error instanceof Error
                        ? (_c = (_b = (_a = error.stack) === null || _a === void 0 ? void 0 : _a.split("\n")[1]) === null || _b === void 0 ? void 0 : _b.split(":")[0]) !== null && _c !== void 0 ? _c : ""
                        : null,
                    lineno: error instanceof Error
                        ? parseInt((_f = (_e = (_d = error.stack) === null || _d === void 0 ? void 0 : _d.split("\n")[1]) === null || _e === void 0 ? void 0 : _e.split(":")[1]) !== null && _f !== void 0 ? _f : "")
                        : 0 || 0,
                    colno: error instanceof Error
                        ? parseInt((_j = (_h = (_g = error.stack) === null || _g === void 0 ? void 0 : _g.split("\n")[1]) === null || _h === void 0 ? void 0 : _h.split(":")[2]) !== null && _j !== void 0 ? _j : "")
                        : 0 || 0,
                    clientInfo: this.clientInfo,
                };
                this.maskedReportError(errorObj);
            });
            process.on("unhandledRejection", (reason, promise) => {
                var _a, _b, _c, _d, _e, _f, _g, _h, _j;
                const errorObj = {
                    message: reason instanceof Error
                        ? reason.message
                        : "Unhandled Promise rejection",
                    stack: reason instanceof Error ? reason.stack : null,
                    filename: reason instanceof Error
                        ? (_c = (_b = (_a = reason.stack) === null || _a === void 0 ? void 0 : _a.split("\n")[1]) === null || _b === void 0 ? void 0 : _b.split(":")[0]) !== null && _c !== void 0 ? _c : ""
                        : null,
                    lineno: reason instanceof Error
                        ? parseInt((_f = (_e = (_d = reason.stack) === null || _d === void 0 ? void 0 : _d.split("\n")[1]) === null || _e === void 0 ? void 0 : _e.split(":")[1]) !== null && _f !== void 0 ? _f : "")
                        : 0 || 0,
                    colno: reason instanceof Error
                        ? parseInt((_j = (_h = (_g = reason.stack) === null || _g === void 0 ? void 0 : _g.split("\n")[1]) === null || _h === void 0 ? void 0 : _h.split(":")[2]) !== null && _j !== void 0 ? _j : "")
                        : 0 || 0,
                    clientInfo: this.clientInfo,
                };
                this.maskedReportError(errorObj);
            });
        }
    }
    wrapXMLHttpRequest() {
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
    interceptConsoleErrors() {
        // Intercept errors logged to the console using console.error
        const oldConsoleError = console.error;
        console.error = (...args) => {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j;
            try {
                throw new Error();
            }
            catch (error) {
                const errorObj = {
                    message: JSON.stringify(args.join(" ")),
                    filename: (_c = (_b = (_a = error.stack) === null || _a === void 0 ? void 0 : _a.split("\n")[2]) === null || _b === void 0 ? void 0 : _b.split(":")[0]) !== null && _c !== void 0 ? _c : "",
                    lineno: parseInt((_f = (_e = (_d = error.stack) === null || _d === void 0 ? void 0 : _d.split("\n")[2]) === null || _e === void 0 ? void 0 : _e.split(":")[1]) !== null && _f !== void 0 ? _f : "") || 0,
                    colno: parseInt((_j = (_h = (_g = error.stack) === null || _g === void 0 ? void 0 : _g.split("\n")[2]) === null || _h === void 0 ? void 0 : _h.split(":")[2]) !== null && _j !== void 0 ? _j : "") || 0,
                    stack: error.stack,
                    clientInfo: this.clientInfo,
                };
                this.maskedReportError(errorObj);
                oldConsoleError.apply(console, args);
            }
        };
    }
    maskedReportError(errorObj) {
        this.reportError(this.maskPII(errorObj));
    }
    reportError(errorObj) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.apiUrl) {
                const response = yield fetch(this.apiUrl, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "X-ApiKey": this.apiKey,
                    },
                    body: JSON.stringify(errorObj),
                });
                if (!response.ok) {
                    const networkErrorObj = {
                        message: "Network error occurred while sending error data to the server",
                        error: response.statusText,
                        clientInfo: this.clientInfo,
                        originalError: errorObj,
                    };
                    console.error(networkErrorObj);
                }
            }
            else {
                console.log(errorObj);
            }
        });
    }
    maskPII(error) {
        const piiRegex = /(^\d{3}-?\d{2}-?\d{4}$)|(^\d{4}-?\d{4}-?\d{4}-?\d{4}$)|(^4\d{3}([\ \-]|\d)\d{4}([\ \-]|\d)\d{4}([\ \-]|\d)\d{4}$)|(^\d{3}\.\d{3}\.\d{3}\-\d{2}$)|(^\d{9}$)|(^\d{10}$)|(^\d{11}$)/gm;
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
