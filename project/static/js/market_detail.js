$(document).ready(function() {
    $('#imagemodal').modal({
        onOpenEnd: () => {
            $('#carousel').carousel({
                indicators: true,
            });
        }
    });
    $('#createmodal').modal();

    var bookid = $('meta[name=bookid]').attr('content');
    const initialHelpText = 'Loading book information...';
    $('[data-element="help"]').removeClass('hide').html(initialHelpText);
    $('[data-element="progress"]').removeClass('hide');

    class Owner {
        constructor(data) {
            for (const key in data) {
                this[key] = data[key];
            }

            this.strings = {};
            this.strings.profilePic = `${data.profilePic}=s96-c`;
            this.strings.badgeElem = this.cky ? '<i class="font-size-20 material-icons unselectable tooltipped verified" data-position="right" data-tooltip="This user is a verified CKY student.">verified</i>' : '<i class="font-size-20 material-icons unselectable tooltipped not-verified" data-position="right" data-tooltip="This user may not be a CKY student.">warning</i>';
            this.strings.negotiable = this.negotiable ? 'Yes<i class="font-size-20 material-icons unselectable negotiable ml-4">check</i>' : 'No<i class="font-size-20 material-icons unselectable not-negotiable ml-4">close</i>';
            this.strings.payment = [
                ['cash', 'Cash'], 
                ['octopus', 'Octopus'], 
                ['payme', 'PayMe'], 
                ['tapngo', 'Tap & Go'], 
                ['bankTransfer', 'Bank Transfer'], 
                ['eCheque', 'e-Cheque'], 
                ['alipay', 'Alipay'], 
                ['wechatPay', 'WeChat Pay']
            ].map(a => this[a[0]] ? `<img class="payment-icon mr-4 tooltipped" src="/static/img/payment/${a[0]}.png" data-position="top" data-tooltip="${a[1]}">` : '').join('') || 'Unset';
            this.strings.deliveryMethod = [
                ['inSchoolExchange', 'In-school exchange'], 
                ['meetup', 'Meetup'], 
                ['delivery', 'Door-to-door delivery']
            ].map(a => this[a[0]] ? `<div class="chip mb-0 unselectable">${a[1]}</div>` : '').join('') || 'Unset';
        }
    }

    fetch(`https://www.googleapis.com/books/v1/volumes/${bookid}`, {
        method: 'GET',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(response => {
        if (!response.ok) throw new NetworkError(response);
        return response.json();
    }).then(json => {
        if ('error' in json) throw new NoGoogleBooksResultsError();
        return json;
    }).then(result => {
        let book = new Book(result);
        $('[data-element="book-information"]').html(`<div class="row mx-0 mb-8 p-8 roundBox" data-googleid="${book.googleId}">
            <div class="col s2 mx-0 p-0 minPicHeight shimmerBG">
                <img class="google-book-image roundBox" src="${book.strings.thumbSmall}" onload="removeShimmer(this.parentElement);removeMinPicHeight(this.parentElement)" data-field="thumb">
            </div>
            <div class="col s10">
                <div class="row mt-0 mb-2">
                    <div class="col font-size-24 text-bold">${book.strings.title}</div>
                </div>
                <div class="row my-0">
                    <div class="col font-size-16">Author${book.strings.plurality}: ${book.strings.authors}</div>
                </div>
                <div class="row my-0">
                    <div class="col font-size-16">Publisher: ${book.strings.publisher}</div>
                </div>
                <div class="row my-0">
                    <div class="col font-size-16">Date of publication: ${book.strings.publishedDate}</div>
                </div>
                <div class="row my-0">
                    <div class="col font-size-16">ISBN: ${book.strings.isbn}</div>
                </div>
                <div class="row my-0">
                    <div class="col font-size-16">Number of pages: ${book.strings.pageCount}</div>
                </div>
                <div class="row my-0">
                    <div class="col font-size-16">Dimensions: ${book.strings.dimensions}</div>
                </div>
            </div>
        </div>`);
        return book;
    }).then(async book => {
        $('[data-element="help"]').html('Loading offers...');
        return await fetch(`/api/v1/market/detail?bookid=${bookid}`, {
            method: 'GET',
            mode: 'cors',
            headers: csrfprotect({
                'Content-Type': 'application/json'
            })
        }).then(response => {
            if (response.ok) return response.json();
            throw new NetworkError(response);
        }).then(json => {
            if (json.status != 'success') throw new APIError(json);
            if (json.data.length == 0) throw new APIError(json);
            return json.data;
        }).then(listings => {
            let resultsContainer = $('[data-element="offer_results"]');
            for (const l of listings) {
                const listing = new Listing(l);
                const owner = new Owner(l.owner);
                const validityClass = l.invalid ? 'btn-transparent-disabled tooltipped' : 'btn-transparent-primary';
                let elem = $(`<div class="row mx-0 mb-8 p-16 roundBox listing" data-listingid="${listing.listingid}" data-owneruserid="${owner.userid}" data-invalid="${Boolean(l.invalid)}">
                    <div class="row mt-0 mb-2 valign-wrapper">
                        <div class="col s1">
                            <div class="profile-picture rounded shimmerBG">
                                <img class="w-full rounded" src="${owner.strings.profilePic}" onload="removeShimmer(this.parentElement);">
                            </div>
                        </div>
                        <div class="col s11">
                            <div class="row my-0 valign-wrapper">
                                <div class="col font-size-20 text-bold">${owner.name}</div>
                                ${owner.strings.badgeElem}
                            </div>
                        </div>
                    </div>
                    <div class="row mt-0 mb-2">
                        <div class="col s1"></div>
                        <div class="col s6">
                            <div class="row my-0">
                                <div class="col s12 word-wrap font-size-14 text-muted">Negotiable</div>
                            </div>
                            <div class="row my-0">
                                <div class="col s12 font-size-16 valign-wrapper">${owner.strings.negotiable}</div>
                            </div>
                            <div class="row my-0">
                                <div class="col s12 word-wrap font-size-14 text-muted">Payment Methods</div>
                            </div>
                            <div class="row my-0">
                                <div class="col font-size-16">
                                    ${owner.strings.payment}
                                </div>
                            </div>
                            <div class="row my-0">
                                <div class="col s12 word-wrap font-size-14 text-muted">Delivery Methods</div>
                            </div>
                            <div class="row my-0">
                                <div class="col font-size-16">
                                    ${owner.strings.deliveryMethod}
                                </div>
                            </div>
                        </div>
                        <div class="col s5">
                            <div class="row my-0">
                                <div class="col s12 word-wrap font-size-14 right-align text-muted">Created</div>
                            </div>
                            <div class="row my-0">
                                <div class="col s12 word-wrap font-size-16 right-align">${listing.strings.created}</div>
                            </div>
                            <div class="row my-0 justify-content-end flex-wrap">
                                <div class="col">
                                    <div class="row my-0">
                                        <div class="col s12 word-wrap font-size-14 right-align text-muted">Condition</div>
                                    </div>
                                    <div class="row my-0">
                                        <div class="col s12 word-wrap font-size-16 right-align">
                                            <span class="${listing.strings.conditionClass} tooltipped" data-position="left" data-tooltip="${listing.strings.conditionDescription}">
                                                ${listing.strings.condition}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div class="col">
                                    <div class="row my-0">
                                        <div class="col s12 word-wrap font-size-14 right-align text-muted">Internal Markings</div>
                                    </div>
                                    <div class="row my-0">
                                        <div class="col s12 word-wrap font-size-16 right-align">${listing.strings.notes}</div>
                                    </div>
                                </div>
                                <div class="col">
                                    <div class="row my-0">
                                        <div class="col s12 word-wrap font-size-14 right-align text-muted">Price</div>
                                    </div>
                                    <div class="row my-0">
                                        <div class="col s12 word-wrap font-size-16">${listing.strings.price}</div>
                                    </div>
                                </div>
                            </div>
                            <div class="row my-0">
                                <div class="col s12 word-wrap font-size-14 right-align text-muted">Remarks</div>
                            </div>
                            <div class="row my-0">
                                <div class="col s12 word-wrap font-size-16 right-align">${listing.strings.remarks}</div>
                            </div>
                        </div>
                    </div>
                    <div class="row my-0 justify-content-end">
                        <div class="col">
                            <a class="btn px-8 roundBox btn-transparent btn-transparent-primary" data-button="view_profile">
                                <i class="material-icons left">account_circle</i>
                                View Owner Profile
                            </a>
                            <a class="btn px-8 roundBox btn-transparent btn-transparent-primary" data-button="view_image">
                                <i class="material-icons left">open_in_new</i>
                                View Images
                            </a>
                            <a class="btn px-8 roundBox btn-transparent ${validityClass}" data-button="create_offer" data-position="top" data-tooltip="${l.invalid}">
                                <i class="material-icons left">shopping_cart</i>
                                Make Offer
                            </a>
                        </div>
                    </div>
                </div>`);
                resultsContainer.append(elem);
            }
            $('[data-button="view_profile"]').click(e => {
                const owneruserid = $(e.target).closest('[data-owneruserid]').attr('data-owneruserid');
                window.location.href = `/profile/${owneruserid}`;
            });
            $('[data-button="view_image"]').click(e => {
                const carousel = $('#carousel').empty();
                const listingid = $(e.target).closest('[data-listingid]').attr('data-listingid');
                listings.find(x => x.listingid == listingid).images.forEach(image => {
                    carousel.append(`<a class="carousel-item justify-content-center"><img src="${image}"></a>`);
                });
                $('#imagemodal').modal('open');
            });
            $('[data-button="create_offer"]').click(e => {
                const parent = $(e.target).closest('[data-listingid]');
                if (parent.attr('data-invalid') == 'true') return;
                const listingid = parent.attr('data-listingid');
                $('[data-button="create_offer_confirm"]').attr('data-listingid', listingid);
                $('#createmodal').modal('open');
            });
            $('[data-button="create_offer_confirm"]').click(e => {
                const listingid = $(e.target).attr('data-listingid');
                fetch('/api/v1/offer/create', {
                    method: 'POST',
                    mode: 'cors',
                    headers: csrfprotect({
                        'Content-Type': 'application/json'
                    }),
                    body: JSON.stringify({
                        listingid: listingid
                    })
                }).then(response => {
                    if (!response.ok) throw new NetworkError;
                    return response.json();
                }).then(json => {
                    if (json.status != 'success') throw new APIError(json);
                    return json.data;
                }).then(() => {
                    $(`[data-listingid="${listing}"] [data-button="create_offer"]`).removeClass('btn-transparent-primary').addClass('btn-transparent-disabled tooltipped');
                    toast({
                        description: 'Successfully created offer. Please go to the <a href="/dashboard">dashboard</a> for further steps.',
                        headerPrefix: '',
                        code: 1
                    });
                }).catch(e => {
                    toastError(e);
                }).finally(() => {
                    $('#createmodal').modal('close');
                });
            });
            $('[data-element="help"]').empty();
            return;
        }).catch(e => {
            throw e;
        });
    }).catch(e => {
        if (e instanceof NoGoogleBooksResultsError) {
            $('[data-element="help"]').html('This book does not exist.');
        } else if (e instanceof APIError) {
            $('[data-element="help"]').html('There are no offers avaliable for the moment, please try again later.');
        } else if (e instanceof NetworkError) {
            $('[data-element="help"]').html('An error occured when retrieving data. Please check your connection or try again.');
        } else {
            console.error(e);
        }
    }).finally(() => {
        $('[data-element="progress"]').addClass('hide');
        $('.tooltipped').tooltip();
    });
});