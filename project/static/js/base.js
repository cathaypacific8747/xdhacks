var csrftoken = $('meta[name=csrf-token]').attr('content');
window.csrfprotect = options => {
    options['X-CSRFToken'] = csrftoken;
    return options;
};

$(document).ready(function() {
    $('.dropdown-trigger').dropdown({
        alignment: 'right',
        constrainWidth: false,
        coverTrigger: false,
    });

    $('.tooltipped').tooltip();
    M.updateTextFields(); // fix prefilled text overlapping bug

    dayjs.extend(window.dayjs_plugin_utc);
    dayjs.extend(window.dayjs_plugin_relativeTime);

    window.Book = class {
        constructor(data) {
            this.googleId = data?.id;
            this.title = data?.volumeInfo?.title;
            this.isbn = data?.volumeInfo?.industryIdentifiers?.find(e => e.type == 'ISBN_13')?.identifier;
            this.authors = data?.volumeInfo?.authors;
            this.language = data?.volumeInfo?.language;
            this.publisher = data?.volumeInfo?.publisher;
            this.publishedDate = data?.volumeInfo?.publishedDate;
            // this.description = data?.volumeInfo?.description;
            this.pageCount = data?.volumeInfo?.pageCount;
            this.height = data?.volumeInfo?.dimensions?.height;
            this.width = data?.volumeInfo?.dimensions?.width;
            this.thickness = data?.volumeInfo?.dimensions?.thickness;
            this.imagelinks = data?.volumeInfo?.imageLinks;
            // this.retailPrice = data?.saleInfo?.listPrice?.amount;
            // this.retailPriceCurrency = data?.saleInfo?.listPrice?.currencyCode;
            this.thumbSmall = this.imagelinks?.smallThumbnail?.replace('http', 'https');
            this.thumbLarge = this.imagelinks?.extraLarge ? this.imagelinks.extraLarge : this.imagelinks?.large ? this.imagelinks.large : this.imagelinks?.medium ? this.imagelinks.medium : this.imagelinks?.small ? this.imagelinks.small : this.imagelinks?.thumbnail ? this.imagelinks.thumbnail : this.imagelinks?.smallThumbnail;
            this.thumbLarge = this.thumbLarge?.replace('http', 'https');

            this.strings = {};
            this.strings.title = this.title || 'Unknown';
            this.strings.isbn = this.isbn || 'Unknown';
            this.strings.authors = this.authors ? this.authors.join(this.language && this.language.includes('en') ? ', ' : '、') : 'Unknown';
            this.strings.plurality = this.authors ? this.authors.length > 1 ? 's' : '' : '';
            this.strings.publisher = this.publisher || 'Unknown';
            this.strings.publishedDate = this.publishedDate || 'Unknown';
            // this.strings.description = this.description || 'N/A';
            this.strings.pageCount = this.pageCount || 'Unknown';
            this.strings.dimensions = (this.height && this.width && this.thickness) ? `Height - ${this.height}, Width - ${this.width}, Thickness - ${this.thickness}` : 'Unknown';
            this.strings.thumbSmall = this.thumbSmall ? this.thumbSmall : this.thumbLarge ? this.thumbLarge : 'https://books.google.com.hk/googlebooks/images/no_cover_thumb.gif';
            // this.strings.retailPrice = this.retailPrice && this.retailPriceCurrency ? `${this.retailPriceCurrency} ${this.retailPrice}` : 'No information'
        }
    };

    window.Listing = class {
        constructor(data) {
            for (const key in data) {
                this[key] = data[key];
            }
            
            this.strings = {};

            let createdD = dayjs(this.created*1000).local();
            this.strings.created = `${createdD.format('DD/MM/YYYY HH:mm:ss')} (${createdD.fromNow()})`;
            this.strings.open = this.open ? 'Public' : 'Hidden';
            this.strings.openIcon = this.open ? 'visibility' : 'visibility_off';
            switch (this.condition) {
            case 0:
                this.strings.condition = 'Poor';
                this.strings.conditionDescription = 'Significant wear, possibly with a broken spine, loose joints or missing pages';
                this.strings.conditionClass = 'condition-poor';
                break;
            case 1:
                this.strings.condition = 'Fair';
                this.strings.conditionDescription = 'Some wear, possibly with folded pages, scratches or dents';
                this.strings.conditionClass = 'condition-fair';
                break;
            case 2:
                this.strings.condition = 'Good';
                this.strings.conditionDescription = 'Minor wear, but will still show signs of previous ownership';
                this.strings.conditionClass = 'condition-good';
                break;
            case 3:
                this.strings.condition = 'Fine';
                this.strings.conditionDescription = 'Very minor defects and faults, like brand new';
                this.strings.conditionClass = 'condition-fine';
                break;
            }
            switch (this.notes) {
            case 0:
                this.strings.notes = 'None';
                break;
            case 1:
                this.strings.notes = 'Some';
                break;
            case 2:
                this.strings.notes = 'Comprehensive';
                break;
            }
            this.strings.price = `HKD ${this.price}`;
            this.strings.remarks = this.remarks || '---';
        }
    };

    class ControlledError extends Error {
        constructor(response) {
            super(response);
        }
    }

    class NetworkError extends Error {
        constructor(response) {
            super(response);
            this.message = `${response.status}: ${response.statusText}`;
        }
    }

    class APIError extends Error {
        constructor(json) {
            super(json);
            this.message = `${json.code}: ${json.message}`;
        }
    }

    class NoGoogleBooksResultsError extends Error {
        constructor() {
            super();
            this.message = 'No results found.';
        }
    }

    window.NetworkError = NetworkError;
    window.APIError = APIError;
    window.NoGoogleBooksResultsError = NoGoogleBooksResultsError;
    window.ControlledError = ControlledError;

    window.toast = function(obj) {
        const description = obj.description || 'An unknown error occurred';
        const headerPrefix = `${obj.headerPrefix} ` || '';
        const code = obj.code || 3;

        let header, toastClass;
        switch (code) {
        case 3:
            header = `${headerPrefix}Error`;
            toastClass = 'toastError';
            break;
        case 2:
            header = `${headerPrefix}Warning`;
            toastClass = 'toastWarning';
            break;
        case 1:
            header = `${headerPrefix}Success`;
            toastClass = 'toastSuccess';
            break;
        case 0:
            header = `${headerPrefix}Information`;
            toastClass = 'toastInformation';
            break;
        }
        M.toast({
            unsafeHTML: `<div>
                <div class="font-size-16 text-bold mb-2">
                    ${header}
                </div>
                <div class="font-size-14 line-height-24">
                    ${description}
                </div>
            </div>`,
            classes: `toastGeneral ${toastClass} roundBox`,
        });
    };

    window.toastError = function(e) {
        if (e instanceof NetworkError) {
            toast({
                description: e.message,
                headerPrefix: 'Network',
                code: 3
            });
        } else if (e instanceof APIError) {
            toast({
                description: e.message,
                headerPrefix: 'Server',
                code: 3
            });
        }
        console.error(e);
    };

    window.removeShimmer = function(e) {
        $(e).removeClass('shimmerBG');
    };

    window.removeMinPicHeight = function(e) {
        $(e).removeClass('minPicHeight');
    };

    if ($(window).width() < 448) {
        toast({
            description: 'Elements may appear glitched on mobile. Please use a computer, or try rotating your device into the horizontal orientation. View <a href="/help#master">help</a> for more details.',
            headerPrefix: 'Incompatibility',
            code: 2
        });
    }
});