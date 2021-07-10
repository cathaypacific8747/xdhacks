$(document).ready(function() {
    $('#imagemodal').modal({
        onOpenEnd: () => {
            $('#carousel').carousel({
                indicators: true,
            });
        }
    })

    const initialHelpText = "Loading your listings...";
    $('[data-element="help"]').removeClass("hide").html(initialHelpText);
    $('[data-element="progress"]').removeClass("hide");

    fetch('api/v1/listing/detail', {
        method: 'GET',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json'
        }
    }).then((response) => {
        if (response.ok) return response.json();
        throw new NetworkError(response);
    }).then((json) => {
        if (json["status"] == "success") return json["data"];
        throw new APIError(json);
    }).then((listings) => {
        if (!listings.length) {
            $('[data-element="help"]').html('You do not have any listings, start by creating one!');
            return;
        }
        return Promise.all(
            listings.map(({bookid}) => {
                return fetch(`https://www.googleapis.com/books/v1/volumes/${bookid}`, {
                    method: 'GET',
                    mode: 'cors',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
            })
        ).then((responses) => {
            return Promise.all(responses.map((response) => {
                if (response.ok) return response.json();
                throw new NetworkError(response);
            }));
        }).then((jsons) => {
            return Promise.all(jsons.map((json) => {
                if ('error' in json) throw new NoGoogleBooksResultsError();
                return json;
            }));
        }).then((results) => {
            let resultsContainer = $('[data-element="listings_results"]')
            for (let i = 0; i < results.length; i++) {
                let book = new Book(results[i]);
                let listing = new Listing(listings[i])
                let elem = $(`<div class="row mx-0 mb-8 p-8 roundBox book" data-listingid="${listing.id}">
                    <div class="col s2 mx-0 p-0 minPicHeight shimmerBG">
                        <img class="google-book-image roundBox" src="${book.strings.thumbSmall}" onload="removeShimmer(this.parentElement);removeMinPicHeight(this.parentElement)" data-field="thumb">
                    </div>
                    <div class="col s10">
                        <div class="row mt-0 mb-2">
                            <div class="col font-size-24 text-bold">${book.strings.title}</div>
                        </div>
                        <div class="row mt-0 mb-2">
                            <div class="col s6">
                                <div class="row mt-0 mb-0">
                                    <div class="col font-size-14 text-muted">Author${book.strings.plurality}</div>
                                </div>
                                <div class="row mt-0 mb-0">
                                    <div class="col font-size-16">${book.strings.authors}</div>
                                </div>
                                <div class="row mt-0 mb-0">
                                    <div class="col font-size-14 text-muted">Publisher</div>
                                </div>
                                <div class="row mt-0 mb-0">
                                    <div class="col font-size-16">${book.strings.publisher}</div>
                                </div>
                                <div class="row mt-0 mb-0">
                                    <div class="col font-size-14 text-muted">ISBN</div>
                                </div>
                                <div class="row mt-0 mb-0">
                                    <div class="col font-size-16">${book.strings.isbn}</div>
                                </div>
                            </div>
                            <div class="col s6">
                                <div class="row mt-0 mb-0 justify-content-end">
                                    <div class="col font-size-14 text-muted">Created</div>
                                </div>
                                <div class="row mt-0 mb-0 justify-content-end">
                                    <div class="col font-size-16">${listing.strings.created}</div>
                                </div>
                                <div class="row mt-0 mb-0 justify-content-end">
                                    <div class="col font-size-14 text-muted">Visibility</div>
                                </div>
                                <div class="row mt-0 mb-0 justify-content-end">
                                    <div class="col font-size-16 valign-wrapper">
                                        <i class="material-icons left mr-8 font-size-14" data-field="openIcon">${listing.strings.openIcon}</i>
                                        <span data-field="open">${listing.strings.open}</span>
                                    </div>
                                </div>
                                <div class="row mt-0 mb-0 justify-content-end">
                                    <div class="col">
                                        <div class="row mt-0 mb-0 justify-content-end">
                                            <div class="col font-size-14 text-muted">Condition</div>
                                        </div>
                                        <div class="row mt-0 mb-0 justify-content-end">
                                            <div class="col font-size-16">
                                                <span class="${listing.strings.conditionClass} tooltipped" data-position="right" data-tooltip="${listing.strings.conditionDescription}">
                                                    ${listing.strings.condition}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col">
                                        <div class="row mt-0 mb-0 justify-content-end">
                                            <div class="col font-size-14 text-muted">Internal Markings</div>
                                        </div>
                                        <div class="row mt-0 mb-0 justify-content-end">
                                            <div class="col font-size-16">${listing.strings.notes}</div>
                                        </div>
                                    </div>
                                    <div class="col">
                                        <div class="row mt-0 mb-0 justify-content-end">
                                            <div class="col font-size-14 text-muted">Price</div>
                                        </div>
                                        <div class="row mt-0 mb-0 justify-content-end">
                                            <div class="col font-size-16">${listing.strings.price}</div>
                                        </div>
                                    </div>
                                </div>
                                
                                <div class="row mt-0 mb-0 justify-content-end">
                                    <div class="col font-size-14 text-muted">Remarks</div>
                                </div>
                                <div class="row mt-0 mb-0 justify-content-end">
                                    <div class="col font-size-16">${listing.strings.remarks}</div>
                                </div>
                            </div>
                        </div>
                        <div class="row mt-0 mb-0 justify-content-end">
                            <div class="col">
                                <a class="btn px-8 roundBox btn-transparent btn-transparent-primary" data-button="view_image">
                                    <i class="material-icons left">open_in_new</i>
                                    View Images
                                </a>
                                <a class="btn px-8 roundBox btn-transparent btn-transparent-primary" data-button="toggle_visibility">
                                    <i class="material-icons left" data-field="openIcon">${listing.strings.openIcon}</i>
                                    Toggle Visibility
                                </a>
                                <a class="btn px-8 roundBox btn-transparent btn-transparent-danger" data-button="delete">
                                    <i class="material-icons left">delete_forever</i>
                                    Delete Listing
                                </a>
                            </div>
                        </div>
                    </div>
                </div>`);
                resultsContainer.append(elem);
            }
            $('[data-element="help"]').addClass('hide').html('');
            $('[data-button="view_image"]').click((e) => {
                const carousel = $('#carousel').empty()
                const listingid = $(e.target).closest('[data-listingid]').attr('data-listingid');
                listings.find(x => x.id == listingid).images.forEach(image => {
                    carousel.append(`<a class="carousel-item justify-content-center"><img src="${image}"></a>`);
                })
                $('#imagemodal').modal('open')
            })
            $('[data-button="toggle_visibility"]').click((e) => {
                const parentElement = $(e.target).closest('[data-listingid]')
                const listingId = parentElement.attr('data-listingid');
                fetch(`/api/v1/listing/toggleOpen?listingId=${listingId}`, {
                    method: 'PUT',
                    mode: 'cors',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                })
                .then((response) => {
                    if (response.ok) return response.json();
                    throw new NetworkError(response);
                })
                .then((json) => {
                    if (json.status == "success") {
                        parentElement.find('[data-field="openIcon"]').html(json.data.open ? 'visibility' : 'visibility_off');
                        parentElement.find('[data-field="open"]').html(json.data.open ? 'Public' : 'Hidden');
                        return;
                    }
                    throw new APIError(json);
                })
                .catch((error) => {
                    toastError(error);
                });
            })
            $('[data-button="delete"]').click((e) => {
                const listingId = $(e.target).closest('[data-listingid]').attr('data-listingid');
                fetch(`/api/v1/listing/delete?listingId=${listingId}`, {
                    method: 'DELETE',
                    mode: 'cors',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                })
                .then((response) => {
                    if (response.ok) return response.json();
                    throw new NetworkError(response);
                })
                .then((json) => {
                    if (json.status == "success") {
                        window.location.reload()
                        return;
                    }
                    throw new APIError(json);
                })
                .catch((error) => {
                    toastError(error);
                });
            })
        }).catch((e) => {
            throw e;
        });
    }).catch((e) => {
        if (e instanceof NoGoogleBooksResultsError) {
            $('[data-element="help"]').html("An error occurred in Google's servers. Please try again later.");
        } else if (e instanceof APIError) {
            $('[data-element="help"]').html("An error occurred in our server. Please try again later.");
        } else if (e instanceof NetworkError) {
            $('[data-element="help"]').html("An error occured when retrieving data. Please check your connection or try again.");
        } else {
            console.error(e)
        }
    }).finally(() => {
        $('[data-element="progress"]').addClass("hide");
    });
});