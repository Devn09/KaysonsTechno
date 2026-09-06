# Add final Kaysons assets

The page layout is complete. Product asset paths are held in `product-assets.js`. The ten existing product IDs are shared by the product cards, contact selector and enquiry links; keep them stable.

## Add a product photo and documents

1. Place the photo under `assets/products/` and documents under `assets/documents/`.
2. Find the relevant product ID in `product-assets.js`.
3. Enter relative paths in the fields below. Leave unknown fields empty.

```js
"cable-glands": {
  image: "assets/products/cable-glands.webp",
  imageAlt: "Kaysons cable glands, front and side views",
  datasheet: "assets/documents/cable-glands-datasheet.pdf",
  catalogue: "assets/documents/cable-glands-catalogue.pdf",
  certificates: [
    { label: "IECEx certificate", href: "assets/documents/cable-glands-iecex.pdf" }
  ],
  gasGroups: [],
  zones: [],
  certifications: []
}
```

This is a path example, not a claim about a product's certification. Add only the certificates and scope verified for the actual models shown. Photographs and resource links appear automatically. A failed image falls back to the text listing. Empty document fields do not create download controls. Check that every supplied path points to an existing file before publishing.

Use an 800–1200px WebP photograph with room around the product; a 4:3 image on white or transparent background works well. Product photos use `object-fit: contain` so they are not stretched or cropped. Compress files before adding them.

## Product filters

Protection-concept values inherited from the previous site provide family-level browsing guidance. They are not model-level selection data. An optional `protection` array can override them for a family, using `ex-d`, `ex-e` and `ex-t`.

Advanced filter controls appear only when matching verified values have been entered in the asset registry:

- `gasGroups`: `i`, `iia`, `iib`, `iic`
- `zones`: `zone-1`, `zone-2`, `zone-21`, `zone-22`
- `certifications`: `iecex`, `atex`, `peso`

Selections within a filter group use OR. Different groups use AND. Family-level results still require confirmation against an individual model and its certificate. Do not combine different models' certificates as if every configuration has every approval.

## Main imagery and copy

`assets/industry-refinery.webp` is a licensed photograph illustrating an industry application. It is not a Kaysons factory or project photograph. You may replace it with a supplied photograph; update the alternative text and caption in `index.html` together. Keep a wide crop and compress it before publishing. Attribution and source details are in `ASSET_CREDITS.md`.

All visible page copy is ordinary HTML. `products-data.json` is a reference export only; editing it does not change the rendered cards. Edit product titles/descriptions in `products.html`, and keep the contact options and FAQ structured data aligned with any later copy changes.

## What needs account configuration

Public EmailJS account identifiers enable direct enquiry delivery. A GA4 measurement ID enables the optional consent prompt. These are separate from supplying product photos and PDFs. See `SETUP_EMAILJS_ANALYTICS.md`.
