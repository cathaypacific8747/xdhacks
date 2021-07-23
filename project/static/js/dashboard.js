$(document).ready(function() {
    $('#imagemodal').modal({
        onOpenEnd: () => {
            $('#carousel').carousel({
                indicators: true,
            });
        }
    })

    $(window).resize(changeDashboardHeight)
    function changeDashboardHeight() {
        $('#dashboard').height($(window).height() - $('#dashboard').offset().top - 32);
    }
    changeDashboardHeight();

    const unhide_container = container => $(`[data-field="${container}"]`).removeClass("hide");

    class User {
        constructor(data) {
            for (const key in data) {
                this[key] = data[key];
            }

            this.strings = {}
            this.strings.profilePic = `${data.profilePic}=s96-c`
            this.strings.badgeElem = this.cky ? '<i class="font-size-20 material-icons unselectable tooltipped verified" data-position="right" data-tooltip="This user is a verified CKY student.">verified</i>' : '<i class="font-size-20 material-icons unselectable tooltipped not-verified" data-position="right" data-tooltip="This user may not be a CKY student.">warning</i>'
            this.strings.negotiable = this.negotiable ? 'Yes<i class="font-size-20 material-icons unselectable negotiable ml-4">check</i>' : 'No<i class="font-size-20 material-icons unselectable not-negotiable ml-4">close</i>'
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
    
    var push = Notification.permission == 'granted';
    function loadMesssage() {
        function updateButton(push) {       
            $('[data-field="notification_icon"]').html(push ? 'notifications_active' : 'notifications_off');
            $('[data-field="notification_text"]').html(push ? 'Notifications on' : 'Notifications off');
            $('[data-button="toggle_notification"]').removeClass(push ? 'btn-transparent-danger' : 'btn-transparent-primary').addClass(push ? 'btn-transparent-primary' : 'btn-transparent-danger');
        }
        $('[data-element="controls"]').html(`<div class="row mb-0">
            <div class="col s12 mt-8" data-element="message_box">
                <div class="font-size-12 text-italic text-muted mb-0">Keep this tab open to recieve push notifications.</div>
                <a class="btn px-8 mb-8 roundBox btn-transparent unselectable" data-button="toggle_notification">
                    <i class="material-icons left" data-field="notification_icon"></i>
                    <span data-field="notification_text"></span>
                </a>
                <div class="center-align font-size-14" data-element="message_box_help">Loading messages...</div>
                <div class="progress mb-8" data-element="message_progress">
                    <div class="indeterminate"></div>
                </div>
            </div>
        </div>
        `);
        updateButton(push);
        fetch('/api/v1/dashboard/messages', {
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
        }).then(messages => {
            let m = '';
            for (message of messages) {
                const updated = dayjs.unix(message.created);
                m += `<div class="row mx-0 mb-8 p-8 roundBox lightgrey">
                    <div class="col s3 right-align">
                        <div class="row mb-0 font-size-14">${updated.local().format('DD/MM/YYYY HH:mm:ss')}</div>
                        <div class="row mb-0 font-size-14 text-muted" data-field="updatedRelative" data-val="${message.created}">${updated.local().fromNow()}</div>
                    </div>
                    <div class="col s9 font-size-14">${message.message}</div>
                </div>`
            }
            $('[data-element="message_box_help"]').html(m ? '' : 'No messages.')
            $('[data-element="message_box"]').append($(m));
        }).catch(e => {
            if (e instanceof APIError) {
                $('[data-element="message_box_help"]').html("An error occurred in our server. Please try again later.");
            } else if (e instanceof NetworkError) {
                $('[data-element="message_box_help"]').html("An error occured when retrieving data. Please check your connection or try again.");
            } else {
                console.error(e)
            }
        }).finally(() => {
            $('[data-element="message_progress"]').addClass("hide");
        })
        $('[data-button="toggle_notification"]').click(() => {
            console.log(push);
            if (push) {
                push = false;
                updateButton(push);
            } else {
                if (Notification.permission == 'granted') {
                    push = true;
                    updateButton(push);
                } else {
                    Notification.requestPermission(() => {
                        push = true;
                        updateButton(push);
                    })
                }
            }
        })
    }

    function loadSeller(offerid) {
        let public = listings.public;
        var offer;
        let listing = new Listing(listings.seller.find(e => {
            offer = e.offers.find(f => f.offer.offerid == offerid);
            return Boolean(offer);
        }).listing)
        let book = listing.book;
        let user = new User(offer.user);

        $('[data-element="controls"]').html(`<div class="row font-size-20 text-bold mt-8 mb-0">
            <div class="col s12">
                Book Details
            </div>
        </div>
        <div class="row mx-0 mt-8 mb-0" data-googleid="${book.googleId}">
            <div class="col s2 mx-0 p-0 minPicHeight shimmerBG">
                <img class="google-book-image roundBox" src="${book.strings.thumbSmall}" onload="removeShimmer(this.parentElement);removeMinPicHeight(this.parentElement)" data-field="thumb">
            </div>
            <div class="col s10">
                <div class="row mt-0 mb-2">
                    <div class="col font-size-16 text-bold">${book.strings.title}</div>
                </div>
                <div class="row my-0 font-size-14">
                    <div class="col s4 pr-6 right-align">Author${book.strings.plurality}</div>
                    <div class="col s8 pl-6">${book.strings.authors}</div>
                </div>
                <div class="row my-0 font-size-14">
                    <div class="col s4 pr-6 right-align">Publisher</div>
                    <div class="col s8 pl-6">${book.strings.publisher}</div>
                </div>
                <div class="row my-0 font-size-14">
                    <div class="col s4 pr-6 right-align">Date of publication</div>
                    <div class="col s8 pl-6">${book.strings.publishedDate}</div>
                </div>
                <div class="row my-0 font-size-14">
                    <div class="col s4 pr-6 right-align">ISBN</div>
                    <div class="col s8 pl-6">${book.strings.isbn}</div>
                </div>
                <div class="row my-0 font-size-14">
                    <div class="col s4 pr-6 right-align">Number of pages</div>
                    <div class="col s8 pl-6">${book.strings.pageCount}</div>
                </div>
                <div class="row my-0 font-size-14">
                    <div class="col s4 pr-6 right-align">Dimensions</div>
                    <div class="col s8 pl-6">${book.strings.dimensions}</div>
                </div>
            </div>
        </div>
        <div class="row font-size-20 text-bold mt-8 mb-0">
            <div class="col s12">
                Offer Details
            </div>
        </div>
        <div class="row mx-0 mt-8 mb-0" data-listingid="${listing.listingid}">
            <div class="col s12 p-0">
                <div class="row my-0 font-size-14">
                    <div class="col s3 pr-6 right-align">Created</div>
                    <div class="col s9 pl-6">${listing.strings.created}</div>
                </div>
                <div class="row my-0 font-size-14">
                    <div class="col s3 pr-6 right-align">Condition</div>
                    <div class="col s9 pl-6">
                        <span class="${listing.strings.conditionClass} tooltipped" data-position="right" data-tooltip="${listing.strings.conditionDescription}">    
                            ${listing.strings.condition}
                        </span>
                    </div>
                </div>
                <div class="row my-0 font-size-14">
                    <div class="col s3 pr-6 right-align">Internal Markings</div>
                    <div class="col s9 pl-6">${listing.strings.notes}</div>
                </div>
                <div class="row my-0 font-size-14">
                    <div class="col s3 pr-6 right-align">Price</div>
                    <div class="col s9 pl-6">${listing.strings.price}</div>
                </div>
                <div class="row my-0 font-size-14">
                    <div class="col s3 pr-6 right-align">Remarks</div>
                    <div class="col s9 pl-6">${listing.strings.remarks}</div>
                </div>
                <div class="row my-0 px-8">
                    <a class="btn px-8 roundBox btn-transparent btn-transparent-primary" data-button="view_image">
                        <i class="material-icons left">open_in_new</i>
                        View Images
                    </a>
                </div>
            </div>
        </div>
        <div class="row font-size-20 text-bold mt-8 mb-0">
            <div class="col s12">
                Buyer Details
            </div>
        </div>
        <div class="row mx-0 mt-8 mb-0">
            <div class="col s12 p-0">
                <div class="row my-0 font-size-14 valign-wrapper">
                    <div class="col s3 pr-6 right-align">Payment methods</div>
                    <div class="col s9 pl-6 valign-wrapper">${user.strings.payment}</div>
                </div>
                <div class="row my-0 font-size-14 valign-wrapper py-8">
                    <div class="col s3 pr-6 right-align">Delivery methods</div>
                    <div class="col s9 pl-6 py-8 valign-wrapper">${user.strings.deliveryMethod}</div>
                </div>
                <div class="row my-0 font-size-14 valign-wrapper" data-field="negotiable_container">
                    <div class="col s3 pr-6 right-align">Negotiable</div>
                    <div class="col s9 pl-6 valign-wrapper">${user.strings.negotiable}</div>
                </div>
                <div class="row my-0 font-size-14 valign-wrapper py-8">
                    <div class="col s3 pr-6 right-align">Contact Information</div>
                    <div class="col s9 pl-6">
                        <div class="row mb-0 mx-0 hide" data-field="public_container">
                            <div class="col s12 p-0 valign-wrapper">
                                The buyer has set the contact information to be private.
                            </div>
                        </div>
                        <div class="row mb-0 mx-0 hide" data-field="public_container">
                            <div class="col s12 p-0 valign-wrapper">
                                A request to view the contact information has been sent.
                            </div>
                        </div>
                        <div class="row mb-0 mx-0 hide" data-field="public_container">
                            <div class="col s12 p-0 valign-wrapper mb-2">
                                When the buyer accepts the request, a system message will be sent to you.
                            </div>
                        </div>
                        <div class="row mb-2 mx-0 hide" data-field="email_container">
                            <div class="col s12 p-0 valign-wrapper">
                                <span class="material-icons mr-4 tooltipped contact-info-icon unselectable" data-position="left" data-tooltip="E-mail">email</span>
                                <span data-field="email"></span>
                            </div>
                        </div>
                        <div class="row mb-2 mx-0 hide" data-field="discord_container">
                            <div class="col s12 p-0 valign-wrapper">
                                <img class="payment-icon mr-4 tooltipped" data-field="discord_icon" data-position="left" data-tooltip="Discord">
                                <span data-field="discord"></span>
                            </div>
                        </div>
                        <div class="row mb-2 mx-0 hide" data-field="instagram_container">
                            <div class="col s12 p-0 valign-wrapper">
                                <img class="payment-icon mr-4 tooltipped" data-field="instagram_icon" data-position="left" data-tooltip="Instagram">
                                <span data-field="instagram"></span>
                            </div>
                        </div>
                        <div class="row mb-2 mx-0 hide" data-field="phone_container">
                            <div class="col s12 p-0 valign-wrapper">
                                <span class="material-icons mr-4 tooltipped contact-info-icon unselectable" data-position="left" data-tooltip="Phone">phone</span>
                                <span class="mr-6" data-field="phone"></span>
                                <img class="payment-icon mr-4 tooltipped" data-field="whatsapp" data-position="top" data-tooltip="WhatsApp">
                                <img class="payment-icon mr-4 tooltipped" data-field="signal" data-position="top" data-tooltip="Signal">
                                <img class="payment-icon mr-4 tooltipped" data-field="telegram" data-position="top" data-tooltip="Telegram">
                            </div>
                        </div>
                        <div class="row mb-2 mx-0 hide" data-field="customContactInfo_container">
                            <div class="col s12 p-0 valign-wrapper">
                                <span class="material-icons mr-4 tooltipped contact-info-icon unselectable" data-position="left" data-tooltip="Custom Contact Information">contact_mail</span>
                                <span data-field="customContactInfo"></span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="row font-size-20 text-bold mt-8 mb-0">
            <div class="col s12">
                My Information
            </div>
        </div>
        <div class="row mx-0 mt-8 mb-8">
            <div class="col s12 p-0 font-size-14">
                <span data-field="my_publicity_help"></span>
                <div class="row my-0 px-8">
                    <a class="btn px-8 roundBox btn-transparent btn-transparent-primary hide" data-button="my_publicity_toggle">
                        <i class="material-icons left" data-field="my_publicity_icon"></i>
                        <span data-field="my_publicity_text"></i>
                    </a>
                </div>
            </div>
        </div>
        `);

        if (!user.public) {
            $('[data-field="public"]').html("Private");
            $('[data-field="public_icon"]').html("").attr("data-tooltip", "");
            $('[data-field="public_container"]').removeClass("hide");
        } else {
            if (user.email) {
                $('[data-field="email"]').html(user.email);
                unhide_container("email_container")
            }
            if (user.discord) {
                $('[data-field="discord_icon"]').attr("src", "/static/img/contact/discord.png");
                $('[data-field="discord"]').html(user.discord);
                unhide_container("discord_container");
            }
            if (user.instagram) {
                $('[data-field="instagram_icon"]').attr("src", "/static/img/contact/instagram.png");
                $('[data-field="instagram"]').html(user.instagram);
                unhide_container("instagram_container");
            }
            if (user.phone) {
                $('[data-field="phone"]').html(user.phone);
                if (user.whatsapp) $('[data-field="whatsapp"]').attr("src", "/static/img/contact/whatsapp.png")
                if (user.signal) $('[data-field="signal"]').attr("src", "/static/img/contact/signal.png")
                if (user.telegram) $('[data-field="telegram"]').attr("src", "/static/img/contact/telegram.png")
                unhide_container("phone_container");
            }
            if (user.customContactInfo) {
                $('[data-field="customContactInfo"]').html(user.customContactInfo);
                unhide_container("customContactInfo_container");
            }
        }

        if (public) {
            $('[data-field="my_publicity_help"]').html("Your contact information is visible to everyone.")
        } else {
            if (offer.sellerpublic) {
                $('[data-field="my_publicity_help"]').html("Your contact information is visible to the buyer only.")
                $('[data-button="my_publicity_toggle"]').removeClass("btn-transparent-primary").addClass("btn-transparent-danger");
                $('[data-field="my_publicity_icon"]').html('remove_circle_outline')
                $('[data-field="my_publicity_text"]').html("Revoke buyer's access to contact information")
            } else {
                $('[data-field="my_publicity_help"]').html("Your contact information is not visible to anyone. The buyer would like to view your contact information.")
                $('[data-button="my_publicity_toggle"]').removeClass("btn-transparent-danger").addClass("btn-transparent-primary");
                $('[data-field="my_publicity_icon"]').html('check_circle_outline')
                $('[data-field="my_publicity_text"]').html("Grant buyer's access to contact information")
            }
            $('[data-button="my_publicity_toggle"]').removeClass("hide")
        }

        $('[data-button="view_image"]').click(() => {
            const carousel = $('#carousel').empty()
            listing.images.forEach(image => {
                carousel.append(`<a class="carousel-item justify-content-center"><img src="${image}"></a>`);
            })
            $('#imagemodal').modal('open');
        })
        
        $('.tooltipped').tooltip()
    }

    // function loadBuyer(offerid) {
    //     console.log('buyer', offerid, listings);
    // }

    function loadBox() {
        switch ($('[data-element="controls"][data-control]').attr('data-control')) {
            case 'message':
                loadMesssage();
                break;
            case 'seller':
                loadSeller($('[data-element="controls"][data-control]').attr('data-control-offerid'));
                break;
            case 'buyer':
                loadBuyer($('[data-element="controls"][data-control]').attr('data-control-offerid'));
                break;
        }
    }

    function loadPanel() {
        $(`[data-refresh]`).addClass('rotating')
        $('[data-element$="_help"]').removeClass("hide").html("Loading offers...");
        $('[data-element="message_help"]').removeClass("hide").html('<i class="material-icons left">mail</i>View messages');
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
        }).then(async listings => {
            for (let listingtype in listings) {
                if (listingtype == 'public') continue;
                if (listings[listingtype].length == 0) {
                    $(`[data-element="${listingtype}_help"]`).html(listingtype == 'buyer' ? 'There are no pending offers. Go to the <a href="/market">Market</a> to make an offer.' : 'There are no pending offers. <a href="/sell">Sell</a> a book or wait until someone makes an offer.');
                    $(`[data-element="${listingtype}_progress"]`).addClass("hide");
                    continue;
                }
                await Promise.all(
                    listings[listingtype].map(({listing}) => {
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
                        for (const o of listings[listingtype][i].offers) {
                            lis2 += `<div class="row mb-0 mx-0 valign-wrapper py-8 unselectable" data-offerid="${o.offer.offerid}">
                                <div class="col s2 px-4 valign-wrapper justify-content-center">
                                    <img class="profile-picture rounded" src="${o.user.profilePic}=s96-c">
                                </div>
                                <div class="col s10 px-4 font-size-14">
                                    ${o.user.name}
                                </div>
                            </div>`
                        }
                        const book = new Book(results[i]);
                        listings[listingtype][i].listing.book = book;
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
                    $(`[data-element="${listingtype}_results"]`).html(`<ul class="collapsible box-shadow-none border-none">${lis}</ul>`);
                    $('.collapsible').collapsible({
                        accordion: false
                    });
                    $(`[data-element="${listingtype}_help"]`).addClass('hide').empty();
                }).catch(e => {
                    if (e instanceof NoGoogleBooksResultsError) {
                        $(`[data-element="${listingtype}_help"]`).html("An error occurred in Google's servers. Please try again later.");
                    } else if (e instanceof NetworkError) {
                        $(`[data-element="${listingtype}_help"]`).html("An error occured when retrieving data. Please check your connection or try again.");
                    } else {
                        $(`[data-element="${listingtype}_help"]`).html("An unknown error occured.");
                        console.error(e);
                    }
                }).finally(() => {
                    $(`[data-element="${listingtype}_progress"]`).addClass("hide");
                });
            }
            $(`[data-offerid]`).click(e => {
                $('[data-offerid]').removeClass('active')
                const listingtype = $(e.target).closest('[data-element$="_results"]').attr('data-element').replace('_results', '');
                const offerid = $(e.target).closest('[data-offerid]').addClass('active').attr('data-offerid')
                $('[data-element="controls"]').attr('data-control', listingtype).attr('data-control-offerid', offerid);
                loadBox();
            })
            window.listings = listings;
        }).catch(e => {
            if (e instanceof APIError) {
                $('[data-element$="_help"]').html("An error occurred in our server. Please try again later.");
            } else if (e instanceof NetworkError) {
                $('[data-element$="_help"]').html("An error occured when retrieving data. Please check your connection or try again.");
            } else {
                console.error(e)
            }
        }).finally(() => {
            const updated = dayjs();
            $(`[data-field="updated"]`).html(`${updated.local().format('DD/MM/YYYY HH:mm:ss')} (<span data-field="updatedRelative" data-val="${updated.valueOf()/1000}">a few seconds ago</span>)`);
            $(`[data-refresh]`).removeClass('rotating')
        })
    }

    loadPanel();
    loadBox();
    $('[data-refresh]').click(() => {
        loadPanel();
        loadBox();
    });
    $('[data-element="message_help"]').click(() => {
        $('[data-element="controls"]').attr('data-control', 'message');
        loadBox();
    })

    // loadMesssage()

    setInterval(() => {
        $('[data-field="updatedRelative"][data-val]').each(function() {
            $(this).html(dayjs.unix($(this).attr('data-val')).local().fromNow())
        })
    }, 1000)
});