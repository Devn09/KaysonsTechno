# Validation record

Date: 6 September 2026

## Browser checks

Chrome was used to inspect the actual local static website.

- The four main pages were measured at 375, 768, 1024 and 1440px using embedded browser viewports. All 16 combinations had document scroll width equal to the available client width: no horizontal overflow.
- Menu was visible at 375 and 768px and absent at 1024 and 1440px on every main page.
- Desktop screenshots were reviewed for Home, Products, About and Contact. The footer and mobile catalogue were also inspected visually.
- A long RTD/Thermocouple heading overflowed during the initial mobile check; logical line breaks and wrapping corrected it. The corrected 375px page measured 360px client width and 360px scroll width, including the reserved scrollbar gutter.
- Mobile navigation opened and followed the Product Portfolio link.
- Product search for “cable” returned one family. The Ex e filter returned nine of ten families. Clear/reset restored all ten. A FAQ opened correctly.
- Contact links selected the requested Cable Glands family. An empty submission highlighted six required fields. A valid test submission displayed a prepared message and a mailto link to the sales address; it did not claim delivery.
- A temporary image fixture demonstrated a supplied image rendering and a missing image reverting to a text listing. Test fixture pages are excluded from this package.
- The standalone 404 fitted a 375px browser viewport.

These are browser viewport checks, not tests on physical phones or every browser engine. Browser review controls and internal preview URLs are not part of the delivered site.

## Automated checks

Twenty simulated interaction checks passed:

1. All four main pages and Legal initialise.
2. Search, empty results and reset.
3. Protection-filter OR logic and active count.
4. URL filter state and preserved product anchors.
5. Advanced-filter AND logic from supplied scope data.
6. Unknown advanced fields and unsafe resource URL handling.
7. Search keyboard shortcut and Escape to close filters.
8. Mobile menu state and keyboard focus recovery.
9. Contact product preselection.
10. Required-field, whitespace and email validation.
11. Prepared email content and preserved form values.
12. Honeypot handling.
13. Configured online delivery success.
14. Configured delivery failure and email fallback.
15. Analytics disabled without configuration or consent.
16. Analytics opt-in, revocation and renewed opt-in.
17. CSS parsing and responsive/reduced-motion rules.
18. Custom-domain, GitHub project and GitHub root 404 recovery.
19. Category links clear filters so their destination is visible.
20. A configured photograph receives a visible loading area and an error removes it.

Email service responses and analytics network loading were isolated in these tests. No real email was sent.

## Static checks

- The original ten product IDs and names are preserved.
- All six FAQs match their FAQ structured data.
- All three sales numbers appear in every shared footer.
- Local links, section anchors, styles, scripts, image references and font paths resolve.
- Images have alternative text and intrinsic dimensions.
- HTML IDs, required field labels, page metadata, JSON-LD and sitemap were checked.
- JavaScript syntax and CSS parsing pass.
- Seven principal foreground/background combinations exceed 4.5:1 contrast; measured ratios range from 5.29:1 to 15.45:1.
- The final ZIP was checked for integrity and required root files.

## Remaining content and environment checks

Real product photography, certificates, catalogues and datasheets have not been supplied. Advanced certification, gas-group and zone data remains unpopulated until verified values are entered. The homepage photograph illustrates an industry application.

Direct EmailJS delivery, GA4 reporting, Google Maps availability and production hosting require their configured deployment environment. This package has not been published as part of the rebuild.
