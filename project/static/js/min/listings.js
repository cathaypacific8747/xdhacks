'use strict';var $jscomp=$jscomp||{};$jscomp.scope={};$jscomp.ASSUME_ES5=!1;$jscomp.ASSUME_NO_NATIVE_MAP=!1;$jscomp.ASSUME_NO_NATIVE_SET=!1;$jscomp.SIMPLE_FROUND_POLYFILL=!1;$jscomp.ISOLATE_POLYFILLS=!1;$jscomp.FORCE_POLYFILL_PROMISE=!1;$jscomp.FORCE_POLYFILL_PROMISE_WHEN_NO_UNHANDLED_REJECTION=!1;$jscomp.defineProperty=$jscomp.ASSUME_ES5||"function"==typeof Object.defineProperties?Object.defineProperty:function(a,b,d){if(a==Array.prototype||a==Object.prototype)return a;a[b]=d.value;return a};
$jscomp.getGlobal=function(a){a=["object"==typeof globalThis&&globalThis,a,"object"==typeof window&&window,"object"==typeof self&&self,"object"==typeof global&&global];for(var b=0;b<a.length;++b){var d=a[b];if(d&&d.Math==Math)return d}throw Error("Cannot find global object");};$jscomp.global=$jscomp.getGlobal(this);$jscomp.IS_SYMBOL_NATIVE="function"===typeof Symbol&&"symbol"===typeof Symbol("x");$jscomp.TRUST_ES6_POLYFILLS=!$jscomp.ISOLATE_POLYFILLS||$jscomp.IS_SYMBOL_NATIVE;$jscomp.polyfills={};
$jscomp.propertyToPolyfillSymbol={};$jscomp.POLYFILL_PREFIX="$jscp$";var $jscomp$lookupPolyfilledValue=function(a,b){var d=$jscomp.propertyToPolyfillSymbol[b];if(null==d)return a[b];d=a[d];return void 0!==d?d:a[b]};$jscomp.polyfill=function(a,b,d,f){b&&($jscomp.ISOLATE_POLYFILLS?$jscomp.polyfillIsolated(a,b,d,f):$jscomp.polyfillUnisolated(a,b,d,f))};
$jscomp.polyfillUnisolated=function(a,b,d,f){d=$jscomp.global;a=a.split(".");for(f=0;f<a.length-1;f++){var c=a[f];if(!(c in d))return;d=d[c]}a=a[a.length-1];f=d[a];b=b(f);b!=f&&null!=b&&$jscomp.defineProperty(d,a,{configurable:!0,writable:!0,value:b})};
$jscomp.polyfillIsolated=function(a,b,d,f){var c=a.split(".");a=1===c.length;f=c[0];f=!a&&f in $jscomp.polyfills?$jscomp.polyfills:$jscomp.global;for(var e=0;e<c.length-1;e++){var g=c[e];if(!(g in f))return;f=f[g]}c=c[c.length-1];d=$jscomp.IS_SYMBOL_NATIVE&&"es6"===d?f[c]:null;b=b(d);null!=b&&(a?$jscomp.defineProperty($jscomp.polyfills,c,{configurable:!0,writable:!0,value:b}):b!==d&&(void 0===$jscomp.propertyToPolyfillSymbol[c]&&(d=1E9*Math.random()>>>0,$jscomp.propertyToPolyfillSymbol[c]=$jscomp.IS_SYMBOL_NATIVE?
$jscomp.global.Symbol(c):$jscomp.POLYFILL_PREFIX+d+"$"+c),$jscomp.defineProperty(f,$jscomp.propertyToPolyfillSymbol[c],{configurable:!0,writable:!0,value:b})))};$jscomp.underscoreProtoCanBeSet=function(){var a={a:!0},b={};try{return b.__proto__=a,b.a}catch(d){}return!1};
$jscomp.setPrototypeOf=$jscomp.TRUST_ES6_POLYFILLS&&"function"==typeof Object.setPrototypeOf?Object.setPrototypeOf:$jscomp.underscoreProtoCanBeSet()?function(a,b){a.__proto__=b;if(a.__proto__!==b)throw new TypeError(a+" is not extensible");return a}:null;$jscomp.arrayIteratorImpl=function(a){var b=0;return function(){return b<a.length?{done:!1,value:a[b++]}:{done:!0}}};$jscomp.arrayIterator=function(a){return{next:$jscomp.arrayIteratorImpl(a)}};
$jscomp.makeIterator=function(a){var b="undefined"!=typeof Symbol&&Symbol.iterator&&a[Symbol.iterator];return b?b.call(a):$jscomp.arrayIterator(a)};$jscomp.generator={};$jscomp.generator.ensureIteratorResultIsObject_=function(a){if(!(a instanceof Object))throw new TypeError("Iterator result "+a+" is not an object");};
$jscomp.generator.Context=function(){this.isRunning_=!1;this.yieldAllIterator_=null;this.yieldResult=void 0;this.nextAddress=1;this.finallyAddress_=this.catchAddress_=0;this.finallyContexts_=this.abruptCompletion_=null};$jscomp.generator.Context.prototype.start_=function(){if(this.isRunning_)throw new TypeError("Generator is already running");this.isRunning_=!0};$jscomp.generator.Context.prototype.stop_=function(){this.isRunning_=!1};
$jscomp.generator.Context.prototype.jumpToErrorHandler_=function(){this.nextAddress=this.catchAddress_||this.finallyAddress_};$jscomp.generator.Context.prototype.next_=function(a){this.yieldResult=a};$jscomp.generator.Context.prototype.throw_=function(a){this.abruptCompletion_={exception:a,isException:!0};this.jumpToErrorHandler_()};$jscomp.generator.Context.prototype.return=function(a){this.abruptCompletion_={return:a};this.nextAddress=this.finallyAddress_};
$jscomp.generator.Context.prototype.jumpThroughFinallyBlocks=function(a){this.abruptCompletion_={jumpTo:a};this.nextAddress=this.finallyAddress_};$jscomp.generator.Context.prototype.yield=function(a,b){this.nextAddress=b;return{value:a}};$jscomp.generator.Context.prototype.yieldAll=function(a,b){a=$jscomp.makeIterator(a);var d=a.next();$jscomp.generator.ensureIteratorResultIsObject_(d);if(d.done)this.yieldResult=d.value,this.nextAddress=b;else return this.yieldAllIterator_=a,this.yield(d.value,b)};
$jscomp.generator.Context.prototype.jumpTo=function(a){this.nextAddress=a};$jscomp.generator.Context.prototype.jumpToEnd=function(){this.nextAddress=0};$jscomp.generator.Context.prototype.setCatchFinallyBlocks=function(a,b){this.catchAddress_=a;void 0!=b&&(this.finallyAddress_=b)};$jscomp.generator.Context.prototype.setFinallyBlock=function(a){this.catchAddress_=0;this.finallyAddress_=a||0};$jscomp.generator.Context.prototype.leaveTryBlock=function(a,b){this.nextAddress=a;this.catchAddress_=b||0};
$jscomp.generator.Context.prototype.enterCatchBlock=function(a){this.catchAddress_=a||0;a=this.abruptCompletion_.exception;this.abruptCompletion_=null;return a};$jscomp.generator.Context.prototype.enterFinallyBlock=function(a,b,d){d?this.finallyContexts_[d]=this.abruptCompletion_:this.finallyContexts_=[this.abruptCompletion_];this.catchAddress_=a||0;this.finallyAddress_=b||0};
$jscomp.generator.Context.prototype.leaveFinallyBlock=function(a,b){b=this.finallyContexts_.splice(b||0)[0];if(b=this.abruptCompletion_=this.abruptCompletion_||b){if(b.isException)return this.jumpToErrorHandler_();void 0!=b.jumpTo&&this.finallyAddress_<b.jumpTo?(this.nextAddress=b.jumpTo,this.abruptCompletion_=null):this.nextAddress=this.finallyAddress_}else this.nextAddress=a};$jscomp.generator.Context.prototype.forIn=function(a){return new $jscomp.generator.Context.PropertyIterator(a)};
$jscomp.generator.Context.PropertyIterator=function(a){this.object_=a;this.properties_=[];for(var b in a)this.properties_.push(b);this.properties_.reverse()};$jscomp.generator.Context.PropertyIterator.prototype.getNext=function(){for(;0<this.properties_.length;){var a=this.properties_.pop();if(a in this.object_)return a}return null};$jscomp.generator.Engine_=function(a){this.context_=new $jscomp.generator.Context;this.program_=a};
$jscomp.generator.Engine_.prototype.next_=function(a){this.context_.start_();if(this.context_.yieldAllIterator_)return this.yieldAllStep_(this.context_.yieldAllIterator_.next,a,this.context_.next_);this.context_.next_(a);return this.nextStep_()};
$jscomp.generator.Engine_.prototype.return_=function(a){this.context_.start_();var b=this.context_.yieldAllIterator_;if(b)return this.yieldAllStep_("return"in b?b["return"]:function(d){return{value:d,done:!0}},a,this.context_.return);this.context_.return(a);return this.nextStep_()};
$jscomp.generator.Engine_.prototype.throw_=function(a){this.context_.start_();if(this.context_.yieldAllIterator_)return this.yieldAllStep_(this.context_.yieldAllIterator_["throw"],a,this.context_.next_);this.context_.throw_(a);return this.nextStep_()};
$jscomp.generator.Engine_.prototype.yieldAllStep_=function(a,b,d){try{var f=a.call(this.context_.yieldAllIterator_,b);$jscomp.generator.ensureIteratorResultIsObject_(f);if(!f.done)return this.context_.stop_(),f;var c=f.value}catch(e){return this.context_.yieldAllIterator_=null,this.context_.throw_(e),this.nextStep_()}this.context_.yieldAllIterator_=null;d.call(this.context_,c);return this.nextStep_()};
$jscomp.generator.Engine_.prototype.nextStep_=function(){for(;this.context_.nextAddress;)try{var a=this.program_(this.context_);if(a)return this.context_.stop_(),{value:a.value,done:!1}}catch(b){this.context_.yieldResult=void 0,this.context_.throw_(b)}this.context_.stop_();if(this.context_.abruptCompletion_){a=this.context_.abruptCompletion_;this.context_.abruptCompletion_=null;if(a.isException)throw a.exception;return{value:a.return,done:!0}}return{value:void 0,done:!0}};
$jscomp.generator.Generator_=function(a){this.next=function(b){return a.next_(b)};this.throw=function(b){return a.throw_(b)};this.return=function(b){return a.return_(b)};this[Symbol.iterator]=function(){return this}};$jscomp.generator.createGenerator=function(a,b){b=new $jscomp.generator.Generator_(new $jscomp.generator.Engine_(b));$jscomp.setPrototypeOf&&a.prototype&&$jscomp.setPrototypeOf(b,a.prototype);return b};
$jscomp.asyncExecutePromiseGenerator=function(a){function b(f){return a.next(f)}function d(f){return a.throw(f)}return new Promise(function(f,c){function e(g){g.done?f(g.value):Promise.resolve(g.value).then(b,d).then(e,c)}e(a.next())})};$jscomp.asyncExecutePromiseGeneratorFunction=function(a){return $jscomp.asyncExecutePromiseGenerator(a())};$jscomp.asyncExecutePromiseGeneratorProgram=function(a){return $jscomp.asyncExecutePromiseGenerator(new $jscomp.generator.Generator_(new $jscomp.generator.Engine_(a)))};
var csrftoken=$("meta[name=csrf-token]").attr("content");window.csrfprotect=a=>{a["X-CSRFToken"]=csrftoken;return a};
$(document).ready(function(){$(".dropdown-trigger").dropdown({alignment:"right",constrainWidth:!1,coverTrigger:!1});$(".tooltipped").tooltip();M.updateTextFields();dayjs.extend(window.dayjs_plugin_utc);dayjs.extend(window.dayjs_plugin_relativeTime);window.Book=class{constructor(c){this.googleId=null==c?void 0:c.id;let e;this.title=null==c?void 0:null==(e=c.volumeInfo)?void 0:e.title;let g,h,k;this.isbn=null==c?void 0:null==(g=c.volumeInfo)?void 0:null==(h=g.industryIdentifiers)?void 0:null==(k=h.find(I=>
"ISBN_13"==I.type))?void 0:k.identifier;let l;this.authors=null==c?void 0:null==(l=c.volumeInfo)?void 0:l.authors;let m;this.language=null==c?void 0:null==(m=c.volumeInfo)?void 0:m.language;let n;this.publisher=null==c?void 0:null==(n=c.volumeInfo)?void 0:n.publisher;let p;this.publishedDate=null==c?void 0:null==(p=c.volumeInfo)?void 0:p.publishedDate;let q;this.pageCount=null==c?void 0:null==(q=c.volumeInfo)?void 0:q.pageCount;let r,t;this.height=null==c?void 0:null==(r=c.volumeInfo)?void 0:null==
(t=r.dimensions)?void 0:t.height;let u,v;this.width=null==c?void 0:null==(u=c.volumeInfo)?void 0:null==(v=u.dimensions)?void 0:v.width;let w,x;this.thickness=null==c?void 0:null==(w=c.volumeInfo)?void 0:null==(x=w.dimensions)?void 0:x.thickness;let y;this.imagelinks=null==c?void 0:null==(y=c.volumeInfo)?void 0:y.imageLinks;let z,A;this.thumbSmall=null==(z=this.imagelinks)?void 0:null==(A=z.smallThumbnail)?void 0:A.replace("http","https");let B,C,D,E,F,G;this.thumbLarge=(null==(B=this.imagelinks)?
0:B.extraLarge)?this.imagelinks.extraLarge:(null==(C=this.imagelinks)?0:C.large)?this.imagelinks.large:(null==(D=this.imagelinks)?0:D.medium)?this.imagelinks.medium:(null==(E=this.imagelinks)?0:E.small)?this.imagelinks.small:(null==(F=this.imagelinks)?0:F.thumbnail)?this.imagelinks.thumbnail:null==(G=this.imagelinks)?void 0:G.smallThumbnail;let H;this.thumbLarge=null==(H=this.thumbLarge)?void 0:H.replace("http","https");this.strings={};this.strings.title=this.title||"Unknown";this.strings.isbn=this.isbn||
"Unknown";this.strings.authors=this.authors?this.authors.join(this.language&&this.language.includes("en")?", ":"、"):"Unknown";this.strings.plurality=this.authors?1<this.authors.length?"s":"":"";this.strings.publisher=this.publisher||"Unknown";this.strings.publishedDate=this.publishedDate||"Unknown";this.strings.pageCount=this.pageCount||"Unknown";this.strings.dimensions=this.height&&this.width&&this.thickness?`Height - ${this.height}, Width - ${this.width}, Thickness - ${this.thickness}`:"Unknown";
this.strings.thumbSmall=this.thumbSmall?this.thumbSmall:this.thumbLarge?this.thumbLarge:"https://books.google.com.hk/googlebooks/images/no_cover_thumb.gif"}};window.Listing=class{constructor(c){for(const e in c)this[e]=c[e];this.strings={};c=dayjs(1E3*this.created).local();this.strings.created=`${c.format("DD/MM/YYYY HH:mm:ss")} (${c.fromNow()})`;this.strings.open=this.open?"Public":"Hidden";this.strings.openIcon=this.open?"visibility":"visibility_off";switch(this.condition){case 0:this.strings.condition=
"Poor";this.strings.conditionDescription="Significant wear, possibly with a broken spine, loose joints or missing pages";this.strings.conditionClass="condition-poor";break;case 1:this.strings.condition="Fair";this.strings.conditionDescription="Some wear, possibly with folded pages, scratches or dents";this.strings.conditionClass="condition-fair";break;case 2:this.strings.condition="Good";this.strings.conditionDescription="Minor wear, but will still show signs of previous ownership";this.strings.conditionClass=
"condition-good";break;case 3:this.strings.condition="Fine",this.strings.conditionDescription="Very minor defects and faults, like brand new",this.strings.conditionClass="condition-fine"}switch(this.notes){case 0:this.strings.notes="None";break;case 1:this.strings.notes="Some";break;case 2:this.strings.notes="Comprehensive"}this.strings.price=`HKD ${this.price}`;this.strings.remarks=this.remarks||"---"}};class a extends Error{constructor(c){super(c)}}class b extends Error{constructor(c){super(c);
this.message=`${c.status}: ${c.statusText}`}}class d extends Error{constructor(c){super(c);this.message=`${c.code}: ${c.message}`}}class f extends Error{constructor(){super();this.message="No results found."}}window.NetworkError=b;window.APIError=d;window.NoGoogleBooksResultsError=f;window.ControlledError=a;window.toast=function(c){const e=c.description||"An unknown error occurred",g=`${c.headerPrefix} `||"";let h,k;switch(c.code||3){case 3:h=`${g}Error`;k="toastError";break;case 2:h=`${g}Warning`;
k="toastWarning";break;case 1:h=`${g}Success`;k="toastSuccess";break;case 0:h=`${g}Information`,k="toastInformation"}M.toast({unsafeHTML:`<div>
                <div class="font-size-16 text-bold mb-2">
                    ${h}
                </div>
                <div class="font-size-14 line-height-24">
                    ${e}
                </div>
            </div>`,classes:`toastGeneral ${k} roundBox`})};window.toastError=function(c){c instanceof b?toast({description:c.message,headerPrefix:"Network",code:3}):c instanceof d&&toast({description:c.message,headerPrefix:"Server",code:3});console.error(c)};window.removeShimmer=function(c){$(c).removeClass("shimmerBG")};window.removeMinPicHeight=function(c){$(c).removeClass("minPicHeight")};448>$(window).width()&&toast({description:'Elements may appear glitched on mobile. Please use a computer, or try rotating your device into the horizontal orientation. View <a href="/help#master">help</a> for more details.',
headerPrefix:"Incompatibility",code:2})});
$(document).ready(function(){$("#imagemodal").modal({onOpenEnd:()=>{$("#carousel").carousel({indicators:!0})}});$("#deletemodal").modal();$('[data-element="help"]').removeClass("hide").html("Loading your listings...");$('[data-element="progress"]').removeClass("hide");fetch("/api/v1/listing/detail",{method:"GET",mode:"cors",headers:csrfprotect({"Content-Type":"application/json"})}).then(a=>{if(!a.ok)throw new NetworkError;return a.json()}).then(a=>{if("success"!=a.status)throw new APIError(a);if(0==
a.data.length)throw $('[data-element="help"]').html("You do not have any listings, start by creating one!"),new ControlledError;return a.data}).then(a=>$jscomp.asyncExecutePromiseGeneratorFunction(function*(){return Promise.all(a.map(b=>{({bookid:b}=b);return fetch(`https://www.googleapis.com/books/v1/volumes/${b}`,{method:"GET",mode:"cors",headers:{"Content-Type":"application/json"}})})).then(b=>Promise.all(b.map(d=>{if(!d.ok)throw new NetworkError(d);return d.json()}))).then(b=>Promise.all(b.map(d=>
{if("error"in d)throw new NoGoogleBooksResultsError;return d}))).then(b=>{let d=$('[data-element="listings_results"]');for(let c=0;c<b.length;c++){var f=new Book(b[c]);let e=new Listing(a[c]);f=$(`<div class="row mx-0 mb-8 p-8 roundBox book" data-listingid="${e.listingid}">
                    <div class="col s2 mx-0 p-0 minPicHeight shimmerBG">
                        <img class="google-book-image roundBox" src="${f.strings.thumbSmall}" onload="removeShimmer(this.parentElement);removeMinPicHeight(this.parentElement)" data-field="thumb">
                    </div>
                    <div class="col s10">
                        <div class="row mt-0 mb-2">
                            <div class="col font-size-24 text-bold">${f.strings.title}</div>
                        </div>
                        <div class="row mt-0 mb-2">
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
                                <div class="row my-0">
                                    <div class="col s12 word-wrap font-size-14 right-align text-muted">Created</div>
                                </div>
                                <div class="row my-0">
                                    <div class="col s12 word-wrap font-size-16 right-align">${e.strings.created}</div>
                                </div>
                                <div class="row my-0">
                                    <div class="col s12 word-wrap font-size-14 right-align text-muted">Visibility</div>
                                </div>
                                <div class="row my-0">
                                    <div class="col s12 word-wrap font-size-16 justify-content-end valign-wrapper">
                                        <i class="material-icons left mr-8 font-size-14" data-field="openIcon">${e.strings.openIcon}</i>
                                        <span data-field="open">${e.strings.open}</span>
                                    </div>
                                </div>
                                <div class="row my-0 justify-content-end flex-wrap">
                                    <div class="col">
                                        <div class="row my-0">
                                            <div class="col s12 word-wrap font-size-14 right-align text-muted">Condition</div>
                                        </div>
                                        <div class="row my-0">
                                            <div class="col s12 word-wrap font-size-16 right-align">
                                                <span class="${e.strings.conditionClass} tooltipped" data-position="right" data-tooltip="${e.strings.conditionDescription}">
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
                                <a class="btn px-8 roundBox btn-transparent btn-transparent-primary" data-button="view_image">
                                    <i class="material-icons left">open_in_new</i>
                                    View Images
                                </a>
                                <a class="btn px-8 roundBox btn-transparent btn-transparent-primary" data-button="toggle_visibility">
                                    <i class="material-icons left" data-field="openIcon">${e.strings.openIcon}</i>
                                    Toggle Visibility
                                </a>
                                <a class="btn px-8 roundBox btn-transparent btn-transparent-danger" data-button="delete">
                                    <i class="material-icons left">delete_forever</i>
                                    Delete Listing
                                </a>
                            </div>
                        </div>
                    </div>
                </div>`);d.append(f)}$('[data-element="help"]').addClass("hide").empty();$('[data-button="view_image"]').click(c=>{const e=$("#carousel").empty(),g=$(c.target).closest("[data-listingid]").attr("data-listingid");a.find(h=>h.listingid==g).images.forEach(h=>{e.append(`<a class="carousel-item justify-content-center"><img src="${h}"></a>`)});$("#imagemodal").modal("open")});$('[data-button="toggle_visibility"]').click(c=>{const e=$(c.target).closest("[data-listingid]");c=e.attr("data-listingid");
fetch(`/api/v1/listing/toggleOpen?listingId=${c}`,{method:"PUT",mode:"cors",headers:csrfprotect({"Content-Type":"application/json"})}).then(g=>{if(g.ok)return g.json();throw new NetworkError(g);}).then(g=>{if("success"==g.status)e.find('[data-field="openIcon"]').html(g.data.open?"visibility":"visibility_off"),e.find('[data-field="open"]').html(g.data.open?"Public":"Hidden");else throw new APIError(g);}).catch(g=>{toastError(g)})});$('[data-button="delete"]').click(c=>{c=$(c.target).closest("[data-listingid]").attr("data-listingid");
$('[data-button="delete_confirm"]').attr("data-listingid",c);$("#deletemodal").modal("open")});$('[data-button="delete_confirm"]').click(c=>{c=$(c.target).attr("data-listingid");fetch(`/api/v1/listing/delete?listingid=${c}`,{method:"DELETE",mode:"cors",headers:csrfprotect({"Content-Type":"application/json"})}).then(e=>{if(!e.ok)throw new NetworkError(e);return e.json()}).then(e=>{if("success"==e.status)$("#completemodal").modal("close"),window.location.reload();else throw new APIError(e);}).catch(e=>
{toastError(e)})})}).catch(b=>{throw b;})})).catch(a=>{a instanceof NoGoogleBooksResultsError?$('[data-element="help"]').html("An error occurred in Google's servers. Please try again later."):a instanceof APIError?$('[data-element="help"]').html("An error occurred in our server. Please try again later."):a instanceof NetworkError?$('[data-element="help"]').html("An error occured when retrieving data. Please check your connection or try again."):a instanceof ControlledError||console.error(a)}).finally(()=>
{$('[data-element="progress"]').addClass("hide")})});
