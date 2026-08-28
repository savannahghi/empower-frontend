# Firebase Functions Deployment Guide

## Prerequisites

Before you begin, ensure the following tools and versions are installed:

### 1. Firebase CLI

-   **Required version**: `13.10.2`
-   **Check version**:

    ```bash
    firebase --version
    ```

    -   If not installed or incorrect version, install it by running:

        ```bash
        npm i -g firebase-tools@13.10.2
        ```

### 2. Node.js

-   **Required version**: `20.12.1`
-   Use a version manager like [nvm](https://github.com/nvm-sh/nvm) if needed.

---

## Setup Instructions

### 1. Install Function Dependencies

Navigate to the `functions/` directory and install dependencies:

```bash
cd functions/
npm install
```

### 2. Firebase Project Access

Make sure you have been granted access to the Firebase project **`slade-call-center`**.

-   If you haven't received an invitation, please contact:
    **[jason.wanjohi@savannahinformatics.com](mailto:jason.wanjohi@savannahinformatics.com)**

### 3. Authenticate with Firebase

Once access is granted:

```bash
firebase login
```

### 4. Select the Firebase Project

Use the provided token to set the active Firebase project:

```bash
npx firebase use --token "FIREBASE_TOKEN" "slade-call-center"
```

---

## Deployment

To deploy the Cloud Functions to Firebase, run:

```bash
npm run deploy
```

---

## Notes

-   Ensure you are in the `functions/` directory when running commands unless specified otherwise.
-   If you encounter permission or authentication issues, double-check project access and token usage.

---
