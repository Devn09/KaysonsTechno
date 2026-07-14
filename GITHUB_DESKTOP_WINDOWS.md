# Update the website using GitHub Desktop on Windows

This package is a static website. Publish it through GitHub Pages directly—do not use Render or npm commands.

## 1. Download and extract

1. Download `kaysons-techno-website-v2.zip` from ChatGPT.
2. In Windows File Explorer, right-click the ZIP and choose **Extract All**.
3. Open the extracted `kaysons-final-website-v2` folder.

## 2. Open your existing repository

If `Devn09/kaysons-website` is already available in GitHub Desktop, select it from the repository list.

If it is not available:

1. Open **GitHub Desktop**.
2. Choose **File → Clone repository**.
3. Select the **GitHub.com** tab.
4. Select `Devn09/kaysons-website` and click **Clone**.

## 3. Replace the previous website

1. In GitHub Desktop, choose **Repository → Show in Explorer**.
2. Remove the old visible website files. Do not alter or delete the hidden `.git` folder.
3. Copy **all files inside** the extracted `kaysons-final-website-v2` folder into the cloned repository folder.
4. Confirm that `index.html` is directly in the repository root, not inside an additional folder.

Correct structure:

```text
kaysons-website/
├── index.html
├── products.html
├── about.html
├── contact.html
├── styles.css
├── site.css
├── script.js
├── kaysons-logo.jpg
├── README.md
└── GITHUB_DESKTOP_WINDOWS.md
```

## 4. Commit and push

1. Return to GitHub Desktop.
2. Review the **Changes** list.
3. Enter this summary: `Update Kaysons Techno four-page website`
4. Click **Commit to main**.
5. Click **Push origin**.

## 5. GitHub Pages

If GitHub Pages is already enabled, the push automatically starts a new deployment.

If it is not enabled:

1. Open `https://github.com/Devn09/kaysons-website` in Chrome.
2. Open **Settings → Pages**.
3. Under **Build and deployment**, choose **Deploy from a branch**.
4. Select branch **main** and folder **/(root)**.
5. Click **Save**.

The website address will normally be:

`https://devn09.github.io/kaysons-website/`

## Important notes

- Product photography and detailed model specifications can be added later without changing the four-page navigation.
- The supplied company address, telephone numbers, email and business hours are included on the Contact page.
- The enquiry form is currently a visual demo and does not transmit information.
- Certification and approval marks are high-visibility typographic placeholders until official approved logo files are supplied.
