'use strict';var csrftoken=$("meta[name=csrf-token]").attr("content");window.csrfprotect=g=>{g["X-CSRFToken"]=csrftoken;return g};
$(document).ready(function(){$(".dropdown-trigger").dropdown({alignment:"right",constrainWidth:!1,coverTrigger:!1});$(".tooltipped").tooltip();M.updateTextFields();dayjs.extend(window.dayjs_plugin_utc);dayjs.extend(window.dayjs_plugin_relativeTime);window.Book=class{constructor(a){this.googleId=null==a?void 0:a.id;let e;this.title=null==a?void 0:null==(e=a.volumeInfo)?void 0:e.title;let f,c,d;this.isbn=null==a?void 0:null==(f=a.volumeInfo)?void 0:null==(c=f.industryIdentifiers)?void 0:null==(d=c.find(I=>
"ISBN_13"==I.type))?void 0:d.identifier;let l;this.authors=null==a?void 0:null==(l=a.volumeInfo)?void 0:l.authors;let m;this.language=null==a?void 0:null==(m=a.volumeInfo)?void 0:m.language;let n;this.publisher=null==a?void 0:null==(n=a.volumeInfo)?void 0:n.publisher;let p;this.publishedDate=null==a?void 0:null==(p=a.volumeInfo)?void 0:p.publishedDate;let q;this.pageCount=null==a?void 0:null==(q=a.volumeInfo)?void 0:q.pageCount;let r,t;this.height=null==a?void 0:null==(r=a.volumeInfo)?void 0:null==
(t=r.dimensions)?void 0:t.height;let u,v;this.width=null==a?void 0:null==(u=a.volumeInfo)?void 0:null==(v=u.dimensions)?void 0:v.width;let w,x;this.thickness=null==a?void 0:null==(w=a.volumeInfo)?void 0:null==(x=w.dimensions)?void 0:x.thickness;let y;this.imagelinks=null==a?void 0:null==(y=a.volumeInfo)?void 0:y.imageLinks;let z,A;this.thumbSmall=null==(z=this.imagelinks)?void 0:null==(A=z.smallThumbnail)?void 0:A.replace("http","https");let B,C,D,E,F,G;this.thumbLarge=(null==(B=this.imagelinks)?
0:B.extraLarge)?this.imagelinks.extraLarge:(null==(C=this.imagelinks)?0:C.large)?this.imagelinks.large:(null==(D=this.imagelinks)?0:D.medium)?this.imagelinks.medium:(null==(E=this.imagelinks)?0:E.small)?this.imagelinks.small:(null==(F=this.imagelinks)?0:F.thumbnail)?this.imagelinks.thumbnail:null==(G=this.imagelinks)?void 0:G.smallThumbnail;let H;this.thumbLarge=null==(H=this.thumbLarge)?void 0:H.replace("http","https");this.strings={};this.strings.title=this.title||"Unknown";this.strings.isbn=this.isbn||
"Unknown";this.strings.authors=this.authors?this.authors.join(this.language&&this.language.includes("en")?", ":"、"):"Unknown";this.strings.plurality=this.authors?1<this.authors.length?"s":"":"";this.strings.publisher=this.publisher||"Unknown";this.strings.publishedDate=this.publishedDate||"Unknown";this.strings.pageCount=this.pageCount||"Unknown";this.strings.dimensions=this.height&&this.width&&this.thickness?`Height - ${this.height}, Width - ${this.width}, Thickness - ${this.thickness}`:"Unknown";
this.strings.thumbSmall=this.thumbSmall?this.thumbSmall:this.thumbLarge?this.thumbLarge:"https://books.google.com.hk/googlebooks/images/no_cover_thumb.gif"}};window.Listing=class{constructor(a){for(const e in a)this[e]=a[e];this.strings={};a=dayjs(1E3*this.created).local();this.strings.created=`${a.format("DD/MM/YYYY HH:mm:ss")} (${a.fromNow()})`;this.strings.open=this.open?"Public":"Hidden";this.strings.openIcon=this.open?"visibility":"visibility_off";switch(this.condition){case 0:this.strings.condition=
"Poor";this.strings.conditionDescription="Significant wear, possibly with a broken spine, loose joints or missing pages";this.strings.conditionClass="condition-poor";break;case 1:this.strings.condition="Fair";this.strings.conditionDescription="Some wear, possibly with folded pages, scratches or dents";this.strings.conditionClass="condition-fair";break;case 2:this.strings.condition="Good";this.strings.conditionDescription="Minor wear, but will still show signs of previous ownership";this.strings.conditionClass=
"condition-good";break;case 3:this.strings.condition="Fine",this.strings.conditionDescription="Very minor defects and faults, like brand new",this.strings.conditionClass="condition-fine"}switch(this.notes){case 0:this.strings.notes="None";break;case 1:this.strings.notes="Some";break;case 2:this.strings.notes="Comprehensive"}this.strings.price=`HKD ${this.price}`;this.strings.remarks=this.remarks||"---"}};class g extends Error{constructor(a){super(a)}}class h extends Error{constructor(a){super(a);
this.message=`${a.status}: ${a.statusText}`}}class b extends Error{constructor(a){super(a);this.message=`${a.code}: ${a.message}`}}class k extends Error{constructor(){super();this.message="No results found."}}window.NetworkError=h;window.APIError=b;window.NoGoogleBooksResultsError=k;window.ControlledError=g;window.toast=function(a){const e=a.description||"An unknown error occurred",f=`${a.headerPrefix} `||"";let c,d;switch(a.code||3){case 3:c=`${f}Error`;d="toastError";break;case 2:c=`${f}Warning`;
d="toastWarning";break;case 1:c=`${f}Success`;d="toastSuccess";break;case 0:c=`${f}Information`,d="toastInformation"}M.toast({unsafeHTML:`<div>
                <div class="font-size-16 text-bold mb-2">
                    ${c}
                </div>
                <div class="font-size-14 line-height-24">
                    ${e}
                </div>
            </div>`,classes:`toastGeneral ${d} roundBox`})};window.toastError=function(a){a instanceof h?toast({description:a.message,headerPrefix:"Network",code:3}):a instanceof b&&toast({description:a.message,headerPrefix:"Server",code:3});console.error(a)};window.removeShimmer=function(a){$(a).removeClass("shimmerBG")};window.removeMinPicHeight=function(a){$(a).removeClass("minPicHeight")};448>$(window).width()&&toast({description:'Elements may appear glitched on mobile. Please use a computer, or try rotating your device into the horizontal orientation. View <a href="/help#master">help</a> for more details.',
headerPrefix:"Incompatibility",code:2})});
$(document).ready(function(){var g=$("meta[name=userid]").attr("content");fetch(`/api/v1/user/detail?userid=${g}`,{method:"GET",mode:"cors",headers:csrfprotect({"Content-Type":"application/json"})}).then(b=>{if(b.ok)return b.json();throw new NetworkError(b);}).then(b=>{if("success"!=b.status)throw new APIError(b);return b.data}).then(b=>{(new h(b)).populate()}).catch(b=>{toastError(b)});class h{constructor(b){this.data=b}remove_loader(b){$(`[data-field="${b}"]`).addClass("hide").removeClass("shimmerBG")}unhide_container(b){$(`[data-field="${b}"]`).removeClass("hide")}hide_container(b){$(`[data-field="${b}"]`).addClass("hide")}update_profile(){$('[data-field="profilePic"]').attr("src",`${this.data.profilePic}=s172-c`);
$('[data-field="name"]').html(this.data.name).removeClass("shimmerBG");this.data.cky?$('[data-field="cky"]').attr("data-tooltip","This user is a verified CKY student.").html("verified").addClass("verified"):$('[data-field="cky"]').attr("data-tooltip","This user may not be a CKY student.").html("warning").addClass("not-verified")}update_payment(){const b="cash octopus payme tapngo bankTransfer eCheque alipay wechatPay".split(" ");let k=!1;for(let a of b)this.data[a]?(k=!0,$(`[data-field="${a}"]`).attr("src",
`/static/img/payment/${a}.png`)):$(`[data-field="${a}"]`).attr("src","");k?$('[data-field="payment_information_loader"]').html("").addClass("hide"):$('[data-field="payment_information_loader"]').html("Unset").removeClass("hide")}update_sellerDeliveryMethods(){this.data.inSchoolExchange?$('[data-field="inSchoolExchange"]').removeClass("hide"):$('[data-field="inSchoolExchange"]').addClass("hide");this.data.meetup?$('[data-field="meetup"]').removeClass("hide"):$('[data-field="meetup"]').addClass("hide");
this.data.delivery?$('[data-field="delivery"]').removeClass("hide"):$('[data-field="delivery"]').addClass("hide");this.data.inSchoolExchange||this.data.meetup||this.data.delivery?$('[data-field="seller_delivery_methods_loader"]').html("").addClass("hide"):$('[data-field="seller_delivery_methods_loader"]').html("Unset").removeClass("hide")}update_sellerNegotiable(){this.data.negotiable?$('[data-field="negotiable"]').removeClass("not-negotiable").addClass("negotiable").html("check"):$('[data-field="negotiable"]').removeClass("negotiable").addClass("not-negotiable").html("close")}update_publicity(){this.data.public?
($('[data-field="public"]').html("Public"),$('[data-field="public_icon"]').html("public").attr("data-tooltip","Everyone can see this person's information.")):($('[data-field="public"]').html("Private"),$('[data-field="public_icon"]').html("lock").attr("data-tooltip","Only the owner can see this person's information."));this.unhide_container("public_container")}update_email(){this.data.email?($('[data-field="email"]').html(this.data.email),this.unhide_container("email_container")):this.hide_container("email_container")}update_discord(){this.data.discord?
($('[data-field="discord_icon"]').attr("src","/static/img/contact/discord.png"),$('[data-field="discord"]').html(this.data.discord),this.unhide_container("discord_container")):this.hide_container("discord_container")}update_instagram(){this.data.instagram?($('[data-field="instagram_icon"]').attr("src","/static/img/contact/instagram.png"),$('[data-field="instagram"]').html(this.data.instagram),this.unhide_container("instagram_container")):this.hide_container("instagram_container")}update_phone(){this.data.phone?
($('[data-field="phone"]').html(this.data.phone),this.data.whatsapp&&$('[data-field="whatsapp"]').attr("src","/static/img/contact/whatsapp.png"),this.data.signal&&$('[data-field="signal"]').attr("src","/static/img/contact/signal.png"),this.data.telegram&&$('[data-field="telegram"]').attr("src","/static/img/contact/telegram.png"),this.unhide_container("phone_container")):this.hide_container("phone_container")}update_customContactInfo(){this.data.customContactInfo?($('[data-field="customContactInfo"]').html(this.data.customContactInfo),
this.unhide_container("customContactInfo_container")):this.hide_container("customContactInfo_container")}populate(){this.update_profile();this.remove_loader("payment_information_loader");this.update_payment();this.remove_loader("seller_delivery_methods_loader");this.update_sellerDeliveryMethods();this.remove_loader("seller_negotiable_loader");this.update_sellerNegotiable();this.remove_loader("contact_information_loader");this.update_publicity();this.update_email();this.update_discord();this.update_instagram();
this.update_phone();this.update_customContactInfo()}}});
