# Rangel Guitar

Rangel Guitar is a modern, interactive web application designed for guitar enthusiasts. It provides a comprehensive platform to find, view, and learn songs with accurate tablatures and chords. Built with a powerful tech stack, it offers a seamless and feature-rich user experience.

## Key Features

- **Extensive Song Library:** Browse and search for songs by title or artist.
- **Interactive Song View:** Display lyrics with integrated, clickable chords that show diagrams.
- **Chord Transposition:** Easily change the key of any song to suit your vocal range or skill level.
- **Dual View Mode:** Switch between a full view with chords and lyrics, or a clean, lyrics-only mode.
- **Artist Pages:** Explore all available songs by a specific artist.
- **User Authentication:** Secure sign-up and login functionality using Firebase Authentication (Email/Password & Google).
- **Personalized Experience:** Logged-in users can mark songs as favorites for quick access.
- **Song Requests:** Users can request new songs to be added to the library.
- **Admin Panel:** A protected area for administrators to view user-submitted song requests.
- **Customizable Theme:** Toggle between light and dark modes for comfortable viewing.
- **Multi-language Support:** Interface available in both English and Spanish.

## Tech Stack

- **Framework:** [Next.js](https://nextjs.org/) (with React)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **UI Components:** [ShadCN UI](https://ui.shadcn.com/)
- **Backend & Authentication:** [Firebase](https://firebase.google.com/)
- **AI Functionality:** [Google's Genkit](https://firebase.google.com/docs/genkit)
- **Language:** [TypeScript](https://www.typescriptlang.org/)

## Getting Started (Local Setup)

To run this project on your local machine, follow these steps.

### Prerequisites

Make sure you have the following installed:
- [Node.js](https://nodejs.org/) (v18 or later)
- [Google Cloud SDK (gcloud CLI)](https://cloud.google.com/sdk/docs/install)

### 1. Clone or Download the Project

First, get the project code onto your local machine.

### 2. Install Dependencies

Navigate to the project's root directory in your terminal and run:
```bash
npm install
```

### 3. Configure Firebase

This project requires a Firebase project to handle authentication and other backend services.

1.  Create a new project in the [Firebase Console](https://console.firebase.google.com/).
2.  In your project's settings, add a new **Web App** (click the `</>` icon).
3.  Firebase will provide you with a `firebaseConfig` object. **Copy this object.**
4.  Open the file `src/context/auth-context.tsx` in your code editor.
5.  Paste your `firebaseConfig` object, replacing the placeholder.
6.  **Important:** In the Firebase Console, go to **Authentication** -> **Sign-in method** and enable the **Email/Password** and **Google** providers.
7.  Then, under the **Settings** tab for Authentication, go to **Authorized domains** and add `localhost` to the list.

### 4. Authenticate for AI Services

To use the Genkit AI features, you need to authenticate your local environment. Run the following command in your terminal:
```bash
gcloud auth application-default login
```
This will open a browser window to complete the login process.

### 5. Run the Development Servers

This application requires two separate processes to run concurrently.

-   **Terminal 1 (Web App):**
    ```bash
    npm run dev
    ```
-   **Terminal 2 (Genkit AI Server):**
    ```bash
    npm run genkit:watch
    ```

Your application should now be running at `http://localhost:9002`.
