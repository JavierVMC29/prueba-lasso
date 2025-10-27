# Grant Tagging System - Technical Test

## Project Goal

This repository contains the solution for a technical test aimed at building a minimal viable Grant Tagging System. The system allows users to add new grants (manually or via JSON upload), automatically assigns relevant tags based on the grant's content using either string matching or an LLM (configurable), and provides an interface to view and filter these tagged grants.

This project demonstrates proficiency in full-stack development using Python (Flask) for the backend and React (TypeScript) for the frontend, focusing on building modular, production-ready, and well-tested applications.

## Core Features Implemented

**Backend (Flask API):**

* **RESTful API:** Provides endpoints for managing grants and tags.
* **Grant Management:** Create grants (single or batch), retrieve grants with filtering and pagination, retrieve a single grant by ID, and clear all grants (development only).
* **Automated Tagging:**
    * Supports simple string matching based on a predefined list.
    * Supports advanced tagging using the OpenAI API (configurable via environment variable).
* **Background Processing:** LLM tagging is performed in a background thread to ensure immediate API responses.
* **Filtering & Pagination:** Efficiently filter grants by name (partial, case-insensitive) and multiple tags, with paginated results.
* **Standardized Responses:** Consistent JSON response structure (`ApiResponse<T>`, `Page<T>`) for predictable frontend integration and error handling.
* **Database:** Uses PostgreSQL with SQLAlchemy ORM and handles schema evolution via Flask-Migrate.

**Frontend (React SPA):**

* **Grant Creation:**
    * Dynamic form for adding multiple grants manually (`react-hook-form` with `useFieldArray`).
    * JSON file upload with client-side validation (Zod) and a confirmation step before submission.
    * Downloadable JSON template provided.
* **Grant Viewing:**
    * Displays grants in a paginated list.
    * Real-time filtering by grant name (debounced).
    * Interactive multi-select chip filter for tags (`react-select`).
* **User Feedback:** Clear loading states, success messages (including background task info), and error handling.
* **Routing:** Basic navigation between Home, View Grants, and Add Grants pages (`react-router-dom`).
* **Styling:** Consistent and modern UI styled with Tailwind CSS, following the Lasso branding theme.
* **Testing:** End-to-end tests using Cypress covering core user flows (manual add, JSON upload).

## Tech Stack

* **Backend:** Python 3, Flask, Flask-SQLAlchemy, Flask-Migrate, Flask-CORS, Marshmallow, Psycopg2, OpenAI Python Client, python-dotenv
* **Frontend:** React 19+, TypeScript, Vite, Tailwind CSS, react-router-dom, react-hook-form, Zod, react-select, lucide-react, pnpm
* **Database:** PostgreSQL
* **Testing:** Cypress (Frontend E2E)
* **Containerization:** Docker (for PostgreSQL)

## Architectural Decisions & Best Practices

This project was built with maintainability, scalability, and developer experience in mind, adhering to modern web development practices:

**Backend:**

* **Modular Structure (App Factory & Blueprints):** Instead of a single large file, the Flask app uses the Application Factory pattern and Blueprints. This promotes separation of concerns, makes configuration management easier (e.g., for testing vs. production), and improves code organization.
* **ORM & Migrations (SQLAlchemy & Flask-Migrate):** Using an ORM simplifies database interactions and improves security. Flask-Migrate provides robust schema version control, essential for evolving the database structure reliably over time without manual SQL scripts. A Many-to-Many relationship was used for grants and tags for efficient querying.
* **Standardized API Responses:** Implementing a consistent wrapper (`ApiResponse`, `Page`) for all endpoints makes the API predictable and simplifies frontend development, especially for handling loading states and errors. Global error handlers ensure even unexpected errors return structured JSON.
* **Background Task Processing (Threading):** Offloading the potentially time-consuming LLM tagging to a background thread (`threading.Thread`) ensures the API remains responsive. While libraries like Celery/RQ are more robust for heavy background work, Python's built-in threading provides a simpler solution suitable for this project's scope.
* **Configuration via Environment:** Sensitive information (database URL, API keys, secret key) and environment-specific settings (tagging method) are loaded from environment variables (`.env`), following the 12-Factor App principles.
* **Structured Logging:** Logging to `stdout` allows container orchestrators (like Docker, Kubernetes) to effectively manage and aggregate logs, crucial for observability in production.

**Frontend:**

* **TypeScript:** Enforces type safety, reducing runtime errors and improving code maintainability and refactoring capabilities.
* **Modern Tooling (Vite, pnpm):** Vite provides a fast development experience and optimized builds. pnpm offers efficient package management.
* **Component-Based Architecture:** Breaking down the UI into reusable components (e.g., `ManualGrantsForm`, `JsonUploadForm`, `TagSelector`, form inputs) improves organization and maintainability.
* **Separation of Concerns (Service/Repository Pattern):** API interaction logic is encapsulated within a service (`grantService`), making components cleaner and facilitating testing or swapping implementations (like the `LocalStorageGrantRepository` used during development).
* **Utility-First CSS (Tailwind CSS):** Allows for rapid UI development and ensures consistent styling without writing custom CSS files. Theming was applied based on the provided reference site.
* **Robust Form Handling (React Hook Form & Zod):** Manages complex form state efficiently (especially with dynamic fields), provides excellent performance, and integrates seamlessly with Zod for declarative and type-safe validation.
* **End-to-End Testing (Cypress):** Provides confidence that critical user flows work as expected. Tests use `data-testid` selectors where appropriate for resilience against UI refactoring.

## Running the Project

Detailed instructions for setting up and running the backend and frontend applications are located within their respective directories:

* **Backend Setup:** [`backend/README.md`](./backend/README.md)
* **Frontend Setup:** [`frontend/README.md`](./frontend/README.md)

**Quick Start:**

1.  Follow the setup instructions in `backend/README.md` to start the PostgreSQL database and the Flask API server.
2.  Follow the setup instructions in `frontend/README.md` to start the React development server.
3.  Access the application in your browser (typically `http://localhost:5173`).

## Testing

End-to-end tests for the frontend application are located in the `frontend/cypress/e2e` directory and can be run using the Cypress Test Runner. Refer to the `frontend/README.md` for instructions on how to execute them.

---

Thank you for the opportunity to complete this technical test. I focused on demonstrating not just the required functionality but also thoughtful design, clean code, and adherence to best practices relevant to building production-quality web applications.