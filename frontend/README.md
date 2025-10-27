# Grant Tagging System - Frontend

This README documents the steps necessary to set up and run the frontend application locally, as well as how to execute end-to-end tests.

## Prerequisites

1.  **Node.js:** Version `20.10.0` or higher is required. You can download it from [nodejs.org](https://nodejs.org/).
2.  **pnpm:** This project uses `pnpm` as the package manager. If you don't have it, install it globally (after installing Node.js):
    ```bash
    npm install -g pnpm
    ```

## Local Development Setup

1.  **Environment Variables:**

    - Copy the `.env.example` file to a new file named `.env`.
    - Update the variables in `.env` if necessary (e.g., `VITE_API_BASE_URL` should point to your running backend, typically `http://localhost:5000/api`).

2.  **Install Dependencies:**

    - Navigate to the `frontend` directory in your terminal.
    - Install the exact dependencies specified in the lockfile:
      ```bash
      pnpm install --frozen-lockfile
      ```

3.  **Run Development Server:**
    - Start the Vite development server:
      ```bash
      pnpm run dev
      ```
    - The application should now be running, usually at `http://localhost:5173` (or the next available port). Vite will show the exact URL in the terminal. **Keep this server running if you plan to run Cypress tests.**

## Running End-to-End Tests (Cypress)

1.  **Test Environment Variables:**

    - Create a new file named `.env.test` in the `frontend` directory.
    - Copy the contents of `.env.example` into `.env.test`.
    - **Important:** Adjust the variables in `.env.test` if your test environment requires different settings (e.g., a different API URL for a test backend). Usually, it can be the same as `.env` for local testing against the development backend.

2.  **Ensure Application is Running:**

    - Make sure your frontend development server is running. You should have executed `pnpm run dev` in a separate terminal.
    - Make sure your backend server is also running.

3.  **Open Cypress Test Runner:**
    - In a new terminal (in the `frontend` directory), run:
      ```bash
      pnpm run cy:open
      ```
    - This command will open the Cypress application, allowing you to select and run the end-to-end tests interactively.

## Adding Dependencies

- **To add a new runtime dependency:**
  ```bash
  # Example: pnpm add -E react-router-dom
  pnpm add -E <library-name>
  ```
- **To add a new development dependency:**
  ```bash
  # Example: pnpm add -E -D @types/react-router-dom
  pnpm add -E -D <library-name>
  ```
- **Notes:**
  - The `-E` flag ensures the exact version specified is added to `package.json`.
  - The `-D` flag saves the dependency under `devDependencies`.

## Building for Production

1.  **Generate Static Build:**

    - Run the build script:
      ```bash
      pnpm run build
      ```
    - This command will compile the React application and output the optimized static assets (HTML, CSS, JavaScript) into the `dist` folder.

2.  **Deployment:**
    - Deploy the contents of the `dist` folder to your static web hosting provider (e.g., Vercel, Netlify, AWS S3/CloudFront, Nginx, Apache).

---

## Code Quality Analysis (SonarQube - Optional)

To perform a static code analysis on your local machine using SonarQube:

1.  **Run SonarQube Container:**
    - Make sure you have Docker installed.
    - Start the SonarQube container:
      ```bash
      docker run -d --name sonarqube -e SONAR_ES_BOOTSTRAP_CHECKS_DISABLE=true -p 9000:9000 sonarqube:latest
      ```
2.  **Access SonarQube UI:**
    - Open [http://localhost:9000](http://localhost:9000) in your browser.
    - Log in with the default credentials:
      - **Username:** `admin`
      - **Password:** `admin`
      - You will be prompted to change the password on the first login.
3.  **Generate User Token:**
    - Navigate to **My Account** > **Security**.
    - Generate a new user token. Copy this token.
4.  **Configure Environment:**
    - Add the generated token to your local `.env` file:
      ```env
      SONAR_TOKEN=<paste_your_token_here>
      ```
5.  **Run Analysis Script:**
    - Execute the analysis script from the root of the `frontend` project:
      ```bash
      node sonarqube.js
      ```
    - The analysis results will be available in your local SonarQube instance at [http://localhost:9000](http://localhost:9000).
    - For more details, refer to the [official SonarQube documentation](https://docs.sonarsource.com/sonarqube/latest/try-out-sonarqube/).

---
