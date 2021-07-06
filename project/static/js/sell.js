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

    function delay(fn, ms) {
        let timer = 0
        return function(...args) {
            clearTimeout(timer)
            timer = setTimeout(fn.bind(this, ...args), ms || 0)
        }
    }

    function search(string) {
        if (!string) {
            $('[data-element="initial_help"]').removeClass("hide");
            $('[data-element="google_book_results"]').addClass("hide");
            return;
        }
        $('[data-element="google_book_results"]').removeClass("hide");
        $('[data-element="progress"]').removeClass("hide");
        $('[data-element="initial_help"]').addClass("hide");
        $('[data-element="noResults_help"]').addClass("hide");

        fetch(`https://www.googleapis.com/books/v1/volumes?q=${string}&orderBy=relevance`, {
            method: 'GET',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json'
            }
        }).then((response) => {
            if (response.ok) return response.json();
            throw new NetworkError(response);
        }).then((json) => {
            if (json["totalItems"] == 0) throw new NoGoogleBooksResultsError();
            return json["items"];
        }).then((result) => {
            for (let item of result) {
                let googleId = item?.id;
                let title = item?.volumeInfo?.title;
                let publisher = item?.volumeInfo?.publisher;
                let description = item?.volumeInfo?.description;
                let isbnObj = item?.volumeInfo?.industryIdentifiers.find(e => e.type == "ISBN_13")?.identifier;
                let imagelinks = item?.volumeInfo?.imageLinks;
                let thumbSmall = imagelinks?.smallThumbnail;
                let thumbLarge = imagelinks?.extraLarge ? imagelinks.extraLarge : imagelinks?.large ? imagelinks.large : imagelinks?.medium ? imagelinks.medium : imagelinks?.small ? imagelinks.small : imagelinks?.thumbnail ? imagelinks.thumbnail : imagelinks?.smallThumbnail;

                console.log(googleId, title, publisher, description, isbnObj, thumbSmall, thumbLarge);
            }
        }).catch((error) => {
            toastError(error);
            $('[data-element="noResults_help"]').removeClass("hide");
        }).finally(() => {
            $('[data-element="progress"]').addClass("hide");
        });
    }

    $('[data-field="google_book_input"]').keyup(delay(function(e) {
        search(this.value);
    }, 500)).keypress(function(e) {
        if (e.which == 13) search(e.target.value);
    });
});