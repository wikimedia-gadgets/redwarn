# Contributing
You can contribute on any operating system. Your help is greatly appreciated.
0. Ensure you have php installed
1. Clone this repo to your computer - either download ZIP or `git clone https://gitlab.com/redwarn/redwarn-web.git`
2. cd to the directory you cloned to
3. Open init.js <b>and distingush that you are working on this version of RedWarn.</b> Modify rw.version (use Ctrl-F to locate) to distingush this. It is also recommended that you do not use the "rev" prefix unless you are working on an official build and not a fork.  
4. Type `php -S localhost:9696` into a to start the dev server
5. Add `mw.loader.load( 'http://localhost:9696/build.php' );` to your common.js file (ensure release RedWarn is disabled!)
6. Happy editing! Every time your file is saved, you can refresh and your changes will be immediately applied.

<b>Please note</b>: if you do not use the dev server and instead decide to edit directly, RW will not work direct from source. Elements will be missing, especially in the UI. This is a common mistake made when editing RedWarn.
