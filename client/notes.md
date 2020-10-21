## Page states

1. User views page for first time -> redirect to signup

- user = undefined
- localStorage.getItem('user') === null

2. user signs up

Three potential paths:

- success -> server responds with 201
- email in use -> server responds with 400
- invalid credentials -> server responds with 400
