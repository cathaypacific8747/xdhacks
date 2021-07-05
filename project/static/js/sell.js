Dropzone.autoDiscover = false;

$(document).ready(function() {
    $("#bookDropzone").dropzone({
        url: "/api/v1/book/upload",
        thumbnailHeight: 210,
        thumbnailWidth: 140,
        maxFilesize: 8,
        maxFiles: 6,
        parallelUploads: 6,
        dictResponseError: "An error occurred when trying to upload. Please try again.",
        dictFileTooBig: "Image size too large ({{filesize}}MB), must be less than {{maxFilesize}}MB.",
        dictCancelUpload: "",
        acceptedFiles: "image/*",
        autoProcessQueue: false,
        parasmName: "file",
        uploadMultiple: true, 
        previewTemplate: `
            <div class="dz-preview dz-file-preview center-align">
                <div class="dz-image">
                    <img data-dz-thumbnail height="128" />
                </div>
                <div class="dz-error-message">
                    <span class="material-icons font-size-16">warning</span>
                    <div class="font-size-14" data-dz-errormessage></div>
                </div>
                <div class="dz-filename mb-8">
                    <span data-dz-name></span>
                </div>
                <div class="dz-progress">
                    <span class="dz-upload" data-dz-uploadprogress></span>
                </div>
                <div class="dz-remove">
                    <span class="material-icons" data-dz-remove>delete_forever</span>
                </div>
            </div>
        `,
        init: function() {
            let dz = this;
            dz.on("maxfilesexceeded", (file, response) => {
                this.removeFile(file);
            });
            dz.on("totaluploadprogress", (progress) => {
                $(".dz-upload").width(`${progress}%`);
            });
            dz.on("sending", (file, xhr, formData) => {
                formData.append('test', '1234');
            });
            $("#sellButton").click(() => {
                dz.processQueue();
            });
        },
        headers: {
            'X-CSRFToken': csrftoken // should be added, but just in case
        }
    });
});