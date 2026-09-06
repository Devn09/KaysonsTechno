# Email delivery and optional analytics

Both integrations are inactive until their public account identifiers are supplied in `site-config.js`. No private email password or private API key belongs in this file.

## Existing EmailJS provision

Configure the service and template in your EmailJS account. Set the recipient to `sales@kaysonstechno.com` in the template itself, and use `{{reply_to}}` as Reply-To. The site passes these fields:

`from_name`, `company`, `phone`, `reply_to`, `product`, `protection`, `project_stage`, `message`, `privacy_consent`, `subject`, `to_email`.

Then enter `publicKey`, `serviceId` and `templateId` in `site-config.js`. Restrict the service to your final domain using the account controls available to you. Submit a test after deployment and verify the received email and reply-to address.

In the default mode, the visitor prepares a message on the page, opens their email app, and sends it. A copyable message is also available. The site does not claim successful delivery merely because an email was prepared. If configured online delivery fails or times out, entered details are retained and the email fallback is shown.

Any CAPTCHA requirement needs its corresponding front-end integration before activation; enabling a challenge in the account alone is not an implemented website challenge.

## Existing GA4 provision

Enter your web stream's `G-…` measurement ID under `analytics.measurementId`. Analytics loads only after the visitor chooses Allow analytics. Essential only prevents tracking. Cookie settings allows the visitor to change the preference.

Configured, consented events include page views, enquiry CTA clicks, phone clicks, email clicks, document links, and `generate_lead` only after confirmed online enquiry delivery. Names, email addresses, phone input values and message bodies are not passed as analytics events. GA4 reporting and delivery must be verified with your actual property after deployment.

The preserved sitemap is `sitemap.xml`. Submit it in the Search Console account for the final production domain when the site is published there.
