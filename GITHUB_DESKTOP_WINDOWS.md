# Publish with GitHub Desktop on Windows

## Replace the current website

1. Download and extract the ZIP.
2. Open GitHub Desktop and select your kaysons-website repository.
3. Choose **Repository → Show in Explorer**.
4. Keep the hidden **.git** folder. Delete the old visible website files from this repository folder.
5. Copy every file from the extracted folder into the repository folder. The file **index.html** must be at the top level, not inside another folder.
6. Return to GitHub Desktop. Enter the summary **Redesign Kaysons website**.
7. Select **Commit to main**, then **Push origin**.

## Turn on GitHub Pages

1. Open the repository on github.com.
2. Select **Settings → Pages**.
3. Under **Build and deployment**, set Source to **Deploy from a branch**.
4. Choose branch **main**, folder **/(root)**, then select **Save**.
5. Wait about two minutes and refresh the Pages section. GitHub will show the published address.

Do not use Render and do not enter an npm build command. This package is a complete static website.
