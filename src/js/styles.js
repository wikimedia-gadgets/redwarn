// Handles RedWarns styles
$(".menu").css("z-index", 110); // stop ours from overlaying

var rwDialogAnimations = { // Custom CSS for each animation style
    // DEFAULT
    "default" : `
    /* DEFAULT DIALOG ANIMATION BEGIN */

    dialog[open] {
        -webkit-animation: show 0.25s ease normal;
    }
    @-webkit-keyframes show{
        from {
            opacity: 0;
            transform: scale(0.5) translateY(-10%);
        }
        to {
            opacity: 1;
            transform: scale(1) translateY(0%);
        }
    }
    
    dialog.closeAnimate {
        -webkit-animation: close 0.25s ease normal;
    }
    
    @-webkit-keyframes close{
        from {
            opacity: 1;
            transform: scale(1) translateY(0%);
        }
        to {
            opacity: 0;
            transform: scale(0.5) translateY(-10%);
        }
    }
    
    /* DIALOG ANIMATION END */`,

    // NONE (marked as "instant")
    "none" : `
    /* DEFAULT DIALOG ANIMATION BEGIN */

    dialog[open] {
        -webkit-animation: show 0.01s ease normal;
    }
    @-webkit-keyframes show{
        from {
            opacity: 0;
        }
        to {
            opacity: 1;
        }
    }
    
    dialog.closeAnimate {
        -webkit-animation: close 0.01s ease normal;
    }
    
    @-webkit-keyframes close{
        from {
            opacity: 1;
        }
        to {
            opacity: 0;
        }
    }
    
    /* DIALOG ANIMATION END */
    `,

    // Spinny
    "spinny" : `
    /* DEFAULT DIALOG ANIMATION BEGIN */

    dialog[open] {
        -webkit-animation: show 0.25s ease normal;
    }
    @-webkit-keyframes show{
        from {
            opacity: 0;
            transform: scale(0.5) translateY(-10%) rotate(30deg);
        }
        to {
            opacity: 1;
            transform: scale(1) translateY(0%) rotate(0deg);
        }
    }
    
    dialog.closeAnimate {
        -webkit-animation: close 0.25s ease normal;
    }
    
    @-webkit-keyframes close{
        from {
            opacity: 1;
            transform: scale(1) translateY(0%) rotate(0deg);
        }
        to {
            opacity: 0;
            transform: scale(0.5) translateY(-10%) rotate(-30deg);
        }
    }
    
    /* DIALOG ANIMATION END */`,

    // Mega
    "mega" : `
    /* DEFAULT DIALOG ANIMATION BEGIN */

    dialog[open] {
        -webkit-animation: show 0.25s ease normal;
    }
    @-webkit-keyframes show{
        from {
            opacity: 0;
            transform: scale(3);
        }
        to {
            opacity: 1;
            transform: scale(1);
        }
    }
    
    dialog.closeAnimate {
        -webkit-animation: close 0.25s ease normal;
    }
    
    @-webkit-keyframes close{
        from {
            opacity: 1;
            transform: scale(1);
        }
        to {
            opacity: 0;
            transform: scale(3);
        }
    }
    
    /* DIALOG ANIMATION END */`
};


// MAIN CSS - THE MAIN PAGE DOES NOT INCLUDE MATERIAL DESIGN LITE CSS. Include all the things here if needed.
/**
 * material-design-lite - Material Design Components in CSS, JS and HTML
 * version v1.3.0
 * license Apache-2.0
 * copyright 2015 Google, Inc.
 * link https://github.com/google/material-design-lite
 */
