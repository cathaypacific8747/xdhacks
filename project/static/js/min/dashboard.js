'use strict';var csrftoken=$("meta[name=csrf-token]").attr("content");window.csrfprotect=t=>{t["X-CSRFToken"]=csrftoken;return t};
$(document).ready(function(){$(".dropdown-trigger").dropdown({alignment:"right",constrainWidth:!1,coverTrigger:!1});$(".tooltipped").tooltip();M.updateTextFields();dayjs.extend(window.dayjs_plugin_utc);dayjs.extend(window.dayjs_plugin_relativeTime);window.Book=class{constructor(b){this.googleId=b?.id;this.title=b?.volumeInfo?.title;this.isbn=b?.volumeInfo?.industryIdentifiers?.find(e=>"ISBN_13"==e.type)?.identifier;this.authors=b?.volumeInfo?.authors;this.language=b?.volumeInfo?.language;this.publisher=
b?.volumeInfo?.publisher;this.publishedDate=b?.volumeInfo?.publishedDate;this.pageCount=b?.volumeInfo?.pageCount;this.height=b?.volumeInfo?.dimensions?.height;this.width=b?.volumeInfo?.dimensions?.width;this.thickness=b?.volumeInfo?.dimensions?.thickness;this.imagelinks=b?.volumeInfo?.imageLinks;this.thumbSmall=this.imagelinks?.smallThumbnail;this.thumbLarge=this.imagelinks?.extraLarge?this.imagelinks.extraLarge:this.imagelinks?.large?this.imagelinks.large:this.imagelinks?.medium?this.imagelinks.medium:
this.imagelinks?.small?this.imagelinks.small:this.imagelinks?.thumbnail?this.imagelinks.thumbnail:this.imagelinks?.smallThumbnail;this.strings={};this.strings.title=this.title||"Unknown";this.strings.isbn=this.isbn||"Unknown";this.strings.authors=this.authors?this.authors.join(this.language&&this.language.includes("en")?", ":"、"):"Unknown";this.strings.plurality=this.authors?1<this.authors.length?"s":"":"";this.strings.publisher=this.publisher||"Unknown";this.strings.publishedDate=this.publishedDate||
"Unknown";this.strings.pageCount=this.pageCount||"Unknown";this.strings.dimensions=this.height&&this.width&&this.thickness?`Height - ${this.height}, Width - ${this.width}, Thickness - ${this.thickness}`:"Unknown";this.strings.thumbSmall=this.thumbSmall?this.thumbSmall:this.thumbLarge?this.thumbLarge:"https://books.google.com.hk/googlebooks/images/no_cover_thumb.gif"}};window.Listing=class{constructor(b){for(const e in b)this[e]=b[e];this.strings={};b=dayjs(1E3*this.created).local();this.strings.created=
`${b.format("DD/MM/YYYY HH:mm:ss")} (${b.fromNow()})`;this.strings.open=this.open?"Public":"Hidden";this.strings.openIcon=this.open?"visibility":"visibility_off";switch(this.condition){case 0:this.strings.condition="Poor";this.strings.conditionDescription="Significant wear, possibly with a broken spine, loose joints or missing pages";this.strings.conditionClass="condition-poor";break;case 1:this.strings.condition="Fair";this.strings.conditionDescription="Some wear, possibly with folded pages, scratches or dents";
this.strings.conditionClass="condition-fair";break;case 2:this.strings.condition="Good";this.strings.conditionDescription="Minor wear, but will still show signs of previous ownership";this.strings.conditionClass="condition-good";break;case 3:this.strings.condition="Fine",this.strings.conditionDescription="Very minor defects and faults, like brand new",this.strings.conditionClass="condition-fine"}switch(this.notes){case 0:this.strings.notes="None";break;case 1:this.strings.notes="Some";break;case 2:this.strings.notes=
"Comprehensive"}this.strings.price=`HKD ${this.price}`;this.strings.remarks=this.remarks||"---"}};class t extends Error{constructor(b){super(b)}}class x extends Error{constructor(b){super(b);this.message=`${b.status}: ${b.statusText}`}}class v extends Error{constructor(b){super(b);this.message=`${b.code}: ${b.message}`}}class w extends Error{constructor(){super();this.message="No results found."}}window.NetworkError=x;window.APIError=v;window.NoGoogleBooksResultsError=w;window.ControlledError=t;window.toast=
function(b="An unknown error occured",e="",u=3){e=e?`${e} `:"";let p,r;switch(u){case 3:p=`${e}Error`;r="toastError";break;case 2:p=`${e}Warning`;r="toastWarning";break;case 1:p=`${e}Success`;r="toastSuccess";break;case 0:p=`${e}Information`,r="toastInformation"}M.toast({unsafeHTML:`<div>
                <div class="font-size-16 text-bold mb-2">
                    ${p}
                </div>
                <div class="font-size-14 line-height-24">
                    ${b}
                </div>
            </div>`,classes:`toastGeneral ${r} roundBox`})};window.toastError=function(b){b instanceof x?toast(b.message,"Network",3):b instanceof v?toast(b.message,"Server",3):toast("DEBUG: Something went wrong. Please try again later","Unknown",3);console.error(b)};window.removeShimmer=function(b){$(b).removeClass("shimmerBG")};window.removeMinPicHeight=function(b){$(b).removeClass("minPicHeight")};768>$(window).width()&&toast(description='Elements will appear glitched on mobile. Please use a computer or enable the "request a desktop site" option. View <a href="/help#master">help</a> for more details.',
headerPrefix="Incompatibility",code=2)});
$(document).ready(function(){function t(){$("#dashboard").height($(window).height()-$("#dashboard").offset().top-32)}function x(){function d(a){$('[data-field="notification_icon"]').html(a?"notifications_active":"notifications_off");$('[data-field="notification_text"]').html(a?"Notifications on":"Notifications off");$('[data-button="toggle_notification"]').removeClass(a?"btn-transparent-danger":"btn-transparent-primary").addClass(a?"btn-transparent-primary":"btn-transparent-danger")}$('[data-element="controls"]').html('<div class="row mb-0">\n            <div class="col s12 mt-8" data-element="message_box">\n                <div class="font-size-12 text-italic text-muted mb-0">To send offer creation notifications to your registered e-mail, navigate to your <a href="/settings">account settings</a>.</div>\n                <div class="font-size-12 text-italic text-muted mb-0">Keep this window open to recieve other push notifications. Updates automatically every 1 minute.</div>\n                <a class="btn px-8 mb-8 roundBox btn-transparent unselectable" data-button="toggle_notification">\n                    <i class="material-icons left" data-field="notification_icon"></i>\n                    <span data-field="notification_text"></span>\n                </a>\n                <div class="center-align font-size-14" data-element="message_box_help">Loading messages...</div>\n                <div class="progress mb-8" data-element="message_progress">\n                    <div class="indeterminate"></div>\n                </div>\n            </div>\n        </div>\n        ');
d(q);fetch("/api/v1/dashboard/messages",{method:"GET",mode:"cors",headers:csrfprotect({"Content-Type":"application/json"})}).then(a=>{if(!a.ok)throw new NetworkError;return a.json()}).then(a=>{if("success"!=a.status)throw new APIError(a);return a.data}).then(a=>{0==a.length?$('[data-element="message_box_help"]').html("No messages."):($('[data-element="message_box"]').append($(a.map(c=>{c=new y(c);const m=dayjs.unix(c.created);return`<div class="row mx-0 mb-8 p-8 roundBox lightgrey">
                        <div class="col s3 right-align">
                            <div class="row mb-0 font-size-14">${m.local().format("DD/MM/YYYY HH:mm:ss")}</div>
                            <div class="row mb-0 font-size-14 text-muted" data-field="updatedRelative" data-val="${c.created}">${m.local().fromNow()}</div>
                        </div>
                        <div class="col s9 font-size-14">${c.strings.display}</div>
                    </div>`}).join(""))),$('[data-element="message_box_help"]').empty(),u&&a[0].messageid!=u&&a.slice(0,a.findIndex(c=>c.messageid==u)).forEach(c=>{q&&(c=new y(c),new Notification("Swappy",{body:c.strings.notification,icon:"/static/img/logo/icon.svg"}))}),u=a[0].messageid)}).catch(a=>{a instanceof APIError?$('[data-element="message_box_help"]').html("An error occurred in our server. Please try again later."):a instanceof NetworkError?$('[data-element="message_box_help"]').html("An error occured when retrieving data. Please check your connection or try again."):
console.error(a)}).finally(()=>{$('[data-element="message_progress"]').addClass("hide")});$('[data-button="toggle_notification"]').click(()=>{q?(q=!1,d(q)):"granted"==Notification.permission?(q=!0,d(q)):Notification.requestPermission(a=>{q="granted"==a;d(q)})})}function v(d,a){const c="seller"==a?"buyer":"seller",m=listings.public;let k;const l=new Listing(listings[a].find(f=>{k=f.offers.find(g=>g.offer.offerid==d);return!!k}).listing),n=l.book,h=new r(k.user),z=()=>{m?$('[data-field="my_publicity_help"]').html('Your contact information is visible to everyone, including the buyer. To hide it from everyone, go to your <a href="/settings">account settings</a>.'):
(k.offer[`${a}public`]?($('[data-field="my_publicity_help"]').html(`Your contact information is not visible to everyone, but is visible to the ${c}.`),$('[data-button="my_publicity_toggle"]').removeClass("btn-transparent-primary").addClass("btn-transparent-danger"),$('[data-field="my_publicity_icon"]').html("remove_circle_outline"),$('[data-field="my_publicity_text"]').html(`Revoke ${c}'s access to contact information`)):($('[data-field="my_publicity_help"]').html(`Your contact information is not visible to anyone. The ${c} would like to view your contact information.`),
$('[data-button="my_publicity_toggle"]').removeClass("btn-transparent-danger").addClass("btn-transparent-primary"),$('[data-field="my_publicity_icon"]').html("check_circle_outline"),$('[data-field="my_publicity_text"]').html(`Grant ${c}'s access to contact information`)),$('[data-button="my_publicity_toggle"]').removeClass("hide"))};$('[data-element="controls"]').html(`<div class="row font-size-20 text-bold mt-8 mb-0">
            <div class="col s12">
                Book Details
            </div>
        </div>
        <div class="row mx-0 mt-8 mb-0" data-googleid="${n.googleId}">
            <div class="col s2 mx-0 p-0 minPicHeight shimmerBG">
                <img class="google-book-image roundBox" src="${n.strings.thumbSmall}" onload="removeShimmer(this.parentElement);removeMinPicHeight(this.parentElement)" data-field="thumb">
            </div>
            <div class="col s10">
                <div class="row mt-0 mb-2">
                    <div class="col font-size-16 text-bold">${n.strings.title}</div>
                </div>
                <div class="row my-0 font-size-14">
                    <div class="col s4 pr-6 right-align">Author${n.strings.plurality}</div>
                    <div class="col s8 pl-6">${n.strings.authors}</div>
                </div>
                <div class="row my-0 font-size-14">
                    <div class="col s4 pr-6 right-align">Publisher</div>
                    <div class="col s8 pl-6">${n.strings.publisher}</div>
                </div>
                <div class="row my-0 font-size-14">
                    <div class="col s4 pr-6 right-align">Date of publication</div>
                    <div class="col s8 pl-6">${n.strings.publishedDate}</div>
                </div>
                <div class="row my-0 font-size-14">
                    <div class="col s4 pr-6 right-align">ISBN</div>
                    <div class="col s8 pl-6">${n.strings.isbn}</div>
                </div>
                <div class="row my-0 font-size-14">
                    <div class="col s4 pr-6 right-align">Number of pages</div>
                    <div class="col s8 pl-6">${n.strings.pageCount}</div>
                </div>
                <div class="row my-0 font-size-14">
                    <div class="col s4 pr-6 right-align">Dimensions</div>
                    <div class="col s8 pl-6">${n.strings.dimensions}</div>
                </div>
            </div>
        </div>
        <div class="row font-size-20 text-bold mt-8 mb-0">
            <div class="col s12">
                Offer Details
            </div>
        </div>
        <div class="row mx-0 mt-8 mb-0" data-listingid="${l.listingid}">
            <div class="col s12 p-0">
                <div class="row my-0 font-size-14">
                    <div class="col s3 pr-6 right-align">Created</div>
                    <div class="col s9 pl-6">${l.strings.created}</div>
                </div>
                <div class="row my-0 font-size-14">
                    <div class="col s3 pr-6 right-align">Condition</div>
                    <div class="col s9 pl-6">
                        <span class="${l.strings.conditionClass} tooltipped" data-position="right" data-tooltip="${l.strings.conditionDescription}">    
                            ${l.strings.condition}
                        </span>
                    </div>
                </div>
                <div class="row my-0 font-size-14">
                    <div class="col s3 pr-6 right-align">Internal Markings</div>
                    <div class="col s9 pl-6">${l.strings.notes}</div>
                </div>
                <div class="row my-0 font-size-14">
                    <div class="col s3 pr-6 right-align">Price</div>
                    <div class="col s9 pl-6">${l.strings.price}</div>
                </div>
                <div class="row my-0 font-size-14">
                    <div class="col s3 pr-6 right-align">Remarks</div>
                    <div class="col s9 pl-6">${l.strings.remarks}</div>
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
                ${c.capitalise()} Details
            </div>
        </div>
        <div class="row mx-0 mt-8 mb-0">
            <div class="col s12 p-0">
                <div class="row my-0 font-size-14 valign-wrapper">
                    <div class="col s3 pr-6 right-align">Payment methods</div>
                    <div class="col s9 pl-6 valign-wrapper">${h.strings.payment}</div>
                </div>
                <div class="row my-0 font-size-14 valign-wrapper py-8">
                    <div class="col s3 pr-6 right-align">Delivery methods</div>
                    <div class="col s9 pl-6 py-8 valign-wrapper">${h.strings.deliveryMethod}</div>
                </div>
                <div class="row my-0 font-size-14 valign-wrapper pb-8" data-field="negotiable_container">
                    <div class="col s3 pr-6 right-align">Negotiable</div>
                    <div class="col s9 pl-6 valign-wrapper">${h.strings.negotiable}</div>
                </div>
                <div class="row my-0 font-size-14 valign-wrapper">
                    <div class="col s3 pr-6 right-align">Contact Information</div>
                    <div class="col s9 pl-6">
                        <div class="row mb-0 mx-0 hide" data-field="public_container">
                            <div class="col s12 p-0 valign-wrapper">
                                The ${c} has set the contact information to be private.
                            </div>
                        </div>
                        <div class="row mb-0 mx-0 hide" data-field="public_container">
                            <div class="col s12 p-0 valign-wrapper">
                                A request to view the contact information has been sent.
                            </div>
                        </div>
                        <div class="row mb-0 mx-0 hide" data-field="public_container">
                            <div class="col s12 p-0 valign-wrapper mb-2">
                                When the ${c} accepts the request, a system message will be sent to you.
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
        <div class="row mx-0 mt-8 mb-0">
            <div class="col s12 p-0 font-size-14">
                <span data-field="my_publicity_help"></span>
                <div class="row my-0 px-8">
                    <a class="btn px-8 roundBox btn-transparent unselectable hide" data-button="my_publicity_toggle">
                        <i class="material-icons left" data-field="my_publicity_icon"></i>
                        <span data-field="my_publicity_text"></i>
                    </a>
                </div>
            </div>
        </div>
        <div class="row font-size-20 text-bold mt-8 mb-0">
            <div class="col s12">
                Actions
            </div>
        </div>
        <div class="row mx-0 mt-8 mb-8">
            <div class="col p-0">
                <a class="btn px-8 roundBox btn-transparent btn-transparent-success" data-button="complete_offer">
                    <i class="material-icons left">check</i>
                    Complete Offer
                </a>
            </div>
            <div class="col p-0">
                <a class="btn px-8 roundBox btn-transparent btn-transparent-danger" data-button="cancel_offer">
                    <i class="material-icons left">clear</i>
                    Cancel Offer
                </a>
            </div>
        </div>
        `);"buyer"==c&&$('[data-field="negotiable_container"]').addClass("hide");h.public||k.offer[`${c}public`]?(h.email&&($('[data-field="email"]').html(h.email),p("email_container")),h.discord&&($('[data-field="discord_icon"]').attr("src","/static/img/contact/discord.png"),$('[data-field="discord"]').html(h.discord),p("discord_container")),h.instagram&&($('[data-field="instagram_icon"]').attr("src","/static/img/contact/instagram.png"),$('[data-field="instagram"]').html(h.instagram),p("instagram_container")),
h.phone&&($('[data-field="phone"]').html(h.phone),h.whatsapp&&$('[data-field="whatsapp"]').attr("src","/static/img/contact/whatsapp.png"),h.signal&&$('[data-field="signal"]').attr("src","/static/img/contact/signal.png"),h.telegram&&$('[data-field="telegram"]').attr("src","/static/img/contact/telegram.png"),p("phone_container")),h.customContactInfo&&($('[data-field="customContactInfo"]').html(h.customContactInfo),p("customContactInfo_container"))):($('[data-field="public"]').html("Private"),$('[data-field="public_icon"]').html("").attr("data-tooltip",
""),$('[data-field="public_container"]').removeClass("hide"));z();$('[data-button="view_image"]').click(()=>{const f=$("#carousel").empty();l.images.forEach(g=>{f.append(`<a class="carousel-item justify-content-center"><img src="${g}"></a>`)});$("#imagemodal").modal("open")});$('[data-button="my_publicity_toggle"]').click(()=>{fetch(`/api/v1/offer/togglePublicity?offerid=${k.offer.offerid}`,{method:"PUT",mode:"cors",headers:csrfprotect({"Content-Type":"application/json"})}).then(f=>{if(f.ok)return f.json();
throw new NetworkError(f);}).then(f=>{if("success"==f.status)k.offer[`${a}public`]=f.data.public,z();else throw new APIError(f);}).catch(f=>{toastError(f);$('[data-element="controls"]').attr("data-control","empty");e()})});"seller"==a?($('[data-button="complete_offer"]').click(()=>{$('[data-button="complete_offer_confirm"]').attr("data-offerid",k.offer.offerid);$("#completemodal").modal("open")}),$('[data-button="complete_offer_confirm"]').click(f=>{f=$(f.target).attr("data-offerid");fetch(`/api/v1/offer/complete?offerid=${f}`,
{method:"DELETE",mode:"cors",headers:csrfprotect({"Content-Type":"application/json"})}).then(g=>{if(g.ok)return g.json();throw new NetworkError(g);}).then(g=>{if("success"==g.status)$("#completemodal").modal("close"),toast(description="Successfully completed offer.",headerPrefix="",code=1),$('[data-element="controls"]').attr("data-control","empty"),e();else throw new APIError(g);}).catch(g=>{$("#completemodal").modal("close");toastError(g);$('[data-element="controls"]').attr("data-control","empty");
e()})})):$('[data-button="complete_offer"]').addClass("hide");$('[data-button="cancel_offer"]').click(()=>{$('[data-button="cancel_offer_confirm"]').attr("data-offerid",k.offer.offerid);$('[data-field="cancel_offer_role"]').html(c);$("#cancelmodal").modal("open")});$('[data-button="cancel_offer_confirm"]').click(f=>{f=$(f.target).attr("data-offerid");fetch(`/api/v1/offer/cancel?offerid=${f}`,{method:"DELETE",mode:"cors",headers:csrfprotect({"Content-Type":"application/json"})}).then(g=>{if(g.ok)return g.json();
throw new NetworkError(g);}).then(g=>{if("success"==g.status)$("#cancelmodal").modal("close"),toast(description="Successfully cancelled offer.",headerPrefix="",code=1),$('[data-element="controls"]').attr("data-control","empty"),e();else throw new APIError(g);}).catch(g=>{$("#cancelmodal").modal("close");toastError(g);$('[data-element="controls"]').attr("data-control","empty");e()})});$(".tooltipped").tooltip()}function w(){$("[data-button]").off();switch($('[data-element="controls"][data-control]').attr("data-control")){case "message":x();
break;case "seller":v($('[data-element="controls"][data-control]').attr("data-control-offerid"),"seller");break;case "buyer":v($('[data-element="controls"][data-control]').attr("data-control-offerid"),"buyer");break;default:$('[data-element="controls"]').attr("data-control","empty").removeAttr("data-control-offerid").html('<div class="center-align valign-center">\n                    Select an item on the list to view more details!\n                </div>')}}function b(){$('[data-element$="_help"]').removeClass("hide").html("Loading offers...");
$('[data-element="message_help"]').removeClass("hide").html('<i class="material-icons left">mail</i>View messages');$('[data-element$="_progress"]').removeClass("hide");$('[data-element$="_results"]').empty();fetch("/api/v1/offer/detail",{method:"GET",mode:"cors",headers:csrfprotect({"Content-Type":"application/json"})}).then(d=>{if(!d.ok)throw new NetworkError;return d.json()}).then(d=>{if("success"!=d.status)throw new APIError(d);return d.data}).then(async d=>{for(let a in d)"public"!=a&&(0==d[a].length?
($(`[data-element="${a}_help"]`).html("buyer"==a?'There are no pending offers. Go to the <a href="/market">Market</a> to make an offer.':'There are no pending offers. Start by <a href="/sell">selling a book</a> or wait until someone makes an offer.'),$(`[data-element="${a}_progress"]`).addClass("hide")):await Promise.all(d[a].map(({listing:c})=>fetch(`https://www.googleapis.com/books/v1/volumes/${c.bookid}`,{method:"GET",mode:"cors",headers:{"Content-Type":"application/json"}}))).then(c=>Promise.all(c.map(m=>
{if(!m.ok)throw new NetworkError(m);return m.json()}))).then(c=>Promise.all(c.map(m=>{if("error"in m)throw new NoGoogleBooksResultsError;return m}))).then(c=>{let m="";for(let l=0;l<c.length;l++){let n="";for(const h of d[a][l].offers){var k=new r(h.user);n+=`<div class="row mb-0 mx-0 py-8 unselectable valign-wrapper" data-offerid="${h.offer.offerid}">
                                <div class="col s2 px-4 valign-wrapper justify-content-center">
                                    <div class="profile-picture">
                                        <img class="rounded" src="${k.strings.profilePic}">
                                    </div>
                                </div>
                                <div class="col s10 px-4 font-size-14 valign-wrapper">
                                    <span class="mr-6">${k.name}</span>
                                    ${k.strings.badgeElem}
                                </div>
                            </div>`}k=new Book(c[l]);d[a][l].listing.book=k;m+=`<li data-bookid="0YzTCQAAQBAJ">
                            <div class="collapsible-header p-0 border-none">
                                <div class="row mb-0 mx-0 valign-wrapper py-8 unselectable">
                                    <div class="col s2 px-4 valign-wrapper">
                                        <img class="google-book-image" src="${k.strings.thumbSmall}">
                                    </div>
                                    <div class="col s10 px-4 font-size-14 text-bold">
                                        ${k.strings.title}
                                    </div>
                                </div>
                            </div>
                            <div class="collapsible-body p-0 border-none">${n}</div>
                        </li>`}$(`[data-element="${a}_results"]`).html(`<ul class="collapsible box-shadow-none border-none">${m}</ul>`);$(".collapsible").collapsible({accordion:!1});$(`[data-element="${a}_help"]`).addClass("hide").empty()}).catch(c=>{c instanceof NoGoogleBooksResultsError?$(`[data-element="${a}_help"]`).html("An error occurred in Google's servers. Please try again later."):c instanceof NetworkError?$(`[data-element="${a}_help"]`).html("An error occured when retrieving data. Please check your connection or try again."):
($(`[data-element="${a}_help"]`).html("An unknown error occured."),console.error(c))}).finally(()=>{$(`[data-element="${a}_progress"]`).addClass("hide")}));$(".tooltipped").tooltip();$("[data-offerid]").click(a=>{$("[data-offerid]").removeClass("active");const c=$(a.target).closest('[data-element$="_results"]').attr("data-element").replace("_results","");a=$(a.target).closest("[data-offerid]").addClass("active").attr("data-offerid");$('[data-element="controls"]').attr("data-control",c).attr("data-control-offerid",
a);w()});window.listings=d}).catch(d=>{d instanceof APIError?$('[data-element$="_help"]').html("An error occurred in our server. Please try again later."):d instanceof NetworkError?$('[data-element$="_help"]').html("An error occured when retrieving data. Please check your connection or try again."):console.error(d)}).finally(()=>{const d=dayjs();$('[data-field="updated"]').html(`${d.local().format("DD/MM/YYYY HH:mm:ss")} (<span data-field="updatedRelative" data-val="${d.valueOf()/1E3}">a few seconds ago</span>)`);
$("[data-refresh]").removeClass("rotating")})}function e(){$("[data-refresh]").addClass("rotating");"empty"==$('[data-element="controls"]').attr("data-control")?(w(),b()):(b(),w())}$("#imagemodal").modal({onOpenEnd:()=>{$("#carousel").carousel({indicators:!0})}});$("#cancelmodal").modal();$("#completemodal").modal();$(window).resize(t);t();var u=null;const p=d=>$(`[data-field="${d}"]`).removeClass("hide");String.prototype.capitalise=function(){return this.charAt(0).toUpperCase()+this.slice(1)};class r{constructor(d){for(const a in d)this[a]=
d[a];this.strings={};this.strings.profilePic=`${d.profilePic}=s96-c`;this.strings.badgeElem=this.cky?'<i class="font-size-14 material-icons unselectable tooltipped verified" data-position="right" data-tooltip="This user is a verified CKY student.">verified</i>':'<i class="font-size-14 material-icons unselectable tooltipped not-verified" data-position="right" data-tooltip="This user may not be a CKY student.">warning</i>';this.strings.negotiable=this.negotiable?'Yes<i class="font-size-20 material-icons unselectable negotiable ml-4">check</i>':
'No<i class="font-size-20 material-icons unselectable not-negotiable ml-4">close</i>';this.strings.payment=[["cash","Cash"],["octopus","Octopus"],["payme","PayMe"],["tapngo","Tap & Go"],["bankTransfer","Bank Transfer"],["eCheque","e-Cheque"],["alipay","Alipay"],["wechatPay","WeChat Pay"]].map(a=>this[a[0]]?`<img class="payment-icon mr-4 tooltipped" src="/static/img/payment/${a[0]}.png" data-position="top" data-tooltip="${a[1]}">`:"").join("")||"Unset";this.strings.deliveryMethod=[["inSchoolExchange",
"In-school exchange"],["meetup","Meetup"],["delivery","Door-to-door delivery"]].map(a=>this[a[0]]?`<div class="chip mb-0 unselectable">${a[1]}</div>`:"").join("")||"Unset"}}class y{constructor(d){for(const a in d)this[a]=d[a];this.strings={};switch(this.messagetype){case "listing_disabled":this.strings.display=`<span class="text-bold">${this.originusername}</span>'s <span class="text-bold">${this.item}</span> has been temporarily disabled. A notification will be sent when it is re-enabled.`;this.strings.notification=
`${this.originusername}'s ${this.item} has been temporarily disabled. A notification will be sent when it is re-enabled.`;break;case "listing_enabled":this.strings.display=`<span class="text-bold">${this.originusername}</span>'s <span class="text-bold">${this.item}</span> has been re-enabled.`;this.strings.notification=`${this.originusername}'s ${this.item} has been re-enabled.`;break;case "listing_deleted":this.strings.display=`<span class="text-bold">${this.originusername}</span>'s <span class="text-bold">${this.item}</span> is no longer avaliable because it has been deleted. The offer has been automatically cancelled.`;
this.strings.notification=`${this.originusername}'s ${this.item} is no longer avaliable because it has been deleted. The offer has been automatically cancelled.`;break;case "offer_created":this.strings.display=`<span class="text-bold">${this.originusername}</span> has created an offer on your listing: <span class="text-bold">${this.item}</span>.`;this.strings.notification=`${this.originusername} has created an offer on your listing: ${this.item}.`;break;case "offer_cancelled":this.strings.display=
`<span class="text-bold">${this.originusername}</span> has cancelled the offer on the listing <span class="text-bold">${this.item}</span>.`;this.strings.notification=`${this.originusername} has cancelled the offer on the listing ${this.item}.`;break;case "offer_contact_granted":this.strings.display=`<span class="text-bold">${this.originusername}</span> has granted you access to their contact information on the listing <span class="text-bold">${this.item}</span>.`;this.strings.notification=`${this.originusername} has granted you access to their contact information on the listing ${this.item}.`;
break;case "offer_contact_request":this.strings.display=`<span class="text-bold">${this.originusername}</span> has requested to view your contact information on the listing <span class="text-bold">${this.item}</span>.`;this.strings.notification=`${this.originusername} has requested to view your contact information on the listing ${this.item}.`;break;case "listing_completed":this.strings.display=`<span class="text-bold">${this.originusername}</span>'s <span class="text-bold">${this.item}</span> is no longer avaliable because it has been sold out.`;
this.strings.notification=`${this.originusername}'s ${this.item} is no longer avaliable because it has been sold out.`;break;default:this.strings.display=this.system,this.strings.notification=this.system}}}var q="granted"==Notification.permission;e();$("[data-refresh]").click(e);$('[data-element="message_help"]').click(()=>{$('[data-element="controls"]').attr("data-control","message");e()});setInterval(()=>{$('[data-field="updatedRelative"][data-val]').each(function(){$(this).html(dayjs.unix($(this).attr("data-val")).local().fromNow())})},
1E3);setInterval(e,6E4)});
