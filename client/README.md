## How to use

I use Yarn rather than npm

1. Clone the repo

2. Navigate to ./team-autumn/client

3. yarn install

4. yarn start

5. Should immediately be navigated to signup page when visiting 'localhost:3000' (should also automatically open your browser window to the appropriate page)

## Project Structure

- src
  - assets (we'll place styles, images, etc here)
  - components (reusable components that aren't a full page)
  - hooks (custom hooks, if we use them)
  - pages (pages that will have their own routes)
  - util (utility functions that we don't want constrained to the component level)

## Dependencies

I am trying to work with as few dependencies as possible, but the key ones we need are:

- @material-ui (for quickly building uniform components)
- react-hook-form (for managing forms)