var rwStyle = `
/* MW INDICATORS to stop tooltip clashes */
.mw-indicators {
    z-index: 1;
}



.mdl-tooltip {
    -webkit-transform: scale(0);
    transform: scale(0);
    -webkit-transform-origin: top center;
    transform-origin: top center;
    z-index: 999;
    background: rgba(97, 97, 97, .9);
    border-radius: 2px;
    color: #fff;
    display: inline-block;
    font-size: 10px;
    font-weight: 500;
    line-height: 14px;
    max-width: 170px;
    position: fixed;
    top: -500px;
    left: -500px;
    padding: 8px;
    text-align: center
}

.mdl-tooltip.is-active {
    -webkit-animation: pulse 200ms cubic-bezier(0, 0, .2, 1)forwards;
    animation: pulse 200ms cubic-bezier(0, 0, .2, 1)forwards
}

.mdl-tooltip--large {
    line-height: 14px;
    font-size: 14px;
    padding: 16px
}

@-webkit-keyframes pulse {
    0% {
        -webkit-transform: scale(0);
        transform: scale(0);
        opacity: 0
    }

    50% {
        -webkit-transform: scale(.99);
        transform: scale(.99)
    }

    100% {
        -webkit-transform: scale(1);
        transform: scale(1);
        opacity: 1;
        visibility: visible
    }
}

@keyframes pulse {
    0% {
        -webkit-transform: scale(0);
        transform: scale(0);
        opacity: 0
    }

    50% {
        -webkit-transform: scale(.99);
        transform: scale(.99)
    }

    100% {
        -webkit-transform: scale(1);
        transform: scale(1);
        opacity: 1;
        visibility: visible
    }
}
.mdl-snackbar {
    position: fixed;
    bottom: 0;
    left: 50%;
    cursor: default;
    background-color: #323232;
    z-index: 3;
    display: block;
    display: -webkit-flex;
    display: -ms-flexbox;
    display: flex;
    -webkit-justify-content: space-between;
    -ms-flex-pack: justify;
    justify-content: space-between;
    font-family: "Roboto", "Helvetica", "Arial", sans-serif;
    will-change: transform;
    -webkit-transform: translate(0, 80px);
    transform: translate(0, 80px);
    transition: transform .25s cubic-bezier(.4, 0, 1, 1);
    transition: transform .25s cubic-bezier(.4, 0, 1, 1), -webkit-transform .25s cubic-bezier(.4, 0, 1, 1);
    pointer-events: none
}

@media (max-width:479px) {
    .mdl-snackbar {
        width: 100%;
        left: 0;
        min-height: 48px;
        max-height: 80px
    }
}

@media (min-width:480px) {
    .mdl-snackbar {
        min-width: 288px;
        max-width: 568px;
        border-radius: 2px;
        -webkit-transform: translate(-50%, 80px);
        transform: translate(-50%, 80px)
    }
}

.mdl-snackbar--active {
    -webkit-transform: translate(0, 0);
    transform: translate(0, 0);
    pointer-events: auto;
    transition: transform .25s cubic-bezier(0, 0, .2, 1);
    transition: transform .25s cubic-bezier(0, 0, .2, 1), -webkit-transform .25s cubic-bezier(0, 0, .2, 1)
}

@media (min-width:480px) {
    .mdl-snackbar--active {
        -webkit-transform: translate(-50%, 0);
        transform: translate(-50%, 0)
    }
}

.mdl-snackbar__text {
    padding: 14px 12px 14px 24px;
    vertical-align: middle;
    color: #fff;
    float: left
}

.mdl-snackbar__action {
    background: 0 0;
    border: none;
    color: rgb(83, 109, 254);
    float: right;
    padding: 14px 24px 14px 12px;
    font-family: "Roboto", "Helvetica", "Arial", sans-serif;
    font-size: 14px;
    font-weight: 500;
    text-transform: uppercase;
    line-height: 1;
    letter-spacing: 0;
    overflow: hidden;
    outline: none;
    opacity: 0;
    pointer-events: none;
    cursor: pointer;
    text-decoration: none;
    text-align: center;
    -webkit-align-self: center;
    -ms-flex-item-align: center;
    -ms-grid-row-align: center;
    align-self: center
}

.mdl-snackbar__action::-moz-focus-inner {
    border: 0
}

.mdl-snackbar__action:not([aria-hidden]) {
    opacity: 1;
    pointer-events: auto
}

.mdl-dialog {
    border: none;
    box-shadow: 0 9px 46px 8px rgba(0, 0, 0, .14), 0 11px 15px -7px rgba(0, 0, 0, .12), 0 24px 38px 3px rgba(0, 0, 0, .2);
}

.mdl-dialog__title {
    padding: 24px 24px 0;
    margin: 0;
    font-size: 2.5rem
}

.mdl-dialog__actions {
    padding: 8px 8px 8px 24px;
    display: -webkit-flex;
    display: -ms-flexbox;
    display: flex;
    -webkit-flex-direction: row-reverse;
    -ms-flex-direction: row-reverse;
    flex-direction: row-reverse;
    -webkit-flex-wrap: wrap;
    -ms-flex-wrap: wrap;
    flex-wrap: wrap
}

.mdl-dialog__actions>* {
    margin-right: 8px;
    height: 36px
}

.mdl-dialog__actions>*:first-child {
    margin-right: 0
}

.mdl-dialog__actions--full-width {
    padding: 0 0 8px
}

.mdl-dialog__actions--full-width>* {
    height: 48px;
    -webkit-flex: 0 0 100%;
    -ms-flex: 0 0 100%;
    flex: 0 0 100%;
    padding-right: 16px;
    margin-right: 0;
    text-align: right
}

.mdl-dialog__content {
    padding: 20px 24px 24px;
    color: rgba(0, 0, 0, .54)
}


.mdl-button {
    background: 0 0;
    border: none;
    border-radius: 2px;
    color: #000;
    position: relative;
    height: 36px;
    margin: 0;
    min-width: 64px;
    padding: 0 16px;
    display: inline-block;
    font-family: "Roboto", "Helvetica", "Arial", sans-serif;
    font-size: 14px;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0;
    overflow: hidden;
    will-change: box-shadow;
    transition: box-shadow .2s cubic-bezier(.4, 0, 1, 1), background-color .2s cubic-bezier(.4, 0, .2, 1), color .2s cubic-bezier(.4, 0, .2, 1);
    outline: none;
    cursor: pointer;
    text-decoration: none;
    text-align: center;
    line-height: 36px;
    vertical-align: middle
}

.mdl-button::-moz-focus-inner {
    border: 0
}

.mdl-button:hover {
    background-color: rgba(158, 158, 158, .2)
}

.mdl-button:focus:not(:active) {
    background-color: rgba(0, 0, 0, .12)
}

.mdl-button:active {
    background-color: rgba(158, 158, 158, .4)
}

.mdl-button.mdl-button--colored {
    color: rgb(33, 150, 243)
}

.mdl-button.mdl-button--colored:focus:not(:active) {
    background-color: rgba(0, 0, 0, .12)
}

input.mdl-button[type="submit"] {
    -webkit-appearance: none
}

.mdl-button--raised {
    background: rgba(158, 158, 158, .2);
    box-shadow: 0 2px 2px 0 rgba(0, 0, 0, .14), 0 3px 1px -2px rgba(0, 0, 0, .2), 0 1px 5px 0 rgba(0, 0, 0, .12)
}

.mdl-button--raised:active {
    box-shadow: 0 4px 5px 0 rgba(0, 0, 0, .14), 0 1px 10px 0 rgba(0, 0, 0, .12), 0 2px 4px -1px rgba(0, 0, 0, .2);
    background-color: rgba(158, 158, 158, .4)
}

.mdl-button--raised:focus:not(:active) {
    box-shadow: 0 0 8px rgba(0, 0, 0, .18), 0 8px 16px rgba(0, 0, 0, .36);
    background-color: rgba(158, 158, 158, .4)
}

.mdl-button--raised.mdl-button--colored {
    background: rgb(33, 150, 243);
    color: rgb(255, 255, 255)
}

.mdl-button--raised.mdl-button--colored:hover {
    background-color: rgb(33, 150, 243)
}

.mdl-button--raised.mdl-button--colored:active {
    background-color: rgb(33, 150, 243)
}

.mdl-button--raised.mdl-button--colored:focus:not(:active) {
    background-color: rgb(33, 150, 243)
}

.mdl-button--raised.mdl-button--colored .mdl-ripple {
    background: rgb(255, 255, 255)
}

.mdl-button--fab {
    border-radius: 50%;
    font-size: 24px;
    height: 56px;
    margin: auto;
    min-width: 56px;
    width: 56px;
    padding: 0;
    overflow: hidden;
    background: rgba(158, 158, 158, .2);
    box-shadow: 0 1px 1.5px 0 rgba(0, 0, 0, .12), 0 1px 1px 0 rgba(0, 0, 0, .24);
    position: relative;
    line-height: normal
}

.mdl-button--fab .material-icons {
    position: absolute;
    top: 50%;
    left: 50%;
    -webkit-transform: translate(-12px, -12px);
    transform: translate(-12px, -12px);
    line-height: 24px;
    width: 24px
}

.mdl-button--fab.mdl-button--mini-fab {
    height: 40px;
    min-width: 40px;
    width: 40px
}

.mdl-button--fab .mdl-button__ripple-container {
    border-radius: 50%;
    -webkit-mask-image: -webkit-radial-gradient(circle, #fff, #000)
}

.mdl-button--fab:active {
    box-shadow: 0 4px 5px 0 rgba(0, 0, 0, .14), 0 1px 10px 0 rgba(0, 0, 0, .12), 0 2px 4px -1px rgba(0, 0, 0, .2);
    background-color: rgba(158, 158, 158, .4)
}

.mdl-button--fab:focus:not(:active) {
    box-shadow: 0 0 8px rgba(0, 0, 0, .18), 0 8px 16px rgba(0, 0, 0, .36);
    background-color: rgba(158, 158, 158, .4)
}

.mdl-button--fab.mdl-button--colored {
    background: rgb(83, 109, 254);
    color: rgb(255, 255, 255)
}

.mdl-button--fab.mdl-button--colored:hover {
    background-color: rgb(83, 109, 254)
}

.mdl-button--fab.mdl-button--colored:focus:not(:active) {
    background-color: rgb(83, 109, 254)
}

.mdl-button--fab.mdl-button--colored:active {
    background-color: rgb(83, 109, 254)
}

.mdl-button--fab.mdl-button--colored .mdl-ripple {
    background: rgb(255, 255, 255)
}

.mdl-button--icon {
    border-radius: 50%;
    font-size: 24px;
    height: 32px;
    margin-left: 0;
    margin-right: 0;
    min-width: 32px;
    width: 32px;
    padding: 0;
    overflow: hidden;
    color: inherit;
    line-height: normal
}

.mdl-button--icon .material-icons {
    position: absolute;
    top: 50%;
    left: 50%;
    -webkit-transform: translate(-12px, -12px);
    transform: translate(-12px, -12px);
    line-height: 24px;
    width: 24px
}

.mdl-button--icon.mdl-button--mini-icon {
    height: 24px;
    min-width: 24px;
    width: 24px
}

.mdl-button--icon.mdl-button--mini-icon .material-icons {
    top: 0;
    left: 0
}

.mdl-button--icon .mdl-button__ripple-container {
    border-radius: 50%;
    -webkit-mask-image: -webkit-radial-gradient(circle, #fff, #000)
}

.mdl-button__ripple-container {
    display: block;
    height: 100%;
    left: 0;
    position: absolute;
    top: 0;
    width: 100%;
    z-index: 0;
    overflow: hidden
}

.mdl-button[disabled] .mdl-button__ripple-container .mdl-ripple,
.mdl-button.mdl-button--disabled .mdl-button__ripple-container .mdl-ripple {
    background-color: transparent
}

.mdl-button--primary.mdl-button--primary {
    color: rgb(33, 150, 243)
}

.mdl-button--primary.mdl-button--primary .mdl-ripple {
    background: rgb(255, 255, 255)
}

.mdl-button--primary.mdl-button--primary.mdl-button--raised,
.mdl-button--primary.mdl-button--primary.mdl-button--fab {
    color: rgb(255, 255, 255);
    background-color: rgb(33, 150, 243)
}

.mdl-button--accent.mdl-button--accent {
    color: rgb(83, 109, 254)
}

.mdl-button--accent.mdl-button--accent .mdl-ripple {
    background: rgb(255, 255, 255)
}

.mdl-button--accent.mdl-button--accent.mdl-button--raised,
.mdl-button--accent.mdl-button--accent.mdl-button--fab {
    color: rgb(255, 255, 255);
    background-color: rgb(83, 109, 254)
}

.mdl-button[disabled][disabled],
.mdl-button.mdl-button--disabled.mdl-button--disabled {
    color: rgba(0, 0, 0, .26);
    cursor: default;
    background-color: transparent
}

.mdl-button--fab[disabled][disabled],
.mdl-button--fab.mdl-button--disabled.mdl-button--disabled {
    background-color: rgba(0, 0, 0, .12);
    color: rgba(0, 0, 0, .26)
}

.mdl-button--raised[disabled][disabled],
.mdl-button--raised.mdl-button--disabled.mdl-button--disabled {
    background-color: rgba(0, 0, 0, .12);
    color: rgba(0, 0, 0, .26);
    box-shadow: none
}

.mdl-button--colored[disabled][disabled],
.mdl-button--colored.mdl-button--disabled.mdl-button--disabled {
    color: rgba(0, 0, 0, .26)
}

.mdl-button .material-icons {
    vertical-align: middle
}

.mdl-menu__container {
    display: block;
    margin: 0;
    padding: 0;
    border: none;
    position: absolute;
    overflow: visible;
    height: 0;
    width: 0;
    visibility: hidden;
    z-index: -1
}

.mdl-menu__container.is-visible,
.mdl-menu__container.is-animating {
    z-index: 999;
    visibility: visible
}

.mdl-menu__outline {
    display: block;
    background: #fff;
    margin: 0;
    padding: 0;
    border: none;
    border-radius: 2px;
    position: absolute;
    top: 0;
    left: 0;
    overflow: hidden;
    opacity: 0;
    -webkit-transform: scale(0);
    transform: scale(0);
    -webkit-transform-origin: 0 0;
    transform-origin: 0 0;
    box-shadow: 0 2px 2px 0 rgba(0, 0, 0, .14), 0 3px 1px -2px rgba(0, 0, 0, .2), 0 1px 5px 0 rgba(0, 0, 0, .12);
    will-change: transform;
    transition: transform .3s cubic-bezier(.4, 0, .2, 1), opacity .2s cubic-bezier(.4, 0, .2, 1);
    transition: transform .3s cubic-bezier(.4, 0, .2, 1), opacity .2s cubic-bezier(.4, 0, .2, 1), -webkit-transform .3s cubic-bezier(.4, 0, .2, 1);
    z-index: -1
}

.mdl-menu__container.is-visible .mdl-menu__outline {
    opacity: 1;
    -webkit-transform: scale(1);
    transform: scale(1);
    z-index: 999
}

.mdl-menu__outline.mdl-menu--bottom-right {
    -webkit-transform-origin: 100% 0;
    transform-origin: 100% 0
}

.mdl-menu__outline.mdl-menu--top-left {
    -webkit-transform-origin: 0 100%;
    transform-origin: 0 100%
}

.mdl-menu__outline.mdl-menu--top-right {
    -webkit-transform-origin: 100% 100%;
    transform-origin: 100% 100%
}

.mdl-menu {
    position: absolute;
    list-style: none;
    top: 0;
    left: 0;
    height: auto;
    width: auto;
    min-width: 124px;
    padding: 8px 0;
    margin: 0;
    opacity: 0;
    clip: rect(0 0 0 0);
    z-index: -1
}

.mdl-menu__container.is-visible .mdl-menu {
    opacity: 1;
    z-index: 999
}

.mdl-menu.is-animating {
    transition: opacity .2s cubic-bezier(.4, 0, .2, 1), clip .3s cubic-bezier(.4, 0, .2, 1)
}

.mdl-menu.mdl-menu--bottom-right {
    left: auto;
    right: 0
}

.mdl-menu.mdl-menu--top-left {
    top: auto;
    bottom: 0
}

.mdl-menu.mdl-menu--top-right {
    top: auto;
    left: auto;
    bottom: 0;
    right: 0
}

.mdl-menu.mdl-menu--unaligned {
    top: auto;
    left: auto
}

.mdl-menu__item {
    display: block;
    border: none;
    color: rgba(0, 0, 0, .87);
    background-color: transparent;
    text-align: left;
    margin: 0;
    padding: 0 16px;
    outline-color: #bdbdbd;
    position: relative;
    overflow: hidden;
    font-size: 14px;
    font-weight: 400;
    letter-spacing: 0;
    text-decoration: none;
    cursor: pointer;
    height: 48px;
    line-height: 48px;
    white-space: nowrap;
    opacity: 0;
    transition: opacity .2s cubic-bezier(.4, 0, .2, 1);
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none
}

.mdl-menu__container.is-visible .mdl-menu__item {
    opacity: 1
}

.mdl-menu__item::-moz-focus-inner {
    border: 0
}

.mdl-menu__item--full-bleed-divider {
    border-bottom: 1px solid rgba(0, 0, 0, .12)
}

.mdl-menu__item[disabled],
.mdl-menu__item[data-mdl-disabled] {
    color: #bdbdbd;
    background-color: transparent;
    cursor: auto
}

.mdl-menu__item[disabled]:hover,
.mdl-menu__item[data-mdl-disabled]:hover {
    background-color: transparent
}

.mdl-menu__item[disabled]:focus,
.mdl-menu__item[data-mdl-disabled]:focus {
    background-color: transparent
}

.mdl-menu__item[disabled] .mdl-ripple,
.mdl-menu__item[data-mdl-disabled] .mdl-ripple {
    background: 0 0
}

.mdl-menu__item:hover {
    background-color: #eee
}

.mdl-menu__item:focus {
    outline: none;
    background-color: #eee
}

.mdl-menu__item:active {
    background-color: #e0e0e0
}

.mdl-menu__item--ripple-container {
    display: block;
    height: 100%;
    left: 0;
    position: absolute;
    top: 0;
    width: 100%;
    z-index: 0;
    overflow: hidden
}

.mdl-progress {
    display: block;
    position: relative;
    height: 4px;
    width: 500px;
    max-width: 100%
}

.mdl-progress>.bar {
    display: block;
    position: absolute;
    top: 0;
    bottom: 0;
    width: 0%;
    transition: width .2s cubic-bezier(.4, 0, .2, 1)
}

.mdl-progress>.progressbar {
    background-color: rgb(33, 150, 243);
    z-index: 1;
    left: 0
}

.mdl-progress>.bufferbar {
    background-image: linear-gradient(to right, rgba(255, 255, 255, .7), rgba(255, 255, 255, .7)), linear-gradient(to right, rgb(33, 150, 243), rgb(33, 150, 243));
    z-index: 0;
    left: 0
}

.mdl-progress>.auxbar {
    right: 0
}

@supports (-webkit-appearance:none) {

    .mdl-progress:not(.mdl-progress--indeterminate):not(.mdl-progress--indeterminate)>.auxbar,
    .mdl-progress:not(.mdl-progress__indeterminate):not(.mdl-progress__indeterminate)>.auxbar {
        background-image: linear-gradient(to right, rgba(255, 255, 255, .7), rgba(255, 255, 255, .7)), linear-gradient(to right, rgb(33, 150, 243), rgb(33, 150, 243));
        -webkit-mask: url("data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIj8+Cjxzdmcgd2lkdGg9IjEyIiBoZWlnaHQ9IjQiIHZpZXdQb3J0PSIwIDAgMTIgNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgogIDxlbGxpcHNlIGN4PSIyIiBjeT0iMiIgcng9IjIiIHJ5PSIyIj4KICAgIDxhbmltYXRlIGF0dHJpYnV0ZU5hbWU9ImN4IiBmcm9tPSIyIiB0bz0iLTEwIiBkdXI9IjAuNnMiIHJlcGVhdENvdW50PSJpbmRlZmluaXRlIiAvPgogIDwvZWxsaXBzZT4KICA8ZWxsaXBzZSBjeD0iMTQiIGN5PSIyIiByeD0iMiIgcnk9IjIiIGNsYXNzPSJsb2FkZXIiPgogICAgPGFuaW1hdGUgYXR0cmlidXRlTmFtZT0iY3giIGZyb209IjE0IiB0bz0iMiIgZHVyPSIwLjZzIiByZXBlYXRDb3VudD0iaW5kZWZpbml0ZSIgLz4KICA8L2VsbGlwc2U+Cjwvc3ZnPgo=");
        mask: url("data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIj8+Cjxzdmcgd2lkdGg9IjEyIiBoZWlnaHQ9IjQiIHZpZXdQb3J0PSIwIDAgMTIgNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgogIDxlbGxpcHNlIGN4PSIyIiBjeT0iMiIgcng9IjIiIHJ5PSIyIj4KICAgIDxhbmltYXRlIGF0dHJpYnV0ZU5hbWU9ImN4IiBmcm9tPSIyIiB0bz0iLTEwIiBkdXI9IjAuNnMiIHJlcGVhdENvdW50PSJpbmRlZmluaXRlIiAvPgogIDwvZWxsaXBzZT4KICA8ZWxsaXBzZSBjeD0iMTQiIGN5PSIyIiByeD0iMiIgcnk9IjIiIGNsYXNzPSJsb2FkZXIiPgogICAgPGFuaW1hdGUgYXR0cmlidXRlTmFtZT0iY3giIGZyb209IjE0IiB0bz0iMiIgZHVyPSIwLjZzIiByZXBlYXRDb3VudD0iaW5kZWZpbml0ZSIgLz4KICA8L2VsbGlwc2U+Cjwvc3ZnPgo=")
    }
}

.mdl-progress:not(.mdl-progress--indeterminate)>.auxbar,
.mdl-progress:not(.mdl-progress__indeterminate)>.auxbar {
    background-image: linear-gradient(to right, rgba(255, 255, 255, .9), rgba(255, 255, 255, .9)), linear-gradient(to right, rgb(33, 150, 243), rgb(33, 150, 243))
}

.mdl-progress.mdl-progress--indeterminate>.bar1,
.mdl-progress.mdl-progress__indeterminate>.bar1 {
    -webkit-animation-name: indeterminate1;
    animation-name: indeterminate1
}

.mdl-progress.mdl-progress--indeterminate>.bar1,
.mdl-progress.mdl-progress__indeterminate>.bar1,
.mdl-progress.mdl-progress--indeterminate>.bar3,
.mdl-progress.mdl-progress__indeterminate>.bar3 {
    background-color: rgb(33, 150, 243);
    -webkit-animation-duration: 2s;
    animation-duration: 2s;
    -webkit-animation-iteration-count: infinite;
    animation-iteration-count: infinite;
    -webkit-animation-timing-function: linear;
    animation-timing-function: linear
}

.mdl-progress.mdl-progress--indeterminate>.bar3,
.mdl-progress.mdl-progress__indeterminate>.bar3 {
    background-image: none;
    -webkit-animation-name: indeterminate2;
    animation-name: indeterminate2
}

@-webkit-keyframes indeterminate1 {
    0% {
        left: 0%;
        width: 0%
    }

    50% {
        left: 25%;
        width: 75%
    }

    75% {
        left: 100%;
        width: 0%
    }
}

@keyframes indeterminate1 {
    0% {
        left: 0%;
        width: 0%
    }

    50% {
        left: 25%;
        width: 75%
    }

    75% {
        left: 100%;
        width: 0%
    }
}

@-webkit-keyframes indeterminate2 {

    0%,
    50% {
        left: 0%;
        width: 0%
    }

    75% {
        left: 0%;
        width: 25%
    }

    100% {
        left: 100%;
        width: 0%
    }
}

@keyframes indeterminate2 {

    0%,
    50% {
        left: 0%;
        width: 0%
    }

    75% {
        left: 0%;
        width: 25%
    }

    100% {
        left: 100%;
        width: 0%
    }
}

.mdl-checkbox {
    position: relative;
    z-index: 1;
    vertical-align: middle;
    display: inline-block;
    box-sizing: border-box;
    width: 100%;
    height: 24px;
    margin: 0;
    padding: 0
}

.mdl-checkbox.is-upgraded {
    padding-left: 24px
}

.mdl-checkbox__input {
    line-height: 24px
}

.mdl-checkbox.is-upgraded .mdl-checkbox__input {
    position: absolute;
    width: 0;
    height: 0;
    margin: 0;
    padding: 0;
    opacity: 0;
    -ms-appearance: none;
    -moz-appearance: none;
    -webkit-appearance: none;
    appearance: none;
    border: none
}

.mdl-checkbox__box-outline {
    position: absolute;
    top: 3px;
    left: 0;
    display: inline-block;
    box-sizing: border-box;
    width: 16px;
    height: 16px;
    margin: 0;
    cursor: pointer;
    overflow: hidden;
    border: 2px solid rgba(0, 0, 0, .54);
    border-radius: 2px;
    z-index: 2
}

.mdl-checkbox.is-checked .mdl-checkbox__box-outline {
    border: 2px solid rgb(33, 150, 243)
}

fieldset[disabled] .mdl-checkbox .mdl-checkbox__box-outline,
.mdl-checkbox.is-disabled .mdl-checkbox__box-outline {
    border: 2px solid rgba(0, 0, 0, .26);
    cursor: auto
}

.mdl-checkbox__focus-helper {
    position: absolute;
    top: 3px;
    left: 0;
    display: inline-block;
    box-sizing: border-box;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background-color: transparent
}

.mdl-checkbox.is-focused .mdl-checkbox__focus-helper {
    box-shadow: 0 0 0 8px rgba(0, 0, 0, .1);
    background-color: rgba(0, 0, 0, .1)
}

.mdl-checkbox.is-focused.is-checked .mdl-checkbox__focus-helper {
    box-shadow: 0 0 0 8px rgba(33, 150, 243, .26);
    background-color: rgba(33, 150, 243, .26)
}

.mdl-checkbox__tick-outline {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    -webkit-mask: url("data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+CjxzdmcKICAgeG1sbnM6ZGM9Imh0dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvIgogICB4bWxuczpjYz0iaHR0cDovL2NyZWF0aXZlY29tbW9ucy5vcmcvbnMjIgogICB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiCiAgIHhtbG5zOnN2Zz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciCiAgIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIKICAgdmVyc2lvbj0iMS4xIgogICB2aWV3Qm94PSIwIDAgMSAxIgogICBwcmVzZXJ2ZUFzcGVjdFJhdGlvPSJ4TWluWU1pbiBtZWV0Ij4KICA8ZGVmcz4KICAgIDxjbGlwUGF0aCBpZD0iY2xpcCI+CiAgICAgIDxwYXRoCiAgICAgICAgIGQ9Ik0gMCwwIDAsMSAxLDEgMSwwIDAsMCB6IE0gMC44NTM0Mzc1LDAuMTY3MTg3NSAwLjk1OTY4NzUsMC4yNzMxMjUgMC40MjkzNzUsMC44MDM0Mzc1IDAuMzIzMTI1LDAuOTA5Njg3NSAwLjIxNzE4NzUsMC44MDM0Mzc1IDAuMDQwMzEyNSwwLjYyNjg3NSAwLjE0NjU2MjUsMC41MjA2MjUgMC4zMjMxMjUsMC42OTc1IDAuODUzNDM3NSwwLjE2NzE4NzUgeiIKICAgICAgICAgc3R5bGU9ImZpbGw6I2ZmZmZmZjtmaWxsLW9wYWNpdHk6MTtzdHJva2U6bm9uZSIgLz4KICAgIDwvY2xpcFBhdGg+CiAgICA8bWFzayBpZD0ibWFzayIgbWFza1VuaXRzPSJvYmplY3RCb3VuZGluZ0JveCIgbWFza0NvbnRlbnRVbml0cz0ib2JqZWN0Qm91bmRpbmdCb3giPgogICAgICA8cGF0aAogICAgICAgICBkPSJNIDAsMCAwLDEgMSwxIDEsMCAwLDAgeiBNIDAuODUzNDM3NSwwLjE2NzE4NzUgMC45NTk2ODc1LDAuMjczMTI1IDAuNDI5Mzc1LDAuODAzNDM3NSAwLjMyMzEyNSwwLjkwOTY4NzUgMC4yMTcxODc1LDAuODAzNDM3NSAwLjA0MDMxMjUsMC42MjY4NzUgMC4xNDY1NjI1LDAuNTIwNjI1IDAuMzIzMTI1LDAuNjk3NSAwLjg1MzQzNzUsMC4xNjcxODc1IHoiCiAgICAgICAgIHN0eWxlPSJmaWxsOiNmZmZmZmY7ZmlsbC1vcGFjaXR5OjE7c3Ryb2tlOm5vbmUiIC8+CiAgICA8L21hc2s+CiAgPC9kZWZzPgogIDxyZWN0CiAgICAgd2lkdGg9IjEiCiAgICAgaGVpZ2h0PSIxIgogICAgIHg9IjAiCiAgICAgeT0iMCIKICAgICBjbGlwLXBhdGg9InVybCgjY2xpcCkiCiAgICAgc3R5bGU9ImZpbGw6IzAwMDAwMDtmaWxsLW9wYWNpdHk6MTtzdHJva2U6bm9uZSIgLz4KPC9zdmc+Cg==");
    mask: url("data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+CjxzdmcKICAgeG1sbnM6ZGM9Imh0dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvIgogICB4bWxuczpjYz0iaHR0cDovL2NyZWF0aXZlY29tbW9ucy5vcmcvbnMjIgogICB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiCiAgIHhtbG5zOnN2Zz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciCiAgIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIKICAgdmVyc2lvbj0iMS4xIgogICB2aWV3Qm94PSIwIDAgMSAxIgogICBwcmVzZXJ2ZUFzcGVjdFJhdGlvPSJ4TWluWU1pbiBtZWV0Ij4KICA8ZGVmcz4KICAgIDxjbGlwUGF0aCBpZD0iY2xpcCI+CiAgICAgIDxwYXRoCiAgICAgICAgIGQ9Ik0gMCwwIDAsMSAxLDEgMSwwIDAsMCB6IE0gMC44NTM0Mzc1LDAuMTY3MTg3NSAwLjk1OTY4NzUsMC4yNzMxMjUgMC40MjkzNzUsMC44MDM0Mzc1IDAuMzIzMTI1LDAuOTA5Njg3NSAwLjIxNzE4NzUsMC44MDM0Mzc1IDAuMDQwMzEyNSwwLjYyNjg3NSAwLjE0NjU2MjUsMC41MjA2MjUgMC4zMjMxMjUsMC42OTc1IDAuODUzNDM3NSwwLjE2NzE4NzUgeiIKICAgICAgICAgc3R5bGU9ImZpbGw6I2ZmZmZmZjtmaWxsLW9wYWNpdHk6MTtzdHJva2U6bm9uZSIgLz4KICAgIDwvY2xpcFBhdGg+CiAgICA8bWFzayBpZD0ibWFzayIgbWFza1VuaXRzPSJvYmplY3RCb3VuZGluZ0JveCIgbWFza0NvbnRlbnRVbml0cz0ib2JqZWN0Qm91bmRpbmdCb3giPgogICAgICA8cGF0aAogICAgICAgICBkPSJNIDAsMCAwLDEgMSwxIDEsMCAwLDAgeiBNIDAuODUzNDM3NSwwLjE2NzE4NzUgMC45NTk2ODc1LDAuMjczMTI1IDAuNDI5Mzc1LDAuODAzNDM3NSAwLjMyMzEyNSwwLjkwOTY4NzUgMC4yMTcxODc1LDAuODAzNDM3NSAwLjA0MDMxMjUsMC42MjY4NzUgMC4xNDY1NjI1LDAuNTIwNjI1IDAuMzIzMTI1LDAuNjk3NSAwLjg1MzQzNzUsMC4xNjcxODc1IHoiCiAgICAgICAgIHN0eWxlPSJmaWxsOiNmZmZmZmY7ZmlsbC1vcGFjaXR5OjE7c3Ryb2tlOm5vbmUiIC8+CiAgICA8L21hc2s+CiAgPC9kZWZzPgogIDxyZWN0CiAgICAgd2lkdGg9IjEiCiAgICAgaGVpZ2h0PSIxIgogICAgIHg9IjAiCiAgICAgeT0iMCIKICAgICBjbGlwLXBhdGg9InVybCgjY2xpcCkiCiAgICAgc3R5bGU9ImZpbGw6IzAwMDAwMDtmaWxsLW9wYWNpdHk6MTtzdHJva2U6bm9uZSIgLz4KPC9zdmc+Cg==");
    background: 0 0;
    transition-duration: .28s;
    transition-timing-function: cubic-bezier(.4, 0, .2, 1);
    transition-property: background
}

.mdl-checkbox.is-checked .mdl-checkbox__tick-outline {
    background: rgb(33, 150, 243)url("data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+CjxzdmcKICAgeG1sbnM6ZGM9Imh0dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvIgogICB4bWxuczpjYz0iaHR0cDovL2NyZWF0aXZlY29tbW9ucy5vcmcvbnMjIgogICB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiCiAgIHhtbG5zOnN2Zz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciCiAgIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIKICAgdmVyc2lvbj0iMS4xIgogICB2aWV3Qm94PSIwIDAgMSAxIgogICBwcmVzZXJ2ZUFzcGVjdFJhdGlvPSJ4TWluWU1pbiBtZWV0Ij4KICA8cGF0aAogICAgIGQ9Ik0gMC4wNDAzODA1OSwwLjYyNjc3NjcgMC4xNDY0NDY2MSwwLjUyMDcxMDY4IDAuNDI5Mjg5MzIsMC44MDM1NTMzOSAwLjMyMzIyMzMsMC45MDk2MTk0MSB6IE0gMC4yMTcxNTcyOSwwLjgwMzU1MzM5IDAuODUzNTUzMzksMC4xNjcxNTcyOSAwLjk1OTYxOTQxLDAuMjczMjIzMyAwLjMyMzIyMzMsMC45MDk2MTk0MSB6IgogICAgIGlkPSJyZWN0Mzc4MCIKICAgICBzdHlsZT0iZmlsbDojZmZmZmZmO2ZpbGwtb3BhY2l0eToxO3N0cm9rZTpub25lIiAvPgo8L3N2Zz4K")
}

fieldset[disabled] .mdl-checkbox.is-checked .mdl-checkbox__tick-outline,
.mdl-checkbox.is-checked.is-disabled .mdl-checkbox__tick-outline {
    background: rgba(0, 0, 0, .26)url("data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+CjxzdmcKICAgeG1sbnM6ZGM9Imh0dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvIgogICB4bWxuczpjYz0iaHR0cDovL2NyZWF0aXZlY29tbW9ucy5vcmcvbnMjIgogICB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiCiAgIHhtbG5zOnN2Zz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciCiAgIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIKICAgdmVyc2lvbj0iMS4xIgogICB2aWV3Qm94PSIwIDAgMSAxIgogICBwcmVzZXJ2ZUFzcGVjdFJhdGlvPSJ4TWluWU1pbiBtZWV0Ij4KICA8cGF0aAogICAgIGQ9Ik0gMC4wNDAzODA1OSwwLjYyNjc3NjcgMC4xNDY0NDY2MSwwLjUyMDcxMDY4IDAuNDI5Mjg5MzIsMC44MDM1NTMzOSAwLjMyMzIyMzMsMC45MDk2MTk0MSB6IE0gMC4yMTcxNTcyOSwwLjgwMzU1MzM5IDAuODUzNTUzMzksMC4xNjcxNTcyOSAwLjk1OTYxOTQxLDAuMjczMjIzMyAwLjMyMzIyMzMsMC45MDk2MTk0MSB6IgogICAgIGlkPSJyZWN0Mzc4MCIKICAgICBzdHlsZT0iZmlsbDojZmZmZmZmO2ZpbGwtb3BhY2l0eToxO3N0cm9rZTpub25lIiAvPgo8L3N2Zz4K")
}

.mdl-checkbox__label {
    position: relative;
    cursor: pointer;
    font-size: 16px;
    line-height: 24px;
    margin: 0
}

fieldset[disabled] .mdl-checkbox .mdl-checkbox__label,
.mdl-checkbox.is-disabled .mdl-checkbox__label {
    color: rgba(0, 0, 0, .26);
    cursor: auto
}

.mdl-checkbox__ripple-container {
    position: absolute;
    z-index: 2;
    top: -6px;
    left: -10px;
    box-sizing: border-box;
    width: 36px;
    height: 36px;
    border-radius: 50%;
    cursor: pointer;
    overflow: hidden;
    -webkit-mask-image: -webkit-radial-gradient(circle, #fff, #000)
}

.mdl-checkbox__ripple-container .mdl-ripple {
    background: rgb(33, 150, 243)
}

fieldset[disabled] .mdl-checkbox .mdl-checkbox__ripple-container,
.mdl-checkbox.is-disabled .mdl-checkbox__ripple-container {
    cursor: auto
}

fieldset[disabled] .mdl-checkbox .mdl-checkbox__ripple-container .mdl-ripple,
.mdl-checkbox.is-disabled .mdl-checkbox__ripple-container .mdl-ripple {
    background: 0 0
}
`;