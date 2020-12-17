# Contributing to redwarn-web

## Developing RedWarn
### Making a submission to this repo

When pushing submissions to this repo we require that you make a seperate fork for you to make your modification on as you see fit then sent back via a merge request. We do however have some rules surrounding the formatting of your contribution.
    - All line endings *must* be LF.
    - Avoid applying unneccessesary beautificiation
    - Please provide a detailed reasoning for the reasons why code is removed/rewritten (ie: please link to an issue.)
    - If adding features, we use MDL + Material icons for redwarn-web.
    - Please test your changes and explain in detail the intended function of the changes you have made (save us all time)

### Setting up a development environment

You can contribute on any operating system, as long as you have PHP (and git, obviously) installed. Execute the following steps in whichever shell you prefer ([cmd](https://en.wikipedia.org/wiki/Cmd.exe), [PowerShell](https://en.wikipedia.org/wiki/PowerShell), [bash](https://en.wikipedia.org/wiki/Bash_%28Unix_shell%29), etc...)

1. Clone this repository to your computer.
```bash
git clone https://gitlab.com/redwarn/redwarn-web.git
```
2. Enter the directory of the cloned repository.
```bash
cd redwarn-web
```
3. On Wikipedia, disable the [active RedWarn version](https://en.wikipedia.org/wiki/User:RedWarn/.js) in your [`common.js`](https://en.wikipedia.org/wiki/Special:MyPage/common.js) (or the script for whichever skin you use) by removing or commenting the line which imports it.
4. Insert the following into your [`common.js`](https://en.wikipedia.org/wiki/Special:MyPage/common.js)
```js
mw.loader.load('http://localhost:9696/build.php');
```
5. In the directory of `redwarn-web`, run the following to start the PHP Web Server used to serve the RedWarn script.
```bash
php -S localhost:9696
```
5. Every time you edit a file, simply refresh the Wikipedia page and the changes you made will be immediately applied.
6. If you want to build a finished script for release, run the following.
```bash
php build.php > ./release/redwarn-web.js
```

<b>NOTE</b>: If you do not use the development server and instead decide to edit directly, RedWarn will not work. Elements will be missing, and the user interface will fail entirely. This is a common mistake made when editing RedWarn.

Happy contributing!

### Adding code from external sources.

If you add code from an external source/reuse code within Redwarn, please make sure it is compatible with RedWarn's Apache 2.0 License, and make it clear where you got the code from, as this will help us avoid licensing issues down the road.

## Issues and Features
### Bug Reporting

Report bugs via [the issue board](https://gitlab.com/redwarn/redwarn-web/-/issues) or through email [incoming+redwarn-redwarn-web-19374445-issue-@incoming.gitlab.com](mailto:incoming+redwarn-redwarn-web-19374445-issue-@incoming.gitlab.com) for more sensitive bugs. Please be detailed in your bug reports, as it will help us to locate the source of the bug and fix it as fast as possible.

**Great bug reports** tend to have:

- A quick summary and/or background
- A list of steps to reproduce
- An explanation of what you expected would happen
- A summary of what actually happens
- Additional notes (possibly including why you think this might be happening, or stuff you tried that didn't work)

You may use the provided issue templates, which will automatically create the backbone of a report based on these qualities.

### Feature proposals

Please propose your features via [the issue board](https://gitlab.com/redwarn/redwarn-web/-/issues), appending the issue with the 'feature' label, or via the [Wikipedia talk page](https://en.wikipedia.org/wiki/WT:RW). Please also be detailed in your proposal so we can determine whether it is feasible or should be implemented.
