$(document).ready(function() {
    const initialHelpText = 'Loading...';
    $('[data-element="help"]').html(initialHelpText);

    function delay(fn, ms) {
        let timer = 0;
        return function(...args) {
            clearTimeout(timer);
            timer = setTimeout(fn.bind(this, ...args), ms || 0);
        };
    }

    function showLoading() {
        $('[data-element="progress"]').removeClass('hide');
        $('[data-element="help"]').html(initialHelpText);
        $('[data-element="market_results"]').empty();
    }

    async function aggregate(bookids=[]) {
        showLoading();
        $('[data-button="view_details"]').off();
        await fetch('/api/v1/market/aggregate', {
            method: 'POST',
            mode: 'cors',
            headers: csrfprotect({
                'Content-Type': 'application/json'
            }),
            body: JSON.stringify({
                bookids: bookids
            })
        }).then(response => {
            if (response.ok) return response.json();
            throw new NetworkError(response);
        }).then(json => {
            if (json.status != 'success') throw new APIError(json);
            if (json.data.length == 0) throw new NoGoogleBooksResultsError();
            return json.data;
        }).then(async data => {
            return Promise.all(
                data.map(({bookid}) => {
                    return fetch(`https://www.googleapis.com/books/v1/volumes/${bookid}`, {
                        method: 'GET',
                        mode: 'cors',
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    });
                })
            ).then(responses => {
                return Promise.all(responses.map(response => {
                    if (!response.ok) throw new NetworkError(response);
                    return response.json();
                }));
            }).then(jsons => {
                return Promise.all(jsons.map(json => {
                    if ('error' in json) throw new NoGoogleBooksResultsError();
                    return json;
                }));
            }).then(results => {
                let resultsContainer = $('[data-element="market_results"]');
                for (let i = 0; i < results.length; i++) {
                    let book = new Book(results[i]);
                    const offerPlurality = data[i].count > 1 ? 's' : '';
                    let elem = $(`<div class="row mx-0 mb-8 p-8 roundBox book" data-bookid="${data[i].bookid}">
                        <div class="col s2 mx-0 p-0 minPicHeight shimmerBG">
                            <img class="google-book-image roundBox" src="${book.strings.thumbSmall}" onload="removeShimmer(this.parentElement);removeMinPicHeight(this.parentElement)" data-field="thumb">
                        </div>
                        <div class="col s10">
                            <div class="row mt-0 mb-2">
                                <div class="col font-size-24 text-bold">${book.strings.title}</div>
                            </div>
                            <div class="row mt-0 mb-2 align-items-end">
                                <div class="col s6">
                                    <div class="row my-0">
                                        <div class="col font-size-14 text-muted">Author${book.strings.plurality}</div>
                                    </div>
                                    <div class="row my-0">
                                        <div class="col font-size-16">${book.strings.authors}</div>
                                    </div>
                                    <div class="row my-0">
                                        <div class="col font-size-14 text-muted">Publisher</div>
                                    </div>
                                    <div class="row my-0">
                                        <div class="col font-size-16">${book.strings.publisher}</div>
                                    </div>
                                    <div class="row my-0">
                                        <div class="col font-size-14 text-muted">ISBN</div>
                                    </div>
                                    <div class="row my-0">
                                        <div class="col font-size-16">${book.strings.isbn}</div>
                                    </div>
                                </div>
                                <div class="col s6">
                                    <div class="row my-0 justify-content-end">
                                        <div class="col font-size-16">${data[i].count} offer${offerPlurality}</div>
                                    </div>
                                    <div class="row my-0 justify-content-end">
                                        <div class="col font-size-20">From HKD${data[i].minPrice}</div>
                                    </div>
                                </div>
                            </div>
                            <div class="row my-0 justify-content-end">
                                <div class="col">
                                    <a class="btn px-8 roundBox btn-transparent btn-transparent-primary" data-button="view_details">
                                        <i class="material-icons left">list</i>
                                        View Details
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>`);
                    resultsContainer.append(elem);
                }
                $('[data-button="view_details"]').click(e => {
                    const bookid = $(e.target).closest('[data-bookid]').attr('data-bookid');
                    window.open(`/market/${bookid}`, '_blank').focus(); // open in new tab while we are building the book cache
                    // window.location.href = `/market/${bookid}`;
                });
                $('[data-element="help"]').empty();
            }).catch(e => {
                throw e;
            });
        }).catch(e => {
            if (e instanceof NoGoogleBooksResultsError) {
                $('[data-element="help"]').html('<div>No results found. Please check your inputs.</div><div>If you are searching by ISBN, add an <span class="text-bold">isbn:</span> prefix.</div><div>For more information about prefixes, check the <a href="/help#query">query</a> section of help.</div>');
            } else if (e instanceof NetworkError) {
                $('[data-element="help"]').html("<div>An error has occured when retrieving data.</div><div>This may have been caused due to excessive requests to Google, resulting in a temporary rate limit.</div><div>We are working on a fix for this issue.</div><div>Please try again in 5 minutes.</div>");
            } else {
                console.error(e);
            }
        }).finally(() => {
            $('[data-element="progress"]').addClass('hide');
        });
    }

    async function search(string) {
        if (!string) {
            await aggregate();
            return;
        }
        showLoading();
        fetch(`https://www.googleapis.com/books/v1/volumes?q=${string}&orderBy=relevance&maxResults=40&projection=lite`, {
            method: 'GET',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(response => {
            if (!response.ok) throw new NetworkError(response);
            return response.json();
        }).then(async json => {
            if (json.totalItems == 0) throw new NoGoogleBooksResultsError();
            await aggregate(json.items.map(e => e.id));
        }).catch(e => {
            if (e instanceof NoGoogleBooksResultsError) {
                $('[data-element="help"]').html('<div>No results found. Please check your inputs.</div><div>If you are searching by ISBN, add an <span class="text-bold">isbn:</span> prefix.</div><div>For more information about prefixes, check the <a href="/help#query">query</a> section of help.</div>');
            } else if (e instanceof NetworkError) {
                $('[data-element="help"]').html('An error occured when retrieving data. Please check your connection or try again.');
            } else {
                console.error(e);
            }
        }).finally(() => {
            $('[data-element="progress"]').addClass('hide');
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

    aggregate(); // autosearch
});