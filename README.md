# Personal Life Manager for iPhone

A local-first installable PWA for study deadlines, daily tasks, money records, loans and career goals.

## Important notification limitation
This app does **not** provide dependable scheduled notifications while fully closed on iOS. Its JavaScript checks due items while the app is running/active and can show browser notifications if permission is granted. iOS web push requires a supported installed PWA plus a push service/server; dependable local scheduled notifications are best handled by Apple Reminders or a native iOS app. Do not rely on this PWA alone for exams or payment deadlines.

## Install on iPhone
A PWA must be served from an HTTPS website. Opening `index.html` from Files is not enough for installation or service workers.

### Simple deployment with GitHub Pages
1. On a computer, sign in to GitHub and create a **public** repository, e.g. `personal-life-manager`.
2. Upload all files in this folder to the repository root, including both PNG icons.
3. Open the repository's **Settings → Pages**.
4. Under build/deploy, choose **Deploy from a branch**, select `main` and `/ (root)`, then Save.
5. Wait for GitHub Pages to publish the site. Open the published HTTPS URL.
6. On your iPhone, open that URL in **Safari**.
7. Tap **Share → Add to Home Screen**. If shown, enable **Open as Web App**, then tap Add.
8. Open the new Home Screen icon. Tap **Enable alerts** and grant permission if iOS offers it.

### Data privacy and backup
- Records are saved in this browser's localStorage on this iPhone. No account or cloud sync is built in.
- Clearing website data, removing browser data, or some browser resets can erase records.
- Use **Export backup (JSON)** regularly and store the backup somewhere safe. Importing a backup replaces current records.
- Do not enter passwords, bank login details, or other secrets.

## Features
- Study: exam, assignment, presentation, class, viva/lab, university fee
- Tasks with priority and due date
- Money transactions: income, expenses, money lent, money borrowed and repayments
- Career/personal goals
- Export/import JSON backup
- Offline shell cache after first successful online load

## Known limitation
The balance is a simple cash-flow estimate: income + borrowed money + loan repayments received - expenses - money lent - loan repayments made. It is not a bank balance or accounting statement.
