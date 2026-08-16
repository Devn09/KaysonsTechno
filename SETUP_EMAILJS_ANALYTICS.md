# Activate EmailJS and basic analytics

The website is fully prepared for EmailJS and consent-based Google Analytics 4. Both integrations remain inactive until the account-specific public IDs are added to `site-config.js`.

## EmailJS

1. Create an EmailJS account at https://www.emailjs.com/.
2. Add an email service connected to the Kaysons sales mailbox.
3. Create an email template and set its recipient in the EmailJS dashboard to `sales@kaysonstechno.com`.
4. Use these template variables: `{{from_name}}`, `{{company}}`, `{{phone}}`, `{{reply_to}}`, `{{product}}`, `{{protection}}`, `{{project_stage}}`, `{{message}}` and `{{privacy_consent}}`.
5. In `site-config.js`, enter the EmailJS **Public Key**, **Service ID** and **Template ID**. Do not enter the mailbox password or any private key.
6. In EmailJS security settings, allow the final Kaysons website domain and enable CAPTCHA if required.
7. Submit one test enquiry and confirm both delivery and reply-to behaviour.

Until these three IDs are entered, submitting the form safely prepares an email in the visitor's email application instead of losing the enquiry.

## Google Analytics 4

1. Create a GA4 property and a Web data stream for the final Kaysons domain.
2. Copy the Measurement ID in the format `G-XXXXXXXXXX`.
3. Enter it under `analytics.measurementId` in `site-config.js`.
4. Analytics loads only after the visitor selects **Allow analytics** in the consent notice. Essential-only visitors are not tracked.
5. Verify page views in the GA4 Realtime report after deployment.

## Before publishing

- Replace only the empty values inside `site-config.js`.
- Test the contact form on the deployed HTTPS site.
- Confirm the Google Maps preview and all footer legal links.
- Keep the Privacy Policy updated if a new analytics, form, chat or advertising service is added.
