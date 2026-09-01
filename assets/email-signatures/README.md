# Personal email signature

This directory holds the source for Patricio Montes Güemez's personal Gmail signature. It is **not part of the public portfolio application** and must not be imported, rendered, or placed under `public/`.

## Why it lives here

The signature is a professional ecosystem resource: it shares the same identity, role, contact details, and professional links as the portfolio. Keeping it in this repository makes those details maintainable together without exposing the signature as a portfolio page.

## Update path

1. Update the relevant professional details in `src/content/portfolio.ts`.
2. Update `patricio-montes-güemez-signature.html` when its email-specific layout needs to change.
3. Run `node --import tsx --test tests/emailSignature.test.mjs` to detect identity and link drift.
4. Copy the rendered HTML into Gmail when ready.

## Boundary

| Included | Not included |
| --- | --- |
| Professional identity and contact resources | Public website UI or routes |
| Gmail-compatible signature source | Runtime imports or deployment assets |
| Regression coverage for shared details | Company branding or company signatures |
