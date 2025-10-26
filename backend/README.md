# Grant Tagging System - Backend

This README document outlines the steps necessary to get the backend application up and running locally.

### What is this repository for?

This is a repository for a technical test project – a Grant Tagging System using Flask and PostgreSQL.

### Local Setup

1.  **Environment Variables:**
    * Copy the `.env.example` file to a new file named `.env`.
    * Update the variables in `.env` with your specific configuration (database credentials, API keys, etc.).

2.  **Database Setup:**
    * Ensure you have Docker installed.
    * Start the PostgreSQL database container using Docker Compose:
        ```bash
        docker compose -f docker-compose.local-dev.yaml up -d
        ```
    * **Important:** You might need to wait a few seconds for the database to initialize fully before proceeding.

3.  **Install `uv` (Python Package Manager):**
    * If you don't have `uv` installed, run:
        ```bash
        pip install uv
        # or use your preferred method like pipx, brew, etc.
        ```

4.  **Create and Activate Virtual Environment:**
    * Create a virtual environment:
        ```bash
        uv venv
        ```
    * Activate the virtual environment:
        * **PowerShell (Windows):**
            ```powershell
            .venv\Scripts\Activate.ps1
            ```
        * **Bash/Zsh (Linux/macOS):**
            ```bash
            source .venv/bin/activate
            ```

5.  **Install Dependencies:**
    * Install the exact dependencies listed in the lock file:
        ```bash
        uv pip install -r requirements.lock.txt
        ```

6.  **Database Migrations:**
    * Initialize the database tables using Flask-Migrate. **Run these commands only the first time or after deleting the database.**
        ```bash
        # Initialize migrations directory (only needed once per project)
        flask db init 
        
        # Create the initial migration script based on your models
        flask db migrate -m "Initial database schema"
        
        # Apply the migration to create tables in the database
        flask db upgrade 
        ```
    * **Note:** If you later change your database models (`models.py`), you will need to run `flask db migrate -m "Description of changes"` and `flask db upgrade` again.

7.  **Run the Application:**
    * Start the Flask development server:
        ```bash
        flask run
        ```
    * The application should now be running (usually at `http://127.0.0.1:5000`).

8.  **Testing Endpoints:**
    * You can test the API endpoints using the `.http` files located in the `rest-client` folder.
    * Make sure you have the **REST Client** VSCode extension installed.

### Contribution Guidelines

* **REST Client:** If you add or modify an API endpoint, please update or add a corresponding example request in the `rest-client` folder.
* **Commit Messages:** Please follow the Conventional Commits format. You can find the specification here: [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/)
* **Dependency Management:**
    1.  To add a new direct dependency, add it to `requirements.txt` (preferably with a version specifier, e.g., `requests=2.28`).
    2.  Update the lock file (`requirements.lock.txt`) by running:
        ```bash
        uv pip compile requirements.txt -o requirements.lock.txt
        ```
    3.  Make sure your virtual environment reflects the lock file:
        ```bash
        uv pip sync requirements.lock.txt
        ```
    4.  Commit *both* `requirements.txt` and `requirements.lock.txt`.

### Recommended VSCode Extensions

* **REST Client:** For testing API endpoints directly from VSCode.
* **Python (ms-python.python):** Core Python language support.
* **Pylance (ms-python.vscode-pylance):** Enhanced IntelliSense, type checking, etc.
* **Python Debugger (ms-python.debugpy):** Debugging support.
* **Black Formatter (ms-python.black-formatter):** Automatic code formatting.