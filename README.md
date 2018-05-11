# MetaGenScope Client

> MetaGenScope client web application.

## Getting Started

`metagenscope-client` is run as part of [`metagenscope-main`](https://github.com/longtailbio/metagenscope-main).

### Running

To run the app in the development mode, first set the backend URL:

```sh
$ export REACT_APP_METAGENSCOPE_SERVICE_URL=http://127.0.0.1:5000
```

Make sure you have installed Typings dependencies (TypeScript definitions):

```sh
$ npm install typings -g
$ typings install
```

Then run the app:

```sh
$ npm start
```

Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.

You will also see any lint errors in the console.

## Development

Developer documentation can be found in [`docs/`](./docs/).

MetaGenScope uses the GitFlow branching strategy along with Pull Requests for code reviews. Check out [this post](https://devblog.dwarvesf.com/post/git-best-practices/) by the Dwarves Foundation for more information.

This project uses JSDoc, see their [Getting Started](http://usejsdoc.org/about-getting-started.html) page if you are unfamilair.

### Project Structure

This project follows the Component Folder Pattern. A good overview of the pattern can be found [here](https://medium.com/@alexmngn/how-to-better-organize-your-react-applications-2fd3ea1920f1).

## Contributing

Please read [`CONTRIBUTING.md`](CONTRIBUTING.md) for details on our code of conduct, and the process for submitting pull requests to us.

## Versioning

We use [SemVer](http://semver.org/) for versioning. For the versions available, see the [tags on this repository][project-tags].

## Release History

See [`CHANGELOG.md`](CHANGELOG.md).

## Authors

* **Benjamin Chrobot** - _Initial work_ - [bchrobot](https://github.com/bchrobot)

See also the list of [contributors][contributors] who participated in this project.

## License

This project is licensed under the MIT License - see the [`LICENSE.md`](LICENSE.md) file for details.


[project-tags]: https://github.com/longtailbio/metagenscope-client/tags
[contributors]: https://github.com/longtailbio/metagenscope-client/contributors
