'use strict';var csrftoken=$("meta[name=csrf-token]").attr("content");window.csrfprotect=c=>{c["X-CSRFToken"]=csrftoken;return c};
$(document).ready(function(){$(".dropdown-trigger").dropdown({alignment:"right",constrainWidth:!1,coverTrigger:!1});$(".tooltipped").tooltip();M.updateTextFields();dayjs.extend(window.dayjs_plugin_utc);dayjs.extend(window.dayjs_plugin_relativeTime);window.Book=class{constructor(a){this.googleId=a?.id;this.title=a?.volumeInfo?.title;this.isbn=a?.volumeInfo?.industryIdentifiers?.find(b=>"ISBN_13"==b.type)?.identifier;this.authors=a?.volumeInfo?.authors;this.language=a?.volumeInfo?.language;this.publisher=
a?.volumeInfo?.publisher;this.publishedDate=a?.volumeInfo?.publishedDate;this.pageCount=a?.volumeInfo?.pageCount;this.height=a?.volumeInfo?.dimensions?.height;this.width=a?.volumeInfo?.dimensions?.width;this.thickness=a?.volumeInfo?.dimensions?.thickness;this.imagelinks=a?.volumeInfo?.imageLinks;this.thumbSmall=this.imagelinks?.smallThumbnail;this.thumbLarge=this.imagelinks?.extraLarge?this.imagelinks.extraLarge:this.imagelinks?.large?this.imagelinks.large:this.imagelinks?.medium?this.imagelinks.medium:
this.imagelinks?.small?this.imagelinks.small:this.imagelinks?.thumbnail?this.imagelinks.thumbnail:this.imagelinks?.smallThumbnail;this.strings={};this.strings.title=this.title||"Unknown";this.strings.isbn=this.isbn||"Unknown";this.strings.authors=this.authors?this.authors.join(this.language&&this.language.includes("en")?", ":"、"):"Unknown";this.strings.plurality=this.authors?1<this.authors.length?"s":"":"";this.strings.publisher=this.publisher||"Unknown";this.strings.publishedDate=this.publishedDate||
"Unknown";this.strings.pageCount=this.pageCount||"Unknown";this.strings.dimensions=this.height&&this.width&&this.thickness?`Height - ${this.height}, Width - ${this.width}, Thickness - ${this.thickness}`:"Unknown";this.strings.thumbSmall=this.thumbSmall?this.thumbSmall:this.thumbLarge?this.thumbLarge:"https://books.google.com.hk/googlebooks/images/no_cover_thumb.gif"}};window.Listing=class{constructor(a){for(const b in a)this[b]=a[b];this.strings={};a=dayjs(1E3*this.created).local();this.strings.created=
`${a.format("DD/MM/YYYY HH:mm:ss")} (${a.fromNow()})`;this.strings.open=this.open?"Public":"Hidden";this.strings.openIcon=this.open?"visibility":"visibility_off";switch(this.condition){case 0:this.strings.condition="Poor";this.strings.conditionDescription="Significant wear, possibly with a broken spine, loose joints or missing pages";this.strings.conditionClass="condition-poor";break;case 1:this.strings.condition="Fair";this.strings.conditionDescription="Some wear, possibly with folded pages, scratches or dents";
this.strings.conditionClass="condition-fair";break;case 2:this.strings.condition="Good";this.strings.conditionDescription="Minor wear, but will still show signs of previous ownership";this.strings.conditionClass="condition-good";break;case 3:this.strings.condition="Fine",this.strings.conditionDescription="Very minor defects and faults, like brand new",this.strings.conditionClass="condition-fine"}switch(this.notes){case 0:this.strings.notes="None";break;case 1:this.strings.notes="Some";break;case 2:this.strings.notes=
"Comprehensive"}this.strings.price=`HKD ${this.price}`;this.strings.remarks=this.remarks||"---"}};class c extends Error{constructor(a){super(a)}}class e extends Error{constructor(a){super(a);this.message=`${a.status}: ${a.statusText}`}}class f extends Error{constructor(a){super(a);this.message=`${a.code}: ${a.message}`}}class g extends Error{constructor(){super();this.message="No results found."}}window.NetworkError=e;window.APIError=f;window.NoGoogleBooksResultsError=g;window.ControlledError=c;window.toast=
function(a){const b=a.description||"An unknown error occurred",d=`${a.headerPrefix} `||"";let h,k;switch(a.code||3){case 3:h=`${d}Error`;k="toastError";break;case 2:h=`${d}Warning`;k="toastWarning";break;case 1:h=`${d}Success`;k="toastSuccess";break;case 0:h=`${d}Information`,k="toastInformation"}M.toast({unsafeHTML:`<div>
                <div class="font-size-16 text-bold mb-2">
                    ${h}
                </div>
                <div class="font-size-14 line-height-24">
                    ${b}
                </div>
            </div>`,classes:`toastGeneral ${k} roundBox`})};window.toastError=function(a){a instanceof e?toast({description:a.message,headerPrefix:"Network",code:3}):a instanceof f&&toast({description:a.message,headerPrefix:"Server",code:3});console.error(a)};window.removeShimmer=function(a){$(a).removeClass("shimmerBG")};window.removeMinPicHeight=function(a){$(a).removeClass("minPicHeight")};768>$(window).width()&&toast({description:'Elements will appear glitched on mobile. Please use a computer or enable the "request a desktop site" option. View <a href="/help#master">help</a> for more details.',
headerPrefix:"Incompatibility",code:2})});
$(document).ready(function(){$("#imagemodal").modal({onOpenEnd:()=>{$("#carousel").carousel({indicators:!0})}});$("#deletemodal").modal();$('[data-element="help"]').removeClass("hide").html("Loading your listings...");$('[data-element="progress"]').removeClass("hide");fetch("/api/v1/listing/detail",{method:"GET",mode:"cors",headers:csrfprotect({"Content-Type":"application/json"})}).then(c=>{if(!c.ok)throw new NetworkError;return c.json()}).then(c=>{if("success"!=c.status)throw new APIError(c);if(0==
c.data.length)throw $('[data-element="help"]').html("You do not have any listings, start by creating one!"),new ControlledError;return c.data}).then(async c=>Promise.all(c.map(({bookid:e})=>fetch(`https://www.googleapis.com/books/v1/volumes/${e}`,{method:"GET",mode:"cors",headers:{"Content-Type":"application/json"}}))).then(e=>Promise.all(e.map(f=>{if(!f.ok)throw new NetworkError(f);return f.json()}))).then(e=>Promise.all(e.map(f=>{if("error"in f)throw new NoGoogleBooksResultsError;return f}))).then(e=>
{let f=$('[data-element="listings_results"]');for(let a=0;a<e.length;a++){var g=new Book(e[a]);let b=new Listing(c[a]);g=$(`<div class="row mx-0 mb-8 p-8 roundBox book" data-listingid="${b.listingid}">
                    <div class="col s2 mx-0 p-0 minPicHeight shimmerBG">
                        <img class="google-book-image roundBox" src="${g.strings.thumbSmall}" onload="removeShimmer(this.parentElement);removeMinPicHeight(this.parentElement)" data-field="thumb">
                    </div>
                    <div class="col s10">
                        <div class="row mt-0 mb-2">
                            <div class="col font-size-24 text-bold">${g.strings.title}</div>
                        </div>
                        <div class="row mt-0 mb-2">
                            <div class="col s6">
                                <div class="row my-0">
                                    <div class="col font-size-14 text-muted">Author${g.strings.plurality}</div>
                                </div>
                                <div class="row my-0">
                                    <div class="col font-size-16">${g.strings.authors}</div>
                                </div>
                                <div class="row my-0">
                                    <div class="col font-size-14 text-muted">Publisher</div>
                                </div>
                                <div class="row my-0">
                                    <div class="col font-size-16">${g.strings.publisher}</div>
                                </div>
                                <div class="row my-0">
                                    <div class="col font-size-14 text-muted">ISBN</div>
                                </div>
                                <div class="row my-0">
                                    <div class="col font-size-16">${g.strings.isbn}</div>
                                </div>
                            </div>

                            <div class="col s6">
                                <div class="row my-0">
                                    <div class="col s12 word-wrap font-size-14 right-align text-muted">Created</div>
                                </div>
                                <div class="row my-0">
                                    <div class="col s12 word-wrap font-size-16 right-align">${b.strings.created}</div>
                                </div>
                                <div class="row my-0">
                                    <div class="col s12 word-wrap font-size-14 right-align text-muted">Visibility</div>
                                </div>
                                <div class="row my-0">
                                    <div class="col s12 word-wrap font-size-16 justify-content-end valign-wrapper">
                                        <i class="material-icons left mr-8 font-size-14" data-field="openIcon">${b.strings.openIcon}</i>
                                        <span data-field="open">${b.strings.open}</span>
                                    </div>
                                </div>
                                <div class="row my-0 justify-content-end flex-wrap">
                                    <div class="col">
                                        <div class="row my-0">
                                            <div class="col s12 word-wrap font-size-14 right-align text-muted">Condition</div>
                                        </div>
                                        <div class="row my-0">
                                            <div class="col s12 word-wrap font-size-16 right-align">
                                                <span class="${b.strings.conditionClass} tooltipped" data-position="right" data-tooltip="${b.strings.conditionDescription}">
                                                    ${b.strings.condition}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col">
                                        <div class="row my-0">
                                            <div class="col s12 word-wrap font-size-14 right-align text-muted">Internal Markings</div>
                                        </div>
                                        <div class="row my-0">
                                            <div class="col s12 word-wrap font-size-16 right-align">${b.strings.notes}</div>
                                        </div>
                                    </div>
                                    <div class="col">
                                        <div class="row my-0">
                                            <div class="col s12 word-wrap font-size-14 right-align text-muted">Price</div>
                                        </div>
                                        <div class="row my-0">
                                            <div class="col s12 word-wrap font-size-16">${b.strings.price}</div>
                                        </div>
                                    </div>
                                </div>
                                <div class="row my-0">
                                    <div class="col s12 word-wrap font-size-14 right-align text-muted">Remarks</div>
                                </div>
                                <div class="row my-0">
                                    <div class="col s12 word-wrap font-size-16 right-align">${b.strings.remarks}</div>
                                </div>
                            </div>
                        </div>
                        <div class="row my-0 justify-content-end">
                            <div class="col">
                                <a class="btn px-8 roundBox btn-transparent btn-transparent-primary" data-button="view_image">
                                    <i class="material-icons left">open_in_new</i>
                                    View Images
                                </a>
                                <a class="btn px-8 roundBox btn-transparent btn-transparent-primary" data-button="toggle_visibility">
                                    <i class="material-icons left" data-field="openIcon">${b.strings.openIcon}</i>
                                    Toggle Visibility
                                </a>
                                <a class="btn px-8 roundBox btn-transparent btn-transparent-danger" data-button="delete">
                                    <i class="material-icons left">delete_forever</i>
                                    Delete Listing
                                </a>
                            </div>
                        </div>
                    </div>
                </div>`);f.append(g)}$('[data-element="help"]').addClass("hide").empty();$('[data-button="view_image"]').click(a=>{const b=$("#carousel").empty(),d=$(a.target).closest("[data-listingid]").attr("data-listingid");c.find(h=>h.listingid==d).images.forEach(h=>{b.append(`<a class="carousel-item justify-content-center"><img src="${h}"></a>`)});$("#imagemodal").modal("open")});$('[data-button="toggle_visibility"]').click(a=>{const b=$(a.target).closest("[data-listingid]");a=b.attr("data-listingid");
fetch(`/api/v1/listing/toggleOpen?listingId=${a}`,{method:"PUT",mode:"cors",headers:csrfprotect({"Content-Type":"application/json"})}).then(d=>{if(d.ok)return d.json();throw new NetworkError(d);}).then(d=>{if("success"==d.status)b.find('[data-field="openIcon"]').html(d.data.open?"visibility":"visibility_off"),b.find('[data-field="open"]').html(d.data.open?"Public":"Hidden");else throw new APIError(d);}).catch(d=>{toastError(d)})});$('[data-button="delete"]').click(a=>{a=$(a.target).closest("[data-listingid]").attr("data-listingid");
$('[data-button="delete_confirm"]').attr("data-listingid",a);$("#deletemodal").modal("open")});$('[data-button="delete_confirm"]').click(a=>{a=$(a.target).attr("data-listingid");fetch(`/api/v1/listing/delete?listingid=${a}`,{method:"DELETE",mode:"cors",headers:csrfprotect({"Content-Type":"application/json"})}).then(b=>{if(!b.ok)throw new NetworkError(b);return b.json()}).then(b=>{if("success"==b.status)$("#completemodal").modal("close"),window.location.reload();else throw new APIError(b);}).catch(b=>
{toastError(b)})})}).catch(e=>{throw e;})).catch(c=>{c instanceof NoGoogleBooksResultsError?$('[data-element="help"]').html("An error occurred in Google's servers. Please try again later."):c instanceof APIError?$('[data-element="help"]').html("An error occurred in our server. Please try again later."):c instanceof NetworkError?$('[data-element="help"]').html("An error occured when retrieving data. Please check your connection or try again."):c instanceof ControlledError||console.error(c)}).finally(()=>
{$('[data-element="progress"]').addClass("hide")})});
