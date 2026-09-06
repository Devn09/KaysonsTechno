# Publish through GitHub Desktop

1. Extract the ZIP to a folder on your Windows PC.
2. In GitHub Desktop, open the existing website repository.
3. Choose Repository → Show in Explorer.
4. Keep the repository's `.git` folder and any existing `CNAME` file for your custom domain. Replace the website's HTML, CSS, JavaScript and asset files with this package.
5. Ensure `index.html` is directly at the repository root, with `assets/` beside it.
6. Review changes in GitHub Desktop, commit and select Push origin.
7. In the repository's GitHub settings, open Pages, select Deploy from a branch, and choose `main` and `/(root)` if those are the repository's intended branch and folder.
8. Open the published website and confirm page navigation, mobile navigation, filters, maps and email enquiry behavior.

No npm dependency installation, build command or Render web service is needed. Direct email delivery needs the public EmailJS settings described in `SETUP_EMAILJS_ANALYTICS.md`; otherwise the email-app workflow remains available.
