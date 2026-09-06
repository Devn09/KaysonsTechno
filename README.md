# Kaysons Techno Equipments Private Limited

A complete static website. Extract this package with `index.html` at the repository root, commit, and push to GitHub Pages. No npm installation or build command is required.

## Pages

<<<<<<< HEAD
- `index.html` — home, equipment capabilities, approvals and industries
- `products.html` — ten product families, search, expandable filters and six FAQs
- `about.html` — company, manufacturing process and quality approach
- `contact.html` — enquiry form, all sales and office contacts, address and map
- `legal.html` — retained Privacy Policy and Website Terms
- `404.html` — self-contained recovery page
=======
The package includes a branded first-visit preloader, scroll progress, section reveals, product search and filtering, a six-question product FAQ, product-media/download provisions, a custom 404 page, a Google Maps preview, keyword-led SEO titles, structured data, a consent-based GA4 provision and an EmailJS-ready enquiry form. The loader is skipped automatically when navigating between pages in the same browser session.
>>>>>>> 1c94fd5837f48baddd995d7843ec0fd1a7893e09

## What is ready

The site includes a local Onest variable font, compressed homepage artwork, responsive navigation, keyboard focus states, reduced-motion handling, product-specific enquiry links, preserved SEO metadata and structured data, sitemap and robots file. There is no loading overlay or JavaScript page-transition barrier. Every page uses normal HTML links.

Desktop navigation remains visible at 900px and above. The compact Menu control appears below that width. Product layouts use three, two and one columns as the viewport narrows. Header and footer logo proportions are fixed to the original 500:93 aspect ratio. All three sales numbers appear in the footer.

## Finish the content

Follow `CONTENT_GUIDE.md` to add real photographs, certificates, catalogues and datasheets. The homepage artwork is an original abstract engineering material study, not a photograph of a Kaysons product. Product tiles intentionally use family typography until real photos are added.

## Email delivery

The default enquiry form prepares an email and provides an explicit Open email app button and a copyable message. The visitor must send the message from their email application. It never reports that the message was sent in this mode.

To enable direct delivery, complete the existing public EmailJS settings in `site-config.js`. See `SETUP_EMAILJS_ANALYTICS.md`. Account delivery and domain restrictions must be verified after configuration. Optional GA4 tracking is disabled until a measurement ID is provided and the visitor gives consent.

## Domain

The preserved canonical URLs, Open Graph image URL, robots file and sitemap use `https://www.kaysonstechno.com/`. Update them together if the production domain changes. Use this ZIP's static files with the existing GitHub Pages repository. The custom 404 includes recovery for project sites on github.io and root-level custom domains.

## Validation

See `VALIDATION.md` for checks performed and their limits. The site source and interactions were checked programmatically; this package is not represented as having passed real-browser or real email-delivery tests.
