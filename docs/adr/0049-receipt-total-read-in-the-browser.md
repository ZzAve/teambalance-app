# ADR-0049: The total of a receipt is read in the browser

- Status: Accepted
- Date: 2026-11-14
- Relates to: [ADR-0048](0048-out-of-pocket-expenses-stored-by-the-app.md) (the form this serves),
  [ADR-0044](0044-receipts-on-expenses-stored-by-bunq-payment-id.md) (receipt photos)

## Context

A member who records an Out-of-pocket Expense has the receipt in hand and types its total. The photo of
the receipt is asked for anyway, so the amount can be read from it.

## Decision

- **Text recognition runs in the browser** with Tesseract (tesseract.js, WebAssembly, in a web worker).
  The photo does not leave the device for it, there is no cost per read, and it works in Safari, Chrome
  and Firefox. A server-side vision model reads receipts better, but sends every photo to a third party
  and costs money per read; the browser's own `TextDetector` is missing on iPhone.
- **Self-hosted, fetched on first use.** The worker, the engine and the Dutch and English language data
  are copied from `node_modules` into `/ocr` at build time (`vite.config.ts`) and are fetched when a member
  first picks a receipt photo: about 10 MB once. They are excluded from the service worker's precache.
  Nothing is loaded from a CDN.
- **The total is a suggestion.** `receiptTotal` picks the amount from the recognised text: a line that
  names the total, else a card payment, else the largest amount printed twice. The form fills the amount
  only when the member has not typed one, says that it was read from the receipt, and the member confirms
  it by saving.
- The form View gets the reader as a prop, so stories and tests never load the engine.

## Consequences

- Measured on 40 scanned receipts with known totals (ICDAR SROIE, English, low resolution): 27 right, 10
  wrong, 3 not found. Wrong answers are mostly one misread digit. No set of Dutch phone photos was
  measured. The member must check the amount; the form says so.
- A first read needs the 10 MB download, so it is slow on a poor mobile connection. The form stays usable
  while it runs, and a failed read only leaves the amount empty.
- Only the total is read. The date and the description are still typed.
