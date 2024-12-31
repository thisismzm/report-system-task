## Run project
create a copy from `.env.example` to `.env` then run the following command:
`docker compose --profile="dev" up --build`

### Run tests
`docker compose --profile="test" run --rm app-dev npm run test`

## Notes about sending daily emails
Daily emails will log in console
