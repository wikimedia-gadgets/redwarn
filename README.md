# redwarn-web

Wikipedia editing tool.

## For full documentation, bugs, features and more info, see [WP:REDWARN](https://en.wikipedia.org/wiki/WP:REDWARN) on Wikipedia

You can help! If you find any bugs or would like new features, you can fix these or add them yourself. More technical documentation is coming in the user guide soon to help ease this process.

#### Set up local development server for working on Redwarn

<details>
    <summary>System Requirements</summary>
    1) PHP installed (Preferably latest)<br>
    2) Internet connection (for wikipedia)<br>
    3) Git (preferably)<br>
</details>
<details>
    <summary>Set up development server</summary>
    1) Clone your code to your directory of choice with <code>git clone -b dev https://gitlab.com/redwarn/redwarn-web.git</code>. Alternatively, if you <i>really</i> don't want to install git, navigate to the 'dev' branch in gitlab and download it via zip (or preferred compressed file type) and extract it.<br>
    2) Have a terminal opened into redwarn-web from the directory you just cloned it in and run the command <code>php -S localhost:9696</code><br>
    3) Click [here](https://en.wikipedia.org/wiki/Special:MyPage/common.js) to go to your common.js file and create it if you have not already, making sure you do not have any other version of redwarn installed and removing it if so, add this line to your common.js: <code>mw.loader.load( 'http://localhost:9696/build.php' );</code><br>
    4) Refresh your wikipedia page by holding shift while refreshing (to force clear your page cache) and your version of redwarn should now be on the development branch!
</details>
