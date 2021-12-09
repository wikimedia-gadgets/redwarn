<?php
// Copyright 2020 The RedWarn Development Team
// 
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
// 
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

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

define("DEBUG_MODE", php_sapi_name() == 'cli-server'); // enable debug mode if we are running in a development server

$jsRoot = __DIR__ . DIRECTORY_SEPARATOR . "src" . DIRECTORY_SEPARATOR . "js";
$jsFiles = [
    'styles.js',
    'init.js',
    'topIcons.js',
    'dialog.js',
    'mdlContainer.js',
    'rules.js',
    'toast.js',
    'info.js',
    'rollback.js',
    'ui.js',
    'pendingChanges.js',
    'multiAct.js',
    'quickTemplate.js',
    'pageProtect.js',
    'firstTimeSetup.js',
    'preferences.js',
    'campaigns.js'
];

if (DEBUG_MODE) array_push($jsFiles, "debug.js"); // add debug if in debug mode

$htmlRoot = __DIR__ . DIRECTORY_SEPARATOR . "src" . DIRECTORY_SEPARATOR . "html";

$magicWords = [
    "BUILDINFO" =>
        "Build Time: " . date('d/m/Y H:i:s', time()) . "UTC" . PHP_EOL .
        "Excecuted script: " . str_replace("\\", "/", __FILE__) . PHP_EOL .
        "User: " . get_current_user() . '@'. gethostname() .' on '. php_uname('s'),
    "DEBUG" => DEBUG_MODE
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

(c) 2020-2021 The RedWarn Development Team and contributors - tools.redwarn@toolforge.org or [[WT:RW]]
Licensed under the Apache License 2.0 - read more at https://www.apache.org/licenses/LICENSE-2.0.txt

-----------------------------------------------------------------------------
Copyright 2020-2021 The RedWarn Development Team

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

Notice for on-wiki versions:
Compiled on-wiki versions are made available on Wikimedia projects under the
Creative Commons Attribution-ShareAlike 3.0 Unported License, sublicensed from
the source code's Apache License 2.0.
-----------------------------------------------------------------------------

<?php
}

/**
 * Output the notices for Wikipedia editors.
 **/
function getNotice() {
?>
+---------------------------------------------------+
|                                                   |
|     ATTENTION ALL USERS WITH SCRIPT CHANGE        |
|     PERMISSIONS                                   |
|                                                   |
|     CHANGING THIS FILE WILL AFFECT MANY USERS     |
|     AND WILL BE REVERTED WHEN A NEW UPDATE        |
|     IS RELEASED AS THIS FILE IS BUILT BY A        |
|     SEPERATE SCRIPT. INSTEAD, ISSUE A PULL        |
|     REQUEST AT                                    |
|                                                   |
|     https://gitlab.com/redwarn/redwarn-web/       |
|                                                   |
+---------------------------------------------------+

To all normal users, if you wish to customise RedWarn, submit a request on the talk page or download source.
<?php
}

// Minification


/**
 * @see https://gist.github.com/Rodrigo54/93169db48194d470188f
 */
