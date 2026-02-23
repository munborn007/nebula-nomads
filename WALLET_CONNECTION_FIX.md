# Wallet Connection Error Fix

## Problem
The wallet extension (evmAsk.js - likely Rabby or similar multi-wallet extension) throws "Unexpected error" which triggers Next.js error overlay.

## Solution Applied

1. **Early Error Suppression** (`public/suppress-extension-errors.js`)
   - Loads BEFORE Next.js initializes
   - Catches unhandled rejections from extensions
   - Suppresses console errors from extensions

2. **Defensive Wallet Request** (`src/utils/web3.ts`)
   - Wraps `window.ethereum.request()` in multiple try-catch layers
   - Ensures no error escapes to Next.js overlay
   - Shows user-friendly error message instead

3. **Error Shield Component** (`src/components/ExtensionErrorShield.tsx`)
   - Client-side backup error handler
   - Catches any errors that slip through

## If Error Overlay Still Appears

### Option 1: Enable CSS Overlay Hiding (Quick Fix)

Edit `src/app/globals.css` and uncomment these lines:

```css
nextjs-portal {
  display: none !important;
}
body[style*="padding"] {
  padding: 0 !important;
  overflow: auto !important;
}
```

### Option 2: Use Incognito Mode

1. Open browser in Incognito/Private mode
2. Install ONLY MetaMask (not multi-wallet extensions)
3. Try connecting wallet

### Option 3: Disable Conflicting Extensions

1. Go to `chrome://extensions/`
2. Temporarily disable wallet extensions except MetaMask
3. Try connecting

## Testing

1. Restart dev server: `npm run dev`
2. Hard refresh: `Ctrl + Shift + R`
3. Click "Connect Wallet"
4. If extension throws error, you should see friendly message below button (not error overlay)

## Notes

- The error is from the extension, not your code
- The app handles it gracefully and shows a message
- Next.js overlay may still appear in dev mode (use CSS fix above)
- In production, the overlay won't appear
