import type { CapturedContext } from "./types.js";
export declare const MAX_ERRORS = 10;
export declare const MAX_NETWORK = 10;
export declare const MAX_ACTIONS = 30;
export declare function installFeedbackCapture(): void;
export declare function captureFeedbackContext(extra?: Record<string, unknown>): CapturedContext;
/** Test hook: clears the captured buffers. Not part of the public app contract. */
export declare function resetFeedbackCaptureForTests(): void;
