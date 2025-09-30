# meita-documents-and-media

## Kuvaus toiminnasta

Meita documents and media block is for showing either Google bucket files or medialibrary files in WordPress.

### How to release

We are using Yarn. Yarn settings need to be:
version-git-tag: true
version-commit-hooks: true

You can check this with `yarn config list` and change with `yarn config set version-git-tag true`.

1. Push all the changes you want to be in new release to Git.
2. Change version and trigger cloudbuild : `yarn version`.

### Build and Development build

This plugin uses `yarn` for build. Do not use NPM!

First time, run `yarn` and then:

```bash
yarn start
```

Which watches `src` folder for changes and builds development version automatically into `build` folder.

if you want only build

```bash
yarn build
```

### Php Documentation

`yarn phpdoc` builds php documentations into `src/.phpdoc`. After that `yarn openphpdoc` open generated php documentation into your browser.

See `package.json` for other commands.

### Deploy new version into Meita plugin repository

1. Commit and push your changes to Github
2. Run `yarn version`, which will:
   1. Ask to Change package.json version number. Write a new version number.
   2. It will then add new version number into Git as new tag.
   3. It will then push the new tag into Git
   4. Google Cloudbuild triggers build when new tag is present.
   5. Cloudbuild will build the plugin package and replace meita-contacts-integration.php Wordpress plugin comment version with the new tag from Git.
   6. Lastly Cloudbuild will create zip of the plugin and save it to Meita plugin registry.

### **Connecting to Docker-Compose**

Connect the `/dist` or `/build` folder of this project to the `wp-content/plugins` folder of the Docker container.

In the `docker-compose.yml` file, you can do this by adding the local location of Wordpress under `volumes` and the location of the plugin inside the container, separated by `:`.

`-/wp-oman-pluginin-nimi/dist:/var/www/html/wp-content/plugins/wp-oman-pluginin-nimi`

Example:

      wordpress:
        volumes:
            - ../meita-documents-and-media/dist:/var/www/html/wp-content/plugins/meita-documents-and-media

## Vikatilanteessa

Ota yhteys vastuuhenkilöihin
