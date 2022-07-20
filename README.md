# Home Library Service

1. run "git pull git@github.com:Tatyana404/nodejs2022Q2-service.git" and then open this repository;

2. run "git checkout containerization-docker";

3. rename .env.example to .env;

4. run "npm install";

5. run "docker compose up" to launch the application, then open localhost:4000/doc in the browser;

6. run "npm run scan:images" to check vulnerabilities in images (command may take several minutes to complete);

> The following requests are available in the application:

## Users

* GET /user - get all users;
* GET /user/:id - get single user by id;
* POST /user - create user:
{
  login: string;
  password: string
}; 
* PUT /user/:id - update user's password:
{
  oldPassowrd: string;
  newPassword: string;
};
* DELETE /user/:id - delete user;

## Tracks

* GET /track - get all tracks;
* GET /track/:id - get single track by id;
* POST /track - create new track:
{
  name: string;
  artistId: string | null;
  albumId: string | null;
  duration: number;
};
* PUT /track/:id - update track info, accepts the same fields object as when created;
* DELETE /track/:id - delete track;

## Artists

* GET /artist - get all artists;
* GET /artist/:id - get single artist by id;
* POST /artist - create new artist:
{
  name: string;
  grammy: boolean;
};
* PUT /artist/:id - update artist info, accepts the same fields object as when created;
* DELETE /artist/:id - delete album;

## Albums

* GET /album - get all albums
* GET /album/:id - get single album by id
* POST /album - create new album:
{
  name: string;
  year: number;
  artistId: string | null;
};
* PUT /album/:id - update album info, accepts the same fields object as when created;
* DELETE /album/:id - delete album

## Favorites

* GET /favs - get all favorites
* POST /favs/track/:id - add track to the favorites
* DELETE /favs/track/:id - delete track from favorites
* POST /favs/album/:id - add album to the favorites
* DELETE /favs/album/:id - delete album from favorites
* POST /favs/artist/:id - add artist to the favorites

## Prerequisites

- Git - [Download & Install Git](https://git-scm.com/downloads).
- Node.js - [Download & Install Node.js](https://nodejs.org/en/download/) and the npm package manager.

## Downloading

```
git clone {repository URL}
```

## Installing NPM modules

```
npm install
```

## Running application

```
npm start
```

After starting the app on port (4000 as default) you can open
in your browser OpenAPI documentation by typing http://localhost:4000/doc/.
For more information about OpenAPI/Swagger please visit https://swagger.io/.

## Testing

After application running open new terminal and enter:

To run all tests without authorization

```
npm run test
```

To run only one of all test suites

```
npm run test -- <path to suite>
```

To run all test with authorization

```
npm run test:auth
```

To run only specific test suite with authorization

```
npm run test:auth -- <path to suite>
```

### Auto-fix and format

```
npm run lint
```

```
npm run format
```

### Debugging in VSCode

Press <kbd>F5</kbd> to debug.

For more information, visit: https://code.visualstudio.com/docs/editor/debugging
