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
    'static.js',
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

// Warnings
$warnings = array();

function getWarnings() {
    global $warnings;

    if (count($warnings) != 0) {
?>
/*

 [ W A R N I N G ]

 Some issues were encountered while building `redwarn.js`. Please take
 note of these as it may negatively impact your usage.

<?php foreach ($warnings as $v) echo " - " . $v . PHP_EOL; ?>

*/
<?php
    }
}

/**
 * Output the credits for RedWarn.
 **/
function getCredits() {
?>

RedWarn - Recent Edits Patrol and Warning Tool
The user-friendly Wikipedia counter-vandalism tool.

(c) 2020 The RedWarn Development Team and contributors - ed6767wiki (at) gmail.com or [[WT:RW]]
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
|                                           |
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
			global $htmlRoot, $warnings;

			$filePath = $htmlRoot . DIRECTORY_SEPARATOR . $matches[1];

            array_push($warnings, "Deprecated HTML inclusion call used: \"" . $matches[0] . "\".");

            if (!file_exists($filePath)) {
                array_push($warnings, "Failed to include " . $matches[1] . ". File does not exist.");
                return "";
            } else
                return file_get_contents($filePath);
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

    return processJS($js);
}

$sources = getJSSources();

/**
 * Outputs everything.
 */
function buildScript() {
    global $sources; ?>
<?php getWarnings(); ?>
/*
<?php getCredits(); ?>

<?php getNotice(); ?>
*/
// <nowiki>
<?php echo $sources; ?>
$(document).ready(async function() {
	// Initialize RedWarn once the page is loaded.
	try {
		await initRW();
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