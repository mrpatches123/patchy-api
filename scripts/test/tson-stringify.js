(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.typescriptJson = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw (a.code="MODULE_NOT_FOUND", a)}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],2:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypeGuardError = void 0;
var TypeGuardError = (function (_super) {
    __extends(TypeGuardError, _super);
    function TypeGuardError(props) {
        var _newTarget = this.constructor;
        var _this = _super.call(this, props.message ||
            "Error on ".concat(props.method, "(): invalid type").concat(props.path ? " on ".concat(props.path) : "", ", expect to be ").concat(props.expected)) || this;
        var proto = _newTarget.prototype;
        if (Object.setPrototypeOf)
            Object.setPrototypeOf(_this, proto);
        else
            _this.__proto__ = proto;
        _this.method = props.method;
        _this.path = props.path;
        _this.expected = props.expected;
        _this.value = props.value;
        return _this;
    }
    return TypeGuardError;
}(Error));
exports.TypeGuardError = TypeGuardError;

},{}],3:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.$every = void 0;
var $every = function (array, pred) {
    var error = null;
    for (var i = 0; i < array.length; ++i)
        if (null !== (error = pred(array[i], i)))
            return error;
    return null;
};
exports.$every = $every;

},{}],4:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.$guard = void 0;
var TypeGuardError_1 = require("../TypeGuardError");
var $guard = function (method) {
    return function (exceptionable, props) {
        if (exceptionable === true)
            throw new TypeGuardError_1.TypeGuardError({
                method: method,
                path: props.path,
                expected: props.expected,
                value: props.value,
            });
        return false;
    };
};
exports.$guard = $guard;

},{"../TypeGuardError":2}],5:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.$is_email = void 0;
function $is_email(str) {
    return REGEX.test(str);
}
exports.$is_email = $is_email;
var REGEX = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

},{}],6:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.$is_ipv4 = void 0;
function $is_ipv4(str) {
    return REGEX.test(str);
}
exports.$is_ipv4 = $is_ipv4;
var REGEX = /^(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;

},{}],7:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.$is_ipv6 = void 0;
function $is_ipv6(str) {
    return REGEX.test(str);
}
exports.$is_ipv6 = $is_ipv6;
var REGEX = /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))$/;

},{}],8:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.$is_url = void 0;
function $is_url(str) {
    return REGEX.test(str);
}
exports.$is_url = $is_url;
var REGEX = /^[a-zA-Z0-9]+:\/\/(?:www.)?[-a-zA-Z0-9@:%._+~#=]{1,256}.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_+.~#?&/=]*)$/;

},{}],9:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.$is_uuid = void 0;
function $is_uuid(str) {
    return REGEX.test(str);
}
exports.$is_uuid = $is_uuid;
var REGEX = /[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i;

},{}],10:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.$join = void 0;
function $join(str) {
    return variable(str) ? ".".concat(str) : "[".concat(JSON.stringify(str), "]");
}
exports.$join = $join;
function variable(str) {
    return reserved(str) === false && /^[a-zA-Z_$][a-zA-Z_$0-9]*$/g.test(str);
}
function reserved(str) {
    return RESERVED.has(str);
}
var RESERVED = new Set([
    "break",
    "case",
    "catch",
    "class",
    "const",
    "continue",
    "debugger",
    "default",
    "delete",
    "do",
    "else",
    "enum",
    "export",
    "extends",
    "false",
    "finally",
    "for",
    "function",
    "if",
    "import",
    "in",
    "instanceof",
    "new",
    "null",
    "return",
    "super",
    "switch",
    "this",
    "throw",
    "true",
    "try",
    "typeof",
    "var",
    "void",
    "while",
    "with",
]);

},{}],11:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.$number = void 0;
var TypeGuardError_1 = require("../TypeGuardError");
function $number(value) {
    if (!isFinite(value))
        throw new TypeGuardError_1.TypeGuardError({
            method: "TSON.stringify",
            expected: "number",
            value: value,
            message: "Error on TSON.stringify(): infinite number.",
        });
    else if (isNaN(value))
        throw new TypeGuardError_1.TypeGuardError({
            method: "TSON.stringify",
            expected: "number",
            value: value,
            message: "Error on TSON.stringify(): not a valid number.",
        });
    return value;
}
exports.$number = $number;

},{"../TypeGuardError":2}],12:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.$report = void 0;
var $report = function (output) {
    var array = output.errors;
    var reportable = function (path) {
        if (array.length === 0)
            return true;
        var last = array[array.length - 1].path;
        return (path.length > last.length || last.substring(0, path.length) !== path);
    };
    return function (exceptable, error) {
        if (exceptable && reportable(error.path))
            array.push(error);
        return false;
    };
};
exports.$report = $report;

},{}],13:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.$string = void 0;
function $string(str) {
    if (str.length > 41)
        return JSON.stringify(str);
    var length = str.length;
    var result = "";
    var last = 0;
    var found = false;
    var surrogateFound = false;
    var point = 255;
    for (var i = 0; i < length && point >= 32; i++) {
        point = str.charCodeAt(i);
        if (0xd800 <= point && point <= 0xdfff) {
            surrogateFound = true;
            break;
        }
        if (point === 34 || point === 92) {
            result += str.slice(last, i) + "\\";
            last = i;
            found = true;
        }
    }
    if (!found) {
        result = str;
    }
    else {
        result += str.slice(last);
    }
    return point < 32 || surrogateFound === true
        ? JSON.stringify(str)
        : "\"".concat(result, "\"");
}
exports.$string = $string;

},{}],14:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.$tail = void 0;
function $tail(str) {
    return str[str.length - 1] === "," ? str.substring(0, str.length - 1) : str;
}
exports.$tail = $tail;

},{}],15:[function(require,module,exports){
"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createIsStringify = exports.createAssertStringify = exports.createStringify = exports.createObject = exports.createValidateEquals = exports.createEquals = exports.createAssertEquals = exports.createValidate = exports.createIs = exports.createAssertType = exports.isStringify = exports.assertStringify = exports.stringify = exports.application = exports.validateEquals = exports.equals = exports.assertEquals = exports.validate = exports.is = exports.assertType = void 0;
var _every_1 = require("./functional/$every");
var _guard_1 = require("./functional/$guard");
var _is_email_1 = require("./functional/$is_email");
var _is_ipv4_1 = require("./functional/$is_ipv4");
var _is_ipv6_1 = require("./functional/$is_ipv6");
var _is_url_1 = require("./functional/$is_url");
var _is_uuid_1 = require("./functional/$is_uuid");
var _join_1 = require("./functional/$join");
var _number_1 = require("./functional/$number");
var _report_1 = require("./functional/$report");
var _string_1 = require("./functional/$string");
var _tail_1 = require("./functional/$tail");
var TypeGuardError_1 = require("./TypeGuardError");
__exportStar(require("./schemas/IJsonApplication"), exports);
__exportStar(require("./schemas/IJsonComponents"), exports);
__exportStar(require("./schemas/IJsonSchema"), exports);
__exportStar(require("./TypeGuardError"), exports);
__exportStar(require("./IValidation"), exports);
function assertType() {
    halt("assertType");
}
exports.assertType = assertType;
(function (assertType) {
    assertType.is_uuid = _is_uuid_1.$is_uuid;
    assertType.is_email = _is_email_1.$is_email;
    assertType.is_url = _is_url_1.$is_url;
    assertType.is_ipv4 = _is_ipv4_1.$is_ipv4;
    assertType.is_ipv6 = _is_ipv6_1.$is_ipv6;
    assertType.join = _join_1.$join;
    assertType.every = _every_1.$every;
    assertType.guard = (0, _guard_1.$guard)("TSON.assertType");
})(assertType = exports.assertType || (exports.assertType = {}));
function is() {
    halt("is");
}
exports.is = is;
(function (is) {
    is.is_uuid = _is_uuid_1.$is_uuid;
    is.is_email = _is_email_1.$is_email;
    is.is_url = _is_url_1.$is_url;
    is.is_ipv4 = _is_ipv4_1.$is_ipv4;
    is.is_ipv6 = _is_ipv6_1.$is_ipv6;
})(is = exports.is || (exports.is = {}));
function validate() {
    halt("validate");
}
exports.validate = validate;
(function (validate) {
    validate.is_uuid = _is_uuid_1.$is_uuid;
    validate.is_email = _is_email_1.$is_email;
    validate.is_url = _is_url_1.$is_url;
    validate.is_ipv4 = _is_ipv4_1.$is_ipv4;
    validate.is_ipv6 = _is_ipv6_1.$is_ipv6;
    validate.join = _join_1.$join;
    validate.report = _report_1.$report;
})(validate = exports.validate || (exports.validate = {}));
function assertEquals() {
    halt("assertEquals");
}
exports.assertEquals = assertEquals;
(function (assertEquals) {
    assertEquals.is_uuid = _is_uuid_1.$is_uuid;
    assertEquals.is_email = _is_email_1.$is_email;
    assertEquals.is_url = _is_url_1.$is_url;
    assertEquals.is_ipv4 = _is_ipv4_1.$is_ipv4;
    assertEquals.is_ipv6 = _is_ipv6_1.$is_ipv6;
    assertEquals.join = _join_1.$join;
    assertEquals.every = _every_1.$every;
    assertEquals.guard = (0, _guard_1.$guard)("TSON.assertEquals");
})(assertEquals = exports.assertEquals || (exports.assertEquals = {}));
function equals() {
    halt("equals");
}
exports.equals = equals;
(function (equals) {
    equals.is_uuid = _is_uuid_1.$is_uuid;
    equals.is_email = _is_email_1.$is_email;
    equals.is_url = _is_url_1.$is_url;
    equals.is_ipv4 = _is_ipv4_1.$is_ipv4;
    equals.is_ipv6 = _is_ipv6_1.$is_ipv6;
    equals.join = _join_1.$join;
})(equals = exports.equals || (exports.equals = {}));
function validateEquals() {
    halt("validateEquals");
}
exports.validateEquals = validateEquals;
(function (validateEquals) {
    validateEquals.is_uuid = _is_uuid_1.$is_uuid;
    validateEquals.is_email = _is_email_1.$is_email;
    validateEquals.is_url = _is_url_1.$is_url;
    validateEquals.is_ipv4 = _is_ipv4_1.$is_ipv4;
    validateEquals.is_ipv6 = _is_ipv6_1.$is_ipv6;
    validateEquals.join = _join_1.$join;
    validateEquals.report = validate.report;
})(validateEquals = exports.validateEquals || (exports.validateEquals = {}));
function application() {
    halt("application");
}
exports.application = application;
function stringify() {
    halt("stringify");
}
exports.stringify = stringify;
(function (stringify) {
    stringify.number = _number_1.$number;
    stringify.string = _string_1.$string;
    stringify.tail = _tail_1.$tail;
    function throws(props) {
        throw new TypeGuardError_1.TypeGuardError(__assign(__assign({}, props), { method: "TSON.stringify" }));
    }
    stringify.throws = throws;
})(stringify = exports.stringify || (exports.stringify = {}));
function assertStringify() {
    halt("assertStringify");
}
exports.assertStringify = assertStringify;
(function (assertStringify) {
    assertStringify.is_uuid = _is_uuid_1.$is_uuid;
    assertStringify.is_email = _is_email_1.$is_email;
    assertStringify.is_url = _is_url_1.$is_url;
    assertStringify.is_ipv4 = _is_ipv4_1.$is_ipv4;
    assertStringify.is_ipv6 = _is_ipv6_1.$is_ipv6;
    assertStringify.number = _number_1.$number;
    assertStringify.string = _string_1.$string;
    assertStringify.tail = _tail_1.$tail;
    assertStringify.join = _join_1.$join;
    assertStringify.guard = (0, _guard_1.$guard)("TSON.assertStringify");
    assertStringify.every = _every_1.$every;
    assertStringify.throws = function () { };
})(assertStringify = exports.assertStringify || (exports.assertStringify = {}));
function isStringify() {
    halt("isStringify");
}
exports.isStringify = isStringify;
(function (isStringify) {
    isStringify.is_uuid = _is_uuid_1.$is_uuid;
    isStringify.is_email = _is_email_1.$is_email;
    isStringify.is_url = _is_url_1.$is_url;
    isStringify.is_ipv4 = _is_ipv4_1.$is_ipv4;
    isStringify.is_ipv6 = _is_ipv6_1.$is_ipv6;
    isStringify.number = _number_1.$number;
    isStringify.string = _string_1.$string;
    isStringify.tail = _tail_1.$tail;
    function throws(props) {
        throw new TypeGuardError_1.TypeGuardError(__assign(__assign({}, props), { method: "TSON.assertStringify" }));
    }
    isStringify.throws = throws;
})(isStringify = exports.isStringify || (exports.isStringify = {}));
function createAssertType() {
    halt("createAssertType");
}
exports.createAssertType = createAssertType;
(function (createAssertType) {
    createAssertType.is_uuid = _is_uuid_1.$is_uuid;
    createAssertType.is_email = _is_email_1.$is_email;
    createAssertType.is_url = _is_url_1.$is_url;
    createAssertType.is_ipv4 = _is_ipv4_1.$is_ipv4;
    createAssertType.is_ipv6 = _is_ipv6_1.$is_ipv6;
    createAssertType.join = _join_1.$join;
    createAssertType.every = _every_1.$every;
    createAssertType.guard = assertType.guard;
})(createAssertType = exports.createAssertType || (exports.createAssertType = {}));
function createIs() {
    halt("createIs");
}
exports.createIs = createIs;
(function (createIs) {
    createIs.is_uuid = _is_uuid_1.$is_uuid;
    createIs.is_email = _is_email_1.$is_email;
    createIs.is_url = _is_url_1.$is_url;
    createIs.is_ipv4 = _is_ipv4_1.$is_ipv4;
    createIs.is_ipv6 = _is_ipv6_1.$is_ipv6;
})(createIs = exports.createIs || (exports.createIs = {}));
function createValidate() {
    halt("createValidate");
}
exports.createValidate = createValidate;
(function (createValidate) {
    createValidate.is_uuid = _is_uuid_1.$is_uuid;
    createValidate.is_email = _is_email_1.$is_email;
    createValidate.is_url = _is_url_1.$is_url;
    createValidate.is_ipv4 = _is_ipv4_1.$is_ipv4;
    createValidate.is_ipv6 = _is_ipv6_1.$is_ipv6;
    createValidate.join = _join_1.$join;
    createValidate.report = validate.report;
})(createValidate = exports.createValidate || (exports.createValidate = {}));
function createAssertEquals() {
    halt("createAssertEquals");
}
exports.createAssertEquals = createAssertEquals;
(function (createAssertEquals) {
    createAssertEquals.is_uuid = _is_uuid_1.$is_uuid;
    createAssertEquals.is_email = _is_email_1.$is_email;
    createAssertEquals.is_url = _is_url_1.$is_url;
    createAssertEquals.is_ipv4 = _is_ipv4_1.$is_ipv4;
    createAssertEquals.is_ipv6 = _is_ipv6_1.$is_ipv6;
    createAssertEquals.join = _join_1.$join;
    createAssertEquals.every = assertEquals.every;
    createAssertEquals.guard = assertEquals.guard;
})(createAssertEquals = exports.createAssertEquals || (exports.createAssertEquals = {}));
function createEquals() {
    halt("createEquals");
}
exports.createEquals = createEquals;
(function (createEquals) {
    createEquals.is_uuid = _is_uuid_1.$is_uuid;
    createEquals.is_email = _is_email_1.$is_email;
    createEquals.is_url = _is_url_1.$is_url;
    createEquals.is_ipv4 = _is_ipv4_1.$is_ipv4;
    createEquals.is_ipv6 = _is_ipv6_1.$is_ipv6;
    createEquals.join = _join_1.$join;
})(createEquals = exports.createEquals || (exports.createEquals = {}));
function createValidateEquals() {
    halt("createValidateEquals");
}
exports.createValidateEquals = createValidateEquals;
(function (createValidateEquals) {
    createValidateEquals.is_uuid = _is_uuid_1.$is_uuid;
    createValidateEquals.is_email = _is_email_1.$is_email;
    createValidateEquals.is_url = _is_url_1.$is_url;
    createValidateEquals.is_ipv4 = _is_ipv4_1.$is_ipv4;
    createValidateEquals.is_ipv6 = _is_ipv6_1.$is_ipv6;
    createValidateEquals.join = _join_1.$join;
    createValidateEquals.report = validateEquals.report;
})(createValidateEquals = exports.createValidateEquals || (exports.createValidateEquals = {}));
function createObject() {
    halt("createObject");
}
exports.createObject = createObject;
function createStringify() {
    halt("createStringify");
}
exports.createStringify = createStringify;
(function (createStringify) {
    createStringify.number = _number_1.$number;
    createStringify.string = _string_1.$string;
    createStringify.tail = _tail_1.$tail;
    createStringify.throws = stringify.throws;
})(createStringify = exports.createStringify || (exports.createStringify = {}));
function createAssertStringify() {
    halt("createAssertStringify");
}
exports.createAssertStringify = createAssertStringify;
(function (createAssertStringify) {
    createAssertStringify.is_uuid = _is_uuid_1.$is_uuid;
    createAssertStringify.is_email = _is_email_1.$is_email;
    createAssertStringify.is_url = _is_url_1.$is_url;
    createAssertStringify.is_ipv4 = _is_ipv4_1.$is_ipv4;
    createAssertStringify.is_ipv6 = _is_ipv6_1.$is_ipv6;
    createAssertStringify.number = _number_1.$number;
    createAssertStringify.string = _string_1.$string;
    createAssertStringify.tail = _tail_1.$tail;
    createAssertStringify.join = _join_1.$join;
    createAssertStringify.every = assertStringify.every;
    createAssertStringify.guard = assertStringify.guard;
    createAssertStringify.throws = assertStringify.throws;
})(createAssertStringify = exports.createAssertStringify || (exports.createAssertStringify = {}));
function createIsStringify() {
    halt("createIsStringify");
}
exports.createIsStringify = createIsStringify;
(function (createIsStringify) {
    createIsStringify.is_uuid = _is_uuid_1.$is_uuid;
    createIsStringify.is_email = _is_email_1.$is_email;
    createIsStringify.is_url = _is_url_1.$is_url;
    createIsStringify.is_ipv4 = _is_ipv4_1.$is_ipv4;
    createIsStringify.is_ipv6 = _is_ipv6_1.$is_ipv6;
    createIsStringify.number = _number_1.$number;
    createIsStringify.string = _string_1.$string;
    createIsStringify.tail = _tail_1.$tail;
    createIsStringify.throws = isStringify.throws;
})(createIsStringify = exports.createIsStringify || (exports.createIsStringify = {}));
function halt(name) {
    throw new Error("Error on TSON.".concat(name, "(): no transform has been configured. Configure the \"tsconfig.json\" file following the [README.md#setup](https://github.com/samchon/typescript-json#setup)"));
}

},{"./IValidation":1,"./TypeGuardError":2,"./functional/$every":3,"./functional/$guard":4,"./functional/$is_email":5,"./functional/$is_ipv4":6,"./functional/$is_ipv6":7,"./functional/$is_url":8,"./functional/$is_uuid":9,"./functional/$join":10,"./functional/$number":11,"./functional/$report":12,"./functional/$string":13,"./functional/$tail":14,"./schemas/IJsonApplication":16,"./schemas/IJsonComponents":17,"./schemas/IJsonSchema":18}],16:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],17:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],18:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}]},{},[15])(15);
});
