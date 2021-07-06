var csrftoken = $('meta[name=csrf-token]').attr('content');
$.ajaxSetup({
    headers: {
        'X-CSRFToken': csrftoken
    }
})

// $.ajaxSetup({
//     beforeSend: function(xhr, settings) {
//         if (!/^(GET|HEAD|OPTIONS|TRACE)$/i.test(settings.type)) {
//             xhrf.xhr.setRequestHeader("X-CSRFToken", csrftoken)
//         }
//     }
// })

$(document).ready(function() {
    $('.dropdown-trigger').dropdown({
        alignment: 'right',
        constrainWidth: false,
        coverTrigger: false,
    })

    $('.tooltipped').tooltip();
    $('.material-tooltip').css({
        "border-radius": ".5rem",
        "background-color": "#00000088"
    })

    window.toast = function(description='An unknown error occured', headerPrefix='', code=3) {
        headerPrefix = headerPrefix ? `${headerPrefix} `: '';
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
                <div class="font-size-16 text-bold">
                    ${header}
                </div>
                <div class="font-size-14">
                    ${description}
                </div>
            </div>`,
            classes: `toastGeneral ${toastClass} roundBox`,
        })
    }

    class NetworkError extends Error {
        constructor(response) {
            super(response);
            this.message = `${response.status}: ${response.statusText}`
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
            this.message = `No results found.`
        }
    }

    class Book {
        constructor(data) {
            this.googleId = data?.id;
            this.title = data?.volumeInfo?.title;
            this.isbn = data?.volumeInfo?.industryIdentifiers?.find(e => e.type == "ISBN_13")?.identifier;
            this.authors = data?.volumeInfo?.authors;
            this.language = data?.volumeInfo?.language;
            this.publisher = data?.volumeInfo?.publisher;
            // this.description = data?.volumeInfo?.description;
            this.imagelinks = data?.volumeInfo?.imageLinks;
            this.retailPrice = data?.volumeInfo?.saleInfo?.listPrice?.amount;
            this.retailPriceCurrency = data?.volumeInfo?.saleInfo?.listPrice?.currencyCode;
            this.thumbSmall = this.imagelinks?.smallThumbnail;
            this.thumbLarge = this.imagelinks?.extraLarge ? this.imagelinks.extraLarge : this.imagelinks?.large ? this.imagelinks.large : this.imagelinks?.medium ? this.imagelinks.medium : this.imagelinks?.small ? this.imagelinks.small : this.imagelinks?.thumbnail ? this.imagelinks.thumbnail : this.imagelinks?.smallThumbnail;

            this.strings = {}
            this.strings.title = this.title || 'Unknown';
            this.strings.isbn = this.isbn || 'Unknown';
            this.strings.publisher = this.publisher || 'Unknown';
            this.strings.retailPrice = this.retailPrice && this.retailPriceCurrency ? `${this.retailPriceCurrency} ${this.retailPrice}` : 'N/A'
            // this.strings.description = this.description || '';
            this.strings.thumbSmall = this.thumbSmall ? this.thumbSmall : this.thumbLarge ? this.thumbLarge : '';
            this.strings.authors = this.authors ? this.authors.join(this.language && this.language.includes("zh") ? '、' : ', ') : 'Unknown';
            this.strings.plurality = this.authors ? this.authors.length > 1 ? 's' : '' : '';
        }
    }

    window.NetworkError = NetworkError;
    window.APIError = APIError;
    window.NoGoogleBooksResultsError = NoGoogleBooksResultsError;

    window.Book = Book;

    window.toastError = function(e) {
        if (e instanceof NetworkError) {
            toast(e.message, 'Network', 3);
        } else if (e instanceof APIError) {
            toast(e.message, 'Server', 3);
        } else {
            toast('DEBUG: Something went wrong. Please try again later', 'Unknown', 3)
        }
        console.error(e)
    }

    window.removeShimmer = function(e) {
        $(e).removeClass('shimmerBG');
    }
});