'use strict';var csrftoken=$("meta[name=csrf-token]").attr("content");window.csrfprotect=g=>{g["X-CSRFToken"]=csrftoken;return g};
$(document).ready(function(){$(".dropdown-trigger").dropdown({alignment:"right",constrainWidth:!1,coverTrigger:!1});$(".tooltipped").tooltip();M.updateTextFields();dayjs.extend(window.dayjs_plugin_utc);dayjs.extend(window.dayjs_plugin_relativeTime);window.Book=class{constructor(a){this.googleId=a?.id;this.title=a?.volumeInfo?.title;this.isbn=a?.volumeInfo?.industryIdentifiers?.find(b=>"ISBN_13"==b.type)?.identifier;this.authors=a?.volumeInfo?.authors;this.language=a?.volumeInfo?.language;this.publisher=
a?.volumeInfo?.publisher;this.publishedDate=a?.volumeInfo?.publishedDate;this.pageCount=a?.volumeInfo?.pageCount;this.height=a?.volumeInfo?.dimensions?.height;this.width=a?.volumeInfo?.dimensions?.width;this.thickness=a?.volumeInfo?.dimensions?.thickness;this.imagelinks=a?.volumeInfo?.imageLinks;this.thumbSmall=this.imagelinks?.smallThumbnail;this.thumbLarge=this.imagelinks?.extraLarge?this.imagelinks.extraLarge:this.imagelinks?.large?this.imagelinks.large:this.imagelinks?.medium?this.imagelinks.medium:
this.imagelinks?.small?this.imagelinks.small:this.imagelinks?.thumbnail?this.imagelinks.thumbnail:this.imagelinks?.smallThumbnail;this.strings={};this.strings.title=this.title||"Unknown";this.strings.isbn=this.isbn||"Unknown";this.strings.authors=this.authors?this.authors.join(this.language&&this.language.includes("en")?", ":"、"):"Unknown";this.strings.plurality=this.authors?1<this.authors.length?"s":"":"";this.strings.publisher=this.publisher||"Unknown";this.strings.publishedDate=this.publishedDate||
"Unknown";this.strings.pageCount=this.pageCount||"Unknown";this.strings.dimensions=this.height&&this.width&&this.thickness?`Height - ${this.height}, Width - ${this.width}, Thickness - ${this.thickness}`:"Unknown";this.strings.thumbSmall=this.thumbSmall?this.thumbSmall:this.thumbLarge?this.thumbLarge:"https://books.google.com.hk/googlebooks/images/no_cover_thumb.gif"}};window.Listing=class{constructor(a){for(const b in a)this[b]=a[b];this.strings={};a=dayjs(1E3*this.created).local();this.strings.created=
`${a.format("DD/MM/YYYY HH:mm:ss")} (${a.fromNow()})`;this.strings.open=this.open?"Public":"Hidden";this.strings.openIcon=this.open?"visibility":"visibility_off";switch(this.condition){case 0:this.strings.condition="Poor";this.strings.conditionDescription="Significant wear, possibly with a broken spine, loose joints or missing pages";this.strings.conditionClass="condition-poor";break;case 1:this.strings.condition="Fair";this.strings.conditionDescription="Some wear, possibly with folded pages, scratches or dents";
this.strings.conditionClass="condition-fair";break;case 2:this.strings.condition="Good";this.strings.conditionDescription="Minor wear, but will still show signs of previous ownership";this.strings.conditionClass="condition-good";break;case 3:this.strings.condition="Fine",this.strings.conditionDescription="Very minor defects and faults, like brand new",this.strings.conditionClass="condition-fine"}switch(this.notes){case 0:this.strings.notes="None";break;case 1:this.strings.notes="Some";break;case 2:this.strings.notes=
"Comprehensive"}this.strings.price=`HKD ${this.price}`;this.strings.remarks=this.remarks||"---"}};class g extends Error{constructor(a){super(a)}}class h extends Error{constructor(a){super(a);this.message=`${a.status}: ${a.statusText}`}}class k extends Error{constructor(a){super(a);this.message=`${a.code}: ${a.message}`}}class d extends Error{constructor(){super();this.message="No results found."}}window.NetworkError=h;window.APIError=k;window.NoGoogleBooksResultsError=d;window.ControlledError=g;window.toast=
function(a){const b=a.description||"An unknown error occurred",e=`${a.headerPrefix} `||"";let f,c;switch(a.code||3){case 3:f=`${e}Error`;c="toastError";break;case 2:f=`${e}Warning`;c="toastWarning";break;case 1:f=`${e}Success`;c="toastSuccess";break;case 0:f=`${e}Information`,c="toastInformation"}M.toast({unsafeHTML:`<div>
                <div class="font-size-16 text-bold mb-2">
                    ${f}
                </div>
                <div class="font-size-14 line-height-24">
                    ${b}
                </div>
            </div>`,classes:`toastGeneral ${c} roundBox`})};window.toastError=function(a){a instanceof h?toast({description:a.message,headerPrefix:"Network",code:3}):a instanceof k&&toast({description:a.message,headerPrefix:"Server",code:3});console.error(a)};window.removeShimmer=function(a){$(a).removeClass("shimmerBG")};window.removeMinPicHeight=function(a){$(a).removeClass("minPicHeight")};768>$(window).width()&&toast({description:'Elements will appear glitched on mobile. Please use a computer or enable the "request a desktop site" option. View <a href="/help#master">help</a> for more details.',
headerPrefix:"Incompatibility",code:2})});
$(document).ready(function(){function g(){$('[data-element="progress"]').removeClass("hide");$('[data-element="help"]').html("Loading...");$('[data-element="market_results"]').empty()}async function h(d=[]){g();$('[data-button="view_details"]').off();await fetch("/api/v1/market/aggregate",{method:"POST",mode:"cors",headers:csrfprotect({"Content-Type":"application/json"}),body:JSON.stringify({bookids:d})}).then(a=>{if(a.ok)return a.json();throw new NetworkError(a);}).then(a=>{if("success"!=a.status)throw new APIError(a);
if(0==a.data.length)throw new NoGoogleBooksResultsError;return a.data}).then(async a=>Promise.all(a.map(({bookid:b})=>fetch(`https://www.googleapis.com/books/v1/volumes/${b}`,{method:"GET",mode:"cors",headers:{"Content-Type":"application/json"}}))).then(b=>Promise.all(b.map(e=>{if(!e.ok)throw new NetworkError(e);return e.json()}))).then(b=>Promise.all(b.map(e=>{if("error"in e)throw new NoGoogleBooksResultsError;return e}))).then(b=>{let e=$('[data-element="market_results"]');for(let c=0;c<b.length;c++){var f=
new Book(b[c]);f=$(`<div class="row mx-0 mb-8 p-8 roundBox book" data-bookid="${a[c].bookid}">
                        <div class="col s2 mx-0 p-0 minPicHeight shimmerBG">
                            <img class="google-book-image roundBox" src="${f.strings.thumbSmall}" onload="removeShimmer(this.parentElement);removeMinPicHeight(this.parentElement)" data-field="thumb">
                        </div>
                        <div class="col s10">
                            <div class="row mt-0 mb-2">
                                <div class="col font-size-24 text-bold">${f.strings.title}</div>
                            </div>
                            <div class="row mt-0 mb-2 align-items-end">
                                <div class="col s6">
                                    <div class="row my-0">
                                        <div class="col font-size-14 text-muted">Author${f.strings.plurality}</div>
                                    </div>
                                    <div class="row my-0">
                                        <div class="col font-size-16">${f.strings.authors}</div>
                                    </div>
                                    <div class="row my-0">
                                        <div class="col font-size-14 text-muted">Publisher</div>
                                    </div>
                                    <div class="row my-0">
                                        <div class="col font-size-16">${f.strings.publisher}</div>
                                    </div>
                                    <div class="row my-0">
                                        <div class="col font-size-14 text-muted">ISBN</div>
                                    </div>
                                    <div class="row my-0">
                                        <div class="col font-size-16">${f.strings.isbn}</div>
                                    </div>
                                </div>
                                <div class="col s6">
                                    <div class="row my-0 justify-content-end">
                                        <div class="col font-size-16">${a[c].count} offer${1<a[c].count?"s":""}</div>
                                    </div>
                                    <div class="row my-0 justify-content-end">
                                        <div class="col font-size-20">From HKD${a[c].minPrice}</div>
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
                    </div>`);e.append(f)}$('[data-button="view_details"]').click(c=>{c=$(c.target).closest("[data-bookid]").attr("data-bookid");window.location.href=`/market/${c}`});$('[data-element="help"]').empty()}).catch(b=>{throw b;})).catch(a=>{a instanceof NoGoogleBooksResultsError?$('[data-element="help"]').html('<div>No results found. Please check your inputs.</div><div>If you are searching by ISBN, add an <span class="text-bold">isbn:</span> prefix.</div><div>For more information about prefixes, check the <a href="/help#query">query</a> section of help.</div>'):
a instanceof NetworkError?$('[data-element="help"]').html("An error occured when retrieving data. Please check your connection or try again."):console.error(a)}).finally(()=>{$('[data-element="progress"]').addClass("hide")})}async function k(d){d?(g(),fetch(`https://www.googleapis.com/books/v1/volumes?q=${d}&orderBy=relevance&maxResults=40&projection=lite`,{method:"GET",mode:"cors",headers:{"Content-Type":"application/json"}}).then(a=>{if(!a.ok)throw new NetworkError(a);return a.json()}).then(async a=>
{if(0==a.totalItems)throw new NoGoogleBooksResultsError;await h(a.items.map(b=>b.id))}).catch(a=>{a instanceof NoGoogleBooksResultsError?$('[data-element="help"]').html('<div>No results found. Please check your inputs.</div><div>If you are searching by ISBN, add an <span class="text-bold">isbn:</span> prefix.</div><div>For more information about prefixes, check the <a href="/help#query">query</a> section of help.</div>'):a instanceof NetworkError?$('[data-element="help"]').html("An error occured when retrieving data. Please check your connection or try again."):
console.error(a)}).finally(()=>{$('[data-element="progress"]').addClass("hide")})):await h()}$('[data-element="help"]').html("Loading...");$('[data-field="google_book_input"]').keyup(function(d,a){let b=0;return function(...e){clearTimeout(b);b=setTimeout(d.bind(this,...e),a||0)}}(function(d){13!=d.which&&k(d.target.value)},500)).keypress(function(d){13==d.which&&(d.target.blur(),k(d.target.value))});h()});
