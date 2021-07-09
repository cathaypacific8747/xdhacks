$(document).ready(function() {
    const initialHelpText = "Loading your listings...";
    $('[data-element="help"]').removeClass("hide").html(initialHelpText);
    $('[data-element="progress"]').removeClass("hide");

    fetch('api/v1/listing/detail', {
        method: 'GET',
        mode: 'no-cors',
        headers: {
            'Content-Type': 'application/json'
        }
    }).then((response) => {
        if (response.ok) return response.json();
        throw new NetworkError(response);
    }).then((json) => {
        if (json["status"] == "success") return json["data"];
        throw new APIError(json);
    }).then((result) => {
        return Promise.all(
            result.map(({bookid}) => {
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
            for (let item of results) {
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
                    </div>
                </div>`);
                resultsContainer.append(elem);
            }
            $('[data-element="help"]').addClass('hide').html('');
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

    // fetch(`https://www.googleapis.com/books/v1/volumes?q=${string}&orderBy=relevance&maxResults=40`, {
    //     method: 'GET',
    //     mode: 'cors',
    //     headers: {
    //         'Content-Type': 'application/json'
    //     }
    // }).then((response) => {
    //     if (response.ok) return response.json();
    //     throw new NetworkError(response);
    // }).then((json) => {
    //     if (json["totalItems"] == 0) throw new NoGoogleBooksResultsError();
    //     return json["items"];
    // }).then((result) => {
    //     let resultsContainer = $('[data-element="google_book_results"]')
    //     resultsContainer.empty().removeClass("hide");
    //     for (let item of result) {
    //         let book = new Book(item);
    //         let elem = $(`<div class="row mx-0 mb-8 p-8 roundBox unselectable book" data-googleid="${book.googleId}">
    //             <div class="col s2 mx-0 p-0 minPicHeight shimmerBG">
    //                 <img class="google-book-image roundBox" src="${book.strings.thumbSmall}" onload="removeShimmer(this.parentElement);removeMinPicHeight(this.parentElement)" data-field="thumb">
    //             </div>
    //             <div class="col s10">
    //                 <div class="row mt-0 mb-2">
    //                     <div class="col font-size-24 text-bold">${book.strings.title}</div>
    //                 </div>
    //                 <div class="row mt-0 mb-0">
    //                     <div class="col font-size-16">ISBN: ${book.strings.isbn}</div>
    //                 </div>
    //                 <div class="row mt-0 mb-0">
    //                     <div class="col font-size-16">Author${book.strings.plurality}: ${book.strings.authors}</div>
    //                 </div>
    //                 <div class="row mt-0 mb-0">
    //                     <div class="col font-size-16">Publisher: ${book.strings.publisher}</div>
    //                 </div>
    //                 <div class="row mt-0 mb-0">
    //                     <div class="col font-size-16">Retail Price: ${book.strings.retailPrice}</div>
    //                 </div>
    //             </div>
    //         </div>`).click((e) => {
    //             $('[data-googleid]').removeClass("book-selected");
    //             $(e.target).closest('[data-googleid]').toggleClass("book-selected");
    //         });
    //         resultsContainer.append(elem);
    //     }
    //     $('[data-element="help"]').html("Select a book from the list below.");
    //     if (resultsContainer.children().length == 1 ) {
    //         resultsContainer.find('[data-googleid]').click();
    //     }
    // }).catch((e) => {
    //     if (e instanceof NoGoogleBooksResultsError) {
    //         $('[data-element="help"]').html("No results found. Please check your inputs.");
    //     } else if (e instanceof NetworkError) {
    //         $('[data-element="help"]').html("An error occured when retrieving data. Please check your connection or try again.");
    //     } else {
    //         console.error(e)
    //     }
    // }).finally(() => {
    //     $('[data-element="progress"]').addClass("hide");
    // });
});