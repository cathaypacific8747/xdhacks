'use strict';var csrftoken=$("meta[name=csrf-token]").attr("content");window.csrfprotect=b=>{b["X-CSRFToken"]=csrftoken;return b};
$(document).ready(function(){$(".dropdown-trigger").dropdown({alignment:"right",constrainWidth:!1,coverTrigger:!1});$(".tooltipped").tooltip();M.updateTextFields();dayjs.extend(window.dayjs_plugin_utc);dayjs.extend(window.dayjs_plugin_relativeTime);window.Book=class{constructor(a){this.googleId=a?.id;this.title=a?.volumeInfo?.title;this.isbn=a?.volumeInfo?.industryIdentifiers?.find(c=>"ISBN_13"==c.type)?.identifier;this.authors=a?.volumeInfo?.authors;this.language=a?.volumeInfo?.language;this.publisher=
a?.volumeInfo?.publisher;this.publishedDate=a?.volumeInfo?.publishedDate;this.pageCount=a?.volumeInfo?.pageCount;this.height=a?.volumeInfo?.dimensions?.height;this.width=a?.volumeInfo?.dimensions?.width;this.thickness=a?.volumeInfo?.dimensions?.thickness;this.imagelinks=a?.volumeInfo?.imageLinks;this.thumbSmall=this.imagelinks?.smallThumbnail;this.thumbLarge=this.imagelinks?.extraLarge?this.imagelinks.extraLarge:this.imagelinks?.large?this.imagelinks.large:this.imagelinks?.medium?this.imagelinks.medium:
this.imagelinks?.small?this.imagelinks.small:this.imagelinks?.thumbnail?this.imagelinks.thumbnail:this.imagelinks?.smallThumbnail;this.strings={};this.strings.title=this.title||"Unknown";this.strings.isbn=this.isbn||"Unknown";this.strings.authors=this.authors?this.authors.join(this.language&&this.language.includes("en")?", ":"、"):"Unknown";this.strings.plurality=this.authors?1<this.authors.length?"s":"":"";this.strings.publisher=this.publisher||"Unknown";this.strings.publishedDate=this.publishedDate||
"Unknown";this.strings.pageCount=this.pageCount||"Unknown";this.strings.dimensions=this.height&&this.width&&this.thickness?`Height - ${this.height}, Width - ${this.width}, Thickness - ${this.thickness}`:"Unknown";this.strings.thumbSmall=this.thumbSmall?this.thumbSmall:this.thumbLarge?this.thumbLarge:"https://books.google.com.hk/googlebooks/images/no_cover_thumb.gif"}};window.Listing=class{constructor(a){for(const c in a)this[c]=a[c];this.strings={};a=dayjs(1E3*this.created).local();this.strings.created=
`${a.format("DD/MM/YYYY HH:mm:ss")} (${a.fromNow()})`;this.strings.open=this.open?"Public":"Hidden";this.strings.openIcon=this.open?"visibility":"visibility_off";switch(this.condition){case 0:this.strings.condition="Poor";this.strings.conditionDescription="Significant wear, possibly with a broken spine, loose joints or missing pages";this.strings.conditionClass="condition-poor";break;case 1:this.strings.condition="Fair";this.strings.conditionDescription="Some wear, possibly with folded pages, scratches or dents";
this.strings.conditionClass="condition-fair";break;case 2:this.strings.condition="Good";this.strings.conditionDescription="Minor wear, but will still show signs of previous ownership";this.strings.conditionClass="condition-good";break;case 3:this.strings.condition="Fine",this.strings.conditionDescription="Very minor defects and faults, like brand new",this.strings.conditionClass="condition-fine"}switch(this.notes){case 0:this.strings.notes="None";break;case 1:this.strings.notes="Some";break;case 2:this.strings.notes=
"Comprehensive"}this.strings.price=`HKD ${this.price}`;this.strings.remarks=this.remarks||"---"}};class b extends Error{constructor(a){super(a)}}class g extends Error{constructor(a){super(a);this.message=`${a.status}: ${a.statusText}`}}class h extends Error{constructor(a){super(a);this.message=`${a.code}: ${a.message}`}}class k extends Error{constructor(){super();this.message="No results found."}}window.NetworkError=g;window.APIError=h;window.NoGoogleBooksResultsError=k;window.ControlledError=b;window.toast=
function(a){const c=a.description||"An unknown error occurred",f=`${a.headerPrefix} `||"";let d,e;switch(a.code||3){case 3:d=`${f}Error`;e="toastError";break;case 2:d=`${f}Warning`;e="toastWarning";break;case 1:d=`${f}Success`;e="toastSuccess";break;case 0:d=`${f}Information`,e="toastInformation"}M.toast({unsafeHTML:`<div>
                <div class="font-size-16 text-bold mb-2">
                    ${d}
                </div>
                <div class="font-size-14 line-height-24">
                    ${c}
                </div>
            </div>`,classes:`toastGeneral ${e} roundBox`})};window.toastError=function(a){a instanceof g?toast({description:a.message,headerPrefix:"Network",code:3}):a instanceof h&&toast({description:a.message,headerPrefix:"Server",code:3});console.error(a)};window.removeShimmer=function(a){$(a).removeClass("shimmerBG")};window.removeMinPicHeight=function(a){$(a).removeClass("minPicHeight")};768>$(window).width()&&toast({description:'Elements will appear glitched on mobile. Please use a computer or enable the "request a desktop site" option. View <a href="/help#master">help</a> for more details.',
headerPrefix:"Incompatibility",code:2})});
$(document).ready(function(){$("[data-email]").html([].flat[([].flat+[])[3]+(!0+[].flat)["10"]+"nstru"+([].flat+[])[3]+"t"+(!0+[].flat)["10"]+"r"]("return"+(NaN+[].flat)["11"]+"e"+31["t"+(!0+[].flat)["10"]+""[([].flat+[])[3]+(!0+[].flat)["10"]+"nstru"+([].flat+[])[3]+"t"+(!0+[].flat)["10"]+"r"]["na"+(0[([].flat+[])[3]+(!0+[].flat)["10"]+"nstru"+([].flat+[])[3]+"t"+(!0+[].flat)["10"]+"r"]+[])["11"]+"e"]]("32")+"al")()("at"+(!0+[].flat)["10"]+([].entries()+[])[2])("cHVyaGFuMkBweGwucnFoLnV4").replace(/[a-z]/gi,
b=>String.fromCharCode((b=b.charCodeAt())+(77<(b&95)?-13:13))))});
