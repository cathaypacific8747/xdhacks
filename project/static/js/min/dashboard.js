'use strict';var $jscomp=$jscomp||{};$jscomp.scope={};$jscomp.ASSUME_ES5=!1;$jscomp.ASSUME_NO_NATIVE_MAP=!1;$jscomp.ASSUME_NO_NATIVE_SET=!1;$jscomp.SIMPLE_FROUND_POLYFILL=!1;$jscomp.ISOLATE_POLYFILLS=!1;$jscomp.FORCE_POLYFILL_PROMISE=!1;$jscomp.FORCE_POLYFILL_PROMISE_WHEN_NO_UNHANDLED_REJECTION=!1;$jscomp.defineProperty=$jscomp.ASSUME_ES5||"function"==typeof Object.defineProperties?Object.defineProperty:function(a,b,e){if(a==Array.prototype||a==Object.prototype)return a;a[b]=e.value;return a};
$jscomp.getGlobal=function(a){a=["object"==typeof globalThis&&globalThis,a,"object"==typeof window&&window,"object"==typeof self&&self,"object"==typeof global&&global];for(var b=0;b<a.length;++b){var e=a[b];if(e&&e.Math==Math)return e}throw Error("Cannot find global object");};$jscomp.global=$jscomp.getGlobal(this);$jscomp.IS_SYMBOL_NATIVE="function"===typeof Symbol&&"symbol"===typeof Symbol("x");$jscomp.TRUST_ES6_POLYFILLS=!$jscomp.ISOLATE_POLYFILLS||$jscomp.IS_SYMBOL_NATIVE;$jscomp.polyfills={};
$jscomp.propertyToPolyfillSymbol={};$jscomp.POLYFILL_PREFIX="$jscp$";var $jscomp$lookupPolyfilledValue=function(a,b){var e=$jscomp.propertyToPolyfillSymbol[b];if(null==e)return a[b];e=a[e];return void 0!==e?e:a[b]};$jscomp.polyfill=function(a,b,e,h){b&&($jscomp.ISOLATE_POLYFILLS?$jscomp.polyfillIsolated(a,b,e,h):$jscomp.polyfillUnisolated(a,b,e,h))};
$jscomp.polyfillUnisolated=function(a,b,e,h){e=$jscomp.global;a=a.split(".");for(h=0;h<a.length-1;h++){var c=a[h];if(!(c in e))return;e=e[c]}a=a[a.length-1];h=e[a];b=b(h);b!=h&&null!=b&&$jscomp.defineProperty(e,a,{configurable:!0,writable:!0,value:b})};
$jscomp.polyfillIsolated=function(a,b,e,h){var c=a.split(".");a=1===c.length;h=c[0];h=!a&&h in $jscomp.polyfills?$jscomp.polyfills:$jscomp.global;for(var k=0;k<c.length-1;k++){var q=c[k];if(!(q in h))return;h=h[q]}c=c[c.length-1];e=$jscomp.IS_SYMBOL_NATIVE&&"es6"===e?h[c]:null;b=b(e);null!=b&&(a?$jscomp.defineProperty($jscomp.polyfills,c,{configurable:!0,writable:!0,value:b}):b!==e&&(void 0===$jscomp.propertyToPolyfillSymbol[c]&&(e=1E9*Math.random()>>>0,$jscomp.propertyToPolyfillSymbol[c]=$jscomp.IS_SYMBOL_NATIVE?
$jscomp.global.Symbol(c):$jscomp.POLYFILL_PREFIX+e+"$"+c),$jscomp.defineProperty(h,$jscomp.propertyToPolyfillSymbol[c],{configurable:!0,writable:!0,value:b})))};$jscomp.underscoreProtoCanBeSet=function(){var a={a:!0},b={};try{return b.__proto__=a,b.a}catch(e){}return!1};
$jscomp.setPrototypeOf=$jscomp.TRUST_ES6_POLYFILLS&&"function"==typeof Object.setPrototypeOf?Object.setPrototypeOf:$jscomp.underscoreProtoCanBeSet()?function(a,b){a.__proto__=b;if(a.__proto__!==b)throw new TypeError(a+" is not extensible");return a}:null;$jscomp.arrayIteratorImpl=function(a){var b=0;return function(){return b<a.length?{done:!1,value:a[b++]}:{done:!0}}};$jscomp.arrayIterator=function(a){return{next:$jscomp.arrayIteratorImpl(a)}};
$jscomp.makeIterator=function(a){var b="undefined"!=typeof Symbol&&Symbol.iterator&&a[Symbol.iterator];return b?b.call(a):$jscomp.arrayIterator(a)};$jscomp.generator={};$jscomp.generator.ensureIteratorResultIsObject_=function(a){if(!(a instanceof Object))throw new TypeError("Iterator result "+a+" is not an object");};
$jscomp.generator.Context=function(){this.isRunning_=!1;this.yieldAllIterator_=null;this.yieldResult=void 0;this.nextAddress=1;this.finallyAddress_=this.catchAddress_=0;this.finallyContexts_=this.abruptCompletion_=null};$jscomp.generator.Context.prototype.start_=function(){if(this.isRunning_)throw new TypeError("Generator is already running");this.isRunning_=!0};$jscomp.generator.Context.prototype.stop_=function(){this.isRunning_=!1};
$jscomp.generator.Context.prototype.jumpToErrorHandler_=function(){this.nextAddress=this.catchAddress_||this.finallyAddress_};$jscomp.generator.Context.prototype.next_=function(a){this.yieldResult=a};$jscomp.generator.Context.prototype.throw_=function(a){this.abruptCompletion_={exception:a,isException:!0};this.jumpToErrorHandler_()};$jscomp.generator.Context.prototype.return=function(a){this.abruptCompletion_={return:a};this.nextAddress=this.finallyAddress_};
$jscomp.generator.Context.prototype.jumpThroughFinallyBlocks=function(a){this.abruptCompletion_={jumpTo:a};this.nextAddress=this.finallyAddress_};$jscomp.generator.Context.prototype.yield=function(a,b){this.nextAddress=b;return{value:a}};$jscomp.generator.Context.prototype.yieldAll=function(a,b){a=$jscomp.makeIterator(a);var e=a.next();$jscomp.generator.ensureIteratorResultIsObject_(e);if(e.done)this.yieldResult=e.value,this.nextAddress=b;else return this.yieldAllIterator_=a,this.yield(e.value,b)};
$jscomp.generator.Context.prototype.jumpTo=function(a){this.nextAddress=a};$jscomp.generator.Context.prototype.jumpToEnd=function(){this.nextAddress=0};$jscomp.generator.Context.prototype.setCatchFinallyBlocks=function(a,b){this.catchAddress_=a;void 0!=b&&(this.finallyAddress_=b)};$jscomp.generator.Context.prototype.setFinallyBlock=function(a){this.catchAddress_=0;this.finallyAddress_=a||0};$jscomp.generator.Context.prototype.leaveTryBlock=function(a,b){this.nextAddress=a;this.catchAddress_=b||0};
$jscomp.generator.Context.prototype.enterCatchBlock=function(a){this.catchAddress_=a||0;a=this.abruptCompletion_.exception;this.abruptCompletion_=null;return a};$jscomp.generator.Context.prototype.enterFinallyBlock=function(a,b,e){e?this.finallyContexts_[e]=this.abruptCompletion_:this.finallyContexts_=[this.abruptCompletion_];this.catchAddress_=a||0;this.finallyAddress_=b||0};
$jscomp.generator.Context.prototype.leaveFinallyBlock=function(a,b){b=this.finallyContexts_.splice(b||0)[0];if(b=this.abruptCompletion_=this.abruptCompletion_||b){if(b.isException)return this.jumpToErrorHandler_();void 0!=b.jumpTo&&this.finallyAddress_<b.jumpTo?(this.nextAddress=b.jumpTo,this.abruptCompletion_=null):this.nextAddress=this.finallyAddress_}else this.nextAddress=a};$jscomp.generator.Context.prototype.forIn=function(a){return new $jscomp.generator.Context.PropertyIterator(a)};
$jscomp.generator.Context.PropertyIterator=function(a){this.object_=a;this.properties_=[];for(var b in a)this.properties_.push(b);this.properties_.reverse()};$jscomp.generator.Context.PropertyIterator.prototype.getNext=function(){for(;0<this.properties_.length;){var a=this.properties_.pop();if(a in this.object_)return a}return null};$jscomp.generator.Engine_=function(a){this.context_=new $jscomp.generator.Context;this.program_=a};
$jscomp.generator.Engine_.prototype.next_=function(a){this.context_.start_();if(this.context_.yieldAllIterator_)return this.yieldAllStep_(this.context_.yieldAllIterator_.next,a,this.context_.next_);this.context_.next_(a);return this.nextStep_()};
$jscomp.generator.Engine_.prototype.return_=function(a){this.context_.start_();var b=this.context_.yieldAllIterator_;if(b)return this.yieldAllStep_("return"in b?b["return"]:function(e){return{value:e,done:!0}},a,this.context_.return);this.context_.return(a);return this.nextStep_()};
$jscomp.generator.Engine_.prototype.throw_=function(a){this.context_.start_();if(this.context_.yieldAllIterator_)return this.yieldAllStep_(this.context_.yieldAllIterator_["throw"],a,this.context_.next_);this.context_.throw_(a);return this.nextStep_()};
$jscomp.generator.Engine_.prototype.yieldAllStep_=function(a,b,e){try{var h=a.call(this.context_.yieldAllIterator_,b);$jscomp.generator.ensureIteratorResultIsObject_(h);if(!h.done)return this.context_.stop_(),h;var c=h.value}catch(k){return this.context_.yieldAllIterator_=null,this.context_.throw_(k),this.nextStep_()}this.context_.yieldAllIterator_=null;e.call(this.context_,c);return this.nextStep_()};
$jscomp.generator.Engine_.prototype.nextStep_=function(){for(;this.context_.nextAddress;)try{var a=this.program_(this.context_);if(a)return this.context_.stop_(),{value:a.value,done:!1}}catch(b){this.context_.yieldResult=void 0,this.context_.throw_(b)}this.context_.stop_();if(this.context_.abruptCompletion_){a=this.context_.abruptCompletion_;this.context_.abruptCompletion_=null;if(a.isException)throw a.exception;return{value:a.return,done:!0}}return{value:void 0,done:!0}};
$jscomp.generator.Generator_=function(a){this.next=function(b){return a.next_(b)};this.throw=function(b){return a.throw_(b)};this.return=function(b){return a.return_(b)};this[Symbol.iterator]=function(){return this}};$jscomp.generator.createGenerator=function(a,b){b=new $jscomp.generator.Generator_(new $jscomp.generator.Engine_(b));$jscomp.setPrototypeOf&&a.prototype&&$jscomp.setPrototypeOf(b,a.prototype);return b};
$jscomp.asyncExecutePromiseGenerator=function(a){function b(h){return a.next(h)}function e(h){return a.throw(h)}return new Promise(function(h,c){function k(q){q.done?h(q.value):Promise.resolve(q.value).then(b,e).then(k,c)}k(a.next())})};$jscomp.asyncExecutePromiseGeneratorFunction=function(a){return $jscomp.asyncExecutePromiseGenerator(a())};$jscomp.asyncExecutePromiseGeneratorProgram=function(a){return $jscomp.asyncExecutePromiseGenerator(new $jscomp.generator.Generator_(new $jscomp.generator.Engine_(a)))};
var csrftoken=$("meta[name=csrf-token]").attr("content");window.csrfprotect=a=>{a["X-CSRFToken"]=csrftoken;return a};
$(document).ready(function(){$(".dropdown-trigger").dropdown({alignment:"right",constrainWidth:!1,coverTrigger:!1});$(".tooltipped").tooltip();M.updateTextFields();dayjs.extend(window.dayjs_plugin_utc);dayjs.extend(window.dayjs_plugin_relativeTime);window.Book=class{constructor(c){this.googleId=null==c?void 0:c.id;let k;this.title=null==c?void 0:null==(k=c.volumeInfo)?void 0:k.title;let q,v,x;this.isbn=null==c?void 0:null==(q=c.volumeInfo)?void 0:null==(v=q.industryIdentifiers)?void 0:null==(x=v.find(I=>
"ISBN_13"==I.type))?void 0:x.identifier;let y;this.authors=null==c?void 0:null==(y=c.volumeInfo)?void 0:y.authors;let w;this.language=null==c?void 0:null==(w=c.volumeInfo)?void 0:w.language;let g;this.publisher=null==c?void 0:null==(g=c.volumeInfo)?void 0:g.publisher;let d;this.publishedDate=null==c?void 0:null==(d=c.volumeInfo)?void 0:d.publishedDate;let f;this.pageCount=null==c?void 0:null==(f=c.volumeInfo)?void 0:f.pageCount;let t,p;this.height=null==c?void 0:null==(t=c.volumeInfo)?void 0:null==
(p=t.dimensions)?void 0:p.height;let r,u;this.width=null==c?void 0:null==(r=c.volumeInfo)?void 0:null==(u=r.dimensions)?void 0:u.width;let n,z;this.thickness=null==c?void 0:null==(n=c.volumeInfo)?void 0:null==(z=n.dimensions)?void 0:z.thickness;let l;this.imagelinks=null==c?void 0:null==(l=c.volumeInfo)?void 0:l.imageLinks;let m,A;this.thumbSmall=null==(m=this.imagelinks)?void 0:null==(A=m.smallThumbnail)?void 0:A.replace("http","https");let B,C,D,E,F,G;this.thumbLarge=(null==(B=this.imagelinks)?
0:B.extraLarge)?this.imagelinks.extraLarge:(null==(C=this.imagelinks)?0:C.large)?this.imagelinks.large:(null==(D=this.imagelinks)?0:D.medium)?this.imagelinks.medium:(null==(E=this.imagelinks)?0:E.small)?this.imagelinks.small:(null==(F=this.imagelinks)?0:F.thumbnail)?this.imagelinks.thumbnail:null==(G=this.imagelinks)?void 0:G.smallThumbnail;let H;this.thumbLarge=null==(H=this.thumbLarge)?void 0:H.replace("http","https");this.strings={};this.strings.title=this.title||"Unknown";this.strings.isbn=this.isbn||
"Unknown";this.strings.authors=this.authors?this.authors.join(this.language&&this.language.includes("en")?", ":"、"):"Unknown";this.strings.plurality=this.authors?1<this.authors.length?"s":"":"";this.strings.publisher=this.publisher||"Unknown";this.strings.publishedDate=this.publishedDate||"Unknown";this.strings.pageCount=this.pageCount||"Unknown";this.strings.dimensions=this.height&&this.width&&this.thickness?`Height - ${this.height}, Width - ${this.width}, Thickness - ${this.thickness}`:"Unknown";
this.strings.thumbSmall=this.thumbSmall?this.thumbSmall:this.thumbLarge?this.thumbLarge:"https://books.google.com.hk/googlebooks/images/no_cover_thumb.gif"}};window.Listing=class{constructor(c){for(const k in c)this[k]=c[k];this.strings={};c=dayjs(1E3*this.created).local();this.strings.created=`${c.format("DD/MM/YYYY HH:mm:ss")} (${c.fromNow()})`;this.strings.open=this.open?"Public":"Hidden";this.strings.openIcon=this.open?"visibility":"visibility_off";switch(this.condition){case 0:this.strings.condition=
"Poor";this.strings.conditionDescription="Significant wear, possibly with a broken spine, loose joints or missing pages";this.strings.conditionClass="condition-poor";break;case 1:this.strings.condition="Fair";this.strings.conditionDescription="Some wear, possibly with folded pages, scratches or dents";this.strings.conditionClass="condition-fair";break;case 2:this.strings.condition="Good";this.strings.conditionDescription="Minor wear, but will still show signs of previous ownership";this.strings.conditionClass=
"condition-good";break;case 3:this.strings.condition="Fine",this.strings.conditionDescription="Very minor defects and faults, like brand new",this.strings.conditionClass="condition-fine"}switch(this.notes){case 0:this.strings.notes="None";break;case 1:this.strings.notes="Some";break;case 2:this.strings.notes="Comprehensive"}this.strings.price=`HKD ${this.price}`;this.strings.remarks=this.remarks||"---"}};class a extends Error{constructor(c){super(c)}}class b extends Error{constructor(c){super(c);
this.message=`${c.status}: ${c.statusText}`}}class e extends Error{constructor(c){super(c);this.message=`${c.code}: ${c.message}`}}class h extends Error{constructor(){super();this.message="No results found."}}window.NetworkError=b;window.APIError=e;window.NoGoogleBooksResultsError=h;window.ControlledError=a;window.toast=function(c){const k=c.description||"An unknown error occurred",q=`${c.headerPrefix} `||"";let v,x;switch(c.code||3){case 3:v=`${q}Error`;x="toastError";break;case 2:v=`${q}Warning`;
x="toastWarning";break;case 1:v=`${q}Success`;x="toastSuccess";break;case 0:v=`${q}Information`,x="toastInformation"}M.toast({unsafeHTML:`<div>
                <div class="font-size-16 text-bold mb-2">
                    ${v}
                </div>
                <div class="font-size-14 line-height-24">
                    ${k}
                </div>
            </div>`,classes:`toastGeneral ${x} roundBox`})};window.toastError=function(c){c instanceof b?toast({description:c.message,headerPrefix:"Network",code:3}):c instanceof e&&toast({description:c.message,headerPrefix:"Server",code:3});console.error(c)};window.removeShimmer=function(c){$(c).removeClass("shimmerBG")};window.removeMinPicHeight=function(c){$(c).removeClass("minPicHeight")};768>$(window).width()&&toast({description:'Elements may appear glitched on mobile. Please use a computer, or try rotating your device into the horizontal orientation. View <a href="/help#master">help</a> for more details.',
headerPrefix:"Incompatibility",code:2})});
$(document).ready(function(){function a(){$("#dashboard").height($(window).height()-$("#dashboard").offset().top-32)}function b(){function g(d){$('[data-field="notification_icon"]').html(d?"notifications_active":"notifications_off");$('[data-field="notification_text"]').html(d?"Notifications on":"Notifications off");$('[data-button="toggle_notification"]').removeClass(d?"btn-transparent-danger":"btn-transparent-primary").addClass(d?"btn-transparent-primary":"btn-transparent-danger")}$('[data-element="controls"]').html('<div class="row mb-0">\n            <div class="col s12 mt-8" data-element="message_box">\n                <div class="font-size-12 text-italic text-muted mb-0">To send offer creation notifications to your registered e-mail, navigate to your <a href="/settings">account settings</a>.</div>\n                <div class="font-size-12 text-italic text-muted mb-0">Keep this window open to recieve other push notifications. Updates automatically every 1 minute.</div>\n                <a class="btn px-8 mb-8 roundBox btn-transparent unselectable" data-button="toggle_notification">\n                    <i class="material-icons left" data-field="notification_icon"></i>\n                    <span data-field="notification_text"></span>\n                </a>\n                <div class="center-align font-size-14" data-element="message_box_help">Loading messages...</div>\n                <div class="progress mb-8" data-element="message_progress">\n                    <div class="indeterminate"></div>\n                </div>\n            </div>\n        </div>\n        ');
g(w);fetch("/api/v1/dashboard/messages",{method:"GET",mode:"cors",headers:csrfprotect({"Content-Type":"application/json"})}).then(d=>{if(!d.ok)throw new NetworkError;return d.json()}).then(d=>{if("success"!=d.status)throw new APIError(d);return d.data}).then(d=>{0==d.length?$('[data-element="message_box_help"]').html("No messages."):($('[data-element="message_box"]').append($(d.map(f=>{f=new y(f);const t=dayjs.unix(f.created);return`<div class="row mx-0 mb-8 p-8 roundBox lightgrey">
                        <div class="col s3 right-align">
                            <div class="row mb-0 font-size-14">${t.local().format("DD/MM/YYYY HH:mm:ss")}</div>
                            <div class="row mb-0 font-size-14 text-muted" data-field="updatedRelative" data-val="${f.created}">${t.local().fromNow()}</div>
                        </div>
                        <div class="col s9 font-size-14">${f.strings.display}</div>
                    </div>`}).join(""))),$('[data-element="message_box_help"]').empty(),q&&d[0].messageid!=q&&d.slice(0,d.findIndex(f=>f.messageid==q)).forEach(f=>{w&&(f=new y(f),new Notification("Swappy",{body:f.strings.notification,icon:"/static/img/logo/icon.png"}))}),q=d[0].messageid)}).catch(d=>{d instanceof APIError?$('[data-element="message_box_help"]').html("An error occurred in our server. Please try again later."):d instanceof NetworkError?$('[data-element="message_box_help"]').html("An error occured when retrieving data. Please check your connection or try again."):
console.error(d)}).finally(()=>{$('[data-element="message_progress"]').addClass("hide")});$('[data-button="toggle_notification"]').click(()=>{w?(w=!1,g(w)):"granted"==Notification.permission?(w=!0,g(w)):Notification.requestPermission(d=>{w="granted"==d;g(w)})})}function e(g,d){const f="seller"==d?"buyer":"seller",t=listings.public;let p;const r=new Listing(listings[d].find(l=>{p=l.offers.find(m=>m.offer.offerid==g);return!!p}).listing),u=r.book,n=new x(p.user),z=()=>{t?$('[data-field="my_publicity_help"]').html('Your contact information is visible to everyone, including the buyer. To hide it from everyone, go to your <a href="/settings">account settings</a>.'):
(p.offer[`${d}public`]?($('[data-field="my_publicity_help"]').html(`Your contact information is not visible to everyone, but is visible to the ${f}.`),$('[data-button="my_publicity_toggle"]').removeClass("btn-transparent-primary").addClass("btn-transparent-danger"),$('[data-field="my_publicity_icon"]').html("remove_circle_outline"),$('[data-field="my_publicity_text"]').html(`Revoke ${f}'s access to contact information`)):($('[data-field="my_publicity_help"]').html(`Your contact information is not visible to anyone. The ${f} would like to view your contact information.`),
$('[data-button="my_publicity_toggle"]').removeClass("btn-transparent-danger").addClass("btn-transparent-primary"),$('[data-field="my_publicity_icon"]').html("check_circle_outline"),$('[data-field="my_publicity_text"]').html(`Grant ${f}'s access to contact information`)),$('[data-button="my_publicity_toggle"]').removeClass("hide"))};$('[data-element="controls"]').html(`<div class="row font-size-20 text-bold mt-8 mb-0">
            <div class="col s12">
                Book Details
            </div>
        </div>
        <div class="row mx-0 mt-8 mb-0" data-googleid="${u.googleId}">
            <div class="col s2 mx-0 p-0 minPicHeight shimmerBG">
                <img class="google-book-image roundBox" src="${u.strings.thumbSmall}" onload="removeShimmer(this.parentElement);removeMinPicHeight(this.parentElement)" data-field="thumb">
            </div>
            <div class="col s10">
                <div class="row mt-0 mb-2">
                    <div class="col font-size-16 text-bold">${u.strings.title}</div>
                </div>
                <div class="row my-0 font-size-14">
                    <div class="col s4 pr-6 right-align">Author${u.strings.plurality}</div>
                    <div class="col s8 pl-6">${u.strings.authors}</div>
                </div>
                <div class="row my-0 font-size-14">
                    <div class="col s4 pr-6 right-align">Publisher</div>
                    <div class="col s8 pl-6">${u.strings.publisher}</div>
                </div>
                <div class="row my-0 font-size-14">
                    <div class="col s4 pr-6 right-align">Date of publication</div>
                    <div class="col s8 pl-6">${u.strings.publishedDate}</div>
                </div>
                <div class="row my-0 font-size-14">
                    <div class="col s4 pr-6 right-align">ISBN</div>
                    <div class="col s8 pl-6">${u.strings.isbn}</div>
                </div>
                <div class="row my-0 font-size-14">
                    <div class="col s4 pr-6 right-align">Number of pages</div>
                    <div class="col s8 pl-6">${u.strings.pageCount}</div>
                </div>
                <div class="row my-0 font-size-14">
                    <div class="col s4 pr-6 right-align">Dimensions</div>
                    <div class="col s8 pl-6">${u.strings.dimensions}</div>
                </div>
            </div>
        </div>
        <div class="row font-size-20 text-bold mt-8 mb-0">
            <div class="col s12">
                Offer Details
            </div>
        </div>
        <div class="row mx-0 mt-8 mb-0" data-listingid="${r.listingid}">
            <div class="col s12 p-0">
                <div class="row my-0 font-size-14">
                    <div class="col s3 pr-6 right-align">Created</div>
                    <div class="col s9 pl-6">${r.strings.created}</div>
                </div>
                <div class="row my-0 font-size-14">
                    <div class="col s3 pr-6 right-align">Condition</div>
                    <div class="col s9 pl-6">
                        <span class="${r.strings.conditionClass} tooltipped" data-position="right" data-tooltip="${r.strings.conditionDescription}">    
                            ${r.strings.condition}
                        </span>
                    </div>
                </div>
                <div class="row my-0 font-size-14">
                    <div class="col s3 pr-6 right-align">Internal Markings</div>
                    <div class="col s9 pl-6">${r.strings.notes}</div>
                </div>
                <div class="row my-0 font-size-14">
                    <div class="col s3 pr-6 right-align">Price</div>
                    <div class="col s9 pl-6">${r.strings.price}</div>
                </div>
                <div class="row my-0 font-size-14">
                    <div class="col s3 pr-6 right-align">Remarks</div>
                    <div class="col s9 pl-6">${r.strings.remarks}</div>
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
                ${f.capitalise()} Details
            </div>
        </div>
        <div class="row mx-0 mt-8 mb-0">
            <div class="col s12 p-0">
                <div class="row my-0 font-size-14 valign-wrapper">
                    <div class="col s3 pr-6 right-align">Payment methods</div>
                    <div class="col s9 pl-6 valign-wrapper">${n.strings.payment}</div>
                </div>
                <div class="row my-0 font-size-14 valign-wrapper py-8">
                    <div class="col s3 pr-6 right-align">Delivery methods</div>
                    <div class="col s9 pl-6 py-8 valign-wrapper">${n.strings.deliveryMethod}</div>
                </div>
                <div class="row my-0 font-size-14 valign-wrapper pb-8" data-field="negotiable_container">
                    <div class="col s3 pr-6 right-align">Negotiable</div>
                    <div class="col s9 pl-6 valign-wrapper">${n.strings.negotiable}</div>
                </div>
                <div class="row my-0 font-size-14 valign-wrapper">
                    <div class="col s3 pr-6 right-align">Contact Information</div>
                    <div class="col s9 pl-6">
                        <div class="row mb-0 mx-0 hide" data-field="public_container">
                            <div class="col s12 p-0 valign-wrapper">
                                The ${f} has set the contact information to be private.
                            </div>
                        </div>
                        <div class="row mb-0 mx-0 hide" data-field="public_container">
                            <div class="col s12 p-0 valign-wrapper">
                                A request to view the contact information has been sent.
                            </div>
                        </div>
                        <div class="row mb-0 mx-0 hide" data-field="public_container">
                            <div class="col s12 p-0 valign-wrapper mb-2">
                                When the ${f} accepts the request, a system message will be sent to you.
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
        `);"buyer"==f&&$('[data-field="negotiable_container"]').addClass("hide");n.public||p.offer[`${f}public`]?(n.email&&($('[data-field="email"]').html(n.email),v("email_container")),n.discord&&($('[data-field="discord_icon"]').attr("src","/static/img/contact/discord.png"),$('[data-field="discord"]').html(n.discord),v("discord_container")),n.instagram&&($('[data-field="instagram_icon"]').attr("src","/static/img/contact/instagram.png"),$('[data-field="instagram"]').html(n.instagram),v("instagram_container")),
n.phone&&($('[data-field="phone"]').html(n.phone),n.whatsapp&&$('[data-field="whatsapp"]').attr("src","/static/img/contact/whatsapp.png"),n.signal&&$('[data-field="signal"]').attr("src","/static/img/contact/signal.png"),n.telegram&&$('[data-field="telegram"]').attr("src","/static/img/contact/telegram.png"),v("phone_container")),n.customContactInfo&&($('[data-field="customContactInfo"]').html(n.customContactInfo),v("customContactInfo_container"))):($('[data-field="public"]').html("Private"),$('[data-field="public_icon"]').html("").attr("data-tooltip",
""),$('[data-field="public_container"]').removeClass("hide"));z();$('[data-button="view_image"]').click(()=>{const l=$("#carousel").empty();r.images.forEach(m=>{l.append(`<a class="carousel-item justify-content-center"><img src="${m}"></a>`)});$("#imagemodal").modal("open")});$('[data-button="my_publicity_toggle"]').click(()=>{fetch(`/api/v1/offer/togglePublicity?offerid=${p.offer.offerid}`,{method:"PUT",mode:"cors",headers:csrfprotect({"Content-Type":"application/json"})}).then(l=>{if(l.ok)return l.json();
throw new NetworkError(l);}).then(l=>{if("success"==l.status)p.offer[`${d}public`]=l.data.public,z();else throw new APIError(l);}).catch(l=>{toastError(l);$('[data-element="controls"]').attr("data-control","empty");k()})});"seller"==d?($('[data-button="complete_offer"]').click(()=>{$('[data-button="complete_offer_confirm"]').attr("data-offerid",p.offer.offerid);$("#completemodal").modal("open")}),$('[data-button="complete_offer_confirm"]').click(l=>{l=$(l.target).attr("data-offerid");fetch(`/api/v1/offer/complete?offerid=${l}`,
{method:"DELETE",mode:"cors",headers:csrfprotect({"Content-Type":"application/json"})}).then(m=>{if(m.ok)return m.json();throw new NetworkError(m);}).then(m=>{if("success"==m.status)$("#completemodal").modal("close"),toast({description:"Successfully completed offer.",headerPrefix:"",code:1}),$('[data-element="controls"]').attr("data-control","empty"),k();else throw new APIError(m);}).catch(m=>{$("#completemodal").modal("close");toastError(m);$('[data-element="controls"]').attr("data-control","empty");
k()})})):$('[data-button="complete_offer"]').addClass("hide");$('[data-button="cancel_offer"]').click(()=>{$('[data-button="cancel_offer_confirm"]').attr("data-offerid",p.offer.offerid);$('[data-field="cancel_offer_role"]').html(f);$("#cancelmodal").modal("open")});$('[data-button="cancel_offer_confirm"]').click(l=>{l=$(l.target).attr("data-offerid");fetch(`/api/v1/offer/cancel?offerid=${l}`,{method:"DELETE",mode:"cors",headers:csrfprotect({"Content-Type":"application/json"})}).then(m=>{if(m.ok)return m.json();
throw new NetworkError(m);}).then(m=>{if("success"==m.status)$("#cancelmodal").modal("close"),toast({description:"Successfully cancelled offer.",headerPrefix:"",code:1}),$('[data-element="controls"]').attr("data-control","empty"),k();else throw new APIError(m);}).catch(m=>{$("#cancelmodal").modal("close");toastError(m);$('[data-element="controls"]').attr("data-control","empty");k()})});$(".tooltipped").tooltip()}function h(){$("[data-button]").off();switch($('[data-element="controls"][data-control]').attr("data-control")){case "message":b();
break;case "seller":e($('[data-element="controls"][data-control]').attr("data-control-offerid"),"seller");break;case "buyer":e($('[data-element="controls"][data-control]').attr("data-control-offerid"),"buyer");break;default:$('[data-element="controls"]').attr("data-control","empty").removeAttr("data-control-offerid").html('<div class="center-align valign-center">\n                    Select an item on the list to view more details!\n                </div>')}}function c(){$('[data-element$="_help"]').removeClass("hide").html("Loading offers...");
$('[data-element="message_help"]').removeClass("hide").html('<i class="material-icons left">mail</i>View messages');$('[data-element$="_progress"]').removeClass("hide");$('[data-element$="_results"]').empty();fetch("/api/v1/offer/detail",{method:"GET",mode:"cors",headers:csrfprotect({"Content-Type":"application/json"})}).then(g=>{if(!g.ok)throw new NetworkError;return g.json()}).then(g=>{if("success"!=g.status)throw new APIError(g);return g.data}).then(g=>$jscomp.asyncExecutePromiseGeneratorFunction(function*(){for(let d in g)"public"!=
d&&(0==g[d].length?($(`[data-element="${d}_help"]`).html("buyer"==d?'There are no pending offers. Go to the <a href="/market">Market</a> to make an offer.':'There are no pending offers. Start by <a href="/sell">selling a book</a> or wait until someone makes an offer.'),$(`[data-element="${d}_progress"]`).addClass("hide")):yield Promise.all(g[d].map(f=>{({listing:f}=f);return fetch(`https://www.googleapis.com/books/v1/volumes/${f.bookid}`,{method:"GET",mode:"cors",headers:{"Content-Type":"application/json"}})})).then(f=>
Promise.all(f.map(t=>{if(!t.ok)throw new NetworkError(t);return t.json()}))).then(f=>Promise.all(f.map(t=>{if("error"in t)throw new NoGoogleBooksResultsError;return t}))).then(f=>{let t="";for(let r=0;r<f.length;r++){let u="";for(const n of g[d][r].offers){var p=new x(n.user);u+=`<div class="row mb-0 mx-0 py-8 unselectable valign-wrapper" data-offerid="${n.offer.offerid}">
                                <div class="col s2 px-4 valign-wrapper justify-content-center">
                                    <div class="profile-picture">
                                        <img class="rounded" src="${p.strings.profilePic}">
                                    </div>
                                </div>
                                <div class="col s10 px-4 font-size-14 valign-wrapper">
                                    <span class="mr-6">${p.name}</span>
                                    ${p.strings.badgeElem}
                                </div>
                            </div>`}p=new Book(f[r]);g[d][r].listing.book=p;t+=`<li data-bookid="0YzTCQAAQBAJ">
                            <div class="collapsible-header p-0 border-none">
                                <div class="row mb-0 mx-0 valign-wrapper py-8 unselectable">
                                    <div class="col s2 px-4 valign-wrapper">
                                        <img class="google-book-image" src="${p.strings.thumbSmall}">
                                    </div>
                                    <div class="col s10 px-4 font-size-14 text-bold">
                                        ${p.strings.title}
                                    </div>
                                </div>
                            </div>
                            <div class="collapsible-body p-0 border-none">${u}</div>
                        </li>`}$(`[data-element="${d}_results"]`).html(`<ul class="collapsible box-shadow-none border-none">${t}</ul>`);$(".collapsible").collapsible({accordion:!1});$(`[data-element="${d}_help"]`).addClass("hide").empty()}).catch(f=>{f instanceof NoGoogleBooksResultsError?$(`[data-element="${d}_help"]`).html("An error occurred in Google's servers. Please try again later."):f instanceof NetworkError?$(`[data-element="${d}_help"]`).html("An error occured when retrieving data. Please check your connection or try again."):
($(`[data-element="${d}_help"]`).html("An unknown error occured."),console.error(f))}).finally(()=>{$(`[data-element="${d}_progress"]`).addClass("hide")}));$(".tooltipped").tooltip();$("[data-offerid]").click(d=>{$("[data-offerid]").removeClass("active");const f=$(d.target).closest('[data-element$="_results"]').attr("data-element").replace("_results","");d=$(d.target).closest("[data-offerid]").addClass("active").attr("data-offerid");$('[data-element="controls"]').attr("data-control",f).attr("data-control-offerid",
d);h()});window.listings=g})).catch(g=>{g instanceof APIError?$('[data-element$="_help"]').html("An error occurred in our server. Please try again later."):g instanceof NetworkError?$('[data-element$="_help"]').html("An error occured when retrieving data. Please check your connection or try again."):console.error(g)}).finally(()=>{const g=dayjs();$('[data-field="updated"]').html(`${g.local().format("DD/MM/YYYY HH:mm:ss")} (<span data-field="updatedRelative" data-val="${g.valueOf()/1E3}">a few seconds ago</span>)`);
$("[data-refresh]").removeClass("rotating")})}function k(){$("[data-refresh]").addClass("rotating");"empty"==$('[data-element="controls"]').attr("data-control")?(h(),c()):(c(),h())}$("#imagemodal").modal({onOpenEnd:()=>{$("#carousel").carousel({indicators:!0})}});$("#cancelmodal").modal();$("#completemodal").modal();$(window).resize(a);a();var q=null;const v=g=>$(`[data-field="${g}"]`).removeClass("hide");String.prototype.capitalise=function(){return this.charAt(0).toUpperCase()+this.slice(1)};class x{constructor(g){for(const d in g)this[d]=
g[d];this.strings={};this.strings.profilePic=`${g.profilePic}=s96-c`;this.strings.badgeElem=this.cky?'<i class="font-size-14 material-icons unselectable tooltipped verified" data-position="right" data-tooltip="This user is a verified CKY student.">verified</i>':'<i class="font-size-14 material-icons unselectable tooltipped not-verified" data-position="right" data-tooltip="This user may not be a CKY student.">warning</i>';this.strings.negotiable=this.negotiable?'Yes<i class="font-size-20 material-icons unselectable negotiable ml-4">check</i>':
'No<i class="font-size-20 material-icons unselectable not-negotiable ml-4">close</i>';this.strings.payment=[["cash","Cash"],["octopus","Octopus"],["payme","PayMe"],["tapngo","Tap & Go"],["bankTransfer","Bank Transfer"],["eCheque","e-Cheque"],["alipay","Alipay"],["wechatPay","WeChat Pay"]].map(d=>this[d[0]]?`<img class="payment-icon mr-4 tooltipped" src="/static/img/payment/${d[0]}.png" data-position="top" data-tooltip="${d[1]}">`:"").join("")||"Unset";this.strings.deliveryMethod=[["inSchoolExchange",
"In-school exchange"],["meetup","Meetup"],["delivery","Door-to-door delivery"]].map(d=>this[d[0]]?`<div class="chip mb-0 unselectable">${d[1]}</div>`:"").join("")||"Unset"}}class y{constructor(g){for(const d in g)this[d]=g[d];this.strings={};switch(this.messagetype){case "listing_disabled":this.strings.display=`<span class="text-bold">${this.originusername}</span>'s <span class="text-bold">${this.item}</span> has been temporarily disabled. A notification will be sent when it is re-enabled.`;this.strings.notification=
`${this.originusername}'s ${this.item} has been temporarily disabled. A notification will be sent when it is re-enabled.`;break;case "listing_enabled":this.strings.display=`<span class="text-bold">${this.originusername}</span>'s <span class="text-bold">${this.item}</span> has been re-enabled.`;this.strings.notification=`${this.originusername}'s ${this.item} has been re-enabled.`;break;case "listing_deleted":this.strings.display=`<span class="text-bold">${this.originusername}</span>'s <span class="text-bold">${this.item}</span> is no longer avaliable because it has been deleted. The offer has been automatically cancelled.`;
this.strings.notification=`${this.originusername}'s ${this.item} is no longer avaliable because it has been deleted. The offer has been automatically cancelled.`;break;case "offer_created":this.strings.display=`<span class="text-bold">${this.originusername}</span> has created an offer on your listing: <span class="text-bold">${this.item}</span>.`;this.strings.notification=`${this.originusername} has created an offer on your listing: ${this.item}.`;break;case "offer_cancelled":this.strings.display=
`<span class="text-bold">${this.originusername}</span> has cancelled the offer on the listing <span class="text-bold">${this.item}</span>.`;this.strings.notification=`${this.originusername} has cancelled the offer on the listing ${this.item}.`;break;case "offer_contact_granted":this.strings.display=`<span class="text-bold">${this.originusername}</span> has granted you access to their contact information on the listing <span class="text-bold">${this.item}</span>.`;this.strings.notification=`${this.originusername} has granted you access to their contact information on the listing ${this.item}.`;
break;case "offer_contact_request":this.strings.display=`<span class="text-bold">${this.originusername}</span> has requested to view your contact information on the listing <span class="text-bold">${this.item}</span>.`;this.strings.notification=`${this.originusername} has requested to view your contact information on the listing ${this.item}.`;break;case "listing_completed":this.strings.display=`<span class="text-bold">${this.originusername}</span>'s <span class="text-bold">${this.item}</span> is no longer avaliable because it has been sold out.`;
this.strings.notification=`${this.originusername}'s ${this.item} is no longer avaliable because it has been sold out.`;break;default:this.strings.display=this.system,this.strings.notification=this.system}}}var w="granted"==Notification.permission;k();$("[data-refresh]").click(k);$('[data-element="message_help"]').click(()=>{$('[data-element="controls"]').attr("data-control","message");k()});setInterval(()=>{$('[data-field="updatedRelative"][data-val]').each(function(){$(this).html(dayjs.unix($(this).attr("data-val")).local().fromNow())})},
1E3);setInterval(k,6E4)});
