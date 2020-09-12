<?php
// RedWarn's very basic build tool
// (c) RedWarn contributors - https://gitlab.com/redwarn/redwarn-web
//
// USAGE: Run this in the terminal, or grab it as a web request.
//
// To output the built script into a file, run the follwing:
//
//     php build.php > redwarn.js
//

// ==== Part 1. Defining constants ====

$jsRoot = __DIR__ . DIRECTORY_SEPARATOR . "src" . DIRECTORY_SEPARATOR . "js";
$jsFiles = [
    'styles.js',
    'init.js',
    'dialog.js',
    'mdlContainer.js',
    'rules.js',
    'toast.js',
    'info.js',
    'rollback.js',
    'ui.js',
    'whodunnit.js',
    'pendingChanges.js',
    'multiAct.js',
    'quickTemplate.js',
    'pageProtect.js'
];

$htmlRoot = __DIR__ . DIRECTORY_SEPARATOR . "src" . DIRECTORY_SEPARATOR . "html";

$magicWords = [
	"BUILDINFO" =>
		"Build Time: " . date('d/m/Y H:i:s', time()) . "UTC" . PHP_EOL .
        "Excecuted script: " . str_replace("\\", "/", __FILE__) . PHP_EOL .
        "User: " . get_current_user() . '@'. gethostname() .' on '. php_uname('s')
];

// ==== Part 2. Function definitions ====

/**
 * Output the credits for RedWarn.
 **/
function getCredits() {
?>
R E D W A R N
(c) 2020 Ed. E and contributors - ed6767wiki (at) gmail.com
Licensed under the Apache License 2.0 - read more at https://gitlab.com/redwarn/redwarn-web/
<?php
}

/**
 * Output the notices for Wikipedia editors.
 **/
function getNotice() {
?>
+-------------------------------------------+
|                                           |
| ATTENTION ALL USERS WITH SCRIPT CHANGE    |
| PERMISSIONS                               |
|                                           |
| CHANGING THIS FILE WILL AFFECT MANY USERS |
| AND WILL BE REVERTED WHEN A NEW UPDATE    |
| IS RELEASED AS THIS FILE IS BUILT BY A    |
| SEPERATE SCRIPT. INSTEAD, ISSUE A PULL    |
| REQUEST AT                                |
| https://gitlab.com/redwarn/redwarn-web/   |
|                                           |
+-------------------------------------------+

To all normal users, if you wish to customise RedWarn, submit a request on the talk page or download source.
<?php
}

/**
 * Read a JavaScript file from the sources directory.
 *
 * @param $file string The filename to be used
 * @return false|string The contents of the requested JavaScript file.
 */
function readJSSourceFile($file) {
    global $jsRoot;

    return file_get_contents($jsRoot . DIRECTORY_SEPARATOR . $file);
}

/**
 * Process JavaScript includes and magic words.
 *
 * @param $fileContents string Raw executable JavaScript.
 * @return string The processed JavaScript code.
 **/
function processJS($fileContents) {
    return processMagicWords(
		processIncludedFiles(
			$fileContents
		)
	);
}

/**
 * Process JavaScript includes.
 *
 * @param $fileContents string The JavaScript code to be processed.
 * @return string The processed JavaScript code.
 **/
function processIncludedFiles($fileContents) {
    return preg_replace_callback(
		"#\[\[\[\[include (.+?)]]]]#",
		function ($matches) {
			global $htmlRoot;

			$filePath = $htmlRoot . DIRECTORY_SEPARATOR . $matches[1];

			return file_exists($filePath) ?
				file_get_contents($filePath) : "!!!! RedWarn Build Error: failed to include " . $matches[1]. " - if this is a release version of RedWarn, please report this error at WT:REDWARN !!!!";
		},
        $fileContents
	);
}

/**
 * Process magic words into their respective output values.
 *
 * @param $fileContents string The JavaScript code to be processed.
 * @return string The processed JavaScript code.
 **/
function processMagicWords($fileContents) {
	return preg_replace_callback(
		"#\[\[\[\[(\S+)]]]]#",
		function ($matches) {
			global $magicWords;
			if (isset($magicWords[$matches[1]]))
				return $magicWords[$matches[1]];
			else
				return $matches[0];
		},
        $fileContents
	);
}

/**
 * Outputs processed JavaScript from the loading list.
 **/
function getJSSources() {
    global $jsFiles;
    $js = "";

    foreach($jsFiles as $file) {
        $js .= readJSSourceFile($file) . PHP_EOL;
    }

    echo processJS($js);
}

/**
 * Outputs everything.
 */
function buildScript() {?>
/*
<?php getCredits(); ?>

<?php getNotice(); ?>
*/
// <nowiki>
<?php getJSSources(); ?>
$( document ).ready( function () {
	// Initialize RedWarn once the page is loaded.
	try {
		initRW();
	} catch (err) {
		mw.notify("Sorry, an error occured while loading RedWarn.");
		console.error(err);
	}
});
// </nowiki>
<?php
}

// ==== Part 3. Output ====

header("Content-Type: application/javascript; charset=utf-8");
buildScript();