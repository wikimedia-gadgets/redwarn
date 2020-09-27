# Contributing to redwarn-web

## Bug Reporting

You can report bugs through [the issue tracker](https://gitlab.com/redwarn/redwarn-web/-/issues) or through email at [incoming+redwarn-redwarn-web-19374445-issue-@incoming.gitlab.com](mailto:incoming+redwarn-redwarn-web-19374445-issue-@incoming.gitlab.com) for sensitive bugs (like security issues.) Please be detailed in your bug reports, as it will help us to locate the source of the bug and fix it as fast as possible!

**Good bug reports** tend to have:
- A quick summary and/or background of what you were doing that led to the bug,
- The steps in order to reproduce the bug (if you know),
  - Be as specific as possible.
  - Provide screenshots of the issue if you can.
- What you expected would happen had the bug not happened,
- What happened instead of what you expected,
- Extra ideas, like what you tried to fix the issue or why you think the bug might be happening.

## Feature proposals

You can propose new features through [the issue tracker](https://gitlab.com/redwarn/redwarn-web/-/issues) and append them with the 'feature' label. Please also be detailed in your proposal so we can determine whether it is feasible or should be implemented.

## Adding code from external sources.

If you add code from an external source/reuse code within Redwarn, please make sure that it is compatible with the Apache License 2.0, and make it clear where you got the code from as this will help us avoid licensing issues.

## Making a submission to this repo

When pushing submissions to this repo we require that you make a seperate fork for you to make your modification on as you see fit then sent back via a merge request. We do however have some rules surrounding the formatting of your contribution:
- Do not change the line endings.
- Avoid applying unneccessesary beautificiation.
- Please provide a detailed reasoning for the reasons behind your changes (or leave a link to the issue.)
- When making UI changes, please use [Material Design Lite](https://getmdl.io) components. 
- Please test your changes and explain in detail the intended function of the changes you have made.

## Setting up RedWarn

RedWarn is built through [Webpack](https://webpack.js.org), a module bundler that allows us to easily build frontend code. Aside from that, RedWarn uses [tsx-dom](https://github.com/Lusito/tsx-dom) in order to build the interface. Contrary to React, tsx-dom generates usable HTMLElements directly from JSX. This keeps our total file size low and build times even lower. Aside from that, we can modify the DOM with JSX like we would normally do if we were using `document.createElement`.

### For development

   
### For production
1. Install the required dependencies with `npm`.
   ```shell script
   npm install
   ```
2. Bundle everything with `webpack` using the `build` task.
   ```shell script
   npm run build
   ```
3. The built copy of RedWarn will be in `/build`. You can then put this on Wikipedia as a userscript like how we distribute RedWarn, or put it on a locally-hosted web server and import it from there.