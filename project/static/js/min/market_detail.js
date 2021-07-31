'use strict';var csrftoken=$("meta[name=csrf-token]").attr("content");window.csrfprotect=h=>{h["X-CSRFToken"]=csrftoken;return h};
$(document).ready(function(){$(".dropdown-trigger").dropdown({alignment:"right",constrainWidth:!1,coverTrigger:!1});$(".tooltipped").tooltip();M.updateTextFields();dayjs.extend(window.dayjs_plugin_utc);dayjs.extend(window.dayjs_plugin_relativeTime);window.Book=class{constructor(a){this.googleId=a?.id;this.title=a?.volumeInfo?.title;this.isbn=a?.volumeInfo?.industryIdentifiers?.find(e=>"ISBN_13"==e.type)?.identifier;this.authors=a?.volumeInfo?.authors;this.language=a?.volumeInfo?.language;this.publisher=
a?.volumeInfo?.publisher;this.publishedDate=a?.volumeInfo?.publishedDate;this.pageCount=a?.volumeInfo?.pageCount;this.height=a?.volumeInfo?.dimensions?.height;this.width=a?.volumeInfo?.dimensions?.width;this.thickness=a?.volumeInfo?.dimensions?.thickness;this.imagelinks=a?.volumeInfo?.imageLinks;this.thumbSmall=this.imagelinks?.smallThumbnail;this.thumbLarge=this.imagelinks?.extraLarge?this.imagelinks.extraLarge:this.imagelinks?.large?this.imagelinks.large:this.imagelinks?.medium?this.imagelinks.medium:
this.imagelinks?.small?this.imagelinks.small:this.imagelinks?.thumbnail?this.imagelinks.thumbnail:this.imagelinks?.smallThumbnail;this.strings={};this.strings.title=this.title||"Unknown";this.strings.isbn=this.isbn||"Unknown";this.strings.authors=this.authors?this.authors.join(this.language&&this.language.includes("en")?", ":"、"):"Unknown";this.strings.plurality=this.authors?1<this.authors.length?"s":"":"";this.strings.publisher=this.publisher||"Unknown";this.strings.publishedDate=this.publishedDate||
"Unknown";this.strings.pageCount=this.pageCount||"Unknown";this.strings.dimensions=this.height&&this.width&&this.thickness?`Height - ${this.height}, Width - ${this.width}, Thickness - ${this.thickness}`:"Unknown";this.strings.thumbSmall=this.thumbSmall?this.thumbSmall:this.thumbLarge?this.thumbLarge:"https://books.google.com.hk/googlebooks/images/no_cover_thumb.gif"}};window.Listing=class{constructor(a){for(const e in a)this[e]=a[e];this.strings={};a=dayjs(1E3*this.created).local();this.strings.created=
`${a.format("DD/MM/YYYY HH:mm:ss")} (${a.fromNow()})`;this.strings.open=this.open?"Public":"Hidden";this.strings.openIcon=this.open?"visibility":"visibility_off";switch(this.condition){case 0:this.strings.condition="Poor";this.strings.conditionDescription="Significant wear, possibly with a broken spine, loose joints or missing pages";this.strings.conditionClass="condition-poor";break;case 1:this.strings.condition="Fair";this.strings.conditionDescription="Some wear, possibly with folded pages, scratches or dents";
this.strings.conditionClass="condition-fair";break;case 2:this.strings.condition="Good";this.strings.conditionDescription="Minor wear, but will still show signs of previous ownership";this.strings.conditionClass="condition-good";break;case 3:this.strings.condition="Fine",this.strings.conditionDescription="Very minor defects and faults, like brand new",this.strings.conditionClass="condition-fine"}switch(this.notes){case 0:this.strings.notes="None";break;case 1:this.strings.notes="Some";break;case 2:this.strings.notes=
"Comprehensive"}this.strings.price=`HKD ${this.price}`;this.strings.remarks=this.remarks||"---"}};class h extends Error{constructor(a){super(a)}}class k extends Error{constructor(a){super(a);this.message=`${a.status}: ${a.statusText}`}}class b extends Error{constructor(a){super(a);this.message=`${a.code}: ${a.message}`}}class c extends Error{constructor(){super();this.message="No results found."}}window.NetworkError=k;window.APIError=b;window.NoGoogleBooksResultsError=c;window.ControlledError=h;window.toast=
function(a){const e=a.description||"An unknown error occurred",d=`${a.headerPrefix} `||"";let f,g;switch(a.code||3){case 3:f=`${d}Error`;g="toastError";break;case 2:f=`${d}Warning`;g="toastWarning";break;case 1:f=`${d}Success`;g="toastSuccess";break;case 0:f=`${d}Information`,g="toastInformation"}M.toast({unsafeHTML:`<div>
                <div class="font-size-16 text-bold mb-2">
                    ${f}
                </div>
                <div class="font-size-14 line-height-24">
                    ${e}
                </div>
            </div>`,classes:`toastGeneral ${g} roundBox`})};window.toastError=function(a){a instanceof k?toast({description:a.message,headerPrefix:"Network",code:3}):a instanceof b&&toast({description:a.message,headerPrefix:"Server",code:3});console.error(a)};window.removeShimmer=function(a){$(a).removeClass("shimmerBG")};window.removeMinPicHeight=function(a){$(a).removeClass("minPicHeight")};768>$(window).width()&&toast({description:'Elements will appear glitched on mobile. Please use a computer or enable the "request a desktop site" option. View <a href="/help#master">help</a> for more details.',
headerPrefix:"Incompatibility",code:2})});
$(document).ready(function(){$("#imagemodal").modal({onOpenEnd:()=>{$("#carousel").carousel({indicators:!0})}});$("#createmodal").modal();var h=$("meta[name=bookid]").attr("content");$('[data-element="help"]').removeClass("hide").html("Loading book information...");$('[data-element="progress"]').removeClass("hide");class k{constructor(b){for(const c in b)this[c]=b[c];this.strings={};this.strings.profilePic=`${b.profilePic}=s96-c`;this.strings.badgeElem=this.cky?'<i class="font-size-20 material-icons unselectable tooltipped verified" data-position="right" data-tooltip="This user is a verified CKY student.">verified</i>':
'<i class="font-size-20 material-icons unselectable tooltipped not-verified" data-position="right" data-tooltip="This user may not be a CKY student.">warning</i>';this.strings.negotiable=this.negotiable?'Yes<i class="font-size-20 material-icons unselectable negotiable ml-4">check</i>':'No<i class="font-size-20 material-icons unselectable not-negotiable ml-4">close</i>';this.strings.payment=[["cash","Cash"],["octopus","Octopus"],["payme","PayMe"],["tapngo","Tap & Go"],["bankTransfer","Bank Transfer"],
["eCheque","e-Cheque"],["alipay","Alipay"],["wechatPay","WeChat Pay"]].map(c=>this[c[0]]?`<img class="payment-icon mr-4 tooltipped" src="/static/img/payment/${c[0]}.png" data-position="top" data-tooltip="${c[1]}">`:"").join("")||"Unset";this.strings.deliveryMethod=[["inSchoolExchange","In-school exchange"],["meetup","Meetup"],["delivery","Door-to-door delivery"]].map(c=>this[c[0]]?`<div class="chip mb-0 unselectable">${c[1]}</div>`:"").join("")||"Unset"}}fetch(`https://www.googleapis.com/books/v1/volumes/${h}`,
{method:"GET",mode:"cors",headers:{"Content-Type":"application/json"}}).then(b=>{if(!b.ok)throw new NetworkError(b);return b.json()}).then(b=>{if("error"in b)throw new NoGoogleBooksResultsError;return b}).then(b=>{b=new Book(b);$('[data-element="book-information"]').html(`<div class="row mx-0 mb-8 p-8 roundBox" data-googleid="${b.googleId}">
            <div class="col s2 mx-0 p-0 minPicHeight shimmerBG">
                <img class="google-book-image roundBox" src="${b.strings.thumbSmall}" onload="removeShimmer(this.parentElement);removeMinPicHeight(this.parentElement)" data-field="thumb">
            </div>
            <div class="col s10">
                <div class="row mt-0 mb-2">
                    <div class="col font-size-24 text-bold">${b.strings.title}</div>
                </div>
                <div class="row my-0">
                    <div class="col font-size-16">Author${b.strings.plurality}: ${b.strings.authors}</div>
                </div>
                <div class="row my-0">
                    <div class="col font-size-16">Publisher: ${b.strings.publisher}</div>
                </div>
                <div class="row my-0">
                    <div class="col font-size-16">Date of publication: ${b.strings.publishedDate}</div>
                </div>
                <div class="row my-0">
                    <div class="col font-size-16">ISBN: ${b.strings.isbn}</div>
                </div>
                <div class="row my-0">
                    <div class="col font-size-16">Number of pages: ${b.strings.pageCount}</div>
                </div>
                <div class="row my-0">
                    <div class="col font-size-16">Dimensions: ${b.strings.dimensions}</div>
                </div>
            </div>
        </div>`);return b}).then(async b=>{$('[data-element="help"]').html("Loading offers...");return await fetch(`/api/v1/market/detail?bookid=${h}`,{method:"GET",mode:"cors",headers:csrfprotect({"Content-Type":"application/json"})}).then(c=>{if(c.ok)return c.json();throw new NetworkError(c);}).then(c=>{if("success"!=c.status)throw new APIError(c);if(0==c.data.length)throw new APIError(c);return c.data}).then(c=>{let a=$('[data-element="offer_results"]');for(const d of c){var e=new Listing(d);const f=
new k(d.owner);e=$(`<div class="row mx-0 mb-8 p-16 roundBox listing" data-listingid="${e.listingid}" data-owneruserid="${f.userid}" data-invalid="${!!d.invalid}">
                    <div class="row mt-0 mb-2 valign-wrapper">
                        <div class="col s1">
                            <div class="profile-picture rounded shimmerBG">
                                <img class="w-full rounded" src="${f.strings.profilePic}" onload="removeShimmer(this.parentElement);">
                            </div>
                        </div>
                        <div class="col s11">
                            <div class="row my-0 valign-wrapper">
                                <div class="col font-size-20 text-bold">${f.name}</div>
                                ${f.strings.badgeElem}
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
                                <div class="col s12 font-size-16 valign-wrapper">${f.strings.negotiable}</div>
                            </div>
                            <div class="row my-0">
                                <div class="col s12 word-wrap font-size-14 text-muted">Payment Methods</div>
                            </div>
                            <div class="row my-0">
                                <div class="col font-size-16">
                                    ${f.strings.payment}
                                </div>
                            </div>
                            <div class="row my-0">
                                <div class="col s12 word-wrap font-size-14 text-muted">Delivery Methods</div>
                            </div>
                            <div class="row my-0">
                                <div class="col font-size-16">
                                    ${f.strings.deliveryMethod}
                                </div>
                            </div>
                        </div>
                        <div class="col s5">
                            <div class="row my-0">
                                <div class="col s12 word-wrap font-size-14 right-align text-muted">Created</div>
                            </div>
                            <div class="row my-0">
                                <div class="col s12 word-wrap font-size-16 right-align">${e.strings.created}</div>
                            </div>
                            <div class="row my-0 justify-content-end flex-wrap">
                                <div class="col">
                                    <div class="row my-0">
                                        <div class="col s12 word-wrap font-size-14 right-align text-muted">Condition</div>
                                    </div>
                                    <div class="row my-0">
                                        <div class="col s12 word-wrap font-size-16 right-align">
                                            <span class="${e.strings.conditionClass} tooltipped" data-position="left" data-tooltip="${e.strings.conditionDescription}">
                                                ${e.strings.condition}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div class="col">
                                    <div class="row my-0">
                                        <div class="col s12 word-wrap font-size-14 right-align text-muted">Internal Markings</div>
                                    </div>
                                    <div class="row my-0">
                                        <div class="col s12 word-wrap font-size-16 right-align">${e.strings.notes}</div>
                                    </div>
                                </div>
                                <div class="col">
                                    <div class="row my-0">
                                        <div class="col s12 word-wrap font-size-14 right-align text-muted">Price</div>
                                    </div>
                                    <div class="row my-0">
                                        <div class="col s12 word-wrap font-size-16">${e.strings.price}</div>
                                    </div>
                                </div>
                            </div>
                            <div class="row my-0">
                                <div class="col s12 word-wrap font-size-14 right-align text-muted">Remarks</div>
                            </div>
                            <div class="row my-0">
                                <div class="col s12 word-wrap font-size-16 right-align">${e.strings.remarks}</div>
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
                            <a class="btn px-8 roundBox btn-transparent ${d.invalid?"btn-transparent-disabled tooltipped":"btn-transparent-primary"}" data-button="create_offer" data-position="top" data-tooltip="${d.invalid}">
                                <i class="material-icons left">shopping_cart</i>
                                Make Offer
                            </a>
                        </div>
                    </div>
                </div>`);a.append(e)}$('[data-button="view_profile"]').click(d=>{d=$(d.target).closest("[data-owneruserid]").attr("data-owneruserid");window.location.href=`/profile/${d}`});$('[data-button="view_image"]').click(d=>{const f=$("#carousel").empty(),g=$(d.target).closest("[data-listingid]").attr("data-listingid");c.find(l=>l.listingid==g).images.forEach(l=>{f.append(`<a class="carousel-item justify-content-center"><img src="${l}"></a>`)});$("#imagemodal").modal("open")});$('[data-button="create_offer"]').click(d=>
{d=$(d.target).closest("[data-listingid]");"true"!=d.attr("data-invalid")&&(d=d.attr("data-listingid"),$('[data-button="create_offer_confirm"]').attr("data-listingid",d),$("#createmodal").modal("open"))});$('[data-button="create_offer_confirm"]').click(d=>{const f=$(d.target).attr("data-listingid");fetch("/api/v1/offer/create",{method:"POST",mode:"cors",headers:csrfprotect({"Content-Type":"application/json"}),body:JSON.stringify({listingid:f})}).then(g=>{if(!g.ok)throw new NetworkError;return g.json()}).then(g=>
{if("success"!=g.status)throw new APIError(g);return g.data}).then(()=>{$(d.target).removeClass("btn-transparent-primary").addClass("btn-transparent-disabled tooltipped");toast({description:'Successfully created offer. Please go to the <a href="/dashboard">dashboard</a> for further steps.',headerPrefix:"",code:1})}).catch(g=>{toastError(g)}).finally(()=>{$("#createmodal").modal("close")})});$('[data-element="help"]').empty()}).catch(c=>{throw c;})}).catch(b=>{b instanceof NoGoogleBooksResultsError?
$('[data-element="help"]').html("This book does not exist."):b instanceof APIError?$('[data-element="help"]').html("There are no offers avaliable for the moment, please try again later."):b instanceof NetworkError?$('[data-element="help"]').html("An error occured when retrieving data. Please check your connection or try again."):console.error(b)}).finally(()=>{$('[data-element="progress"]').addClass("hide");$(".tooltipped").tooltip()})});
