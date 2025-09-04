# Introduction

This REST API is based on the specs provided in the backend developer roadmap: https://roadmap.sh/projects/url-shortening-service

To run and test the API:
1. Install node 20+ and have docker running
2. Create a .envrc file and follow the suggested env variables from the `.envrc.example` file provided.
3. Clone the git repo
4. Run `docker-compose up` to get the postgres and redis containers up
5. Run the command `npm run dev`

Note that because I use .envrc file here and not a .env file, you may need to export them however you see fit. Personally, I used the `direnv` shell extension to make it easy for me.
