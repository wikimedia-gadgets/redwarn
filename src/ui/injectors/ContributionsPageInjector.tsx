// TODO: dev-rwTS-difficons
// import {Revision} from "rww/mediawiki";
// import {MDCTooltip} from "@material/tooltip";
// import {h} from "tsx-dom";
// import {RevertContext} from "rww/definitions/RevertContext";
// import i18next from "i18next";
//
// export default class DiffViewerInjector {
//     /**
//      * Initialize the injector. If the page is a diff page, this injector
//      * will trigger.
//      */
//     static async init(): Promise<void> {
//         if (mw.config.get("wgPageName").startsWith("Special:Contributions"))
//             DiffViewerInjector.display();
//     }
//
//     static display(): void {
//         $("span.mw-uctop").each((i, el) => {
//             const li = $(el).closest("li");
//
//             const context = new RevertContext(
//                 Revision.fromID(+li.attr("data-mw-revisionID")),
//                 undefined,
//                 undefined,
//                 false
//             );
//
//             const previewLink = (
//                 <a
//                     style="color:green;cursor:pointer;"
//                     id={`rw-currentRevPrev${i}`}
//                     onClick={() => Rollback.preview(context)}
//                     aria-describedby={`rw-currentRevPrev${i}T`}
//                 >
//                     {i18next.t<string>("ui:contribs.previewLink")}
//                 </a>
//             );
//             const previewTooltip = (
//                 <div
//                     id={`rw-currentRevPrev${i}T`}
//                     class="mdc-tooltip"
//                     role="tooltip"
//                     aria-hidden="true"
//                 >
//                     <div class="mdc-tooltip__surface">
//                         {i18next.t<string>("ui:contribs.previewTooltip")}
//                     </div>
//                 </div>
//             );
//
//             const vandalLink = (
//                 <a
//                     style="color:red;cursor:pointer;"
//                     id={`rw-currentRevRvv${i}`}
//                     onClick={() =>
//                         Rollback.rollback(
//                             context,
//                             "[[WP:VANDAL|Possible vandalism]]",
//                             "vandalism"
//                         )
//                     }
//                     aria-describedby={`rw-currentRevRvv${i}T`}
//                 >
//                     {i18next.t<string>("ui:contribs.vandalLink")}
//                 </a>
//             );
//             const vandalTooltip = (
//                 <div
//                     id={`rw-currentRevRvv${i}T`}
//                     class="mdc-tooltip"
//                     role="tooltip"
//                     aria-hidden="true"
//                 >
//                     <div class="mdc-tooltip__surface">
//                         {i18next.t<string>("ui:contribs.vandalTooltip")}{" "}
//                     </div>
//                 </div>
//             );
//
//             const rollbackLink = (
//                 <a
//                     style="color:blue;cursor:pointer;"
//                     id={`rw-currentRevRb${i}`}
//                     onClick={() => Rollback.promptRollbackReason(context, "")}
//                     aria-describedby={`rw-currentRevRb${i}T`}
//                 >
//                     {i18next.t<string>("ui:contribs.rollbackLink")}
//                 </a>
//             );
//             const rollbackTooltip = (
//                 <div
//                     id={`rw-currentRevRb${i}T`}
//                     class="mdc-tooltip"
//                     role="tooltip"
//                     aria-hidden="true"
//                 >
//                     <div class="mdc-tooltip__surface">
//                         {i18next.t<string>("ui:contribs.rollbackTooltip")}
//                     </div>
//                 </div>
//             );
//
//             const wrapper = (
//                 <span id="rw-currentRev${i}" style="cursor:default">
//                     {/* <!-- Wrapper --> */}
//                     <span style="font-family:Roboto;font-weight:400;">
//                         &nbsp; {/* <!-- Styling container --> */}
//                         {previewLink}&nbsp;
//                         {vandalLink}&nbsp;
//                         {rollbackLink}&nbsp;
//                         {previewTooltip}&nbsp;
//                         {vandalTooltip}&nbsp;
//                         {rollbackTooltip}
//                     </span>
//                 </span>
//             );
//
//             $(el).append(wrapper);
//
//             // need to initialize *after* appending to dom since mdc looks for anchor elem
//             const mdcPreviewTooltip = new MDCTooltip(previewTooltip);
//             mdcPreviewTooltip.initialize();
//
//             const mdcVandalTooltip = new MDCTooltip(vandalTooltip);
//             mdcVandalTooltip.initialize();
//
//             const mdcRollbackTooltip = new MDCTooltip(rollbackTooltip);
//             mdcRollbackTooltip.initialize();
//         });
//     }
// }
