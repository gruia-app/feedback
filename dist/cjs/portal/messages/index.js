"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PORTAL_MESSAGES = void 0;
const de_js_1 = __importDefault(require("./de.js"));
const en_js_1 = __importDefault(require("./en.js"));
const es_js_1 = __importDefault(require("./es.js"));
const fr_js_1 = __importDefault(require("./fr.js"));
const it_js_1 = __importDefault(require("./it.js"));
const pt_js_1 = __importDefault(require("./pt.js"));
/** Raw catalogs, with `{appName}`, `{count}` and `{date}` still uninterpolated. */
exports.PORTAL_MESSAGES = { es: es_js_1.default, en: en_js_1.default, fr: fr_js_1.default, de: de_js_1.default, pt: pt_js_1.default, it: it_js_1.default };
