# 🌌 Galaxy Events

Galaxy Events is a modern, responsive web application designed to streamline event discovery and management. This platform allows users to explore upcoming events, manage bookings, and handle secure authentication seamlessly.

**Live Demo:** [https://galaxy-events-demo-v1.web.app/](https://galaxy-events-demo-v1.web.app/auth)

---

## 🚀 Features

-   **User Authentication:** Secure Sign-in and Sign-up functionality to protect user data and personalized event lists.
-   **Event Dashboard:** A centralized hub to view featured and upcoming events.
-   **Responsive Design:** Fully optimized for desktop, tablet, and mobile viewing.
-   **Real-time Interaction:** (Optional: mention if it uses Firebase/Socket.io) Instant updates for event registrations.
-   **User Profile Management:** Manage personal details and viewed event history.

## 🛠️ Tech Stack

-   **Frontend:** React.js / Vue.js (Choice of Framework)
-   **Styling:** Tailwind CSS / Styled Components
-   **Backend/Hosting:** Firebase (Authentication, Hosting, Firestore)
-   **State Management:** Redux Toolkit / Context API
-   **Icons:** Lucide React / FontAwesome

## 📦 Installation & Setup

To run this project locally, follow these steps:

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/your-username/galaxy-events.git](https://github.com/your-username/galaxy-events.git)
    cd galaxy-events
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Environment Variables:**
    Create a `.env` file in the root directory and add your configuration (e.g., Firebase keys):
    ```env
    REACT_APP_FIREBASE_API_KEY=your_api_key
    REACT_APP_FIREBASE_AUTH_DOMAIN=your_auth_domain
    ```

4.  **Start the development server:**
    ```bash
    npm start
    ```
    The app will be available at `http://localhost:3000`.

## 📁 Project Structure

```text
src/
├── assets/          # Images, logos, and global styles
├── components/      # Reusable UI components (Buttons, Cards, Navbar)
├── contexts/        # Auth and Data Contexts
├── hooks/           # Custom React hooks
├── pages/           # Main views (Auth, Dashboard, EventDetails)
└── services/        # API calls and Firebase configuration
