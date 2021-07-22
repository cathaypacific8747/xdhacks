$(document).ready(function() {

    $(window).resize(changeDashboardHeight)
    function changeDashboardHeight() {
        $('#dashboard').height($(window).height() - $('#dashboard').offset().top - 32);
    }
    changeDashboardHeight();
    
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

    function loadBox() {
        switch ($('[data-element="controls"][data-control]').attr('data-control')) {
            case 'message':
                loadMesssage();
                break;
            default:
                console.log('default');
        }
    }

    function loadPanel() {
        $(`[data-refresh]`).addClass('rotating')
        $('[data-element$="_help"]').removeClass("hide").html("Loading offers...");
        $('[data-element="message_help"]').removeClass("hide").html("View messages");
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
                await Promise.all(
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