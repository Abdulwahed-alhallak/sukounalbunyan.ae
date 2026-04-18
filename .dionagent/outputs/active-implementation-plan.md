# Active Implementation Plan - PWA & Auto-Refresh Fix

## Problem
Auto-refresh loop and Service Worker syntax error (`Unexpected token 'if'`) on production.

## Rationale
The `Unexpected token 'if'` suggests a syntax error in `sw.js` likely caused by missing semicolons, line-ending issues with comments, or complex nested logic. The auto-refresh loop is likely a side effect of the registration retry logic combined with Inertia version sensitivity.

## Proposed Changes
1.  **sw.js**: Cleanup syntax, remove comments, simplify logic.
2.  **app.blade.php**: Stabilize registration, non-blocking update checks.

## Verification
- Production deployment via auto_sync.cjs.
- Check console for registration success.