function minify_css($input) {
    if (DEBUG_MODE) return $input; // disable if in debug mode for debugging ease
    if(trim($input) === "") return $input;
    return preg_replace(
        array(
            // Remove comment(s)
            '#("(?:[^"\\\]++|\\\.)*+"|\'(?:[^\'\\\\]++|\\\.)*+\')|\/\*(?!\!)(?>.*?\*\/)|^\s*|\s*$#s',
            // Remove unused white-space(s)
            '#("(?:[^"\\\]++|\\\.)*+"|\'(?:[^\'\\\\]++|\\\.)*+\'|\/\*(?>.*?\*\/))|\s*+;\s*+(})\s*+|\s*+([*$~^|]?+=|[{};,>~]|\s(?![0-9\.])|!important\b)\s*+|([[(:])\s++|\s++([])])|\s++(:)\s*+(?!(?>[^{}"\']++|"(?:[^"\\\]++|\\\.)*+"|\'(?:[^\'\\\\]++|\\\.)*+\')*+{)|^\s++|\s++\z|(\s)\s+#si',
            // Replace `0(cm|em|ex|in|mm|pc|pt|px|vh|vw|%)` with `0`
            '#(?<=[\s:])(0)(cm|em|ex|in|mm|pc|pt|px|vh|vw|%)#si',
            // Replace `:0 0 0 0` with `:0`
            '#:(0\s+0|0\s+0\s+0\s+0)(?=[;\}]|\!important)#i',
            // Replace `background-position:0` with `background-position:0 0`
            '#(background-position):0(?=[;\}])#si',
            // Replace `0.6` with `.6`, but only when preceded by `:`, `,`, `-` or a white-space
            '#(?<=[\s:,\-])0+\.(\d+)#s',
            // Minify string value
            '#(\/\*(?>.*?\*\/))|(?<!content\:)([\'"])([a-z_][a-z0-9\-_]*?)\2(?=[\s\{\}\];,])#si',
            '#(\/\*(?>.*?\*\/))|(\burl\()([\'"])([^\s]+?)\3(\))#si',
            // Minify HEX color code
            '#(?<=[\s:,\-]\#)([a-f0-6]+)\1([a-f0-6]+)\2([a-f0-6]+)\3#i',
            // Replace `(border|outline):none` with `(border|outline):0`
            '#(?<=[\{;])(border|outline):none(?=[;\}\!])#',
            // Remove empty selector(s)
            '#(\/\*(?>.*?\*\/))|(^|[\{\}])(?:[^\s\{\}]+)\{\}#s'
        ),
        array(
            '$1',
            '$1$2$3$4$5$6$7',
            '$1',
            ':0',
            '$1:0 0',
            '.$1',
            '$1$3',
            '$1$2$4$5',
            '$1$2$3',
            '$1:0',
            '$1$2'
        ),
    $input);
}

/**
 * @see https://gist.github.com/Rodrigo54/93169db48194d470188f
 */
function minify_html($input) {
    if (DEBUG_MODE) return $input; // disable if in debug mode for debugging ease
    if(trim($input) === "") return $input;
    // Remove extra white-space(s) between HTML attribute(s)
    $input = preg_replace_callback('#<([^\/\s<>!]+)(?:\s+([^<>]*?)\s*|\s*)(\/?)>#s', function($matches) {
        return '<' . $matches[1] . preg_replace('#([^\s=]+)(\=([\'"]?)(.*?)\3)?(\s+|$)#s', ' $1$2', $matches[2]) . $matches[3] . '>';
    }, str_replace("\r", "", $input));
    // Minify inline CSS declaration(s)
    if(strpos($input, ' style=') !== false) {
        $input = preg_replace_callback('#<([^<]+?)\s+style=([\'"])(.*?)\2(?=[\/\s>])#s', function($matches) {
            return '<' . $matches[1] . ' style=' . $matches[2] . minify_css($matches[3]) . $matches[2];
        }, $input);
    }
    if(strpos($input, '</style>') !== false) {
      $input = preg_replace_callback('#<style(.*?)>(.*?)</style>#is', function($matches) {
        return '<style' . $matches[1] .'>'. minify_css($matches[2]) . '</style>';
      }, $input);
    }

    return preg_replace(
        array(
            // t = text
            // o = tag open
            // c = tag close
            // Keep important white-space(s) after self-closing HTML tag(s)
            '#<(img|input)(>| .*?>)#s',
            // Remove a line break and two or more white-space(s) between tag(s)
            '#(<!--.*?-->)|(>)(?:\n*|\s{2,})(<)|^\s*|\s*$#s',
            '#(<!--.*?-->)|(?<!\>)\s+(<\/.*?>)|(<[^\/]*?>)\s+(?!\<)#s', // t+c || o+t
            '#(<!--.*?-->)|(<[^\/]*?>)\s+(<[^\/]*?>)|(<\/.*?>)\s+(<\/.*?>)#s', // o+o || c+c
            '#(<!--.*?-->)|(<\/.*?>)\s+(\s)(?!\<)|(?<!\>)\s+(\s)(<[^\/]*?\/?>)|(<[^\/]*?\/?>)\s+(\s)(?!\<)#s', // c+t || t+o || o+t -- separated by long white-space(s)
            '#(<!--.*?-->)|(<[^\/]*?>)\s+(<\/.*?>)#s', // empty tag
            '#<(img|input)(>| .*?>)<\/\1>#s', // reset previous fix
            '#(&nbsp;)&nbsp;(?![<\s])#', // clean up ...
            '#(?<=\>)(&nbsp;)(?=\<)#', // --ibid
            // Remove HTML comment(s) except IE comment(s)
            '#\s*<!--(?!\[if\s).*?-->\s*|(?<!\>)\n+(?=\<[^!])#s'
        ),
        array(
            '<$1$2</$1>',
            '$1$2$3',
            '$1$2$3',
            '$1$2$3$4$5',
            '$1$2$3$4$5$6$7',
            '$1$2$3',
            '<$1$2',
            '$1 ',
            '$1',
            ""
        ),
    $input);
}

