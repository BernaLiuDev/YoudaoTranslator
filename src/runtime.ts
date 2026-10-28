/**
 * Runtime detection shim.
 *
 * On txiki.js (bundled with the workflow):
 * - v26.6.0+: `tjs.env` (object) and `tjs.args` (Array-like)
 * - older versions: `tjs.getenv()` (function) and `tjs.args`
 * On Node.js (fallback): `process.env` and `process.argv` take over.
 */

declare var tjs: any;

export function getEnv(key: string): string {
  if (typeof tjs !== "undefined" && tjs) {
    if (tjs.getenv) return tjs.getenv(key);       // old txiki API
    if (tjs.env) return tjs.env[key] || "";       // txiki v26.6.0+ API
  }
  return process.env[key] || "";
}

export function getArgs(): string[] {
  if (typeof tjs !== "undefined" && tjs?.args) {
    return Array.from(tjs.args);
  }
  return process.argv.slice(2);
}
