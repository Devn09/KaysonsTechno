# Kaysons Techno Equipments Private Limited

Corporate website rebuild — 6 September 2026.

This is a complete static HTML, CSS and JavaScript website for GitHub Pages. No npm installation, build command or application server is required. Replace the previous website files as a complete set, keeping your repository's `.git` directory and existing `CNAME` custom-domain file. Keep `index.html` at the repository root.

## Pages

- `index.html`: company introduction, product overview, certifications and application support.
- `products.html`: ten original product groups, category navigation, search, protection filters and six FAQs.
- `about.html`: company profile, manufacturing process, quality approach and approvals.
- `contact.html`: enquiry form, all supplied sales and office contacts, address and map.
- `legal.html`: Privacy Policy and Website Terms.
- `404.html`: self-contained page recovery, including GitHub project-site handling.

## Design and behaviour

The interface uses Kaysons red, charcoal, white and light grey, a locally hosted Onest font, a consistent heading scale and restrained rectangular controls. The homepage photograph illustrates an industry application; it is not presented as a Kaysons facility. Credit and licence details are in `ASSET_CREDITS.md`.

Desktop navigation is always visible at 800px and above. Smaller screens use the Menu button. The catalogue has a category directory and two columns on desktop, and one column on phones. Header and footer logos preserve the original 500:93 proportions. All three sales numbers appear in each shared footer.

Pages use normal HTML links. There is no loading overlay, artificial page delay or content hidden pending an animation. Product copy and FAQ content remain available without JavaScript. Mobile navigation remains visible if JavaScript cannot initialise.

Shared presentation is in `kaysons.css`; enhancements are in `kaysons.js`. The HTML references include version identifiers to avoid using an earlier cached stylesheet or script.

## Add final content

Follow `CONTENT_GUIDE.md` to connect photographs, certificates, catalogues and datasheets using `product-assets.js`. Product entries are complete text listings until images are supplied; empty media areas and unavailable download controls are not displayed. A failed image returns to the text listing.

## Enquiry delivery

By default, the form prepares a message and offers an explicit **Open email app** link and copyable text. The visitor must send it from their email application. It does not claim that preparing the message sends it.

Direct delivery requires your public EmailJS identifiers in `site-config.js` and a verified account/template configuration. Optional GA4 requires a measurement ID and visitor consent. Both are described in `SETUP_EMAILJS_ANALYTICS.md`.

## Domain and deployment

Canonical metadata, robots and sitemap use `https://www.kaysonstechno.com/`. Update these together if the production domain changes. Follow `GITHUB_DESKTOP_WINDOWS.md` to replace the existing site. Deployment was not performed as part of this rebuild.

## Verification

See `VALIDATION.md`. The four main pages were measured in Chrome at 375, 768, 1024 and 1440px; all fitted without horizontal overflow. Desktop and mobile layouts, navigation, filtering, FAQs, form validation, prepared enquiries and image fallback were reviewed. Twenty automated interaction checks also passed. Real email delivery and production hosting still require their configured environment.
