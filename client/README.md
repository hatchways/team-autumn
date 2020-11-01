## How to use

I use Yarn rather than npm, but either works

1. Clone the repo

2. Navigate to ./team-autumn/client

3. yarn install / npm install

4. yarn start / npm run start

5. Should immediately be navigated to signup page when visiting 'localhost:3000' (should also automatically open your browser window to the appropriate page)

## Project Structure

- src
  - assets (we'll place styles, images, etc here)
  - components (reusable components that aren't a full page)
  - contexts (for storing different context objects)
  - hooks (custom hooks, if we use them)
  - pages (pages that will have their own routes)
  - util (utility functions that we might share across components)

## Dependencies

I am trying to work with as few dependencies as possible, but the key ones we need are:

- @material-ui (premade components)
- formik (forms)
- yup (form validation)
- draft-js (Rich text editor)
- papa parse (csv parsing)
- material-ui-dropzone (premade dropzone for file upload)
- react-hook-form (migrating all forms to formik, still around for some components I haven't updated yet)
- react-google-button (pre styled button for google auth)
