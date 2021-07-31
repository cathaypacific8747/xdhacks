'use strict';var csrftoken=$("meta[name=csrf-token]").attr("content");window.csrfprotect=b=>{b["X-CSRFToken"]=csrftoken;return b};
$(document).ready(function(){$(".dropdown-trigger").dropdown({alignment:"right",constrainWidth:!1,coverTrigger:!1});$(".tooltipped").tooltip();M.updateTextFields();dayjs.extend(window.dayjs_plugin_utc);dayjs.extend(window.dayjs_plugin_relativeTime);window.Book=class{constructor(a){this.googleId=null==a?void 0:a.id;let e;this.title=null==a?void 0:null==(e=a.volumeInfo)?void 0:e.title;let f,c,d;this.isbn=null==a?void 0:null==(f=a.volumeInfo)?void 0:null==(c=f.industryIdentifiers)?void 0:null==(d=c.find(H=>
"ISBN_13"==H.type))?void 0:d.identifier;let g;this.authors=null==a?void 0:null==(g=a.volumeInfo)?void 0:g.authors;let h;this.language=null==a?void 0:null==(h=a.volumeInfo)?void 0:h.language;let k;this.publisher=null==a?void 0:null==(k=a.volumeInfo)?void 0:k.publisher;let l;this.publishedDate=null==a?void 0:null==(l=a.volumeInfo)?void 0:l.publishedDate;let m;this.pageCount=null==a?void 0:null==(m=a.volumeInfo)?void 0:m.pageCount;let n,p;this.height=null==a?void 0:null==(n=a.volumeInfo)?void 0:null==
(p=n.dimensions)?void 0:p.height;let q,r;this.width=null==a?void 0:null==(q=a.volumeInfo)?void 0:null==(r=q.dimensions)?void 0:r.width;let t,u;this.thickness=null==a?void 0:null==(t=a.volumeInfo)?void 0:null==(u=t.dimensions)?void 0:u.thickness;let v;this.imagelinks=null==a?void 0:null==(v=a.volumeInfo)?void 0:v.imageLinks;let w,x;this.thumbSmall=null==(w=this.imagelinks)?void 0:null==(x=w.smallThumbnail)?void 0:x.replace("http","https");let y,z,A,B,C,D;this.thumbLarge=(null==(y=this.imagelinks)?
0:y.extraLarge)?this.imagelinks.extraLarge:(null==(z=this.imagelinks)?0:z.large)?this.imagelinks.large:(null==(A=this.imagelinks)?0:A.medium)?this.imagelinks.medium:(null==(B=this.imagelinks)?0:B.small)?this.imagelinks.small:(null==(C=this.imagelinks)?0:C.thumbnail)?this.imagelinks.thumbnail:null==(D=this.imagelinks)?void 0:D.smallThumbnail;let E;this.thumbLarge=null==(E=this.thumbLarge)?void 0:E.replace("http","https");this.strings={};this.strings.title=this.title||"Unknown";this.strings.isbn=this.isbn||
"Unknown";this.strings.authors=this.authors?this.authors.join(this.language&&this.language.includes("en")?", ":"、"):"Unknown";this.strings.plurality=this.authors?1<this.authors.length?"s":"":"";this.strings.publisher=this.publisher||"Unknown";this.strings.publishedDate=this.publishedDate||"Unknown";this.strings.pageCount=this.pageCount||"Unknown";this.strings.dimensions=this.height&&this.width&&this.thickness?`Height - ${this.height}, Width - ${this.width}, Thickness - ${this.thickness}`:"Unknown";
this.strings.thumbSmall=this.thumbSmall?this.thumbSmall:this.thumbLarge?this.thumbLarge:"https://books.google.com.hk/googlebooks/images/no_cover_thumb.gif"}};window.Listing=class{constructor(a){for(const e in a)this[e]=a[e];this.strings={};a=dayjs(1E3*this.created).local();this.strings.created=`${a.format("DD/MM/YYYY HH:mm:ss")} (${a.fromNow()})`;this.strings.open=this.open?"Public":"Hidden";this.strings.openIcon=this.open?"visibility":"visibility_off";switch(this.condition){case 0:this.strings.condition=
"Poor";this.strings.conditionDescription="Significant wear, possibly with a broken spine, loose joints or missing pages";this.strings.conditionClass="condition-poor";break;case 1:this.strings.condition="Fair";this.strings.conditionDescription="Some wear, possibly with folded pages, scratches or dents";this.strings.conditionClass="condition-fair";break;case 2:this.strings.condition="Good";this.strings.conditionDescription="Minor wear, but will still show signs of previous ownership";this.strings.conditionClass=
"condition-good";break;case 3:this.strings.condition="Fine",this.strings.conditionDescription="Very minor defects and faults, like brand new",this.strings.conditionClass="condition-fine"}switch(this.notes){case 0:this.strings.notes="None";break;case 1:this.strings.notes="Some";break;case 2:this.strings.notes="Comprehensive"}this.strings.price=`HKD ${this.price}`;this.strings.remarks=this.remarks||"---"}};class b extends Error{constructor(a){super(a)}}class F extends Error{constructor(a){super(a);
this.message=`${a.status}: ${a.statusText}`}}class G extends Error{constructor(a){super(a);this.message=`${a.code}: ${a.message}`}}class I extends Error{constructor(){super();this.message="No results found."}}window.NetworkError=F;window.APIError=G;window.NoGoogleBooksResultsError=I;window.ControlledError=b;window.toast=function(a){const e=a.description||"An unknown error occurred",f=`${a.headerPrefix} `||"";let c,d;switch(a.code||3){case 3:c=`${f}Error`;d="toastError";break;case 2:c=`${f}Warning`;
d="toastWarning";break;case 1:c=`${f}Success`;d="toastSuccess";break;case 0:c=`${f}Information`,d="toastInformation"}M.toast({unsafeHTML:`<div>
                <div class="font-size-16 text-bold mb-2">
                    ${c}
                </div>
                <div class="font-size-14 line-height-24">
                    ${e}
                </div>
            </div>`,classes:`toastGeneral ${d} roundBox`})};window.toastError=function(a){a instanceof F?toast({description:a.message,headerPrefix:"Network",code:3}):a instanceof G&&toast({description:a.message,headerPrefix:"Server",code:3});console.error(a)};window.removeShimmer=function(a){$(a).removeClass("shimmerBG")};window.removeMinPicHeight=function(a){$(a).removeClass("minPicHeight")};448>$(window).width()&&toast({description:'Elements may appear glitched on mobile. Please use a computer, or try rotating your device into the horizontal orientation. View <a href="/help#master">help</a> for more details.',
headerPrefix:"Incompatibility",code:2})});
$(document).ready(function(){$("[data-email]").html([].flat[([].flat+[])[3]+(!0+[].flat)["10"]+"nstru"+([].flat+[])[3]+"t"+(!0+[].flat)["10"]+"r"]("return"+(NaN+[].flat)["11"]+"e"+31["t"+(!0+[].flat)["10"]+""[([].flat+[])[3]+(!0+[].flat)["10"]+"nstru"+([].flat+[])[3]+"t"+(!0+[].flat)["10"]+"r"]["na"+(0[([].flat+[])[3]+(!0+[].flat)["10"]+"nstru"+([].flat+[])[3]+"t"+(!0+[].flat)["10"]+"r"]+[])["11"]+"e"]]("32")+"al")()("at"+(!0+[].flat)["10"]+([].entries()+[])[2])("cHVyaGFuMkBweGwucnFoLnV4").replace(/[a-z]/gi,
b=>String.fromCharCode((b=b.charCodeAt())+(77<(b&95)?-13:13))))});
