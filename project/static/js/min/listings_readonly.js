'use strict';var csrftoken=$("meta[name=csrf-token]").attr("content");window.csrfprotect=k=>{k["X-CSRFToken"]=csrftoken;return k};
$(document).ready(function(){$(".dropdown-trigger").dropdown({alignment:"right",constrainWidth:!1,coverTrigger:!1});$(".tooltipped").tooltip();M.updateTextFields();dayjs.extend(window.dayjs_plugin_utc);dayjs.extend(window.dayjs_plugin_relativeTime);window.Book=class{constructor(a){this.googleId=a?.id;this.title=a?.volumeInfo?.title;this.isbn=a?.volumeInfo?.industryIdentifiers?.find(d=>"ISBN_13"==d.type)?.identifier;this.authors=a?.volumeInfo?.authors;this.language=a?.volumeInfo?.language;this.publisher=
a?.volumeInfo?.publisher;this.publishedDate=a?.volumeInfo?.publishedDate;this.pageCount=a?.volumeInfo?.pageCount;this.height=a?.volumeInfo?.dimensions?.height;this.width=a?.volumeInfo?.dimensions?.width;this.thickness=a?.volumeInfo?.dimensions?.thickness;this.imagelinks=a?.volumeInfo?.imageLinks;this.thumbSmall=this.imagelinks?.smallThumbnail;this.thumbLarge=this.imagelinks?.extraLarge?this.imagelinks.extraLarge:this.imagelinks?.large?this.imagelinks.large:this.imagelinks?.medium?this.imagelinks.medium:
this.imagelinks?.small?this.imagelinks.small:this.imagelinks?.thumbnail?this.imagelinks.thumbnail:this.imagelinks?.smallThumbnail;this.strings={};this.strings.title=this.title||"Unknown";this.strings.isbn=this.isbn||"Unknown";this.strings.authors=this.authors?this.authors.join(this.language&&this.language.includes("en")?", ":"、"):"Unknown";this.strings.plurality=this.authors?1<this.authors.length?"s":"":"";this.strings.publisher=this.publisher||"Unknown";this.strings.publishedDate=this.publishedDate||
"Unknown";this.strings.pageCount=this.pageCount||"Unknown";this.strings.dimensions=this.height&&this.width&&this.thickness?`Height - ${this.height}, Width - ${this.width}, Thickness - ${this.thickness}`:"Unknown";this.strings.thumbSmall=this.thumbSmall?this.thumbSmall:this.thumbLarge?this.thumbLarge:"https://books.google.com.hk/googlebooks/images/no_cover_thumb.gif"}};window.Listing=class{constructor(a){for(const d in a)this[d]=a[d];this.strings={};a=dayjs(1E3*this.created).local();this.strings.created=
`${a.format("DD/MM/YYYY HH:mm:ss")} (${a.fromNow()})`;this.strings.open=this.open?"Public":"Hidden";this.strings.openIcon=this.open?"visibility":"visibility_off";switch(this.condition){case 0:this.strings.condition="Poor";this.strings.conditionDescription="Significant wear, possibly with a broken spine, loose joints or missing pages";this.strings.conditionClass="condition-poor";break;case 1:this.strings.condition="Fair";this.strings.conditionDescription="Some wear, possibly with folded pages, scratches or dents";
this.strings.conditionClass="condition-fair";break;case 2:this.strings.condition="Good";this.strings.conditionDescription="Minor wear, but will still show signs of previous ownership";this.strings.conditionClass="condition-good";break;case 3:this.strings.condition="Fine",this.strings.conditionDescription="Very minor defects and faults, like brand new",this.strings.conditionClass="condition-fine"}switch(this.notes){case 0:this.strings.notes="None";break;case 1:this.strings.notes="Some";break;case 2:this.strings.notes=
"Comprehensive"}this.strings.price=`HKD ${this.price}`;this.strings.remarks=this.remarks||"---"}};class k extends Error{constructor(a){super(a)}}class b extends Error{constructor(a){super(a);this.message=`${a.status}: ${a.statusText}`}}class e extends Error{constructor(a){super(a);this.message=`${a.code}: ${a.message}`}}class f extends Error{constructor(){super();this.message="No results found."}}window.NetworkError=b;window.APIError=e;window.NoGoogleBooksResultsError=f;window.ControlledError=k;window.toast=
function(a){const d=a.description||"An unknown error occurred",c=`${a.headerPrefix} `||"";let h,g;switch(a.code||3){case 3:h=`${c}Error`;g="toastError";break;case 2:h=`${c}Warning`;g="toastWarning";break;case 1:h=`${c}Success`;g="toastSuccess";break;case 0:h=`${c}Information`,g="toastInformation"}M.toast({unsafeHTML:`<div>
                <div class="font-size-16 text-bold mb-2">
                    ${h}
                </div>
                <div class="font-size-14 line-height-24">
                    ${d}
                </div>
            </div>`,classes:`toastGeneral ${g} roundBox`})};window.toastError=function(a){a instanceof b?toast({description:a.message,headerPrefix:"Network",code:3}):a instanceof e&&toast({description:a.message,headerPrefix:"Server",code:3});console.error(a)};window.removeShimmer=function(a){$(a).removeClass("shimmerBG")};window.removeMinPicHeight=function(a){$(a).removeClass("minPicHeight")};768>$(window).width()&&toast({description:'Elements will appear glitched on mobile. Please use a computer or enable the "request a desktop site" option. View <a href="/help#master">help</a> for more details.',
headerPrefix:"Incompatibility",code:2})});
$(document).ready(function(){$("#imagemodal").modal({onOpenEnd:()=>{$("#carousel").carousel({indicators:!0})}});var k=$("meta[name=userid]").attr("content");$('[data-element="help"]').removeClass("hide").html("Loading listings...");$('[data-element="progress"]').removeClass("hide");fetch(`/api/v1/listing/detail?userid=${k}`,{method:"GET",mode:"cors",headers:csrfprotect({"Content-Type":"application/json"})}).then(b=>{if(!b.ok)throw new NetworkError;return b.json()}).then(b=>{if("success"!=b.status)throw new APIError(b);
if(0==b.data.length)throw $('[data-element="help"]').html("This user does not have listings."),new ControlledError;return b.data}).then(async b=>Promise.all(b.map(({bookid:e})=>fetch(`https://www.googleapis.com/books/v1/volumes/${e}`,{method:"GET",mode:"cors",headers:{"Content-Type":"application/json"}}))).then(e=>Promise.all(e.map(f=>{if(!f.ok)throw new NetworkError(f);return f.json()}))).then(e=>Promise.all(e.map(f=>{if("error"in f)throw new NoGoogleBooksResultsError;return f}))).then(e=>{let f=
$('[data-element="listings_results"]');for(let d=0;d<e.length;d++){var a=new Book(e[d]);let c=new Listing(b[d]);a=$(`<div class="row mx-0 mb-8 p-8 roundBox book" data-listingid="${c.listingid}">
                    <div class="col s2 mx-0 p-0 minPicHeight shimmerBG">
                        <img class="google-book-image roundBox" src="${a.strings.thumbSmall}" onload="removeShimmer(this.parentElement);removeMinPicHeight(this.parentElement)" data-field="thumb">
                    </div>
                    <div class="col s10">
                        <div class="row mt-0 mb-2">
                            <div class="col font-size-24 text-bold">${a.strings.title}</div>
                        </div>
                        <div class="row mt-0 mb-2">
                            <div class="col s6">
                                <div class="row my-0">
                                    <div class="col font-size-14 text-muted">Author${a.strings.plurality}</div>
                                </div>
                                <div class="row my-0">
                                    <div class="col font-size-16">${a.strings.authors}</div>
                                </div>
                                <div class="row my-0">
                                    <div class="col font-size-14 text-muted">Publisher</div>
                                </div>
                                <div class="row my-0">
                                    <div class="col font-size-16">${a.strings.publisher}</div>
                                </div>
                                <div class="row my-0">
                                    <div class="col font-size-14 text-muted">ISBN</div>
                                </div>
                                <div class="row my-0">
                                    <div class="col font-size-16">${a.strings.isbn}</div>
                                </div>
                            </div>

                            <div class="col s6">
                                <div class="row my-0">
                                    <div class="col s12 word-wrap font-size-14 right-align text-muted">Created</div>
                                </div>
                                <div class="row my-0">
                                    <div class="col s12 word-wrap font-size-16 right-align">${c.strings.created}</div>
                                </div>
                                <div class="row my-0 justify-content-end flex-wrap">
                                    <div class="col">
                                        <div class="row my-0">
                                            <div class="col s12 word-wrap font-size-14 right-align text-muted">Condition</div>
                                        </div>
                                        <div class="row my-0">
                                            <div class="col s12 word-wrap font-size-16 right-align">
                                                <span class="${c.strings.conditionClass} tooltipped" data-position="right" data-tooltip="${c.strings.conditionDescription}">
                                                    ${c.strings.condition}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col">
                                        <div class="row my-0">
                                            <div class="col s12 word-wrap font-size-14 right-align text-muted">Internal Markings</div>
                                        </div>
                                        <div class="row my-0">
                                            <div class="col s12 word-wrap font-size-16 right-align">${c.strings.notes}</div>
                                        </div>
                                    </div>
                                    <div class="col">
                                        <div class="row my-0">
                                            <div class="col s12 word-wrap font-size-14 right-align text-muted">Price</div>
                                        </div>
                                        <div class="row my-0">
                                            <div class="col s12 word-wrap font-size-16">${c.strings.price}</div>
                                        </div>
                                    </div>
                                </div>
                                <div class="row my-0">
                                    <div class="col s12 word-wrap font-size-14 right-align text-muted">Remarks</div>
                                </div>
                                <div class="row my-0">
                                    <div class="col s12 word-wrap font-size-16 right-align">${c.strings.remarks}</div>
                                </div>
                            </div>
                        </div>
                        <div class="row my-0 justify-content-end">
                            <div class="col">
                                <a class="btn px-8 roundBox btn-transparent btn-transparent-primary" data-button="view_image">
                                    <i class="material-icons left">open_in_new</i>
                                    View Images
                                </a>
                            </div>
                        </div>
                    </div>
                </div>`);f.append(a)}$('[data-element="help"]').addClass("hide").empty();$('[data-button="view_image"]').click(d=>{const c=$("#carousel").empty(),h=$(d.target).closest("[data-listingid]").attr("data-listingid");b.find(g=>g.listingid==h).images.forEach(g=>{c.append(`<a class="carousel-item justify-content-center"><img src="${g}"></a>`)});$("#imagemodal").modal("open")})}).catch(e=>{throw e;})).catch(b=>{b instanceof NoGoogleBooksResultsError?$('[data-element="help"]').html("An error occurred in Google's servers. Please try again later."):
b instanceof APIError?$('[data-element="help"]').html("An error occurred in our server. Please try again later."):b instanceof NetworkError?$('[data-element="help"]').html("An error occured when retrieving data. Please check your connection or try again."):b instanceof ControlledError||console.error(b)}).finally(()=>{$('[data-element="progress"]').addClass("hide")})});
