Dropzone.autoDiscover = false;

$(document).ready(function() {
    const initialHelpText = "Start by typing in the book's ISBN, name, author or publisher.";
    $('[data-element="help"]').html(initialHelpText);

    function delay(fn, ms) {
        let timer = 0
        return function(...args) {
            clearTimeout(timer)
            timer = setTimeout(fn.bind(this, ...args), ms || 0)
        }
    }

    function search(string) {
        if (!string) {
            $('[data-element="help"]').html(initialHelpText);
            $('[data-element="google_book_results"]').addClass("hide").empty();
            return;
        }
        $('[data-element="progress"]').removeClass("hide");
        $('[data-element="help"]').html('');

        fetch(`https://www.googleapis.com/books/v1/volumes?q=${string}&orderBy=relevance&maxResults=40`, {
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
            $('[data-element="google_book_results"]').empty().removeClass("hide");
            for (let item of result) {
                let book = new Book(item);
                let elem = $(`<div class="row mx-0 mb-8 p-8 roundBox unselectable book" data-googleid="${book.googleId}">
                    <div class="col s2 mx-0 p-0 minPicHeight shimmerBG">
                        <img class="google-book-image roundBox" src="${book.strings.thumbSmall}" onload="removeShimmer(this.parentElement);removeMinPicHeight(this.parentElement)" data-field="thumb">
                    </div>
                    <div class="col s10">
                        <div class="row mt-0 mb-2">
                            <div class="col font-size-24 text-bold">${book.strings.title}</div>
                        </div>
                        <div class="row mt-0 mb-0">
                            <div class="col font-size-16">ISBN: ${book.strings.isbn}</div>
                        </div>
                        <div class="row mt-0 mb-0">
                            <div class="col font-size-16">Author${book.strings.plurality}: ${book.strings.authors}</div>
                        </div>
                        <div class="row mt-0 mb-0">
                            <div class="col font-size-16">Publisher: ${book.strings.publisher}</div>
                        </div>
                        <div class="row mt-0 mb-0">
                            <div class="col font-size-16">Retail Price: ${book.strings.retailPrice}</div>
                        </div>
                    </div>
                </div>`).click((e) => {
                    $('[data-googleid]').removeClass("book-selected");
                    $(e.target).closest('[data-googleid]').toggleClass("book-selected");
                });
                $('[data-element="google_book_results"]').append(elem);
            }
            $('[data-element="help"]').html("Select a book from the list below.");
        }).catch((e) => {
            if (e instanceof NoGoogleBooksResultsError) {
                $('[data-element="help"]').html("No results found. Please check your inputs.");
            } else if (e instanceof NetworkError) {
                $('[data-element="help"]').html("An error occured when retrieving data. Please check your connection or try again.");
            } else {
                console.error(e)
            }
        }).finally(() => {
            $('[data-element="progress"]').addClass("hide");
        });
    }

    $('[data-field="google_book_input"]').keyup(delay(function(e) {
        if (e.which != 13) search(e.target.value);
    }, 500)).keypress(function(e) {
        if (e.which == 13) {
            e.target.blur();
            search(e.target.value);
        }
    });

    $("#bookDropzone").dropzone({
        url: "/api/v1/book/upload",
        thumbnailHeight: 210,
        thumbnailWidth: 140,
        maxFilesize: 8,
        maxFiles: 5,
        parallelUploads: 5,
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
            dz.on('sendingmultiple', function(data, xhr, formData) {
                console.log('SENDING')
                formData.append('name', jQuery('#name').val());
            }).on("maxfilesexceeded", (file, response) => {
                this.removeFile(file);
            }).on("totaluploadprogress", (progress) => {
                $(".dz-upload").width(`${progress}%`);
            })
        },
        headers: {
            'X-CSRFToken': csrftoken // should be added automatically, but just in case
        }
    })

    $("#sellButton").click(() => {
        let dz = Dropzone.forElement(".dropzone");
        dz.processQueue();
    });
});