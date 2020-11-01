## How to use

We are using pipenv, but any venv package should work

1. Clone the repo

2. Navigate to ./team-autumn/server

3. pipenv run pipenv install

4. pipenv run flask run

5. Should get a message that server is running

## Project Structure

- api (all of our routes and utilities are stored here)
  - handlers (auth, campaign, gmail_auth, prospect, register) - each handler is responsible for specific feature's routes
  - util.py (various utilities shared across different handlers)
  - error_code.py (stores various error messages for http responses)
- db
  - model.py (currently stores all of our models, but might split in the future)
- test
  - tests for each endpoint and model

## Dependencies

We are trying to work with as few dependencies as possible, but the key ones we need are:

- flask (web framework)
- pymodm (python mongodb orm implementation)
- flask-bcrypt (security)
- pymongo (connections for mongodb)
- flask-jwt-extended (we are using jwt authentication)
- jsonschema (schema validation)
- python-dotenv (for working with .env files)
- google-auth-oauthlib (for google oauth)
- google-auth (auth with google)
