# Publish the Kaysons website using GitHub Desktop on Windows

This package is a static website. Use GitHub Pages directly; do not use Render and do not run npm commands.

## 1. Download and extract

1. Download `kaysons-final-3-page-website.zip` from ChatGPT.
2. In Windows File Explorer, right-click the ZIP and choose **Extract All**.
3. Open the extracted `kaysons-final-website` folder.

The folder must contain `index.html`, `products.html`, `contact.html`, the CSS and JavaScript files, and the Kaysons logo.

## 2. Clone your existing GitHub repository

1. Open **GitHub Desktop**.
2. Choose **File → Clone repository**.
3. Select the **GitHub.com** tab.
4. Select `Devn09/kaysons-website` and click **Clone**.
5. In GitHub Desktop, choose **Repository → Show in Explorer**.

This opens the local folder connected to your GitHub repository.

## 3. Replace the old website files

1. In the cloned repository folder, remove the old visible website files. Do not change or delete the hidden `.git` folder.
2. Copy **all files inside** the extracted `kaysons-final-website` folder into the cloned repository folder.
3. Confirm that `index.html` is directly in the repository root—not inside another folder.

Correct structure:

```text
kaysons-website/
├── index.html
├── products.html
├── contact.html
├── styles.css
├── site.css
├── script.js
├── kaysons-logo.jpg
├── README.md
└── GITHUB_DESKTOP_WINDOWS.md
```

## 4. Commit and push from GitHub Desktop

1. Return to GitHub Desktop.
2. The **Changes** tab will list the new and replaced files.
3. In the **Summary** box, enter: `Publish final three-page Kaysons website`
4. Click **Commit to main**.
5. Click **Push origin**.

## 5. Enable GitHub Pages

1. Open `https://github.com/Devn09/kaysons-website` in Chrome.
2. Click **Settings**.
3. In the left menu, click **Pages**.
4. Under **Build and deployment**, choose **Deploy from a branch**.
5. Select branch **main** and folder **/(root)**.
6. Click **Save**.

If Pages was already enabled, pushing the new commit automatically starts a new deployment.

The website address will normally be:

`https://devn09.github.io/kaysons-website/`

## 6. Future updates

1. Edit the files inside the cloned repository folder.
2. Review the changes in GitHub Desktop.
3. Enter a commit summary and click **Commit to main**.
4. Click **Push origin**.

GitHub Pages will publish the update automatically.

## Important temporary content

- The product page contains representative placeholders until the official product list, specifications and photographs are supplied.
- The contact page contains dummy phone, email, address and business hours.
- The enquiry form currently displays a demo message and does not send submissions.
- Approval names on the homepage are typographic placeholders, not supplied official logo files.

Replace and verify these items before treating the website as the final public company website.
