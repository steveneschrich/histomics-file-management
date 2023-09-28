import { wrap } from "@girder/core/utilities/PluginUtils";
import ImageView from "@girder/histomicsui/views/body/ImageView";
import { getFilesPerMetaKey, getPDFContent } from "../utils/utils";
import FilesPanelWidget from "../../templates/panels/FilesPanelWidget.pug";
import "../../stylesheets/panel/FilesPanelWidget.styl";
import events from "../../events";

wrap(ImageView, "initialize", function (initialize) {
    initialize.apply(this, _.rest(arguments));
});

wrap(ImageView, "render", function (render) {
    render.call(this);

    getFilesPerMetaKey(this.model.attributes.meta);
    const meta = this.model.attributes.meta;

    events.once("query:files-per-key", function (data) {
        if ($(".tree").length === 0) {
            if (meta) {
                $(".h-image-view-body").after(
                    FilesPanelWidget({
                        items: data,
                        patientId: meta.patientId,
                    })
                );

                $(".folder-label").on("click", function (e) {
                    const t = $(this);
                    const icon = t.find(".glyphicon");
                    const title = t.find("#folder-title");
                    const subtree = t.parent().find(".file-tree-subtree");
                    if (icon.hasClass("glyphicon-folder-close")) {
                        icon.removeClass("glyphicon-folder-close");
                        title.addClass("open");
                        icon.addClass("glyphicon-folder-open");
                        subtree.removeClass("folder-closed");
                    } else {
                        icon.removeClass("glyphicon-folder-open");
                        icon.addClass("glyphicon-folder-close");
                        title.removeClass("open");
                        subtree.addClass("folder-closed");
                    }

                    return false;
                });

                $("#sidebar-button").on("click", function (e) {
                    const t = $(this);
                    const icon = t.find("i");
                    if (icon.hasClass("icon-down-open")) {
                        icon.removeClass("icon-down-open");
                        icon.addClass("icon-up-open");
                    } else {
                        icon.removeClass("icon-up-open");
                        icon.addClass("icon-down-open");
                    }

                    $(".ui-sidebar").animate(
                        {
                            height: "toggle",
                        },
                        100
                    );

                    return false;
                });

                $(".file-tree-subtree-item").on("click", function (e) {
                    const t = $(this);
                    const itemId = t.attr("itemId");
                    $("#modal-iframe").attr(
                        "src",
                        `${window.location.origin}/api/v1/item/${itemId}/download?contentDisposition=inline`
                    );
                    $("#pdf-modal").modal("show");
                });

                $("#copy-patient-id-button").on("click", function (e) {
                    const $temp = $("<input>");
                    $("body").append($temp);
                    $temp.val(meta.patientId).select();
                    document.execCommand("copy");
                    $temp.remove();

                    $(".copy-message").show("medium");
                    setTimeout(function () {
                        $(".copy-message").hide("medium");
                    }, 5000);
                });

                $("body").append(`
                <div id="pdf-modal" class="modal fade bd-example-modal-lg" tabindex="-1" role="dialog" aria-labelledby="myLargeModalLabel" aria-hidden="true">
                    <div class="modal-dialog modal-lg">
                        <div class="modal-content">
                        <iframe id="modal-iframe" height="800px" width="100%"> </iframe>
                        </div>
                    </div>
                </div>
            `);
            }
        }
    });
});

export default ImageView;
