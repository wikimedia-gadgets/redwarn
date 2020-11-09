/*

RedWarn - Recent Edits Patrol and Warning Tool
The user-friendly Wikipedia counter-vandalism tool.

(c) 2020 The RedWarn Development Team and contributors - ed6767wiki (at) gmail.com or [[WT:RW]]
Licensed under the Apache License 2.0 - read more at https://gitlab.com/redwarn/redwarn-web/


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
*/
// <nowiki>
// ======================== BEGIN DEPENDENCIES ========================
var rw_includes = {"dialogAnimations.default.css":"dialog[open]{-webkit-animation:show .25s ease normal}@-webkit-keyframes show{from{opacity:0;transform:scale(0.5) translateY(-10%)}to{opacity:1;transform:scale(1) translateY(0%)}}dialog.closeAnimate{-webkit-animation:close .25s ease normal}@-webkit-keyframes close{from{opacity:1;transform:scale(1) translateY(0%)}to{opacity:0;transform:scale(0.5) translateY(-10%)}}","dialogAnimations.none.css":"dialog[open]{-webkit-animation:show .01s ease normal}@-webkit-keyframes show{from{opacity:0}to{opacity:1}}dialog.closeAnimate{-webkit-animation:close .01s ease normal}@-webkit-keyframes close{from{opacity:1}to{opacity:0}}","dialogAnimations.spinny.css":"dialog[open]{-webkit-animation:show .25s ease normal}@-webkit-keyframes show{from{opacity:0;transform:scale(0.5) translateY(-10%) rotate(30deg)}to{opacity:1;transform:scale(1) translateY(0%) rotate(0deg)}}dialog.closeAnimate{-webkit-animation:close .25s ease normal}@-webkit-keyframes close{from{opacity:1;transform:scale(1) translateY(0%) rotate(0deg)}to{opacity:0;transform:scale(0.5) translateY(-10%) rotate(-30deg)}}","dialogAnimations.mega.css":"dialog[open]{-webkit-animation:show .25s ease normal}@-webkit-keyframes show{from{opacity:0;transform:scale(3)}to{opacity:1;transform:scale(1)}}dialog.closeAnimate{-webkit-animation:close .25s ease normal}@-webkit-keyframes close{from{opacity:1;transform:scale(1)}to{opacity:0;transform:scale(3)}}","style.css":".mw-indicators{z-index:1}.mdl-tooltip{-webkit-transform:scale(0);transform:scale(0);-webkit-transform-origin:top center;transform-origin:top center;z-index:999;background:rgba(97,97,97,.9);border-radius:2px;color:#fff;display:inline-block;font-size:10px;font-weight:500;line-height:14px;max-width:170px;position:fixed;top:-500px;left:-500px;padding:8px;text-align:center}.mdl-tooltip.is-active{-webkit-animation:pulse 200ms cubic-bezier(0,0,.2,1)forwards;animation:pulse 200ms cubic-bezier(0,0,.2,1)forwards}.mdl-tooltip--large{line-height:14px;font-size:14px;padding:16px}@-webkit-keyframes pulse{0%{-webkit-transform:scale(0);transform:scale(0);opacity:0}50%{-webkit-transform:scale(.99);transform:scale(.99)}100%{-webkit-transform:scale(1);transform:scale(1);opacity:1;visibility:visible}}@keyframes pulse{0%{-webkit-transform:scale(0);transform:scale(0);opacity:0}50%{-webkit-transform:scale(.99);transform:scale(.99)}100%{-webkit-transform:scale(1);transform:scale(1);opacity:1;visibility:visible}}.mdl-snackbar{position:fixed;bottom:0;left:50%;cursor:default;background-color:#323232;z-index:3;display:block;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-justify-content:space-between;-ms-flex-pack:justify;justify-content:space-between;font-family:Roboto,Helvetica,Arial,sans-serif;will-change:transform;-webkit-transform:translate(0,80px);transform:translate(0,80px);transition:transform .25s cubic-bezier(.4,0,1,1);transition:transform .25s cubic-bezier(.4,0,1,1),-webkit-transform .25s cubic-bezier(.4,0,1,1);pointer-events:none}@media (max-width:479px){.mdl-snackbar{width:100%;left:0;min-height:48px;max-height:80px}}@media (min-width:480px){.mdl-snackbar{min-width:288px;max-width:568px;border-radius:2px;-webkit-transform:translate(-50%,80px);transform:translate(-50%,80px)}}.mdl-snackbar--active{-webkit-transform:translate(0,0);transform:translate(0,0);pointer-events:auto;transition:transform .25s cubic-bezier(0,0,.2,1);transition:transform .25s cubic-bezier(0,0,.2,1),-webkit-transform .25s cubic-bezier(0,0,.2,1)}@media (min-width:480px){.mdl-snackbar--active{-webkit-transform:translate(-50%,0);transform:translate(-50%,0)}}.mdl-snackbar__text{padding:14px 12px 14px 24px;vertical-align:middle;color:#fff;float:left}.mdl-snackbar__action{background:0;border:0;color:rgb(83,109,254);float:right;padding:14px 24px 14px 12px;font-family:Roboto,Helvetica,Arial,sans-serif;font-size:14px;font-weight:500;text-transform:uppercase;line-height:1;letter-spacing:0;overflow:hidden;outline:0;opacity:0;pointer-events:none;cursor:pointer;text-decoration:none;text-align:center;-webkit-align-self:center;-ms-flex-item-align:center;-ms-grid-row-align:center;align-self:center}.mdl-snackbar__action::-moz-focus-inner{border:0}.mdl-snackbar__action:not([aria-hidden]){opacity:1;pointer-events:auto}.mdl-dialog{border:0;box-shadow:0 9px 46px 8px rgba(0,0,0,.14),0 11px 15px -7px rgba(0,0,0,.12),0 24px 38px 3px rgba(0,0,0,.2)}.mdl-dialog__title{padding:24px 24px 0;margin:0;font-size:2.5rem}.mdl-dialog__actions{padding:8px 8px 8px 24px;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-flex-direction:row-reverse;-ms-flex-direction:row-reverse;flex-direction:row-reverse;-webkit-flex-wrap:wrap;-ms-flex-wrap:wrap;flex-wrap:wrap}.mdl-dialog__actions>*{margin-right:8px;height:36px}.mdl-dialog__actions>*:first-child{margin-right:0}.mdl-dialog__actions--full-width{padding:0 0 8px}.mdl-dialog__actions--full-width>*{height:48px;-webkit-flex:0 0 100%;-ms-flex:0 0 100%;flex:0 0 100%;padding-right:16px;margin-right:0;text-align:right}.mdl-dialog__content{padding:20px 24px 24px;color:rgba(0,0,0,.54)}.mdl-button{background:0;border:0;border-radius:2px;color:#000;position:relative;height:36px;margin:0;min-width:64px;padding:0 16px;display:inline-block;font-family:Roboto,Helvetica,Arial,sans-serif;font-size:14px;font-weight:500;text-transform:uppercase;letter-spacing:0;overflow:hidden;will-change:box-shadow;transition:box-shadow .2s cubic-bezier(.4,0,1,1),background-color .2s cubic-bezier(.4,0,.2,1),color .2s cubic-bezier(.4,0,.2,1);outline:0;cursor:pointer;text-decoration:none;text-align:center;line-height:36px;vertical-align:middle}.mdl-button::-moz-focus-inner{border:0}.mdl-button:hover{background-color:rgba(158,158,158,.2)}.mdl-button:focus:not(:active){background-color:rgba(0,0,0,.12)}.mdl-button:active{background-color:rgba(158,158,158,.4)}.mdl-button.mdl-button--colored{color:rgb(33,150,243)}.mdl-button.mdl-button--colored:focus:not(:active){background-color:rgba(0,0,0,.12)}input.mdl-button[type=submit]{-webkit-appearance:none}.mdl-button--raised{background:rgba(158,158,158,.2);box-shadow:0 2px 2px 0 rgba(0,0,0,.14),0 3px 1px -2px rgba(0,0,0,.2),0 1px 5px 0 rgba(0,0,0,.12)}.mdl-button--raised:active{box-shadow:0 4px 5px 0 rgba(0,0,0,.14),0 1px 10px 0 rgba(0,0,0,.12),0 2px 4px -1px rgba(0,0,0,.2);background-color:rgba(158,158,158,.4)}.mdl-button--raised:focus:not(:active){box-shadow:0 0 8px rgba(0,0,0,.18),0 8px 16px rgba(0,0,0,.36);background-color:rgba(158,158,158,.4)}.mdl-button--raised.mdl-button--colored{background:rgb(33,150,243);color:rgb(255,255,255)}.mdl-button--raised.mdl-button--colored:hover{background-color:rgb(33,150,243)}.mdl-button--raised.mdl-button--colored:active{background-color:rgb(33,150,243)}.mdl-button--raised.mdl-button--colored:focus:not(:active){background-color:rgb(33,150,243)}.mdl-button--raised.mdl-button--colored .mdl-ripple{background:rgb(255,255,255)}.mdl-button--fab{border-radius:50%;font-size:24px;height:56px;margin:auto;min-width:56px;width:56px;padding:0;overflow:hidden;background:rgba(158,158,158,.2);box-shadow:0 1px 1.5px 0 rgba(0,0,0,.12),0 1px 1px 0 rgba(0,0,0,.24);position:relative;line-height:normal}.mdl-button--fab .material-icons{position:absolute;top:50%;left:50%;-webkit-transform:translate(-12px,-12px);transform:translate(-12px,-12px);line-height:24px;width:24px}.mdl-button--fab.mdl-button--mini-fab{height:40px;min-width:40px;width:40px}.mdl-button--fab .mdl-button__ripple-container{border-radius:50%;-webkit-mask-image:-webkit-radial-gradient(circle,#fff,#000)}.mdl-button--fab:active{box-shadow:0 4px 5px 0 rgba(0,0,0,.14),0 1px 10px 0 rgba(0,0,0,.12),0 2px 4px -1px rgba(0,0,0,.2);background-color:rgba(158,158,158,.4)}.mdl-button--fab:focus:not(:active){box-shadow:0 0 8px rgba(0,0,0,.18),0 8px 16px rgba(0,0,0,.36);background-color:rgba(158,158,158,.4)}.mdl-button--fab.mdl-button--colored{background:rgb(83,109,254);color:rgb(255,255,255)}.mdl-button--fab.mdl-button--colored:hover{background-color:rgb(83,109,254)}.mdl-button--fab.mdl-button--colored:focus:not(:active){background-color:rgb(83,109,254)}.mdl-button--fab.mdl-button--colored:active{background-color:rgb(83,109,254)}.mdl-button--fab.mdl-button--colored .mdl-ripple{background:rgb(255,255,255)}.mdl-button--icon{border-radius:50%;font-size:24px;height:32px;margin-left:0;margin-right:0;min-width:32px;width:32px;padding:0;overflow:hidden;color:inherit;line-height:normal}.mdl-button--icon .material-icons{position:absolute;top:50%;left:50%;-webkit-transform:translate(-12px,-12px);transform:translate(-12px,-12px);line-height:24px;width:24px}.mdl-button--icon.mdl-button--mini-icon{height:24px;min-width:24px;width:24px}.mdl-button--icon.mdl-button--mini-icon .material-icons{top:0;left:0}.mdl-button--icon .mdl-button__ripple-container{border-radius:50%;-webkit-mask-image:-webkit-radial-gradient(circle,#fff,#000)}.mdl-button__ripple-container{display:block;height:100%;left:0;position:absolute;top:0;width:100%;z-index:0;overflow:hidden}.mdl-button[disabled] .mdl-button__ripple-container .mdl-ripple,.mdl-button.mdl-button--disabled .mdl-button__ripple-container .mdl-ripple{background-color:transparent}.mdl-button--primary.mdl-button--primary{color:rgb(33,150,243)}.mdl-button--primary.mdl-button--primary .mdl-ripple{background:rgb(255,255,255)}.mdl-button--primary.mdl-button--primary.mdl-button--raised,.mdl-button--primary.mdl-button--primary.mdl-button--fab{color:rgb(255,255,255);background-color:rgb(33,150,243)}.mdl-button--accent.mdl-button--accent{color:rgb(83,109,254)}.mdl-button--accent.mdl-button--accent .mdl-ripple{background:rgb(255,255,255)}.mdl-button--accent.mdl-button--accent.mdl-button--raised,.mdl-button--accent.mdl-button--accent.mdl-button--fab{color:rgb(255,255,255);background-color:rgb(83,109,254)}.mdl-button[disabled][disabled],.mdl-button.mdl-button--disabled.mdl-button--disabled{color:rgba(0,0,0,.26);cursor:default;background-color:transparent}.mdl-button--fab[disabled][disabled],.mdl-button--fab.mdl-button--disabled.mdl-button--disabled{background-color:rgba(0,0,0,.12);color:rgba(0,0,0,.26)}.mdl-button--raised[disabled][disabled],.mdl-button--raised.mdl-button--disabled.mdl-button--disabled{background-color:rgba(0,0,0,.12);color:rgba(0,0,0,.26);box-shadow:none}.mdl-button--colored[disabled][disabled],.mdl-button--colored.mdl-button--disabled.mdl-button--disabled{color:rgba(0,0,0,.26)}.mdl-button .material-icons{vertical-align:middle}.mdl-menu__container{display:block;margin:0;padding:0;border:0;position:absolute;overflow:visible;height:0;width:0;visibility:hidden;z-index:-1}.mdl-menu__container.is-visible,.mdl-menu__container.is-animating{z-index:999;visibility:visible}.mdl-menu__outline{display:block;background:#fff;margin:0;padding:0;border:0;border-radius:2px;position:absolute;top:0;left:0;overflow:hidden;opacity:0;-webkit-transform:scale(0);transform:scale(0);-webkit-transform-origin:0;transform-origin:0;box-shadow:0 2px 2px 0 rgba(0,0,0,.14),0 3px 1px -2px rgba(0,0,0,.2),0 1px 5px 0 rgba(0,0,0,.12);will-change:transform;transition:transform .3s cubic-bezier(.4,0,.2,1),opacity .2s cubic-bezier(.4,0,.2,1);transition:transform .3s cubic-bezier(.4,0,.2,1),opacity .2s cubic-bezier(.4,0,.2,1),-webkit-transform .3s cubic-bezier(.4,0,.2,1);z-index:-1}.mdl-menu__container.is-visible .mdl-menu__outline{opacity:1;-webkit-transform:scale(1);transform:scale(1);z-index:999}.mdl-menu__outline.mdl-menu--bottom-right{-webkit-transform-origin:100% 0;transform-origin:100% 0}.mdl-menu__outline.mdl-menu--top-left{-webkit-transform-origin:0 100%;transform-origin:0 100%}.mdl-menu__outline.mdl-menu--top-right{-webkit-transform-origin:100% 100%;transform-origin:100% 100%}.mdl-menu{position:absolute;list-style:none;top:0;left:0;height:auto;width:auto;min-width:124px;padding:8px 0;margin:0;opacity:0;clip:rect(0 0 0 0);z-index:-1}.mdl-menu__container.is-visible .mdl-menu{opacity:1;z-index:999}.mdl-menu.is-animating{transition:opacity .2s cubic-bezier(.4,0,.2,1),clip .3s cubic-bezier(.4,0,.2,1)}.mdl-menu.mdl-menu--bottom-right{left:auto;right:0}.mdl-menu.mdl-menu--top-left{top:auto;bottom:0}.mdl-menu.mdl-menu--top-right{top:auto;left:auto;bottom:0;right:0}.mdl-menu.mdl-menu--unaligned{top:auto;left:auto}.mdl-menu__item{display:block;border:0;color:rgba(0,0,0,.87);background-color:transparent;text-align:left;margin:0;padding:0 16px;outline-color:#bdbdbd;position:relative;overflow:hidden;font-size:14px;font-weight:400;letter-spacing:0;text-decoration:none;cursor:pointer;height:48px;line-height:48px;white-space:nowrap;opacity:0;transition:opacity .2s cubic-bezier(.4,0,.2,1);-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}.mdl-menu__container.is-visible .mdl-menu__item{opacity:1}.mdl-menu__item::-moz-focus-inner{border:0}.mdl-menu__item--full-bleed-divider{border-bottom:1px solid rgba(0,0,0,.12)}.mdl-menu__item[disabled],.mdl-menu__item[data-mdl-disabled]{color:#bdbdbd;background-color:transparent;cursor:auto}.mdl-menu__item[disabled]:hover,.mdl-menu__item[data-mdl-disabled]:hover{background-color:transparent}.mdl-menu__item[disabled]:focus,.mdl-menu__item[data-mdl-disabled]:focus{background-color:transparent}.mdl-menu__item[disabled] .mdl-ripple,.mdl-menu__item[data-mdl-disabled] .mdl-ripple{background:0}.mdl-menu__item:hover{background-color:#eee}.mdl-menu__item:focus{outline:0;background-color:#eee}.mdl-menu__item:active{background-color:#e0e0e0}.mdl-menu__item--ripple-container{display:block;height:100%;left:0;position:absolute;top:0;width:100%;z-index:0;overflow:hidden}.mdl-progress{display:block;position:relative;height:4px;width:500px;max-width:100%}.mdl-progress>.bar{display:block;position:absolute;top:0;bottom:0;width:0;transition:width .2s cubic-bezier(.4,0,.2,1)}.mdl-progress>.progressbar{background-color:rgb(33,150,243);z-index:1;left:0}.mdl-progress>.bufferbar{background-image:linear-gradient(to right,rgba(255,255,255,.7),rgba(255,255,255,.7)),linear-gradient(to right,rgb(33,150,243),rgb(33,150,243));z-index:0;left:0}.mdl-progress>.auxbar{right:0}@supports (-webkit-appearance:none){.mdl-progress:not(.mdl-progress--indeterminate):not(.mdl-progress--indeterminate)>.auxbar,.mdl-progress:not(.mdl-progress__indeterminate):not(.mdl-progress__indeterminate)>.auxbar{background-image:linear-gradient(to right,rgba(255,255,255,.7),rgba(255,255,255,.7)),linear-gradient(to right,rgb(33,150,243),rgb(33,150,243));-webkit-mask:url(data:image\/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIj8+Cjxzdmcgd2lkdGg9IjEyIiBoZWlnaHQ9IjQiIHZpZXdQb3J0PSIwIDAgMTIgNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgogIDxlbGxpcHNlIGN4PSIyIiBjeT0iMiIgcng9IjIiIHJ5PSIyIj4KICAgIDxhbmltYXRlIGF0dHJpYnV0ZU5hbWU9ImN4IiBmcm9tPSIyIiB0bz0iLTEwIiBkdXI9IjAuNnMiIHJlcGVhdENvdW50PSJpbmRlZmluaXRlIiAvPgogIDwvZWxsaXBzZT4KICA8ZWxsaXBzZSBjeD0iMTQiIGN5PSIyIiByeD0iMiIgcnk9IjIiIGNsYXNzPSJsb2FkZXIiPgogICAgPGFuaW1hdGUgYXR0cmlidXRlTmFtZT0iY3giIGZyb209IjE0IiB0bz0iMiIgZHVyPSIwLjZzIiByZXBlYXRDb3VudD0iaW5kZWZpbml0ZSIgLz4KICA8L2VsbGlwc2U+Cjwvc3ZnPgo=);mask:url(data:image\/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIj8+Cjxzdmcgd2lkdGg9IjEyIiBoZWlnaHQ9IjQiIHZpZXdQb3J0PSIwIDAgMTIgNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgogIDxlbGxpcHNlIGN4PSIyIiBjeT0iMiIgcng9IjIiIHJ5PSIyIj4KICAgIDxhbmltYXRlIGF0dHJpYnV0ZU5hbWU9ImN4IiBmcm9tPSIyIiB0bz0iLTEwIiBkdXI9IjAuNnMiIHJlcGVhdENvdW50PSJpbmRlZmluaXRlIiAvPgogIDwvZWxsaXBzZT4KICA8ZWxsaXBzZSBjeD0iMTQiIGN5PSIyIiByeD0iMiIgcnk9IjIiIGNsYXNzPSJsb2FkZXIiPgogICAgPGFuaW1hdGUgYXR0cmlidXRlTmFtZT0iY3giIGZyb209IjE0IiB0bz0iMiIgZHVyPSIwLjZzIiByZXBlYXRDb3VudD0iaW5kZWZpbml0ZSIgLz4KICA8L2VsbGlwc2U+Cjwvc3ZnPgo=)}}.mdl-progress:not(.mdl-progress--indeterminate)>.auxbar,.mdl-progress:not(.mdl-progress__indeterminate)>.auxbar{background-image:linear-gradient(to right,rgba(255,255,255,.9),rgba(255,255,255,.9)),linear-gradient(to right,rgb(33,150,243),rgb(33,150,243))}.mdl-progress.mdl-progress--indeterminate>.bar1,.mdl-progress.mdl-progress__indeterminate>.bar1{-webkit-animation-name:indeterminate1;animation-name:indeterminate1}.mdl-progress.mdl-progress--indeterminate>.bar1,.mdl-progress.mdl-progress__indeterminate>.bar1,.mdl-progress.mdl-progress--indeterminate>.bar3,.mdl-progress.mdl-progress__indeterminate>.bar3{background-color:rgb(33,150,243);-webkit-animation-duration:2s;animation-duration:2s;-webkit-animation-iteration-count:infinite;animation-iteration-count:infinite;-webkit-animation-timing-function:linear;animation-timing-function:linear}.mdl-progress.mdl-progress--indeterminate>.bar3,.mdl-progress.mdl-progress__indeterminate>.bar3{background-image:none;-webkit-animation-name:indeterminate2;animation-name:indeterminate2}@-webkit-keyframes indeterminate1{0%{left:0;width:0}50%{left:25%;width:75%}75%{left:100%;width:0}}@keyframes indeterminate1{0%{left:0;width:0}50%{left:25%;width:75%}75%{left:100%;width:0}}@-webkit-keyframes indeterminate2{0%,50%{left:0;width:0}75%{left:0;width:25%}100%{left:100%;width:0}}@keyframes indeterminate2{0%,50%{left:0;width:0}75%{left:0;width:25%}100%{left:100%;width:0}}.mdl-checkbox{position:relative;z-index:1;vertical-align:middle;display:inline-block;box-sizing:border-box;width:100%;height:24px;margin:0;padding:0}.mdl-checkbox.is-upgraded{padding-left:24px}.mdl-checkbox__input{line-height:24px}.mdl-checkbox.is-upgraded .mdl-checkbox__input{position:absolute;width:0;height:0;margin:0;padding:0;opacity:0;-ms-appearance:none;-moz-appearance:none;-webkit-appearance:none;appearance:none;border:0}.mdl-checkbox__box-outline{position:absolute;top:3px;left:0;display:inline-block;box-sizing:border-box;width:16px;height:16px;margin:0;cursor:pointer;overflow:hidden;border:2px solid rgba(0,0,0,.54);border-radius:2px;z-index:2}.mdl-checkbox.is-checked .mdl-checkbox__box-outline{border:2px solid rgb(33,150,243)}fieldset[disabled] .mdl-checkbox .mdl-checkbox__box-outline,.mdl-checkbox.is-disabled .mdl-checkbox__box-outline{border:2px solid rgba(0,0,0,.26);cursor:auto}.mdl-checkbox__focus-helper{position:absolute;top:3px;left:0;display:inline-block;box-sizing:border-box;width:16px;height:16px;border-radius:50%;background-color:transparent}.mdl-checkbox.is-focused .mdl-checkbox__focus-helper{box-shadow:0 0 0 8px rgba(0,0,0,.1);background-color:rgba(0,0,0,.1)}.mdl-checkbox.is-focused.is-checked .mdl-checkbox__focus-helper{box-shadow:0 0 0 8px rgba(33,150,243,.26);background-color:rgba(33,150,243,.26)}.mdl-checkbox__tick-outline{position:absolute;top:0;left:0;height:100%;width:100%;-webkit-mask:url(data:image\/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+CjxzdmcKICAgeG1sbnM6ZGM9Imh0dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvIgogICB4bWxuczpjYz0iaHR0cDovL2NyZWF0aXZlY29tbW9ucy5vcmcvbnMjIgogICB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiCiAgIHhtbG5zOnN2Zz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciCiAgIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIKICAgdmVyc2lvbj0iMS4xIgogICB2aWV3Qm94PSIwIDAgMSAxIgogICBwcmVzZXJ2ZUFzcGVjdFJhdGlvPSJ4TWluWU1pbiBtZWV0Ij4KICA8ZGVmcz4KICAgIDxjbGlwUGF0aCBpZD0iY2xpcCI+CiAgICAgIDxwYXRoCiAgICAgICAgIGQ9Ik0gMCwwIDAsMSAxLDEgMSwwIDAsMCB6IE0gMC44NTM0Mzc1LDAuMTY3MTg3NSAwLjk1OTY4NzUsMC4yNzMxMjUgMC40MjkzNzUsMC44MDM0Mzc1IDAuMzIzMTI1LDAuOTA5Njg3NSAwLjIxNzE4NzUsMC44MDM0Mzc1IDAuMDQwMzEyNSwwLjYyNjg3NSAwLjE0NjU2MjUsMC41MjA2MjUgMC4zMjMxMjUsMC42OTc1IDAuODUzNDM3NSwwLjE2NzE4NzUgeiIKICAgICAgICAgc3R5bGU9ImZpbGw6I2ZmZmZmZjtmaWxsLW9wYWNpdHk6MTtzdHJva2U6bm9uZSIgLz4KICAgIDwvY2xpcFBhdGg+CiAgICA8bWFzayBpZD0ibWFzayIgbWFza1VuaXRzPSJvYmplY3RCb3VuZGluZ0JveCIgbWFza0NvbnRlbnRVbml0cz0ib2JqZWN0Qm91bmRpbmdCb3giPgogICAgICA8cGF0aAogICAgICAgICBkPSJNIDAsMCAwLDEgMSwxIDEsMCAwLDAgeiBNIDAuODUzNDM3NSwwLjE2NzE4NzUgMC45NTk2ODc1LDAuMjczMTI1IDAuNDI5Mzc1LDAuODAzNDM3NSAwLjMyMzEyNSwwLjkwOTY4NzUgMC4yMTcxODc1LDAuODAzNDM3NSAwLjA0MDMxMjUsMC42MjY4NzUgMC4xNDY1NjI1LDAuNTIwNjI1IDAuMzIzMTI1LDAuNjk3NSAwLjg1MzQzNzUsMC4xNjcxODc1IHoiCiAgICAgICAgIHN0eWxlPSJmaWxsOiNmZmZmZmY7ZmlsbC1vcGFjaXR5OjE7c3Ryb2tlOm5vbmUiIC8+CiAgICA8L21hc2s+CiAgPC9kZWZzPgogIDxyZWN0CiAgICAgd2lkdGg9IjEiCiAgICAgaGVpZ2h0PSIxIgogICAgIHg9IjAiCiAgICAgeT0iMCIKICAgICBjbGlwLXBhdGg9InVybCgjY2xpcCkiCiAgICAgc3R5bGU9ImZpbGw6IzAwMDAwMDtmaWxsLW9wYWNpdHk6MTtzdHJva2U6bm9uZSIgLz4KPC9zdmc+Cg==);mask:url(data:image\/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+CjxzdmcKICAgeG1sbnM6ZGM9Imh0dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvIgogICB4bWxuczpjYz0iaHR0cDovL2NyZWF0aXZlY29tbW9ucy5vcmcvbnMjIgogICB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiCiAgIHhtbG5zOnN2Zz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciCiAgIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIKICAgdmVyc2lvbj0iMS4xIgogICB2aWV3Qm94PSIwIDAgMSAxIgogICBwcmVzZXJ2ZUFzcGVjdFJhdGlvPSJ4TWluWU1pbiBtZWV0Ij4KICA8ZGVmcz4KICAgIDxjbGlwUGF0aCBpZD0iY2xpcCI+CiAgICAgIDxwYXRoCiAgICAgICAgIGQ9Ik0gMCwwIDAsMSAxLDEgMSwwIDAsMCB6IE0gMC44NTM0Mzc1LDAuMTY3MTg3NSAwLjk1OTY4NzUsMC4yNzMxMjUgMC40MjkzNzUsMC44MDM0Mzc1IDAuMzIzMTI1LDAuOTA5Njg3NSAwLjIxNzE4NzUsMC44MDM0Mzc1IDAuMDQwMzEyNSwwLjYyNjg3NSAwLjE0NjU2MjUsMC41MjA2MjUgMC4zMjMxMjUsMC42OTc1IDAuODUzNDM3NSwwLjE2NzE4NzUgeiIKICAgICAgICAgc3R5bGU9ImZpbGw6I2ZmZmZmZjtmaWxsLW9wYWNpdHk6MTtzdHJva2U6bm9uZSIgLz4KICAgIDwvY2xpcFBhdGg+CiAgICA8bWFzayBpZD0ibWFzayIgbWFza1VuaXRzPSJvYmplY3RCb3VuZGluZ0JveCIgbWFza0NvbnRlbnRVbml0cz0ib2JqZWN0Qm91bmRpbmdCb3giPgogICAgICA8cGF0aAogICAgICAgICBkPSJNIDAsMCAwLDEgMSwxIDEsMCAwLDAgeiBNIDAuODUzNDM3NSwwLjE2NzE4NzUgMC45NTk2ODc1LDAuMjczMTI1IDAuNDI5Mzc1LDAuODAzNDM3NSAwLjMyMzEyNSwwLjkwOTY4NzUgMC4yMTcxODc1LDAuODAzNDM3NSAwLjA0MDMxMjUsMC42MjY4NzUgMC4xNDY1NjI1LDAuNTIwNjI1IDAuMzIzMTI1LDAuNjk3NSAwLjg1MzQzNzUsMC4xNjcxODc1IHoiCiAgICAgICAgIHN0eWxlPSJmaWxsOiNmZmZmZmY7ZmlsbC1vcGFjaXR5OjE7c3Ryb2tlOm5vbmUiIC8+CiAgICA8L21hc2s+CiAgPC9kZWZzPgogIDxyZWN0CiAgICAgd2lkdGg9IjEiCiAgICAgaGVpZ2h0PSIxIgogICAgIHg9IjAiCiAgICAgeT0iMCIKICAgICBjbGlwLXBhdGg9InVybCgjY2xpcCkiCiAgICAgc3R5bGU9ImZpbGw6IzAwMDAwMDtmaWxsLW9wYWNpdHk6MTtzdHJva2U6bm9uZSIgLz4KPC9zdmc+Cg==);background:0;transition-duration:.28s;transition-timing-function:cubic-bezier(.4,0,.2,1);transition-property:background}.mdl-checkbox.is-checked .mdl-checkbox__tick-outline{background:rgb(33,150,243)url(data:image\/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+CjxzdmcKICAgeG1sbnM6ZGM9Imh0dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvIgogICB4bWxuczpjYz0iaHR0cDovL2NyZWF0aXZlY29tbW9ucy5vcmcvbnMjIgogICB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiCiAgIHhtbG5zOnN2Zz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciCiAgIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIKICAgdmVyc2lvbj0iMS4xIgogICB2aWV3Qm94PSIwIDAgMSAxIgogICBwcmVzZXJ2ZUFzcGVjdFJhdGlvPSJ4TWluWU1pbiBtZWV0Ij4KICA8cGF0aAogICAgIGQ9Ik0gMC4wNDAzODA1OSwwLjYyNjc3NjcgMC4xNDY0NDY2MSwwLjUyMDcxMDY4IDAuNDI5Mjg5MzIsMC44MDM1NTMzOSAwLjMyMzIyMzMsMC45MDk2MTk0MSB6IE0gMC4yMTcxNTcyOSwwLjgwMzU1MzM5IDAuODUzNTUzMzksMC4xNjcxNTcyOSAwLjk1OTYxOTQxLDAuMjczMjIzMyAwLjMyMzIyMzMsMC45MDk2MTk0MSB6IgogICAgIGlkPSJyZWN0Mzc4MCIKICAgICBzdHlsZT0iZmlsbDojZmZmZmZmO2ZpbGwtb3BhY2l0eToxO3N0cm9rZTpub25lIiAvPgo8L3N2Zz4K)}fieldset[disabled] .mdl-checkbox.is-checked .mdl-checkbox__tick-outline,.mdl-checkbox.is-checked.is-disabled .mdl-checkbox__tick-outline{background:rgba(0,0,0,.26)url(data:image\/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+CjxzdmcKICAgeG1sbnM6ZGM9Imh0dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvIgogICB4bWxuczpjYz0iaHR0cDovL2NyZWF0aXZlY29tbW9ucy5vcmcvbnMjIgogICB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiCiAgIHhtbG5zOnN2Zz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciCiAgIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIKICAgdmVyc2lvbj0iMS4xIgogICB2aWV3Qm94PSIwIDAgMSAxIgogICBwcmVzZXJ2ZUFzcGVjdFJhdGlvPSJ4TWluWU1pbiBtZWV0Ij4KICA8cGF0aAogICAgIGQ9Ik0gMC4wNDAzODA1OSwwLjYyNjc3NjcgMC4xNDY0NDY2MSwwLjUyMDcxMDY4IDAuNDI5Mjg5MzIsMC44MDM1NTMzOSAwLjMyMzIyMzMsMC45MDk2MTk0MSB6IE0gMC4yMTcxNTcyOSwwLjgwMzU1MzM5IDAuODUzNTUzMzksMC4xNjcxNTcyOSAwLjk1OTYxOTQxLDAuMjczMjIzMyAwLjMyMzIyMzMsMC45MDk2MTk0MSB6IgogICAgIGlkPSJyZWN0Mzc4MCIKICAgICBzdHlsZT0iZmlsbDojZmZmZmZmO2ZpbGwtb3BhY2l0eToxO3N0cm9rZTpub25lIiAvPgo8L3N2Zz4K)}.mdl-checkbox__label{position:relative;cursor:pointer;font-size:16px;line-height:24px;margin:0}fieldset[disabled] .mdl-checkbox .mdl-checkbox__label,.mdl-checkbox.is-disabled .mdl-checkbox__label{color:rgba(0,0,0,.26);cursor:auto}.mdl-checkbox__ripple-container{position:absolute;z-index:2;top:-6px;left:-10px;box-sizing:border-box;width:36px;height:36px;border-radius:50%;cursor:pointer;overflow:hidden;-webkit-mask-image:-webkit-radial-gradient(circle,#fff,#000)}.mdl-checkbox__ripple-container .mdl-ripple{background:rgb(33,150,243)}fieldset[disabled] .mdl-checkbox .mdl-checkbox__ripple-container,.mdl-checkbox.is-disabled .mdl-checkbox__ripple-container{cursor:auto}fieldset[disabled] .mdl-checkbox .mdl-checkbox__ripple-container .mdl-ripple,.mdl-checkbox.is-disabled .mdl-checkbox__ripple-container .mdl-ripple{background:0}","recentChanges.html":"`<!DOCTYPE HTML><html><head><script src=\"https:\/\/redwarn.toolforge.org\/cdn\/js\/jQuery.js\"><\/script><link href=\"https:\/\/tools-static.wmflabs.org\/fontcdn\/css?family=Roboto:100,100italic,300,300italic,400,400italic,500,500italic,700,700italic,900,900italic&subset=cyrillic,cyrillic-ext,greek,greek-ext,latin,latin-ext,vietnamese\" rel=\"stylesheet\"><link rel=\"stylesheet\" href=\"https:\/\/redwarn.toolforge.org\/cdn\/css\/materialicons.css\"><link rel=\"stylesheet\" href=\"https:\/\/redwarn.toolforge.org\/cdn\/css\/material.blue-indigo.min.css\"\/><\/head><body onload=\"refreshLive();\"><div class=\"mdl-layout mdl-js-layout mdl-layout--fixed-drawer\"><div class=\"mdl-layout__drawer\" style=\"width:100%;-webkit-transform:translateX(0px);transform:translateX(0px);\"><span class=\"mdl-layout-title\">${rw.logoHTML} Patrol<\/span><nav class=\"mdl-navigation\"><a class=\"mdl-navigation__link\" href=\"#\" onclick=\"window.parent.postMessage('rwRCPcloseDialog')\">Return to Wikipedia \/ Change filter options<\/a><a class=\"mdl-navigation__link\" href=\"#\" id=\"newAttached\" target=\"_blank\">Open New Attached Tab<\/a><a class=\"mdl-navigation__link\" href=\"#\" style=\"background-color:teal;color:white;\" onmouseover=\"tI = setInterval(refreshLive,  750);\" onmouseout=\"clearTimeout(tI);\">Hover your cursor here for live updates<\/a><div id=\"recentChangesContainer\"><\/div><\/nav><\/div><main class=\"mdl-layout__content\"><div class=\"page-content\" style=\"display:none;\"><\/div><\/main><\/div><script>\/\/ Create broadcast channel\nvar bcID = \"RWBC_\" + Math.random().toString(36).substring(7);\nconst bc = new BroadcastChannel(bcID);\n$(\"#newAttached\").attr(\"href\", \"https:\/\/en.wikipedia.org\/wiki\/User:Ed6767\/redwarn\/patrol#rwPatrolAttach-\"+ bcID); \/\/ set link\n\nvar tI;\nfunction convertRange( value, r1, r2 ) { \n    return ( value - r1[ 0 ] ) * ( r2[ 1 ] - r2[ 0 ] ) \/ ( r1[ 1 ] - r1[ 0 ] ) + r2[ 0 ];\n}\n\/\/ Check for new updates every 750ms\nfunction refreshLive() {\n    \/\/ Don't use JSON API so that the vars are interchangable from Special:RecentChanges\n    parseRecentChanges(arr=>{\n        arr.forEach(edit => {\n            console.log(edit);\n            \/\/ Clear excess\n            if ($('a[id^=\"recentChange\"]').length > 250) {\n                \/\/ Max 250 (rev8), delete bottom\n                $('a[id^=\"recentChange\"]').last().remove(); \/\/ remove the last one\n            }\n            \/\/ Add new\n            if ($(\"#recentChange-\"+ edit.revID).length < 1) { \/\/ Only continue if edit not already in page\n                let sizeDiff = edit.changeSize;\n                let opacityLevel = 0;\n                if ((sizeDiff > 1000) || (sizeDiff < -1000)) {\n                    \/\/ Max opacity\n                    opacityLevel = 1;\n                } else {\n                    \/\/ We can map\n                    if (sizeDiff < 0) {\n                        \/\/ Red map\n                        opacityLevel = convertRange(sizeDiff, [0, -1000], [0.1, 0.75]);\n                    } else {\n                        \/\/ Green map\n                        opacityLevel = convertRange(sizeDiff, [0, 1000], [0.1, 0.75]);\n                    }\n                    \n                }\n                let style = (sizeDiff < 0) ? \"background-color: rgba(`+ rmCol +`,\"+ opacityLevel +\"); color:black;\" : \"background-color: rgba(`+ addCol +`,\"+ opacityLevel +\"); color:black;\" \/\/ First neg style, next add style\n                $(\"#recentChangesContainer\").prepend('<a class=\"mdl-navigation__link notif\" href=\"#\" style=\"display:none;'+ style +'\" id=\"recentChange-'+ edit.revID +'\"><i id=\"title-'+ edit.revID +'\"><\/i><br><b>'+ edit.user +'<\/b> ('+ sizeDiff +')<br\/><span id=\"comment-'+ edit.revID +'\"><\/span><br>'+ edit.tags +'<\/a>');\n                $('#title-'+ edit.revID).text(edit.title); \/\/ XSS security\n                $('#comment-'+ edit.revID).text(edit.comment);\n                $(\"#recentChange-\"+ edit.revID).fadeIn(); \/\/ fancy\n\n                \/\/ Append click handler\n                $('#recentChange-'+ edit.revID).on(\"click\", ()=>goToLatestDiffPage(edit.title));\n            }\n            \n        });\n    });\n}\n\nfunction goToLatestDiffPage(article) {\n    $(\"#welcomeContainer\").hide();\n    \/\/ Nav to latest diff page\n    $.getJSON(\"https:\/\/en.wikipedia.org\/w\/api.php?action=query&prop=revisions&titles=\"+ encodeURIComponent(article) +\"&rvslots=*&rvprop=ids%7Cuser&formatversion=2&format=json\", r=>{\n            \/\/ We got the response\n            let latestRId = r.query.pages[0].revisions[0].revid;\n            let parentRId = r.query.pages[0].revisions[0].parentid;\n            \/\/ Open page in new tab (has to be done here due to new security systems)\n            bc.postMessage(\"https:\/\/en.wikipedia.org\/w\/index.php?title=\"+ encodeURIComponent(name) +\"&diff=\"+ latestRId +\"&oldid=\"+ parentRId +\"&diffmode=source\");\n    });\n}\n\nfunction parseRecentChanges(callback) {\n    \/\/ USING HTML API for one reason\n    \/\/ 1. works easily with Special:RecentChanges filters\n    $.get(\"https:\/\/en.wikipedia.org\/wiki\/Special:RecentChanges?`+ filters +`&action=render&enhanced=0\", r=>{\n        $(\"body\").append(\"<div id='toDelete' style='display:none;'><\/div>\"); \/\/ create temp div\n        $(\"#toDelete\").html(r);\n        let _ = $(\"#toDelete\").find(\"ul\").find(\"li\");\n        let arr = [];\n        let recentChanges = _.each(i=> {\n            let el = _[i];\n            let revId = $(el).attr(\"data-mw-revid\"); \/\/ get revision ID\n            let changeSize = $(el).find(\".mw-diff-bytes\").text(); \/\/ get size (+123)\n            let changeTitle = $(el).find(\".mw-changeslist-title\").text(); \/\/ get title of page\n            let changeUsername = $(el).find(\".mw-userlink\").text(); \/\/ get username of changer\n            let tags =  $(el).find(\".mw-tag-markers\").text(); \/\/ get tags (mobile edit ext)\n            let comment = $(el).find(\".comment\").text(); \/\/ get comment\n            if (!isNaN(parseInt(changeSize))) {\n                \/\/ Valid\n                arr[i] = {\n                \"revID\": revId,\n                \"changeSize\": parseInt(changeSize),\n                \"tags\": tags,\n                \"user\": changeUsername,\n                \"title\": changeTitle,\n                \"comment\": comment\n                }; \/\/ append data to the array\n            }\n        });\n\n        $(\"toDelete\").remove(); \/\/ dispose unneeded\n        callback(arr); \/\/ we done\n    });\n}<\/script><\/body><\/html>`","rollbackCurrentRevFormatting.html":"`<span id=\"rwCurrentRevRollbackBtns\">${currentRevIcons}<\/span><span id=\"rwRollbackInProgress\" style=\"display:none;\"><div id=\"rwRollbackInProgressBar\" class=\"mdl-progress mdl-js-progress\" style=\"width:300px;display:block;margin-left:auto;margin-right:auto;\"><\/div><div style=\"height:5px\"><\/div><span style=\"font-family:Roboto;font-size:16px;\">Reverting...<\/span><br\/><div style=\"height:5px\"><\/div><\/span><span id=\"rwRollbackDoneIcons\" style=\"display:none;\"><div style=\"height:5px\"><\/div><span style=\"font-family:Roboto;font-size:16px;display:inline-flex;vertical-align:middle;\"><span class=\"material-icons\" style=\"color:green;cursor:default;\">check_circle<\/span>&nbsp;&nbsp;\n        Rollback complete<\/span><br\/><div style=\"height:5px\"><\/div><div id=\"RWRBDONEmrevPg\" class=\"icon material-icons\"><span style=\"cursor:pointer;\">watch_later<\/span><\/div><div class=\"mdl-tooltip mdl-tooltip--large\" for=\"RWRBDONEmrevPg\">Go to latest revision<\/div> &nbsp;&nbsp; <div id=\"RWRBDONEnewUsrMsg\" class=\"icon material-icons\"><span style=\"cursor:pointer;\">send<\/span><\/div><div class=\"mdl-tooltip mdl-tooltip--large\" for=\"RWRBDONEnewUsrMsg\">New Message<\/div> &nbsp;&nbsp; <div id=\"RWRBDONEwelcomeUsr\" class=\"icon material-icons\"><span style=\"cursor:pointer;\">library_add<\/span><\/div><div class=\"mdl-tooltip mdl-tooltip--large\" for=\"RWRBDONEwelcomeUsr\">Quick Template<\/div> &nbsp;&nbsp; <div id=\"RWRBDONEwarnUsr\" class=\"icon material-icons\"><span style=\"cursor:pointer;\">report<\/span><\/div><div class=\"mdl-tooltip mdl-tooltip--large\" for=\"RWRBDONEwarnUsr\">Warn User<\/div> &nbsp;&nbsp; <div id=\"RWRBDONEreportUsr\" class=\"icon material-icons\"><span style=\"cursor:pointer;\">gavel<\/span><\/div><div class=\"mdl-tooltip mdl-tooltip--large\" for=\"RWRBDONEreportUsr\">Report to Admin<\/div><\/span>`","rollbackReason.html":"`<form id=\"newMsgForm\" onsubmit=\"pushRollback();\" action=\"#\"><div class=\"mdl-textfield mdl-js-textfield mdl-textfield--floating-label\" style=\"width:100%\"><input class=\"mdl-textfield__input\" type=\"text\" name=\"rollbackReason\" id=\"rollbackReason\" value=\"`+ reason +`\"><label class=\"mdl-textfield__label\" for=\"rollbackReason\">Rollback Reason<\/label><div class=\"mdl-tooltip\" for=\"rollbackReason\">Enter a reason for this rollback<\/div><\/div><\/form><span style=\"float:right;\"><button class=\"mdl-button mdl-js-button mdl-js-ripple-effect\" onclick=\"window.parent.postMessage('closeDialog', '*');\">CANCEL<\/button><button id=\"submitBtn\" class=\"mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent\" onclick=\"pushRollback();\">Rollback<\/button><\/span><script>function pushRollback() {\n        var data = $('#newMsgForm').serializeArray().reduce(function(obj, item) {\n                obj[item.name] = item.value;\n                return obj;\n                }, {}); \/\/ form data\n        \n        let reason = data.rollbackReason;\n        \/\/ Submit it\n        window.parent.postMessage('reason\\\\\\`' + reason); \/\/ Push upstairs\n        window.parent.postMessage(\"closeDialog\"); \/\/ We done here.\n        return false; \/\/ prevent redirect\n    }\n\n    document.getElementById(\"rollbackReason\").focus(); \/\/ focus on text box for quick rollback<\/script>`","warnUserDialog.html":"`<style>#previewUsrPg h2{font-size:25px}#previewUsrPg .mw-editsection{display:none}#previewUsrPg .toc{display:none}<\/style><div id=\"noticeFmContainer\"><h2 style=\"font-weight:200;\">Warn User<\/h2><form id=\"newNoticeForm\"><div class=\"mdl-textfield mdl-js-textfield mdl-textfield--floating-label\" style=\"width:75%;\"><input class=\"mdl-textfield__input\" type=\"text\" id=\"trgtUsrVisualBox\" value=\"${rw.info.targetUsername(un)}\" readonly><label class=\"mdl-textfield__label\" for=\"trgtUsrVisualBox\">Target<\/label><div class=\"mdl-tooltip\" for=\"trgtUsrVisualBox\">To target a different user, please visit their userpage, or right-click a link to their userpage.<\/div><\/div><span style=\"display:none;\">${(hideUserInfo ? \"\" : \"<\/span>\")}${lastWarning}<span class=\"material-icons\" id=\"prevUsrPgMonth\" style=\"cursor:pointer;position:relative;top:5px;padding-left:10px;\" onclick=\"showThisMonthsUsrMsgs();\">assignment_late<\/span><div class=\"mdl-tooltip mdl-tooltip--large\" for=\"prevUsrPgMonth\"><span style=\"font-size:x-small;\">See notices for this month<\/span><\/div><span class=\"material-icons\" id=\"prevUsrPg\" style=\"cursor:pointer;position:relative;top:5px;padding-left:10px;\" onclick=\"showUsrPg();\">assignment_ind<\/span><div class=\"mdl-tooltip mdl-tooltip--large\" for=\"prevUsrPg\"><span style=\"font-size:x-small;\">Preview Userpage<\/span><\/div> `+ (hideUserInfo ? \"<\/span>\" : \"\") + `<div class=\"mdl-textfield mdl-js-textfield mdl-textfield--floating-label getmdl-select\" style=\"width:100%\" id=\"reasonsBox\"><input type=\"text\" value=\"\" class=\"mdl-textfield__input\" id=\"template\" style=\"font-size:14px;\" autocomplete=\"off\"><input type=\"hidden\" value=\"\" name=\"template\"><i class=\"mdl-icon-toggle__label material-icons\">keyboard_arrow_down<\/i><label for=\"template\" class=\"mdl-textfield__label\">${(rw.config.rwNoticeListByTemplateName != \"enable\") ? `Reason` : `Template`}<\/label><ul for=\"template\" class=\"mdl-menu mdl-menu--bottom-left mdl-js-menu\" style=\"overflow-y:scroll;height:300px\">`+ finalListBox +`<\/ul><\/div><span style=\"padding-right:30;\">Notice Level:<\/span><span id=\"warningRadioButtons\"><label id=\"l1Lbl\" class=\"mdl-radio mdl-js-radio mdl-js-ripple-effect\" for=\"level1\" style=\"padding-right:10;\"><input type=\"radio\" id=\"level1\" class=\"mdl-radio__button\" name=\"warnLevel\" value=\"1\" `+ (!autoLevelSelectEnable || (w==  0) ? `checked` : ``) + `><span class=\"mdl-radio__label\"><span class=\"material-icons\">info<\/span><\/span><\/label><div class=\"mdl-tooltip mdl-tooltip--large\" for=\"l1Lbl\">Notice<br\/><span style=\"font-size:x-small;\">Level 1<br\/> Assumes Good Faith<\/span><\/div><label id=\"l2Lbl\" class=\"mdl-radio mdl-js-radio mdl-js-ripple-effect\" for=\"level2\" style=\"padding-right:10;\"><input type=\"radio\" id=\"level2\" class=\"mdl-radio__button\" name=\"warnLevel\" value=\"2\" `+ (autoLevelSelectEnable && (w==  1) ? `checked` : ``) + `><span class=\"mdl-radio__label\"><span class=\"material-icons\">announcement<\/span><\/span><\/label><div class=\"mdl-tooltip mdl-tooltip--large\" for=\"l2Lbl\">Caution<br\/><span style=\"font-size:x-small;\">Level 2<br\/> No Faith Assumption.<\/span><\/div><label id=\"l3Lbl\" class=\"mdl-radio mdl-js-radio mdl-js-ripple-effect\" for=\"level3\" style=\"padding-right:10;\"><input type=\"radio\" id=\"level3\" class=\"mdl-radio__button\" name=\"warnLevel\" value=\"3\" `+ (autoLevelSelectEnable && (w==  2) ? `checked` : ``) + `><span class=\"mdl-radio__label\"><span class=\"material-icons\">report_problem<\/span><\/span><\/label><div class=\"mdl-tooltip mdl-tooltip--large\" for=\"l3Lbl\">Warning<br\/><span style=\"font-size:x-small;\">Level 3<br\/> Assumes bad faith, cease and desist.<\/span><\/div><label id=\"l4Lbl\" class=\"mdl-radio mdl-js-radio mdl-js-ripple-effect\" for=\"level4\" style=\"padding-right:10;\"><input type=\"radio\" id=\"level4\" class=\"mdl-radio__button\" name=\"warnLevel\" value=\"4\" `+ (autoLevelSelectEnable && (w> 2) ? `checked` : ``) + `><span class=\"mdl-radio__label\"><span class=\"material-icons\">report<\/span><\/span><\/label><div class=\"mdl-tooltip mdl-tooltip--large\" for=\"l4Lbl\">Final Warning<br\/><span style=\"font-size:x-small;\">Level 4<br\/> Bad faith, last warning.<\/span><\/div><label id=\"l4imLbl\" class=\"mdl-radio mdl-js-radio mdl-js-ripple-effect\" for=\"level4im\" style=\"padding-right:10;\"><input type=\"radio\" id=\"level4im\" class=\"mdl-radio__button\" name=\"warnLevel\" value=\"4im\"><span class=\"mdl-radio__label\"><span class=\"material-icons\">new_releases<\/span><\/span><\/label><div class=\"mdl-tooltip mdl-tooltip--large\" for=\"l4imLbl\">ONLY Warning<br\/><span style=\"font-size:x-small;\">Level 4im<br\/> Excessive and continuous disruption.<\/span><\/div><label id=\"l4noLbl\" class=\"mdl-radio mdl-js-radio mdl-js-ripple-effect\" for=\"level4no\" style=\"padding-right:10;display:none;\"><input type=\"radio\" id=\"level4no\" class=\"mdl-radio__button\" name=\"warnLevel\" value=\"\" disabled><span class=\"mdl-radio__label\"><span class=\"material-icons\" style=\"cursor:help;\">report_off<\/span><\/span><\/label><div class=\"mdl-tooltip mdl-tooltip--large\" for=\"l4noLbl\">No final warning.<br\/><span style=\"font-size:x-small;\">A final warning cannot be issued under this reason. To issue a level 4 or level 4im warning, choose the \"Generic Warning\" option.<\/span><\/div><\/span><span id=\"singleNoticeOnly\" style=\"cursor:help;display:none;\"><span id=\"sNoticeTt\"><strong>Reminder<\/strong><\/span><div class=\"mdl-tooltip mdl-tooltip--large\" for=\"sNoticeTt\">Reminder<br\/><span style=\"font-size:x-small;\">Single Notice<br\/> Serves to remind other editors about minor mistakes<\/span><\/div><\/span><span id=\"singleWarnOnly\" style=\"cursor:help;display:none;\"><span id=\"sWarnTt\"><strong>Policy Violation Warning<\/strong><\/span><div class=\"mdl-tooltip mdl-tooltip--large\" for=\"sWarnTt\">Policy Violation Warning<br\/><span style=\"font-size:x-small;\">Single Warning<br\/> Serves to advise editors of policy breaches that, if repeated, are likely to result in a block.<\/span><\/div><\/span><span id=\"ordInfo\"><div class=\"mdl-textfield mdl-js-textfield mdl-textfield--floating-label\" style=\"width:92.4%\"><input class=\"mdl-textfield__input\" name=\"relatedPage\" type=\"text\" id=\"relatedPage\" value=\"`+ rw.info.getRelatedPage(pg).replace(\/_\/g, ' ') +`\"><label class=\"mdl-textfield__label\" for=\"relatedPage\">Related Page<\/label><div class=\"mdl-tooltip\" for=\"relatedPage\">Optionally, enter the page that this notice relates to.<\/div><\/div><span class=\"material-icons\" id=\"selectPgFromRecents\" style=\"cursor:pointer;position:relative;top:5px;padding-left:10px;\" onclick=\"window.parent.postMessage('openRecentPageSelector');\">event_note<\/span><div class=\"mdl-tooltip mdl-tooltip--large\" for=\"selectPgFromRecents\"><span style=\"font-size:x-small;\">Select from recently visited pages<\/span><\/div><div class=\"mdl-textfield mdl-js-textfield mdl-textfield--floating-label\" style=\"width:100%\"><input class=\"mdl-textfield__input\" name=\"extraInfo\" type=\"text\" id=\"extraInfo\" value=\"\"><label class=\"mdl-textfield__label\" for=\"extraInfo\">Additional info<\/label><div class=\"mdl-tooltip\" for=\"extraInfo\">Optionally, add additional info that will be appended to the end of the notice.<\/div><\/div><\/span><span id=\"specialInfo\" style=\"display:none;\"><div class=\"mdl-textfield mdl-js-textfield mdl-textfield--floating-label\" style=\"width:100%\"><input class=\"mdl-textfield__input\" name=\"specialInfo\" type=\"text\" id=\"specialInfo\" value=\"\"><label class=\"mdl-textfield__label\" for=\"specialInfo\">Special Information<\/label><div class=\"mdl-tooltip mdl-tooltip--large\" for=\"specialInfo\" id=\"specialInfoTt\">Placeholder :)<\/div><\/div><\/span><\/form><span id=\"previewContainer\"><span id=\"editBtn\" class=\"material-icons\" style=\"font-size:16px;padding-bottom:3px;float:right;padding-right:5px;cursor:pointer;\" onclick=\"$('#previewContainer').hide();$('#editorContainer').show();\">create<\/span><div id=\"preview\" style=\"height:150px;overflow-y:auto;width:100%;\"><\/div><\/span><span id=\"editorContainer\" style=\"display:none;\"><span id=\"previewBtn\" class=\"material-icons\" style=\"font-size:16px;padding-bottom:3px;float:right;padding-right:5px;cursor:pointer;\" onclick=\"$('#previewContainer').show();$('#editorContainer').hide();grabPreview(true);\">visibility<\/span><div id=\"editor\"><textarea id=\"wikiTxt\" style=\"height:150px;max-height:150px;overflow-y:auto;width:100%;\"><\/textarea><\/div><\/span><br\/><span style=\"float:left;color:red;\" id=\"errorString\"><\/span><span style=\"float:right;\"><button class=\"mdl-button mdl-js-button mdl-js-ripple-effect\" onclick=\"window.parent.postMessage('closeDialog', '*');\">CANCEL<\/button><button id=\"submitBtn\" class=\"mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent\" onclick=\"submitEdit();\">`+ (customCallback ? customCallback : `Warn User`) + `<\/button><\/span><\/div><div id=\"usrPgPrevMth\" style=\"display:none;\"><span class=\"material-icons\" id=\"prevUsrPg\" style=\"cursor:pointer;position:relative;top:5px;padding-bottom:10px;\" onclick=\"returnTonoticeForm();\">arrow_back<\/span><div class=\"mdl-tooltip mdl-tooltip--large\" for=\"prevUsrPg\"><span style=\"font-size:x-small;\">Back to Notice Editor<\/span><\/div><div id=\"previewUsrPgMth\" style=\"height:95%;overflow:auto;\"><i>Generating preview...<\/i><div class=\"mdl-progress mdl-js-progress mdl-progress__indeterminate\"><\/div><pre id=\"uMloadingPre\" style=\"white-space:pre-wrap;\">`+ usrPgMonth +`<\/pre><\/div><\/div><div id=\"usrPgPrev\" style=\"display:none;\"><span class=\"material-icons\" id=\"prevUsrPg\" style=\"cursor:pointer;position:relative;top:5px;padding-bottom:10px;\" onclick=\"returnTonoticeForm();\">arrow_back<\/span><div class=\"mdl-tooltip mdl-tooltip--large\" for=\"prevUsrPg\"><span style=\"font-size:x-small;\">Back to Notice Editor<\/span><\/div><div id=\"previewUsrPg\" style=\"height:95%;overflow:auto;\"><i>Generating preview...<\/i><div class=\"mdl-progress mdl-js-progress mdl-progress__indeterminate\"><\/div><pre id=\"uloadingPre\" style=\"white-space:pre-wrap;\">`+ userPg +`<\/pre><\/div><\/div><script>function showThisMonthsUsrMsgs() {\n        $(\"#noticeFmContainer\").hide();\n        $(\"#usrPgPrev\").hide();\n        $(\"#usrPgPrevMth\").show();\n        \/\/ Generate preview if needed (i.e. loading pre still there)\n        if ($(\"#uMloadingPre\").length > 0) {\n            let wikiTxt = $(\"#uMloadingPre\").text();\n            window.parent.postMessage('generatePreview\\\\\\`'+ wikiTxt, '*');\n        }\n    }\n\n    function showUsrPg() {\n        $(\"#noticeFmContainer\").hide();\n        $(\"#usrPgPrev\").show();\n        $(\"#usrPgPrevMth\").hide();\n        \/\/ Generate preview if needed (i.e. loading pre still there)\n        if ($(\"#uloadingPre\").length > 0) {\n            let wikiTxt = $(\"#uloadingPre\").text();\n            window.parent.postMessage('generatePreview\\\\\\`'+ wikiTxt, '*');\n        }\n    }\n\n    function returnTonoticeForm() {\n        $(\"#noticeFmContainer\").show();\n        $(\"#usrPgPrevMth\").hide();\n        $(\"#usrPgPrev\").hide();\n    }\n\n        \/\/ Handle incoming data\n    window.onmessage = function(e){\n        if (e.data.action == 'parseWikiTxt') {\n            if ($(\"#usrPgPrevMth:visible\").length > 0) {\n                \/\/ user page month preview\n                $(\"#previewUsrPgMth\").html(e.data.result); \/\/ set content\n                return; \/\/ exit\n            } else if ($(\"#usrPgPrev:visible\").length > 0) {\n                \/\/ User page preview\n                $(\"#previewUsrPg\").html(e.data.result); \/\/ set content\n                return; \/\/ exit\n            }\n\n            \/\/ Normal preview\n            $(\"#preview\").html(e.data.result); \/\/ Set preview to content\n        } else if (e.data.action == 'recentPage') {\n            \/\/ On recent page selected\n            $(\"#relatedPage\").val(e.data.result);\n        }\n    };\n\n    \/\/ Search reasons\n    \/\/ Very basic but it works \n    $(\"input#template\").keydown(e=>{\n        if (e.key == \"Enter\") {\n            $($(\".mdl-menu__item:visible\")[0]).click(); \/\/ invoke click on first visible to select\n            refreshLevels($($(\".mdl-menu__item:visible\")[0]).attr(\"data-val\")); \/\/ refresh preview\n            return; \/\/ exit\n        }\n\n        \/\/ Else, continue normal search\n        let toSearch = document.getElementById(\"template\").value.toLowerCase();\n        $(\".mdl-menu__item\").each((x,y)=>{\n            if ($(y).html().toLowerCase().includes(toSearch)) {\n                $(y).show();\n            } else {\n                $(y).hide();\n            }\n        });\n\n            \/\/ Clear out headers with nothing under\n            $(\"span.rwNoticeCatagory\").each((i, el)=>{\n                if ($(el).find(\"li.mdl-menu__item:visible\").length == 0) {\n                    $(el).find(\".rwNoticeCatagoryHead\").hide();\n                } else {\n                    $(el).find(\".rwNoticeCatagoryHead\").show();\n                }\n            });\n    });\n\n\n\n    var grabPreview = fromCustomTxt=> {\n        \/\/ Generate preview\n        \/\/ Wikitext grab\n        if (fromCustomTxt) {\n            \/\/ Edited using Wikitext editor\n            var wikiTxt = document.getElementById(\"wikiTxt\").value;\n            if (!wikiTxt.includes(\"${rw.sign()}\")) {\n                \/\/ Not signed, warn\n                pushToast(\"Don't forget to sign your notice!\");\n            }\n            window.parent.postMessage('generatePreview\\\\\\`'+ wikiTxt, '*');\n        } else {\n            if ($('#editorContainer:visible').length > 0) {\n                \/\/ Editor is open, we don't want to overwrite by accident.\n                pushToast(\"Warning: This will overwrite your changes. Switch back to preview to confirm.\");\n                return;\n            }\n            \/\/ Get preview as usual\n            getTemplateName(name=>{\n            var wikiTxt = \"{{subst:\"+ name +\"}} \" + \"${rw.sign()}\";\n            \/\/ Check if this user is an IP, if so, add the advice template to the end\n            if (`+ (rw.info.isUserAnon(rw.info.targetUsername(un)) ? \"true\" : \"false\") +` == true) {\n                wikiTxt += \"${rw.sharedIPadvice()}\";\n            }\n            document.getElementById(\"wikiTxt\").value = wikiTxt; \/\/ set edit box\n            window.parent.postMessage('generatePreview\\\\\\`'+ wikiTxt, '*');\n            }); \n        } \n    }\n\n    var rules = `+ JSON.stringify(rw.rules) +`; \/\/ get rules from host\n    var refreshLevels = i=> {\n       if (rules[i].warningLevels.includes(0)) {\n           \/\/ Single notice\n           $(\"#warningRadioButtons\").hide();\n           $(\"#singleNoticeOnly\").show();\n           $(\"#singleWarnOnly\").hide();\n       } else if (rules[i].warningLevels.includes(6)) {\n           \/\/ Single warning\n           $(\"#warningRadioButtons\").hide();\n           $(\"#singleNoticeOnly\").hide();\n           $(\"#singleWarnOnly\").show();\n       } else {\n           \/\/ Normal warning\n           $(\"#warningRadioButtons\").show();\n           $(\"#singleNoticeOnly\").hide();\n           $(\"#singleWarnOnly\").hide();\n\n           if (!rules[i].warningLevels.includes(1)) {\n            \/\/ No l1 warning\n            $(\"#l1Lbl\").hide();\n           } else {\n            $(\"#l1Lbl\").show();\n           }\n\n           if (!rules[i].warningLevels.includes(2)) {\n            \/\/ No l2 warning\n            $(\"#l2Lbl\").hide();\n           } else {\n            $(\"#l2Lbl\").show();\n           }\n           if (!rules[i].warningLevels.includes(3)) {\n            \/\/ No l3 warning\n            $(\"#l3Lbl\").hide();\n           } else {\n            $(\"#l3Lbl\").show();\n           }\n\n           \/\/ LEVEL 4\n           if (!rules[i].warningLevels.includes(4)) {\n            \/\/ No final warning\n            $(\"#l4Lbl\").hide();\n            $(\"#l4noLbl\").show();\n           } else {\n            $(\"#l4Lbl\").show();\n            $(\"#l4noLbl\").hide();\n           }\n           if (!rules[i].warningLevels.includes(5)) {\n            \/\/ No ONLY warning\n            $(\"#l4imLbl\").hide();\n           } else {\n            $(\"#l4imLbl\").show();\n           }\n       }\n\n       if (rules[i].note != null) {\n           \/\/ A disclaimer toast needs to be shown\n           pushToast(rules[i].note);\n       }\n\n       let noneStandard = {\n                'uw-agf-sock': 'Optional username of other account (without User:) ',\n                'uw-bite': \"Username of 'bitten' user (without User:) \",\n                'uw-socksuspect': 'Username of sock master, if known (without User:) ',\n                'uw-username': 'Username violates policy because... ',\n                'uw-aiv': 'Optional username that was reported (without User:) '\n        }; \/\/ These all take a different thing and only have 1 input\n\n        if (noneStandard[rules[i].template] != null) {\n            \/\/ Requires special input\n            $(\"#specialInfo\").show();\n            $(\"#ordInfo\").hide();\n            $(\"#specialInfoTt\").html(noneStandard[rules[i].template]); \/\/ Set tool tip text\n        } else {\n            \/\/ Doesn't require\n            $(\"#specialInfo\").hide();\n            $(\"#ordInfo\").show();\n        }\n    }\n\n    function pushToast(text) {window.parent.postMessage('pushToast\\\\\\`' + text);} \/\/ Push toast to host\n\n    var getTemplateName = callback=> { \/\/ CALLBACK IS ONLY CALLED IF SUCCESSFUL\n        let currentTemplate = \"\";\n        let currentLevel = \"\";\n        var data = $('#newNoticeForm').serializeArray().reduce(function(obj, item) {\n            obj[item.name] = item.value;\n            return obj;\n            }, {}); \/\/ form data\n\n        \/\/ LEVEL\n        if ($(\"input:radio:visible:checked\").length == 0) { \/\/ If no visble radio buttons checked\n            if ($(\"#singleNoticeOnly:visible\").length > 0 || $(\"#singleWarnOnly:visible\").length > 0) {\n                \/\/ No warning level needed, leaving for readability\n            } else {\n                \/\/ No radio button pressed, not a single warning\/notice\n                $(\"#errorString\").text(\"Please select a warning level.\");\n                return;\n            }\n        } else {\n            \/\/ Radio button\n            currentLevel = data.warnLevel; \/\/ Set to selected radiobutton value\n        }\n\n        \/\/ Check if we're warning ourselves (rw16)\n        if (document.getElementById(\"trgtUsrVisualBox\").value == \"${rw.info.getUsername()}\") {\n            \/\/ We are warning ourselves, so stop it\n            $(\"#errorString\").html(\"You cannot warn yourself. <br\/> <a href='#' id='testSandbox'>Test this feature with a sandbox<\/a>\");\n\n            \/\/ Add onclick for sandbox link - change target and refresh with submitedit\n            $(\"#testSandbox\").click(()=>{$(\"#trgtUsrVisualBox\").val(\"Sandbox for user warnings\");submitEdit();});\n            return; \/\/ Do not continue\n        }\n\n        \/\/ TEMPLATE\n        if (data.template == \"\") {\n            \/\/ No reason selected\n            $(\"#errorString\").text(\"Select a reason.\");\n            return;\n        }\n        \/\/ All good\n        $(\"#errorString\").text(\"\");\n        currentTemplate = rules[data.template].template; \/\/ assemble\n        if ($(\"#specialInfo:visible\").length > 0) {\n            callback(currentTemplate + currentLevel + \"|\" + data.specialInfo); \/\/ callback w data for special\n        } else {\n            callback(currentTemplate + currentLevel + \"|\" + $(\"#relatedPage\").val() + \"|\" + \"'' \"+ data.extraInfo +\"''\"); \/\/ callback, extra info italics\n        }\n    };\n\n    function submitEdit() {\n        \/\/ Add notice to page\n        getTemplateName(r=>{ \/\/ acts as validation\n            \/\/ SEND IT\n            var data = $('#newNoticeForm').serializeArray().reduce(function(obj, item) {\n                obj[item.name] = item.value;\n                return obj;\n                }, {}); \/\/ form data\n\n            var wikiTxt = document.getElementById(\"wikiTxt\").value;\n            if (!wikiTxt.includes(\"${rw.sign()}\")) {\n                \/\/ Not signed, warn\n                $(\"#errorString\").text(\"Please sign your notice.\");\n                return; \/\/ Do not continue\n            }\n            \/\/ Format: applyNotice,target,wikitxt,warnlevel|rulename\n            window.parent.postMessage(('applyNotice\\\\\\`' + document.getElementById(\"trgtUsrVisualBox\").value + '\\\\\\`' + wikiTxt + '\\\\\\`' + rules[data.template].name + '\\\\\\`' + r)); \/\/ Push upstairs and commit\n            window.parent.postMessage(\"closeDialog\"); \/\/ We done here. Top will refresh or reshow if error occurs.\n        });\n    }\n\n\n    \/\/ Check for change in form data\n    \/\/ then 500ms since last change, update preview\n    var oldData = \"\";\n    var updatePreviewTOut;\n    setInterval(()=>{\n        var data = $('#newNoticeForm').serializeArray().reduce((obj, item) => {\n            obj[item.name] = item.value;\n            return obj;\n            }, {}); \/\/ form data\n        if (JSON.stringify(data) === oldData) {\n            \/\/ No change\n        } else {\n            oldData = JSON.stringify(data); \/\/ set\n            $(\"#submitBtn\").hide(); \/\/ hide until template refresh\n            \/\/ Change. Set timeout for 500ms\n            try {\n                clearTimeout(updatePreviewTOut); \/\/ clear timeout so it resets after last change\n            } catch (e) {}\n            updatePreviewTOut = setTimeout(()=>{\n                grabPreview();\n                $(\"#submitBtn\").show();\n            }, 500); \/\/ show previews after 500ms since last change\n        }\n       \n    }, 100);\n\n    \/\/ If autoselect enabled and autoselect index set, apply to that index\n    `+ ((autoLevelSelectEnable) && (autoSelectReasonIndex != null) ? `\n        \/\/ Activate click event for this index after 250ms\n        setTimeout(()=>{\n            $(\"#reasonsBox > input:visible\").click();\n            setTimeout(()=>{\n                $(\"li.mdl-menu__item[data-val='${autoSelectReasonIndex}']\").click();\n                refreshLevels(\"${autoSelectReasonIndex}\"); \/\/ update levels (will be set back to int)\n            },250);\n        },250);\n    ` : \"\") +`<\/script>`","newMsg.html":"`<style>h2{font-size:20px;line-height:0}.mw-editsection{display:none}<\/style><h2 style=\"font-weight:200;font-size:45px;line-height:48px;\">New Talk Page Message<\/h2><form id=\"newMsgForm\"><div class=\"mdl-textfield mdl-js-textfield mdl-textfield--floating-label\" style=\"width:100%\"><input class=\"mdl-textfield__input\" type=\"text\" id=\"trgtUsrVisualBox\" value=\"`+ rw.info.targetUsername(un) +`\" readonly><label class=\"mdl-textfield__label\" for=\"trgtUsrVisualBox\">Target<\/label><div class=\"mdl-tooltip\" for=\"trgtUsrVisualBox\">To target a different user, please visit their userpage.<\/div><\/div><span id=\"previewContainer\" style=\"display:none;\"><span id=\"editBtn\" class=\"material-icons\" style=\"font-size:16px;padding-bottom:3px;float:right;padding-right:5px;cursor:pointer;\" onclick=\"$('#previewContainer').hide();$('#editorContainer').show();\">create<\/span><div id=\"preview\" style=\"height:150px;overflow-y:auto;width:100%;\"><\/div><\/span><span id=\"editorContainer\"><span id=\"previewBtn\" class=\"material-icons\" style=\"font-size:16px;padding-bottom:3px;float:right;padding-right:5px;cursor:pointer;\" onclick=\"$('#previewContainer').show();$('#editorContainer').hide();grabPreview();\">visibility<\/span><div id=\"editor\"><textarea id=\"wikiTxt\" name=\"wikiTxt\" style=\"height:150px;max-height:150px;overflow-y:auto;width:100%;\">== Your Message Title ==\nYour message here. ${rw.sign()}<\/textarea><\/div><\/span><\/form><span style=\"float:right;\"><button class=\"mdl-button mdl-js-button mdl-js-ripple-effect\" onclick=\"window.parent.postMessage('closeDialog', '*');\">CANCEL<\/button><button id=\"submitBtn\" class=\"mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent\" onclick=\"sendMessage();\">`+ (buttonTxt == null ? \"SEND MESSAGE\" : buttonTxt) +`<\/button><\/span><script>\/\/ Handle incoming data\n    window.onmessage = function(e){\n        if (e.data.action == 'parseWikiTxt') {\n            $(\"#preview\").html(e.data.result); \/\/ Set preview to content\n        }\n    };\n\n    function pushToast(text) {window.parent.postMessage('pushToast\\\\\\`' + text);} \/\/ Push toast to host\n\n    function grabPreview() {\n        var wikiTxt = document.getElementById(\"wikiTxt\").value;\n        if (!wikiTxt.includes(\"${rw.sign()}\")) {\n            \/\/ Not signed, warn\n            pushToast(\"Don't forget to sign your message!\");\n        }\n        window.parent.postMessage('generatePreview\\\\\\`'+ wikiTxt, '*');\n    }\n\n    function sendMessage() {\n        \/\/ Send it!\n        var data = $('#newMsgForm').serializeArray().reduce(function(obj, item) {\n                obj[item.name] = item.value;\n                return obj;\n                }, {}); \/\/ form data\n\n        var wikiTxt = data.wikiTxt;\n        if (!wikiTxt.includes(\"${rw.sign()}\")) {\n            \/\/ Not signed, warn\n            pushToast(\"WARNING: You haven't signed your message with '${rw.sign()}'\");\n        }\n        window.parent.postMessage('applyNotice\\\\\\`' + document.getElementById(\"trgtUsrVisualBox\").value + '\\\\\\`' + wikiTxt + '\\\\\\`' + \"New message\"); \/\/ Push upstairs and commit\n        window.parent.postMessage(\"closeDialog\"); \/\/ We done here. Top will refresh or reshow if error occurs.\n    }<\/script>`","speedyDeletionp1.html":"`<h2 style=\"font-weight:200;font-size:45px;line-height:48px;\">Request Speedy Deletion<\/h2><div class=\"cntContainer\" style=\"height:350px;overflow:auto;\"><form id=\"newMsgForm\" onsubmit=\"pushRollback();\" action=\"#\"><div class=\"mdl-textfield mdl-js-textfield mdl-textfield--floating-label getmdl-select\" style=\"width:100%\"><input type=\"text\" value=\"\" class=\"mdl-textfield__input\" id=\"reason\" style=\"font-size:14px;\" onkeypress=\"searchReasons();\" autocomplete=\"off\"><input type=\"hidden\" value=\"\" name=\"reason\"><i class=\"mdl-icon-toggle__label material-icons\">keyboard_arrow_down<\/i><label for=\"template\" class=\"mdl-textfield__label\">I'm requesting the speedy deletion of...<\/label><ul for=\"template\" class=\"mdl-menu mdl-menu--bottom-left mdl-js-menu\" style=\"overflow-y:scroll;height:250px\">`+ finalStr +`<\/ul><\/div><p id=\"desP\">Please select a valid reason.<\/p><div id=\"textBcontainer\" style=\"display:none;\"><div class=\"mdl-textfield mdl-js-textfield mdl-textfield--floating-label\" style=\"width:100%\"><input class=\"mdl-textfield__input\" type=\"text\" id=\"customInput\" name=\"customInput\"><label class=\"mdl-textfield__label\" for=\"customInput\" id=\"customInputLabel\">Custom Reason<\/label><div class=\"mdl-tooltip\" for=\"customInput\" id=\"customInputTt\">Enter this info correctly<\/div><\/div><\/div><\/form><span style=\"color:red;font-size:small;\">Before nominating a page for speedy deletion, consider whether it could be improved, reduced to a stub, merged or redirected elsewhere,\n        reverted to a better previous revision, or handled in <a href=\"https:\/\/en.wikipedia.org\/wiki\/Wikipedia:Deletion_policy#Alternatives_to_deletion\" target=\"_blank\">some other way<\/a>. A page\n        is eligible for speedy deletion only if all of its revisions are also eligible.<br\/><br\/><b>Are you sure a speedy deletion request is the best option and the data you have entered is correct?<\/b><\/span><br\/><span style=\"float:right;\"><button class=\"mdl-button mdl-js-button mdl-js-ripple-effect\" onclick=\"window.parent.postMessage('closeDialog', '*');\">CANCEL<\/button><button id=\"submitBtn\" class=\"mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent\" onclick=\"pushRollback();\">YES, PROPOSE SPEEDY DELETION<\/button><\/span><\/div><script>function pushRollback() {\n        var data = $('#newMsgForm').serializeArray().reduce(function(obj, item) {\n                obj[item.name] = item.value;\n                return obj;\n                }, {}); \/\/ form data\n        \/\/ Submit it\n        console.log(data);\n        window.parent.postMessage(\"csdR\\\\\\`\"+data.reason + '\\\\\\`' + data.customInput); \/\/ Push upstairs\n        window.parent.postMessage(\"closeDialog\"); \/\/ We done here.\n        \n    }\n    \/\/ Search reasons\n    \/\/ Very basic but it works TODO: work on, including selecting best match on ENTER\n    function searchReasons() {\n        let toSearch = document.getElementById(\"reason\").value.toLowerCase();\n        $(\".mdl-menu__item\").each((x,y)=>{\n            if (y.innerText.toLowerCase().includes(toSearch)) {\n                $(y).show();\n            } else {\n                $(y).hide();\n            }\n        });\n    }\n\n    var refreshLevels = i=>{\n        \/\/ Show the correct description and textbox\n        let speedyDeleteReasons = `+ JSON.stringify(speedyDeleteReasons) +`;\n        let reason = eval(i);\n        console.log(reason);\n        \/\/ Info box\n        $(\"#desP\").html('<span class=\"material-icons\" style=\"float:left;padding-right:5px;cursor:default;\">info<\/span>' + reason.helpText);\n        \n\n        if (reason.input != \"\") {\n            \/\/ Requires a custom input, show\n            $(\"#customInputLabel\").text(reason.input);\n            $(\"#textBcontainer\").show(); \/\/ Make the textbox visible\n            try {\n                if (reason.inputTooltip.length > 0) {\n                \/\/ Tool tip too\n                $(\"#customInputTt\").show();\n                $(\"#customInputTt\").text(reason.inputTooltip);\n                } else {\n                    \/\/ No tooltip\n                    $(\"#customInputTt\").hide();\n                }\n            } catch (error) {\n                \/\/ No tooltip\n                $(\"#customInputTt\").hide();\n            }\n        } else {\n            $(\"#textBcontainer\").hide();\n        }\n       \n    }<\/script>`","preferences.html":"`<script>var materialIcons = [\"3d_rotation\",\"accessibility\",\"accessibility_new\",\"accessible\",\"accessible_forward\",\"account_balance\",\"account_balance_wallet\",\"account_box\",\"account_circle\",\"add_shopping_cart\",\"alarm\",\"alarm_add\",\"alarm_off\",\"alarm_on\",\"all_inbox\",\"all_out\",\"android\",\"announcement\",\"arrow_right_alt\",\"aspect_ratio\",\"assessment\",\"assignment\",\"assignment_ind\",\"assignment_late\",\"assignment_return\",\"assignment_returned\",\"assignment_turned_in\",\"autorenew\",\"backup\",\"book\",\"bookmark\",\"bookmark_border\",\"bookmarks\",\"bug_report\",\"build\",\"cached\",\"calendar_today\",\"calendar_view_day\",\"camera_enhance\",\"cancel_schedule_send\",\"card_giftcard\",\"card_membership\",\"card_travel\",\"change_history\",\"check_circle\",\"check_circle_outline\",\"chrome_reader_mode\",\"class\",\"code\",\"commute\",\"compare_arrows\",\"contact_support\",\"contactless\",\"copyright\",\"credit_card\",\"dashboard\",\"date_range\",\"delete\",\"delete_forever\",\"delete_outline\",\"description\",\"dns\",\"done\",\"done_all\",\"done_outline\",\"donut_large\",\"donut_small\",\"drag_indicator\",\"eco\",\"eject\",\"euro_symbol\",\"event\",\"event_seat\",\"exit_to_app\",\"explore\",\"explore_off\",\"extension\",\"face\",\"favorite\",\"favorite_border\",\"feedback\",\"find_in_page\",\"find_replace\",\"fingerprint\",\"flight_land\",\"flight_takeoff\",\"flip_to_back\",\"flip_to_front\",\"g_translate\",\"gavel\",\"get_app\",\"gif\",\"grade\",\"group_work\",\"help\",\"help_outline\",\"highlight_off\",\"history\",\"home\",\"horizontal_split\",\"hourglass_empty\",\"hourglass_full\",\"http\",\"https\",\"important_devices\",\"info\",\"input\",\"invert_colors\",\"label\",\"label_important\",\"label_off\",\"language\",\"launch\",\"line_style\",\"line_weight\",\"list\",\"lock\",\"lock_open\",\"loyalty\",\"markunread_mailbox\",\"maximize\",\"minimize\",\"note_add\",\"offline_bolt\",\"offline_pin\",\"opacity\",\"open_in_browser\",\"open_in_new\",\"open_with\",\"pageview\",\"pan_tool\",\"payment\",\"perm_camera_mic\",\"perm_contact_calendar\",\"perm_data_setting\",\"perm_device_information\",\"perm_identity\",\"perm_media\",\"perm_phone_msg\",\"perm_scan_wifi\",\"pets\",\"picture_in_picture\",\"picture_in_picture_alt\",\"play_for_work\",\"polymer\",\"power_settings_new\",\"pregnant_woman\",\"print\",\"query_builder\",\"question_answer\",\"receipt\",\"record_voice_over\",\"redeem\",\"remove_shopping_cart\",\"reorder\",\"report_problem\",\"restore\",\"restore_from_trash\",\"restore_page\",\"room\",\"rounded_corner\",\"rowing\",\"schedule\",\"search\",\"settings\",\"settings_applications\",\"settings_backup_restore\",\"settings_bluetooth\",\"settings_brightness\",\"settings_cell\",\"settings_ethernet\",\"settings_input_antenna\",\"settings_input_component\",\"settings_input_composite\",\"settings_input_hdmi\",\"settings_input_svideo\",\"settings_overscan\",\"settings_phone\",\"settings_power\",\"settings_remote\",\"settings_voice\",\"shop\",\"shop_two\",\"shopping_basket\",\"shopping_cart\",\"speaker_notes\",\"speaker_notes_off\",\"spellcheck\",\"stars\",\"store\",\"subject\",\"supervised_user_circle\",\"supervisor_account\",\"swap_horiz\",\"swap_horizontal_circle\",\"swap_vert\",\"swap_vertical_circle\",\"sync_alt\",\"system_update_alt\",\"tab\",\"tab_unselected\",\"text_rotate_up\",\"text_rotate_vertical\",\"text_rotation_angledown\",\"text_rotation_angleup\",\"text_rotation_down\",\"text_rotation_none\",\"theaters\",\"thumb_down\",\"thumb_up\",\"thumbs_up_down\",\"timeline\",\"toc\",\"today\",\"toll\",\"touch_app\",\"track_changes\",\"translate\",\"trending_down\",\"trending_flat\",\"trending_up\",\"turned_in\",\"turned_in_not\",\"update\",\"verified_user\",\"vertical_split\",\"view_agenda\",\"view_array\",\"view_carousel\",\"view_column\",\"view_day\",\"view_headline\",\"view_list\",\"view_module\",\"view_quilt\",\"view_stream\",\"view_week\",\"visibility\",\"visibility_off\",\"voice_over_off\",\"watch_later\",\"work\",\"work_off\",\"work_outline\",\"youtube_searched_for\",\"zoom_in\",\"zoom_out\",\"add_alert\",\"error\",\"error_outline\",\"notification_important\",\"warning\",\"4k\",\"add_to_queue\",\"airplay\",\"album\",\"art_track\",\"av_timer\",\"branding_watermark\",\"call_to_action\",\"closed_caption\",\"control_camera\",\"equalizer\",\"explicit\",\"fast_forward\",\"fast_rewind\",\"featured_play_list\",\"featured_video\",\"fiber_dvr\",\"fiber_manual_record\",\"fiber_new\",\"fiber_pin\",\"fiber_smart_record\",\"forward_10\",\"forward_30\",\"forward_5\",\"games\",\"hd\",\"hearing\",\"high_quality\",\"library_add\",\"library_add_check\",\"library_books\",\"library_music\",\"loop\",\"mic\",\"mic_none\",\"mic_off\",\"missed_video_call\",\"movie\",\"music_video\",\"new_releases\",\"not_interested\",\"note\",\"pause\",\"pause_circle_filled\",\"pause_circle_outline\",\"play_arrow\",\"play_circle_filled\",\"play_circle_outline\",\"playlist_add\",\"playlist_add_check\",\"playlist_play\",\"queue\",\"queue_music\",\"queue_play_next\",\"radio\",\"recent_actors\",\"remove_from_queue\",\"repeat\",\"repeat_one\",\"replay\",\"replay_10\",\"replay_30\",\"replay_5\",\"shuffle\",\"skip_next\",\"skip_previous\",\"slow_motion_video\",\"snooze\",\"sort_by_alpha\",\"speed\",\"stop\",\"subscriptions\",\"subtitles\",\"surround_sound\",\"video_call\",\"video_label\",\"video_library\",\"videocam\",\"videocam_off\",\"volume_down\",\"volume_mute\",\"volume_off\",\"volume_up\",\"web\",\"web_asset\",\"add_ic_call\",\"alternate_email\",\"business\",\"call\",\"call_end\",\"call_made\",\"call_merge\",\"call_missed\",\"call_missed_outgoing\",\"call_received\",\"call_split\",\"cancel_presentation\",\"chat\",\"chat_bubble\",\"chat_bubble_outline\",\"clear_all\",\"comment\",\"contact_mail\",\"contact_phone\",\"contacts\",\"desktop_access_disabled\",\"dialer_sip\",\"dialpad\",\"domain_disabled\",\"duo\",\"email\",\"forum\",\"import_contacts\",\"import_export\",\"invert_colors_off\",\"list_alt\",\"live_help\",\"location_off\",\"location_on\",\"mail_outline\",\"message\",\"mobile_screen_share\",\"no_sim\",\"pause_presentation\",\"person_add_disabled\",\"phone\",\"phone_disabled\",\"phone_enabled\",\"phonelink_erase\",\"phonelink_lock\",\"phonelink_ring\",\"phonelink_setup\",\"portable_wifi_off\",\"present_to_all\",\"print_disabled\",\"ring_volume\",\"rss_feed\",\"screen_share\",\"sentiment_satisfied_alt\",\"speaker_phone\",\"stay_current_landscape\",\"stay_current_portrait\",\"stay_primary_landscape\",\"stay_primary_portrait\",\"stop_screen_share\",\"swap_calls\",\"textsms\",\"unsubscribe\",\"voicemail\",\"vpn_key\",\"add\",\"add_box\",\"add_circle\",\"add_circle_outline\",\"amp_stories\",\"archive\",\"backspace\",\"ballot\",\"block\",\"clear\",\"create\",\"delete_sweep\",\"drafts\",\"dynamic_feed\",\"file_copy\",\"filter_list\",\"flag\",\"font_download\",\"forward\",\"gesture\",\"how_to_reg\",\"how_to_vote\",\"inbox\",\"link\",\"link_off\",\"low_priority\",\"mail\",\"markunread\",\"move_to_inbox\",\"next_week\",\"outlined_flag\",\"policy\",\"redo\",\"remove\",\"remove_circle\",\"remove_circle_outline\",\"reply\",\"reply_all\",\"report\",\"report_off\",\"save\",\"save_alt\",\"select_all\",\"send\",\"sort\",\"square_foot\",\"text_format\",\"unarchive\",\"undo\",\"waves\",\"weekend\",\"where_to_vote\",\"access_alarm\",\"access_alarms\",\"access_time\",\"add_alarm\",\"add_to_home_screen\",\"airplanemode_active\",\"airplanemode_inactive\",\"battery_alert\",\"battery_charging_full\",\"battery_full\",\"battery_std\",\"battery_unknown\",\"bluetooth\",\"bluetooth_connected\",\"bluetooth_disabled\",\"bluetooth_searching\",\"brightness_auto\",\"brightness_high\",\"brightness_low\",\"brightness_medium\",\"data_usage\",\"developer_mode\",\"devices\",\"dvr\",\"gps_fixed\",\"gps_not_fixed\",\"gps_off\",\"graphic_eq\",\"location_disabled\",\"location_searching\",\"mobile_friendly\",\"mobile_off\",\"nfc\",\"screen_lock_landscape\",\"screen_lock_portrait\",\"screen_lock_rotation\",\"screen_rotation\",\"sd_storage\",\"settings_system_daydream\",\"signal_cellular_4_bar\",\"signal_cellular_alt\",\"signal_cellular_connected_no_internet_4_bar\",\"signal_cellular_no_sim\",\"signal_cellular_null\",\"signal_cellular_off\",\"signal_wifi_4_bar\",\"signal_wifi_4_bar_lock\",\"signal_wifi_off\",\"storage\",\"usb\",\"wallpaper\",\"widgets\",\"wifi_lock\",\"wifi_tethering\",\"add_comment\",\"attach_file\",\"attach_money\",\"bar_chart\",\"border_all\",\"border_bottom\",\"border_clear\",\"border_horizontal\",\"border_inner\",\"border_left\",\"border_outer\",\"border_right\",\"border_style\",\"border_top\",\"border_vertical\",\"bubble_chart\",\"drag_handle\",\"format_align_center\",\"format_align_justify\",\"format_align_left\",\"format_align_right\",\"format_bold\",\"format_clear\",\"format_color_reset\",\"format_indent_decrease\",\"format_indent_increase\",\"format_italic\",\"format_line_spacing\",\"format_list_bulleted\",\"format_list_numbered\",\"format_list_numbered_rtl\",\"format_paint\",\"format_quote\",\"format_shapes\",\"format_size\",\"format_strikethrough\",\"format_textdirection_l_to_r\",\"format_textdirection_r_to_l\",\"format_underlined\",\"functions\",\"height\",\"highlight\",\"insert_chart\",\"insert_chart_outlined\",\"insert_comment\",\"insert_drive_file\",\"insert_emoticon\",\"insert_invitation\",\"insert_link\",\"insert_photo\",\"linear_scale\",\"merge_type\",\"mode_comment\",\"monetization_on\",\"money_off\",\"multiline_chart\",\"notes\",\"pie_chart\",\"post_add\",\"publish\",\"scatter_plot\",\"score\",\"short_text\",\"show_chart\",\"space_bar\",\"strikethrough_s\",\"table_chart\",\"text_fields\",\"title\",\"vertical_align_bottom\",\"vertical_align_center\",\"vertical_align_top\",\"wrap_text\",\"attachment\",\"cloud\",\"cloud_circle\",\"cloud_done\",\"cloud_download\",\"cloud_off\",\"cloud_queue\",\"cloud_upload\",\"create_new_folder\",\"folder\",\"folder_open\",\"folder_shared\",\"cast\",\"cast_connected\",\"computer\",\"desktop_mac\",\"desktop_windows\",\"developer_board\",\"device_hub\",\"device_unknown\",\"devices_other\",\"dock\",\"gamepad\",\"headset\",\"headset_mic\",\"keyboard\",\"keyboard_arrow_down\",\"keyboard_arrow_left\",\"keyboard_arrow_right\",\"keyboard_arrow_up\",\"keyboard_backspace\",\"keyboard_capslock\",\"keyboard_hide\",\"keyboard_return\",\"keyboard_tab\",\"keyboard_voice\",\"laptop\",\"laptop_chromebook\",\"laptop_mac\",\"laptop_windows\",\"memory\",\"mouse\",\"phone_android\",\"phone_iphone\",\"phonelink\",\"phonelink_off\",\"power_input\",\"router\",\"scanner\",\"security\",\"sim_card\",\"smartphone\",\"speaker\",\"speaker_group\",\"tablet\",\"tablet_android\",\"tablet_mac\",\"toys\",\"tv\",\"videogame_asset\",\"watch\",\"add_a_photo\",\"add_photo_alternate\",\"add_to_photos\",\"adjust\",\"assistant\",\"assistant_photo\",\"audiotrack\",\"blur_circular\",\"blur_linear\",\"blur_off\",\"blur_on\",\"brightness_1\",\"brightness_2\",\"brightness_3\",\"brightness_4\",\"brightness_5\",\"brightness_6\",\"brightness_7\",\"broken_image\",\"brush\",\"burst_mode\",\"camera\",\"camera_alt\",\"camera_front\",\"camera_rear\",\"camera_roll\",\"center_focus_strong\",\"center_focus_weak\",\"collections\",\"collections_bookmark\",\"color_lens\",\"colorize\",\"compare\",\"control_point\",\"control_point_duplicate\",\"crop\",\"crop_16_9\",\"crop_3_2\",\"crop_5_4\",\"crop_7_5\",\"crop_din\",\"crop_free\",\"crop_landscape\",\"crop_original\",\"crop_portrait\",\"crop_rotate\",\"crop_square\",\"dehaze\",\"details\",\"edit\",\"euro\",\"exposure\",\"exposure_neg_1\",\"exposure_neg_2\",\"exposure_plus_1\",\"exposure_plus_2\",\"exposure_zero\",\"filter\",\"filter_1\",\"filter_2\",\"filter_3\",\"filter_4\",\"filter_5\",\"filter_6\",\"filter_7\",\"filter_8\",\"filter_9\",\"filter_9_plus\",\"filter_b_and_w\",\"filter_center_focus\",\"filter_drama\",\"filter_frames\",\"filter_hdr\",\"filter_none\",\"filter_tilt_shift\",\"filter_vintage\",\"flare\",\"flash_auto\",\"flash_off\",\"flash_on\",\"flip\",\"flip_camera_android\",\"flip_camera_ios\",\"gradient\",\"grain\",\"grid_off\",\"grid_on\",\"hdr_off\",\"hdr_on\",\"hdr_strong\",\"hdr_weak\",\"healing\",\"image\",\"image_aspect_ratio\",\"image_search\",\"iso\",\"landscape\",\"leak_add\",\"leak_remove\",\"lens\",\"linked_camera\",\"looks\",\"looks_3\",\"looks_4\",\"looks_5\",\"looks_6\",\"looks_one\",\"looks_two\",\"loupe\",\"monochrome_photos\",\"movie_creation\",\"movie_filter\",\"music_note\",\"music_off\",\"nature\",\"nature_people\",\"navigate_before\",\"navigate_next\",\"palette\",\"panorama\",\"panorama_fish_eye\",\"panorama_horizontal\",\"panorama_vertical\",\"panorama_wide_angle\",\"photo\",\"photo_album\",\"photo_camera\",\"photo_filter\",\"photo_library\",\"photo_size_select_actual\",\"photo_size_select_large\",\"photo_size_select_small\",\"picture_as_pdf\",\"portrait\",\"remove_red_eye\",\"rotate_90_degrees_ccw\",\"rotate_left\",\"rotate_right\",\"shutter_speed\",\"slideshow\",\"straighten\",\"style\",\"switch_camera\",\"switch_video\",\"tag_faces\",\"texture\",\"timelapse\",\"timer\",\"timer_10\",\"timer_3\",\"timer_off\",\"tonality\",\"transform\",\"tune\",\"view_comfy\",\"view_compact\",\"vignette\",\"wb_auto\",\"wb_cloudy\",\"wb_incandescent\",\"wb_iridescent\",\"wb_sunny\",\"360\",\"add_location\",\"atm\",\"beenhere\",\"category\",\"compass_calibration\",\"departure_board\",\"directions\",\"directions_bike\",\"directions_boat\",\"directions_bus\",\"directions_car\",\"directions_railway\",\"directions_run\",\"directions_subway\",\"directions_transit\",\"directions_walk\",\"edit_attributes\",\"edit_location\",\"ev_station\",\"fastfood\",\"flight\",\"hotel\",\"layers\",\"layers_clear\",\"local_activity\",\"local_airport\",\"local_atm\",\"local_bar\",\"local_cafe\",\"local_car_wash\",\"local_convenience_store\",\"local_dining\",\"local_drink\",\"local_florist\",\"local_gas_station\",\"local_grocery_store\",\"local_hospital\",\"local_hotel\",\"local_laundry_service\",\"local_library\",\"local_mall\",\"local_movies\",\"local_offer\",\"local_parking\",\"local_pharmacy\",\"local_phone\",\"local_pizza\",\"local_play\",\"local_post_office\",\"local_printshop\",\"local_see\",\"local_shipping\",\"local_taxi\",\"map\",\"menu_book\",\"money\",\"museum\",\"my_location\",\"navigation\",\"near_me\",\"not_listed_location\",\"person_pin\",\"person_pin_circle\",\"pin_drop\",\"place\",\"rate_review\",\"restaurant\",\"restaurant_menu\",\"satellite\",\"store_mall_directory\",\"streetview\",\"subway\",\"terrain\",\"traffic\",\"train\",\"tram\",\"transfer_within_a_station\",\"transit_enterexit\",\"trip_origin\",\"two_wheeler\",\"zoom_out_map\",\"apps\",\"arrow_back\",\"arrow_back_ios\",\"arrow_downward\",\"arrow_drop_down\",\"arrow_drop_down_circle\",\"arrow_drop_up\",\"arrow_forward\",\"arrow_forward_ios\",\"arrow_left\",\"arrow_right\",\"arrow_upward\",\"cancel\",\"check\",\"chevron_left\",\"chevron_right\",\"close\",\"double_arrow\",\"expand_less\",\"expand_more\",\"first_page\",\"fullscreen\",\"fullscreen_exit\",\"home_work\",\"last_page\",\"menu\",\"menu_open\",\"more_horiz\",\"more_vert\",\"refresh\",\"subdirectory_arrow_left\",\"subdirectory_arrow_right\",\"unfold_less\",\"unfold_more\",\"account_tree\",\"adb\",\"airline_seat_flat\",\"airline_seat_flat_angled\",\"airline_seat_individual_suite\",\"airline_seat_legroom_extra\",\"airline_seat_legroom_normal\",\"airline_seat_legroom_reduced\",\"airline_seat_recline_extra\",\"airline_seat_recline_normal\",\"bluetooth_audio\",\"confirmation_number\",\"disc_full\",\"drive_eta\",\"enhanced_encryption\",\"event_available\",\"event_busy\",\"event_note\",\"folder_special\",\"live_tv\",\"mms\",\"more\",\"network_check\",\"network_locked\",\"no_encryption\",\"ondemand_video\",\"personal_video\",\"phone_bluetooth_speaker\",\"phone_callback\",\"phone_forwarded\",\"phone_in_talk\",\"phone_locked\",\"phone_missed\",\"phone_paused\",\"power\",\"power_off\",\"priority_high\",\"sd_card\",\"sms\",\"sms_failed\",\"sync\",\"sync_disabled\",\"sync_problem\",\"system_update\",\"tap_and_play\",\"time_to_leave\",\"tv_off\",\"vibration\",\"voice_chat\",\"vpn_lock\",\"wc\",\"wifi\",\"wifi_off\",\"ac_unit\",\"airport_shuttle\",\"all_inclusive\",\"apartment\",\"bathtub\",\"beach_access\",\"business_center\",\"casino\",\"child_care\",\"child_friendly\",\"fitness_center\",\"free_breakfast\",\"golf_course\",\"hot_tub\",\"house\",\"kitchen\",\"meeting_room\",\"no_meeting_room\",\"pool\",\"room_service\",\"rv_hookup\",\"smoke_free\",\"smoking_rooms\",\"spa\",\"storefront\",\"cake\",\"deck\",\"domain\",\"emoji_emotions\",\"emoji_events\",\"emoji_flags\",\"emoji_food_beverage\",\"emoji_nature\",\"emoji_objects\",\"emoji_people\",\"emoji_symbols\",\"emoji_transportation\",\"fireplace\",\"group\",\"group_add\",\"king_bed\",\"location_city\",\"mood\",\"mood_bad\",\"nights_stay\",\"notifications\",\"notifications_active\",\"notifications_none\",\"notifications_off\",\"notifications_paused\",\"outdoor_grill\",\"pages\",\"party_mode\",\"people\",\"people_alt\",\"people_outline\",\"person\",\"person_add\",\"person_outline\",\"plus_one\",\"poll\",\"public\",\"school\",\"sentiment_dissatisfied\",\"sentiment_satisfied\",\"sentiment_very_dissatisfied\",\"sentiment_very_satisfied\",\"share\",\"single_bed\",\"sports\",\"sports_baseball\",\"sports_basketball\",\"sports_cricket\",\"sports_esports\",\"sports_football\",\"sports_golf\",\"sports_handball\",\"sports_hockey\",\"sports_kabaddi\",\"sports_mma\",\"sports_motorsports\",\"sports_rugby\",\"sports_soccer\",\"sports_tennis\",\"sports_volleyball\",\"thumb_down_alt\",\"thumb_up_alt\",\"whatshot\",\"check_box\",\"check_box_outline_blank\",\"indeterminate_check_box\",\"radio_button_checked\",\"radio_button_unchecked\",\"star\",\"star_border\",\"star_half\",\"star_outline\",\"toggle_off\",\"toggle_on\"];\n\/\/ On settings load name: function handler\nvar onSettingsLoad = {};<\/script><script src=\"https:\/\/redwarn.toolforge.org\/cdn\/js\/sortable.js\"><\/script><script src=\"https:\/\/redwarn.toolforge.org\/cdn\/js\/jquery-sortable.js\"><\/script><link rel=\"stylesheet\" href=\"https:\/\/redwarn.toolforge.org\/cdn\/css\/jqueryContextMenu.css\"><script src=\"https:\/\/redwarn.toolforge.org\/cdn\/js\/jquery-contextmenu.js\"><\/script><script src=\"https:\/\/redwarn.toolforge.org\/cdn\/js\/jquery-ui-position.js\"><\/script><div class=\"mdl-layout mdl-js-layout mdl-layout--fixed-header\"><header class=\"mdl-layout__header\"><div class=\"mdl-layout__header-row\"><span class=\"mdl-layout-title\" style=\"width:calc(100% - 60px);\">${rw.logoHTML} Preferences<\/span><div id=\"apply\" class=\"icon material-icons\" style=\"float:right;\"><span style=\"cursor:pointer;padding-right:15px;\" onclick=\"saveConfig();\">save<\/span><\/div><div class=\"mdl-tooltip\" for=\"apply\">Apply Changes<\/div><div id=\"close\" class=\"icon material-icons\" style=\"float:right;\"><span style=\"cursor:pointer;padding-right:15px;\" onclick=\"window.parent.postMessage('closeDialog');\">clear<\/span><\/div><div class=\"mdl-tooltip\" for=\"close\">Don't apply changes and Close<\/div><\/div><\/header><main class=\"mdl-layout__content\" style=\"padding-left:5%;\"><form id=\"config\"><div class=\"page-content\" style=\"padding-top:10px;\"><div style=\"width:25%;float:right;\"><div class=\"mdl-card mdl-shadow--2dp\" style=\"width:320px;height:255px;\"><div class=\"mdl-card__title mdl-card--expand\" style=\"color:white;background-color:crimson;\"><h2 class=\"mdl-card__title-text\">${rw.logoHTML} ${rw.version}<\/h2><\/div><div class=\"mdl-card__supporting-text\">${rw.versionSummary}<\/div><div class=\"mdl-card__actions mdl-card--border\"><a class=\"mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect\" href=\"https:\/\/en.wikipedia.org\/wiki\/Wikipedia:RedWarn\/bugsquasher#RedWarn_${rw.version}_summary\" target=\"_blank\"> READ MORE<\/a><\/div><\/div><br\/><br\/><div class=\"mdl-card mdl-shadow--2dp\" style=\"width:320px;height:255px;\"><div class=\"mdl-card__title mdl-card--expand\" style=\"color:white;background-color:#7289DA;\"><h2 class=\"mdl-card__title-text\">Discord<\/h2><\/div><div class=\"mdl-card__supporting-text\">Want to join in development discussions as they happen, get fast feedback and talk to other RedWarn users?\n                        Join the RedWarn project's Discord server! Accessable from any web browser, or via Discord's desktop and mobile apps.<\/div><div class=\"mdl-card__actions mdl-card--border\"><a class=\"mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect\" href=\"https:\/\/discord.gg\/2zNrVa9\" target=\"_blank\"> JOIN<\/a><\/div><\/div><br\/><br\/><div class=\"mdl-card mdl-shadow--2dp\" style=\"width:320px;height:255px;\"><div class=\"mdl-card__title mdl-card--expand\" style=\"color:white;background-color:#a00498;\"><h2 class=\"mdl-card__title-text\">Quick Template<\/h2><\/div><div class=\"mdl-card__supporting-text\">Quick Templates can allow you to mitigate the extensive time taken to make repetitive user talk messages. To install a pack, click the button below.<\/div><div class=\"mdl-card__actions mdl-card--border\"><a class=\"mdl-button mdl-button--accent mdl-js-button mdl-js-ripple-effect\" onclick=\"window.parent.postMessage('installQTP');\">INSTALL QUICK TEMPLATE PACK<\/a><a class=\"mdl-button mdl-button--primary mdl-js-button mdl-js-ripple-effect\" href=\"https:\/\/en.wikipedia.org\/wiki\/Wikipedia:RedWarn\/help\/Quick_Template\/templates\" target=\"_blank\"> GET PACKS<\/a><a class=\"mdl-button mdl-button--primary mdl-js-button mdl-js-ripple-effect\" onclick=\"window.parent.postMessage('newQTP');\">CREATE NEW PACK<\/a><\/div><\/div><\/div><div style=\"width:70%;float:left;\">${rw.debugMenu != null ? `<div class=\"mdl-card mdl-shadow--2dp\" style=\"width:100%;\"><div class=\"mdl-card__title mdl-card--expand\" style=\"color:white;background-color:red;\"><h2 class=\"mdl-card__title-text\">DEBUG MODE<\/h2><\/div><div class=\"mdl-card__supporting-text\">WARNING! You cannot change your preferences in debug mode without enabling production behaviour through the debug menu - applying will corrupt your config!<\/div><\/div><br\/><br\/> ` : ``} <div class=\"mdl-card mdl-shadow--2dp\" style=\"width:100%\"><div class=\"mdl-card__title\" style=\"color:#fff;height:176px;background:url(https:\/\/upload.wikimedia.org\/wikipedia\/commons\/d\/d3\/Golden_Gate_Bridge_at_sunset_1.jpg) center \/ cover;\"><h2 class=\"mdl-card__title-text\">Customise<\/h2><\/div><div class=\"mdl-card__supporting-text\"><i>Click and drag on menu options to rearrange and sort icons, and move them between your favourites (that you can access immediately) and\n                            icons you use less often that you wish to access through the \"more options\" menu. Right-click on any icon to change its properties, such as \n                            its icon or colour.<\/i><div style=\"width:100%;height:1000px\"><div style=\"width:50%;float:left;height:100%;padding-right:5px;overflow-x:hidden;overflow-y:auto;\"><h2 style=\"font-weight:200;font-size:45px;line-height:48px;\">Favourites<\/h2><h5>Rollback icons<\/h5><div style=\"min-height:20px;background-color:rgb(245,245,245);\" id=\"rwRollbackIconsSort\">${ (()=>{\/* <script>\/* Script tags are for IDE formatting only! *\/\n                                        let finalIconStr = \"\";\n                                        rw.rollback.icons.forEach((icon,i) => {\n                                            if (!icon.enabled) return; \/\/ if icon is not enabled, we can skip\n\n                                            let elID = \"rollbackIcon-\"+ (icon.originalIndex == null ? i : icon.originalIndex); \/\/ get the ID for the new icons\n\n                                            \/\/ Establish element with all the info\n                                            finalIconStr += `\n                                            <div><div class=\"mdl-button mdl-js-button\" style=\"width:100%;text-align:left;\" id=\"${elID}\"><span class=\"material-icons\" style=\"padding-right:20px;color:${icon.color};\">${icon.icon}<\/span><span ${(icon.name.length>40 ? `style=\"font-size: 12px;\"` : \"\")}>${icon.name}<\/span><\/div><hr style=\"margin:0\"\/><\/div> `;\n                                        });\n                                        \n                                        \/\/ Now return HTML (rw16)\n                                        return finalIconStr; \/\/<\/script>})()\n                                }<\/div><h5>Page Icons<\/h5><div style=\"min-height:20px;background-color:rgb(245,245,245);\" id=\"rwPageIconsSort\">${\n                                    (()=>{ \/* <script>\/* Script tags for IDE only *\/\n                                        \/\/ Now generate the HTML\n\n                                        let finalHTML = ``;\n\n                                        rw.topIcons.icons.forEach((icon, i)=>{\n                                            \/\/ Generate an ID for click handlers and tooltip\n                                            const iconID = \"rwTopIcon-\" + (icon.originalIndex == null ? i : icon.originalIndex);\n                                            if (icon.enabled) \/\/ show only if icon is enabled\n                                                finalHTML += `\n                                                    <div><div class=\"mdl-button mdl-js-button\" style=\"width:100%;text-align:left;${icon.colorModifier==null ? ``:`color:`+ icon.colorModifier}\" id=\"${iconID}\"><span class=\"material-icons\" style=\"padding-right:20px\">${icon.icon}<\/span>${icon.title}<\/div><hr style=\"margin:0\"\/><\/div> `;\n                                        });\n\n                                        return finalHTML;\n                                    \/\/<\/script>})()\n                                }<\/div><\/div><div style=\"width:49%;float:left;height:100%;border:#e6e6e6;border-width:1px;border-left-style:solid;overflow-x:hidden;overflow-y:auto;\"><div style=\"padding-left:15px\"><h2 style=\"font-weight:200;font-size:45px;line-height:48px;\">More Options<\/h2><h5>Rollback icons<\/h5><div style=\"min-height:20px;background-color:rgb(245,245,245);\" id=\"rwRollbackIconsSortDisabled\">${ (()=>{\/* <script>\/* Script tags are for IDE formatting only! *\/\n                                            let finalIconStr = \"\";\n                                            rw.rollback.icons.forEach((icon,i) => {\n                                                if (icon.enabled) return; \/\/ if icon is enabled, we can skip\n\n                                                let elID = \"rollbackIcon-\"+ (icon.originalIndex == null ? i : icon.originalIndex);\n\n                                                \/\/ Establish element with all the info\n                                                finalIconStr += `\n                                                <div><div class=\"mdl-button mdl-js-button\" style=\"width:100%;text-align:left;\" id=\"${elID}\"><span class=\"material-icons\" style=\"padding-right:20px;color:${icon.color};\">${icon.icon}<\/span><span ${(icon.name.length>40 ? `style=\"font-size: 12px;\"` : \"\")}>${icon.name}<\/span><\/div><hr style=\"margin:0\"\/><\/div> `;\n                                            });\n                                            \n                                            \/\/ Now return HTML (rw16)\n                                            return finalIconStr; \/\/<\/script>})()\n                                    }<\/div><h5>Page icons<\/h5><div style=\"min-height:20px;background-color:rgb(245,245,245);\" id=\"rwPageIconsSortDisabled\">${\n                                        (()=>{ \/* <script>\/* Script tags for IDE only *\/\n                                            \/\/ Now generate the HTML\n    \n                                            let finalHTML = ``;\n    \n                                            rw.topIcons.icons.forEach((icon, i)=>{\n                                                \/\/ Generate an ID for click handlers and tooltip\n                                                const iconID = \"rwTopIcon-\" + (icon.originalIndex == null ? i : icon.originalIndex);\n                                                if (!icon.enabled) \/\/ show only if icon is not enabled\n                                                    finalHTML += `\n                                                        <div><div class=\"mdl-button mdl-js-button\" style=\"width:100%;text-align:left;${icon.colorModifier==null ? ``:`color:`+ icon.colorModifier}\" id=\"${iconID}\"><span class=\"material-icons\" style=\"padding-right:20px\">${icon.icon}<\/span>${icon.title}<\/div><hr style=\"margin:0\"\/><\/div> `;\n                                            });\n    \n                                            return finalHTML;\n                                        \/\/<\/script>})()\n                                    }<\/div><div style=\"cursor:not-allowed;\"><div class=\"mdl-button mdl-js-button\" style=\"width:100%;text-align:left;cursor:not-allowed;\" disabled><span class=\"material-icons\" style=\"padding-right:20px\">flag<\/span>REPORT USER TO AIV<\/div><hr style=\"margin:0\"\/><div class=\"mdl-button mdl-js-button\" style=\"width:100%;text-align:left;cursor:not-allowed;\" disabled><span class=\"material-icons\" style=\"padding-right:20px\">person_remove<\/span>REPORT USER TO UAA<\/div><hr style=\"margin:0\"\/><div class=\"mdl-button mdl-js-button\" style=\"width:100%;text-align:left;cursor:not-allowed;\" disabled><span class=\"material-icons\" style=\"padding-right:20px\">visibility_off<\/span>REPORT USER\/EDIT TO OVERSIGHT<\/div><hr style=\"margin:0\"\/><div class=\"mdl-button mdl-js-button\" style=\"width:100%;text-align:left;cursor:not-allowed;\" disabled><span class=\"material-icons\" style=\"padding-right:20px\">phone_in_talk<\/span>REPORT USER\/EDIT TO WIKIMEDIA TRUST AND SAFETY<\/div><hr style=\"margin:0\"\/><div class=\"mdl-button mdl-js-button\" style=\"width:100%;text-align:left;cursor:not-allowed;\" disabled><span class=\"material-icons\" style=\"padding-right:20px\">settings<\/span>REDWARN PREFERENCES<\/div><hr style=\"margin:0\"\/><div class=\"mdl-button mdl-js-button\" style=\"width:100%;text-align:left;cursor:not-allowed;\" disabled><span class=\"material-icons\" style=\"padding-right:20px\">question_answer<\/span>GO TO THE REDWARN TALK PAGE<\/div><hr style=\"margin:0\"\/><\/div><\/div><\/div><\/div><\/div><div class=\"mdl-card__actions mdl-card--border\"><a class=\"mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect\" onclick=\"saveConfig()\">SAVE CHANGES<\/a><\/div><\/div><br\/><br\/>${rw.preferences.generateHTML()} <br\/><br\/><div class=\"mdl-card mdl-shadow--2dp\" style=\"width:100%\"><div class=\"mdl-card__title\" style=\"color:#fff;height:176px;background:url(https:\/\/upload.wikimedia.org\/wikipedia\/commons\/b\/b6\/Reflected_sunset.jpg) center \/ cover;\"><h2 class=\"mdl-card__title-text\">${rw.logoHTML} ${rw.version}<\/h2><\/div><div class=\"mdl-card__supporting-text\"><h5>The user-<span id=\"hahaFunnyJoke\">friendly<\/span> counter-vandalism tool.<\/h5><script>$(\"#hahaFunnyJoke\").on(\"click\", ()=>{if (confirm(\"You are about to open an external link to YouTube.com - continue?\")) Object.assign(document.createElement('a'), { target: '_blank', href: \"https:\/\/www.youtube.com\/watch?v=YbYJKGWrG7U\"}).click();});<\/script><h6>Build info<\/h6><pre>${rw.buildInfo}<\/pre><h6>Image attribution<\/h6><a href=\"https:\/\/commons.wikimedia.org\/wiki\/File:Golden_Gate_Bridge_at_sunset_1.jpg\" target=\"_blank\">File:Golden Gate Bridge at sunset 1.jpg<\/a><br\/><a href=\"https:\/\/commons.wikimedia.org\/wiki\/File:Reflected_sunset.jpg\" target=\"_blank\">File:Reflected_sunset.jpg<\/a><br\/><a href=\"https:\/\/commons.wikimedia.org\/wiki\/File:Wilkin_River_close_to_its_confluence_with_Makarora_River,_New_Zealand.jpg\" target=\"_blank\">File:Wilkin River close to its confluence with Makarora River, New Zealand.jpg<\/a><br\/><\/div><div class=\"mdl-card__actions mdl-card--border\"><a class=\"mdl-button mdl-js-button mdl-js-ripple-effect\" style=\"color:red\" onclick=\"window.parent.postMessage('resetConfig');\">RESET REDWARN<\/a><\/div><\/div><br\/><br\/><\/div><\/div><\/div><\/form><\/main><\/div><dialog class=\"mdl-dialog\" id=\"iconChoiceDialog\"><h4 class=\"mdl-dialog__title\" style=\"font-weight:200;padding-bottom:15px;\">Select Icon<\/h4><div id=\"dialogSelContainer\" style=\"height:300px;overflow:auto;\"><\/div><div class=\"mdl-dialog__actions\"><button type=\"button\" class=\"mdl-button close\">Cancel<\/button><\/div><\/dialog><script src=\"https:\/\/redwarn.toolforge.org\/cdn\/js\/select2.js\"><\/script><script>\/\/ CORE THINGS\n\n\n\n    var config = `+ JSON.stringify(rw.config) +`;\n    function saveConfig() {\n        var data = $('form').serializeArray().reduce((obj, item) => {\n                obj[item.name] = item.value;\n                return obj;\n                }, {}); \/\/ form data\n\n        \/\/ Now we process the rollback icons\n        let iconModifyArray = []; \/\/ array for our changes\n\n        \/\/ For each enabled icon\n        $(\"#rwRollbackIconsSort > div > .mdl-button\").each((i, el)=>{ \n            let iconIndex = parseInt($(el).attr(\"id\").split(\"-\")[1]);\n            iconModifyArray.push({\n                \"index\" : iconIndex, \/\/ original icon index \n                \"shift\" : i, \/\/ where to move to\n                \"modify\" : { \/\/ obj of params to change\n                    \"enabled\": true, \/\/ set as enabled\n                    \"color\" : $(el).find(\"span.material-icons\").css(\"color\"), \/\/ get color\n                    \"icon\" : $(el).find(\"span.material-icons\").text().trim() \/\/ get icon from inner span text\n                }\n            });\n        });\n\n        \/\/ For each disabled icon\n        $(\"#rwRollbackIconsSortDisabled > div > .mdl-button\").each((i, el)=>{ \n            let iconIndex = parseInt($(el).attr(\"id\").split(\"-\")[1]);\n            iconModifyArray.push({\n                \"index\" : iconIndex, \/\/ original icon index \n                \"shift\" : $(\"#rwRollbackIconsSort > div > .mdl-button\").length + i, \/\/ where to move to (for disbaled + the number of total enabled)\n                \"modify\" : { \/\/ obj of params to change\n                    \"enabled\": false, \/\/ set as disabled\n                    \"color\" : $(el).find(\"span.material-icons\").css(\"color\"), \/\/ get color\n                    \"icon\" : $(el).find(\"span.material-icons\").text().trim() \/\/ get icon from inner span text\n                }\n            });\n        });\n\n        \/\/ Now add to config\n        data.rwRollbackIcons = iconModifyArray;\n\n        \/\/ Now process the page icons\n        iconModifyArray = []; \/\/ reset array for our changes\n        \n        $(\"#rwPageIconsSort > div > .mdl-button\").each((i, el)=>{ \n            let iconIndex = parseInt($(el).attr(\"id\").split(\"-\")[1]);\n            iconModifyArray.push({\n                \"index\" : iconIndex, \/\/ original icon index \n                \"shift\" : i, \/\/ where to move to\n                \"modify\" : { \/\/ obj of params to change\n                    \"enabled\": true, \/\/ set as enabled\n                    \"icon\" : $(el).find(\"span.material-icons\").text().trim() \/\/ get icon from inner span text\n                }\n            });\n        });\n\n        \/\/ For each disabled icon\n        $(\"#rwPageIconsSortDisabled > div > .mdl-button\").each((i, el)=>{ \n            let iconIndex = parseInt($(el).attr(\"id\").split(\"-\")[1]);\n            iconModifyArray.push({\n                \"index\" : iconIndex, \/\/ original icon index \n                \"shift\" : $(\"#rwPageIconsSort > div > .mdl-button\").length + i, \/\/ where to move to (for disbaled + the number of total enabled)\n                \"modify\" : { \/\/ obj of params to change\n                    \"enabled\": false, \/\/ set as disabled\n                    \"icon\" : $(el).find(\"span.material-icons\").text().trim() \/\/ get icon from inner span text\n                }\n            });\n        });\n\n        \/\/ Now add to config\n        data.rwPageIcons = iconModifyArray;\n\n        \/\/ Done! Submit\n        window.parent.postMessage(\"config\\\\\\`\"+ btoa(JSON.stringify(data))); \/\/ send to the big boss\n    }\n\n    function loadFromConfig() {\n        $.each(config, (key, value) => {  \n            var ctrl = $('[name='+key+']');\n            \/\/ Check for onsettings load\n            if (onSettingsLoad[key]) onSettingsLoad[key](value); \/\/ Call handler if it exists\n\n            \/\/ Set the values\n                switch(ctrl.prop(\"type\")) { \n                    case \"radio\": case \"checkbox\":   \n                        ctrl.each(function() {\n                            if($(this).attr('value') == value) $(this).attr(\"checked\",value);\n                        });   \n                        break;  \n                    default:\n                        ctrl.val(value); \n                }  \n        });  \n    }\n\n    loadFromConfig();\n\n    \/\/ END CORE THINGS\n\n    \/\/ Icon Dialog\n\n    function showIconSelector(callback) { \/\/ Open icon selector - callback(icon)\n        \/\/ Render all the icons\n        $(\"#dialogSelContainer\").html(\"\"); \/\/ clear icons\n\n        materialIcons.forEach(icon=>{ \/\/ For each icon\n            $(\"#dialogSelContainer\").append('<span class=\"material-icons\" id=\"ico_'+ icon +'\" style=\"padding-right:5px;padding-bottom:5px;cursor:pointer;font-size:42px;\">'+ icon + '<\/span>'); \/\/ add the icon\n            $(\"#dialogSelContainer\").append('<div class=\"mdl-tooltip\" data-mdl-for=\"ico_'+ icon +'\">'+ icon + '<\/div>'); \/\/ add the tooltip\n\n            \/\/ Add click handler\n            $('#ico_'+ icon).on(\"click\", ()=>{\n                document.querySelector('#iconChoiceDialog').close(); \/\/ close dialog\n                callback(icon); \/\/ callback\n            });\n        });\n\n        \/\/ Now register all icons\n        for (let item of document.getElementsByClassName(\"mdl-tooltip\")) {\n            componentHandler.upgradeElement(item); \n        }\n\n        \/\/ Show dialog\n        let dialog = document.querySelector('#iconChoiceDialog');\n        if (! dialog.showModal) { \/\/ firefox polyfill compatibility\n            dialogPolyfill.registerDialog(dialog);\n        }\n        \n        dialog.showModal();\n\n        dialog.querySelector('.close').addEventListener('click', function() {\n            dialog.close();\n        });\n\n        \/\/ END ICON DIALOG\n    }\n\n    \/\/ Sortable for rollback icons\n    $('#rwRollbackIconsSort').sortable({\n        group: 'shared', \/\/ set both lists to same group\n        animation: 150\n    });\n    $('#rwRollbackIconsSortDisabled').sortable({\n        group: 'shared', \/\/ set both lists to same group\n        animation: 150\n    });\n\n    \/\/ Sortable for page icons\n    $('#rwPageIconsSort').sortable({\n        group: 'shared2', \/\/ set both lists to same group\n        animation: 150\n    });\n    $('#rwPageIconsSortDisabled').sortable({\n        group: 'shared2', \/\/ set both lists to same group\n        animation: 150\n    });\n\n    \/\/ jQuery context menus for icons\n    $(() => {\n        $.contextMenu({\n            selector: 'div[id^=\"rollbackIcon-\"]', \n            callback: (key, options) => {\n                \/\/ If editcolor\n                if (key.startsWith(\"editColor-\")) {\n                    $(options[\"$trigger\"][0]).find(\"span.material-icons\").css(\"color\", key.split(\"-\")[1]); \/\/ Set color\n                    return false; \/\/ we done (return false so user can see change with menu still open)\n                }\n                \/\/ Send callback for non-edit color changes\n                ({\n                    \"editIcon\" : element=>{\n                        \/\/ Edit icon\n                        showIconSelector(icon=>{ \/\/ Open icon selector\n                            $(element).find(\"span.material-icons\").text(icon); \/\/ swap out the icon. normal code does the rest.\n                        });\n                    }\n                })[key](options[\"$trigger\"][0]); \/\/ pass in trigger element\n            },\n            items: {\n                \"editIcon\": {name: \"Change Icon\"},\n                \"editColor\": {\n                    \"name\": \"Edit Color\", \n                    \"items\": {\n                        \"editColor-crimson\": {name: \"Crimson\"},\n                        \"editColor-red\": {name: \"Red\"},\n                        \"editColor-DarkOrange\": {name: \"Dark Orange\"},\n                        \"editColor-Orange\": {name: \"Orange\"},\n                        \"editColor-Gold\": {name: \"Yellow\"},\n                        \"editColor-DarkMagenta\": {name: \"Dark Magenta\"},\n                        \"editColor-Magenta\": {name: \"Magenta\"},\n                        \"editColor-HotPink\": {name: \"Pink\"},\n                        \"editColor-DarkBlue\": {name: \"Dark Blue\"},\n                        \"editColor-Blue\": {name: \"Blue\"},\n                        \"editColor-Teal\": {name: \"Teal\"},\n                        \"editColor-Cyan\": {name: \"Cyan\"},\n                        \"editColor-DodgerBlue\": {name: \"Dodger Blue\"},\n                        \"editColor-Green\": {name: \"Green\"},\n                        \"editColor-LawnGreen\": {name: \"Lawn Green\"},\n                        \"editColor-LightGreen\": {name: \"Light Green\"},\n                        \"editColor-Lavender\": {name: \"Lavender\"},\n                        \"editColor-LightGray\": {name: \"Light Gray\"},\n                        \"editColor-LightSlateGrey\": {name: \"Light Slate Grey\"},\n                        \"editColor-Grey\": {name: \"Grey\"},\n                        \"editColor-Black\": {name: \"Black\"}\n                    }\n                },\n            }\n        });   \/\/ end rollback icons\n\n\n        \/\/ Page icons (only change icon)\n\n        $.contextMenu({\n            selector: 'div[id^=\"rwTopIcon-\"]', \n            callback: (key, options) => {\n                \/\/ Send callback for non-edit color changes\n                ({\n                    \"editIcon\" : element=>{\n                        \/\/ Edit icon\n                        showIconSelector(icon=>{ \/\/ Open icon selector\n                            $(element).find(\"span.material-icons\").text(icon); \/\/ swap out the icon. normal code does the rest.\n                        });\n                    }\n                })[key](options[\"$trigger\"][0]); \/\/ pass in trigger element\n            },\n            items: {\n                \"editIcon\": {name: \"Change Icon\"}\n            }\n        });  \n    });\n\n    \/\/ Colour theme preview\n    function updateColourTheme() {\n        \/\/ Show loading dialog\n        window.parent.postMessage('newThemeDialog');\n        \/\/ Add stylesheet for this version\n        setTimeout(()=>$('head').append('<link rel=\"stylesheet\" type=\"text\/css\" onload=\"window.parent.postMessage(\\\\\\'loadDialogClose\\\\\\');\" href=\"https:\/\/redwarn.toolforge.org\/cdn\/css\/material.' + $(\"input[name=colTheme]:checked\").val() + '.min.css\">'), 500);\n    }<\/script>`","adminReport.html":"`${doNotShowDialog !== true ? `<h2 style=\"font-weight:200;font-size:45px;line-height:48px;\">Report to AIV<\/h2>\n` :``}<span>${rw.debugMenu == null ? `AIV is intended only <b>for reports about active, obvious, and persistent vandals and spammers.<\/b> When appropriate, assume good faith and ensure you have warned an editor before reporting to AIV.`:\n    `<span style=\"color:red\">You are in developer mode, so AIV reports will be sent to User:Ed6767\/sandbox. Enable production behaviour through the debug menu.<\/span>`}<\/span><form id=\"AIVreportForm\"><div class=\"mdl-textfield mdl-js-textfield mdl-textfield--floating-label\" style=\"width:100%\"><input class=\"mdl-textfield__input\" type=\"text\" id=\"trgtUsrVisualBox\" value=\"`+ rw.info.targetUsername(un).replace(\/_\/g, ' ') +`\" name=\"target\" readonly><label class=\"mdl-textfield__label\" for=\"trgtUsrVisualBox\">Target<\/label><div class=\"mdl-tooltip\" for=\"trgtUsrVisualBox\">To target a different user, please visit their userpage.<\/div><\/div><div class=\"mdl-textfield mdl-js-textfield mdl-textfield--floating-label getmdl-select\" style=\"width:100%;\"><input type=\"text\" value=\"\" class=\"mdl-textfield__input\" id=\"reasonInput\" name=\"reason\" readonly><input type=\"hidden\" value=\"\" name=\"reasonInput\"><i class=\"mdl-icon-toggle__label material-icons\">keyboard_arrow_down<\/i><label for=\"reasonInput\" class=\"mdl-textfield__label\">Reason<\/label><ul for=\"reasonInput\" class=\"mdl-menu mdl-menu--bottom-left mdl-js-menu\" style=\"height:100px;overflow:auto;\"><li class=\"mdl-menu__item\" data-val=\"\">Vandalism after final warning<\/li><li class=\"mdl-menu__item\" data-val=\"\">Vandalism within 1 day of being unblocked<\/li><li class=\"mdl-menu__item\" data-val=\"\">Evidently a vandalism-only account<\/li><li class=\"mdl-menu__item\" data-val=\"\">Account is a promotion-only account<\/li><li class=\"mdl-menu__item\" data-val=\"\">Account is evidently a spambot or a compromised account<\/li><li class=\"mdl-menu__item\" data-val=\"\">Other (please enter in comment)<\/li><\/ul><\/div><div class=\"mdl-textfield mdl-js-textfield mdl-textfield--floating-label\" style=\"width:100%\"><input class=\"mdl-textfield__input\" type=\"text\" id=\"commentBox\" name=\"comment\"><label class=\"mdl-textfield__label\" for=\"commentBox\">Comment<\/label><div class=\"mdl-tooltip\" for=\"commentBox\">Enter additional info you'd like to attach to this report.<\/div><\/div><\/form><span style=\"float:right;\">${doNotShowDialog !== true ? `<button class=\"mdl-button mdl-js-button mdl-js-ripple-effect\" onclick=\"window.parent.postMessage('closeDialog', '*');\">CANCEL<\/button> ` :``} <button id=\"AIVsubmitBtn\" class=\"mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent\" onclick=\"sendAIVReport();\">REPORT<\/button><\/span><script>function pushToast(text) {window.parent.postMessage('pushToast\\\\\\`' + text);} \/\/ Push toast to host\n\n    function sendAIVReport() {\n        \/\/ Submit report\n        var data = $('#AIVreportForm').serializeArray().reduce(function(obj, item) {\n                obj[item.name] = item.value;\n                return obj;\n                }, {}); \/\/ form data\n        \n        if (data.reason == \"\") {pushToast(\"Select a reason.\"); return;} \/\/ If no reason selected, push toast and EXIT.\n\n        let fullReason = \"\";\n        if (data.reason == \"Other (please enter in comment)\") { \/\/ If other is chosen\n            if (data.comment == \"\") {pushToast(\"Enter your reason.\"); return;}\n            if (data.comment.length < 5) {pushToast(\"Your reason is not long enough\"); return;} \/\/ If no comment, or comment is not long enough (5+ chars) push toast and EXIT.\n            fullReason = data.comment; \/\/ else continue and set the reason to the comment\n        } else {\n            \/\/ Append the reason and comment if there is one\n            fullReason = data.reason + (data.comment == \"\" ? \"\" : \" - \"+ data.comment); \/\/ If data comment empty don't add anything otherwise make it Reason - Comment\n        }\n        fullReason += \" ${rw.sign()}\"; \/\/ Add sig to the end (w space)\n        \/\/ Push this upstairs\n        window.parent.postMessage('AIVreport\\\\\\`'+ fullReason + '\\\\\\`' + data.target, '*'); \/\/ Report with full reason\n        window.parent.postMessage('closeDialog', '*'); \/\/ Close. We will be reopened on error.\n    }\n\n    \/\/ Handles notice that user has already been reported\n    window.onmessage = e=>{ \/\/ On any message we just set the text, not much logic here\n        console.log(e);\n        if (e.data == \"AIVReportExist\"){\n            $(\"#AIVreportForm\").html(\"<h5>It looks like this user has already been reported to AIV.<\/h5>\");\n            $(\"#AIVsubmitBtn\").hide(); \/\/ hide submit button\n        } else if (e.data == \"UAAReportExist\"){\n            $(\"#UAAreportForm\").html(\"<h5>It looks like this user has already been reported to UAA.<\/h5>\");\n            $(\"#UAAsubmitBtn\").hide(); \/\/ hide submit button\n        } \n    };<\/script>`","confirmDialog.html":"`${content}\n${(noExtraLines === true ? \"\" : \"<br\/><br\/>\")}<span style=\"float:right;\">`+ (sBtnTxt.length > 0 ? (`<button class=\"mdl-button mdl-js-button mdl-js-ripple-effect\" onclick=\"window.parent.postMessage('sBtn', '*');\">`+ sBtnTxt +`<\/button>`) : ``) + `<button id=\"submitBtn\" class=\"mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent\" onclick=\"window.parent.postMessage('pBtn', '*');\">${pBtnTxt}<\/button><\/span>`","sendFeedback.html":"`<style>h2{font-size:20px;line-height:0}.mw-editsection{display:none}<\/style>${(rw.debugMenu != null ? `<h2 style=\"font-weight:200;font-size:45px;line-height:48px;\">Bug time!<\/h2><pre>Check your console. ${(extraInfo != null ? extraInfo : \"No additional info has been provided.\")}<\/pre><br\/><button id=\"submitBtn\" class=\"mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent\" onclick=\"window.parent.postMessage('closeDialog', '*');\">CLOSE<\/button>` : `<h2 style=\"font-weight:200;font-size:45px;line-height:48px;\">Report Bug<\/h2><p>If you've been sent to this page, an issue has occured which needs to be reported to the RedWarn team. Please add any additional info, then a message will be left on Ed6767's talk page.<\/p><form id=\"newMsgForm\"><input type=\"hidden\" id=\"trgtUsrVisualBox\" value=\"Ed6767\" readonly><span id=\"previewContainer\" style=\"display:none;\"><span id=\"editBtn\" class=\"material-icons\" style=\"font-size:16px;padding-bottom:3px;float:right;padding-right:5px;cursor:pointer;\" onclick=\"$('#previewContainer').hide();$('#editorContainer').show();\">create<\/span><div id=\"preview\" style=\"height:150px;overflow-y:auto;width:100%;\"><\/div><\/span><span id=\"editorContainer\"><span id=\"previewBtn\" class=\"material-icons\" style=\"font-size:16px;padding-bottom:3px;float:right;padding-right:5px;cursor:pointer;\" onclick=\"$('#previewContainer').show();$('#editorContainer').hide();grabPreview();\">visibility<\/span><div id=\"editor\"><textarea id=\"wikiTxt\" name=\"wikiTxt\" style=\"height:130px;max-height:150px;overflow-y:auto;width:100%;\">=== Automatic bug report ===\n!!! Replace this text with any further information you wish to provide that will help us fix this bug. !!! ${rw.sign()}\n\n\n${(extraInfo != null ? extraInfo : \"\")}<\/textarea><\/div><\/span><\/form><span style=\"float:right;\"><button class=\"mdl-button mdl-js-button mdl-js-ripple-effect\" onclick=\"window.parent.postMessage('closeDialog', '*');\">CANCEL<\/button><button id=\"submitBtn\" class=\"mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent\" onclick=\"sendMessage();\">SEND FEEDBACK<\/button><\/span><script>\/\/ Handle incoming data\n    window.onmessage = function(e){\n        if (e.data.action == 'parseWikiTxt') {\n            $(\"#preview\").html(e.data.result); \/\/ Set preview to content\n        }\n    };\n\n    function pushToast(text) {window.parent.postMessage('pushToast\\\\\\`' + text);} \/\/ Push toast to host\n\n    function grabPreview() {\n        var wikiTxt = document.getElementById(\"wikiTxt\").value;\n        if (!wikiTxt.includes(\"${rw.sign()}\")) {\n            \/\/ Not signed, warn\n            pushToast(\"Don't forget to sign your message!\");\n        }\n        window.parent.postMessage('generatePreview\\\\\\`'+ wikiTxt, '*');\n    }\n\n    function sendMessage() {\n        \/\/ Send it!\n        var data = $('#newMsgForm').serializeArray().reduce(function(obj, item) {\n                obj[item.name] = item.value;\n                return obj;\n                }, {}); \/\/ form data\n\n        var wikiTxt = data.wikiTxt;\n        if (!wikiTxt.includes(\"${rw.sign()}\")) {\n            \/\/ Not signed, warn\n            pushToast(\"Sign your message with '${rw.sign()}'\");\n            return; \/\/ Do not continue\n        }\n        window.parent.postMessage('applyNotice\\\\\\`' + document.getElementById(\"trgtUsrVisualBox\").value + '\\\\\\`' + wikiTxt + '\\\\\\`' + \"new topic\"); \/\/ Push upstairs and commit\n        window.parent.postMessage(\"closeDialog\"); \/\/ We done here. Top will refresh or reshow if error occurs.\n    }<\/script>\n`)}`","adminReportSelector.html":"`<h2 style=\"font-weight:200;font-size:32px;line-height:48px;\">Quick report<\/h2><div style=\"height:90px;\"><button id=\"AIV\" class=\"mdl-button mdl-js-button mdl-js-ripple-effect mdl-button--primary\" style=\"width:100%\" onclick=\"window.parent.postMessage('openAIV', '*');\">VANDALISM\/SPAM ISSUE (AIV)<\/button><div class=\"mdl-tooltip mdl-tooltip--large\" for=\"AIV\">For reports about active, obvious, and persistent vandals and spammers<\/div><br\/><button id=\"UAA\" class=\"mdl-button mdl-js-button mdl-js-ripple-effect mdl-button--primary\" style=\"width:100%\" onclick=\"window.parent.postMessage('openUAA', '*');\">USERNAME ISSUE (UAA)<\/button><div class=\"mdl-tooltip mdl-tooltip--large\" for=\"UAA\">Reports of usernames that are blatant and serious violations of the username policy requiring an immediate block.<\/div><br\/><\/div><span style=\"font-size:small;font-style:italic;\">To access other report venues, go to an editors user page, then click the \"more options\" button.<\/span><br\/><span style=\"float:right;\"><button class=\"mdl-button mdl-js-button mdl-js-ripple-effect\" onclick=\"window.parent.postMessage('closeDialog', '*');\">CANCEL<\/button><\/span>`","uaaReport.html":"`${(htmlOnly != true ? `<h2 style=\"font-weight:200;font-size:45px;line-height:48px;\">Report to UAA<\/h2>`:``)}<span>${rw.debugMenu == null ? `Please note: This form currently supports <b>username reports<\/b> only. Please be well aware of the username policy before reporting.`:\n    `<span style=\"color:red\">You are in developer mode, so UAA reports will be sent to User:Ed6767\/sandbox. Enable production behaviour through the debug menu.<\/span>`}<\/span><form id=\"UAAreportForm\"><div class=\"mdl-textfield mdl-js-textfield mdl-textfield--floating-label\" style=\"width:100%\"><input class=\"mdl-textfield__input\" type=\"text\" id=\"trgtUsrVisualBox\" value=\"`+ rw.info.targetUsername(un).replace(\/_\/g, ' ') +`\" name=\"target\" readonly><label class=\"mdl-textfield__label\" for=\"trgtUsrVisualBox\">Target<\/label><div class=\"mdl-tooltip\" for=\"trgtUsrVisualBox\">To target a different user, please visit their userpage.<\/div><\/div><div class=\"mdl-textfield mdl-js-textfield mdl-textfield--floating-label getmdl-select\" style=\"width:100%;\"><input type=\"text\" value=\"\" class=\"mdl-textfield__input\" id=\"reasonInput\" name=\"reason\" readonly><input type=\"hidden\" value=\"\" name=\"reasonInput\"><i class=\"mdl-icon-toggle__label material-icons\">keyboard_arrow_down<\/i><label for=\"reasonInput\" class=\"mdl-textfield__label\">Reason<\/label><ul for=\"reasonInput\" class=\"mdl-menu mdl-menu--bottom-left mdl-js-menu\" style=\"height:100px;overflow:auto;\"><li class=\"mdl-menu__item\" data-val=\"\">Misleading username<\/li><li class=\"mdl-menu__item\" data-val=\"\">Promotional username<\/li><li class=\"mdl-menu__item\" data-val=\"\">Username that implies shared use<\/li><li class=\"mdl-menu__item\" data-val=\"\">Offensive username<\/li><li class=\"mdl-menu__item\" data-val=\"\">Disruptive username<\/li><li class=\"mdl-menu__item\" data-val=\"\">Other (please enter in comment)<\/li><\/ul><\/div><div class=\"mdl-textfield mdl-js-textfield mdl-textfield--floating-label\" style=\"width:100%\"><input class=\"mdl-textfield__input\" type=\"text\" id=\"commentBox\" name=\"comment\"><label class=\"mdl-textfield__label\" for=\"commentBox\">Comment<\/label><div class=\"mdl-tooltip\" for=\"commentBox\">Enter additional info you'd like to attach to this report.<\/div><\/div><\/form><span style=\"float:right;\">${(htmlOnly != true ? `<button class=\"mdl-button mdl-js-button mdl-js-ripple-effect\" onclick=\"window.parent.postMessage('closeDialog', '*');\">CANCEL<\/button>`:``)} <button id=\"UAAsubmitBtn\" class=\"mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent\" onclick=\"sendUAAReport();\">REPORT<\/button><\/span><script>function pushToast(text) {window.parent.postMessage('pushToast\\\\\\`' + text);} \/\/ Push toast to host\n\n    function sendUAAReport() {\n        \/\/ Submit report\n        var data = $('#UAAreportForm').serializeArray().reduce(function(obj, item) {\n                obj[item.name] = item.value;\n                return obj;\n                }, {}); \/\/ form data\n        \n        if (data.reason == \"\") {pushToast(\"Select a reason.\"); return;} \/\/ If no reason selected, push toast and EXIT.\n\n        let fullReason = \"\";\n        if (data.reason == \"Other (please enter in comment)\") { \/\/ If other is chosen\n            if (data.comment == \"\") {pushToast(\"Enter your reason.\"); return;}\n            if (data.comment.length < 5) {pushToast(\"Your reason is not long enough\"); return;} \/\/ If no comment, or comment is not long enough (5+ chars) push toast and EXIT.\n            fullReason = data.comment; \/\/ else continue and set the reason to the comment\n        } else {\n            \/\/ Append the reason and comment if there is one\n            fullReason = \"Violation of the username as a \" + data.reason.toLowerCase() + (data.comment == \"\" ? \"\" : \". \"+ data.comment); \/\/ If data comment empty don't add anything otherwise make it Reason - Comment\n        }\n        fullReason += \" ${rw.sign()}\"; \/\/ Add sig to the end (w space)\n        \/\/ Push this upstairs\n        window.parent.postMessage('UAA\\\\\\`'+ fullReason + '\\\\\\`' + data.target, '*'); \/\/ Report with full reason\n        window.parent.postMessage('closeDialog', '*'); \/\/ Close. We will be reopened on error.\n    }\n\n\n    window.onmessage = e=>{ \/\/ On any message we just set the text, not much logic here\n        console.log(e);\n        if (e.data == \"AIVReportExist\"){\n            $(\"#AIVreportForm\").html(\"<h5>It looks like this user has already been reported to AIV.<\/h5>\");\n            $(\"#AIVsubmitBtn\").hide(); \/\/ hide submit button\n        } else if (e.data == \"UAAReportExist\"){\n            $(\"#UAAreportForm\").html(\"<h5>It looks like this user has already been reported to UAA.<\/h5>\");\n            $(\"#UAAsubmitBtn\").hide(); \/\/ hide submit button\n        } \n\n        \/\/ OTHER EXTENDED OPTIONS HANLDERS HERE\n    };<\/script>`","genericError.html":"`<b>A rare error occured. Just don't panic.<\/b>`","extendedOptions.html":"`<button class=\"mdl-button mdl-js-button mdl-button--icon\" style=\"float:right;\" onclick=\"window.parent.postMessage('closeDialog', '*');\"><i class=\"material-icons\">close<\/i><\/button><h2 style=\"font-weight:200;font-size:45px;line-height:48px;\">More Options<\/h2><div style=\"height:400px;overflow-y:auto;overflow-x:hidden;\" id=\"buttonList\"><hr style=\"margin:0\"\/>${rollbackOptsHTML}${rw.topIcons.getHiddenHTML()}${(isUserPage || isOnRevPage ? `<div class=\"mdl-button mdl-js-button\" style=\"width:100%;text-align:left;\"><span class=\"material-icons\" style=\"padding-right:20px\">flag<\/span>REPORT ${rw.info.targetUsername()} TO AIV<expander class=\"material-icons\" expander-content-id=\"rwAIVreport\">expand_more<\/expander><\/div><div class=\"collapsed\" id=\"rwAIVreport\" targetHeight=\"350px\" style=\"padding-left:25px;padding-right:30px;\">${adminReportContent}<\/div><hr style=\"margin:0\"\/><div class=\"mdl-button mdl-js-button\" style=\"width:100%;text-align:left;\"><span class=\"material-icons\" style=\"padding-right:20px\">person_remove<\/span>REPORT ${rw.info.targetUsername()} TO UAA<expander class=\"material-icons\" expander-content-id=\"rwUAAreport\">expand_more<\/expander><\/div><div class=\"collapsed\" id=\"rwUAAreport\" targetHeight=\"350px\" style=\"padding-left:25px;padding-right:30px;\">${uaaReportContent}<\/div><hr style=\"margin:0\"\/><div class=\"mdl-button mdl-js-button\" style=\"width:100%;text-align:left;\"><span class=\"material-icons\" style=\"padding-right:20px\">visibility_off<\/span>REPORT ${(isUserPage ? \"USER\" : \"\") + (isUserPage && isOnRevPage ? \" AND\/OR \" : \"\") + (isOnRevPage ? \"EDIT\" : \"\")} TO OVERSIGHT<expander class=\"material-icons\" expander-content-id=\"rwOSreport\">expand_more<\/expander><\/div><div class=\"collapsed\" id=\"rwOSreport\" targetHeight=\"350px\" style=\"padding-left:25px;padding-right:30px;\">Suppression removes edits which breach privacy (especially of minors) or defame somebody. You must never draw attention to suppressible material and links on Wikipedia or other public venues.\n        Please read the <a href=\"https:\/\/en.wikipedia.org\/wiki\/Wikipedia:Requests_for_oversight\" target=\"_blank\">requests for oversight<\/a> page for more information before continuing.${(emailInfo.emailauthenticated == null ? `<h5>You must have a verified email linked to your account to use this feature.<\/h5> ` : `<textarea style=\"margin-top:0;margin-bottom:0;height:165px;width:100%;\" id=\"OSReportBox\">Dear English Wikipedia Oversight,\n\nI would like to request oversight at:\n${window.location.href}\n\n*** ENTER ADDITIONAL INFORMATION HERE ***\n\nRegards,\n${rw.info.getUsername()}<\/textarea><br\/><br\/><span style=\"float:right;\"><button id=\"TASsubmitBtn\" class=\"mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent\" onclick=\"window.parent.postMessage('OSEmail\\`' + btoa($('#OSReportBox').text()), '*');\">SEND EMAIL<\/button><\/span> `)}<\/div><hr style=\"margin:0\"\/><div class=\"mdl-button mdl-js-button\" style=\"width:100%;text-align:left;color:red;\"><span class=\"material-icons\" style=\"padding-right:20px\">phone_in_talk<\/span>REPORT ${(isUserPage ? \"USER\" : \"\") + (isUserPage && isOnRevPage ? \" AND\/OR \" : \"\") + (isOnRevPage ? \"EDIT\" : \"\")} TO WIKIMEDIA TRUST AND SAFETY<expander class=\"material-icons\" expander-content-id=\"rwTASreport\">expand_more<\/expander><\/div><div class=\"collapsed\" id=\"rwTASreport\" targetHeight=\"350px\" style=\"padding-left:25px;padding-right:30px;overflow-y:auto;\"><div style=\"font-size:small;background:#ffc8c8;color:#ff3e3e;text-align:center;\"><span>If you are in immediate danger, contact your local emergency services.<\/span><\/div> Please read the <a href=\"https:\/\/en.wikipedia.org\/wiki\/WP:999\" target=\"_blank\">responding to threats of harm<\/a> guideline page before continuing.\n        This page sends an email to Wikimedia Trust and safety for you, but you must ensure to add any additional information in the text area below. <br\/>${(emailInfo.emailauthenticated == null ? `<h5>You must have a verified email linked to your account to use this feature.<\/h5> ` : `<textarea style=\"margin-top:0;margin-bottom:0;height:165px;width:100%;\" id=\"tasReportBox\">To whom it may concern,\n\nI have a trust and safety concern at:\n${window.location.href}\n\n*** ENTER ADDITIONAL INFORMATION HERE ***\n\nRegards,\n${rw.info.getUsername()}<\/textarea><br\/><br\/><span style=\"float:right;\"><button id=\"TASsubmitBtn\" class=\"mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent\" onclick=\"window.parent.postMessage('TASEmail\\`' + btoa($('#tasReportBox').text()), '*');\">SEND EMAIL<\/button><\/span> `)}<\/div><hr style=\"margin:0\"\/> ` : ``)}<div class=\"mdl-button mdl-js-button\" style=\"width:100%;text-align:left;\" onclick=\"window.parent.postMessage('redwarnPref', '*');\"><span class=\"material-icons\" style=\"padding-right:20px\">settings<\/span>REDWARN PREFERENCES<\/div><hr style=\"margin:0\"\/><div class=\"mdl-button mdl-js-button\" style=\"width:100%;text-align:left;\" onclick=\"window.parent.postMessage('redwarnTalk', '*');\"><span class=\"material-icons\" style=\"padding-right:20px\">question_answer<\/span>GO TO THE REDWARN TALK PAGE<\/div><hr style=\"margin:0\"\/><\/div><script>window.onmessage = e=>{ \/\/ On any message we just set the text, not much logic here\n        console.log(e);\n        if (e.data == \"AIVReportExist\"){\n            $(\"#AIVreportForm\").html(\"<h5>It looks like this user has already been reported to AIV.<\/h5>\");\n            $(\"#AIVsubmitBtn\").hide(); \/\/ hide submit button\n        } else if (e.data == \"UAAReportExist\"){\n            $(\"#UAAreportForm\").html(\"<h5>It looks like this user has already been reported to UAA.<\/h5>\");\n            $(\"#UAAsubmitBtn\").hide(); \/\/ hide submit button\n        } \n\n        \/\/ OTHER EXTENDED OPTIONS HANLDERS HERE\n    };<\/script>`","loadingSpinner.html":"`<div class=\"mdl-spinner mdl-spinner--single-color mdl-js-spinner is-active\"><\/div><span style=\"padding-left:20px;position:absolute;padding-top:7px;font-size:16px;font-family:Roboto;\">`+ text +`<\/span><script>window.onmessage = e=>{ \/\/ On any message we just set the text, not much logic here\n        $(\"span\").text(e.data);\n    };<\/script>`","recentPageSelect.html":"`<h2 style=\"font-weight:200;\">Select Recent Page<\/h2><div style=\"height:365px;overflow:auto;\">${finalRVList}<\/div><span style=\"float:right;\"><button class=\"mdl-button mdl-js-button mdl-js-ripple-effect\" onclick=\"window.parent.postMessage('closeRecentPageDialog', '*');\">CANCEL<\/button><button id=\"submitBtn\" class=\"mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent\" onclick=\"selectPage();\">SELECT THIS PAGE<\/button><\/span><script>function selectPage() {\n        \/\/ Make sure something is checked and continue\n        if ($(\"input:checked\").val() != null) {\n            window.parent.postMessage('RecentPageDialogSel\\`'+ $(\"input:checked\").val(), '*'); \/\/ push selected index upstairs\n            window.parent.postMessage('closeRecentPageDialog', '*'); \/\/ close, we done\n        }\n    }<\/script>`","pendingReviewReason.html":"`<script>var closed = false;<\/script><h2 style=\"font-weight:200;font-size:45px;line-height:48px;\">`+ reviewAction +`<\/h2><p>`+ reviewCaption +`<\/p><br\/><form id=\"newMsgForm\" onsubmit=\"pushReview();\" action=\"#\"><div class=\"mdl-textfield mdl-js-textfield mdl-textfield--floating-label\" style=\"width:100%\"><input class=\"mdl-textfield__input\" type=\"text\" name=\"reviewReason\" id=\"reviewReason\" value=\"\"><label class=\"mdl-textfield__label\" for=\"reviewReason\">Comment<\/label><\/div><\/form><span style=\"float:right;\"><button class=\"mdl-button mdl-js-button mdl-js-ripple-effect\" onclick=\"closed=true;clearInterval(autoAcceptTimerCount);window.parent.postMessage('closeDialog', '*');\">CANCEL<\/button><button id=\"submitBtn\" class=\"mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent\" onclick=\"pushReview();\">SUBMIT REVIEW<\/button><\/span><script>function pushReview() {\n        var data = $('#newMsgForm').serializeArray().reduce(function(obj, item) {\n                obj[item.name] = item.value;\n                return obj;\n                }, {}); \/\/ form data\n        \n        let reason = data.reviewReason;\n        \n        \/\/ Submit it\n        window.parent.postMessage('reason\\\\\\`' + reason); \/\/ Push upstairs\n        window.parent.postMessage(\"closeDialog\"); \/\/ We done here.\n        return false; \/\/ prevent redirect\n\n    }\n\n    document.getElementById(\"reviewReason\").focus(); \/\/ focus on text box for quick rollback\n\n    \/\/ Auto accept in 5 seconds\n    var autoAcceptTimerTick;\n    var autoAcceptTimerCount = 0;\n    var autoAcceptStop = false; \/\/ used to not show another and cause ux issues if stopped\n    if (` + autoAccept + `) {\n        $(\"#submitBtn\").text(\"AUTO SUBMIT (\"+ (5 - autoAcceptTimerCount) +\")\");\n        autoAcceptTimerTick = setInterval(()=> {\n            autoAcceptTimerCount += 1; \/\/ up by one\n            if (!autoAcceptStop) $(\"#submitBtn\").text(\"AUTO SUBMIT (\"+ (5 - autoAcceptTimerCount) +\")\");\n            if ((autoAcceptTimerCount == 5) && (!closed)) {\n                \/\/ Time's up, clear timer and submit\n                clearInterval(autoAcceptTimerCount);\n                autoAcceptStop = true;\n                pushReview(); \/\/ send it\n            }\n        }, 1000); \/\/ Every second\n\n        \/\/ Cancel on key press or click\n        (_=>{$(document).keydown(_);$(document).click(_);})(()=>{\n            clearInterval(autoAcceptTimerCount);\n            $(\"#submitBtn\").text(\"SUBMIT REVIEW\");\n            autoAcceptStop = true;\n        });\n    }<\/script>`","multipleAction.html":"`<script>var messageHandlers = {};\n  window.onmessage = e=>{\n    if (messageHandlers[e.data]){messageHandlers[e.data]();} \/\/ Excecute handler if exact\n    else { \/\/ We find ones that contain\n        for (const evnt in messageHandlers) {\n            if ((evnt.substr(evnt.length - 1) == \"*\") && e.data.includes(evnt.substr(0, evnt.length - 2))) { \/\/ and includes w * chopped off\n                messageHandlers[evnt](e.data);\n                return;\n            } \/\/ if contains and ends with wildcard then we do it\n        }\n    }\n  };\n  function addMessageHandler(msg, callback) { \/\/ calling more than once will just overwrite\n    Object.assign(messageHandlers, ((a,b)=>{let _ = {}; _[a]=b; return _;})(msg, callback)); \/\/ function ab returns a good formatted obj\n  }<\/script><div class=\"mdl-layout mdl-js-layout mdl-layout--fixed-header\"><header class=\"mdl-layout__header\"><div class=\"mdl-layout__header-row\"><span class=\"mdl-layout-title\" style=\"width:calc(100% - 60px);\">` + rw.logoHTML + ` Multiple Action Tool<\/span><div id=\"helpMe\" class=\"icon material-icons\" style=\"float:right;\"><span style=\"cursor:pointer;padding-right:15px;\" onclick='Object.assign(document.createElement(\"a\"), { target: \"_blank\", href: \"https:\/\/en.wikipedia.org\/wiki\/User:Ed6767\/redwarn\/help\/Multiple_Action_Tool\"}).click();'> help<\/span><\/div><div class=\"mdl-tooltip\" for=\"helpMe\">Help!<\/div><div id=\"close\" class=\"icon material-icons\" style=\"float:right;\"><span style=\"cursor:pointer;padding-right:15px;\" onclick=\"window.parent.postMessage('closeDialogMA');\">clear<\/span><\/div><div class=\"mdl-tooltip\" for=\"close\">Close<\/div><\/div><\/header><main class=\"mdl-layout__content\" style=\"padding-left:5%;padding-right:5%;\"><div class=\"mdl-card mdl-shadow--4dp\" style=\"width:100%\"><div class=\"mdl-card__supporting-text\" id=\"mainLoadCard\" style=\"text-align:center;width:97.5%\"><h2 id=\"loadTitle\">Loading user info...<\/h2><br\/><div id=\"p1\" class=\"mdl-progress mdl-js-progress\" style=\"width:100%\"><\/div><br\/><i id=\"loadingSupportText\"><\/i><\/div><div class=\"mdl-card__supporting-text\" id=\"mainFilterControlCard\" style=\"display:none;\"><h5>Toggle Select: &nbsp; &nbsp;\n          <button class=\"mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--colored\" onclick=\"toggleCheck('unregistered', true);\">UNREGISTERED \/ UNKNOWN<\/button> &nbsp; <button class=\"mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--colored\" onclick=\"toggleCheck(10);\">&lt; 10 edits<\/button><button class=\"mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--colored\" onclick=\"toggleCheck(50);\">&lt; 50 edits<\/button><button class=\"mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--colored\" onclick=\"toggleCheck(250);\">&lt; 250 edits<\/button><button class=\"mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--colored\" onclick=\"toggleCheck(500);\">&lt; 500 edits<\/button><button class=\"mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--colored\" onclick=\"toggleCheck('experienced', true);\">EXPERIENCED<\/button><\/h5><h5>Set Text from: &nbsp; &nbsp;\n          <button class=\"mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--colored\" onclick=\"if (boxChecked()) window.parent.postMessage('RWMATnewNotice');\">Warn User<\/button> &nbsp; <button class=\"mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--colored\" onclick=\"if (boxChecked()) window.parent.postMessage('RWMATnewMsg');\">New Message<\/button><\/h5><h5>Actions: &nbsp; &nbsp;\n          <button class=\"mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--colored\" onclick=\"removeSelected();\">Remove Selected<\/button> &nbsp; <button class=\"mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent\" onclick=\"if (boxChecked()) commitSelected();\">Commit Selected<\/button><\/h5><\/div><\/div><br\/><br\/><table class=\"mdl-data-table mdl-js-data-table mdl-data-table--selectable mdl-shadow--2dp\" style=\"width:100%\"><thead><tr><th class=\"mdl-data-table__cell--non-numeric\">User<\/th><th>Related Contributions<\/th><th>Total Edit Count<\/th><th>Standing<\/th><th>Text to add<\/th><th>Under date?<\/th><\/tr><\/thead><tbody>`+ listHTML +`<\/tbody><\/table><div id=\"rw-toast\" class=\"mdl-js-snackbar mdl-snackbar\"><div class=\"mdl-snackbar__text\"><\/div><button class=\"mdl-snackbar__action\" type=\"button\"><\/button><\/div><\/main><script>\/\/ Set show toast function once load finished\n  var pushToast;\n  window.onload = () => {\n    'use strict';\n    window['counter'] = 0;\n    var toast = document.querySelector('#rw-toast');\n    componentHandler.upgradeElement(toast); \/\/ register comp\n\n    \/\/ create function\n    pushToast = (text, buttonTxt, btnClick, tOut) => {\n        'use strict';\n        if (buttonTxt) {\n            \/\/ Show with action and button\n            toast.MaterialSnackbar.showSnackbar({message: text, actionHandler: btnClick, actionText: buttonTxt, timeout: tOut}); \n        } else {\n            \/\/ Show just message\n            toast.MaterialSnackbar.showSnackbar({message: text, timeout: tOut});\n        }\n    };\n\n    \/\/ Register all tolltips\n    for (let item of document.getElementsByClassName(\"mdl-tooltip\")) {\n      componentHandler.upgradeElement(item); \n    }\n  };\n\n  \/\/ Progress bar\n  var setProgress = (val, max)=>{if (val == max) {$(\"#mainLoadCard\").hide(); $(\"#mainFilterControlCard\").show();}}; \/\/ placeholder function, main defined once progress bar registered\n  \n  document.querySelector('#p1').addEventListener('mdl-componentupgraded', ()=>{\n    setProgress = (val, max) => {\n      \/\/ Calc percent done and set\n      document.querySelector('#p1').MaterialProgress.setProgress((100 * val) \/ max); \/\/ set progress bar\n      $(\"#loadingSupportText\").text(\"User \"+ (val + 1) + \" of \" + (max+1) + \" (\"+ Math.round((100 * val) \/ max) + \"%)\"); \/\/ set support text\n      if (val == max) {\n        \/\/ Max reached, show main filter\n        $(\"#mainLoadCard\").hide(); $(\"#mainFilterControlCard\").show();\n      }\n    };\n  });\n\n  \/\/ Main\n  var userActions = {}; \/\/ useractions: wikitext, underdate\n\n  \/\/ Add checkbox handlers\n  setInterval(checkUpdate, 100); \/\/ refresh every 100ms\n  function checkUpdate() {\n    \/\/ Update checked boxes\n    let checkedBoxes = $(\"tbody > tr > td:visible > label > input:checked\");\n    $(\".mdl-layout-title\").html('`+ rw.logoHTML +` Multiple Action Tool'+\n    (checkedBoxes.length > 0 ?\n      \" (\" + checkedBoxes.length + \" user\" + (checkedBoxes.length > 1 ? \"s\": \"\") + \" selected)\"\n      : \"\")); \n  }\n\n  \/\/ Toggle check boxes toggleCheck(type or max top, is type?)\n  function toggleCheck(filter, isType) {\n    \/\/ For each in table rows\n    $(\"tbody > tr\").each((i, el)=>{\n      let editCount = $($(el).find(\"td:visible\")[3]).text().replace(\",\", \"\"); \/\/ 4th collumn (checkbox counts as one too!)\n      if ((filter == \"unregistered\") && (isNaN(editCount))) { \/\/ Unregistered \/ Unknown\n        $(el).find(\"td:visible > label > input:checkbox\").click(); \/\/ invoke click to toggle\n      } else if ((filter == \"experienced\") && (editCount > 499)) { \/\/ experienced\n        $(el).find(\"td:visible > label > input:checkbox\").click(); \/\/ invoke click to toggle\n      } else if ((!isType) && editCount < filter) { \/\/ normal filter\n        $(el).find(\"td:visible > label > input:checkbox\").click(); \/\/ invoke click to toggle\n      }\n    });\n  }\n\n  function removeSelected() {\n    \/\/ Hide all selected elements \n    $(\"tbody > tr\").each((i, el)=>{\n      if ($(el).find(\"td:visible > label > input:checkbox:checked\").length > 0) {\n        \/\/ remove element as checked\n        $(el).find(\"td:visible > label > input:checkbox\").click(); \/\/ click to uncheck\n        $(el).fadeOut(); \/\/ hide\n      }\n    });\n  }\n\n  function boxChecked() { \/\/ Return if any checkbox is checked or not\n    let bc = $(\"tbody > tr > td:visible > label > input:checked\").length > 0;\n    if (!bc) {\n      \/\/ Push toast\n      pushToast(\"Please select a user.\");\n    }\n    return bc;\n  } \n\n  \/\/ SET TEXT UNDER DATE HANDLER\n  addMessageHandler(\"applyToChecked\\`*\", cI=>{ \/\/ apply to checked b64 txt, underDate (Yes\/No), source (i.e Warn User)\n    let textToAdd = atob(cI.split(\"\\`\")[1]);\n    let underDate = cI.split(\"\\`\")[2];\n    let source = cI.split(\"\\`\")[3];\n    $(\"tbody > tr\").each((i, el)=>{ \/\/ for each row\n      if ($(el).find(\"td:visible > label > input:checkbox:checked\").length > 0) { \/\/ if checked\n        $($(el).find(\"td:visible\")[5]).text(source); \/\/ 6th collumn (on click open preview)\n        $($(el).find(\"td:visible\")[6]).text(underDate); \/\/ 7th\n        \/\/ Apply to object based on username (2nd)\n        userActions[$($(el).find(\"td:visible\")[1]).text()] = {\n          \"toAdd\" : textToAdd,\n          \"underDate\": (underDate.toLowerCase() == \"yes\")\n        };\n      }\n    });\n  });\n\n  \/\/ COMMIT SELECTED - i.e actually do\n  function commitSelected() {\n    \/\/ Ensure action has been set for all checked\n    let notAllFilled = false;\n    $(\"tbody > tr\").each((i, el)=>{ \/\/ for each row\n      if ($(el).find(\"td:visible > label > input:checkbox:checked\").length > 0) { \/\/ if checked\n         notAllFilled = ($($(el).find(\"td:visible\")[5]).text() == \"-\") \/\/If 6th col has blank symb, stop and notif\n      }\n    });\n\n    if (notAllFilled) {\n      \/\/ Not all filled, warn and exit\n      pushToast(\"Please set an action for the selected users.\");\n      return; \/\/exit\n    } \/\/ else continue\n    \n    \/\/ Show confirm dialog\n    window.parent.postMessage('RWMATcommitSelectedConfirm\\`'+ $(\"tbody > tr > td:visible > label > input:checked\").length); \/\/ push request for confirm to top\n\n    \/\/ When confirmed\n    addMessageHandler(\"confirmSelected\", ()=>{\n      \/\/ load dialog is already showing, so interaction impossible in normal use\n      \/\/ Now for each\n      $(\"tbody > tr\").each((i, el)=>{ \/\/ for each row\n        if ($(el).find(\"td:visible > label > input:checkbox:checked\").length > 0) { \/\/ if checked\n          let username = $($(el).find(\"td:visible\")[1]).text(); \/\/ get username\n          let userAct = userActions[username]; \/\/ set action\n          let userIsIp = (username.match(\/([0-9A-Fa-f]{1,4}:){7}[0-9A-Fa-f]{1,4}|(\\d{1,3}\\.){3}\\d{1,3}\/g) != null); \/\/ regex match all IPS\n          \/\/ Time to commit\n          let finalWikiTxt = userAct.toAdd;\n          if (userAct.underDate && userIsIp) {\n            \/\/ Add shared IP advice for under date\n            finalWikiTxt += \"`+rw.sharedIPadvice()+`\";\n          }\n\n          \/\/ Finally, push upstairs to be done.\n          window.parent.postMessage('RWMATToAdd\\`'+ btoa(finalWikiTxt) + '\\`'+ userAct.underDate + '\\`'+ username);\n          \/\/ Done - Now remove original\n          $(el).find(\"td:visible > label > input:checkbox\").click(); \/\/ click to uncheck\n          $(el).fadeOut(); \/\/ hide\n        }\n      });\n      \/\/ We done\n      window.parent.postMessage('RWMATfinishedandcommit'); \/\/ start the commits back upstairs\n    });\n  }<\/script><\/div>`","quickTemplateSelectPack.html":"`<h2 style=\"font-weight:200;font-size:45px;line-height:48px;\">Select Template Pack<\/h2><div style=\"height:400px;overflow:auto;\">` + finalBtnStr + `\n    <button class=\"mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--colored\" style=\"width:100%\" onclick=\"Object.assign(document.createElement('a'), { target: '_blank', href: 'https:\/\/en.wikipedia.org\/wiki\/WP:REDWARN\/QTPACKS'}).click();\"> HELP \/ GET MORE TEMPLATE PACKS<\/button><br\/><br\/><button class=\"mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--colored\" style=\"width:100%\" onclick=\"window.parent.postMessage('closeDialog', '*');window.parent.postMessage('qTnewPack', '*');\">CREATE NEW TEMPLATE PACK<\/button><\/div><span style=\"float:right;\"><button class=\"mdl-button mdl-js-button mdl-js-ripple-effect\" onclick=\"window.parent.postMessage('closeDialog', '*');\">CANCEL<\/button><\/span>`","quickTemplateSelectTemplate.html":"`<h2 style=\"font-weight:200;font-size:45px;line-height:48px;\">`+selectedPack.name+`<\/h2><div style=\"height:390px;overflow:auto;\">` + finalSelectStr + `<label class=\"mdl-radio mdl-js-radio mdl-js-ripple-effect\" for=\"template-NEW\"><input type=\"radio\" id=\"template-NEW\" class=\"mdl-radio__button\" name=\"options\" value=\"NEW\" onchange=\"\n        if ($( 'input:checked' ).val() == 'NEW') {$('#createNewContainer').show();} else {$('#createNewContainer').hide();}\n    \"><span class=\"mdl-radio__label\">Create New Template<\/span><\/label><div id=\"createNewContainer\" style=\"display:none;\"><br><div class=\"mdl-textfield mdl-js-textfield mdl-textfield--floating-label\" style=\"width:100%;\"><input class=\"mdl-textfield__input\" type=\"text\" id=\"createNewTitle\"><label class=\"mdl-textfield__label\" for=\"createNewTitle\">Title<\/label><\/div><br\/><div class=\"mdl-textfield mdl-js-textfield\" style=\"width:100%;\"><textarea class=\"mdl-textfield__input\" type=\"text\" rows= \"3\" id=\"createNewAbout\"><\/textarea><label class=\"mdl-textfield__label\" for=\"createNewAbout\">Description<\/label><\/div><br\/><i>Click \"edit\" to create and begin editing your template.<\/i><\/div><hr\/><button class=\"mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--colored\" style=\"width:100%;\" onclick=\"window.parent.postMessage('qTPublish', '*');\">MANAGE PUBLISHING<\/button><br\/><br\/><button class=\"mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--colored\" style=\"width:100%;background-color:red;\" onclick=\"window.parent.postMessage('qTdeletePack', '*');\">DELETE THIS PACK<\/button><\/div><span style=\"float:right;\"><button class=\"mdl-button mdl-js-button mdl-js-ripple-effect\" onclick=\"window.parent.postMessage('closeDialog', '*');\">CANCEL<\/button><button class=\"mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent\" onclick=\"handleNext();\">${(editMode ? \"EDIT\" : \"CONTINUE\")}<\/button><\/span><script>\/\/ Used to handle next\n    function handleNext() {\n        if ($( \"input:checked\" ).length > 0) { \/\/ only continue if selection\n            if ($( \"input:checked\" ).val() == \"NEW\") {\n                \/\/ Create new (qTNew Title Description)\n                if ($( \"#createNewTitle\" ).val().length > 2) { \/\/ if long enough\n                    window.parent.postMessage('qTNew\\`'+ $( \"#createNewTitle\" ).val() + '\\`' + $( \"#createNewAbout\" ).val(), '*');\n                }\n            } else { \/\/ Else continue as normal (qTEdit in edit mode, qTNext normal)\n                window.parent.postMessage('qT`+ (editMode ? \"Edit\": \"Next\") +`\\`'+ $( \"input:checked\" ).val(), '*');\n            }\n        }\n    }<\/script>`","quickTemplateSubmit.html":"`<style>h2{font-size:20px;line-height:0}.mw-editsection{display:none}<\/style><h2 style=\"font-weight:200;font-size:45px;line-height:48px;\">`+selectedPack.name+`<\/h2><h5>`+selectedTemplate.title+`<\/h5><i>`+ selectedTemplate.about +`<\/i><div style=\"height:340px;overflow:auto;\"><div class=\"mdl-textfield mdl-js-textfield mdl-textfield--floating-label\" style=\"width:100%\"><input class=\"mdl-textfield__input\" type=\"text\" id=\"trgtUsrVisualBox\" value=\"`+ rw.info.targetUsername(un) +`\" readonly><label class=\"mdl-textfield__label\" for=\"trgtUsrVisualBox\">Target<\/label><div class=\"mdl-tooltip\" for=\"trgtUsrVisualBox\">To target a different user, please visit their userpage.<\/div><\/div>${finalAdditionalInputs}<span id=\"previewContainer\"><span id=\"editBtn\" class=\"material-icons\" style=\"font-size:16px;padding-bottom:3px;float:right;padding-right:5px;cursor:pointer;\" onclick=\"$('#previewContainer').hide();$('#editorContainer').show();\">create<\/span><div id=\"preview\" style=\"height:220px;overflow-y:auto;width:100%;\"><\/div><\/span><span id=\"editorContainer\" style=\"display:none;\"><span id=\"previewBtn\" class=\"material-icons\" style=\"font-size:16px;padding-bottom:3px;float:right;padding-right:5px;cursor:pointer;\" onclick=\"$('#previewContainer').show();$('#editorContainer').hide();grabPreview();\">visibility<\/span><div id=\"editor\"><textarea id=\"wikiTxt\" name=\"wikiTxt\" style=\"height:220px;max-height:220px;overflow-y:auto;width:100%;\">`+ contentStr +`<\/textarea><\/div><\/span><\/form><\/div><span style=\"float:right;\"><button class=\"mdl-button mdl-js-button mdl-js-ripple-effect\" onclick=\"window.parent.postMessage('closeDialog', '*');\">CANCEL<\/button><button class=\"mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent\" onclick=\"handleSubmit();\">SUBMIT<\/button><\/span><script>\/\/ Previews\n    window.onmessage = function(e){\n        if (e.data.action == 'parseWikiTxt') {\n            $(\"#preview\").html(e.data.result); \/\/ Set preview to content\n        }\n    };\n\n    function pushToast(text) {window.parent.postMessage('pushToast\\\\\\`' + text);} \/\/ Push toast to host\n\n    function grabPreview() {\n        let wikiTxt = document.getElementById(\"wikiTxt\").value;\n        window.parent.postMessage('generatePreview\\\\\\`'+ wikiTxt, '*');\n    }\n\n    \/\/ Used to handle submit\n    function handleSubmit() {\n        let wikiTxt = document.getElementById(\"wikiTxt\").value;\n        window.parent.postMessage('qtDone\\\\\\`' + btoa(wikiTxt)); \/\/ Push upstairs and commit\n        window.parent.postMessage(\"closeDialog\"); \/\/ We done here. Top will refresh or reshow if error occurs.\n    }\n\n    \/\/ Once loaded call load preview\n    grabPreview();\n    \n    \/\/ Generate preview on change\n    var previewTO;\n    function refreshPreview() {\n        clearTimeout(previewTO); \/\/ cancel TO\n        let originalText = atob(\"`+ btoa(selectedTemplate.content) +`\");\n        \/\/ Now replace for each input\n        \n        $(\".rwCustomTextInput\").each((i, el)=>{\n            console.log(originalText);\n            console.log(atob($(el).attr(\"id\")));\n            originalText = originalText.replace(atob($(el).attr(\"id\")), $(el).val()); \/\/ replace case with inputted text\n        });\n\n        \/\/ Now set the text input\n        $(\"#wikiTxt\").val(originalText);\n\n        \n        grabPreview(); \/\/ now load preview\n\n    }\n\n    \/\/ Add event handler for inputboxes\n    $(\".rwCustomTextInput\").change(()=>refreshPreview());<\/script>`","quickTemplateNewPack.html":"`<h2 style=\"font-weight:200;font-size:45px;line-height:48px;\">Create Template Pack<\/h2><div class=\"mdl-textfield mdl-js-textfield mdl-textfield--floating-label\" style=\"width:100%\"><input class=\"mdl-textfield__input\" type=\"text\" id=\"templatePackName\" maxlength=\"15\"><label class=\"mdl-textfield__label\" for=\"templatePackName\">Template Pack Name<\/label><\/div><span style=\"float:right;\"><button class=\"mdl-button mdl-js-button mdl-js-ripple-effect\" onclick=\"window.parent.postMessage('closeDialog', '*');\">CANCEL<\/button><button id=\"submitBtn\" class=\"mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent\" onclick=\"createPack();\">CREATE<\/button><\/span><script>function pushToast(text) {window.parent.postMessage('pushToast\\\\\\`' + text);} \/\/ Push toast to host\n\n    function createPack() {\n        \/\/ Submit pack\n        let packName = $(\"#templatePackName\").val();\n        \/\/ Check length is between 4-15 chars\n        if (packName.length > 15 || packName.length < 4) {\n            pushToast(\"Please ensure your template name is between four and fifteen characters long.\");\n            return; \/\/ stop\n        }\n        \/\/ Now we can send to top\n        window.parent.postMessage('qTcreateNew\\`'+ packName, '*');\n        window.parent.postMessage('closeDialog', '*'); \/\/ close, we're done\n    }<\/script>`","quickTemplateEditTemplate.html":"`<h2 style=\"font-weight:200;font-size:45px;line-height:48px;\">`+selectedPack.name+`<\/h2><div style=\"height:400px;overflow:auto;\"><div class=\"mdl-textfield mdl-js-textfield mdl-textfield--floating-label\" style=\"width:100%;\"><input class=\"mdl-textfield__input\" type=\"text\" id=\"title\"> <script>$(\"#title\").val(atob(\"`+ btoa(selectedTemplate.title) +`\"));<\/script><label class=\"mdl-textfield__label\" for=\"title\">Title<\/label><\/div><br\/><div class=\"mdl-textfield mdl-js-textfield\" style=\"width:100%;\"><textarea class=\"mdl-textfield__input\" type=\"text\" rows= \"3\" id=\"about\">`+ selectedTemplate.about +`<\/textarea><label class=\"mdl-textfield__label\" for=\"about\">Description<\/label><\/div><h5>Edit source<\/h5><i>Create your template below. For more help, see the <a href=\"https:\/\/en.wikipedia.org\/wiki\/WP:REDWARN\/QTPACKS\" target=\"_blank\">help page.<\/a><\/i><div class=\"mdl-textfield mdl-js-textfield\" style=\"width:100%;\"><textarea class=\"mdl-textfield__input\" type=\"text\" rows=\"5\" id=\"content\" style=\"font-family:monospace;\">`+ selectedTemplate.content +`<\/textarea><label class=\"mdl-textfield__label\" for=\"content\">Content<\/label><\/div><\/div><span style=\"float:right;\"><button id=\"exitBtn\" class=\"mdl-button mdl-js-button mdl-js-ripple-effect\">EXIT<\/button> &nbsp; <button id=\"testBtn\" class=\"mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent\">TEST<\/button> &nbsp; <button id=\"saveBtn\" class=\"mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent\">SAVE CHANGES<\/button><\/span><script>\/\/ Add handlers\n    $(\"#exitBtn\").click(()=>{\n        window.parent.postMessage('qTClose\\`'+ btoa($(\"#title\").val()) + \"\\`\" + btoa($(\"#about\").val()) + \"\\`\" + btoa($(\"#content\").val()), '*');\n    });\n\n    $(\"#testBtn\").click(()=>{\n        \/\/ Test changes\n        window.parent.postMessage('qTTest\\`'+ btoa($(\"#title\").val()) + \"\\`\" + btoa($(\"#about\").val()) + \"\\`\" + btoa($(\"#content\").val()), '*');\n    });\n\n    $(\"#saveBtn\").click(()=>{\n        \/\/ Save changes here\n        window.parent.postMessage('qTSave\\`'+ btoa($(\"#title\").val()) + \"\\`\" + btoa($(\"#about\").val()) + \"\\`\" + btoa($(\"#content\").val()), '*');\n    });<\/script>`","requestPageProtect.html":"`<h2 style=\"font-weight:200;font-size:45px;line-height:48px;\">Manage Page Protection<\/h2><span style=\"font-size:32px;font-weight:200;font-family:Roboto;\">${protectionInfo.title}<\/span><h4>Request a level<\/h4><div style=\"display:flex;height:400px;\"><div style=\"flex:0 0 45%;padding-right:10px;\"><span id=\"radioContainer\">${finLevelListStr}<\/span><\/div><div style=\"flex:1;\"><div class=\"mdl-textfield mdl-js-textfield mdl-textfield--floating-label getmdl-select\"><input type=\"text\" value=\"\" class=\"mdl-textfield__input\" id=\"reasonRequestSelector\" readonly><input type=\"hidden\" value=\"\" name=\"reasonRequestSelector\"><i class=\"mdl-icon-toggle__label material-icons\">keyboard_arrow_down<\/i><label for=\"reasonRequestSelector\" class=\"mdl-textfield__label\">Reason<\/label><ul for=\"reasonRequestSelector\" class=\"mdl-menu mdl-menu--bottom-left mdl-js-menu\" style=\"height:300px;overflow:auto;\"><li class=\"mdl-menu__item\">Persistent Vandalism<\/li><li class=\"mdl-menu__item\">Persistent Disruptive Editing<\/li><li class=\"mdl-menu__item\">Content Dispute\/Edit Warring<\/li><li class=\"mdl-menu__item\">BLP Policy Violations<\/li><li class=\"mdl-menu__item\">Sockpuppetry<\/li><li class=\"mdl-menu__item\">User Talk Of Blocked User<\/li><li class=\"mdl-menu__item\">Highly Visible Template<\/li><li class=\"mdl-menu__item\">Arbitration Enforcement<\/li><li class=\"mdl-menu__item\" id=\"RWRFPPotherRationale\">Other rationale<\/li><\/ul><\/div><div class=\"mdl-textfield mdl-js-textfield mdl-textfield--floating-label\"><input class=\"mdl-textfield__input\" type=\"text\" id=\"extraInfoTxtBox\"><label class=\"mdl-textfield__label\" for=\"extraInfoTxtBox\">Additional Info<\/label><\/div><br\/><span><span style=\"padding-right:10px;font-weight:500;font-family:Roboto;\">Protection duration:<\/span><label id=\"tempTimeLbl\" class=\"mdl-radio mdl-js-radio mdl-js-ripple-effect\" for=\"tempTime\" style=\"padding-right:10;\"><input type=\"radio\" id=\"tempTime\" class=\"mdl-radio__button\" name=\"timeLvl\" value=\"Temporary\" checked><span class=\"mdl-radio__label\"><span class=\"material-icons\">timer<\/span><\/span><\/label><div class=\"mdl-tooltip mdl-tooltip--large\" for=\"tempTimeLbl\">Temporary<\/div><label id=\"indefTimeLbl\" class=\"mdl-radio mdl-js-radio mdl-js-ripple-effect\" for=\"indefTime\" style=\"padding-right:10;\"><input type=\"radio\" id=\"indefTime\" class=\"mdl-radio__button\" name=\"timeLvl\" value=\"Indefinite\"><span class=\"mdl-radio__label\"><span class=\"material-icons\">all_inclusive<\/span><\/span><\/label><div class=\"mdl-tooltip mdl-tooltip--large\" for=\"indefTimeLbl\">Indefinite<\/div><\/span><p style=\"color:#737373;font-family:Roboto;font-size:small;padding-top:10px;\">You should not consider requesting page protection as a method for continuing an argument from elsewhere nor as a venue for starting a\n            new discussion regarding article content. If a request contains excessive argument, appears to be intended to resolve a content dispute,\n            includes personal attacks or uncivil comments, or has any other unrelated discussion, it will be removed and no action will be taken.<\/p><\/div><\/div><span style=\"float:right;\"><button class=\"mdl-button mdl-js-button mdl-js-ripple-effect\" onclick=\"window.parent.postMessage('closeDialog', '*');\">CANCEL<\/button><button id=\"submitBtn\" class=\"mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent\" onclick=\"submitRequest();\">SUBMIT REQUEST<\/button><\/span><script>\/\/ Handle incoming data\n    window.onmessage = function(e){\n        if (e.data.action == 'parseWikiTxt') {\n            $(\"#preview\").html(e.data.result); \/\/ Set preview to content\n        }\n    };\n\n    function pushToast(text) {window.parent.postMessage('pushToast\\\\\\`' + text);} \/\/ Push toast to host\n\n    function submitRequest() {\n        \/\/ Send our request back to the top, after making sure everything is ok\n        if ($(\"#radioContainer\").find(\"input:checked\").length > 0) { \/\/ Ensure a value is checked\n            let requestLevel = $(\"#radioContainer\").find(\"input:checked\").attr(\"id\"); \/\/ get checked ID\n            let changeCoreReason = $(\"#reasonRequestSelector\").val(); \/\/ get core reason for change\n            let changeExtraInfo = $(\"#extraInfoTxtBox\").val(); \/\/ ger extra info\n            let requestDuration = (($(\"#indefTime:checked\").length > 0) ? \"Indefinite\" : \"Temporary\"); \/\/ indef protection\n\n            if (!changeCoreReason) {pushToast(\"Please select a reason\");return;} \/\/ if no core reason, toast and EXIT.\n\n            \/\/ let's continue and push upstairs\n            window.parent.postMessage('submitRFPP\\`' + requestLevel + '\\`' + changeCoreReason + '\\`' + changeExtraInfo + '\\`' + requestDuration);\n\n            \/\/ We done here - let's close\n            window.parent.postMessage('closeDialog', '*');\n        } else {\n            \/\/ No level checked\n            pushToast(\"Please select a protection level.\");\n        }\n    }\n    \/\/ Egg\n    $(\"#RWRFPPotherRationale\").keydown(e=>{if (\"R\"==e.key && confirm(\"You are about to open an external link to YouTube.com - continue?\"))Object.assign(document.createElement(\"a\"),{target:\"_blank\",href:\"https:\/\/www.youtube.com\/watch?v=o9gjoozRYlk\"}).click()});<\/script>`","firstTimeSetup.html":"`<script src=\"https:\/\/redwarn.toolforge.org\/cdn\/js\/sortable.js\"><\/script><script src=\"https:\/\/redwarn.toolforge.org\/cdn\/js\/jquery-sortable.js\"><\/script><script>\/\/ Colour theme preview\n    function updateColourTheme() {\n        \/\/ Show loading dialog\n        window.parent.postMessage('newThemeDialog');\n        \/\/ Add stylesheet for this version\n        setTimeout(()=>$('head').append('<link rel=\"stylesheet\" type=\"text\/css\" onload=\"window.parent.postMessage(\\\\\\'loadDialogClose\\\\\\');\" href=\"https:\/\/redwarn.toolforge.org\/cdn\/css\/material.' + $(\"input[name=colTheme]:checked\").val() + '.min.css\">'), 500);\n    }<\/script><div class=\"mdl-layout mdl-js-layout mdl-layout--fixed-header\"><header class=\"mdl-layout__header\"><div class=\"mdl-layout__header-row\"><span class=\"mdl-layout-title\" style=\"width:calc(100% - 60px);\">First Time Setup<\/span><div id=\"close\" class=\"icon material-icons\" style=\"float:right;\"><span style=\"cursor:pointer;padding-right:15px;\" onclick=\"window.parent.postMessage('closeDialog');\">clear<\/span><\/div><div class=\"mdl-tooltip\" for=\"close\">Close for now<\/div><\/div><\/header><main class=\"mdl-layout__content\" style=\"padding-left:5%;padding-right:5%;\"><br\/><br\/><div class=\"mdl-card mdl-shadow--2dp\" style=\"width:100%\" id=\"prefCard\"><div class=\"mdl-card__title\" style=\"color:#fff;height:176px;background:url(https:\/\/upload.wikimedia.org\/wikipedia\/commons\/b\/b6\/Reflected_sunset.jpg) center \/ cover;\"><h2 class=\"mdl-card__title-text\">Welcome to&nbsp;${rw.logoHTML}&nbsp;${rw.version}!<\/h2><\/div><div class=\"mdl-card__supporting-text\"><h5>Congratulations! You've successfully installed RedWarn, the user-<span id=\"hahaFunnyJoke\">friendly<\/span> counter-vandalism tool.<\/h5><script>$(\"#hahaFunnyJoke\").on(\"click\", ()=>{if (confirm(\"You are about to open an external link to YouTube.com - continue?\")) Object.assign(document.createElement('a'), { target: '_blank', href: \"https:\/\/www.youtube.com\/watch?v=aqsL0QQaSP4\"}).click();});<\/script><p>We hope you'll enjoy using it. RedWarn will now guide you through setting up a few prefences in order to make your RedWarn experience optimimal for you.<\/p><form id=\"config\"><h5>Set a colour theme<\/h5><img src=\"https:\/\/upload.wikimedia.org\/wikipedia\/commons\/7\/7e\/RedWarnUIColourSchemes.png\" style=\"width:475px;float:left;padding-right:50px;\"\/><p>This will affect elements within RedWarn's interface only, such as buttons and links.<\/p><label class=\"mdl-radio mdl-js-radio mdl-js-ripple-effect\" for=\"option-1\"><input type=\"radio\" id=\"option-1\" class=\"mdl-radio__button\" name=\"colTheme\" value=\"blue-indigo\" checked onchange=\"updateColourTheme();\"><span class=\"mdl-radio__label\">WikiBlue (default)<\/span><\/label><br\/><label class=\"mdl-radio mdl-js-radio mdl-js-ripple-effect\" for=\"option-2\"><input type=\"radio\" id=\"option-2\" class=\"mdl-radio__button\" name=\"colTheme\" value=\"amber-yellow\" onchange=\"updateColourTheme();\"><span class=\"mdl-radio__label\">Sunshine<\/span><\/label><br\/><label class=\"mdl-radio mdl-js-radio mdl-js-ripple-effect\" for=\"option-3\"><input type=\"radio\" id=\"option-3\" class=\"mdl-radio__button\" name=\"colTheme\" value=\"purple-deep_purple\" onchange=\"updateColourTheme();\"><span class=\"mdl-radio__label\">Purple Power<\/span><\/label><br\/><label class=\"mdl-radio mdl-js-radio mdl-js-ripple-effect\" for=\"option-4\"><input type=\"radio\" id=\"option-4\" class=\"mdl-radio__button\" name=\"colTheme\" value=\"blue_grey-red\" onchange=\"updateColourTheme();\"><span class=\"mdl-radio__label\">RedWarn Minimal<\/span><\/label><br\/><label class=\"mdl-radio mdl-js-radio mdl-js-ripple-effect\" for=\"option-5\"><input type=\"radio\" id=\"option-5\" class=\"mdl-radio__button\" name=\"colTheme\" value=\"brown-light_green\" onchange=\"updateColourTheme();\"><span class=\"mdl-radio__label\">Forrest<\/span><\/label><br\/><label class=\"mdl-radio mdl-js-radio mdl-js-ripple-effect\" for=\"option-6\"><input type=\"radio\" id=\"option-6\" class=\"mdl-radio__button\" name=\"colTheme\" value=\"orange-deep_orange\" onchange=\"updateColourTheme();\"><span class=\"mdl-radio__label\">Orange Juice<\/span><\/label><br\/><label class=\"mdl-radio mdl-js-radio mdl-js-ripple-effect\" for=\"option-7\"><input type=\"radio\" id=\"option-7\" class=\"mdl-radio__button\" name=\"colTheme\" value=\"pink-red\" onchange=\"updateColourTheme();\"><span class=\"mdl-radio__label\">Candy Floss<\/span><\/label><br><br><h5>How do your prefer to select your warning templates?<\/h5><p>RedWarn can either display warning templates as their descriptor (i.e. \"Vandalism\"), or the template name (i.e. \"uw-vandalism\").\n                        If you select template name, RedWarn will show it's descriptor when you hover over it in the dropdown. Which do you prefer?<\/p><label class=\"mdl-radio mdl-js-radio mdl-js-ripple-effect\" for=\"rwNoticeListByTemplateNameDisable\"><input type=\"radio\" id=\"rwNoticeListByTemplateNameDisable\" class=\"mdl-radio__button\" name=\"rwNoticeListByTemplateName\" value=\"disable\" checked><span class=\"mdl-radio__label\">Template descriptions (i.e. Vandalism)<\/span><\/label> &nbsp;&nbsp; <label class=\"mdl-radio mdl-js-radio mdl-js-ripple-effect\" for=\"rwNoticeListByTemplateName\"><input type=\"radio\" id=\"rwNoticeListByTemplateName\" class=\"mdl-radio__button\" name=\"rwNoticeListByTemplateName\" value=\"enable\"><span class=\"mdl-radio__label\">Template name (i.e. uw-vandalism)<\/span><\/label><h5>Automation<\/h5><p>RedWarn can use an algorithm to automatically select what it thinks is the best warning level for an editor.\n                        This may be influenced by ORES scores, and the last warning level that other editors have given the target editor.\n                        This option also enables automatic warning template selection when using quick rollback. <strong>Always check before you warn!<\/strong><\/p><label class=\"mdl-radio mdl-js-radio mdl-js-ripple-effect\" for=\"rwautoLevelSelectDisableEnable\"><input type=\"radio\" id=\"rwautoLevelSelectDisableEnable\" class=\"mdl-radio__button\" name=\"rwautoLevelSelectDisable\" value=\"enable\" checked><span class=\"mdl-radio__label\">Enable automation<\/span><\/label> &nbsp;&nbsp; <label class=\"mdl-radio mdl-js-radio mdl-js-ripple-effect\" for=\"rwautoLevelSelectDisable\"><input type=\"radio\" id=\"rwautoLevelSelectDisable\" class=\"mdl-radio__button\" name=\"rwautoLevelSelectDisable\" value=\"disable\"><span class=\"mdl-radio__label\">Disable automation, I want to select everything manually<\/span><\/label><br\/><br\/><span style=\"font-size:small;\">Please note: To prevent abuse and spam, automation is disabled for autoconfirmed users.\n                        Your selected preference will only be honored if you have the \"extended-confirmed\" user right.\n                        You should automatically gain this when you reach 500 edits on an account that is at least 30 days old.<\/span><br\/><br\/><h5>What do you want to happen when you finish reverting an edit?<\/h5><p>When you finish reverting an edit, RedWarn can do a number of things depending on your workflow. Which do you prefer?<\/p><label class=\"mdl-radio mdl-js-radio mdl-js-ripple-effect\" for=\"rwRollbackDoneOptionNewNotice\"><input type=\"radio\" id=\"rwRollbackDoneOptionNewNotice\" class=\"mdl-radio__button\" name=\"rwRollbackDoneOption\" value=\"RWRBDONEwarnUsr\" checked><span class=\"mdl-radio__label\">Warn the user (recommended)<\/span><\/label><br\/><label class=\"mdl-radio mdl-js-radio mdl-js-ripple-effect\" for=\"rwRollbackDoneOptionSendMsg\"><input type=\"radio\" id=\"rwRollbackDoneOptionSendMsg\" class=\"mdl-radio__button\" name=\"rwRollbackDoneOption\" value=\"RWRBDONEnewUsrMsg\"><span class=\"mdl-radio__label\">Send the user a talk page message<\/span><\/label><br\/><label class=\"mdl-radio mdl-js-radio mdl-js-ripple-effect\" for=\"rwRollbackDoneOptionQuickTemplate\"><input type=\"radio\" id=\"rwRollbackDoneOptionQuickTemplate\" class=\"mdl-radio__button\" name=\"rwRollbackDoneOption\" value=\"RWRBDONEwelcomeUsr\"><span class=\"mdl-radio__label\">Open the Quick Template dialog<\/span><\/label><br\/><label class=\"mdl-radio mdl-js-radio mdl-js-ripple-effect\" for=\"rwRollbackDoneOptionLatestRev\"><input type=\"radio\" id=\"rwRollbackDoneOptionLatestRev\" class=\"mdl-radio__button\" name=\"rwRollbackDoneOption\" value=\"RWRBDONEmrevPg\"><span class=\"mdl-radio__label\">Redirect to the latest revision<\/span><\/label><br\/><label class=\"mdl-radio mdl-js-radio mdl-js-ripple-effect\" for=\"rwRollbackDoneOptionNothing\"><input type=\"radio\" id=\"rwRollbackDoneOptionNothing\" class=\"mdl-radio__button\" name=\"rwRollbackDoneOption\" value=\"none\"><span class=\"mdl-radio__label\">Ask me every time<\/span><\/label><br\/><br\/><h5>Set up your rollback buttons<\/h5><p>RedWarn offers many quick rollback options that you can use. You can change the order and move them by clicking and dragging.\n                        To see what an icon means, hover over it with your cursor. Icons in the gray area will be hidden under the \"More options\" menu.\n                        You can also change their colour and icon later on in RedWarn preferences.<\/p><ul id=\"rwRollbackIconsSort\" style=\"text-align:center;width:100%;min-height:35px;\">${(()=>{ \/\/ (tags for IDE formatting only) <script>\/\/ Now we generate for each icon (config should've loaded and put these in order by now)\n                            let returnStr = \"\";\n                            rw.rollback.icons.forEach((icon,i)=>{\n                                let elID = \"rollbackIcon-\"+ (icon.originalIndex == null ? i : icon.originalIndex); \/\/ get index from original if already set, else use i (basically only use i on a fresh config)\n                                \/\/ Top row, so only add currently enabled icons\n                                if (icon.enabled) returnStr += `\n                                <li id=\"${elID}\" class=\"icon material-icons\"><span style=\"cursor:pointer;font-size:28px;padding-right:5px;color:${icon.color};\">${icon.icon}<\/span><\/li><div class=\"mdl-tooltip mdl-tooltip--large\" for=\"${elID}\">${icon.name}<\/div> `;\n                            });\n                            \n                            return returnStr; \/\/<\/script> (tags for IDE formatting only)\n                        })()}<\/ul><ul id=\"rwRollbackIconsSortDisabled\" style=\"text-align:center;width:100%;min-height:35px;background:#e8e4e4;\">${(()=>{ \/\/ (tags for IDE formatting only) <script>\/\/ Now we generate for each icon (config should've loaded and put these in order by now)\n                            let returnStr = \"\";\n                            rw.rollback.icons.forEach((icon,i)=>{\n                                let elID = \"rollbackIcon-\"+ (icon.originalIndex == null ? i : icon.originalIndex); \/\/ get index from original if already set, else use i\n                                \/\/ bottom row, so only add disabled icons\n                                if (!icon.enabled) returnStr += `\n                                <li id=\"${elID}\" class=\"icon material-icons\"><span style=\"cursor:pointer;font-size:28px;padding-right:5px;color:${icon.color};\">${icon.icon}<\/span><\/li><div class=\"mdl-tooltip mdl-tooltip--large\" for=\"${elID}\">${icon.name}<\/div> `;\n                            });\n                            \n                            return returnStr; \/\/<\/script> (tags for IDE formatting only)\n                        })()}<\/ul><h5>Enable rollback reverting<\/h5><p>If you have rollback permissions, RedWarn can use MediaWiki's rollback feature instead for faster reversions, alike to Huggle and other tools.\n                        Enabling this will only make a speed difference, otherwise there will be no change.\n                        This preference will only be honored if you have the \"rollback\" user right.<\/p><label class=\"mdl-radio mdl-js-radio mdl-js-ripple-effect\" for=\"rwRBOpt-rollbackLike\"><input type=\"radio\" id=\"rwRBOpt-rollbackLike\" class=\"mdl-radio__button\" name=\"rollbackMethod\" value=\"rollbackLike\" checked><span class=\"mdl-radio__label\">Don't use rollback<\/span><\/label> &nbsp;&nbsp; <label class=\"mdl-radio mdl-js-radio mdl-js-ripple-effect\" for=\"rwRBOpt-rollback\"><input type=\"radio\" id=\"rwRBOpt-rollback\" class=\"mdl-radio__button\" name=\"rollbackMethod\" value=\"rollback\"><span class=\"mdl-radio__label\">Use rollback (recommended for eligible editors)<\/span><\/label><br\/><\/form><hr\/><h5>Thank you for trying RedWarn!<\/h5><p>If you have any issues, feature suggestions, or just need help in future, please let us know on RedWarn's talk page\n                    or our Discord server (the invite for which is in RedWarn preferences).<\/p><\/div><div class=\"mdl-card__actions mdl-card--border\"><a class=\"mdl-button mdl-js-button mdl-js-ripple-effect\" onclick=\"startVideo();\">Apply settings and continue<\/a><\/div><\/div><div class=\"mdl-card mdl-shadow--2dp\" style=\"width:100%;display:none;text-align:center;\" id=\"video\"><video controls style=\"height:25%;width:50%;margin:0 auto;\"><source src=\"https:\/\/redwarn.toolforge.org\/cdn\/video\/devDemoVideo.mp4\" type=\"video\/mp4\"\/><\/video><br\/><div class=\"mdl-card__actions mdl-card--border\"><a class=\"mdl-button mdl-js-button mdl-js-ripple-effect\" onclick=\"window.parent.postMessage('reload');\">GET STARTED AND RETURN TO WIKIPEDIA<\/a><\/div><\/div><br\/><br\/><\/main><\/div><script>\/\/ Sortable for rollback icons\n    $('#rwRollbackIconsSort').sortable({\n        group: 'shared', \/\/ set both lists to same group\n        animation: 150\n    });\n    $('#rwRollbackIconsSortDisabled').sortable({\n        group: 'shared', \/\/ set both lists to same group\n        animation: 150\n    });\n\n    function startVideo() {\n        \/\/ save preferences here. NOTE! If this is ran after prefs set elsewhere THEY WILL BE RESET!\n        var data = $('form').serializeArray().reduce((obj, item) => {\n                obj[item.name] = item.value;\n                return obj;\n                }, {}); \/\/ form data\n        \/\/ Now we process the icons\n        let iconModifyArray = []; \/\/ array for our changes\n\n        \/\/ For each enabled icon\n        $(\"#rwRollbackIconsSort > li\").each((i, el)=>{ \n            let iconIndex = parseInt($(el).attr(\"id\").split(\"-\")[1]);\n            iconModifyArray.push({\n                \"index\" : iconIndex, \/\/ original icon index \n                \"shift\" : i, \/\/ where to move to\n                \"modify\" : { \/\/ obj of params to change\n                    \"enabled\": true, \/\/ set as enabled\n                    \"color\" : $(el).find(\"span\").css(\"color\"), \/\/ get color\n                    \"icon\" : $(el).find(\"span\").text().trim() \/\/ get icon from inner span text\n                }\n            });\n        });\n\n        \/\/ For each disabled icon\n        $(\"#rwRollbackIconsSortDisabled > li\").each((i, el)=>{ \n            let iconIndex = parseInt($(el).attr(\"id\").split(\"-\")[1]);\n            iconModifyArray.push({\n                \"index\" : iconIndex, \/\/ original icon index \n                \"shift\" : $(\"#rwRollbackIconsSort > li\").length + i, \/\/ where to move to (for disbaled + the number of total enabled)\n                \"modify\" : { \/\/ obj of params to change\n                    \"enabled\": false, \/\/ set as disabled\n                    \"color\" : $(el).find(\"span\").css(\"color\"), \/\/ get color\n                    \"icon\" : $(el).find(\"span\").text().trim() \/\/ get icon from inner span text\n                }\n            });\n        });\n\n        \/\/ Now add to config\n        data.rwRollbackIcons = iconModifyArray;\n        console.log(data);\n\n        \/\/ Mark that this process is complete\n        data.firstTimeSetupComplete = \"yes\";\n\n        \/\/ Done! Submit\n        window.parent.postMessage(\"config\\\\\\`\"+ btoa(JSON.stringify(data))); \/\/ send to the big boss\n         \n        \/\/ Now, play video (rw17)\n        \/\/$(\"#prefCard\").fadeOut(1000, ()=>{\n        \/\/    $(\"#video\").fadeIn(1000, ()=>$(\"#video\").find(\"video\")[0].play());\n        \/\/});\n    }<\/script>`"};
// ========================= END DEPENDENCIES =========================
// ========================== BEGIN REDWARN ===========================
// rw-source: styles.js
// Handles RedWarns styles
$(".menu").css("z-index", 110); // stop ours from overlaying

var rwDialogAnimations = { // Custom CSS for each animation style
    // DEFAULT
    "default" : rw_includes["dialogAnimations.default.css"],

    // NONE (marked as "instant")
    "none" : rw_includes["dialogAnimations.none.css"],

    // Spinny
    "spinny" : rw_includes["dialogAnimations.spinny.css"],

    // Mega
    "mega" : rw_includes["dialogAnimations.mega.css"]
};


// MAIN CSS - THE MAIN PAGE DOES NOT INCLUDE MATERIAL DESIGN LITE CSS. Include all the things here if needed.
/**
 * material-design-lite - Material Design Components in CSS, JS and HTML
 * version v1.3.0
 * license Apache-2.0
 * copyright 2015 Google, Inc.
 * link https://github.com/google/material-design-lite
 */
var rwStyle = rw_includes["style.css"];
// rw-source: init.js
// (c) Ed.E and contributors 2020

if (rw != null) {
    // Double init, rm the old version and hope for the best
    rw = {};
    mw.notify("Warning! You have two versions of RedWarn installed at once! Please edit your common.js or skin js files to ensure that you only use one instance to prevent issues.");
}

/**
* rw is the main class for RedWarn and holds the vast majority of its core code, properties and functions. See other classes for further documentation.
*
* @class rw
*/
var rw = {
    // UPDATE THIS DATA FOR EVERY VERSION!

    /**
     * Defines the version of this build of RedWarn. This is shown in, and is also checked to see if an update has occured.
     * For devlopment versions, you MUST append "dev" to this value to distingish that it is a devlopment build.
     *
     * @property version
     * @type {string}
     * @extends rw
     */
    "version" : "16", // don't forget to change each version!

    /**
     * Defines a brief summary of this version of RedWarn. This is shown in both update notices, and a card in preferences.
     * To prevent UI issues, it must be kept brief.
     *
     * @property versionSummary
     * @type {string}
     * @extends rw
     */
    "versionSummary": `
<!-- RedWarn 16 -->
RedWarn 16 is finally here, bringing UX improvements, emergency and oversight reports, more customisation, bug fixes, and more!
    `,

    /**
     * This varible is defined by the magic word "Build Time: 09/11/2020 14:00:29UTC
Excecuted script: /home/jemma/Projects/redwarn-web/build.php
User: jemma@sweetlittlecinnamon on Linux", which the build script will replace with information
     * regarding the time, file location and computer info such as username, computer name and OS of this build.
     * Shown in preferences only.
     * @property buildInfo
     * @type {string}
     * @extends rw
     */
    // ADDED BY BUILD SCRIPT
    "buildInfo" : `Build Time: 09/11/2020 14:00:29UTC
Excecuted script: /home/jemma/Projects/redwarn-web/build.php
User: jemma@sweetlittlecinnamon on Linux`,

    // DEBUG MODE - enabled by default on debug server
    "debugMode" : ``,

    // Now edited by us again
    /**
     * Defines the logo used in parts of RedWarn's UI. Please note that removing or changing this without adding attribution elsewhere may be a violation of RedWarn's license.
     * @property logoHTML
     * @type {string}
     * @extends rw
     * @default '<span style="font-family:Roboto;font-weight: 300;text-shadow:2px 2px 4px #0600009e;"><span style="color:red">Red</span>Warn</span>'
     */
    "logoHTML" : `<span style="font-family:Roboto;font-weight: 300;text-shadow:2px 2px 4px #0600009e;"><span style="color:red">Red</span>Warn</span>`, // HTML of the logo

    /**
     * Defines a short version of the logo used in parts of RedWarn's UI. Please note that removing or changing this without adding attribution elsewhere may be a violation of RedWarn's license.
     * @property logoShortHTML
     * @type {string}
     * @extends rw
     * @default '<span style="font-family:Roboto;font-weight: 300;text-shadow:2px 2px 4px #0600009e;"><span style="color:red">R</span>W</span>'
     */
    "logoShortHTML" : `<span style="font-family:Roboto;font-weight: 300;text-shadow:2px 2px 4px #0600009e;"><span style="color:red">R</span>W</span>`, // Short HTML of the logo


    /**
     * Returns a MediaWiki signiature
     * @method sign
     * @returns {string} MediaWiki sign (~~~~)
     * @extends rw
     */

    "sign": ()=>{return atob("fn5+fg==")}, // we have to do this because mediawiki will swap this out with devs sig.

    // Not really used, but keep for now just in case
    "welcome": ()=> {return atob("e3tzdWJzdDpXZWxjb21lfX0=");}, // welcome template
    "welcomeIP": ()=> {return atob("e3tzdWJzdDp3ZWxjb21lLWFub259fQ==");}, // welcome IP template

    /**
     * Returns a shared IP advice template - please note that is is likely to be depreciated in the near future
     * @returns {string} shared IP advice template
     * @method sharedIPadvice
     * @extends rw
     */
    "sharedIPadvice" : ()=> {return atob("XG46e3tzdWJzdDpTaGFyZWQgSVAgYWR2aWNlfX0=");}, // if this is a shared...

    // Wiki automated config

    /**
     * The base URL of the MediaWiki instance (wgServer), e.g. //en.wikipedia.org
     * @property wikiBase
     * @type {string}
     * @extends rw
     */
    "wikiBase" : mw.config.get("wgServer"), // mediawiki base URL (i.e. //en.wikipedia.org)

    /**
     * The URL of the index.php script of this MediaWiki instance (e.g. //en.wikipedia.org/w/index.php)
     * @property wikiIndex
     * @type {string}
     * @extends rw
     */
    "wikiIndex" : mw.config.get("wgServer") + mw.config.get("wgScript"), // mediawiki index.php (i.e. //en.wikipedia.org/w/index.php)

    /**
     * The URL of the api.php script of this MediaWiki instance (e.g. //en.wikipedia.org/w/api.php)
     * @property wikiAPI
     * @type {string}
     * @extends rw
     */
    "wikiAPI" : mw.config.get("wgServer") + mw.config.get("wgScriptPath") + "/api.php", // mediawiki API path  (i.e. //en.wikipedia.org/w/api.php)

    /**
     * The ID of this MediaWiki instance (e.g. enwiki) - this may not always be defined!
     * @property wikiAPI
     * @type {string}
     * @extends rw
     */
    "wikiID": mw.config.get("wgWikiID"),


    /**
     * Generates a random alphanumerical string of the specified length
     *
     * @param {number} length
     * @returns {string}
     * @method makeID
     * @extends rw
     */
    "makeID" : length=> {
        // Generates a random string
        var result           = '';
        var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var charactersLength = characters.length;
        for ( var i = 0; i < length; i++ ) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    },

    /**
     * rw.visuals contains shortcuts to initalising and controlling visual elements, including adding libaries
     * @class rw.visuals
     */
    "visuals" : {
        /**
         * Adds RedWarn's styles, libaries and other elements to the current page and waits for them to load, then excecutes the callback function
         *
         * @param {function} callback 
         * @method init
         * @extends rw.visuals
         */
        "init" : callback=> {
            // Welcome message
            console.log("RedWarn "+ rw.version + " - (c) 2020 RedWarn Contributors");
            // Load MDL and everything needed, then callback when all loaded
            $('head').append(`
                <link rel="stylesheet" href="https://redwarn.toolforge.org/cdn/css/jqueryContextMenu.css">
                <script src="https://redwarn.toolforge.org/cdn/js/jquery-contextmenu.js"></script>
                <script src="https://redwarn.toolforge.org/cdn/js/jquery-ui-position.js"></script>
                <link rel="stylesheet" href="https://redwarn.toolforge.org/cdn/css/materialicons.css">
                <script src="https://redwarn.toolforge.org/cdn/js/dialogPolyfill.js"></script> <!-- firefox being dumb -->
                <script src="https://redwarn.toolforge.org/cdn/js/mdl.js" id="MDLSCRIPT"></script>
                <script src="https://redwarn.toolforge.org/cdn/js/mdlLogic.js"></script> <!-- rw specific MDL logic fixes -->
                <!-- Roboto Font -->
                <link href="https://tools-static.wmflabs.org/fontcdn/css?family=Roboto:100,100italic,300,300italic,400,400italic,500,500italic,700,700italic,900,900italic&subset=cyrillic,cyrillic-ext,greek,greek-ext,latin,latin-ext,vietnamese" rel="stylesheet">

                <!-- MDL AND CONTEXT MENU STYLES -->
                <style>
                /* Context menus */
                .context-menu-list {
                    list-style-type: none;
                    list-style-image: none;
                }

                /* MDL */
                ${rwStyle}
                </style>
            `); // Append required libaries to page

            // OOui
            mw.loader.load( 'oojs-ui-windows' );

            // Show redwarn only spans
            $(".RedWarnOnlyVisuals").show();
            
            // wait for load
            waitForMDLLoad(callback);
        },

        /**
         * Registers a DOM element with Material Design Lite. Equivalent to componentHandler.upgradeElement(c)
         *
         * @param {object} c MDL DOM element to register
         * @method register
         * @extends rw.visuals
         */
        "register" : c=> {
            // Register a componant with MDL
            componentHandler.upgradeElement(c);
        },

        /**
         * Adds RedWarns control icons to the top icon or sidebar space depending on skin and preferences. 
         *
         * @method pageIcons
         * @extends rw.visuals
         */
        "pageIcons" : ()=> {
            // If debug mode, enable debug menu
            if (rw.debugMenu != null) rw.debugMenu.init(); // will be undefined if not

            // Thanks to User:Awesome Aasim for the suggestion and some sample code.
            try {
                let pageIconHTML = "<div id='rwPGIconContainer' style='display:none;display: inline-block;'>"; // obj it is appended to
                // Possible icons locations: default (page icons area) or sidebar
                let iconsLocation = rw.config.pgIconsLocation ? rw.config.pgIconsLocation : "default"; // If set in config, use config

                // Add to pageIconHTML from topIcons config
                pageIconHTML += rw.topIcons.generateHTML();

                pageIconHTML += "</div>"; // close contianer
                if (iconsLocation == "default") {
                    try {
                        $(".mw-indicators").append("&nbsp;&nbsp;&nbsp;" + pageIconHTML); // Append our icons to the page icons with spacing
                    } catch (error) {
                        // Incompatible theme, use sidebar instead
                        iconsLocation = "sidebar";
                    }
                }
                // delib. not else if
                if (iconsLocation == "sidebar") {
                    // Add our icons to the sidebar (w/ all theme compatibility)
                    (_t=>{
                        $('<div class="sidebar-chunk" id="redwarn"><h2><span>RedWarn</span></h2><div class="sidebar-inner">' + _t + '</div></div>').prependTo("#mw-site-navigation");
                        $('<div class="portal" role="navigation" id="redwarn" aria-labelledby="p-redwarn-label">' + _t + '</div>').prependTo("#mw-panel");
                        $('<div role="navigation" class="portlet generated-sidebar" id="redwarn" aria-labelledby="p-redwarn-label">' + _t + '</div>').prependTo("#sidebar");
                        $('<div class="portlet" id="redwarn">' + _t + '</div>').prependTo("#mw_portlets");
                        $('<ul id="redwarn">' + _t + '</ul>').appendTo("#mw-mf-page-left"); //minerva
                        $("#p-navigation").prependTo("#mw-panel");
                        $("#p-search").prependTo("#quickbar");
                        $('#p-logo').prependTo("#mw-site-navigation");
                        $('#p-logo').prependTo("#mw-panel");
                        $('#p-logo').prependTo("#sidebar");
                        $('#p-logo').prependTo("#mw_portlets");
                        $('ul.hlist:first').appendTo('#mw-mf-page-left');

                        // Add click event handlers
                        $(document).click(e=> {
                            if ($(e.target).closest("#redwarn").length == 0) {
                                $("#redwarn").removeClass("dropdown-active");
                            }
                        });
                        (h=>{
                            $($('.sidebar-chunk > h2:contains("RedWarn")')[0]).click(e=>h(e)); // collapsed
                            $($('.sidebar-inner > #redwarn-label')[0]).click(e=>h(e)); // visible
                        })(e=>{ // Handler
                            e.preventDefault();
                            if ($("#redwarn").hasClass("dropdown-active")) {
                                $("#redwarn").removeClass("dropdown-active");
                            } else {
                                $("#redwarn").toggleClass("dropdown-active");
                            }
                        });
                        // We done
                    })(` <!-- hand in pageIconHTML and some extra gubbins to become _t -->
                        <h3 id="redwarn-label" lang="en" dir="ltr">RedWarn tools</h3><div class="mw-portlet-body body pBody" id="redwarn-tools">
                        ` + pageIconHTML + `
                        </div>
                    `);
                }
            } catch (error) {
                // Likely invalid theme, not all themes can use default
                mw.notify("RedWarn isn't compatible with this theme.");
                return; // Exit
            }
            

            // Now register all tooltips
            for (let item of document.getElementsByClassName("mdl-tooltip")) rw.visuals.register(item); 

            // Now Register menu mdl-menu
            for (let item of document.getElementsByClassName("mdl-menu")) rw.visuals.register(item); 

            // Now register handlers
            rw.topIcons.addHandlers();

            // Now fade in container
            $("#rwPGIconContainer").fadeIn();
            
            // That's done :)
        }
    },

    /**
     * RedWarn's recent changes interface
     * @class rw.recentChanges
     */
    "recentChanges" : {
        /**
         * Opens RedWarn's patrol interface
         *
         * @param {string} filters MediaWiki API filters, i.e. userExpLevel=unregistered%3Bnewcomer&hidebots=1&hidecategorization=1
         * @method openPage
         * @extends rw.recentChanges
         */
        "openPage" : (filters)=> {
            // Open recent changes url
            let sidebarSize = 500;
            let addCol = "0,255,0"; // rgb
            let rmCol = "255,0,0"; // rgb
            let mwBody = document.getElementsByTagName("BODY")[0];
            /*if (rw.config.ptrSidebar) sidebarSize = rw.config.ptrSidebar; DEP. REV12*/
             // If preferences set, apply them
            if (rw.config.ptrAddCol) addCol = rw.config.ptrAddCol;
            if (rw.config.ptrRmCol) rmCol = rw.config.ptrRmCol;
            // basically multiact js but with stuff replaced
            mwBody.style.overflowY = "hidden";
            let content = mdlContainers.generateContainer(eval(rw_includes["recentChanges.html"]), window.innerWidth, window.innerHeight); // Generate container using mdlContainer.generatecontainer aka blob in iframe

            // Init if needed
            if ($("#PTdialogContainer").length < 1) {
                // Need to init
                $("body").prepend(`
                    <div id="PTdialogContainer">
                    </div>
                `);
                // Add close event
                addMessageHandler("closeDialogPT", ()=>{
                    rw.recentChanges.dialog.close();
                    mwBody.style.overflowY = "auto";
                }); // closing
            }
            
            $("#PTdialogContainer").html(`
            <dialog class="mdl-dialog" id="rwPATROLdialog">
                ${content}
            </dialog>
            `);
            rw.recentChanges.dialog = document.querySelector('#rwPATROLdialog'); // set dialog

            $("#rwPATROLdialog").attr("style", "padding:inherit;"); // set no padding
            // Firefox issue fix
            if (! rw.recentChanges.dialog.showModal) {
                dialogPolyfill.registerDialog(rw.recentChanges.dialog);
            }

            // Resize on window change
            $(window).resize(()=>{
                $(rw.recentChanges.dialog.getElementsByTagName("iframe")[0]).attr("height",  window.innerHeight);
                $(rw.recentChanges.dialog.getElementsByTagName("iframe")[0]).attr("width",  window.innerWidth);
            });

            // Add message handler for dialog close
            addMessageHandler("rwRCPcloseDialog", ()=>{rw.recentChanges.dialog.close(); dialogEngine.enableScrolling();});

            rw.recentChanges.dialog.showModal(); // Show dialog
        }
    }
};


/**
 * RedWarn extensions in the global window space
 * @class window
 */
/**
 * Is set depending on whether or not this window/tab is in focus.
 *
 * @property windowFocused
 * @type {boolean}
 * @default true
 * @extends window
 */
// Window focus checking n things
var windowFocused = true;

window.onblur = function(){  
    windowFocused = false;  
}  
window.onfocus = function(){  
    windowFocused = true;  
}

// Array extention
/**
 * Moves element at index old_index to new_index
 * @method arrayMove
 * @param {array} arr
 * @param {number} old_index
 * @param {number} new_index
 * @returns {array}
 * @extends window
 */
var arrayMove = (arr, old_index, new_index) => {
    if (new_index >= arr.length) {
        var k = new_index - arr.length + 1;
        while (k--) {
            arr.push(undefined);
        }
    }
    arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
    return arr;
}

/**
 * Waits for Material Design Lite to load, then excecutes callback.
 *
 * @method waitForMDLLoad
 * @param {function} cb Callback function
 * @extends window
 */
function waitForMDLLoad(cb) { // Used to wait for MDL load
    if(typeof componentHandler !== "undefined"){
        cb(); // callback
    } else {
        setTimeout(()=>waitForMDLLoad(cb), 250);
    }
}

/**
 * Redirect the user to the specified URL
 *
 * @method redirect
 * @param {string} url URL to redirect to
 * @param {boolean} inNewTab if set to true, will open the URL in a new tab
 * @extends window
 */
function redirect(url, inNewTab) {
    if (inNewTab) {
        Object.assign(document.createElement('a'), { target: '_blank', href: url}).click(); // Open in new tab
    } else {
        window.location.href = url; // open here
    }
}

/**
 * Object containing messageHandlers and their callbacks. See also addMessageHandler()
 *
 * @property messageHandlers
 * @type {object}
 * @default '{"testHandler": () => {alert("Working!");}};'
 * @extends window
 */
var messageHandlers = {"testHandler": () => {alert("Working!");}};

/**
 * Adds a message handler - used between iFrames and the main window.
 *
 * @param {string} msg The message that will trigger the callback. If ending with *, this will check if the message contains the prefixed value instead of a direct match.
 * @param {function} callback Callback for when this message is recieved
 * @method addMessageHandler
 * @extends window
 */
function addMessageHandler(msg, callback) { // calling more than once will just overwrite
    Object.assign(messageHandlers, ((a,b)=>{let _ = {}; _[a]=b; return _;})(msg, callback)); // function ab returns a good formatted obj
}

window.onmessage = e=>{
    if (messageHandlers[e.data]){messageHandlers[e.data]();} // Excecute handler if exact
    else { // We find ones that contain
        for (const evnt in messageHandlers) {
            if ((evnt.substr(evnt.length - 1) == "*") && e.data.includes(evnt.substr(0, evnt.length - 2))) { // and includes w * chopped off
                messageHandlers[evnt](e.data);
                return;
            } // if contains and ends with wildcard then we do it
        }
    }
};

// init everthing
/**
 * Initalises and loads everything in RedWarn, including main feature level restrictions, visual initalisation and window.location.hash handling.
 *
 * @method initRW
 * @extends window
 */
function initRW() {
    rw.visuals.init(()=>{
        rw.visuals.toast.init();
        dialogEngine.init();

        // Quick check we have perms to use (in confirmed/autoconfirmed group)
        rw.info.featureRestrictPermissionLevel("confirmed", false, ()=>{
            // We don't have permission
            // Add red lock to the top right to show that RedWarn cannot be used
            document.getElementsByClassName("mw-indicators mw-body-content")[0].innerHTML = `
            <div id="Lock" class="icon material-icons"><span style="cursor: help; color:red;" onclick="">lock</span></div>
            <div class="mdl-tooltip" for="Lock">
                You must be Autoconfirmed or Confirmed to use RedWarn.  Please refer the user guide for more information.
            </div>
            `;
            // Now register that
            for (let item of document.getElementsByClassName("mdl-tooltip")) {
                rw.visuals.register(item); 
            }
            // A bit more of a clear error for someone who may not be paying immediate attention. Maybe we can use wikitext to send new user guide?
            mw.notify("You do not have permission to use Redwarn yet. Please refer to the user guide for more information (Error: User is NOT confirmed/autoconfirmed)", {title: "Error loading Redwarn", autoHide: "false", tag: "redwarn"});
            rw = {}; // WIPE OUT ENTIRE CLASS. We're not doing anything here.
            // That's it
        });

        // We have perms, let's continue.

        // Load config and check if updated
        rw.info.getConfig(()=> {
            rw.info.getRollbackToken(); // get rollback token
            rw.visuals.pageIcons(); // page icons once config loaded
            rw.ui.registerContextMenu(); // register context menus once config loaded

            // If not autoconfirmed, add a flag
            rw.info.featureRestrictPermissionLevel("extendedconfirmed", ()=>{}, ()=>{rw.userIsNotEC = true;});

            // Add dialog animations from config
            $('head').append(`<style>${rwDialogAnimations[(rw.config.dialogAnimation == null ? "default" : rw.config.dialogAnimation)]}</style>`);

            // Check if updated
            if (rw.config.lastVersion != rw.version) {
                // We've had an update
                rw.config.lastVersion = rw.version; // update entry 
                // RW 16 only - rm first setup
                rw.config.firstTimeSetupComplete = "notNeeded";
                rw.info.writeConfig(true, ()=> { // update the config file
                    // Show an update dialog
                    rw.ui.confirmDialog(`
                    <h2 style="font-weight: 200;font-size:45px;line-height: 48px;">Welcome to ${rw.logoHTML} ${rw.version}!</h2>
                    ${rw.versionSummary}
                    `,
                    "READ MORE", ()=>{
                        dialogEngine.closeDialog();
                        redirect("https://en.wikipedia.org/wiki/Wikipedia:RedWarn/bugsquasher#RedWarn_"+ rw.version + "_summary", true);
                    },
                    "LATER", ()=>{
                        dialogEngine.closeDialog();//this thing turns it off
                        rw.visuals.toast.show("You can read more later at RedWarn's page (WP:REDWARN)");//display a toast
                        
                    },120);
                });
            } else if (rw.config.firstTimeSetupComplete == null) { // Check if first time setup has been completed
                rw.firstTimeSetup.launch();
            }

            // TODO: probably fix this mess into a URL
            // HERE REALLY REALLY NEEDS CLEANUP
                // Check if a message is in URL (i.e edit complete ext)
            if(window.location.hash.includes("#noticeApplied-")) {
                // Show toast w undo edit capabilities
                // #noticeApplied-currentEdit-pastEdit
                rw.visuals.toast.show("Message saved", "UNDO", ()=>{
                    // Just restore the version via rollback restore (this does a normal undo request)
                    rw.rollback.restore(window.location.hash.split("-")[2], "Undo message addition (via toast)");
                }, 7500);
            } else if (window.location.hash.includes("#redirectLatestRevision")) { // When latest revision loaded
                rw.visuals.toast.show("Redirected to the latest revision.", "BACK", ()=>window.history.back(), 4000); // When back clciked go back
            } else if (window.location.hash.includes("#watchLatestRedirect")) {
                // Redirected to latest by redirector, play sound
                let src = 'https://redwarn.toolforge.org/cdn/audio/newEdit.mp3';
                let audio = new Audio(src);
                audio.play();
                // enable watcher
                rw.info.changeWatch.toggle();
            } else if (window.location.hash.includes("#investigateFail")) {
                rw.visuals.toast.show("Investigation Failed. This text has not been modified in the past 500 revisions or originated when the page was created.", false, false, 10000);
            } else if (window.location.hash.includes("#investigateIncomp")) {
                rw.visuals.toast.show("The selection could not be investigated.", false, false, 10000);
            } else if (window.location.hash.includes("#configChange")) {
                rw.visuals.toast.show("Preferences saved.");
            } else if (window.location.hash.includes("#rwPendingAccept")) {
                rw.visuals.toast.show("Changes accepted.");
            } else if (window.location.hash.includes("#rwReviewUnaccept")) {
                rw.visuals.toast.show("Changes unaccepted.");
            } else if (window.location.hash.includes("#compLatest")) {
                // Go to the latest revison
                rw.info.isLatestRevision(mw.config.get("wgRelevantPageName"), 0, ()=>{}); // auto filters and redirects for us - 0 is an ID that will never be
            } else if (window.location.hash.includes("#rollbackPreview")) {
                // Rollback preview page
                $('.mw-revslider-container').html(`
                <div style="padding-left:10px;">
                    <h2>This is a rollback preview</h2>
                    To rollback, use the buttons on the left side below. Using the restore revision button <b>will not</b> warn the user and won't redirect you to the latest revision.
                </div>
                <br>
                `);

                $('.mw-revslider-container').attr("style", "border: 3px solid red;");

            } else if (window.location.hash.includes("#rollbackFailNoRev")) {
                rw.visuals.toast.show("Could not rollback as there were no recent revisions by other users. Use the history page to try and manually revert.", false, false, 15000);
            }
            
            if ($("table.diff").length > 0) { // DETECT DIFF HERE - if diff table is present
                // Diff page
                rw.rollback.loadIcons(); // load rollback icons
            } else if (mw.config.get("wgRelevantPageName").includes("Special:RecentChanges")) {
                // Recent changes page
                // Add redwarn open btn
                $(".mw-specialpage-summary").prepend(`
                <div id="openRWP" style="
                    font-size: 32px;
                    float: right;
                    background: white;
                ">
                    <span style="cursor: pointer;" onclick="rw.recentChanges.openPage(window.location.search.substr(1));">
                        ${rw.logoHTML} patrol
                    </span>
                </div>

                <div class="mdl-tooltip mdl-tooltip--large" for="openRWP">
                    Click to launch RedWarn Patrol
                </div>
                `); // Register tooltip
                for (let item of document.getElementsByClassName("mdl-tooltip")) {
                    rw.visuals.register(item); 
                }
            
            } else if (mw.config.get("wgRelevantPageName").includes("Special:Contributions")) { // Special contribs page
                rw.rollback.contribsPageIcons(); // rollback icons on current
            } else if (window.location.hash.includes("#rwPatrolAttach-RWBC_")) { // Connect to recent changes window
                let bcID = window.location.hash.split("-")[1]; // get bc id from hash
                const bc = new BroadcastChannel(bcID); // open channel
                bc.onmessage = msg=>{// On message open here
                    rw.ui.loadDialog.show("Loading...");
                    redirect(msg.data);
                } 
                // Set session storage (see below) Hopefully will only effect this window
                sessionStorage.rwBCID = bcID;
            }
            if (sessionStorage.rwBCID != null){
                //  Session storage set! Connect to bcID
                const bc = new BroadcastChannel(sessionStorage.rwBCID); // open channel
                bc.onmessage = msg=>{// On message open here
                    rw.ui.loadDialog.show("Loading...");
                    redirect(msg.data);
                } 
            }

            // Log page in recently visited (rev13)
            if (!mw.config.get("wgRelevantPageName").includes("Special:")) { // if not special page
                try {
                    if (window.localStorage.rwRecentlyVisited == null) window.localStorage.rwRecentlyVisited = "[]"; // if not set, reset to empty array
                    // Load data
                    let recentlyVisted = JSON.parse(window.localStorage.rwRecentlyVisited);
                    let rVi = recentlyVisted.indexOf(mw.config.get("wgRelevantPageName")); // get index of, if not here -1
                    if (rVi != -1) {
                        // Page is already on the list, push to top
                        recentlyVisted = arrayMove(recentlyVisted, rVi, 0); // move (from, to)
                    } else {
                        // Page isn't on list, let's add
                        recentlyVisted.unshift(mw.config.get("wgRelevantPageName")); // adds at start of array
                    }

                    // Finally
                    if (recentlyVisted.length > 20) {
                        recentlyVisted.pop(); // remove last item to ensure list stays under 20 items
                    }

                    // Now save
                    window.localStorage.rwRecentlyVisited = JSON.stringify(recentlyVisted);// Done!
                } catch (error) { // on error (maybe corrupt value)
                    console.error(error);
                    window.localStorage.rwRecentlyVisited = "[]"; // try reset to empty array and hope for the best
                }
            }


            // Pending changes
            rw.PendingChangesReview.reviewPage(); // will auto check if possible ext and add icons

            // MultiAct history
            rw.multiAct.initHistoryPage();
        }); 
    });
}

// rw-source: topIcons.js
/**
 * Handles rendering top icons/menu
 * @class rw.topIcons
 */
rw.topIcons = {
  "icons" : [ // array of availible icons - CHANGING ORDER WILL MESS UP CONFIGS

    // Userpage only icons
    {
        "title": "New Message",
        "shortTitle": "Message",
        "icon": "send", // material icon
        "callback": ()=>rw.ui.newMsg(), // when clicked
        "showsOnlyOnUserPages": true,
        "showsOnUneditablePages": false,
        "colorModifier": null, // if not empty will be used for things like turning notif bell green, for this would have to call a redraw func unless we add a defined class for each
        "enabled": true // to show in main screen or more options screen
    }, 
    {
        "title": "Quick Template",
        "shortTitle": "Template",
        "icon": "library_add", // material icon
        "callback": ()=>rw.quickTemplate.openSelectPack(), // when clicked
        "showsOnlyOnUserPages": true,
        "showsOnUneditablePages": false,
        "colorModifier": null, // if not empty will be used for things like turning notif bell green, for this would have to call a redraw func unless we add a defined class for each
        "enabled": true // to show in main screen or more options screen
    }, 
    {
        "title": "Warn User",
        "shortTitle": "Warn",
        "icon": "report", // material icon
        "callback": ()=>rw.ui.beginWarn(), // when clicked
        "showsOnlyOnUserPages": true,
        "showsOnUneditablePages": false,
        "colorModifier": null, // if not empty will be used for things like turning notif bell green, for this would have to call a redraw func unless we add a defined class for each
        "enabled": true // to show in main screen or more options screen
    },
    // Report user has moved elsewhere, original form still exists but is now under more options

    // On any page
    {
        "title": "Manage Page Protection",
        "shortTitle": "Protect",
        "icon": "lock", // material icon
        "callback": ()=>rw.pageProtect.open(), // when clicked
        "showsOnlyOnUserPages": false,
        "showsOnUneditablePages": true,
        "colorModifier": null, // if not empty will be used for things like turning notif bell green, for this would have to call a redraw func unless we add a defined class for each
        "enabled": true // to show in main screen or more options screen
    },

    {
        "title": "Alert on Change",
        "shortTitle": "Alert",
        "icon": "notification_important", // material icon
        "callback": ()=>rw.info.changeWatch.toggle(), // when clicked
        "showsOnlyOnUserPages": false,
        "showsOnUneditablePages": true,
        "colorModifier": null, // if not empty will be used for things like turning notif bell green, for this would have to call a redraw func unless we add a defined class for each
        "enabled": true, // to show in main screen or more options screen
        "className": "rwSpyIcon" // for adding custom classes, to modify change this and the colour modifier
    },

    {
        "title": "Latest Revision",
        "shortTitle": "Latest",
        "icon": "watch_later", // material icon
        "callback": ()=>rw.info.isLatestRevision(mw.config.get('wgRelevantPageName'), 0, ()=>{}), // when clicked
        "showsOnlyOnUserPages": false,
        "showsOnUneditablePages": true,
        "colorModifier": null, // if not empty will be used for things like turning notif bell green, for this would have to call a redraw func unless we add a defined class for each
        "enabled": true // to show in main screen or more options screen
    },
    
    {
        "title": "More Options",
        "shortTitle": "More",
        "icon": "more_vert", // material icon
        "callback": ()=>rw.ui.openExtendedOptionsDialog(), // when clicked
        "showsOnlyOnUserPages": false,
        "showsOnUneditablePages": true,
        "colorModifier": null, // if not empty will be used for things like turning notif bell green, for this would have to call a redraw func unless we add a defined class for each
        "enabled": true // to show in main screen or more options screen
    }


    // MORE OPTIONS DEFAULTS STAY IN MORE OPTIONS - NO WAY TO MOVE THEM OUT OR CHANGE ORDER

  ],

  "generateHTML" : ()=>{
    if (mw.config.get("wgNamespaceNumber") < 0) return ``; // if on special page, skip

    // Check if more options is disabled, if so, open a dialog to prompt if user wishes to keep this option
    if ((rw.topIcons.icons.find(o => o.title === 'More Options').enabled == false) && rw.config.rwMORemovedWarning == null) {
        rw.ui.confirmDialog(`<b>Warning:</b> It looks like you've removed the "More Options" button from your favourites.
        This could make areas of RedWarn, such as RedWarn preferences and other features inaccessible without scripting knowledge,
        or blanking your RedWarn config. Would you like to open RedWarn preferences to correct this irregularity, or keep your changes?`,
            "OPEN REDWARN PREFERENCES", ()=>{
                dialogEngine.closeDialog(()=>rw.ui.openPreferences());
            },
            "<small>KEEP, I UNDERSTAND THE RISKS</small>", ()=>{
                dialogEngine.closeDialog();//this thing turns it off
                rw.visuals.toast.show("This dialog will not show again.");//display a toast
                rw.config.rwMORemovedWarning = "dismissed"; // hides the dialog in future
                rw.info.writeConfig(true, ()=>{}); // save config
                
            },80);
    }

    // Generate HTML from icons and user config
    let finalHTML = ``;
    const pageIsUserPage = mw.config.get("wgRelevantPageName").includes("User:") || mw.config.get("wgRelevantPageName").includes("User_talk:");
    const pageIsEditable = mw.config.get("wgIsProbablyEditable");
    // Now generate the HTML
    rw.topIcons.icons.forEach((icon, i)=>{
        // Generate an ID for click handlers and tooltip
        const iconID = "rwTopIcon"+ i;
        // if icon enabled and (icon shows on user page and page is userpage and is editable, or icon shows on uneditable pages and page isn't editable)
        // FOR NORMAL ICONS ONLY, other twinkle style menu handled elsewhere
        if ((icon.enabled && ((icon.showsOnlyOnUserPages && pageIsUserPage) || (pageIsEditable && !icon.showsOnlyOnUserPages) || (!pageIsEditable && icon.showsOnUneditablePages)))) finalHTML += `
        <div id="${iconID}" class="icon material-icons"><span style="cursor: pointer;${icon.colorModifier == null ? `` : `color:`+ icon.colorModifier}" class="${icon.className}">
        ${icon.icon}
        </span></div>
        <div class="mdl-tooltip mdl-tooltip--large" for="${iconID}">
            ${icon.title}
        </div>
        `;
    });

    return finalHTML;
  },

  "addHandlers" : ()=>{ // add handlers once icons have been rendered
    if (mw.config.get("wgNamespaceNumber") < 0) return; // if on special page, skip
    const pageIsUserPage = mw.config.get("wgRelevantPageName").includes("User:") || mw.config.get("wgRelevantPageName").includes("User_talk:");
    const pageIsEditable = mw.config.get("wgIsProbablyEditable");
    rw.topIcons.icons.forEach((icon, i)=>{
        // Generate an ID for click handlers and tooltip
        const iconID = "rwTopIcon"+ i;
        // Add click handler
        if ((icon.enabled && ((icon.showsOnlyOnUserPages && pageIsUserPage) || (pageIsEditable && !icon.showsOnlyOnUserPages) || (!pageIsEditable && icon.showsOnUneditablePages)))) {
            $(`#${iconID}`).click(icon.callback);
        }
    });
  },

  "getHiddenHTML" : ()=> { // for more options menu, also registers handlers
    if (mw.config.get("wgNamespaceNumber") < 0) return ``; // if on special page, skip

    // Generate HTML from icons and user config
    let finalHTML = ``;
    const pageIsUserPage = mw.config.get("wgRelevantPageName").includes("User:") || mw.config.get("wgRelevantPageName").includes("User_talk:");
    const pageIsEditable = mw.config.get("wgIsProbablyEditable");
    // Now generate the HTML
    rw.topIcons.icons.forEach((icon, i)=>{
        // Generate an ID for click handlers and tooltip
        const iconID = "rwTopIcon"+ i;
        // if icon enabled and (icon shows on user page and page is userpage and is editable, or icon shows on uneditable pages and page isn't editable)
        // FOR NORMAL ICONS ONLY, other twinkle style menu handled elsewhere
        if ((!icon.enabled && ((icon.showsOnlyOnUserPages && pageIsUserPage) || (pageIsEditable && !icon.showsOnlyOnUserPages) || (!pageIsEditable && icon.showsOnUneditablePages)))) {
            finalHTML += `
                <div class="mdl-button mdl-js-button" style="width:100%; text-align: left;${icon.colorModifier == null ? `` : `color:`+ icon.colorModifier}" onclick="window.parent.postMessage('${iconID}', '*');">
                    <span class="material-icons" style="padding-right:20px">${icon.icon}</span>${icon.title}
                </div>
                <hr style="margin:0"/>
            `;

            // Now add click handler, close dialog then callback
            addMessageHandler(iconID, ()=>dialogEngine.closeDialog(icon.callback));
        }
    });

    return finalHTML;
  }
};
// rw-source: dialog.js
/**
* dialogEngine creates a single dialog within RedWarn and is the framework for a majority of dialogs.
*
* @class dialogEngine
*/
var dialogEngine = {
    /**
     * Initalises dialogEngine.
     * @method init
     * @extends dialogEngine
     */
    "init" : ()=>{
        $("body").append(`
        <div id="dialogEngineContainer">
        </div>
        `);
        // Add events
        addMessageHandler("closeDialog", ()=>{dialogEngine.closeDialog();}); // closing
    },

    /**
     * Replace/create a new dialogEngine dialog
     * 
     * @param {string} content HTML content, usually mdlContainer iFrame
     * @param {boolean} noPad optional: whether or not the dialog should have paddding, false for padding, true to remove it. Set to true for full-screen dialogs.
     *                                  This will also remove rounded corners and other dialog controls.
     * @returns {object} DOM dialog element (you can also access this via dialogEngine.dialog)
     */
    "create" : (content, noPad)=>{ 
       
        // Create element with rounded corners if requested
        $("#dialogEngineContainer").html(`
        <dialog class="mdl-dialog" id="dialogEngineDialog" ${(noPad ? "" : `style="border-radius: 7px;"`)}>
            ${content}
        </dialog>
        `);


        dialogEngine.dialog = document.querySelector('#dialogEngineDialog');

        if (noPad) $("#dialogEngineDialog").attr("style", "padding:inherit;"); // if no padding requested

        // Firefox issue fix
        if (! dialogEngine.dialog.showModal) {
            dialogPolyfill.registerDialog(dialogEngine.dialog);
        }
        
        return dialogEngine.dialog;
    },

    /**
     * Closes the currently visible dialogEngine dialog with animation.
     * @method closeDialog
     * @extends dialogEngine
     */
    "closeDialog" : callback=> {
        // Close the dialog (animated)
        $(dialogEngine.dialog)
        .addClass("closeAnimate")
        .on("webkitAnimationEnd", ()=>{
            // Animation finished
            dialogEngine.dialog.close();
            try {
                if (callback != null) callback();
            } catch (error) {
                // On error report bug
                console.error(error);
                rw.ui.reportBug("Error during closeDialog callback. "+ error.stack);
            }
            
        });

        // Make sure to reenable scrolling
        dialogEngine.enableScrolling();
    },

    /**
     * Stops the parent page from scrolling
     *
     * @method freezeScrolling
     * @extends dialogEngine
     */
    "freezeScrolling" : ()=>{// stop the page from scrolling
        $("body").css("overflow", "hidden");
    }, 

    /**
     * Enables the parent page to scroll - ran automatically on dialogEngine.closeDialog()
     *
     * @method enableScrolling
     * @extends dialogEngine
     */
    "enableScrolling" : ()=>{
        $("body").css("overflow", "");
    }
}
// rw-source: mdlContainer.js
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

        <!-- expander element CSS -->
        <style>
        /* For the rotating expanders - also requires JS to trigger animation */
        expander {
            float: right;
            margin-top: 5px;
            margin-right: 25px;
            transform-origin: center center;
        }

        expander.expanding {
            animation: rotationIn 0.3s  ease-in-out;
        }

        expander.expanded {
            transform: rotate(180deg);
        }

        expander.shrinking {
            animation: rotationOut 0.3s  ease-in-out;
        }

        @keyframes rotationIn {
            from {
                    transform: rotate(0deg);            
            }
            to {
                    transform: rotate(180deg);
            }
        }

        @keyframes rotationOut {
            from {
                    transform: rotate(180deg);            
            }
            to {
                    transform: rotate(0deg);
            }
        }

        /* Collapsed divs */
        div.collapsed {
            transition: all 0.3s ease-in-out;
            height: 0px;
            overflow: hidden;
        }

        body {
            scroll-behavior: smooth;
        }
        </style>
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
        ${rw.config.neopolitan != null ? `<!-- RedWarn tampering warning (on all dialogs, even after polish cow is gone) -->
            <!-- RW tamper warning -->
            <div style="
                width: 240px;
                margin: 0 auto;
                background-color: #ffc4c4;
                padding: 16px;
                border-radius: 2px;
                color: #9c0000;"> <!-- Warning -->
                    <b>Attention:</b> Tampering with RedWarn's permission system without good reason is prohibited. If you are seeing this message, your account has been automatically
                    flagged to RedWarn's team. We review abuse on a case by case basis. To dismiss this warning, remove all modifications and reset your RedWarn config manually at
                    you redwarnConfig.js user subpage. If you haven't tampered with RedWarn, you may be seeing this message due to a bug. If so, please let us know ASAP.<br/>
                    <a href="#" onclick="window.parent.postMessage('closeDialog');">Close dialog</a>
                </div>
            <br/><br/> <!-- show content if not tampered with -->
            ` : innerContent} 
        </body>

        <script>
        // Expander element things
        // ANIMATIONS ONLY for expanding elements
        $("expander").each((i, el)=>{
            // For each spinny expander, add a click handler for their parent
            $(el).parent(".mdl-button").click(()=>{
                // Check if not expanded already
                if (!$(el).hasClass("expanded")) {
                    // Expand
                    $(el).addClass("expanding");

                    // Expand attached div
                    let col = $(\`#\${$(el).attr("expander-content-id")}\`)[0]; // get div element
                    $(col).css("height", $(col).attr("targetHeight")); // expand
                    // Scroll to
                    $(el).parent(".mdl-button").parent("div").scrollTo(el, 250);
                } else {
                    // Shrink
                    $(el).removeClass("expanded").addClass("shrinking");

                    // Collapse attached div
                    let col = $(\`#\${$(el).attr("expander-content-id")}\`)[0]; // get div element
                    $(col).css("height", "0px"); // shrink
                }
            });

            // When animation finishes
            $(el).on("webkitAnimationEnd", ()=>{
                if ($(el).hasClass("expanding")) {
                    // Time to apply the expanded class to ensure it stays
                    $(el).removeClass("expanding").addClass("expanded");
                } else {
                    $(el).removeClass("shrinking"); // just remove shrinking
                }
            });
        });

        // jQuery scroll
        jQuery.fn.scrollTo = function(elem, speed) { 
            $(this).animate({
                scrollTop:  $(this).scrollTop() - $(this).offset().top + $(elem).offset().top 
            }, speed == undefined ? 1000 : speed); 
            return this; 
        };
        </script>
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
        return `<iframe width="${width}" height="${height}" src="${url}" frameborder="0" scrolling="no" style="max-height: 100%;"></iframe>`;
    }
};
// rw-source: rules.js
// Data originally processed from Twinkle Source at https://github.com/azatoth/twinkle
rw.rules = [
    {
        "name": "Vandalism",
        "catagory": "Common warnings",
        "template": "uw-vandalism",
        "warningLevels": [
            1,
            2,
            3,
            4,
            5
        ]
    },
    {
        "name": "Disruptive editing",
        "catagory": "Common warnings",
        "template": "uw-disruptive",
        "warningLevels": [
            1,
            2,
            3,
            4
        ]
    },
    {
        "name": "Editing tests",
        "catagory": "Common warnings",
        "template": "uw-test",
        "warningLevels": [
            1,
            2,
            3
        ]
    },
    {
        "name": "Removal of content, blanking",
        "catagory": "Common warnings",
        "template": "uw-delete",
        "warningLevels": [
            1,
            2,
            3,
            4,
            5
        ]
    },
    {
        "name": "Generic warning (for template series missing level 4)",
        "catagory": "Common warnings",
        "template": "uw-generic",
        "warningLevels": [
            4
        ]
    },
    {
        "name": "Adding unreferenced information about living persons",
        "catagory": "Article Conduct Warnings",
        "template": "uw-biog",
        "warningLevels": [
            1,
            2,
            3,
            4,
            5
        ]
    },
    {
        "name": "Addition of defamatory content",
        "catagory": "Article Conduct Warnings",
        "template": "uw-defamatory",
        "warningLevels": [
            1,
            2,
            3,
            4,
            5
        ]
    },
    {
        "name": "Introducing deliberate factual errors",
        "catagory": "Article Conduct Warnings",
        "template": "uw-error",
        "warningLevels": [
            1,
            2,
            3,
            4
        ]
    },
    {
        "name": "Frequent or mass changes to genres without consensus or reference",
        "catagory": "Article Conduct Warnings",
        "template": "uw-genre",
        "warningLevels": [
            1,
            2,
            3,
            4
        ]
    },
    {
        "name": "Image-related vandalism",
        "catagory": "Article Conduct Warnings",
        "template": "uw-image",
        "warningLevels": [
            1,
            2,
            3,
            4,
            5
        ]
    },
    {
        "name": "Using improper humor",
        "catagory": "Article Conduct Warnings",
        "template": "uw-joke",
        "warningLevels": [
            1,
            2,
            3,
            4,
            5
        ]
    },
    {
        "name": "Adding original research, including unpublished syntheses of sources",
        "catagory": "Article Conduct Warnings",
        "template": "uw-nor",
        "warningLevels": [
            1,
            2,
            3,
            4
        ]
    },
    {
        "name": "Censorship of material",
        "catagory": "Article Conduct Warnings",
        "template": "uw-notcensored",
        "warningLevels": [
            1,
            2,
            3
        ]
    },
    {
        "name": "Ownership of articles",
        "catagory": "Article Conduct Warnings",
        "template": "uw-own",
        "warningLevels": [
            1,
            2,
            3,
            4,
            5
        ]
    },
    {
        "name": "Removal of maintenance templates",
        "catagory": "Article Conduct Warnings",
        "template": "uw-tdel",
        "warningLevels": [
            1,
            2,
            3,
            4
        ]
    },
    {
        "name": "Addition of unsourced or improperly cited material",
        "catagory": "Article Conduct Warnings",
        "template": "uw-unsourced",
        "warningLevels": [
            1,
            2,
            3,
            4
        ]
    },
    {
        "name": "Using Wikipedia for advertising or promotion",
        "catagory": "Promotions and spam",
        "template": "uw-advert",
        "warningLevels": [
            1,
            2,
            3,
            4,
            5
        ]
    },
    {
        "name": "Not adhering to neutral point of view",
        "catagory": "Promotions and spam",
        "template": "uw-npov",
        "warningLevels": [
            1,
            2,
            3,
            4
        ]
    },
    {
        "name": "Paid editing without disclosure under the Wikimedia Terms of Use",
        "catagory": "Promotions and spam",
        "template": "uw-paid",
        "warningLevels": [
            1,
            2,
            3,
            4
        ]
    },
    {
        "name": "Adding spam links",
        "catagory": "Promotions and spam",
        "template": "uw-spam",
        "warningLevels": [
            1,
            2,
            3,
            4,
            5
        ]
    },
    {
        "name": "Not assuming good faith",
        "catagory": "Behavior towards other editors",
        "template": "uw-agf",
        "warningLevels": [
            1,
            2,
            3
        ]
    },
    {
        "name": "Harassment of other users",
        "catagory": "Behavior towards other editors",
        "template": "uw-harass",
        "warningLevels": [
            1,
            2,
            3,
            4,
            5
        ]
    },
    {
        "name": "Personal attack directed at a specific editor",
        "catagory": "Behavior towards other editors",
        "template": "uw-npa",
        "warningLevels": [
            1,
            2,
            3,
            4,
            5
        ]
    },
    {
        "name": "Improper use of warning or blocking template",
        "catagory": "Behavior towards other editors",
        "template": "uw-tempabuse",
        "warningLevels": [
            1,
            2
        ]
    },
    {
        "name": "Removing {{afd}} templates",
        "catagory": "Removal of deletion tags",
        "template": "uw-afd",
        "warningLevels": [
            1,
            2,
            3,
            4
        ]
    },
    {
        "name": "Removing {{blp prod}} templates",
        "catagory": "Removal of deletion tags",
        "template": "uw-blpprod",
        "warningLevels": [
            1,
            2,
            3,
            4
        ]
    },
    {
        "name": "Removing file deletion tags",
        "catagory": "Removal of deletion tags",
        "template": "uw-idt",
        "warningLevels": [
            1,
            2,
            3,
            4
        ]
    },
    {
        "name": "Removing speedy deletion tags",
        "catagory": "Removal of deletion tags",
        "template": "uw-speedy",
        "warningLevels": [
            1,
            2,
            3,
            4
        ]
    },
    {
        "name": "Triggering the edit filter",
        "catagory": "Other",
        "template": "uw-attempt",
        "warningLevels": [
            1,
            2,
            3,
            4
        ]
    },
    {
        "name": "Using talk page as forum",
        "catagory": "Other",
        "template": "uw-chat",
        "warningLevels": [
            1,
            2,
            3,
            4
        ]
    },
    {
        "name": "Creating inappropriate pages",
        "catagory": "Other",
        "template": "uw-create",
        "warningLevels": [
            1,
            2,
            3,
            4,
            5
        ]
    },
    {
        "name": "Manual of style",
        "catagory": "Other",
        "template": "uw-mos",
        "warningLevels": [
            1,
            2,
            3,
            4
        ]
    },
    {
        "name": "Page moves against naming conventions or consensus",
        "catagory": "Other",
        "template": "uw-move",
        "warningLevels": [
            1,
            2,
            3,
            4,
            5
        ]
    },
    {
        "name": "Refactoring others' talk page comments",
        "catagory": "Other",
        "template": "uw-tpv",
        "warningLevels": [
            1,
            2,
            3,
            4,
            5
        ]
    },
    {
        "name": "Uploading unencyclopedic images",
        "catagory": "Other",
        "template": "uw-upload",
        "warningLevels": [
            1,
            2,
            3,
            4,
            5
        ]
    },
    {
        "name": "Bad AIV report",
        "catagory": "Reminders",
        "template": "uw-aiv",
        "warningLevels": [
            0
        ]
    },
    {
        "name": "Creating autobiographies",
        "catagory": "Reminders",
        "template": "uw-autobiography",
        "warningLevels": [
            0
        ]
    },
    {
        "name": "Adding incorrect categories",
        "catagory": "Reminders",
        "template": "uw-badcat",
        "warningLevels": [
            0
        ]
    },
    {
        "name": "Adding inappropriate entries to lists",
        "catagory": "Reminders",
        "template": "uw-badlistentry",
        "warningLevels": [
            0
        ]
    },
    {
        "name": "Being harsh to newcomers",
        "catagory": "Reminders",
        "template": "uw-bite",
        "warningLevels": [
            0
        ]
    },
    {
        "name": "Conflict of interest",
        "catagory": "Reminders",
        "template": "uw-coi",
        "warningLevels": [
            0
        ]
    },
    {
        "name": "Introducing controversial material",
        "catagory": "Reminders",
        "template": "uw-controversial",
        "warningLevels": [
            0
        ]
    },
    {
        "name": "Copying text to another page",
        "catagory": "Reminders",
        "template": "uw-copying",
        "warningLevels": [
            0
        ]
    },
    {
        "name": "Adding speculative or unconfirmed information",
        "catagory": "Reminders",
        "template": "uw-crystal",
        "warningLevels": [
            0
        ]
    },
    {
        "name": "Cut and paste moves",
        "catagory": "Reminders",
        "template": "uw-c&pmove",
        "warningLevels": [
            0
        ]
    },
    {
        "name": "Incorrect edit to a disambiguation page",
        "catagory": "Reminders",
        "template": "uw-dab",
        "warningLevels": [
            0
        ]
    },
    {
        "name": "Unnecessarily changing date formats",
        "catagory": "Reminders",
        "template": "uw-date",
        "warningLevels": [
            0
        ]
    },
    {
        "name": "Removing proper sources containing dead links",
        "catagory": "Reminders",
        "template": "uw-deadlink",
        "warningLevels": [
            0
        ]
    },
    {
        "name": "User should draft in draftspace or userspace",
        "catagory": "Reminders",
        "template": "uw-draftfirst",
        "warningLevels": [
            0
        ]
    },
    {
        "name": "Not using edit summary",
        "catagory": "Reminders",
        "template": "uw-editsummary",
        "warningLevels": [
            0
        ]
    },
    {
        "name": "Adding external links to the body of an article",
        "catagory": "Reminders",
        "template": "uw-elinbody",
        "warningLevels": [
            0
        ]
    },
    {
        "name": "Not communicating in English",
        "catagory": "Reminders",
        "template": "uw-english",
        "warningLevels": [
            0
        ]
    },
    {
        "name": "Hasty addition of speedy deletion tags",
        "catagory": "Reminders",
        "template": "uw-hasty",
        "warningLevels": [
            0
        ]
    },
    {
        "name": "Italicize books, films, albums, magazines, TV series, etc within articles",
        "catagory": "Reminders",
        "template": "uw-italicize",
        "warningLevels": [
            0
        ]
    },
    {
        "name": "Unnecessarily changing between British and American English",
        "catagory": "Reminders",
        "template": "uw-lang",
        "warningLevels": [
            0
        ]
    },
    {
        "name": "Excessive addition of redlinks or repeated blue links",
        "catagory": "Reminders",
        "template": "uw-linking",
        "warningLevels": [
            0
        ]
    },
    {
        "name": "Incorrect use of minor edits check box",
        "catagory": "Reminders",
        "template": "uw-minor",
        "warningLevels": [
            0
        ]
    },
    {
        "name": "Creating non-English articles",
        "catagory": "Reminders",
        "template": "uw-notenglish",
        "warningLevels": [
            0
        ]
    },
    {
        "name": "We use consensus, not voting",
        "catagory": "Reminders",
        "template": "uw-notvote",
        "warningLevels": [
            0
        ]
    },
    {
        "name": "Copying from public domain sources without attribution",
        "catagory": "Reminders",
        "template": "uw-plagiarism",
        "warningLevels": [
            0
        ]
    },
    {
        "name": "Use preview button to avoid mistakes",
        "catagory": "Reminders",
        "template": "uw-preview",
        "warningLevels": [
            0
        ]
    },
    {
        "name": "Indiscriminate removal of redlinks",
        "catagory": "Reminders",
        "template": "uw-redlink",
        "warningLevels": [
            0
        ]
    },
    {
        "name": "Reverting self tests",
        "catagory": "Reminders",
        "template": "uw-selfrevert",
        "warningLevels": [
            0
        ]
    },
    {
        "name": "Wikipedia is not a social network",
        "catagory": "Reminders",
        "template": "uw-socialnetwork",
        "warningLevels": [
            0
        ]
    },
    {
        "name": "Be bold and fix things yourself",
        "catagory": "Reminders",
        "template": "uw-sofixit",
        "warningLevels": [
            0
        ]
    },
    {
        "name": "Adding spoiler alerts or removing spoilers from appropriate sections",
        "catagory": "Reminders",
        "template": "uw-spoiler",
        "warningLevels": [
            0
        ]
    },
    {
        "name": "Talk in article",
        "catagory": "Reminders",
        "template": "uw-talkinarticle",
        "warningLevels": [
            0
        ]
    },
    {
        "name": "Not signing posts",
        "catagory": "Reminders",
        "template": "uw-tilde",
        "warningLevels": [
            0
        ]
    },
    {
        "name": "Posting at the top of talk pages",
        "catagory": "Reminders",
        "template": "uw-toppost",
        "warningLevels": [
            0
        ]
    },
    {
        "name": "Stale userspace draft",
        "catagory": "Reminders",
        "template": "uw-userspace draft finish",
        "warningLevels": [
            0
        ]
    },
    {
        "name": "Adding video game walkthroughs, cheats or instructions",
        "catagory": "Reminders",
        "template": "uw-vgscope",
        "warningLevels": [
            0
        ]
    },
    {
        "name": "Place user warning templates when reverting vandalism",
        "catagory": "Reminders",
        "template": "uw-warn",
        "warningLevels": [
            0
        ]
    },
    {
        "name": "Using inaccurate or inappropriate edit summaries",
        "catagory": "Reminders",
        "template": "uw-wrongsummary",
        "warningLevels": [
            0
        ]
    },
    {
        "name": "Potential three-revert rule violation; see also uw-ew",
        "catagory": "Policy Violation Warnings",
        "template": "uw-3rr",
        "warningLevels": [
            6
        ]
    },
    {
        "name": "Affiliate marketing",
        "catagory": "Policy Violation Warnings",
        "template": "uw-affiliate",
        "warningLevels": [
            6
        ]
    },
    {
        "name": "Use of multiple accounts (assuming good faith)",
        "catagory": "Policy Violation Warnings",
        "template": "uw-agf-sock",
        "warningLevels": [
            6
        ]
    },
    {
        "name": "Creating attack pages",
        "catagory": "Policy Violation Warnings",
        "template": "uw-attack",
        "warningLevels": [
            6
        ]
    },
    {
        "name": "Bot username",
        "catagory": "Policy Violation Warnings",
        "template": "uw-botun",
        "warningLevels": [
            6
        ],
        "note" : "Username notices should not be added for blatant violations. In these cases, click the gavel to report the username to the admins."
    },
    {
        "name": "Canvassing",
        "catagory": "Policy Violation Warnings",
        "template": "uw-canvass",
        "warningLevels": [
            6
        ]
    },
    {
        "name": "Copyright violation",
        "catagory": "Policy Violation Warnings",
        "template": "uw-copyright",
        "warningLevels": [
            6
        ]
    },
    {
        "name": "Linking to copyrighted works violation",
        "catagory": "Policy Violation Warnings",
        "template": "uw-copyright-link",
        "warningLevels": [
            6
        ]
    },
    {
        "name": "Copyright violation (with explanation for new users)",
        "catagory": "Policy Violation Warnings",
        "template": "uw-copyright-new",
        "warningLevels": [
            6
        ]
    },
    {
        "name": "Removing {{copyvio}} template from articles",
        "catagory": "Policy Violation Warnings",
        "template": "uw-copyright-remove",
        "warningLevels": [
            6
        ]
    },
    {
        "name": "Edit summary triggering the edit filter",
        "catagory": "Policy Violation Warnings",
        "template": "uw-efsummary",
        "warningLevels": [
            6
        ]
    },
    {
        "name": "Edit warring (stronger wording)",
        "catagory": "Policy Violation Warnings",
        "template": "uw-ew",
        "warningLevels": [
            6
        ]
    },
    {
        "name": "Edit warring (softer wording for newcomers)",
        "catagory": "Policy Violation Warnings",
        "template": "uw-ewsoft",
        "warningLevels": [
            6
        ]
    },
    {
        "name": "Hijacking articles",
        "catagory": "Policy Violation Warnings",
        "template": "uw-hijacking",
        "warningLevels": [
            6
        ]
    },
    {
        "name": "Creating hoaxes",
        "catagory": "Policy Violation Warnings",
        "template": "uw-hoax",
        "warningLevels": [
            6
        ]
    },
    {
        "name": "Making legal threats",
        "catagory": "Policy Violation Warnings",
        "template": "uw-legal",
        "warningLevels": [
            6
        ]
    },
    {
        "name": "Editing while logged out",
        "catagory": "Policy Violation Warnings",
        "template": "uw-login",
        "warningLevels": [
            6
        ]
    },
    {
        "name": "Usage of multiple IPs",
        "catagory": "Policy Violation Warnings",
        "template": "uw-multipleIPs",
        "warningLevels": [
            6
        ]
    },
    {
        "name": "Personal info",
        "catagory": "Policy Violation Warnings",
        "template": "uw-pinfo",
        "warningLevels": [
            6
        ]
    },
    {
        "name": "Recreating salted articles under a different title",
        "catagory": "Policy Violation Warnings",
        "template": "uw-salt",
        "warningLevels": [
            6
        ]
    },
    {
        "name": "Sockpuppetry",
        "catagory": "Policy Violation Warnings",
        "template": "uw-socksuspect",
        "warningLevels": [
            6
        ]
    },
    {
        "name": "Userpage vandalism",
        "catagory": "Policy Violation Warnings",
        "template": "uw-upv",
        "warningLevels": [
            6
        ]
    },
    {
        "name": "Username is against policy",
        "catagory": "Policy Violation Warnings",
        "template": "uw-username",
        "warningLevels": [
            6
        ],
        "note" : "Username notices should not be added for blatant violations. In these cases, click the gavel to report the username to the admins."
    },
    {
        "name": "Username is against policy, and conflict of interest",
        "catagory": "Policy Violation Warnings",
        "template": "uw-coi-username",
        "warningLevels": [
            6
        ],
        "note" : "Username notices should not be added for blatant violations. In these cases, click the gavel to report the username to the admins."
    },
    {
        "name": "Userpage or subpage is against policy",
        "catagory": "Policy Violation Warnings",
        "template": "uw-userpage",
        "warningLevels": [
            6
        ],
        "note" : "Username notices should not be added for blatant violations. In these cases, click the gavel to report the username to the admins."
    }
];

// rw-source: toast.js
// Used to manage the toast notifications
// init is seperate here as it isn't always needed or used

/*
    EXAMPLE SYNTAX:
    Required somewhere: rw.visuals.toast.init();
    Then:
    (for no button) rw.visuals.toast.show("Text", false, false, 2000);
    (for button) rw.visuals.toast.show("Text", "BtnTxt", function() {
        // your code here
    }, 5000);
*/

rw.visuals.toast = {
    
    "active" : false,

    "init" : function(){
        if (!rw.visuals.toast.active) { // If init already done, no need
            $('body').append(`
                <div id="rw-toast" class="mdl-js-snackbar mdl-snackbar">
                <div class="mdl-snackbar__text"></div>
                <button class="mdl-snackbar__action" type="button"></button>
                </div>
            `); // init
            (function() {
                'use strict';
                window['counter'] = 0;
                var toast = document.querySelector('#rw-toast');
                rw.visuals.register(toast); // register comp

                // create function
                rw.visuals.toast.show = (text, buttonTxt, btnClick, tOut) => {
                    'use strict';
                    if (buttonTxt) {
                        // Show with action and button
                        toast.MaterialSnackbar.showSnackbar({message: text, actionHandler: btnClick, actionText: buttonTxt, timeout: tOut}); 
                    } else {
                        // Show just message
                        toast.MaterialSnackbar.showSnackbar({message: text, timeout: tOut});
                    }
                };
                }());

            // Init done. Register.
            rw.visuals.toast.active = true;
        }
    },

    "show" : function(text, buttonTxt, btnClick) {} // made in init()

}
// rw-source: info.js
/**
 * rw.info performes misc. actions, inlcuding adding text to user pages, loading user config and more.
 * @class rw.info
 */
// API calls ext.
rw.info = { // API
    /**
     * If a user is in the "rollbacker" user group, this will be automatically set via window.initRW() to the users rollback token.
     * @property rollbackToken
     * @type {string}
     * @extends rw.info
     */
    // Rollback token
    "rollbackToken" : "",

    /**
     * Sets rw.info.rollbackToken with the users rollback token if they have they are in the "rollbacker" user group.
     * @method getRollbackToken
     * @extends rw.info
     */
    "getRollbackToken" : () => {
        // Ran on load to allow for ?action=rollback request
        rw.info.featureRestrictPermissionLevel("rollbacker", ()=>{
            $.getJSON(rw.wikiAPI + "?action=query&meta=tokens&type=rollback&format=json", r=>{
                rw.info.rollbackToken = r.query.tokens.rollbacktoken; // Set from response
            });
        },()=>{});
    },

    /**
     * Gets the target username of an action, or username argument if defined.
     *
     * @param {string} un Optional: Username. If set, will just return this parameter.
     * @returns {string} Target Username
     * @method targetUsername
     * @extends rw.info
     */
    "targetUsername": un=>{
        if (un) {return un;} // return username if defined

        if (mw.config.get("wgRelevantUserName") == null) {
            // Try getting revision user and returning that
            try {
                const target = $($("#mw-diff-ntitle2").find(".mw-userlink")[0]).text();
                return (target == "" ? null : target); // if empty send null
            } catch (error) {} // do nothing on error
        }
        return mw.config.get("wgRelevantUserName");},

    /**
     * Gets the logged in user's username
     *
     * @returns {string} Logged in username
     * @method getUsername
     * @extends rw.info
     */
    "getUsername":  ()=>{return mw.config.get("wgUserName");},


    /**
     * Detects if the given username is an IP address
     *
     * @param {string} un Username
     * @returns {boolean}
     * @method isUserAnon
     * @extends rw.info
     */
    "isUserAnon" : un=> {
        // Detect if user is an IP address
        let regEx = un.match(/([0-9A-Fa-f]{1,4}:){7}[0-9A-Fa-f]{1,4}|(\d{1,3}\.){3}\d{1,3}/g); // this regex matches all ipv4 and ipv6 addresses. thanks: http://regexlib.com/UserPatterns.aspx?authorId=3e359e7e-cff5-4149-ba94-7baeae099d9c
        return (regEx != null); // If matches is not null then yes
    },

    /**
     * Sets rw.config to the current user config. If rw.config is already set, it will immediately callback.
     *
     * @param {function} callback
     * @param {boolean} resetToDefault If set to true, the user config will be reset to default. Callback will not be called in these cases.
     * @method getConfig
     * @extends rw.info
     */
    "getConfig": (callback, resetToDefault) => { // IF RESETTODEFAULT IS TRUE IT WILL DO IT
        
        let defaultConfig = { // Default config on reset or anything like that
            "lastVersion" : rw.version
        };

        if (resetToDefault) {rw.config = defaultConfig; rw.info.writeConfig(); return;} // If reset to default, do it

        if (rw.config) {callback();} // if config loaded, no need to reload


        // gets user config from their page. 
        let user = rw.info.getUsername();
        $.getJSON(rw.wikiAPI + "?action=query&prop=revisions&titles=User:"+user+"/redwarnConfig.js&rvslots=*&rvprop=content&formatversion=2&format=json", latestR=>{
            // Grab text from latest revision of talk page
            // Check if exists
            let revisionWikitext = "";
            if (!latestR.query.pages[0].missing) { // If page isn't missing, i.e exists
                revisionWikitext = latestR.query.pages[0].revisions[0].slots.main.content;
            } else {
                // Config doesn't exist  we need to make it
                console.log("creating config file");
                rw.config = defaultConfig;
                rw.info.writeConfig(()=>{if (callback != null) callback();}); // write new config file and callback if possible, else, add welcome screen here
                return;
            }

            // Now that's done, verify config file / load it
            try {
                eval(revisionWikitext); // exec script

                if (!rw.config) throw "no config";

                // Process template packs (b64encoded string)
                if (rw.config.templatePacks != null) {
                    rw.config.templatePacks = JSON.parse(atob(rw.config.templatePacks));
                    // Verify
                    if (typeof rw.config.templatePacks == "string") rw.config.templatePacks = JSON.parse(atob(rw.config.templatePacks)); // if issue, throw error and return to default
                }

                // Load rollback icons
                if (rw.config.rwRollbackIcons != null) {
                    // More info in preferences.html and rollback.html
                    let newRwIcons = []; // object containing the new object
                    rw.config.rwRollbackIcons.forEach(icon=>{ // for each icon
                        // Add to ours at the new location
                        newRwIcons[icon.shift] = rw.rollback.icons[icon.index];
                        // Now modify for each modifier in modify object
                        for (const key in icon.modify) {
                            if (icon.modify.hasOwnProperty(key)) {
                                const value = icon.modify[key];
                                newRwIcons[icon.shift][key] = value; // apply modifier
                            }
                        }

                        // Set original index for preferences
                        newRwIcons[icon.shift].originalIndex = icon.index; // DO NOT set this to iconIndex as iconIndex is for rendering - this is for config and preferences ONLY
                    });

                    // Now update rwrollbackicons
                    rw.rollback.icons = newRwIcons;
                }

                if (rw.config.rwRollbackShorten == "enable") { // if rollback shortened
                    rw.rollback.icons.forEach((el, i)=>{
                        el.name = el.name.replace("Quick rollback", "QRB"); // replace
                        el.name = el.name.replace("Rollback", "RB"); // replace
                        el.name = el.name.replace("rollback", "RB"); // replace

                        rw.rollback.icons[i] = el; // set back
                    });
                }

                // Load page icons
                if (rw.config.rwPageIcons != null) {
                    // More info in preferences.html and rollback.html
                    let newRwIcons = []; // object containing the new object
                    rw.config.rwPageIcons.forEach(icon=>{ // for each icon
                        // Add to ours at the new location
                        newRwIcons[icon.shift] = rw.topIcons.icons[icon.index];
                        // Now modify for each modifier in modify object
                        for (const key in icon.modify) {
                            if (icon.modify.hasOwnProperty(key)) {
                                const value = icon.modify[key];
                                newRwIcons[icon.shift][key] = value; // apply modifier
                            }
                        }

                        // Set original index for preferences
                        newRwIcons[icon.shift].originalIndex = icon.index; // DO NOT set this to iconIndex as iconIndex is for rendering - this is for config and preferences ONLY
                    });

                    // Now update rwrollbackicons
                    rw.topIcons.icons = newRwIcons;
                }

            } catch (err) {
                // Corrupt config file
                console.log(rw.config);
                rw.config = defaultConfig;
                console.error(err);
                // Reset config file to defaults
                rw.info.writeConfig(true, ()=>rw.ui.confirmDialog(`Sorry, but an issue has caused your RedWarn preferences to be reset to default. Would you like to report a bug?`, 
                "Report Bug", ()=>{
                    rw.ui.reportBug(`<!-- DO NOT EDIT BELOW THIS LINE! THANK YOU -->
redwarnConfig load - Error info: <code><nowiki>
${err.stack}</nowiki></code>
[[User:${user}/redwarnConfig.js|Open user redwarnConfig.js]]`);
                },
                
                "DISMISS", ()=>{
                    dialogEngine.closeDialog();
                }, 20));   
            }
            

            callback(); // we done
        });
    },

    /**
     * Writes to a users redwarnConfig.js file with the current configuration set in rw.config
     *
     * @param {boolean} noRedirect If false, the page will reload on completion and also show a loading dialog.
     * @param {function} callback Callback function if noRedirect is set to true.
     * @method writeConfig
     * @extends rw.info
     */
    "writeConfig": (noRedirect, callback)=> { // CALLBACK ONLY IF NOREDIRECT IS TRUE.
        let rwConfigTemplate = rw.config.templatePacks; // for restore
        // Handle templates (saved as b64 string)
        if (rw.config.templatePacks != null) rw.config.templatePacks = btoa(JSON.stringify(rw.config.templatePacks));
        if (!noRedirect) rw.ui.loadDialog.show("Saving preferences...");
        // Write config to the users page and refresh
        let finalTxt = `
/*<nowiki>                                                    
This is your RedWarn configuration file. It is recommended that you don't edit this yourself and use RedWarn prefrences instead.
It is writen in JSON formatting and is excecuted every time RedWarn loads.

If somebody has asked you to add code to this page, DO NOT do so as it may comprimise your account and will be reverted as soon as any configuration value changes.

!!! Do not edit below this line unless you understand the risks! If rw.config isn't defined, this file will be reset. !!!
*/
rw.config = `+ JSON.stringify(rw.config) +"; //</nowiki>"; // generate config text
        $.post(rw.wikiAPI, {  // LOCALISATION ISSUE!!
                "action": "edit",
                "format": "json",
                "token" : mw.user.tokens.get("csrfToken"),
                "title" : "User:"+ rw.info.getUsername() + "/redwarnConfig.js",
                "summary" : "Updating user configuration [[w:en:WP:RW|(RW "+ rw.version +")]]", // summary sign here
                "text": finalTxt,
                "tags" : ((rw.wikiID == "enwiki") ? "RedWarn" : null) // Only add tags if on english wikipedia
            }).done(dt => {
                // We done. Check for errors, then callback appropriately
                if (!dt.edit) {
                    // Error occured or other issue
                    console.error(dt);
                    rw.visuals.toast.show("Sorry, there was an error. See the console for more info. Your changes have not been saved.");
                } else {
                    // Success!
                    if (noRedirect) {rw.config.templatePacks = rwConfigTemplate; callback(); return;}; // DO NOT continue if no redirect is requested
                    window.location.hash = "#configChange";
                    window.location.reload(); // we done
                }
            });
    },

    /**
     * Restrict this feature to a user group. This will be overridden if the user is in the "sysop" group.
     *
     * @param {string} l User group
     * @param {function} callback Callback that will be called if user is in the defined user group.
     * @param {function} callbackIfNot Callback that will be called if user is not in the defined user group.
     * @method featureRestrictPermissionLevel
     * @extends rw.info
     */
    "featureRestrictPermissionLevel": (l, callback, callbackIfNot)=> {
        // Restrict feature to users in this group
        mw.user.getGroups(g=>{
            let hasPerm = g.includes(l);
            if (!hasPerm) hasPerm = g.includes("sysop"); // admins override all feature restrictions if we don't have them

            if ((l == "confirmed") && !hasPerm) {hasPerm = g.includes("autoconfirmed");} // Due to 2 types of confirmed user, confirmed and autoconfirmed, we have to check both
            if (hasPerm) {
                // Has the permission needed
                if (callback) {
                    callback();
                }
            } else {
                if (callbackIfNot) {
                    // Make no perm callback
                    callbackIfNot();
                } else {
                    // Show no perm toast
                    rw.visuals.toast.show("Your account doesn't have permission to do that yet.", false, false, 5000);
                }
            }
        });
    },

    /**
     * Gets the related page for this action.
     *
     * @param {string} pg If set, this function will return this parameter
     * @returns {string} Related page
     * @method getRelatedPage
     * @extends rw.info
     */
    "getRelatedPage" : (pg)=> {
        if (pg) {return pg;} // return page if defined
        try {
            let x = mw.util.getParamValue('vanarticle');
            if (x != null) {return x;} else {return "";}
        } catch (er) {
            // If none
            return "error";
        }  
    },

    /**
     * Uses MediaWiki's parser API to convert given WikiText to HTML
     *
     * @param {string} wikiTxt 
     * @param {function} callback callback(parsedHTML)
     * @method parseWikitext
     * @extends rw.info
     */
    "parseWikitext" : (wikiTxt, callback) => { // Uses Wikipedia's API to turn Wikitext to string. NEED TO USE POST IF USERPAGE IS LARGE EXT..
        $.post(rw.wikiAPI, {
            "action": "parse",
            "format": "json",
            "contentmodel" : "wikitext",
            "prop": "text",
            "pst": true,
            "assert": "user",
            "text": wikiTxt
        }).done(r => {
            let processedResult = r.parse.text['*'].replace(/\/\//g, "https://").replace(/href=\"\/wiki/g, `href="${rw.wikiBase}/wiki`); // regex replace w direct urls
            callback(processedResult); // make callback w HTML
        });
    },

    /**
     * Detects and calls back with the highest warning level this user has recieved this month.
     *
     * @param {string} user
     * @param {function} callback callback(int warningLevel [0 none 1 notice 2 caution 3 warning 4 final warning], string thisMonthsNotices (wikitext), string userPg (wikitext))
     * @method lastWarningLevel
     * @extends rw.info
     */
    "lastWarningLevel" : (user, callback)=> { // callback(wLevel. thisMonthsNotices, userPg) 0 none 1 notice 2 caution 3 warning 4 final warning
        // Get the last warning level of a user this month
        $.getJSON(rw.wikiAPI + "?action=query&prop=revisions&titles=User_talk:"+user+"&rvslots=*&rvprop=content&formatversion=2&format=json", latestR=>{
            // Grab text from latest revision of talk page
            // Check if exists
            let revisionWikitext = "";
            if (!latestR.query.pages[0].missing) { // If page isn't missing, i.e exists
                revisionWikitext = latestR.query.pages[0].revisions[0].slots.main.content;
            } else {
                // Return that record is clean as no past warnings due to page not existing
                callback(0, "Talk page doesn't exist.", "Talk page doesn't exist."); // exit
                return;
            }
            let wikiTxtLines = revisionWikitext.split("\n");
            // let's continue
            // Returns date in == Month Year == format and matches
            let currentDateHeading = ((d)=>{return "== " + ['January','February','March','April','May','June','July','August','September','October','November','December'][d.getMonth()] + " " + (1900 + d.getYear()) + " =="})(new Date);
            
            // rev13, add alt without space
            let currentAltDateHeading = ((d)=>{return "==" + ['January','February','March','April','May','June','July','August','September','October','November','December'][d.getMonth()] + " " + (1900 + d.getYear()) + "=="})(new Date);
            
            let pageIncludesCurrentDate = wikiTxtLines.includes(currentDateHeading);
            let pageIncludesCurrentAltDate = wikiTxtLines.includes(currentAltDateHeading);

            if ((!pageIncludesCurrentDate) && (!pageIncludesCurrentAltDate)) {
                // No warnings this month
                callback(0, "No notices for this month.", revisionWikitext);
                return;
            } else if ((!pageIncludesCurrentDate) && (pageIncludesCurrentAltDate)) currentDateHeading = currentAltDateHeading; // If ==Date== is there but == Date == isn't, use ==Date== instead.

            let highestWarningLevel = 0; // Set highest to nothing so if there is a date title w nothing in then that will be reported 
            let thisMonthsNotices = ""; // for dialog
            // For each line
            for (let i = wikiTxtLines.indexOf(currentDateHeading) + 1; i < wikiTxtLines.length; i++) {
                if (wikiTxtLines[i].startsWith("==")) {
                    // New section
                    break; // exit the loop
                }

                // Check if it contains logo for each level
                thisMonthsNotices += wikiTxtLines[i]; // Add to this months
                if (wikiTxtLines[i].match(/(File:|Image:)Stop hand nuvola.svg/gi)) { // Level 4 warning
                    // This is the highest warning level. We can leave now
                    highestWarningLevel = 4;
                    break; // exit the loop
                }

                // Not using elseif in case of formatting ext..

                if (wikiTxtLines[i].match(/(File:|Image:)(Nuvola apps important.svg|Ambox warning pn.svg)/gi)) { // Level 3 warning
                    highestWarningLevel = 3; // No need for if check as highest level exits
                }

                if (wikiTxtLines[i].match(/(File:|Image:)Information orange.svg/gi)) { // Level 2 warning 
                    if (highestWarningLevel < 3) {
                        // We can set
                        highestWarningLevel = 2;
                    }
                }

                if (wikiTxtLines[i].match(/(File:|Image:)Information.svg/gi)) { // Level 1 notice
                    if (highestWarningLevel < 2) {
                        // We can set
                        highestWarningLevel = 1;
                    }
                }
            } // End for loop

            callback(highestWarningLevel, thisMonthsNotices, revisionWikitext); // We done

        });
    },// End lastWarningLevel

    /**
     * Adds given WikiText to a users talk page.
     *
     * @param {string} user Username of the account to add text to
     * @param {string} text Wikitext to append
     * @param {boolean} underDate If set true, the edit will be appended under this months date header, e.g. July 2020
     * @param {string} summary The summary for this edit, excluding any RedWarn branding (this function automatically appends this)
     * @param {string} blacklist If a userpage contains this text, the edit will not be made and the text in blackListToast will be shown in a toast message. Set to null to disable.
     * @param {string} blacklistToast Toast message to show if blacklist is matched.
     * @param {function} callback If no callback set, a saving message dialog will be shown and a redirect will occur on completion.
     * @method addWikiTextToUserPage
     * @extends rw.info
     */
    "addWikiTextToUserPage" : (user, text, underDate, summary, blacklist, blacklistToast, callback) => {
        if ((user == null) || (user.toLowerCase() == "undefined")) {
            // Stop it from being sent to User:undefined
            // TODO: Add callback because likely bug
            rw.visuals.toast.show("Sorry, an error occured. (user undef.)");
            return;
        }
        if (callback == null) rw.ui.loadDialog.show("Saving message..."); // show load if no callback
        // Add text to a page. If underdate true, add it under a date marker
        $.getJSON(rw.wikiAPI + "?action=query&prop=revisions&titles=User_talk:"+user+"&rvslots=*&rvprop=content&formatversion=2&format=json", latestR=>{
            // Grab text from latest revision of talk page
            // Check if exists
            let revisionWikitext = "";
            if (!latestR.query.pages[0].missing) { // If page isn't missing, i.e exists
                revisionWikitext = latestR.query.pages[0].revisions[0].slots.main.content;
            } // else we keep to ""
            let wikiTxtLines = revisionWikitext.split("\n");
            let finalTxt = "";

            // Check blacklist (if defined)
            if (blacklist) {
                if (revisionWikitext.includes(blacklist)) {
                    // Don't continue and show toast
                    rw.ui.loadDialog.close();
                    rw.visuals.toast.show(blacklistToast, false, false, 5000);
                    return;
                }
            }

            // let's continue
            // Returns date in == Month Year == format and matches
            let currentDateHeading = ((d)=>{return "== " + ['January','February','March','April','May','June','July','August','September','October','November','December'][d.getMonth()] + " " + (1900 + d.getYear()) + " =="})(new Date);
            let pageIncludesCurrentDate = wikiTxtLines.includes(currentDateHeading);
            // rev13, add alt without space (i.e ==Month Year==)
            let currentAltDateHeading = ((d)=>{return "==" + ['January','February','March','April','May','June','July','August','September','October','November','December'][d.getMonth()] + " " + (1900 + d.getYear()) + "=="})(new Date);
            let pageIncludesCurrentAltDate = wikiTxtLines.includes(currentAltDateHeading);

            if ((!pageIncludesCurrentDate) && (pageIncludesCurrentAltDate)) { // If ==Date== is there but == Date == isn't, use ==Date== instead.
                currentDateHeading = currentAltDateHeading;
                pageIncludesCurrentDate = true;
            } 
            
            // Let's continue :)
            if (underDate) {
                if (pageIncludesCurrentDate) {
                    // Locate and add text in section

                    // Locate where the current date section ends so we can append ours to the bottom
                    let locationOfLastLine = wikiTxtLines.indexOf(currentDateHeading) + 1; // in case of date heading w nothing under it
                    for (let i = wikiTxtLines.indexOf(currentDateHeading) + 1; i < wikiTxtLines.length; i++) {
                        if (wikiTxtLines[i].startsWith("==")) { 
                            // New section
                            locationOfLastLine = i - 1; // the line above is therefore the last
                            console.log("exiting loop: " +wikiTxtLines[locationOfLastLine]);
                            break; // exit the loop
                        } else if (i == wikiTxtLines.length - 1) {
                            // End of page, let's break and set location of last line.
                            locationOfLastLine = i;
                            break; // exit loop
                        }
                    }
                    console.log(locationOfLastLine);
                    if (locationOfLastLine == wikiTxtLines.length - 1) {
                        // To prevent to end notices squishing against eachother
                        // Same as without, but we just include the date string at bottom of page
                        wikiTxtLines.push(["\n" + text]);
                    } else {
                        wikiTxtLines.splice(locationOfLastLine, 0, ["\n" + text]); // Add notice to array at correct position. Note the "" at the start is for a newline to seperate from prev content
                    }
                } else { // Page doesn't have current date
                    // Same as without, but we just include the date string at bottom of page
                    wikiTxtLines.push(["\n" + currentDateHeading + "\n" + text]);
                }
            } else {
                // No need to add to date. Just shove at the bottom of the page
                wikiTxtLines.push([text]);
            }

            // Process final string
            wikiTxtLines.forEach(ln => finalTxt = finalTxt + ln + "\n"); // Remap to lines
            console.log(finalTxt);

            // Push edit using CSRF token
            $.post(rw.wikiAPI, {
                "action": "edit",
                "format": "json",
                "token" : mw.user.tokens.get("csrfToken"),
                "title" : "User_talk:"+ user,
                "summary" : summary + " [[w:en:WP:RW|(RW "+ rw.version +")]]", // summary sign here
                "text": finalTxt,
                "tags" : ((rw.wikiID == "enwiki") ? "RedWarn" : null) // Only add tags if on english wikipedia
            }).done(dt => {
                // We done. Check for errors, then callback appropriately
                if (!dt.edit) {
                    // Error occured or other issue
                    console.error(dt);
                    rw.ui.loadDialog.close();
                    rw.visuals.toast.show("Sorry, there was an error. See the console for more info. Your message has not been sent.");
                    // Reshow dialog
                    dialogEngine.dialog.showModal();
                } else {
                    // Success! 
                    if (callback != null) {callback(); return;}; // callback and stop if set, else..

                    // Redirect to complete page
                    let reloadNeeded = window.location.href.includes(rw.wikiBase+"/wiki/User_talk:"+ user); // if we are already on the talk page we need to refresh as this would just change the hash
                    redirect(rw.wikiBase+"/wiki/User_talk:"+ user + "#noticeApplied-" + dt.edit.newrevid + "-" + dt.edit.oldrevid); // go to talk page
                    if (reloadNeeded) {location.reload();}
                    // We done
                }
            });
        }); 
    }, // end addTextToUserPage

    
    /**
     * Quick welcomes the given user. Depreceated in rev12.
     *
     * @param {string} un Username to append the welcome template to
     * @method quickWelcome
     * @extends rw.info
     * @deprecated Use rw.quickTemplate instead.
     * 
     */
    "quickWelcome" : un=>{
        // Quickly welcome the current user
        // Check if registered or unregistered user
        if (rw.info.isUserAnon(rw.info.targetUsername(un))) {
            // IP Editor - send IP welcome
            rw.info.addWikiTextToUserPage(rw.info.targetUsername(un), "\n"+ rw.welcomeIP() +" " + rw.sign() +"\n", false, "Welcome! (IP)");
        } else {
            // Registered user
            rw.info.addWikiTextToUserPage(rw.info.targetUsername(un), "\n"+ rw.welcome() +" " + rw.sign() +"\n", false, "Welcome!");
        }
    },

    // Used for rollback
    /**
     * Check if the given revID is the latest revision of the given page name and will callback with the username of whoever made that edit
     *
     * @param {string} name Title of the page to check
     * @param {string} revID Revision ID to check
     * @param {function} callback callback(username) Will only be called if this is the latest revision, else will redirect to the latest revision diff page.
     * @param {function} noRedirectCallback If set, this will be called instead of a redirect if it isn't the latest revision
     * @method isLatestRevision
     * @extends rw.info
     */
    "isLatestRevision" : (name, revID, callback, noRedirectCallback) => { // callback(username) only if successful!! in other cases, will REDIRECT to latest revison compare page
        // Check if revsion is the latest revision
        $.getJSON(rw.wikiAPI + "?action=query&prop=revisions&titles="+ encodeURIComponent(name) +"&rvslots=*&rvprop=ids%7Cuser&formatversion=2&format=json", r=>{
            // We got the response
            let latestRId = r.query.pages[0].revisions[0].revid;
            let parentRId = r.query.pages[0].revisions[0].parentid;
            let latestUsername = r.query.pages[0].revisions[0].user;
            if (latestRId == revID) {
                // Yup! Send the callback
                callback(latestUsername, latestRId);
            } else {
                // Nope :(
                // Check for a noredirect callback, if so, call and return
                if (noRedirectCallback != null) {noRedirectCallback(); return;}
                
                // Load the preview page of the latest one
                try {if (dialogEngine.dialog.open) {return;}} catch (error) {} // DO NOT REDIRECT IF DIALOG IS OPEN.
                // Redirect and open in new tab if requested
                redirect(rw.wikiIndex + "?title="+ encodeURIComponent(name) +"&diff="+ latestRId +"&oldid="+ parentRId +"&diffmode=source#redirectLatestRevision", (rw.config.rwLatestRevisionOption == "newtab"));
            }
        });
    },

    /**
     * Gets the latest revision not made by the specified user on the specified page. Will prepare a summary string for rollback-like reverts.
     *
     * @param {string} name Title of the page to check
     * @param {string} username Username to exclude
     * @param {function} callback callback(revisionWikiText, preparedRevertSummary, revisionID, parentRevisionID)
     * @method latestRevisionNotByUser
     * @extends rw.info
     */
    "latestRevisionNotByUser" : (name, username, callback) => { // CALLBACK revision, summaryText, rId
        // Name is page name, username is bad username
        $.getJSON(rw.wikiAPI + "?action=query&prop=revisions&titles="+ encodeURIComponent(name) +"&rvslots=*&rvprop=ids%7Cuser%7Ccontent&rvexcludeuser="+ username +"&formatversion=2&format=json", r=>{
            // We got the response
            let _r;
            try {
                _r = r.query.pages[0].revisions[0]; // get latest revision
                if (_r == null) { throw "can't be null"; } // if empty error
            } catch (error) {
                // Probably no other edits. Redirect to history page and show the notice
                redirect(rw.wikiIndex + "?title="+ encodeURIComponent(name) +"&action=history#rollbackFailNoRev");
                return; // exit
            }
            
            let latestContent = _r.slots.main.content;
            let summary = "Reverting edit(s) by [[Special:Contributions/"+ username +"|"+ username +"]] ([[User_talk:"+ username +"|talk]]) to rev. "+ _r.revid +" by " +_r.user;
            callback(latestContent, summary, _r.revid, _r.parentid);
        });
    },

    /**
     * Calls back with the pronouns for the users given gender
     *
     * @param {string} user Username to check
     * @param {function} callback callback(pronouns) - either he/him, she/her, they/them.
     * @method getUserPronouns
     * @extends rw.info
     */
    "getUserPronouns" : (user, callback)=> {
        // Trying mediawiki api here rather than a jquery get
        new mw.Api().get({
            action: 'query',
            list: 'users',
            usprop: 'gender',
            ususers: user
        }).then(r=>{
            let gender = r.query.users[0].gender;
            callback((gender == "male") ? "he/him" : ((gender == "female") ? "she/her" : "they/them")); // callback with our pronouns
        });
    },

    /**
     * Calls back with the edit count of the given user
     *
     * @param {string} user Username to check
     * @param {function} callback callback(editCount)
     */
    "getUserEditCount" : (user, callback)=> {
        // Trying mediawiki api here rather than a jquery get
        new mw.Api().get({
            action: 'query',
            list: 'users',
            usprop: 'editcount',
            ususers: user
        }).then(r=>{
            callback(r.query.users[0].editcount); // edit count
        });
    },

    /**
     * Sends an email to the specified user
     *
     * @param {string} user Username to email
     * @param {string} content Email content
     * @method sendEmail
     * @extends rw.info
     */
    "sendEmail" : (user, content)=> {
        rw.ui.loadDialog.show("Sending email...");

        var params = {
            action: 'emailuser',
            target: user,
            subject: 'Email from RedWarn User '+ rw.info.getUsername(), // i.e. email from Ed6767
            text: content,
            ccme: true, // by defauly copy back to me
            format: 'json'
        },
        api = new mw.Api();
    
        api.postWithToken( 'csrf', params ).done( ( data ) => {
            console.log(data);
            if (data.errors == null || data.errors.length < 1) {
                // No errors, success!
                rw.ui.loadDialog.close();
                rw.ui.confirmDialog(`Email sent. A copy of your email has been sent to you.`,
                    "OKAY", ()=>{
                        dialogEngine.closeDialog();
                    },
                    "", ()=>{}, 0);
            } else {
                // Error may have occured - give them back the email bc we don't want to screw the user over
                rw.ui.loadDialog.close();
                rw.ui.confirmDialog(`<div style="overflow:auto">An error may have occured. Please check your inbox. If no email is sent to you soon, please try again.<br/>
                Here is the email you were trying to send:
                <pre>${content}</pre></div>
                `,
                    "OKAY", ()=>{
                        dialogEngine.closeDialog();
                    },
                    "", ()=>{}, 50);
            }
        } );
    },

    // CLASSES

    /**
     * RedWarn's "notify on change" feature, which watches for changes on a page, then notifies the user.
     * @class rw.info.changeWatch
     */
    "changeWatch" : {// Watches for changes on a page, always latest version and notifies
        /**
         * Defines whether or not the feature is activated.
         *
         * @property active
         * @type {boolean}
         * @extends rw.info.changeWatch
         */
        "active" : false,

        "timecheck" : "",
    
        /**
         * Defines the latest revsion ID of this page if feature is enabled
         *
         * @property latestRevID
         * @type {string}
         * @extends rw.info.changeWatch
         */
        "lastRevID": "",


        /**
         * Toggles this feature on/off
         * @method toggle
         * @extends rw.info.changeWatch
         */
        "toggle" : ()=> {
            if (!rw.info.changeWatch.active) {
                // We're not active, make UI changes
                // Request notification perms
                if (Notification.permission !== 'granted') Notification.requestPermission();

                $(".rwSpyIcon").css("color", "green");
                rw.topIcons.icons[rw.topIcons.icons.findIndex(i=>i.title == "Alert on Change")].colorModifier = "green";

                rw.visuals.toast.show("Alerts Enabled - please keep this tab open.");
                rw.info.changeWatch.active = true;

                // Get latest rev id
                $.getJSON(rw.wikiAPI + "?action=query&prop=revisions&titles="+ encodeURIComponent(mw.config.get("wgRelevantPageName")) +"&rvslots=*&rvprop=ids&formatversion=2&format=json", r=>{
                    // We got the response, set our ID
                    rw.info.changeWatch.lastRevID = r.query.pages[0].revisions[0].revid;
                    rw.info.changeWatch.timecheck = setInterval(()=>{ // Check for new revision every 5 seconds
                        $.getJSON(rw.wikiAPI + "?action=query&prop=revisions&titles="+ encodeURIComponent(mw.config.get("wgRelevantPageName")) +"&rvslots=*&rvprop=ids&formatversion=2&format=json", r2=>{
                            // Got response, compare
                            if (rw.info.changeWatch.lastRevID != r2.query.pages[0].revisions[0].revid) {
                                // New Revision! Redirect.
                                clearInterval(rw.info.changeWatch.timecheck); // clear updates
                                let latestRId = r2.query.pages[0].revisions[0].revid;
                                let parentRId = r2.query.pages[0].revisions[0].parentid;

                                if (windowFocused) {
                                    // Redirect and don't do anything else
                                    redirect(rw.wikiIndex + "?title="+ encodeURIComponent(mw.config.get("wgRelevantPageName")) +"&diff="+ latestRId +"&oldid="+ parentRId +"&diffmode=source#watchLatestRedirect");
                                } else {
                                    // Push notification
                                    document.title = "**New Edit!** " + document.title; // Add alert to title
                                    if (Notification.permission !== 'granted') {
                                        Notification.requestPermission();
                                    } else {
                                        let notification = new Notification('New Change to ' + mw.config.get("wgRelevantPageName"), {
                                            icon: 'https://upload.wikimedia.org/wikipedia/commons/6/63/Wikipedia-logo.png',
                                            body: 'Click here to view',
                                        });
                                        notification.onclick = function() {
                                            window.focus(); // When focused, we'll redirect anyways
                                            this.close(); // focus our tab and close notif
                                        };

                                        window.onfocus = function(){
                                            // Redirect on focus
                                            redirect(rw.wikiIndex + "?title="+ encodeURIComponent(mw.config.get("wgRelevantPageName")) +"&diff="+ latestRId +"&oldid="+ parentRId +"&diffmode=source#watchLatestRedirect");
                                        };
                                    }
                                } 
                            }
                        });
                    }, 5000);
                });
            } else {
                clearInterval(rw.info.changeWatch.timecheck); // clear updates

                $(".rwSpyIcon").css("color", ""); // clear colour from icon
                rw.topIcons.icons[rw.topIcons.icons.findIndex(i=>i.title == "Alert on Change")].colorModifier = null;

                rw.visuals.toast.show("Alerts Disabled.");
                rw.info.changeWatch.active = false;
            }
        }
    }
};
// rw-source: rollback.js
rw.rollback = { // Rollback features - this is where the business happens, people!
    "clickHandlers" : {}, // set in code
    
    "icons" : [ // rev14, icon IDs and everything for current rollback - from left to right - usually loaded from config
        // WARNING: CHANGING ORDER WILL MESS UP CONFIGS.
        // DEFAULT ENABLED ICONS
        {
            "enabled": true, // true is a default rollback icon, false can be added via preferences
            "name" : "Quick rollback vandalism",
            "color" : "red", // css colour
            "icon" : "delete_forever",
            "actionType" : "rollback",
            "promptReason" : false, // add extra info? false = quick rollback, otherwise not
            "summary" : "[[WP:VANDAL|Vandalism]]", // Set summary
            "ruleIndex" : 0 // used for autowarn
        },

        {
            "enabled": true, // true is a default rollback icon, false can be added via preferences
            "name" : "Quick rollback unexplained content removal",
            "color" : "orange", // css colour
            "icon" : "format_indent_increase",
            "actionType" : "rollback",
            "promptReason" : false, // add extra info?
            "summary" : "[[WP:CRV|Unexplained content removal]]", // Set summary
            "ruleIndex" : 3 // used for autowarn
        },

        {
            "enabled": true, // true is a default rollback icon, false can be added via preferences
            "name" : "Quick rollback non-constructive edit",
            "color" : "gold", // css colour
            "icon" : "work_outline",
            "actionType" : "rollback",
            "promptReason" : false, // add extra info?
            "summary" : "non-constructive" // Set summary
        },

        {
            "enabled": true, // true is a default rollback icon, false can be added via preferences
            "name" : "Rollback",
            "color" : "blue", // css colour
            "icon" : "replay",
            "actionType" : "rollback",
            "promptReason" : true, // add extra info?
            "summary" : "" // Set summary
        },

        {
            "enabled": true, // true is a default rollback icon, false can be added via preferences
            "name" : "Assume Good Faith and Rollback",
            "color" : "green", // css colour
            "icon" : "thumb_up",
            "actionType" : "rollback",
            "promptReason" : true, // add extra info?
            "summary" : "Reverting [[WP:AGF|good faith]] edits" // Set summary
        },

        {
            "enabled": true, // true is a default rollback icon, false can be added via preferences
            "name" : "Preview Rollback",
            "color" : "black", // css colour
            "icon" : "compare_arrows",
            "actionType" : "func",
            "action" : ()=>rw.rollback.preview() // Callback
        },

        {
            "enabled": true, // true is a default rollback icon, false can be added via preferences
            "name" : "Quick Template",
            "color" : "black", // css colour
            "icon" : "library_add",
            "actionType" : "func",
            "action" : ()=>rw.rollback.welcomeRevUsr() // Callback
        },

        {
            "enabled": true, // true is a default rollback icon, false can be added via preferences
            "name" : "More Options",
            "color" : "black", // css colour
            "icon" : "more_vert",
            "actionType" : "func",
            "action" : ()=>rw.ui.openExtendedOptionsDialog() // Callback
        },

        // END DEFAULT ENABLED ICONS
        // DEFAULT DISABLED ICONS

        // RED
        {
            "enabled": false, // true is a default rollback icon, false can be added via preferences
            "name" : "Quick rollback 3RR",
            "color" : "red", // css colour
            "icon" : "filter_3",
            "actionType" : "rollback",
            "promptReason" : false, // add extra info?
            "summary" : "[[WP:3RR]]", // Set summary
            "ruleIndex" : 84 // used for autowarn
        },

        {
            "enabled": false, // true is a default rollback icon, false can be added via preferences
            "name" : "Quick rollback personal attacks towards another editor",
            "color" : "red", // css colour
            "icon" : "offline_bolt",
            "actionType" : "rollback",
            "promptReason" : false, // add extra info?
            "summary" : "Personal attack towards another editor ([[WP:NPA]])", // Set summary
            "ruleIndex" : 22 // used for autowarn
        },

        {
            "enabled": false, // true is a default rollback icon, false can be added via preferences
            "name" : "Quick rollback copyright violation",
            "color" : "red", // css colour
            "icon" : "copyright",
            "actionType" : "rollback",
            "promptReason" : false, // add extra info?
            "summary" : "Likely [[WP:COPYVIO|copyright violation]]", // Set summary
            "ruleIndex" : 79 // used for autowarn
        },

        {
            "enabled": false, // true is a default rollback icon, false can be added via preferences
            "name" : "Quick rollback BLP violation",
            "color" : "red", // css colour
            "icon" : "face",
            "actionType" : "rollback",
            "promptReason" : false, // add extra info?
            "summary" : "Fails [[WP:BLP]]", // Set summary
            "ruleIndex" : 5 // used for autowarn
        },

        {
            "enabled": false, // true is a default rollback icon, false can be added via preferences
            "name" : "Quick rollback advertising/promotional",
            "color" : "red", // css colour
            "icon" : "monetization_on",
            "actionType" : "rollback",
            "promptReason" : false, // add extra info?
            "summary" : "Using Wikipedia for [[WP:NOTADVERTISING|advertising and/or promotion]] is not permitted.", // Set summary
            "ruleIndex" : 16 // used for autowarn
        },

        {
            "enabled": false, // true is a default rollback icon, false can be added via preferences
            "name" : "Quick rollback unnecessary or inappropriate external links",
            "color" : "red", // css colour
            "icon" : "link_off",
            "actionType" : "rollback",
            "promptReason" : false, // add extra info?
            "summary" : "Addition of unnecessary/inappropriate [[WP:EL|external links]]", // Set summary
            "ruleIndex" : 19 // used for autowarn
        },

        // ORANGE
        {
            "enabled": false, // true is a default rollback icon, false can be added via preferences
            "name" : "Quick rollback no reliable source",
            "color" : "orange", // css colour
            "icon" : "history_edu",
            "actionType" : "rollback",
            "promptReason" : false, // add extra info?
            "summary" : "[[WP:RS|Not providing a reliable source]]", // Set summary
            "ruleIndex" : 15 // used for autowarn
        },

        {
            "enabled": false, // true is a default rollback icon, false can be added via preferences
            "name" : "Quick rollback disruptive editing",
            "color" : "orange", // css colour
            "icon" : "error",
            "actionType" : "rollback",
            "promptReason" : false, // add extra info?
            "summary" : "Disruptive editing", // Set summary
            "ruleIndex" : 1 // used for autowarn
        },

        {
            "enabled": false, // true is a default rollback icon, false can be added via preferences
            "name" : "Quick rollback factual errors",
            "color" : "orange", // css colour
            "icon" : "menu_book",
            "actionType" : "rollback",
            "promptReason" : false, // add extra info?
            "summary" : "likely [[WP:PROVEIT|factual errors]]", // Set summary
            "ruleIndex" : 7 // used for autowarn
        },

        {
            "enabled": false, // true is a default rollback icon, false can be added via preferences
            "name" : "Quick rollback joke edit",
            "color" : "orange", // css colour
            "icon" : "child_care",
            "actionType" : "rollback",
            "promptReason" : false, // add extra info?
            "summary" : "Joke edit", // Set summary
            "ruleIndex" : 10 // used for autowarn
        },

        {
            "enabled": false, // true is a default rollback icon, false can be added via preferences
            "name" : "Quick rollback NPOV issues",
            "color" : "orange", // css colour
            "icon" : "campaign",
            "actionType" : "rollback",
            "promptReason" : false, // add extra info?
            "summary" : "per [[WP:NPOV]]", // Set summary
            "ruleIndex" : 17 // used for autowarn
        },

        {
            "enabled": false, // true is a default rollback icon, false can be added via preferences
            "name" : "Quick rollback talk in article",
            "color" : "orange", // css colour
            "icon" : "announcement",
            "actionType" : "rollback",
            "promptReason" : false, // add extra info?
            "summary" : "Please use the article [[WP:TPHELP|talk page]] or [[WP:FIXIT|be bold]] and fix the problem", // Set summary
            "ruleIndex" : 66 // used for autowarn
        },

        // BLUE
        {
            "enabled": false, // true is a default rollback icon, false can be added via preferences
            "name" : "Quick rollback manual of style issues",
            "color" : "blue", // css colour
            "icon" : "brush",
            "actionType" : "rollback",
            "promptReason" : false, // add extra info?
            "summary" : "[[WP:MOS|Manual of Style]] issues", // Set summary
            "ruleIndex" : 31 // used for autowarn
        },

        {
            "enabled": false, // true is a default rollback icon, false can be added via preferences
            "name" : "Quick rollback test edits",
            "color" : "blue", // css colour
            "icon" : "build",
            "actionType" : "rollback",
            "promptReason" : false, // add extra info?
            "summary" : "[[WP:SANDBOX|test edits]]", // Set summary
            "ruleIndex" : 2 // used for autowarn
        }
    ],

    "loadIcons" : () => { // Adds icons to a diff page - see rw.rollback.icons to set defaults here.
        // Check if page is editable, if not, don't show
        if (!mw.config.get("wgIsProbablyEditable")) {
           // Can't edit, so exit
           return; 
        }

        // else, continue :)

        let isLatest = $("#mw-diff-ntitle1").text().includes("Latest revision"); // is this the latest revision diff page?
        let isLeftLatest = $("#mw-diff-otitle1").text().includes("Latest revision"); // is the left side the latest revision? (rev13 bug fix)

        let currentRevIcons = "";

        // Load Rollback current rev icons (rev14)
        rw.rollback.icons.forEach((icon,i) => {
            let elID = "rwRollback_" + i; // generate an ID for the new icons

            // Establish element with all the info
            if (icon.enabled) currentRevIcons += `
            <div id="${elID}" class="icon material-icons">
                <span style="cursor: pointer;
                            font-size:28px;
                            padding-right:5px;
                            color:${icon.color};"
                onclick="rw.rollback.clickHandlers.${elID}();">
                    ${icon.icon}
                </span>
            </div>
            <div class="mdl-tooltip mdl-tooltip--large" for="${elID}">
                ${icon.name} 
            </div>
            `;

            // Add click handler
            let clickHandler = ()=>{};

            if (icon.actionType == "func") {
                // Function callback
                clickHandler = icon.action;
            } else if (icon.actionType == "rollback") {
                // Rollback on click
                if (!icon.promptReason) {
                    // quick rollback
                    clickHandler = ()=>rw.rollback.apply(icon.summary, null, icon.ruleIndex); // if icon.ruleIndex is undef it'll be ignored anyway
                } else {
                    // Ask for a reason
                    clickHandler = ()=>rw.rollback.promptRollbackReason(icon.summary);
                }
            }

            // Now add the handler to the handlers object (because the elements aren't on page yet)
            rw.rollback.clickHandlers[elID] = clickHandler; // we done
        });

        // Finally, wrap and add more info
        currentRevIcons = eval(rw_includes["rollbackCurrentRevFormatting.html"]); // see HTML file

        // RESTORE THIS VERSION ICONS. DO NOT FORGET TO CHANGE BOTH FOR LEFT AND RIGHT

        let twinkleLoadedBeforeUs = $('div[id^="tw-revert"]').length;

        // On left side
        // DO NOT FORGET TO CHANGE BOTH!!
        let left = isLeftLatest ? currentRevIcons : `
        <div id="rOld1" class="icon material-icons"><span style="cursor: pointer; font-size:28px; padding-right:5px; color:purple;"
            onclick="rw.rollback.promptRestoreReason($('#mw-diff-otitle1 > strong > a').attr('href').split('&')[1].split('=')[1]);"> <!-- the revID on left -->
                history
            </span>
        </div>
        <div class="mdl-tooltip mdl-tooltip--large" for="rOld1">
            Restore this version
        </div>
        `;
        if (twinkleLoadedBeforeUs) {
            $('.diff-otitle > div[id^="tw-revert"]').after(left);
        } else {
            $('.diff-otitle').prepend(left); 
        }

        // On the right side
        let right = isLatest ? currentRevIcons : `
        <div id="rOld2" class="icon material-icons"><span style="cursor: pointer; font-size:28px; padding-right:5px; color:purple;"
            onclick="rw.rollback.promptRestoreReason($('#mw-diff-ntitle1 > strong > a').attr('href').split('&')[1].split('=')[1]);"> <!-- the revID on right -->
                history
            </span>
        </div>
        <div class="mdl-tooltip mdl-tooltip--large" for="rOld2">
            Restore this version
        </div>
        `; // if the latest rev, show the accurate revs, else, don't 
        if (twinkleLoadedBeforeUs) {
            $('.diff-ntitle > div[id^="tw-revert"]').after(right);
        } else {
            $('.diff-ntitle').prepend(right); 
        }
        
        setTimeout(()=>{
            // Register all tooltips after 50ms (just some processing time)
            for (let item of document.getElementsByClassName("mdl-tooltip")) {
                rw.visuals.register(item); 
            } 

            // Register progressbar
            rw.visuals.register($("#rwRollbackInProgressBar")[0]);
        },100);
    },

    "getDisabledHTMLandHandlers" : ()=>{
        // Open a new dialog with all the disabled icons so user can select one. Click handlers are already registered, so we just call rw.rollback.clickHandlers.[elID]();
        // Load Rollback current rev icons (rev14)
        let finalIconStr = "";
        rw.rollback.icons.forEach((icon,i) => {
            if (icon.enabled) return; // if icon is enabled, we can skip
            if (icon.name == "More Options") return; // does nothing here, so not needed

            let elID = "rwRollback_" + i; // get the ID for the new icons

            // Establish element with all the info
            finalIconStr += `
            <div class="mdl-button mdl-js-button" style="width:100%; text-align: left;" onclick="window.parent.postMessage('rwRollbackBtn${elID}', '*');">
                <span class="material-icons" style="padding-right:20px;color:${icon.color};">${icon.icon}</span>
                <span ${(icon.name.length > 40 ? `style="font-size: 12px;"` : "")}>${icon.name}</span><!-- shrink if over a certain size so it doesn't overflow -->
            </div>
            <hr style="margin:0"/>
            `;

            // Add click event handler
            addMessageHandler("rwRollbackBtn"+ elID, ()=>{
                dialogEngine.closeDialog(()=>{// close dialog, then
                    rw.rollback.clickHandlers[elID](); // send our callback
                });
            });
        });
        
        // Now return HTML (rw16)
        return finalIconStr;
    },

    "getRollbackrevID" : ()=>{ // Get the revision ID of what we want to rollback
        let isNLatest = $("#mw-diff-ntitle1").text().includes("Latest revision");
        let isOLatest = $("#mw-diff-otitle1").text().includes("Latest revision"); 
        if (isNLatest) {
            // Return the revID of the edit on the right
            return $('#mw-diff-ntitle1 > strong > a').attr('href').split('&')[1].split('=')[1];
        } else if (isOLatest) {
            return $('#mw-diff-otitle1 > strong > a').attr('href').split('&')[1].split('=')[1];
        } else {
            // BUG!
            rw.ui.confirmDialog("A very weird error occured. (rollback getRollbackRevID failed via final else!)",
            "REPORT BUG", ()=>rw.ui.reportBug("rollback getRollbackRevID failed via final else! related URL: "+ window.location.href) ,
            "", ()=>{}, 0);
        }
    },

    "preview" : () => { // Redirect to the preview of the rollback in a new tab (compare page)
        rw.ui.loadDialog.show("Loading preview...");
        // Check if latest, else redirect
        rw.info.isLatestRevision(mw.config.get("wgRelevantPageName"), rw.rollback.getRollbackrevID(), un=>{
            // Fetch latest revision not by user
            rw.info.latestRevisionNotByUser(mw.config.get("wgRelevantPageName"), un, (content, summary, rID) => {
                // Got it! Now open preview dialog
               
                // Add handler for when page loaded
                let url = rw.wikiIndex + "?title="+ mw.config.get("wgRelevantPageName") +"&diff="+ rID +"&oldid="+ mw.util.getParamValue("diff") +"&diffmode=source#rollbackPreview";
                redirect(url); // goto in current tab
            });
        });
    },

    "apply" : (reason, callback, defaultWarnIndex)=> { // if callback set, no UW prompt will be shown, but a callback instead
        
        // Now do
        // bug fix rev10, get revid from html
        // added rev13 if has rollback perms and set to use in settings, use that - prompt first time
        
        // Show progress bar
        $("#rwCurrentRevRollbackBtns").hide();
        $("#rwRollbackInProgress").show();

        // Set progress status to buffer 25
        rw.rollback.progressBar(0);

        rw.info.isLatestRevision(mw.config.get("wgRelevantPageName"), rw.rollback.getRollbackrevID(), (un, crID)=>{
            // Set progress bar status
            // Set handlers for each method
            let pseudoRollbackCallback = ()=>{ // pseudoRollback 
                // Set progress
                rw.rollback.progressBar(25);
                // Fetch latest revision not by user
                rw.info.latestRevisionNotByUser(mw.config.get("wgRelevantPageName"), un, (content, summary, rID, pID) => {
                    rw.rollback.progressBar(70, 70);
                    // Verify that pID is NOT the thing rev we want to rollback, else it's been overwritten
                    if (pID == rw.rollback.getRollbackrevID()) {
                        // looks like that there is a newer revision! redirect to it.
                        rw.info.isLatestRevision(mw.config.get("wgRelevantPageName"), 0, ()=>{});
                        return; // stop here.
                    }
                    
                    // Got it! Now set page content to summary
                    // Push UNDO using CSRF token
                    $.post(rw.wikiAPI, {
                        "action": "edit",
                        "format": "json",
                        "token" : mw.user.tokens.get("csrfToken"),
                        "title" : mw.config.get("wgRelevantPageName"),
                        "summary" : summary + ": " + reason + " [[w:en:WP:RW|(RW "+ rw.version +")]]", // summary sign here
                        "undo": crID, // current
                        "undoafter": rID, // restore version
                        "tags" : ((rw.wikiID == "enwiki") ? "RedWarn" : null) // Only add tags if on english wikipedia
                    }).done(dt => {
                        // We done. Check for errors, then callback appropriately
                        if (!dt.edit) {
                            // Error occured or other issue
                            console.error(dt);
                            // Show rollback icons again (todo)
                            $("#rwCurrentRevRollbackBtns").show();
                            $("#rwRollbackInProgress").hide();

                            rw.visuals.toast.show("Sorry, there was an error, likely an edit conflict. Your rollback has not been applied.");
                        } else {
                            // Success!
                            
                            // Hide progressbar (todo)
                            rw.rollback.progressBar(100);


                            // Wait a bit (100ms) to stop loadDialog glitch
                            setTimeout(()=>{
                                // If callback set, call it and exit, else continue
                                if (callback != null) {callback(); return;}

                                // Now show the done icons
                                rw.rollback.showRollbackDoneOps(un, defaultWarnIndex);
                            }, 100); // done!
                        }
                    });
                });
            };
            
            let rollbackCallback = ()=>{ // using rollback API
                rw.rollback.progressBar(70, 70); // progress
                // PUSH ROLLBACK
                $.post(rw.wikiAPI, {
                        "action": "rollback",
                        "format": "json",
                        "token" : rw.info.rollbackToken,
                        "title" : mw.config.get("wgRelevantPageName"),
                        "summary" : "Rollback edit(s) by [[Special:Contributions/"+ un +"|"+ un +"]] ([[User_talk:"+ un +"|talk]]): " + reason + " [[w:en:WP:RW|(RW "+ rw.version +")]]", // summary sign here
                        "user": un, // rollback user
                        "tags" : ((rw.wikiID == "enwiki") ? "RedWarn" : null) // Only add tags if on english wikipedia
                    }).done(dt => {
                        // THESE CALLBACKS ARE NO INTERCHANGABLE!
                        // We done. Check for errors, then callback appropriately
                        if (!dt.rollback) {
                            // Error occured or other issue
                            console.error(dt);
                            // Show rollback icons again
                            $("#rwCurrentRevRollbackBtns").show();
                            $("#rwRollbackInProgress").hide();
                            rw.visuals.toast.show("Sorry, there was an error, likely an edit conflict. Your rollback has not been applied.");
                        } else {
                            // Success!
                            
                            rw.rollback.progressBar(100); // progress

                            // Wait a bit (100ms) to stop loadDialog glitch
                            setTimeout(()=>{
                                // If callback set, call it and exit, else continue
                                if (callback != null) {callback(); return;}

                                // Now show the done icons
                                rw.rollback.showRollbackDoneOps(un, defaultWarnIndex);
                            }, 100); // done!
                        }
                    });
            };

            // Check config for rollback perms
            rw.info.featureRestrictPermissionLevel("rollbacker", ()=>{
                // Check if config is set or not
                if (rw.config.rollbackMethod == null) {
                    rw.ui.confirmDialog(`
                    You have rollback permissions!
                    Would you like to use the faster rollback API in future or continue using a rollback-like setting?
                    You can change this in your preferences at any time.`,
                    "USE ROLLBACK", ()=>{
                        dialogEngine.closeDialog();
                        rw.config.rollbackMethod = "rollback";
                        rw.info.writeConfig(true, ()=>rollbackCallback()); // save config and callback
                    },
                    "KEEP USING ROLLBACK-LIKE",()=>{
                        dialogEngine.closeDialog();
                        rw.config.rollbackMethod = "pseudoRollback";
                        rw.info.writeConfig(true, ()=>pseudoRollbackCallback()); // save config and callback
                    },45);
                } else {
                    // Config set, complete callback - remember, this is feature restricted so we won't get here without RB perms
                    if (rw.config.rollbackMethod == "rollback") { // Rollback selected
                        rollbackCallback(); // Do rollback
                    } else {
                        pseudoRollbackCallback(); // rollback-like
                    }
                }
            }, ()=>pseudoRollbackCallback()); // if no perms follow pseudo rollback
        });
    },

    "restore" : (revID, reason) => {
        // Restore revision by ID
        rw.ui.loadDialog.show("Restoring...");
        // Ask API for latest revision
        $.getJSON(rw.wikiAPI + "?action=query&prop=revisions&titles="+ encodeURIComponent(mw.config.get("wgRelevantPageName")) +"&rvslots=*&rvprop=ids%7Cuser&formatversion=2&format=json", r=>{
            // We got the response
            let crID = r.query.pages[0].revisions[0].revid;
            // Ask API for the restore revision
            $.getJSON(rw.wikiAPI + "?action=query&prop=revisions&rvprop=user&rvstartid="+ revID +"&rvendid="+ revID +"&titles="+ encodeURI(mw.config.get("wgRelevantPageName")) +"&formatversion=2&rvslots=*&format=json", r=>{
                let revUsr = r.query.pages[0].revisions[0].user; // get user
                let summary = "Restoring revision "+ revID + " by " + revUsr; // gen our summary
                // Now we've got that, we just need to submit. the undo
                $.post(rw.wikiAPI, {
                        "action": "edit",
                        "format": "json",
                        "token" : mw.user.tokens.get("csrfToken"),
                        "title" : mw.config.get("wgRelevantPageName"),
                        "summary" : summary + (reason != null ? ": " + reason : "") + " [[w:en:WP:RW|(RW "+ rw.version +")]]", // summary sign here
                        "undo": crID, // current
                        "undoafter": revID, // restore version
                        "tags" : ((rw.wikiID == "enwiki") ? "RedWarn" : null) // Only add tags if on english wikipedia
                    }).done(dt => {
                        // Request done. Check for errors, then go to the latest revision
                        if (!dt.edit) {
                            // Error occured or other issue
                            console.error(dt);
                            rw.ui.loadDialog.close();
                            rw.visuals.toast.show("Sorry, there was an error, likely an edit conflict. This edit has not been restored.");
                        } else {
                            rw.info.isLatestRevision(mw.config.get('wgRelevantPageName'), 0, ()=>{}); // we done, go to the latest revision
                        }
                    });
            });
        });
    },

    "promptRollbackReason" : reason=> {
        rw.info.isLatestRevision(mw.config.get("wgRelevantPageName"), rw.rollback.getRollbackrevID(),un=>{ // validate is latest
            // Show dialog then rollback
            // Add submit handler

            addMessageHandler("reason`*", rs=>rw.rollback.apply(rs.split("`")[1])); // When reason recieved, submit rollback

            // CREATE DIALOG
            // MDL FULLY SUPPORTED HERE (container). 
            dialogEngine.create(mdlContainers.generateContainer(eval(rw_includes["rollbackReason.html"]), 500, 120)).showModal(); // 500x120 dialog, see rollbackReason.html for code
        });
    },

    "promptRestoreReason" : revID=> {
        // Prompt for reason to restore. very sim to rollback reason
        let reason = ""; // Needed for rollback reason page - do not remove

        // Add submit handler
        addMessageHandler("reason`*", rs=>rw.rollback.restore(revID, rs.split("`")[1])); // When reason recieved, submit rollback

        // CREATE DIALOG
        // MDL FULLY SUPPORTED HERE (container). 
        dialogEngine.create(mdlContainers.generateContainer(eval(rw_includes["rollbackReason.html"]), 500, 120)).showModal(); // 500x120 dialog, see rollbackReason.html for code
    },

    "welcomeRevUsr" :() => {
        // Send welcome to user who made most recent revision
        rw.visuals.toast.show("Please wait...", false, false, 1000);
        rw.info.isLatestRevision(mw.config.get("wgRelevantPageName"), rw.rollback.getRollbackrevID(), un=>{
            // We got the username, send the welcome
            rw.quickTemplate.openSelectPack(un);
        });
    },


    // CONTRIBS PAGE

    "contribsPageIcons" : ()=>{ // Adds rollback/restore links
        
        // For each (current) tag
        $("span.mw-uctop").each((i, el)=>{
            // Add rollback options (${i} inserts i at that point to ensure it is a unique ID)
            $(el).html(`current 
            <span id="rw-currentRev${i}" style="cursor:default"> <!-- Wrapper -->
                <span style="font-family:Roboto;font-weight:400;"> &nbsp; <!-- Styling container -->
                    <!-- Links -->
                    <a style="color:green;cursor:pointer;" id="rw-currentRevPrev${i}" onclick="rw.rollback.contribsPageRollbackPreview(${i});">prev</a> &nbsp;
                    <a style="color:red;cursor:pointer;" id="rw-currentRevRvv${i}" onclick="rw.rollback.contribsPageRollbackVandal(${i});">rvv</a> &nbsp;
                    <a style="color:blue;cursor:pointer;" id="rw-currentRevRb${i}" onclick="rw.rollback.contribsPageRollback(${i});">rb</a>

                    <!-- Tooltips -->
                    <div class="mdl-tooltip" data-mdl-for="rw-currentRevPrev${i}">
                        Preview Rollback
                    </div>
                    <div class="mdl-tooltip" data-mdl-for="rw-currentRevRvv${i}">
                        Quick rollback Vandalism
                    </div>
                    <div class="mdl-tooltip" data-mdl-for="rw-currentRevRb${i}">
                        Rollback
                    </div>
                </span>
            </span>
            `);
        });

        // Now register tooltips
        setTimeout(()=>{
            // Register all tooltips after 50ms (just some processing time)
            for (let item of document.getElementsByClassName("mdl-tooltip")) {
                rw.visuals.register(item); 
            } 
        },100);
    },

    "contribsPageRollbackPreview" : i=>{
        // Get revision ID
        let revID = $("#rw-currentRev"+ i).closest("li").attr("data-mw-revid");
        let pageName =  $("#rw-currentRev"+ i).closest("li").find("a.mw-changeslist-date").attr("title");
        console.log(revID);
        console.log(pageName);
        rw.ui.loadDialog.show("Loading preview...");
        // Now verify is still latest
        rw.info.isLatestRevision(pageName, revID, un=>{
            // Is latest revision! Let's continue
            // Fetch latest revision not by user
            rw.info.latestRevisionNotByUser(pageName, un, (content, summary, rID) => {
                // Assemble URL
                let url = rw.wikiIndex + "?title="+ pageName +"&diff="+ rID +"&oldid="+ revID +"&diffmode=source#rollbackPreview";
                redirect(url, true); // open URL in new tab
                rw.ui.loadDialog.close(); // close load dialog
            });
        }, ()=>{
            rw.ui.loadDialog.close(); // close load dialog
            // Isn't the latest revision, set note to match
            $("#rw-currentRev"+ i).html(
                `<span style="font-family:Roboto;color:red;">No longer the latest revision.</span>`
            );
        });
    },

    "contribsPageRollbackVandal" : i=>{
        // Get revision ID
        let revID = $("#rw-currentRev"+ i).closest("li").attr("data-mw-revid");
        let pageName =  $("#rw-currentRev"+ i).closest("li").find("a.mw-changeslist-date").attr("title");
        console.log(revID);
        console.log(pageName);
        
        $("#rw-currentRev"+ i).html(
            `<span style="font-family:Roboto;color:green;">reverting...</span>`
        );
        
        // Now verify is still latest
        rw.info.isLatestRevision(pageName, revID, un=>{
            // Is latest revision! Let's continue
            
            // Overwrite function and values used on diff pages as we aren't on a diff page
            rw.rollback.getRollbackrevID = ()=>{return revID;}; 
            mw.config.values.wgRelevantPageName = pageName;
            rw.rollback.apply("vandalism (from contribs page)", ()=>{ // apply the rollback
                // Rollback complete!
                $("#rw-currentRev"+ i).html(
                    `<span style="font-family:Roboto;color:green;">reverted!</span>`
                );
            }); 
        }, ()=>{
            // Isn't the latest revision, set note to match
            $("#rw-currentRev"+ i).html(
                `<span style="font-family:Roboto;color:red;">No longer the latest revision.</span>`
            );
        });
    },

    "contribsPageRollback" : i=>{
        // First, prompt for reason
        let reason = ""; // Needed for rollback reason page - do not remove

        // Add submit handler
        addMessageHandler("reason`*", rs=>{ // On submit
            let rollbackReason = rs.split("`")[1];
            // Get revision ID
            let revID = $("#rw-currentRev"+ i).closest("li").attr("data-mw-revid");
            let pageName =  $("#rw-currentRev"+ i).closest("li").find("a.mw-changeslist-date").attr("title");
            console.log(revID);
            console.log(pageName);
            
            $("#rw-currentRev"+ i).html(
                `<span style="font-family:Roboto;color:green;">reverting...</span>`
            );
            
            // Now verify is still latest
            rw.info.isLatestRevision(pageName, revID, un=>{
                // Is latest revision! Let's continue
                
                // Overwrite function and values used on diff pages as we aren't on a diff page
                rw.rollback.getRollbackrevID = ()=>{return revID;}; 
                mw.config.values.wgRelevantPageName = pageName;
                rw.rollback.apply(reason + " (from contribs page)", ()=>{ // apply the rollback
                    // Rollback complete!
                    $("#rw-currentRev"+ i).html(
                        `<span style="font-family:Roboto;color:green;">reverted!</span>`
                    );
                }); 
            }, ()=>{
                // Isn't the latest revision, set note to match
                $("#rw-currentRev"+ i).html(
                    `<span style="font-family:Roboto;color:red;">No longer the latest revision.</span>`
                );
            });
        });

        // CREATE DIALOG
        // MDL FULLY SUPPORTED HERE (container). 
        dialogEngine.create(mdlContainers.generateContainer(eval(rw_includes["rollbackReason.html"]), 500, 120)).showModal(); // 500x120 dialog, see rollbackReason.html for code   
    },

    "progressBar" : (progress, buffer) => {
        // Only if set and existing (bug)
        if ($("#rwRollbackInProgressBar").length < 1) return;
        
        // Update the progress bar
        $("#rwRollbackInProgressBar")[0].MaterialProgress.setProgress(progress);
        $("#rwRollbackInProgressBar")[0].MaterialProgress.setBuffer(buffer);
    },

    "showRollbackDoneOps" : (un, warnIndex) => {
        // Clear get hidden handler to stop errors in more options menu
        rw.rollback.getDisabledHTMLandHandlers = ()=>{return "";}; // return w empty string
        // Add click handlers 
        $("#RWRBDONEmrevPg").click(()=>rw.info.isLatestRevision(mw.config.get('wgRelevantPageName'), 0, ()=>{})); // go to latest revision
        $("#RWRBDONEnewUsrMsg").click(()=>rw.ui.newMsg(un)); // send message
        $("#RWRBDONEwelcomeUsr").click(()=>rw.quickTemplate.openSelectPack(un)); // quick template
        $("#RWRBDONEwarnUsr").click(()=>rw.ui.beginWarn(false, un, mw.config.get("wgRelevantPageName"), null, null, null, (warnIndex != null ? warnIndex : null))); // Warn User
        $("#RWRBDONEreportUsr").click(()=>rw.ui.adminReportSelector(un)); // report to admin

        // Now perform default (if set)
        if ((rw.config.rwRollbackDoneOption != null) || (rw.config.rwRollbackDoneOption != "none")) $(`#${rw.config.rwRollbackDoneOption}`).click();
        
        // Hides other icons and shows the rollback done options and also checks for defaults, also adds click handlers
        $("#rwRollbackInProgress").fadeOut(()=>{ // fade out - looks smoother
            $("#rwRollbackDoneIcons").fadeIn(); //show our icons
        }); 
    }
};

// rw-source: ui.js
/**
 * Most of RedWarn's UI elements and functions that require user input are here.
 * @class rw.ui
 */
// Most UI elements
// See also dialog.js (dialogEngine) and mdlContainer.js (mdlContainer)
rw.ui = {
    "revisionBrowser" : url=> {
        // Show new container for revision reviewing
        dialogEngine.create(mdlContainers.generateContainer(`
        <div id="close" class="icon material-icons" style="float:right;">
            <span style="cursor: pointer; padding-right:15px;" onclick="window.parent.postMessage('closeDialog');">
                clear
            </span>
        </div>
        <div class="mdl-tooltip" for="close">
            Close
        </div>
         <iframesrc="`+ url +`" frameborder="0" style="height:95%;"></iframe>
        `, window.innerWidth-70, window.innerHeight-50)).showModal();
    },

    "beginWarn" : (ignoreWarnings, un, pg, customCallback, callback, hideUserInfo, autoSelectReasonIndex)=> { // if customCallback = false, callback(templatestr) (rev12) autoSelectReasonIndex(rev13) for quick rollbacks for vandalism ext..
        // Give user a warning (show dialog)
        
        let autoLevelSelectEnable = (!hideUserInfo) && (rw.userIsNotEC == null) && (rw.config.rwautoLevelSelectDisable != "disable"); // If autolevelselect enabled (always disabled on hideUserInfo options), non-EC always disabled (rw16)

        // Let's continue

        // Assemble rule listbox
        let finalListBox = "<span>";
        let currentHeading = "";
        rw.rules.forEach((rule, i) => {
            // Check if category is different to current heading first
            if (rule.catagory != currentHeading) {
                // Now generate a new heading and section for search to hide
                finalListBox += `</span> <!-- close prior category -->
                <span class="rwNoticeCatagory"> <!-- used for search -->
                <div class="rwNoticeCatagoryHead" style="
                    text-align: center;
                    font-family: Roboto;
                    font-weight: 300;
                    width: 100%;
                    cursor: pointer;
                ">${rule.catagory}</div>`;

                // A new heading is needed
                currentHeading = rule.catagory; // set to ours for detection
            }

            // Add appropriate list format per config
            if (rw.config.rwNoticeListByTemplateName != "enable") {
                // Standard listing by rule description
                let style = "";
                if (rule.name.length > 62) {
                    // Too long to fit
                    style="font-size:14px";
                }
                finalListBox += `<li
                class="mdl-menu__item"
                data-val="`+ i +`"
                onmousedown="refreshLevels(`+i+`);"
                style="`+style +`">
                    ${rule.name} <!-- ${rule.template} (comment for search) -->
                </li>`; // add dataselected if = autoSelectReasonIndex & autoselect is enabled
            } else {
                // List by template name
                let style = "";
                if (rule.name.length > 62) {
                    // Too long to fit
                    style="font-size:14px"; // style here applies to span that will show on hover
                }
                finalListBox += `<li
                class="mdl-menu__item"
                data-val="`+ i +`"
                id="rwTemplateSelect${i}"
                onmousedown="refreshLevels(`+i+`);">
                    ${rule.template} <!-- ${rule.name} (comment for search) -->
                </li>
                <!-- Add script to change to reason on mouseover -->
                <script>$("#rwTemplateSelect${i}").mouseenter(()=>{
                    // Mouse has entered the box
                    $("#rwTemplateSelect${i}").html(\`<span style="${style}">${rule.name}</span>\`); // set to rule name
                });
                $("#rwTemplateSelect${i}").mouseleave(()=>{
                    // Mouse has entered the box
                    $("#rwTemplateSelect${i}").html(\`${rule.template} <!-- ${rule.name} (comment for search) -->\`); // set to default
                });
                </script>
                `; 
            }
        });
        finalListBox += `</span>`; // close final catagory

        // Setup preview handling
        addMessageHandler("generatePreview`*", m=>{
            rw.info.parseWikitext(m.split("`")[1], parsed=>{ // Split to Wikitext and send over to the API to be handled
                dialogEngine.dialog.getElementsByTagName("iframe")[0].contentWindow.postMessage({
                    "action": "parseWikiTxt",
                    "result": parsed}, '*'); // push to container for handling in dialog and add https:// to stop image breaking
            });
        });

        // Add toast handler
        addMessageHandler("pushToast`*", m=>rw.visuals.toast.show(m.split('`')[1],false,false, 5000));

        // Add admin report handler
        addMessageHandler("adminR", ()=>rw.ui.adminReportSelector(un));

        // Add recent page handelr
        addMessageHandler("openRecentPageSelector", ()=>rw.ui.recentlyVisitedSelector.showDialog(p=>{
            // Send page back to container
            dialogEngine.dialog.getElementsByTagName("iframe")[0].contentWindow.postMessage({
                "action": "recentPage",
                "result": p.replace(/_/g, ' ')}, '*');
        }));

        // Add submit handler

        addMessageHandler("applyNotice`*", eD=> {
            // i.e applyNotice`user`wikitext`summary
            // TODO: maybe b64 encode?
            let _eD = eD.split("`"); // params
            let user = _eD[1];
            let wikiTxt = _eD[2];
            let rule = _eD[3];
            let template = _eD[4].split("|")[0];
            let warningLevel = "N/A";

            if ((customCallback == null) || (customCallback == false)) { // if not set
                // Map warning level
                (['1', '2', '3', '4', '4im']).forEach(e=>{
                    if (template.includes(e)) warningLevel = e; // if includes this level, add
                });

                console.log({user, wikiTxt, rule, template, warningLevel}); // debug

                // MAKE EDIT - summary with warning info
                let summary = `${
                    ({  
                        "N/A" : "Notice:",
                        "1" : "Note:",
                        "2" : "Caution:",
                        "3" : "Warning:",
                        "4" : "Final Warning:",
                        "4im": "ONLY Warning:"
                    })[warningLevel]
                } ${rule}`;

                // MAKE EDIT
                rw.info.addWikiTextToUserPage(user, wikiTxt, true, summary);
            } else {
                // Send callback
                callback(wikiTxt);
            }
        });

        // Check most recent warning level

        rw.info.lastWarningLevel(rw.info.targetUsername(un), (w, usrPgMonth, userPg)=>{
            let lastWarning = [ // Return HTML for last warning level.
                // NO PAST WARNING
                `
                <span class="material-icons" id="PastWarning" style="cursor:help;position: relative;top: 5px;padding-left: 10px;color:green;">thumb_up</span>
                <div class="mdl-tooltip mdl-tooltip--large" for="PastWarning">
                    <span style="font-size:x-small;">
                    No notices this month.
                    </span>
                </div>
                `,

                // NOTICE
                `
                <span class="material-icons" id="PastWarning" style="cursor:help;position: relative;top: 5px;padding-left: 10px;color:blue;">info</span>
                <div class="mdl-tooltip mdl-tooltip--large" for="PastWarning">
                    <span style="font-size:x-small;">
                    Has been given a Level 1 notice this month.
                    </span>
                </div>
                `,
                // CAUTION
                `
                <span class="material-icons" id="PastWarning" style="cursor:help;position: relative;top: 5px;padding-left: 10px;color:orange;">announcement</span>
                <div class="mdl-tooltip mdl-tooltip--large" for="PastWarning">
                    <span style="font-size:x-small;">
                    Has been given a Level 2 caution this month.
                    </span>
                </div>
                `,
                // Warning- in red. RedWarn, get it? This is the peak of programming humour.
                `
                <span class="material-icons" id="PastWarning" style="cursor:help;position: relative;top: 5px;padding-left: 10px; color:red;">report_problem</span>
                <div class="mdl-tooltip mdl-tooltip--large" for="PastWarning">
                    <span style="font-size:x-small;">
                    Has been given a Level 3 warning this month.
                    </span>
                </div>
                `,

                // Final/Only Warning (dark red)
                `
                <span class="material-icons" id="PastWarning" style="cursor:pointer;position: relative;top: 5px;padding-left: 10px;color:#a20000;" onclick="window.parent.postMessage('adminR');">report</span>
                <div class="mdl-tooltip mdl-tooltip--large" for="PastWarning">
                    <span style="font-size:x-small;">
                    Has been given a Level 4 Final or ONLY warning.<br/>
                    Click here to report to admins for vandalism. Review user page first.
                    </span>
                </div>
                `
            ][w];

            // CREATE DIALOG
            // MDL FULLY SUPPORTED HERE (container). 
            dialogEngine.create(mdlContainers.generateContainer(eval(rw_includes["warnUserDialog.html"]), 500, 630)).showModal(); // 500x630 dialog, see warnUserDialog.html for code
        });
            
    }, // end beginWarn

    /**
     * Open the "new talk page message" dialog for the specified username
     *
     * @param {string} un Target username
     * @param {boolean} noRedirect If true, a callback will be used rather than submitting the notice.
     * @param {string} buttonTxt Text to use instead of default "Send Message" for submit button
     * @param {function} callback Callback to use if noRedirect is true
     * @method newMessage
     * @extends rw.ui
     */
    "newMsg" : (un, noRedirect, buttonTxt, callback)=>{
        // New message dialog
        // Setup preview handling
        addMessageHandler("generatePreview`*", m=>{
            rw.info.parseWikitext(m.split("`")[1], parsed=>{ // Split to Wikitext and send over to the API to be handled
                dialogEngine.dialog.getElementsByTagName("iframe")[0].contentWindow.postMessage({
                    "action": "parseWikiTxt",
                    "result": parsed}, '*'); // push to container for handling in dialog and add https:// to stop image breaking
            });
        });

        // Add toast handler
        addMessageHandler("pushToast`*", m=>rw.visuals.toast.show(m.split('`')[1],false,false,15000));

        // Add submit handler

        addMessageHandler("applyNotice`*", eD=> {
            // i.e applyNotice`user`wikitext`summary
            // TODO: maybe b64 encode?
            let _eD = eD.split("`"); // params
            let user = _eD[1];
            let wikiTxt = _eD[2];
            let summary = _eD[3];
            if (noRedirect) { // If no redirect, callback
                callback(wikiTxt);
            } else {
                // MAKE EDIT
                rw.info.addWikiTextToUserPage(user, wikiTxt, false, summary); // This requires title.
            }
        });

        // CREATE DIALOG
        // MDL FULLY SUPPORTED HERE (container). 
        dialogEngine.create(mdlContainers.generateContainer(eval(rw_includes["newMsg.html"]), 500, 390)).showModal(); // 500x390 dialog, see newMsg.html for code
    },


    /**
     * Registers the right-click context menu feature for user links.
     *
     * @method registerContextMenu
     * @extends rw.ui
     */
    "registerContextMenu" : () => { // Register context menus for right-click actions
        // More docs at https://swisnl.github.io/jQuery-contextMenu/demo/trigger-custom.html

        // USER TALK ACTIONS - check if not disabled then continue
        if (rw.config.rwDisableRightClickUser != "disable") $(()=>{
            // REV15 - only trigger on shift+right-click unless if set in settings - If config is set to "Opt2", to open on right-click set in preferences, set below in trigger
            if (rw.config.rwDisableRightClickUser != "Opt2") {
                $('a[href*="/wiki/User_talk:"], a[href*="/wiki/User:"], a[href*="/wiki/Special:Contributions/"]').on('contextmenu', e=>{
                
                    // if shift key not down, don't show the context menu. 
                    if (!e.shiftKey) return; 
                    e.preventDefault();
                    $(e.currentTarget).contextMenu();
                });
            }
            
            $.contextMenu({
                trigger: (rw.config.rwDisableRightClickUser == "Opt2" ? undefined : 'none'), // if set in options, activate as usual
                selector: 'a[href*="/wiki/User_talk:"], a[href*="/wiki/User:"], a[href*="/wiki/Special:Contributions/"]', // Select all appropriate user links
                callback: (act, info)=>{
                    // CALLBACK
                    let hrefOfSelection = $(info.$trigger[0]).attr("href"); // href of userpage or contribs
                    let targetUsername = "";
                    if (hrefOfSelection.includes("/wiki/User_talk:") || hrefOfSelection.includes("/wiki/User:")) {
                        // This is easy because w should just be ablt to spit at last :
                        // We run a regex (rev8 ipv6 fix)
                        /*
                            Find "User_talk"
                            OR "User"
                            Then ":"
                            Or "/"
                            Anything but "/"
                            OR line break
                        */
                        let matches = (hrefOfSelection + "\n").match(/(?:(?:(?:User_talk))|(?:(?:User)(?:\:))|(?:(?:\/)(?:[^\/]*)(?:(?:\n)|(?:\r\n))))/g);
                        // result /User_talk:user, so we removed everything up to the first colon
                        let unURL = matches[0];
                        targetUsername = unURL.replace(unURL.match(/(?:[^\:]*)(?:\:)/g)[0], ""); // Regex first group of colon and remove
                    } else {
                        // Contribs link, go split at last slash
                        targetUsername = (a=>{return a[a.length - 1]})(hrefOfSelection.split("/"));
                    }
                    
                    // Do the action for each action now.
                    ({
                        "usrPg" : un=>redirect(rw.wikiBase+"/wiki/User:"+ un, true),  // Open user page in new tab

                        "tlkPg" : un=>redirect(rw.wikiBase+"/wiki/User_talk:"+ un, true),  // Open talk page in new tab

                        "contribs" : un=>redirect(rw.wikiBase+"/wiki/Special:Contributions/"+ un, true),  // Redirect to contribs page in new tab

                        "accInfo" : un=>redirect(rw.wikiBase+"/wiki/Special:CentralAuth?target="+ un, true),  // Redirect to Special:CentralAuth page in new tab

                        "sendMsg" : un=>rw.ui.newMsg(un), // show new msg dialog

                        "quickWel" : un=>rw.quickTemplate.openSelectPack(un), // Submit Quick Template

                        "newNotice" : un=>rw.ui.beginWarn(false, un), // show new warning dialog

                        "adminReport" : un=>rw.ui.adminReportSelector(un),

                        "usrPronouns": un=>{ // Show a tost with this users prefered pronouns
                            rw.info.getUserPronouns(un, p=>{
                                rw.visuals.toast.show(un + "'s pronouns are "+ p, false, false, 3000);
                            });
                        },

                        "usrEditCount": un=>{ // Show a tost with this users prefered pronouns
                            rw.info.getUserEditCount(un, count=>{
                                if (count == null) count = "an unknown number of"; // stop undefined message 
                                rw.visuals.toast.show(un + " has made "+ count + " edits.", false, false, 3000);
                            });
                        },

                        "usrStanding": un=>{
                            // Show toast with last warning level
                            rw.info.lastWarningLevel(un, level=>{
                                rw.visuals.toast.show(un + " has recieved "+ [
                                    "no warnings",
                                    "a level 1 notice",
                                    "a level 2 caution",
                                    "a level 3 warning",
                                    "a level 4 final or ONLY warning"
                                ][level] + " this month.", false, false, 4000);
                            });
                        },

                        "filterLog": un=>redirect("https://en.wikipedia.org/w/index.php?title=Special:AbuseLog&wpSearchUser="+ un, true),  // Redirect to filter log page in new tab

                        "blockLog": un=>redirect("https://en.wikipedia.org/w/index.php?title=Special:Log/block&page=User:"+ un, true),  // Redirect to block log page in new tab

                        "allLog": un=>redirect("https://en.wikipedia.org/wiki/Special:Log/"+ un, true)  // Redirect to filter log page in new tab

                    })[act](targetUsername.trim());
                    
                },
                items: { // TODO: add extra options like logs ext. ext.
                    "usrPg": {name: "User Page"},
                    "tlkPg": {name: "Talk Page"},
                    "aAsubmenu": {
                        "name": "Quick Actions", 
                        "items": {
                            "sendMsg": {name: "New Message"},
                            "newNotice": {name: "Warn User"},
                            "quickWel": {name: "Quick Template"},
                            "adminReport": {name: "Report to Admin"}
                        }
                    },
                    "aIsubmenu": {
                        "name": "Account info", 
                        "items": {
                            "contribs": {name: "Contributions"},
                            "accInfo": {name: "Central Auth"},
                            "usrPronouns": {"name": "Pronouns"},
                            "usrEditCount": {"name": "Edit Count"},
                            "usrStanding": {"name": "Highest Warning"},
                            "filterLog" : {name: "Edit Filter Log"},
                            "blockLog" : {name: "Block Log"},
                            "allLog" : {name: "All Logs"}
                        }
                    }  
                }
            });
        }); // END USER ACTIONS CONTEXT MENU

        // TODO: add more, like Quick Template options ext.. and right-click on article link to begin rollback ext.


    }, // end context menus

    
    /**
     * Requests the speedy deletion of a page. Not currently used and will not currently work without adding speedyDeleteReasons.js into build.php
     *
     * @param {string} pg Page name
     * @method requestSpeedyDelete
     * @extends rw.ui
     */
    "requestSpeedyDelete" : (pg)=>{
        // Open Speedy Deletion dialog for first selection, i.e I'm requesting the speedy deletion of..
        // Programming this is proving to be very boring.
        // Add toast handler
        addMessageHandler("pushToast`*", m=>rw.visuals.toast.show(m.split('`')[1],false,false,15000));

        addMessageHandler("csdR`*", rs=>{
            // Reason recieved.
            let reason = eval(rs.split("`")[1]);
            let reasonTitle = reason.title;
            let additionalInfoReq = reason.input != ""; // if special info needed
            let additionalInfo = "";
            if (additionalInfoReq) {
                if (rs.split("`")[2] == "undefined") {
                    // No reason specified
                    additionalInfo = "Not specified.";
                } else {
                    additionalInfo = rs.split("`")[2]; // set to the additional info
                }
            }
            console.log(`Deleting under: `+ reasonTitle +`
            `+ reason.input + additionalInfo + ` (redwarn)
            `);
        }); 

        let finalStr = ``;
        for (const key in speedyDeleteReasons) {
            speedyDeleteReasons[key].forEach((e,i)=>{
                let style = "";
                if ((key + e.title).length > 62) {
                    // Too long to fit
                    style="font-size:10px;";
                }
                finalStr += `<li class="mdl-menu__item" data-val='speedyDeleteReasons["`+ key + `"][`+ i +`]' onmousedown="refreshLevels('speedyDeleteReasons[\\\'`+ key + `\\\'][`+ i +`]');" style="`+ style +`">`+ key + e.title +`</li>`;;
            });
        }
        // CREATE DIALOG
        // MDL FULLY SUPPORTED HERE (container). 
        dialogEngine.create(mdlContainers.generateContainer(eval(rw_includes["speedyDeletionp1.html"]), 500, 450)).showModal(); // 500x300 dialog, see speedyDeletionp1.html for code
    },

    /**
     * Opens RedWarn preferences
     *
     * @method openPreferences
     * @extends rw.ui
     */
    "openPreferences" : () => { // Open Preferences page
        // Add toast handler
        addMessageHandler("pushToast`*", m=>rw.visuals.toast.show(m.split('`')[1],false,false,15000));

        addMessageHandler("config`*", rs=>{ // On config change
            // New config recieved
            let config = JSON.parse(atob(rs.split("`")[1])); // b64 encoded json string
            //Write to our config
            for (const key in config) {
                if (config.hasOwnProperty(key)) {
                    const element = config[key];
                    rw.config[key] = element; // add or change value
                }
            }

            // Push change
            rw.info.writeConfig();
        }); 

        addMessageHandler("resetConfig", rs=>{
            // Reset config recieved, set config back to default
            rw.info.getConfig(()=>{}, true); // TRUE HERE MEANS RESET TO DEAULT
        });

        // Add install quick template handler
        addMessageHandler("installQTP", ()=>{
            // Show warning and confirm
            rw.ui.confirmDialog(`
            <b>WARNING:</b> Only install packs from users you trust. Installing a quick template pack gives the installer full access to your account to write to RedWarn's config files.
            <br/><br/>
            To install, click "install from pack code" and paste the code into the browser dialog that appears.
            `, "Install from pack code", ()=>{
                // Time to install
                importScript(rw.quickTemplate.packCodeToPageName(prompt("Please enter the pack code, then click OK to install:"))); // using mediawiki importscript which does it from pagename
            },
            "CANCEL", ()=>dialogEngine.closeDialog(), 98);
        });

        // Add new QTPack handler
        addMessageHandler("newQTP", ()=>rw.quickTemplate.newPack());

        // Add load new theme handler
        addMessageHandler("newThemeDialog", ()=>rw.ui.loadDialog.show("Changing theme..."));
        addMessageHandler("loadDialogClose", ()=>rw.ui.loadDialog.close());

        // Lock scrolling
        dialogEngine.freezeScrolling();

        // Open preferences page with no padding, full screen
        dialogEngine.create(mdlContainers.generateContainer(eval(rw_includes["preferences.html"]), window.innerWidth, window.innerHeight, true), true).showModal(); // TRUE HERE MEANS NO PADDING.
    },

    /**
     * Opens the AIV report dialog
     *
     * @param {string} un Username to report
     * @param {boolean} doNotShowDialog If set to true, will be set to just generate slim HTMl and handlers
     * @method openAdminReport
     * @extends rw.ui
     */
    "openAdminReport" : (un, doNotShowDialog)=> { // Open admin report dialog
        // Setup AIV page for development or production
        const aivPage = (rw.debugMenu == null ? "Wikipedia:Administrator_intervention_against_vandalism" : "User:Ed6767/sandbox"); 

        // Add toast handler
        addMessageHandler("pushToast`*", m=>rw.visuals.toast.show(m.split('`')[1],false,false,2500));

        // On report
        addMessageHandler("AIVreport`*", m=>{
            let reportContent = m.split('`')[1]; // report content
            let target = m.split('`')[2]; // target username
            let targetIsIP = rw.info.isUserAnon(target); // is the target an IP? (2 different types of reports)
            console.log("reporting "+ target + ": "+ reportContent);
            console.log("is ip? "+ (targetIsIP ? "yes" : "no"));
            rw.visuals.toast.show("Reporting "+ target +"...", false, false, 2000); // show toast
            // Submit the report.   
            $.getJSON(rw.wikiAPI + "?action=query&prop=revisions&titles="+aivPage+"&rvslots=*&rvprop=content&formatversion=2&format=json", latestR=>{
                // Grab text from latest revision of AIV page
                // Check if exists
                let revisionWikitext =  latestR.query.pages[0].revisions[0].slots.main.content; // Set wikitext
                if (revisionWikitext.toLowerCase().includes(target.toLowerCase())) {// If report is already there
                    rw.visuals.toast.show("This user has already been reported.", false, false, 5000); // show already reported toast
                    return; // Exit
                }

                // Let's continue
                // We don't need to do anything special. Just shove our report at the bottom of the page, although, may be advisiable to change this if ARV format changes
                let textToAdd = "*" + (targetIsIP ? "{{IPvandal|" : "{{vandal|") + target + "}} " + reportContent; // DANGER! WIKITEXT (here is fine. be careful w changes.) - if target IP give correct template, else normal
                let finalTxt = revisionWikitext + "\n\n" + textToAdd; // compile final string
                // Now we just submit
                $.post(rw.wikiAPI, {
                    "action": "edit",
                    "format": "json",
                    "token" : mw.user.tokens.get("csrfToken"),
                    "title" : aivPage,
                    "summary" : `Reporting [[Special:Contributions/${target}|${target}]] [[w:en:WP:RW|(RW ${rw.version})]]`, // summary sign here
                    "text": finalTxt,
                    "tags" : ((rw.wikiID == "enwiki") ? "RedWarn" : null) // Only add tags if on english wikipedia
                }).done(dt => {
                    // We done. Check for errors, then callback appropriately
                    if (!dt.edit) {
                        // Error occured or other issue
                        console.error(dt);
                        dialogEngine.dialog.showModal(); // reshow dialog
                        rw.visuals.toast.show("Sorry, there was an error, likely an edit conflict. Try reporting again."); // That's it
                    } else {
                        // Success! No need to do anything else.
                        rw.visuals.toast.show("User reported.", false, false, 5000); // we done
                    }
                });
            });
        }); // END ON REPORT EVENT

        // Check matching user
        if (rw.info.targetUsername(un) == rw.info.getUsername()) {
            // Usernames are the same, give toast.
            if (doNotShowDialog !== true) rw.visuals.toast.show("You can not report yourself, nor can you test this feature except in a genuine case.", false, false, 7500);
            return `Sorry, you cannot report yourself, nor can you test this feature except in a genuine case.`; // DO NOT continue.
        }

        const dialogContent = eval(rw_includes["adminReport.html"]);

        // Push a message if report has already been made
        $.getJSON(rw.wikiAPI + "?action=query&prop=revisions&titles="+aivPage+"&rvslots=*&rvprop=content&formatversion=2&format=json", latestR=>{
            // Grab text from latest revision of AIV page
            // Check if exists
            let revisionWikitext =  latestR.query.pages[0].revisions[0].slots.main.content; // Set wikitext
            if (revisionWikitext.toLowerCase().includes(rw.info.targetUsername(un).replace(/_/g, ' ').toLowerCase())) {// If report is already there
                setTimeout(()=>dialogEngine.dialog.getElementsByTagName("iframe")[0].contentWindow.postMessage("AIVReportExist"), 500); // let dialog know after 500ms to allow dialog to open
            }
        });


        if (doNotShowDialog !== true) {
            // See adminReport.html for code
            dialogEngine.create(mdlContainers.generateContainer(dialogContent, 500, 410)).showModal();
        } else {
            // Return the code for use elsewhere
            return dialogContent;
        }
    },

    /**
     * Opens a confirmation dialog with one or two buttons
     *
     * @param {string} content Dialog content
     * @param {string} pBtnTxt Primary button text
     * @param {function} pBtnClick Callback when primary button clicked
     * @param {string} sBtnTxt Secondary button text (Will not show if empty)
     * @param {function} sBtnClick Secondary button callback
     * @param {number} extraHeight Extra height to add to the dialog in pixels
     * @param {boolean} noExtraLines Removes line breaks from the dialog
     * @method confirmDialog
     * @extends rw.ui
     */
    "confirmDialog": (content, pBtnTxt, pBtnClick, sBtnTxt, sBtnClick, extraHeight, noExtraLines) => { // noExtraLines removes the <br/> tags
        // Confirm dialog (yes, no, ext...)
        addMessageHandler("sBtn", sBtnClick);
        addMessageHandler("pBtn", pBtnClick);
        dialogEngine.create(mdlContainers.generateContainer(eval(rw_includes["confirmDialog.html"]), 500, 80 + extraHeight)).showModal();
    },

    /**
     * Shows the feedback dialog to leave bug reports and feedback
     *
     * @param {string} extraInfo
     * @method reportBug
     * @extends rw.ui
     */
    "reportBug" : extraInfo=> {
        // Open feedback dialog, basically same as newmsg
        // Setup preview handling
        addMessageHandler("generatePreview`*", m=>{
            rw.info.parseWikitext(m.split("`")[1], parsed=>{ // Split to Wikitext and send over to the API to be handled
                dialogEngine.dialog.getElementsByTagName("iframe")[0].contentWindow.postMessage({
                    "action": "parseWikiTxt",
                    "result": parsed}, '*'); // push to container for handling in dialog and add https:// to stop image breaking
            });
        });

        // Add toast handler
        addMessageHandler("pushToast`*", m=>rw.visuals.toast.show(m.split('`')[1],false,false,15000));

        // Add submit handler

        addMessageHandler("applyNotice`*", eD=> {
            // i.e applyNotice`user`wikitext`summary
            // TODO: maybe b64 encode?
            let _eD = eD.split("`"); // params
            let user = _eD[1];
            let wikiTxt = _eD[2];
            let summary = _eD[3];
            // MAKE EDIT
            rw.info.addWikiTextToUserPage(user, wikiTxt, true, summary); // Save under date
        });

        // CREATE DIALOG
        // MDL FULLY SUPPORTED HERE (container). 
        dialogEngine.create(mdlContainers.generateContainer(eval(rw_includes["sendFeedback.html"]), 500, 390)).showModal(); // 500x390 dialog, see sendFeedback.html for code
    },

    /**
     * Opens the administrator report venue selector for the specified username
     *
     * @param {string} un Username to report
     * @method adminReportSelector
     * @extends rw.ui
     */
    "adminReportSelector" : un=> { // DON'T FORGET TO USE un ATTR!
        un = rw.info.targetUsername(un); // get target
        // Handle events
        addMessageHandler("openAIV", ()=>rw.ui.openAdminReport(un)); // AIV report
        addMessageHandler("openUAA", ()=>rw.ui.beginUAAReport(un)); // UAA report

        // Open the admin report selector dialog
        dialogEngine.create(mdlContainers.generateContainer(eval(rw_includes["adminReportSelector.html"]), 250, 280)).showModal();
    },

    /**
     * Opens the UAA report dialog for a specified user
     *
     * @param {string} un Username to report
     * @param {boolean} htmlOnly For expanding elements, adds handlers but returns HTML
     * @method beginUAAReport
     * @extends rw.ui
     */
    "beginUAAReport" : (un, htmlOnly)=> { // Report to UAA

        // Check if IP - if so, exit
        if (rw.info.isUserAnon(un)) {
            if (htmlOnly) return "As IPs don't have usernames, you can't report them to UAA.";
            rw.ui.confirmDialog("As IPs don't have usernames, you can't report them to UAA.", "OKAY", ()=>dialogEngine.closeDialog() , "", ()=>{}, 0);
            return; // stop
        }

        const uaaPage = (rw.debugMenu == null ? "Wikipedia:Usernames_for_administrator_attention" : "User:Ed6767/sandbox"); // set UAA based on debug mode

        // Add toast handler
        addMessageHandler("pushToast`*", m=>rw.visuals.toast.show(m.split('`')[1],false,false,2500));

        // On report
        addMessageHandler("UAA`*", m=>{
            let reportContent = m.split('`')[1]; // report content
            let target = m.split('`')[2]; // target username
            console.log("reporting "+ target + ": "+ reportContent);
            rw.visuals.toast.show("Reporting "+ target +"...", false, false, 2000); // show toast
            // Submit the report. MUST REPLACE WITH REAL AIV WHEN DONE AND WITH SANDBOX IN DEV!   

            $.getJSON(rw.wikiAPI + "?action=query&prop=revisions&titles="+uaaPage+"&rvslots=*&rvprop=content&formatversion=2&format=json", latestR=>{
                // Grab text from latest revision of AIV page
                // Check if exists
                let revisionWikitext =  latestR.query.pages[0].revisions[0].slots.main.content; // Set wikitext
                if (revisionWikitext.toLowerCase().includes(target.toLowerCase())) {// If report is already there
                    rw.visuals.toast.show("This user has already been reported.", false, false, 5000); // show already reported toast
                    return; // Exit
                }

                // Let's continue
                // We don't need to do anything special. Just shove our report at the bottom of the page, although, may be advisiable to change this if ARV format changes
                let textToAdd = "*" + "{{user-uaa|1=" + target + "}} &ndash; " + reportContent; // DANGER! WIKITEXT (here is fine. be careful w changes.) - if target IP give correct template, else normal
                let finalTxt = revisionWikitext + "\n\n" + textToAdd; // compile final string
                // Now we just submit
                $.post(rw.wikiAPI, {
                    "action": "edit",
                    "format": "json",
                    "token" : mw.user.tokens.get("csrfToken"),
                    "title" : uaaPage,
                    "summary" : `Reporting [[Special:Contributions/${target}|${target}]] [[w:en:WP:RW|(RW ${rw.version})]]`, // summary sign here
                    "text": finalTxt,
                    "tags" : ((rw.wikiID == "enwiki") ? "RedWarn" : null) // Only add tags if on english wikipedia
                }).done(dt => {
                    // We done. Check for errors, then callback appropriately
                    if (!dt.edit) {
                        // Error occured or other issue
                        console.error(dt);
                        dialogEngine.dialog.showModal(); // reshow dialog
                        rw.visuals.toast.show("Sorry, there was an error, likely an edit conflict. Try reporting again."); // That's it
                    } else {
                        // Success! No need to do anything else.
                        rw.visuals.toast.show("User reported.", false, false, 5000); // we done
                    }
                });
            });
        }); // END ON REPORT EVENT

        // Check matching user
        if (rw.info.targetUsername(un) == rw.info.getUsername()) {
            // If HTML only
            if (htmlOnly) return `You can not report yourself, nor can you test this feature except in a genuine case.`;

            // Usernames are the same, give toast.
            rw.visuals.toast.show("You can not report yourself, nor can you test this feature except in a genuine case.", false, false, 7500);
            return; // DO NOT continue.
        }
        
        const dialogContent = eval(rw_includes["uaaReport.html"]);

        // Push a message if report has already been made
        $.getJSON(rw.wikiAPI + "?action=query&prop=revisions&titles="+uaaPage+"&rvslots=*&rvprop=content&formatversion=2&format=json", latestR=>{
            // Grab text from latest revision of AIV page
            // Check if exists
            let revisionWikitext =  latestR.query.pages[0].revisions[0].slots.main.content; // Set wikitext
            if (revisionWikitext.toLowerCase().includes(rw.info.targetUsername(un).replace(/_/g, ' ').toLowerCase())) {// If report is already there
                setTimeout(()=>dialogEngine.dialog.getElementsByTagName("iframe")[0].contentWindow.postMessage("UAAReportExist"), 500); // let dialog know after 500ms to allow dialog to open
            }
        });


        if (htmlOnly) return dialogContent; // return dialog if HTMl only

        // See uaaReport.html for code
        dialogEngine.create(mdlContainers.generateContainer(dialogContent, 500, 410)).showModal();
    },

    /**
     * Opens extended options that can be opened from any page (preferences, oversight and TAS reporting)
     * @param {string} un Username for reports. Can also be revision ID (todo)
     * @method openExtendedOptionsDialog
     * @extends rw.ui
     */
    "openExtendedOptionsDialog" : un=>{
        rw.ui.loadDialog.show("Please wait...");
        // Get email info before loading and showing dialog (for OS and TAS reporting)
        $.getJSON(rw.wikiAPI+"?action=query&meta=userinfo&uiprop=email&format=json", r=>{

            // HTML for tabs

            // USER THINGS ONLY - try and catch as will error out on non-user pages
            let adminReportContent = eval(rw_includes["genericError.html"]); // placeholder
            try {
                adminReportContent = rw.ui.openAdminReport(null, true); // this sets up our handlers and generates the appropraite HTML
            } catch (e) {adminReportContent+=`<hr><pre>${e.stack}</pre>`;}

            // UAA report
            let uaaReportContent = eval(rw_includes["genericError.html"]); // placeholder
            try {
                uaaReportContent = rw.ui.beginUAAReport(rw.info.targetUsername(), true); // this sets up our handlers and generates the appropraite HTML
            } catch (e) {uaaReportContent+=`<hr><pre>${e.stack}</pre>`;}

            // Event handlers
            addMessageHandler("redwarnPref", ()=>dialogEngine.closeDialog(()=>rw.ui.openPreferences())); // open preferences for button press
            addMessageHandler("redwarnTalk", ()=>redirect("https://en.wikipedia.org/wiki/Wikipedia_talk:RedWarn", true));

            // Email to TAS THIS IS LIVE!!
            addMessageHandler("TASEmail`*", e=>dialogEngine.closeDialog(()=>rw.info.sendEmail("Emergency", atob(e.split("`")[1]))));

            // Email to OS - THESE ARE LIVE 
            addMessageHandler("OSEmail`*", e=>dialogEngine.closeDialog(()=>rw.info.sendEmail("Oversight", atob(e.split("`")[1]))));

            const isUserPage = mw.config.get("wgRelevantPageName").includes("User:") || mw.config.get("wgRelevantPageName").includes("User_talk:");
            const isOnRevPage = window.location.href.includes("diff=") || window.location.href.includes("oldid="); // for reporting revisions

            let rollbackOptsHTML = "";
            // Generate rollback options if on rev page 
            if (isOnRevPage) rollbackOptsHTML = rw.rollback.getDisabledHTMLandHandlers(); // generates our HTML and all assosicated handlers for us


            // Email information for TAS and OS reports
            const emailInfo = r.query.userinfo;

            // Close loading dialog#
            rw.ui.loadDialog.close();

            // Make dialog
            dialogEngine.create(mdlContainers.generateContainer(eval(rw_includes["extendedOptions.html"]), 500, 500)).showModal(); // todo: also shrink more when not on user page or revision page
        });

    },

    // CLASSES from here 

    /**
     * A static loading dialog while processes occur. Seperate from dialogEngine.
     * @class rw.ui.loadDialog
     */
    "loadDialog" : {
        // Loading dialog
        "hasInit" : false, 
        "init" : text=> {
            if (!rw.ui.loadDialog.hasInit) { // Only continue if we haven't already appended our container div
                $("body").append(`
                <div id="rwUILoad">
                </div>
                `);
            }
            $("#rwUILoad").html(`
            <dialog class="mdl-dialog" id="rwUILoadDialog" style="border-radius: 7px;">
                ` + mdlContainers.generateContainer(eval(rw_includes["loadingSpinner.html"]), 300, 30) +`
            </dialog>
            `); // Create dialog with content from loadingSpinner.html

            rw.ui.loadDialog.dialog = document.querySelector('#rwUILoadDialog'); // set dialog var

            // Firefox issue fix
            if (! rw.ui.loadDialog.dialog.showModal) {
                dialogPolyfill.registerDialog(rw.ui.loadDialog.dialog);
            }

            rw.ui.loadDialog.hasInit = true;
        },


        /**
         * Opens a loading dialog with the given text
         *
         * @param {string} text
         * @method show
         * @extends rw.ui.loadDialog
         */
        "show" : text=> { // Init and create a new loading dialog
            rw.ui.loadDialog.init(text); // init
            rw.ui.loadDialog.setText(text); // set our text
            // Show dialog
            rw.ui.loadDialog.dialog.showModal();
            // We done
        },

        /**
         * Changes the text of the current loading dialog
         *
         * @param {string} text
         * @method setText
         * @extends rw.ui.loadDialog
         */
        "setText" : text=> $("#rwUILoadDialog > iframe")[0].contentWindow.postMessage(text, '*'), // Set text of loading by just sending the message to the container

        /**
         * Closes the current loading dialog
         *
         * @method close
         * @extends rw.ui.loadDialog
         */
        "close": ()=>{ // Close the dialog and animate
            $("#rwUILoadDialog")
            .addClass("closeAnimate")
            .on("webkitAnimationEnd", ()=>{
                // Animation finished
                rw.ui.loadDialog.dialog.close();
            });
        } 
    },

    /**
     * A dialog used to select a page from a users 20 recently visited pages
     * 
     * @class rw.ui.recentlyVisitedSelector
     */
    "recentlyVisitedSelector" : { // Used to select recently visited page from a dropdown dialog
        "dialog" : null,
        "init" : content=>{
            if ($("#rwRecentVistedSelectContainer").length < 1) {
                // container hasn't already been init
                $("body").append(`
                <div id="rwRecentVistedSelectContainer">
                </div>
                `);
            }
            // let's continue
            $("#rwRecentVistedSelectContainer").html(`
            <dialog class="mdl-dialog" id="rwUIRVisDialog">
                ` + content +`
            </dialog>
            `);

            rw.ui.recentlyVisitedSelector.dialog = document.querySelector('#rwUIRVisDialog'); // set dialog var

            // Firefox issue fix
            if (! rw.ui.recentlyVisitedSelector.dialog.showModal) {
                dialogPolyfill.registerDialog(rw.ui.recentlyVisitedSelector.dialog);
            }
        },

        /**
         * Shows the selection dialog and calls back when user has made their selection
         *
         * @param {function} callback callback(selectedPageTitle)
         * @method showDialog
         * @extends rw.ui.recentlyVisitedSelector
         */
        "showDialog" : callback=>{ // Show dialog and callback(selected article)
            // Assemble revent visits listbox
            let recentlyVisited = JSON.parse(window.localStorage.rwRecentlyVisited);

             // Check if empty, if so, show dialog and exit
             if ((recentlyVisited == null) || (recentlyVisited.length < 1)) {
                rw.ui.confirmDialog("There are no recent pages to show.", "OKAY", ()=>dialogEngine.closeDialog(), "", ()=>{}, 0);
                return; //exit, don't callback as not complete
            }

            // Let's continue
            let finalRVList = "";
            recentlyVisited.forEach((page, i) => {
                finalRVList += `
                <label class="mdl-radio mdl-js-radio mdl-js-ripple-effect" for="spI${i}">
                    <input type="radio" id="spI${i}" class="mdl-radio__button" name="selectedPageIndex" value="${i}">
                    <span class="mdl-radio__label">${page.replace(/_/g, ' ')}</span>
                </label>
                <hr />
                `;
            });
            
            // Add close handler
            addMessageHandler("closeRecentPageDialog", ()=>rw.ui.recentlyVisitedSelector.close());

            // Add continue handler
            addMessageHandler("RecentPageDialogSel`*", m=>{
                let selectedI = m.split("`")[1];
                callback(recentlyVisited[selectedI]); // send callback
            });
            
            // Now show dialog
            rw.ui.recentlyVisitedSelector.init(mdlContainers.generateContainer(eval(rw_includes["recentPageSelect.html"]), 420, 500)); // 420 hahahaha
            rw.ui.recentlyVisitedSelector.dialog.showModal();
        },

        /**
         * Closes the currently open dialog
         *
         * @method close
         * @extends rw.ui.recentlyVisitedSelector
         */
        "close" : () => {
            // Close dialog
            $(rw.ui.recentlyVisitedSelector.dialog)
            .addClass("closeAnimate")
            .on("webkitAnimationEnd", ()=>{
                // Animation finished
                rw.ui.recentlyVisitedSelector.dialog.close();
            });
        }
    }
}
// rw-source: pendingChanges.js
/**
 * RedWarn's pending changes review feature
 * @class rw.PendingChangesReview
 */
rw.PendingChangesReview = {
    /**
     * If on a review page, and user in "reviewer" group, this initalies review controls
     *
     * @method reviewPage
     * @extends rw.PendingChangesReview
     */
    "reviewPage" : ()=> {
        // Check config if disabled
        if (rw.config.rwDisablePendingChanges == "disable") return; // if disabled, exit
        
        // Pending changes buttons and warning (ONLY on review pages) 
        if (($("#mw-fr-reviewform").length > 0) && !($("#mw-fr-reviewformlegend").text().includes("Re-review"))) {
            rw.info.featureRestrictPermissionLevel("reviewer", ()=>{ // Restrict to pending changes reviewers
                // Add to accept header
                $('.flaggedrevs_reviewform').prepend(`
                <div style="text-align:center;width:100%;">
                    <div id="rReviewAccept" class="icon material-icons">
                        <span style="cursor: pointer; color:green;font-size:56px;">
                            done
                        </span>
                    </div>
                    <div class="mdl-tooltip mdl-tooltip--large" for="rReviewAccept">
                        Accept these changes
                    </div>
                    <div id="rReviewDeny" class="icon material-icons"><span style="cursor: pointer; padding-left:20px; color:red;font-size:56px;">
                            close
                        </span>
                    </div>
                    <div class="mdl-tooltip mdl-tooltip--large" for="rReviewDeny">
                        Revert changes
                    </div>
                </span>
                <br>
                `);
                // Hide original review box
                $(".fr-rating-controls").hide();
                // Handlers
                // ON ACCEPT
                let acceptHandler = ()=>{
                    // When accept button clicked.
                    rw.PendingChangesReview.confirmLatestRev(()=>{
                        rw.PendingChangesReview.getPendingChangesUsers((usr, count, users, userCount)=>{

                            // SUBMIT HANDLER, SCROLL DOWN FOR DIALOG
                            addMessageHandler("reason`*", reasonIn=> {
                                let comment = reasonIn.split("`")[1]; // params
                                // Time to submit 302 success, 200 FAIL
                                rw.ui.loadDialog.show("Accepting...");
                                $.ajax({
                                    url  : 'https://en.wikipedia.org/w/index.php?title=Special:RevisionReview&action=submit',
                                    type : 'post',
                                    data : {
                                        "action": "approve",
                                        "title": "Special:RevisionReview",
                                        "wpApprove" : 1,
                                        "target" : mw.config.get("wgRelevantPageName"),
                                        "wpEditToken" : mw.user.tokens.get("csrfToken"),
                                        "refid" : $("#mw-fr-input-refid").attr("value"),
                                        "oldid" : $("#mw-fr-input-oldid").attr("value"),
                                        "changetime" : $("#mw-fr-input-changetime").attr("value"),
                                        "userreviewing" : $("#mw-fr-input-reviewing").attr("value"),
                                        "templateParams": "",
                                        "imageParams": "",
                                        "fileVersion": "",
                                        "validatedParams": $('input[name ="validatedParams"]').attr("value"),
                                        "wpReason" : comment + " ([[w:en:Wikipedia:RedWarn|RedWarn "+ rw.version + "]])",
                                        "wpSubmit": "Accept revision"
                                }}).done((r, sT, x)=>{ // TODO: ADD AUTOWARNING, DETECT CHANGE AND OTHER
                                    rw.ui.loadDialog.close();
                                    // Review response (this gens a new dom thing then we get the content text and error in first p), get response of 302 or 200 with below else error
                                    //<b>Revision of <a href="/wiki/Joel_Osteen" title="Joel Osteen">Joel Osteen</a> flagged. (<a class="external text" href="https://en.wikipedia.org/w/index.php?title=Special:ReviewedVersions&amp;page=Joel_Osteen">view reviewed versions</a>)</b>
                                    if (x.status == 200){
                                        // We done :)
                                        let parser = new DOMParser();
                                        let el = parser.parseFromString(r, 'text/html');
                                        let resultStr = el.getElementById("mw-content-text").getElementsByTagName("p")[0].innerText;
                                        if (resultStr.includes("Revision of") && resultStr.includes("flagged")) {
                                            // Success!
                                            // Reload the page with tags
                                            rw.ui.loadDialog.show("Reloading...");
                                            window.location.hash = "#rwPendingAccept";
                                            window.location.reload();
                                        } else {
                                            // Probably error
                                            rw.visuals.toast.show("Sorry, an error occured and your review has not been submitted.", false, false, 5000);
                                        }
                                    } else {
                                        // Error
                                        rw.visuals.toast.show("Sorry, an error occured and your review has not been submitted.", false, false, 5000);
                                    }
                                    
                                });
                            });
                            
                            // SHOW DIALOG
                            let reviewAction = "Accept "+ count +" Revision"+ ((count > 1) ? "s" : ""); // i.e accept 1 revision / accept 2 revisions
                            let reviewCaption = `
                            <strong>You are about to accept `+ count +` edit`+ ((count > 1) ? "s" : "") + ` by `+ userCount +` user`+ ((userCount > 1) ? "s" : "") + `</strong>
                            <br/><br/>
                            Enter an optional comment, then confirm your review by clicking 'Submit Review' or by pressing ENTER.`;
                            let autoAccept = rw.config.rwDisableReviewAutoAccept != "disable" ? "true" : "false";
                            dialogEngine.create(mdlContainers.generateContainer(eval(rw_includes["pendingReviewReason.html"]), 500, 350)).showModal();
                        });
                    });
                };
                $("#rReviewAccept").click(acceptHandler);
                // END ACCEPT

                // ON DENY

                let denyHandler = ()=>{
                    // When DENY button clicked.
                    rw.PendingChangesReview.confirmLatestRev(()=>{
                        rw.PendingChangesReview.getPendingChangesUsers((usr, count, users, userCount)=>{
                            
                            addMessageHandler("reason`*", reasonIn=> { // ON REASON RECIEVED
                                // Generate revert string
                                let revertString = "Reverting "+ count +" pending edit"+ ((count > 1) ? "s" : "") + " by ";
                                // Build list of users (feeding in object keys)
                                revertString += (a=>{
                                    a.forEach((v,i)=>{ // Wrap contribs link around usernammes
                                        a[i] = "[[Special:Contributions/"+ v + "|"+ v +"]]";
                                    });
                                    // Build x, y and z list
                                    a.length == 1 ? a[0] : [ a.slice(0, a.length - 1).join(", "), a[a.length - 1] ].join(" and ");
                                    return a;
                                })(Object.keys(users));
                                revertString += " to last accepted version by [[Special:Contributions/"+ usr +"|"+ usr +"]]";

                                let comment = reasonIn.split("`")[1]; // params
                                rw.ui.loadDialog.show("Reverting...");
                                $.ajax({
                                    url  : 'https://en.wikipedia.org/w/index.php?title=Special:RevisionReview&action=submit',
                                    type : 'post',
                                    data : { // send request (reversed from form)
                                    "action": "reject",
                                    "title": "Special:RevisionReview",
                                    "wpReject" : 1,
                                    "wpRejectConfirm" : 1,
                                    "target" : mw.config.get("wgRelevantPageName"),
                                    "wpEditToken" : mw.user.tokens.get("csrfToken"),
                                    "refid" : $("#mw-fr-input-refid").attr("value"),
                                    "oldid" : $("#mw-fr-input-oldid").attr("value"),
                                    "changetime" : $("#mw-fr-input-changetime").attr("value"),
                                    "userreviewing" : $("#mw-fr-input-reviewing").attr("value"),
                                    "templateParams": "",
                                    "imageParams": "",
                                    "fileVersion": "",
                                    "validatedParams": $('input[name ="validatedParams"]').attr("value"),
                                    "wpReason" : revertString+ (comment.length > 0 ? ": "+ comment : "") + " ([[w:en:Wikipedia:RedWarn|RW "+ rw.version + "]])",
                                    "wpSubmit": "Revert these changes"
                                }}).done((r,sT,x)=>{
                                    // Cannot reject these changes because someone already accepted some (or all) of the edits.
                                    rw.ui.loadDialog.close();
                                    let successHandler = ()=>{
                                        // On success
                                        if (rw.config.rwPendingMATDisable != "disable") rw.multiAct.open(users); // open MAT if not disabled in config
                                    };
                                    if (x.status == 302) {
                                        // Redirect, so success!
                                        dialogEngine.closeDialog();
                                        successHandler();
                                    } else {
                                        // Oops, likely error (DENY ONLY)
                                        let parser = new DOMParser();
                                        let el = parser.parseFromString(r, 'text/html');
                                        let resultStr = el.getElementById("mw-content-text").getElementsByTagName("p")[0].innerHTML;
                                        if (resultStr.includes("Cannot reject these changes because someone already accepted some (or all) of the edits")) {
                                            // Show the issue 
                                            rw.PendingChangesReview.confirmLatestRev(()=>successHandler(), true); // true here note a different wording
                                        } else if (r.toLowerCase().includes("internal error")) {
                                            rw.visuals.toast.show("Sorry, an error occured and your review has not been submitted");
                                        } else {
                                            // Likely success
                                            successHandler();
                                        }

                                    }
                                });
                            });

                            let reviewAction = "Revert "+ count +" Revision"+ ((count > 1) ? "s" : "");
                            let reviewCaption = `
                            <strong>You are about to revert `+ count +` edit`+ ((count > 1) ? "s" : "") + ` by `+ userCount +` user`+ ((userCount > 1) ? "s" : "") + `</strong>
                            <br/><br/>
                            If you are not reverting vandalism, please enter a summary for the revert.
                            Confirm your review by clicking 'Submit Review' or by pressing ENTER.
                            `;
                            let autoAccept = rw.config.rwEnableReviewAutoRevert == "enable" ? "true" : "false";
                            dialogEngine.create(mdlContainers.generateContainer(eval(rw_includes["pendingReviewReason.html"]), 500, 350)).showModal();
                        });
                    });
                };

                $("#rReviewDeny").click(denyHandler);

                // END DENY
            }, ()=>{});
        } else if (($("#mw-fr-reviewform").length > 0) && ($("#mw-fr-reviewformlegend").text().includes("Re-review"))) {
            // Re-review page, all here is just unaccept
            // Add to accept header
            $('.flaggedrevs_reviewform').prepend(`
            <div style="text-align:center;width:100%;">
                <div id="rReviewUnAccept" class="icon material-icons"><span style="cursor: pointer; padding-left:20px; color:red;font-size:56px;">
                        close
                    </span>
                </div>
                <div class="mdl-tooltip mdl-tooltip--large" for="rReviewUnAccept">
                Unaccept changes
                </div>
            </span>
            <br>
            `);
            // Hide original review box
            $(".fr-rating-controls").hide();
            // Handlers
            $("#rReviewUnAccept").click(()=>{
                addMessageHandler("reason`*", reasonIn=> { // ON REASON RECIEVED 
                    // Dumbest one of all, just send, reload and hope for the best
                    let comment = reasonIn.split("`")[1];
                    rw.ui.loadDialog.show("Unaccepting...");
                    $.post("https://en.wikipedia.org/w/index.php?title=Special:RevisionReview&action=submit", {
                        "action": "submit",
                        "title": "Special:RevisionReview",
                        "wpUnapprove" : 1,
                        "target" : mw.config.get("wgRelevantPageName"),
                        "wpEditToken" : mw.user.tokens.get("csrfToken"),
                        "refid" : $("#mw-fr-input-refid").attr("value"),
                        "oldid" : $("#mw-fr-input-oldid").attr("value"),
                        "changetime" : $("#mw-fr-input-changetime").attr("value"),
                        "userreviewing" : $("#mw-fr-input-reviewing").attr("value"),
                        "templateParams": "",
                        "imageParams": "",
                        "fileVersion": "",
                        "validatedParams": $('input[name ="validatedParams"]').attr("value"),
                        "wpReason" : "Unapproving"+ (comment.length > 0 ? ": "+ comment : "") + " ([[w:en:Wikipedia:RedWarn|RW "+ rw.version + "]])",
                        "wpSubmit": "Unaccept revision"
                    }).done(r=>{
                        window.location.hash = "#rwReviewUnaccept";
                        window.location.reload();
                    });
                });

                let reviewAction = "Unaccept Revision";
                let reviewCaption = `
                <strong>You are about to unaccept this revision.</strong>
                <br/><br/>
                If you are not reverting vandalism, please enter a summary for the revert.
                Confirm your review by clicking 'Submit Review' or by pressing ENTER.
                `;
                let autoAccept = rw.config.rwEnableReviewAutoRevert == "enable" ? "true" : "false";
                dialogEngine.create(mdlContainers.generateContainer(eval(rw_includes["pendingReviewReason.html"]), 500, 350)).showModal();

            });
        }
    }, // end init

    /**
     * Confirm that we are still confirming this revision - if not, the user will be prompted whether they still wish to initate the callback.
     *
     * @param {function} callback
     * @param {boolean} isFailedRevert Whether or not this function was initiated via a failed revert for a different dialog wording.
     * @method confirmLatestRev
     * @extends rw.PendingChangesReview
     */
    "confirmLatestRev" : (callback, isFailedRevert)=> { // Verify that this confirm is the latest revision
        $.getJSON("https://en.wikipedia.org/w/api.php?action=query&prop=revisions&titles="+ encodeURIComponent(mw.config.get("wgRelevantPageName")) +"&rvslots=*&rvprop=ids%7Cuser%7Ccomment&formatversion=2&format=json", r=>{
            // We got the response
            let latestRId = r.query.pages[0].revisions[0].revid;
            let parentRId = r.query.pages[0].revisions[0].parentid;
            let latestUsername = r.query.pages[0].revisions[0].user;
            let latestComment = r.query.pages[0].revisions[0].comment;
            // Get restore ID from right side review
            if ($('#mw-diff-ntitle1 > strong > a').attr('href').split('&')[1].split('=')[1] == latestRId) {callback();} else { // If latest revision send callback else show dialog
                rw.ui.confirmDialog(`
                <span>
                    <strong>`+ (!isFailedRevert ? `This is not the latest revision and may have been reverted by another reviewer.` :
                    `This edit could not be reverted as another editor has reverted it.`)
                    +`</strong> Would you like to review the latest revision`+ (isFailedRevert ? " or continue to the multiple action screen anyway" : "") +`?
                </span>
                <hr/>
                <span style="font-size:small;font-style: italic;height:340px;overflow:auto;">
                    Latest revision by `+ latestUsername +`: `+ latestComment +`
                </span>
                `,
                "GO TO LATEST REVISION", ()=>{
                    dialogEngine.closeDialog();
                    rw.ui.loadDialog.show("Redirecting...");
                    // Redirect to latest version
                    redirect("https://en.wikipedia.org/w/index.php?title="+ encodeURIComponent(mw.config.get("wgRelevantPageName")) +"&diff="+ latestRId +"&oldid="+ parentRId +"&diffmode=source#redirectLatestRevision");
                },
                "CONTINUE ANYWAY", ()=>{
                    dialogEngine.closeDialog();
                    callback();
                }, isFailedRevert? 135 : 115); // continue anyway: close and callback
            }
        });
    },

    /**
     * Calls back with the past 10 users who have had pending edits
     *
     * @param {function} callback callback(lastAcceptedUser, countofEdits, rwMultiActuserObject, userCount)
     * @method getPendingChangesUsers
     * @extends rw.PendingChangesReview
     */
    "getPendingChangesUsers" : callback=> { // CALLBACK(last accepted usr, count, obj, userCount)
        // Get all revisions between last accepted and this one
        $.getJSON("https://en.wikipedia.org/w/api.php?action=query&prop=revisions&format=json&titles="+
                    mw.config.get("wgRelevantPageName")+"&rvprop=ids%7Cuser%7Ccomment&rvstartid="+
                    $("#mw-fr-input-oldid").attr("value")+"&rvendid="+$("#mw-fr-input-refid").attr("value"),
        r=>{
            // Done
            let revs = Object.values(r.query.pages)[0].revisions
            let lastAcceptedUser = revs.pop().user; // Remove & Return Last item as is the last accepted - Remove last user as not pending
            let userObj = {};
            let editCount = 0;
            let userCount = 0;
            revs.forEach(rev=>{ // For each revision
                let user = rev.user;
                // Summary - revID: summary (click revid to open diff in new tab)
                let summary = "<a target='_blank' href='https://en.wikipedia.org/w/index.php?title="+ encodeURIComponent(mw.config.get("wgRelevantPageName"))
                                +"&diff="+ rev.revid +"&oldid="+ rev.parentid +"&diffmode=source'>"+ rev.revid +"</a>: " + rev.comment; 
            
                // If user not in userObj, add
                if (!(user in userObj)) {
                    userObj[user] = {
                        "edits" : 0,
                        "summaries": []
                    };
                    userCount += 1;
                };

                // Now add our info
                userObj[user].edits += 1;
                userObj[user].summaries.push(summary);
                editCount += 1;
            });
            // We're done. Callback
            callback(lastAcceptedUser, editCount, userObj, userCount);
        });
    }
}
// rw-source: multiAct.js
/**
 * RedWarn's multiple action tool
 * @class rw.multiAct
 */
rw.multiAct = { // Multi action screen
    /**
     * Initalise the multiple action tool buttons on a revision history page
     * @method initHistoryPage
     * @extends rw.multiAct
     */
    "initHistoryPage" : ()=> {
        // If on history page, add button to mass warn between edits
        if(window.location.href.includes("/index.php?title=") && window.location.href.includes("&action=history")) {
            // On history page, add button
            $(".mw-history-compareselectedversions").append(`
            <button class="mw-ui-button rwMAThist">Use the Multiple Action Tool between selected revisions</button>
            `);
            // Result handler
            let userObj = {};
            let editCount = 0;
            let userCount = 0;
            let resultHandler = r=>{
                // Done
                console.log(r);
                let revs = Object.values(r.query.pages)[0].revisions
                revs.forEach(rev=>{ // For each revision
                    let user = rev.user;
                    // Summary - revID: summary (click revid to open diff in new tab)
                    let summary = "<a target='_blank' href='https://en.wikipedia.org/w/index.php?title="+ encodeURIComponent(mw.config.get("wgRelevantPageName"))
                                    +"&diff="+ rev.revid +"&oldid="+ rev.parentid +"&diffmode=source'>"+ rev.revid +"</a>: " +
                                    ((rev.comment != null && rev.comment.length > 0) ? rev.comment : "<i>No summary provided</i>"); 
                
                    // If user not in userObj, add
                    if (!(user in userObj)) {
                        userObj[user] = {
                            "edits" : 0,
                            "summaries": []
                        };
                        userCount += 1;
                    };

                    // Now add our info
                    userObj[user].edits += 1;
                    userObj[user].summaries.push(summary);
                    editCount += 1;
                });
                // Check if continue
                if (r.continue != null) {
                    // Still more to do, so resubmit
                    let latestID = $('#mw-history-compare').find('input[name="diff"]:checked').val(); 
                    let oldestID = $('#mw-history-compare').find('input[name="oldid"]:checked').val(); 
                    $.getJSON(rw.wikiAPI + "?action=query&prop=revisions&format=json&titles="+
                        mw.config.get("wgRelevantPageName")+"&rvprop=ids%7Cuser%7Ccomment&rvstartid="+
                        latestID+"&rvendid="+oldestID + "&rvcontinue="+ r.continue.rvcontinue,
                    resultHandler); // continueee
                } else {
                    // We're done.
                    rw.ui.loadDialog.close(); // close load dialog
                    rw.multiAct.open(userObj); // open with userobj
                    userObj = {}; // clear to prevent 1 edit... 2 edits.. 3 edits ext.
                }
            }

            $(".rwMAThist").click(e=>{ // On click handler - don't use ID as there are two buttons
                e.preventDefault(); // stop the default redirect
                rw.ui.loadDialog.show("Please wait..."); // Show loading dialog
                // Load all revisions between oldid and diff - remember we are checking between this range
                let latestID = $('#mw-history-compare').find('input[name="diff"]:checked').val(); 
                let oldestID = $('#mw-history-compare').find('input[name="oldid"]:checked').val(); 
                // Get all revisions 
                $.getJSON(rw.wikiAPI + "?action=query&prop=revisions&format=json&titles="+
                    mw.config.get("wgRelevantPageName")+"&rvprop=ids%7Cuser%7Ccomment&rvstartid="+
                    latestID+"&rvendid="+oldestID,
                resultHandler);
            });
        }
    },

    /**
     * Open the multiple action tool using the specified user object
     *
     * @param {object} userObj Object in format of {username1: {edits: [(array of revIDs)]}, username2: ..., username3: ...}
     * @method open
     * @extends rw.multiAct
     */
    "open" : userObj=>{ // userobj format or just {}
        // To prevent a new user from mass spamming loads of users, extendedconfirmed only
        rw.info.featureRestrictPermissionLevel("extendedconfirmed", ()=>{
            // Generate list
            let listHTML = ``;
            for (const usr in userObj) {
                if (userObj.hasOwnProperty(usr)) {
                    if (usr.toLowerCase().includes("bot")) continue; // skip bots
                    if (usr.toLowerCase() == "undefined" || usr == null) continue; // don't do undefined, bug
                    const userInfo = userObj[usr];
                    // Append table row
                    listHTML += `
                    <tr>
                        <td class="mdl-data-table__cell--non-numeric">`+ usr +`</td>
                        <td>
                        <a href="#" onclick="window.parent.postMessage(\`summaries `+ usr +`\`);"><strong>` + userInfo.edits + ` edit` + (userInfo.edits > 1 ? "s" : "") +`</strong></a><br/>
                        </td>
                        <td id="editCount-`+usr+`">-
                        <script>
                            // Adds handler for this edit count
                            addMessageHandler("editCount-`+ usr +`\`*", e=>{
                                $(document.getElementById("editCount-`+usr+`")).text(e.split("\`")[1]);
                            });
                        </script>
                        </td> <!-- user edit count, loaded on page -->
                        <!-- Highest notice -->
                        <td id="PWcontainer-`+usr+`">
                        <span class="material-icons" id="PastWarning-`+usr+`" style="cursor:help;position: relative;top: 5px;padding-left: 10px;color:black;">help</span>
                        <div class="mdl-tooltip mdl-tooltip--large" for="PastWarning-`+usr+`">
                            <span style="font-size:x-small;">
                                Level is unknown or loading
                            </span>
                        </div>
                        <script>
                            // Adds handler for this past level
                            addMessageHandler("PastWarning-`+ usr +`\`*", e=>{
                                $(document.getElementById("PWcontainer-`+usr+`")).html(e.split("\`")[1]);

                                // Now set onclick for the icon
                                $(document.getElementById("PastWarning-`+ usr +`")).click(()=>window.parent.postMessage(\`RWMAviewUserPg\\\``+ usr +`\`)); // push request upstairs on click
                                
                                // Now register all tooltips (fine if comp. handler undefined bc others will handle)
                                for (let item of document.getElementsByClassName("mdl-tooltip")) {
                                    componentHandler.upgradeElement(item); 
                                }

                                // Update progressbar from object keys
                                setProgress(`+ Object.keys(userObj).indexOf(usr) +`, `+ (Object.keys(userObj).length - 1) +`);
                            });
                        </script>
                        </td>
                        <td>-</td> <!-- text to add -->
                        <td>-</td> <!-- under date -->
                        </tr>
                    </tr>
                    `;
                    // Add event handler for edit click
                    addMessageHandler("summaries "+ usr, ()=>{
                        let revList = ``;
                        userInfo.summaries.forEach(el=>{
                            revList += el + "<hr/>";
                        });
                        rw.ui.confirmDialog(`
                        <h2 style="font-weight: 200;font-size:45px;line-height: 48px;">Related Changes</h2>
                        <div style="height:400px;overflow:auto;">
                        `+ revList +
                        `</div>`,
                        "CLOSE", ()=>dialogEngine.closeDialog(),
                        "", ()=>{}, 500);
                    });


                    // Add event handler for notice dialog
                    addMessageHandler("RWMATnewNotice", ()=>{
                        rw.ui.beginWarn(true, "(RedWarn MAT)", mw.config.get("wgRelevantPageName"), "APPLY TO CHECKED", r=>{
                            // Now push to iframe
                            rw.multiAct.dialog.getElementsByTagName("iframe")[0].contentWindow.postMessage(
                                "applyToChecked`" + btoa(r) +
                                "`Yes`Warn User"
                                , '*');
                        }, true); // Show Warn User dialog, true at end hides user info
                    });

                    // Event Handler for new msg
                    addMessageHandler("RWMATnewMsg", ()=>{
                        rw.ui.newMsg("(RedWarn MAT)", true, "APPLY TO CHECKED", r=>{ // new talk page message dialog
                            // Now push to iframe
                            rw.multiAct.dialog.getElementsByTagName("iframe")[0].contentWindow.postMessage(
                                "applyToChecked`" + btoa(r) +
                                "`No`New Message"
                                , '*');
                        });
                    });

                    // TODO: event handler for quick template

                    // Event handler for Commit Changes Confirmation Dialog
                    addMessageHandler("RWMATcommitSelectedConfirm`*", cI=>{
                        let userCount = cI.split("`")[1];
                        // Show confirm dialog
                        rw.ui.confirmDialog(`
                        Are you sure you want to complete actions for <b>`+ userCount + ` user` + (userCount > 1 ? "s" : "") +`</b>?`,
                        "CONFIRM", ()=>{
                            dialogEngine.closeDialog(); // close dialog
                            rw.ui.loadDialog.show("Editing talk pages..."); // loading dialog
                            rw.multiAct.dialog.getElementsByTagName("iframe")[0].contentWindow.postMessage(
                                "confirmSelected", '*'); // Set the wheels in motion
                        },
                        "CANCEL", ()=>{
                            dialogEngine.closeDialog(); // close dialog on cancel
                        }
                        ,0);
                    });

                    // Now where the business happens
                    let actionsToTake = []; // array of objects

                    // Assemble array handler
                    addMessageHandler("RWMATToAdd`*", cI=>{
                        actionsToTake.push({
                            "user" : cI.split("`")[3],
                            "underDate" : cI.split("`")[2] == "true",
                            "wikiTxt" : atob(cI.split("`")[1])
                        });
                    });

                    // Actuall edit handler
                    addMessageHandler("RWMATfinishedandcommit", ()=>{
                        // Assemble commit handler
                        let editHandler = i=>{
                            let action = actionsToTake[i];
                            // Time to make the actual contrib
                            rw.info.addWikiTextToUserPage(action.user, action.wikiTxt, action.underDate, "Complete [[WP:REDWARN/MAT|MAT]] action", false, false, ()=>{
                                // Check we can continue
                                if (i == actionsToTake.length - 1) {
                                    // We done
                                    rw.ui.loadDialog.close();

                                    // Notify of completion
                                    rw.ui.confirmDialog(`
                                    Actions complete!`,
                                    "CLOSE", ()=>{
                                        dialogEngine.closeDialog(); // close dialog
                                    },
                                    "", ()=>{},0);
                                } else {
                                    // Continue
                                    editHandler(i+1);
                                }
                            });
                        };
                        
                        editHandler(0); // start it all
                    });
                }
            }

            // Open screen - do not use dialogEngine as other dialogs use this - allow for overlay
            // Generate container
            let content = mdlContainers.generateContainer(eval(rw_includes["multipleAction.html"]), document.body.offsetWidth, document.body.offsetHeight);
            // Dialog gubbins
            // Init if needed
            if ($("#MAdialogContainer").length < 1) {
                // Need to init
                $("body").prepend(`
                    <div id="MAdialogContainer">
                    </div>
                `);
                // Add close event
                addMessageHandler("closeDialogMA", ()=>{rw.multiAct.dialog.close();}); // closing
            }
            
            $("#MAdialogContainer").html(`
            <dialog class="mdl-dialog" id="rwMAdialog">
                `+ content +`
            </dialog>
            `);


            rw.multiAct.dialog = document.querySelector('#rwMAdialog'); // set dialog

            $("#rwMAdialog").attr("style", "padding:inherit;"); // set no padding
            // Firefox issue fix
            if (! rw.multiAct.dialog.showModal) {
                dialogPolyfill.registerDialog(rw.multiAct.dialog);
            }

            rw.multiAct.dialog.showModal(); // Show dialog

            // Now load all the edit counts and last warning levels
            let usernames = Object.keys(userObj);
            let userPages = {};

            // Add userpage preview handler
            addMessageHandler("RWMAviewUserPg`*", cI=>{
                let userPgWikiTxt = userPages[cI.split("`")[1]]; // get wikitext from obj
                // Parse wikitext (show loading dialog first)
                rw.ui.loadDialog.show("Parsing userpage...");
                rw.info.parseWikitext(userPgWikiTxt, parsed=>{ // Request
                    rw.ui.loadDialog.close(); // close load dialog
                    // Show preview dialog
                    rw.ui.confirmDialog(`
                        <style>
                            h2 {
                                font-size: 20px;
                                line-height: 0px;
                            }
                            .mw-editsection {
                                display: none;
                            }
                        </style>

                        <div style="height:500px;overflow:auto;">
                            `+parsed+`
                        </div>
                    `,
                    "CLOSE", ()=>dialogEngine.closeDialog(),
                    "", ()=>{}, 500);
                });
            });

            // Last Warn level and userpg handler (done as essentially foreach, called from editcount)
            let lastWarnLevelHandler = (i, callback) => { // LAST WARNING
                let un = usernames[i];
                rw.info.lastWarningLevel(rw.info.targetUsername(un), (w, usrPgMonth, userPg)=>{
                    let lastWarning = [ // Return HTML for last warning level.
                        // NO PAST WARNING
                        `
                        <span class="material-icons" id="PastWarning-`+un+`" style="cursor:pointer;position: relative;top: 5px;padding-left: 10px;color:green;">thumb_up</span>
                        <div class="mdl-tooltip mdl-tooltip--large" for="PastWarning-`+un+`">
                            <span style="font-size:x-small;">
                            No notices this month.
                            </span>
                        </div>
                        `,
        
                        // NOTICE
                        `
                        <span class="material-icons" id="PastWarning-`+un+`" style="cursor:pointer;position: relative;top: 5px;padding-left: 10px;color:blue;">info</span>
                        <div class="mdl-tooltip mdl-tooltip--large" for="PastWarning-`+un+`">
                            <span style="font-size:x-small;">
                            Has been given a Level 1 notice<br/>this month.
                            </span>
                        </div>
                        `,
                        // CAUTION
                        `
                        <span class="material-icons" id="PastWarning-`+un+`" style="cursor:pointer;position: relative;top: 5px;padding-left: 10px;color:orange;" >announcement</span>
                        <div class="mdl-tooltip mdl-tooltip--large" for="PastWarning-`+un+`">
                            <span style="font-size:x-small;">
                            Has been given a Level 2 caution<br/>this month.
                            </span>
                        </div>
                        `,
                        // Warning- in red. RedWarn, get it? This is the peak of programming humour.
                        /// Haha, whoops? This joke has turned up twice. Who'd ever think they'd see reused code?
                        `
                        <span class="material-icons" id="PastWarning-`+un+`" style="cursor:pointer;position: relative;top: 5px;padding-left: 10px; color:red;" >report_problem</span>
                        <div class="mdl-tooltip mdl-tooltip--large" for="PastWarning-`+un+`">
                            <span style="font-size:x-small;">
                            Has been given a Level 3 warning<br/>this month.
                            </span>
                        </div>
                        `,
        
                        // Final/Only Warning (dark red)
                        `
                        <span class="material-icons" id="PastWarning-`+un+`" style="cursor:pointer;position: relative;top: 5px;padding-left: 10px;color:#a20000;" >report</span>
                        <div class="mdl-tooltip mdl-tooltip--large" for="PastWarning-`+un+`">
                            <span style="font-size:x-small;">
                            Has been given a Level 4 Final<br/>or ONLY warning.
                            </span>
                        </div>
                        `
                    ][w];

                    // Set userpage var for preview
                    userPages[un] = userPg;

                    // Now push to iframe
                    rw.multiAct.dialog.getElementsByTagName("iframe")[0].contentWindow.postMessage("PastWarning-"+ un + "`" + lastWarning, '*');
                    callback(); // Send callback
                });
            };

            let editCounterHandler = (i, isRetry)=>{ // EDIT COUNT
                if (rw.info.isUserAnon(usernames[i])){ // skip edits by anon IPs as they will not return, just set lastwarnlevel
                    lastWarnLevelHandler(i, ()=>{
                        editCounterHandler(i + 1);
                    });
                    return;
                } 
                rw.info.getUserEditCount(usernames[i], cI=>{
                    // Push to iframe
                    // Set c to blank space if edit count undefined or edit count with number sorted if is
                    let c = cI == null ? "-" : cI.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","); // regex adds commas to number to make more readable
                    rw.multiAct.dialog.getElementsByTagName("iframe")[0].contentWindow.postMessage("editCount-"+ usernames[i] + "`" + c, '*');
                    
                    // Make sure there wasn't an issue, if so redo, and if redo fails just continue
                    if ((cI == null) && !isRetry) {
                        editCounterHandler(i, true); // do it again with retry flag
                        return;
                    }
                    // Now last warning handler
                    lastWarnLevelHandler(i, ()=>{
                        // Make sure there is a next
                        if (i != usernames.length - 1) {
                            editCounterHandler(i + 1); // do it again with next user
                        } // else we done!
                    });
                });
            };

            editCounterHandler(0); // call and begin load

        }, ()=>{
            // When no perms
            rw.ui.confirmDialog(`
            Sorry, but to prevent misuse you have to be an extended confirmed user to use the multiple action tool. Check back later!
            `,
            "OKAY", ()=>dialogEngine.closeDialog(),
            "", ()=>{}, 23);
        });
    }
};
// rw-source: quickTemplate.js
rw.quickTemplate = { // Quick template UI and loader

    "packStore" : [],

    "packs" : ()=>{ // Get packs from config and default and merge to packstore
        if (rw.quickTemplate.packStore.length > 0) return rw.quickTemplate.packStore; // return if already set

        if (rw.config.templatePacks == null) { // if templates not set
            rw.config.templatePacks = []; // set to empty
            rw.info.writeConfig(true, ()=>{}); // update config page
        }
        rw.quickTemplate.packStore = rw.quickTemplate.packStore.concat(rw.config.templatePacks);
        return rw.quickTemplate.packStore; // return
    },

    "packCodeToPageName" : packCode=>{ // Convert a pack code to it's real page name
        return "User:" + packCode.split("/")[0] + "/RedWarn_QuickTemplate_packInstall_" + packCode.split("/")[1] + ".js";
    },


    "openSelectPack" : un=>{
        // Assemble buttons for each pack
        let finalBtnStr = "";
        rw.quickTemplate.packs().forEach((pack, i) => {
            if (pack.name == null) return; // skip "undefined by undefined"
            finalBtnStr += `
            <button class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent" style="width:85%" onclick="window.parent.postMessage('selectPack\``+i+`', '*');">
                `+ pack.name +` by `+ pack.createdBy +`
            </button>
            <!-- EDIT BUTTON -->
            <button class="mdl-button mdl-js-button mdl-js-ripple-effect" style="width:5%" onclick="window.parent.postMessage('editPack\``+i+`', '*');">
                <i class="material-icons">create</i>
            </button>
            <br/><br/>
            `;
        });

        // Add toast handler
        addMessageHandler("pushToast`*", m=>rw.visuals.toast.show(m.split('`')[1],false,false,4000));
        // Add new pack handler
        addMessageHandler("qTnewPack", ()=>rw.quickTemplate.newPack());

        // Show pack selection dialog
        dialogEngine.create(mdlContainers.generateContainer(eval(rw_includes["quickTemplateSelectPack.html"]), 500, 530)).showModal();

        // Pack Selected Handler
        addMessageHandler("selectPack`*", cI=>{
            dialogEngine.closeDialog();

            let i = parseInt(cI.split("`")[1]); // get index from call
            rw.quickTemplate.selectTemplate(un, i); // open select template screen
        });

        // Pack edit handler
        addMessageHandler("editPack`*", cI=>{
            dialogEngine.closeDialog();

            let i = parseInt(cI.split("`")[1]); // get index from call
            rw.quickTemplate.selectTemplate(un, i, true); // open select template screen, true denotes edit
        });
    },

    "selectTemplate" : (un, i, editMode) => {
        if (editMode) un = "(edit mode)";
        let selectedPack = rw.quickTemplate.packs()[i];

        let finalSelectStr = "<hr />"; // final select string
        selectedPack.templates.forEach((template,i)=>{
            finalSelectStr += `
            <label class="mdl-radio mdl-js-radio mdl-js-ripple-effect" for="template-`+ i +`">
                <input type="radio" id="template-`+ i +`" class="mdl-radio__button" name="options" value="`+ i +`">
                <span class="mdl-radio__label">`+ template.title +`</span>
            </label><br>
            <i>`+ template.about +`</i>
            <hr />
            `;
        });

        // Add edit mode handlers
        if (editMode) {
            addMessageHandler("qTdeletePack", ()=>{
                // Confirm
                rw.ui.confirmDialog(`
                Are you sure you want to delete this pack?<br />
                <b>Note:</b> This will only delete the pack from your account. If it is published, this won't unpublish it.
                `,
                    "YES, DELETE.", ()=>{
                        dialogEngine.closeDialog(); // close prompt
                        rw.ui.loadDialog.show("Deleting...");
                        // Now remove at index
                        rw.config.templatePacks.splice(i, 1);
                        // Now refresh and save config
                        rw.info.writeConfig(); // save config, will also refresh
                    },
                    "CANCEL", ()=>{
                        // On cancel just recall
                        dialogEngine.closeDialog();
                        rw.quickTemplate.selectTemplate(un, i, editMode); // reshow, then done!
                    }, 45
                );
            });

            // Handle edit and new

            addMessageHandler("qTNew`*", cI=>{ //create new template
                dialogEngine.closeDialog();

                // Set up vars
                let nTitle = cI.split("`")[1];
                let nAbout = cI.split("`")[2];
                
                // Add to our template array
                rw.config.templatePacks[i].templates.push({
                    "title": nTitle,
                    "about": nAbout,
                    "content": "<!-- Enter your content here! This box fully supports wikitext. Once done, you can check that your template works and looks as expected by clicking the test button. -->"
                });
                // Clear and reload config
                rw.ui.loadDialog.show("Creating...");
                rw.info.writeConfig(true, ()=>{ // save config
                    rw.ui.loadDialog.close();
                    rw.quickTemplate.packStore = []; // clear out packs
                    
                    // Refresh selected pack
                    selectedPack = rw.quickTemplate.packs()[i];
                    // Open editor
                    rw.quickTemplate.editTemplate(i, selectedPack.templates.length - 1); // w pack index and template index
                }); 
            });

            addMessageHandler("qTEdit`*", cI=>{
                // Open editor
                rw.quickTemplate.editTemplate(i, cI.split("`")[1]); // w pack index and template index
            });

            // Publish
            addMessageHandler("qTPublish", ()=>{
                if (selectedPack.packCode == null) { // Pack isn't published
                    rw.ui.confirmDialog("This pack isn't published. If you'd like to let other editors use your pack, click 'Publish Now'",
                    "PUBLISH NOW", ()=>{
                        // Publish new template
                        dialogEngine.closeDialog(); // close dialog
                        rw.quickTemplate.publish(selectedPack, true, i); // true here denotes is new
                    },
                    "CANCEL", ()=>dialogEngine.closeDialog(), 18);

                } else {
                    // Pack is published
                    rw.ui.confirmDialog("This pack is published. If you'd like to update your pack for other editors, click 'Update Now'",
                    "UPDATE NOW", ()=>{
                        // Publish new template
                        dialogEngine.closeDialog(); // close dialog
                        rw.quickTemplate.publish(selectedPack); // just normal update
                    },
                    "CANCEL", ()=>dialogEngine.closeDialog(), 18);
                }
            });
        }
        // END edit mode handlers

        // Now we need to assemble the select screen
        // Show template selection dialog
        dialogEngine.create(mdlContainers.generateContainer(eval(rw_includes["quickTemplateSelectTemplate.html"]), 500, 530)).showModal();

        // Continue Handler (not called in edit mode)
        addMessageHandler("qTNext`*", cI2=>{
            let i2 = parseInt(cI2.split("`")[1]); // i from above frame
            rw.quickTemplate.applyTemplate(selectedPack, i2, un); // open apply template screen
        });
    },

    "applyTemplate" : (selectedPack, i2, unI) => {
        let selectedTemplate = selectedPack.templates[i2];
        let contentStr = selectedTemplate.content;
        let un = rw.info.targetUsername(unI);
        let addUnderDate = contentStr.includes("##RW UNDERDATE##");
        // Now we need to assemble inputs for this template


        // Add dialog handlers for preview
        addMessageHandler("generatePreview`*", m=>{
            rw.info.parseWikitext(m.split("`")[1], parsed=>{ // Split to Wikitext and send over to the API to be handled
                dialogEngine.dialog.getElementsByTagName("iframe")[0].contentWindow.postMessage({
                    "action": "parseWikiTxt",
                    "result": parsed}, '*'); // push to container for handling in dialog and add https:// to stop image breaking
            });
        });

        // Add handlers for submit
        addMessageHandler("qtDone`*", eD=> {
            let wikiTxtToAdd = atob(eD.split("`")[1]); // params
            
            // MAKE EDIT
            rw.info.addWikiTextToUserPage(rw.info.targetUsername(un), wikiTxtToAdd, addUnderDate, "[[w:en:Wikipedia:RedWarn/QTPACKS|" + selectedPack.name + " - " + selectedTemplate.title + "]]");
        });

        // Now generate text input code - SYNTAX {{RWTEXT|Label|ID}}
        let finalAdditionalInputs = ``;
        // NORMAL TEXT INPUT
        (m=>{
            if (m != null) { // to stop errors
                m.forEach(match=>{ // for each match to regex
                    let v = match.split("|"); // split at pipe for varibles
                    let label = v[1]; // strip label
                    let id = v[2].split("}")[0]; // strip ID
                    // Now add our textbox
                    finalAdditionalInputs += `
                    <div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label" style="width:100%">
                        <input class="mdl-textfield__input rwCustomTextInput" type="text" id="${btoa(match)}"> <!-- ID is b64 of what needs to be replaced -->
                        <label class="mdl-textfield__label" for="${btoa(match)}">${label}</label>
                    </div>
                    `;
                });
            }
        })(selectedTemplate.content.match(/{{RWTEXT\|[^}}]*\|[^{{]*}}/g)); // regex here for above function
        
        // Finally, show final submit dialog
        dialogEngine.create(mdlContainers.generateContainer(eval(rw_includes["quickTemplateSubmit.html"]), 500, 550)).showModal();
    },

    "newPack" : ()=> {
        // Creates a new pack and saves to config
        // Add toast handler
        addMessageHandler("pushToast`*", m=>rw.visuals.toast.show(m.split('`')[1],false,false,4000));

        addMessageHandler("qTcreateNew`*", cI=>{
            // Handle calls the create new pack
            let packName = cI.split("`")[1];
            rw.config.templatePacks.push(
                {
                    "name" : packName,
                    "createdBy": rw.info.getUsername(),
                    "templates" : []
                }
            ); // add to config
            rw.ui.loadDialog.show("Creating...");
            rw.info.writeConfig(true, ()=>{ // save config
                rw.ui.loadDialog.close();
                rw.quickTemplate.packStore = []; // clear out packs

                // Refresh packs and open selection screen in edit mode
                rw.quickTemplate.selectTemplate("",rw.quickTemplate.packs().length - 1, true); // true here distingishes edit mode
            });
            
        });

        // Finally, show the dialog
        dialogEngine.create(mdlContainers.generateContainer(eval(rw_includes["quickTemplateNewPack.html"]), 500, 200)).showModal();
    },

    "editTemplate" : (selectedPackI, selectedTemplateI)=>{
        // Used to edit template
        let selectedPack = rw.quickTemplate.packs()[selectedPackI];
        let selectedTemplate = selectedPack.templates[selectedTemplateI];
        let saveHandler = (b64data, callback)=>{ // Save Data handler
            // Set vars
            let title = atob(b64data.split("`")[1]);
            let about = atob(b64data.split("`")[2]);
            let content = atob(b64data.split("`")[3]);
            rw.config.templatePacks[selectedPackI].templates[selectedTemplateI] = {
                "title": title,
                "about": about,
                "content": content
            };
            // Clear and reload config
            rw.ui.loadDialog.show("Saving...");
            rw.info.writeConfig(true, ()=>{ // save config
                rw.ui.loadDialog.close();
                rw.quickTemplate.packStore = []; // clear out packs
                
                // Refresh selected pack
                selectedPack = rw.quickTemplate.packs()[selectedPackI];
                
                // Refresh selected template
                selectedTemplate = selectedPack.templates[selectedTemplateI];

                if (callback != null) callback(); // send callback if set
            }); 
        };

        // Save changes handler
        addMessageHandler("qTSave`*", cI=>{
            saveHandler(cI);
        });

        // Close Editor Handler
        addMessageHandler("qTClose`*", cI=>{
            saveHandler(cI, ()=>dialogEngine.closeDialog());
        });

        // Test Handler
        addMessageHandler("qTTest`*", cI=>{
            saveHandler(cI, ()=> {
                // Open normal apply window with sandbox target
                rw.quickTemplate.applyTemplate(selectedPack, selectedTemplateI, "Sandbox for user warnings");
            });
        });

        // Finally, open the edit template dialog
        dialogEngine.create(mdlContainers.generateContainer(eval(rw_includes["quickTemplateEditTemplate.html"]), 500, 550)).showModal();
    },

    "publish" : (selectedPack, isNew, selectedPackI)=> { // makes a listing on the WP:REDWARN/QTPACKS page if isnew is set to true
        // Publish new pack
        rw.ui.loadDialog.show("Publishing...");
 
        let packCode = selectedPack.packCode; // get packcode from selected pack
        if (packCode == null) packCode = rw.info.getUsername() + "/" + rw.makeID(10); // Generate a new pack code if not already published

        let packPage = rw.quickTemplate.packCodeToPageName(packCode); // get page to write script to

        // Now, generate script that installs this pack
        let packInstallScript = `
/* <nowiki>
+------------------------------------+
|  !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!  |
|  Generated automatically.          |
|  DO NOT EDIT THIS FILE OR ADD TO   |
|  YOUR COMMON.JS FILE. DOING SO     |
|  WILL CAUSE SERIOUS ISSUES.        |
+------------------------------------+

Install script (c) Ed. E (User:Ed6767) - license: https://gitlab.com/redwarn/redwarn-web
*/
rw.ui.loadDialog.show("Installing...");
let packSource = JSON.parse(atob("${btoa(JSON.stringify(selectedPack))}")); // Load source from currentpack
rw.config.templatePacks.push(packSource); // Push into config
rw.info.writeConfig(true, ()=>{ // save config
    rw.ui.loadDialog.close();
    rw.quickTemplate.packStore = []; // clear out packs
    
    // Show success dialog
    rw.ui.confirmDialog(
    "Pack installed!",
    "RELOAD PAGE", ()=>window.location.reload(),
    "", ()=>{}, 0);
}); 
// </nowiki>
        `;

        // Script generated, let's continue
        //Commit to script page
        $.post(rw.wikiAPI, {
            "action": "edit",
            "format": "json",
            "token" : mw.user.tokens.get("csrfToken"),
            "title" : packPage,
            "summary" : "Publish Autogenerated QTPack Install [[w:en:Wikipedia:RedWarn|(RedWarn "+ rw.version +")]]", // summary sign here
            "text": packInstallScript,
            "tags" : ((rw.wikiID == "enwiki") ? "RedWarn" : null) // Only add tags if on english wikipedia
        }).done(dt => {
            // We done. Check for errors, then callback appropriately
            if (!dt.edit) {
                // Error occured or other issue
                console.error(dt);
                rw.ui.loadDialog.close();
                rw.visuals.toast.show("Sorry, there was an error. See the console for more info. Your pack has not been published.");
            } else {
                // Success! 
                if (!isNew) { // if not a new pack, show update done screen and exit
                    rw.loadDialog.close();
                    rw.ui.confirmDialog("Pack updated successfully!", "DONE", ()=>dialogEngine.closeDialog() , "", ()=>{}, 0);
                    return;
                } 
                
                // CONINUES ONLY IF NEW
                // Now make change to config in our preferences re new change
                rw.config.templatePacks[selectedPackI].packCode = packCode; // add packcode to template config
                rw.info.writeConfig(true, ()=>{ // save config
                    rw.quickTemplate.packStore = []; // clear out packs
                    // Now add to QTPacks page
                    $.post(rw.wikiAPI, {
                        "action": "edit",
                        "format": "json",
                        "token" : mw.user.tokens.get("csrfToken"),
                        "title" : "Wikipedia:RedWarn/help/Quick_Template/templates",
                        "summary" : "Publish new pack [[w:en:Wikipedia:RedWarn|(RedWarn "+ rw.version +")]]", // summary sign here
                        "appendtext": // Add our section wikitxt here
                        `
=== ${selectedPack.name} - by ${selectedPack.createdBy} ===
''No additional info provided - pack owner, please edit this section and add additional info here or your pack may be removed.''
==== Pack Code ====
<code>${packCode}</code>` ,
"tags" : ((rw.wikiID == "enwiki") ? "RedWarn" : null) // Only add tags if on english wikipedia
                    }).done(dt2 => {
                        if (!dt.edit) {
                            // Error occured or other issue
                            console.error(dt);
                            rw.ui.loadDialog.close();
                            rw.visuals.toast.show("Sorry, there was an error. See the console for more info. Your pack has not been published to the QTPack page, maybe add manually.");
                        } else {
                            // Done! Load QTPack page
                            redirect("https://en.wikipedia.org/wiki/WP:REDWARN/QTPACKS"); // No rw.wikiBase due to lack of page there
                        }
                    });
                }); 
            }
        });
    }
};
// rw-source: pageProtect.js
/**
 * RedWarn's RFPP feature
 * @class rw.pageProtect
 */
rw.pageProtect = { // Used for [[WP:RFPP]]
    /**
     * The RFPP page that RedWarn will edit
     * @property rfppPage
     * @type {string}
     * @extends rw.pageProtect
     */
    "rfppPage" : "Wikipedia:Requests_for_page_protection", // !!! FOR PRODUCTION USE Wikipedia:Requests_for_page_protection ELSE USE User:Ed6767/sandbox/rwTests/rpp !!!
    // THIS MODULE IS NOW LIVE!!!

    /**
     * An object containing the protection levels for this Wiki
     * @property editProtectionLevels
     * @type {object}
     * @extends rw.pageProtect
     */
    // Define protection levels
    "editProtectionLevels" : { //edit protection - SET IN ORDER AS DISTINGUISHES BETWEEN UPGRADE AND DOWNGRADE
        "unprotected" : { // unprotected
            "title" : "Page is not edit protected",
            "name" : "no protection",
            "image" : "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Semi-protection-unlocked.svg/320px-Semi-protection-unlocked.svg.png"
        },

        "pendingChanges" : {
            // Edits only
            "title" : "Page is pending changes protected",
            "name" : "pending changes protection",
            "image" : "https://upload.wikimedia.org/wikipedia/en/thumb/b/b7/Pending-protection-shackle.svg/240px-Pending-protection-shackle.svg.png"
        },

        "autoconfirmed" : {
            "title" : "Page is semi-protected",
            "name" : "semi-protection",
            "image" : "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/Semi-protection-shackle.svg/240px-Semi-protection-shackle.svg.png"
        },

        "extendedconfirmed" : {
            "title" : "Page is extended protected",
            "name" : "extended protection",
            "image" : "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Extended-protection-shackle.svg/240px-Extended-protection-shackle.svg.png"
        },

        "templateeditor" : { // template protection
            "title" : "Page is template protected",
            "name" : "template protection",
            "image" : "https://upload.wikimedia.org/wikipedia/en/thumb/5/53/Template-protection-shackle.svg/240px-Template-protection-shackle.svg.png"
        },

        "sysop" : {
            "title" : "Page is fully protected",
            "name" : "full protection",
            "image" : "https://upload.wikimedia.org/wikipedia/en/thumb/4/44/Full-protection-shackle.svg/240px-Full-protection-shackle.svg.png"
        },

        "cascading" : {
            // Cascading protection
            "title" : "Page is cascade protected",
            "name" : "cascade protection",
            "image" : "https://upload.wikimedia.org/wikipedia/en/thumb/0/0f/Cascade-protection-shackle.svg/240px-Cascade-protection-shackle.svg.png"
        }
    },

// for move protection add smallprint: move protection limit: x

    /**
     * Calls back with the current protection level of the current page
     *
     * @param {function} callback callback(object {edit: level, move:level})
     * @method getCurrentPageProtection
     * @extends rw.pageProtect
     */
    "getCurrentPageProtection" : callback=>{ // Callback {edit: level, move:level}
        // Request protection level from mediawiki
        $.getJSON(rw.wikiAPI + "?action=query&format=json&prop=info%7Cflagged&inprop=protection&titles="+ encodeURIComponent(mw.config.get("wgRelevantPageName")), r=>{
            let pageInfo = r.query.pages[Object.keys(r.query.pages)[0]];

            let editProtection = "unprotected";
            let moveProtection = "unprotected";

            pageInfo.protection.forEach(protection => {
                if ((editProtection == "unprotected") && (protection.type == "edit")) editProtection = protection.level; // set edit protection level
                if ((moveProtection == "unprotected") && (protection.type == "move")) moveProtection = protection.level; // set move protection level
                if ((protection.cascade != null) && (protection.type == "edit")) editProtection = "cascading"; // cascading edit protection
            });

            // Detect pending changes protection
            if (pageInfo.flagged != null) {
                if (pageInfo.flagged.protection_level != null) editProtection = "pendingChanges";
            }

            callback({"edit": editProtection, "move": moveProtection}); // done, send callback
        });
    },
    
    /**
     * Opens the page protection dialog for this page
     *
     * @method open
     * @extends rw.pageProtect
     */
    "open" : ()=>{ // Open page protection dialog for this page
        // Get current page protection level
        rw.pageProtect.getCurrentPageProtection(protection=>{
            let protectionInfo = rw.pageProtect.editProtectionLevels[protection.edit];

            // Create the list of levels
            let finLevelListStr = ``;
            for (let levelKey in rw.pageProtect.editProtectionLevels) {
                if (rw.pageProtect.editProtectionLevels.hasOwnProperty(levelKey)) {
                    let level = rw.pageProtect.editProtectionLevels[levelKey];
                    finLevelListStr += `
                    <!-- Add image -->
                    <img src="${level.image}" style="height: 24px;padding-right:10px;" />

                    <!-- Radiobutton -->
                    <label class="mdl-radio mdl-js-radio mdl-js-ripple-effect" for="${levelKey}" id="${levelKey}_outer">
                        <input type="radio" id="${levelKey}" class="mdl-radio__button" name="options" value="1" ${(levelKey == protection.edit) ? `disabled style="cursor:help"` : ``}> <!-- Disable if our current -->
                        <span class="mdl-radio__label">${level.name.charAt(0).toUpperCase() + level.name.slice(1)}</span> <!-- Capitalise first letter -->
                    </label>
                    <!-- Add tooltip if disabled -->
                    ${(levelKey == protection.edit) ? `
                    <div class="mdl-tooltip mdl-tooltip--large" for="${levelKey}_outer">
                        This is the current protection level.
                    </div>
                    ` : ``} <!-- END TOOLTIP -->
                    <hr />
                    `;
                }
            }

            // Add event handlers

            // Add toast handler
            addMessageHandler("pushToast`*", m=>rw.visuals.toast.show(m.split('`')[1],false,false,2500));

            // SUBMIT HANDLER
            addMessageHandler("submitRFPP`*", m=>{
                // Get info from string in
                let requestLevel = m.split("`")[1];
                let requestProtect = rw.pageProtect.editProtectionLevels[requestLevel];
                let changeCoreReason = m.split("`")[2];
                let changeExtraInfo = m.split("`")[3];
                let requestDuration = m.split("`")[4];
                let requestType = "";
                // Distingush whether or not this is an upgrade or download request
                if (Object.keys(rw.pageProtect.editProtectionLevels).indexOf(requestLevel) > Object.keys(rw.pageProtect.editProtectionLevels).indexOf(protection.edit)) {
                    // Is upgrade request
                    requestType = "upgrade";
                } else {
                    requestType = "downgrade";
                }
                
                // Let's submit - show load dialog
                rw.ui.loadDialog.show("Submitting request...");

                // TIME TO EDIT :)

                // generate heading to add under for upgrade or downgrade
                let headingToInsertUnder = "== "+ (requestType == "upgrade" ? "Current requests for increase in protection level" : "Current requests for reduction in protection level") +" ==";
                
                // Assemble text to add per page template
                let text = `=== [[:${mw.config.get("wgRelevantPageName").replace(/_/g, ' ')}]] ===
* {{pagelinks|${mw.config.get("wgRelevantPageName").replace(/_/g, ' ')}}}
'''${(requestProtect.name == "no protection" ? "Unprotection" : requestDuration + " " + requestProtect.name)}:''' ${(changeCoreReason == "Other rationale" ? "" : changeCoreReason + `. `)}${changeExtraInfo} `+ rw.sign();

                // New req current page.
                $.getJSON(rw.wikiAPI + "?action=query&prop=revisions&titles="+ encodeURIComponent(rw.pageProtect.rfppPage) +"&rvslots=*&rvprop=content&formatversion=2&format=json", latestR=>{
                    // Grab text from latest revision of talk page
                    // Check if exists
                    let revisionWikitext = "";
                    if (!latestR.query.pages[0].missing) { // If page isn't missing, i.e exists
                        revisionWikitext = latestR.query.pages[0].revisions[0].slots.main.content;
                    } else {
                        // Bug!
                        rw.ui.loadDialog.text("ERR: RFPP page nonexist!");return; // send basic and EXIT as unlikely to be seen expect by dev
                    }
                    let wikiTxtLines = revisionWikitext.split("\n");
                    let finalTxt = "";

                    // Check if page already reported
                    if (revisionWikitext.includes(mw.config.get("wgRelevantPageName").replace(/_/g, ' '))) {
                        // Don't continue and show toast
                        rw.ui.loadDialog.close();
                        rw.visuals.toast.show("It looks like an RFPP request already exists for this page.", false, false, 5000);
                        return;
                    }

                    // Now submit under heading
                    // Locate where the current section is and add ours
                    let locationOfLastLine = wikiTxtLines.indexOf(headingToInsertUnder) + 1; // in case of date heading w nothing under it
                    for (let i = wikiTxtLines.indexOf(headingToInsertUnder) + 1; i < wikiTxtLines.length; i++) {
                        if (wikiTxtLines[i].startsWith("== ")) { 
                            // New section
                            locationOfLastLine = i - 1; // the line above is therefore the last
                            console.log("exiting loop: " +wikiTxtLines[locationOfLastLine]);
                            break; // exit the loop
                        } else if (i == wikiTxtLines.length - 1) {
                            // End of page, let's break and set location of last line.
                            locationOfLastLine = i;
                            break; // exit loop
                        }
                    }
                    
                    if (locationOfLastLine == wikiTxtLines.length - 1) {
                        // To prevent to end notices squishing against eachother
                        // Same as without, but we just include the date string at bottom of page
                        wikiTxtLines.push(["\n" + text]);
                    } else {
                        wikiTxtLines.splice(locationOfLastLine, 0, ["\n" + text]); // Add notice to array at correct position. Note the "" at the start is for a newline to seperate from prev content
                    }

                    // Process final string
                    wikiTxtLines.forEach(ln => finalTxt = finalTxt + ln + "\n"); // Remap to lines
                    console.log(finalTxt);

                    // Push edit using CSRF token
                    $.post(rw.wikiAPI, {
                        "action": "edit",
                        "format": "json",
                        "token" : mw.user.tokens.get("csrfToken"),
                        "title" : rw.pageProtect.rfppPage,
                        "summary" : `Requesting protection change for [[${mw.config.get("wgRelevantPageName").replace(/_/g, ' ')}]] [[w:en:WP:RW|(RW ${rw.version})]]`, // summary sign here
                        "text": finalTxt,
                        "tags" : ((rw.wikiID == "enwiki") ? "RedWarn" : null) // Only add tags if on english wikipedia
                    }).done(dt => {
                        // We done. Check for errors, then callback appropriately
                        if (!dt.edit) {
                            // Error occured or other issue
                            console.error(dt);
                            rw.ui.loadDialog.close();
                            rw.visuals.toast.show("Sorry, there was an error. See the console for more info. Your RFPP has not been sent.");
                            // Reshow dialog
                            dialogEngine.dialog.showModal();
                        } else {
                            // Success! 
                            rw.ui.loadDialog.close();
                            rw.visuals.toast.show("RFPP requested.");
                        }
                    });
                    
                    
                });
            });

            // Open dialog
            dialogEngine.create(mdlContainers.generateContainer(eval(rw_includes["requestPageProtect.html"]), 600, 630)).showModal();
        });
    }
};
// rw-source: firstTimeSetup.js
/**
 * rw.firstTimeSetup provides a welcome and first time setup screen for new users
 * @class rw.firstTimeSetup
 */
rw.firstTimeSetup = {
    /**
     * Launches the first time setup wizzard
     * @method launch
     * @extends rw.firstTimeSetup
     */
    "launch" : ()=>{
        addMessageHandler("config`*", rs=>{ // On config change
            // New config recieved
            let config = JSON.parse(atob(rs.split("`")[1])); // b64 encoded json string
            //Write to our config
            for (const key in config) {
                if (config.hasOwnProperty(key)) {
                    const element = config[key];
                    rw.config[key] = element; // add or change value
                }
            }

            // Push change
            rw.ui.loadDialog.show("Saving...");
            rw.info.writeConfig(false);
        }); 

        addMessageHandler("resetConfig", rs=>{
            // Reset config recieved, set config back to default
            rw.info.getConfig(()=>{}, true); // TRUE HERE MEANS RESET TO DEAULT
        });

        // Add load new theme handler
        addMessageHandler("newThemeDialog", ()=>rw.ui.loadDialog.show("Changing theme..."));
        addMessageHandler("loadDialogClose", ()=>rw.ui.loadDialog.close());

        // Add reload handler
        addMessageHandler("reload", ()=>window.location.reload());

        // Lock scrolling
        dialogEngine.freezeScrolling();

        // Open preferences page with no padding, full screen
        dialogEngine.create(mdlContainers.generateContainer(eval(rw_includes["firstTimeSetup.html"]), window.innerWidth, window.innerHeight, true), true).showModal(); // TRUE HERE MEANS NO PADDING.
    }
};
// rw-source: preferences.js
// Used to handle the new preferences screen in RW16
rw.preferences = {
    "options" : [ // Holds all the preferences in JSON format in order, some options, such as reoganising icons, are templates and can be referred to

        // CARDS HERE
        {
            "cardTitle" : "Appearance",
            "supportingImage" : "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ab/Sunset_in_Ashbourne.jpg/1280px-Sunset_in_Ashbourne.jpg",
            "content" : { // values here

                // Colour theme
                "colTheme" : { // config value as title
                    // UI text
                    "optionTitle" : "Theme",
                    "supportingText": "Customise RedWarn by setting your theme.",
                    "customHTMLOpt": `onchange="updateColourTheme();"`, // update within the UI for all

                    // Config options
                    "options" : { // human readable: actual value - END HUMAN READABLE WITH * for default option
                        "WikiBlue*" : "blue-indigo",
                        "Sunshine" : "amber-yellow",
                        "Purple Power" : "purple-deep_purple",
                        "RedWarn Minimal": "blue_grey-red",
                        "Lime Forrest": "brown-light_green",
                        "Orange Juice": "orange-deep_orange",
                        "Candy Floss": "pink-red"
                    }
                }, // end

                // Page icon locations 
                "dialogAnimation" : { // config value as title
                    // UI text
                    "optionTitle" : "Dialog Animation",
                    "supportingText": "Change the animation used when a RedWarn dialog opens/closes.",

                    // Config options
                    "options" : { 
                        "Default*" : "default",
                        "Spinny" : "spinny",
                        "Mega" : "mega",
                        "Disable Animation": "none"
                    }
                }, // end

                // Page icon locations 
                "pgIconsLocation" : { // config value as title
                    // UI text
                    "optionTitle" : "Location of RedWarn icons",
                    "supportingText": "Change the location of where the RedWarn page icons appear. Depending on your Skin, your preferences may or may not be honored.",

                    // Config options
                    "options" : { 
                        "After Page Icons*" : "default",
                        "Page Sidebar/Navigation": "sidebar"
                    }
                }, // end

                // Replace references to quick rollback and rollback with QRB and RB 
                "rwRollbackShorten" : { // config value as title
                    // UI text
                    "optionTitle" : "Shorten references to rollback",
                    "supportingText": "Shortern the rollback and quick rollback buttons to RB and QRB respectively. If you're experienced, this can help reduce reading times.",

                    // Config options
                    "options" : { 
                        "Enable" : "enable",
                        "Disable*": "disable"
                    }
                }, // end

                

                // Patrol appearence, we'll just remove, not really sure people change these settings
            }
        },
        {   
            "cardTitle" : "Behaviour",
            "supportingImage" : "https://upload.wikimedia.org/wikipedia/commons/thumb/0/07/Wilkin_River_close_to_its_confluence_with_Makarora_River%2C_New_Zealand.jpg/1280px-Wilkin_River_close_to_its_confluence_with_Makarora_River%2C_New_Zealand.jpg",
            "content" : {
                // User right-click settings
                "rwDisableRightClickUser" : { // config value as title
                    // UI text
                    "optionTitle" : "Open quick user action menu with...",
                    "supportingText": "Change the way the menu that allows you to access options such as viewing a users pronouns, warning a user and other tools when you right-click on a user link or signiture. Some browsers, such as Firefox, may override the default option of opening the menu on Shift+Right-click.",

                    // Config options
                    "options" : { 
                        "Open when I hold shift and right-click a user link*" : "enable",
                        "Open when I right-click a user link": "Opt2",
                        "Disable quick user action menu": "disable"
                    }
                },

                // Warn user automation
                "rwautoLevelSelectDisable" : {
                    "optionTitle" : "Automation",
                    "supportingText": "Enable or disable RedWarn's automation features, such as automatically choosing a warning level and template for you. Please note to reduce abuse, if you are not yet extended-confirmed, your preference will not be honored until you reach that level. If you have a legitimate alternate account, <a href='https://en.wikipedia.org/wiki/Wikipedia:Requests_for_permissions/Extended_confirmed' target='_blank'>you can request to be extended-confirmed.</a>",

                    // Config options
                    "options" : { 
                        "Enable*" : "enable",
                        "Disable": "disable"
                    }
                },

                // On rollback completion
                "rwRollbackDoneOption" : {
                    "optionTitle" : "Once a rollback is complete...",
                    "supportingText": "Change what automatically occurs when a rollback is successful. Selecting \"Warn User\" is recommended for most users.",

                    // Config options
                    "options" : { 
                        "Let me choose*" : "none",
                        "Warn User (recommended)": "RWRBDONEwarnUsr",
                        "Write a new user talk page message": "RWRBDONEnewUsrMsg",
                        "Open the Quick Template menu": "RWRBDONEwelcomeUsr",
                        "Go to the latest revision": "RWRBDONEmrevPg"
                    }
                },

                // On rollback completion
                "rwLatestRevisionOption" : {
                    "optionTitle" : "When I am redirected to the latest revision...",
                    "supportingText": "Change what happens when you click the \"Latest Revision\" button, or you are automatically redirected to the latest revision. Please note that the new tab option may be blocked by your browser pop-up blocker.",

                    // Config options
                    "options" : { 
                        "Redirect me in the current tab*" : "stayintab",
                        "Open a new tab for the latest revision": "newtab"
                    }
                },

                // Warn user dialog with
                "rwNoticeListByTemplateName" : {
                    "optionTitle" : "When selecting a user template, let me see...",
                    "supportingText": "Change what you see when selecting a warning template in the warn user dialog. If you choose to see template names by default, the descriptions will show when you hover your mouse over a template name.",

                    // Config options
                    "options" : { 
                        "Template descriptions (e.g. Vandalism)*" : "disable",
                        "Template name (i.e. uw-vandalism)": "enable"
                    }
                },

                // Rollback method

                "rollbackMethod" : {
                    "optionTitle" : "Rollback method",
                    "supportingText": "Change the way RedWarn reverts edits. Rollback-like uses the undo feature to revert vandalism, alike to Twinkle and other tools. Meanwhile, rollback uses MediaWiki's \"rollback\" link feature. Both of these are identical in use, although rollback is much faster and more reliable. <br/> TL/DR: If you have a rollback-enabled account, using the rollback option is highly recommended. If you do not have a rollback-enabled account and select the latter option, your preference will not be honored.",

                    // Config options
                    "options" : { 
                        "Rollback-like (slower)*" : "rollbackLike",
                        "Rollback (faster, requires permissions)": "rollback"
                    }
                },

                // Pending changes
                "rwDisablePendingChanges" : {
                    "optionTitle" : "Pending change review",
                    "supportingText": "Choose whether to use RedWarn or the built-in tools for reviewing pending changes.",

                    // Config options
                    "options" : { 
                        "Use RedWarn*" : "enable",
                        "Use built-in tools": "disable"
                    }
                },

                // Pending changes auto accept
                "rwDisableReviewAutoAccept" : {
                    "optionTitle" : "Pending change review - auto accept",
                    "supportingText": "Choose whether to automatically dismiss the reason prompt and accept revisions after five seconds. Override this countdown by interacting with the dialog",

                    // Config options
                    "options" : { 
                        "Enable*" : "enable",
                        "Disable": "disable"
                    }
                },

                // auto reject
                "rwEnableReviewAutoRevert" : {
                    "optionTitle" : "Pending change review - auto revert",
                    "supportingText": "Choose whether to automatically dismiss the reason prompt and revert revisions after five seconds. Override this countdown by interacting with the dialog",

                    // Config options
                    "options" : { 
                        "Enable" : "enable",
                        "Disable*": "disable"
                    }
                },

                // Pending changes open MAT
                "rwPendingMATDisable" : {
                    "optionTitle" : "Pending change review - open MAT after reverting",
                    "supportingText": "Choose whether to automatically open the Multiple Action Tool after you have reviewed a change.",

                    // Config options
                    "options" : { 
                        "Enable*" : "enable",
                        "Disable": "disable"
                    }
                },


                // developer safe mode
                "debugMode" : {
                    "optionTitle" : "Developer safe mode",
                    "supportingText": "This option allows developers to test RedWarn safely, and will only work on a RedWarn script provided by a development sever. <b>IMPORTANT:</b> To safely disable debug mode, open the debug menu and enable production behaviour.",

                    // Config options
                    "options" : { 
                        "Enable" : "enable",
                        "Disable*": "disable"
                    }
                }
            }
        }
    ], // about card included by default

    "generateHTML" : ()=>{
        // Generate HTML for UI to use
        let finalHTML = ``;
        rw.preferences.options.forEach(card=>{
            // Add the full card html
            finalHTML += `
            <div class="mdl-card mdl-shadow--2dp" style="width:100%"> <!-- CARD -->
                <div class="mdl-card__title" style="color: #fff;
                height: 176px;
                background: url('${card.supportingImage}') center / cover;">
                    <h2 class="mdl-card__title-text">${card.cardTitle}</h2>
                </div>
                <div class="mdl-card__supporting-text">
                ${(()=>{
                    // Generate the content and return it

                    let fullOptionsStr = ``;

                    // For each config option in card
                    for (const configKey in card.content) {
                        const option = card.content[configKey];
                        // Append our HTML
                        fullOptionsStr += `
                        <span style="font-size: 18px;padding-bottom: 20px;" >${option.optionTitle}</span><br/>
                        <p>${option.supportingText}</p>
                        <div style="height:5px"></div> <!-- SPACER -->
                        <!-- generated options -->
                        ${(()=>{
                            // Generate our options
                            let finalRadioButtonHTML = ``;

                            for (const optText in option.options) {
                                const optID = option.options[optText];
                                const elID = configKey + optID;
                                finalRadioButtonHTML += `
                                <label class="mdl-radio mdl-js-radio mdl-js-ripple-effect" for="${elID}">
                                    <input type="radio" id="${elID}" class="mdl-radio__button" name="${configKey}" value="${optID}" ${(optText.includes("*") ? `checked` : ``)} ${(option.customHTMLOpt != null ? option.customHTMLOpt : ``)}>
                                    <span class="mdl-radio__label">${optText.replace("*", " (default)")}</span>
                                </label>
                                <br/>
                                `;
                            }

                            return finalRadioButtonHTML;
                        })()}
                        <br /><br />
                        `;
                    }

                    return fullOptionsStr; // finally, add it back to the card
                })()}
                </div>
                <div class="mdl-card__actions mdl-card--border"> <!-- save config at the bottom of every card -->
                    <a class="mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect" onclick="saveConfig();">
                        SAVE CHANGES
                    </a>
                </div>
            </div>
            <br/><br/>
            `;
        });

        return finalHTML; // return for preferences pane
    }
};
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
