# Backend

This README document the steps necessary to get the application up and running.

### What is this repository for?

This is a repository for a techinal test

### Set up in local machine

Create a `.env` file and paste the content of `.env.example`.

Create the PostgreSQL database with:

```bash
docker compose -f docker-compose.local-dev.yaml up -d
```

Install uv:

```
pip install uv
```

Create virtual environment with uv:

```bash
uv venv
```

Activate virtual environment:

```bash
.venv\Scripts\Activate.ps1
```

Install dependencies with:

```bash
uv pip install -r requirements.lock.txt
```

Run the application with:

```bash
flask run
```

You can test the endpoints using the files in the folder `rest-client`. Just make sure you have the VSCode extension: REST Client

### Contribution guidelines

If you add a new endpoint, you must add an example of use in the folder `rest-client`

The commit messages must follow the Conventional Commits format of the following link:
[The Conventional Commits Standard for Writing Git Commit Messages](https://docs.bigtomcat.com/en/posts/git/Git%20Commits)

If you add new dependencies you have to update `requirements.lock.txt` with this command:
```bash
uv pip freeze > requirements.lock.txt
```

Also, add the new dependency with exact version in `requirements.txt`

### VSCode Extentions:

- REST Client
- Pylance
- Python
- Python Debugger
- Python Environments
- Black Formatter
