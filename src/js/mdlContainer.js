/**
* mdlContainers generates both HTML and blob containing all the libaries needed within RedWarn's dialog user interface
*
* @class mdlContainers
*/
// NOTICE: All cross-domain addresses in containers MUST BE ABSOLUTE (i.e https:// rather than //)
var mdlContainers = {
    /**
     * Appends the required themed script, link and style tags to the body HTML provided.
     * @method generateHtml
     * @param {string} innerContent HTML body
     * @return {string} HTML content
     * @extends mdlContainers
     */
    "generateHtml" : innerContent => {

        let content = `
        <script src="https://redwarn.toolforge.org/cdn/js/jQuery.js"></script>
        <link href="https://tools-static.wmflabs.org/fontcdn/css?family=Roboto:100,100italic,300,300italic,400,400italic,500,500italic,700,700italic,900,900italic&subset=cyrillic,cyrillic-ext,greek,greek-ext,latin,latin-ext,vietnamese" rel="stylesheet">
        <link rel="stylesheet" href="https://redwarn.toolforge.org/cdn/css/materialicons.css">
        <script defer src="https://redwarn.toolforge.org/cdn/js/mdl.js"></script>
        <script src="https://redwarn.toolforge.org/cdn/js/dialogPolyfill.js"></script> <!-- firefox being dumb -->
        `;
        
        // Themes
        let theme = "";
        if (rw.config.colTheme){
            theme = rw.config.colTheme;
        } else {
            theme = "blue-indigo"; // default theme
        }
        
        content += `
        <link rel="stylesheet" href="https://redwarn.toolforge.org/cdn/css/material.${theme}.min.css" />
        <!-- Material dropdown - MIT License, Copyright (c) 2016 CreativeIT https://github.com/CreativeIT/getmdl-select/blob/master/LICENSE.txt -->
        <style>
        .getmdl-select{outline:none}.getmdl-select .mdl-textfield__input{cursor:pointer}.getmdl-select .selected{background-color:#ddd}.getmdl-select .mdl-icon-toggle__label{float:right;margin-top:-30px;color:rgba(0,0,0,0.4);transform:rotate(0);transition:transform 0.3s}.getmdl-select.is-focused .mdl-icon-toggle__label{color:#3f51b5;transform:rotate(180deg)}.getmdl-select .mdl-menu__container{width:100% !important;margin-top:2px}.getmdl-select .mdl-menu__container .mdl-menu{width:100%}.getmdl-select .mdl-menu__container .mdl-menu .mdl-menu__item{font-size:16px}.getmdl-select__fix-height .mdl-menu__container .mdl-menu{overflow-y:auto;max-height:288px !important}.getmdl-select__fix-height .mdl-menu.mdl-menu--top-left{bottom:auto;top:0}
        </style>
        <script defer>
            "use strict";!function(){function e(){getmdlSelect.init(".getmdl-select")}window.addEventListener?window.addEventListener("load",e,!1):window.attachEvent&&window.attachEvent("onload",e)}();var getmdlSelect={_defaultValue:{width:300},_addEventListeners:function(e){var t=e.querySelector("input"),n=e.querySelector('input[type="hidden"]'),l=e.querySelectorAll("li"),a=e.querySelector(".mdl-js-menu"),o=e.querySelector(".mdl-icon-toggle__label"),i="",c="",s="",u=!1,d=function(o){var i=o.textContent.trim();if(t.value=i,l.forEach(function(e){e.classList.remove("selected")}),o.classList.add("selected"),e.MaterialTextfield.change(i),setTimeout(function(){e.MaterialTextfield.updateClasses_()},250),n.value=o.dataset.val||"",c=t.value,s=n.value,"createEvent"in document){var u=document.createEvent("HTMLEvents");u.initEvent("change",!1,!0),a.MaterialMenu.hide(),t.dispatchEvent(u)}else t.fireEvent("onchange")},r=function(){u=!1,t.value=c,n.value=s,e.querySelector(".mdl-menu__container").classList.contains("is-visible")||e.classList.remove("is-focused");var l=document.querySelectorAll(".getmdl-select .mdl-js-menu");[].forEach.call(l,function(e){e.MaterialMenu.hide()});var o=new Event("closeSelect");a.dispatchEvent(o)};document.body.addEventListener("click",r,!1),e.onkeydown=function(l){9==l.keyCode&&(t.value=c,n.value=s,a.MaterialMenu.hide(),e.classList.remove("is-focused"))},t.onfocus=function(e){a.MaterialMenu.show(),a.focus(),u=!0},t.onblur=function(e){e.stopPropagation()},t.onclick=function(t){t.stopPropagation(),a.classList.contains("is-visible")?(a.MaterialMenu.hide(),u=!1):(a.MaterialMenu.show(),r(),e.classList.add("is-focused"),u=!0)},t.onkeydown=function(l){27==l.keyCode&&(t.value=c,n.value=s,a.MaterialMenu.hide(),e.MaterialTextfield.onBlur_(),""!==i&&(e.querySelector(".mdl-textfield__label").textContent=i,i=""))},a.addEventListener("closeSelect",function(l){t.value=c,n.value=s,e.classList.remove("is-focused"),""!==i&&(e.querySelector(".mdl-textfield__label").textContent=i,i="")}),a.onkeydown=function(l){27==l.keyCode&&(t.value=c,n.value=s,e.classList.remove("is-focused"),""!==i&&(e.querySelector(".mdl-textfield__label").textContent=i,i=""))},o&&(o.onclick=function(l){l.stopPropagation(),u?(a.MaterialMenu.hide(),u=!1,e.classList.remove("is-focused"),e.MaterialTextfield.onBlur_(),t.value=c,n.value=s):(r(),e.MaterialTextfield.onFocus_(),t.focus(),a.MaterialMenu.show(),u=!0)}),[].forEach.call(l,function(n){n.onfocus=function(){e.classList.add("is-focused");var l=n.textContent.trim();t.value=l,e.classList.contains("mdl-textfield--floating-label")||""!=i||(i=e.querySelector(".mdl-textfield__label").textContent.trim(),e.querySelector(".mdl-textfield__label").textContent="")},n.onclick=function(){d(n)},n.dataset.selected&&d(n)})},init:function(e){var t=document.querySelectorAll(e);[].forEach.call(t,function(e){getmdlSelect._addEventListeners(e),componentHandler.upgradeElement(e),componentHandler.upgradeElement(e.querySelector("ul"))})}};
        </script>
        <!-- End material dropdown -->
        <body>
        `+innerContent+`
        </body>
        `;
        return content; // return
    },

    /**
     * Generates an iFrame with the specified HTML content, width and height.
     * @method generateContainer
     * @param {string} innerContent HTML content
     * @param {number} width width of iFrame
     * @param {number} height height of iFrame
     * @param {boolean} fill if set true will expand the iframe to the parent offset height and width when resized, essentially filling the page.
     * @returns {string} iFrame HTML
     * @extends mdlContainers
     */
    "generateContainer" : function(innerContent, width, height, fill) { // fill sizes mdl containers in dialogEngine to ALWAYS be screen size
        if (fill) {
            // If fill mode on, fit to window
            $(window).resize(()=>{
                $(dialogEngine.dialog.getElementsByTagName("iframe")[0]).attr("height",  window.innerHeight);
                $(dialogEngine.dialog.getElementsByTagName("iframe")[0]).attr("width",  window.innerWidth);
            });
        }

        let url = URL.createObjectURL(new Blob([mdlContainers.generateHtml(innerContent)], { type: 'text/html' })); // blob url
        return `<iframe width="`+width+`" height="`+height+`" src="`+ url + `" frameborder="0" scrolling="no" style="max-height: 100%;"></iframe>`;
    }
}