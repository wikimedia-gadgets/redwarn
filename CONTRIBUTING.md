# Contributing to redwarn-web

### Bug Reporting

Report bugs via [The issue board](https://gitlab.com/redwarn/redwarn-web/-/issues) or email [incoming+redwarn-redwarn-web-19374445-issue-@incoming.gitlab.com](mailto:incoming+redwarn-redwarn-web-19374445-issue-@incoming.gitlab.com) for more sensitive bugs. Please be detailed in your bug reports, as it will help us to locate the source of the bug and fix it as fast as possible!

**Great Bug Reports** tend to have:

- A quick summary and/or background
- Steps to reproduce
  - Be specific!
  - Give sample code if you can. [My stackoverflow question](http://stackoverflow.com/q/12488905/180626) includes sample code that *anyone* with a base R setup can run to reproduce what I was seeing
- What you expected would happen
- What actually happens
- Notes (possibly including why you think this might be happening, or stuff you tried that didn't work)

### Feature proposals

Please propose your features via [The issue board](https://gitlab.com/redwarn/redwarn-web/-/issues) and append them with the 'feature' label. Please also be detailed in your proposal so we can determine whether it is feasible or should be implemented.

### Adding code from external sources.

If you add code from an external source/reuse code within Redwarn, please make sure it falls under the (list licenses) license, and make it clear where you have got the code from, this will help us avoid licensing issues down the road.

### Making a submission to this repo

When pushing submissions to this repo we require that you make a seperate fork for you to make your modification on as you see fit then sent back via a merge request. We do however have some rules surrounding the formatting of your contribution.
    - All line endings *must* be LF.
    - Avoid applying unneccessesary beautificiation
    - Please provide a detailed reasoning for the reasons why code is removed/rewritten (ie: please link to an issue.)
    - If adding features, we use MDL + Material icons for redwarn-web.
    - Please test your changes and explain in detail the intended function of the changes you have made (save us all time)

### Setting up a development environment

You can contribute on any operating system. Your help is greatly appreciated.

<details>
    <summary>Dependencies</summary>
    <li>
    You need PHP installed.
    </li>
</details>

0. Clone this repo to your computer (`git clone https://gitlab.com/redwarn/redwarn-web.git`)
1. Navigate to the directory redwarn-web is in.
3. Make sure your [common.js](https://en.wikipedia.org/wiki/Special:MyPage/common.js) has the production Redwarn disabled (either by removed or commented out) and append `mw.loader.load('http://localhost:9696/build.php')` to your [common.js](https://en.wikipedia.org/wiki/Special:MyPage/common.js).
4. In the directory of redwarn-git run `php -S localhost:9696` to start the dev server.
5. Happy contributing! Every time you save a file, simply refresh your page and the changes you made will be immediately visible.
6. If you want to build a finished script, run `php build.php > ./release/redwarn-web.js`.

<b>IMPORTANT</b>: if you do not use the dev server and instead decide to edit directly, RW will not work direct from source. Elements will be missing, especially in the UI. This is a common mistake made when editing RedWarn.

