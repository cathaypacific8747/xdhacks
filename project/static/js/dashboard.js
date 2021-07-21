$(document).ready(function() {

    $(window).resize(changeDashboardHeight)
    function changeDashboardHeight() {
        $('#dashboard').height($(window).height() - $('#dashboard').offset().top - 32);
    }
    changeDashboardHeight();
    
    var updated;
    function load() {
        const initialHelpText = "Loading offers...";
        $('[data-element$="_help"]').removeClass("hide").html(initialHelpText);
        $('[data-element$="_progress"]').removeClass("hide");
        $('[data-element$="_results"]').empty();
        fetch('/api/v1/offer/detail', {
            method: 'GET',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(response => {
            if (!response.ok) throw new NetworkError;
            return response.json();
        }).then(json => {
            if (json.status != "success") throw new APIError(json);
            return json.data;
        }).then(async offers => {
            for (let offertype in offers) {
                if (offers[offertype].length == 0) {
                    $(`[data-element="${offertype}_help"]`).html(offertype == 'buyer' ? 'There are no pending offers. Go to the <a href="/market">Market</a> to make an offer.' : 'There are no pending offers. <a href="/sell">Sell</a> a book or wait until someone makes an offer.');
                    $(`[data-element="${offertype}_progress"]`).addClass("hide");
                    continue;
                }
                Promise.all(
                    offers[offertype].map(({listing}) => {
                        return fetch(`https://www.googleapis.com/books/v1/volumes/${listing.bookid}`, {
                            method: 'GET',
                            mode: 'cors',
                            headers: {
                                'Content-Type': 'application/json'
                            }
                        })
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
                    let lis = '';
                    for (let i = 0; i < results.length; i++) {
                        let lis2 = '';
                        for (const o of offers[offertype][i].offers) {
                            lis2 += `<div class="row mb-0 mx-0 valign-wrapper py-8 unselectable" data-offerid="${o.offer.offerid}">
                                <div class="col s2 px-4 valign-wrapper justify-content-center">
                                    <img class="profile-picture rounded" src="${o.user.profilePic}=s96-c">
                                </div>
                                <div class="col s10 px-4 font-size-14">
                                    ${o.user.name}
                                </div>
                            </div>`
                        }
                        let book = new Book(results[i]);
                        lis += `<li data-bookid="0YzTCQAAQBAJ">
                            <div class="collapsible-header p-0 border-none">
                                <div class="row mb-0 mx-0 valign-wrapper py-8 unselectable">
                                    <div class="col s2 px-4 valign-wrapper">
                                        <img class="google-book-image" src="${book.strings.thumbSmall}">
                                    </div>
                                    <div class="col s10 px-4 font-size-14 text-bold">
                                        ${book.strings.title}
                                    </div>
                                </div>
                            </div>
                            <div class="collapsible-body p-0 border-none">${lis2}</div>
                        </li>`
                    }
                    $(`[data-element="${offertype}_results"]`).html(`<ul class="collapsible box-shadow-none border-none">${lis}</ul>`);
                    $('.collapsible').collapsible({
                        accordion: false
                    });
                    $(`[data-offerid]`).click(e => {
                        $('[data-offerid]').removeClass('active')
                        const offerid = $(e.target).closest('[data-offerid]').addClass('active').attr('data-offerid')
                        console.log(offerid)
                    })
                    $(`[data-element="${offertype}_help"]`).addClass('hide').empty();
                }).catch(e => {
                    if (e instanceof NoGoogleBooksResultsError) {
                        $(`[data-element="${offertype}_help"]`).html("An error occurred in Google's servers. Please try again later.");
                    } else if (e instanceof NetworkError) {
                        $(`[data-element="${offertype}_help"]`).html("An error occured when retrieving data. Please check your connection or try again.");
                    } else {
                        $(`[data-element="${offertype}_help"]`).html("An unknown error occured.");
                        console.error(e);
                    }
                }).finally(() => {
                    $(`[data-element="${offertype}_progress"]`).addClass("hide");
                });
            }
        }).catch(e => {
            if (e instanceof APIError) {
                $('[data-element$="_help"]').html("An error occurred in our server. Please try again later.");
            } else if (e instanceof NetworkError) {
                $('[data-element$="_help"]').html("An error occured when retrieving data. Please check your connection or try again.");
            } else {
                console.error(e)
            }
        }).finally(() => {
            updated = dayjs().local();
            $(`[data-field="updated"]`).html(`${updated.format('DD/MM/YYYY HH:mm:ss')} (<span data-field="updatedRelative">now</span>)`);
        })
    }
    load();

    $('[data-refresh]').click(load);

    setInterval(() => {
        $('[data-field="updatedRelative"]').html(updated.fromNow())
    }, 1000)
});