// Processing functions
$included = array(); // Included files

/**
 * Check if a string ends with a given string
 * @param $haystack The string to check.
 * @param $needle The string being searched for.
 * @return boolean Whether or not the needle is in the haystack.
 */
function endsWith($haystack, $needle) {
    return substr_compare($haystack, $needle, -strlen($needle)) === 0;
}

/**
 * Read a JavaScript file from the sources directory.
 *
 * @param $file string The filename to be used
 * @return false|string The contents of the requested JavaScript file.
 */
function readJSSourceFile($file) {
    global $jsRoot;
    
    // if (DEBUG_MODE) {
    //     $finalJS = "";
    //     foreach (explode(
    //         "\n", 
    //         str_replace("\r\n", "\n", file_get_contents($jsRoot . DIRECTORY_SEPARATOR . $file))
    //     ) as $i => $val)
    //         $finalJS .= "/* " . $i . " */ " . $val . PHP_EOL;
    //     return $finalJS ;
    // } else {
        return file_get_contents($jsRoot . DIRECTORY_SEPARATOR . $file);
    //}
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
 * Writes the Object of included files. Required for normal operation.
 * Always place this at the very top, before the actual RedWarn code.
 */
function createIncludedFileObject() {
    global $included;
    echo "var rw_includes = " . json_encode($included) . ";" . PHP_EOL;
}

/**
 * Process JavaScript includes.
 *
 * @param $fileContents string The JavaScript code to be processed.
 * @return string The processed JavaScript code.
 **/
function processIncludedFiles($fileContents) {
    return preg_replace_callback(
        "#['\"`](?:\s|\\n)*\[\[\[\[include (.+?)]]]](?:\s|\\n)*['\"`]#",
        function ($matches) {
            global $htmlRoot, $warnings, $included;

            $file = $matches[1];
            $filePath = $htmlRoot . DIRECTORY_SEPARATOR . $file;

            if (!file_exists($filePath)) {
                array_push($warnings, "Failed to include \"" . $file . "\". File does not exist.");
                return "";
            } else {
                if (!isset($included[$file])) {
                    if (endsWith($file, "html")) {
                        // $included[$file] = "`" . minify_html(file_get_contents($filePath)) . "`";
                        $included[$file] = "`" . file_get_contents($filePath) . "`";
                    } else {
                        if (endsWith($file, "css"))
                            $included[$file] = minify_css(file_get_contents($filePath));
                        else $included[$file] = file_get_contents($filePath);
                    }
                }
                
                if (endsWith($file, "html")) {
                    return "eval(rw_includes[\"" . $file . "\"])";
                } else {
                    return "rw_includes[\"" . $file . "\"]";
                }
            }
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
    global $jsRoot, $jsFiles, $warnings;
    $js = "";

    foreach($jsFiles as $file) {
        if (!file_exists($jsRoot . DIRECTORY_SEPARATOR . $file)) {
            array_push($warnings, "Failed to include source file \"" . $file . "\". File does not exist.");
            return "";
        } else
            $js .= 
                "// rw-source: " . $file . PHP_EOL .
                readJSSourceFile($file) . PHP_EOL;
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
// ======================== BEGIN DEPENDENCIES ========================
<?php echo createIncludedFileObject(); ?>
// ========================= END DEPENDENCIES =========================
// ========================== BEGIN REDWARN ===========================
<?php echo $sources; ?>
// =========================== END REDWARN ============================
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