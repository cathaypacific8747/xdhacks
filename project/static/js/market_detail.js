$(document).ready(function() {
    var bookid = $('meta[name=bookid]').attr('content');
    const initialHelpText = "Loading offers...";
    $('[data-element="help"]').removeClass("hide").html(initialHelpText);
    $('[data-element="progress"]').removeClass("hide");

    fetch(`https://www.googleapis.com/books/v1/volumes/${bookid}`, {
        method: 'GET',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(response => {
        if (!response.ok) throw new NetworkError(response);
        return response.json();
    }).then(json => {
        if ('error' in json) throw new NoGoogleBooksResultsError();
        return json;
    }).then(result => {
        let book = new Book(result);
        $('[data-element="book-information"]').html(`<div class="row mx-0 mb-8 p-8 roundBox" data-googleid="${book.googleId}">
            <div class="col s2 mx-0 p-0 minPicHeight shimmerBG">
                <img class="google-book-image roundBox" src="${book.strings.thumbSmall}" onload="removeShimmer(this.parentElement);removeMinPicHeight(this.parentElement)" data-field="thumb">
            </div>
            <div class="col s10">
                <div class="row mt-0 mb-2">
                    <div class="col font-size-24 text-bold">${book.strings.title}</div>
                </div>
                <div class="row mt-0 mb-0">
                    <div class="col font-size-16">Author${book.strings.plurality}: ${book.strings.authors}</div>
                </div>
                <div class="row mt-0 mb-0">
                    <div class="col font-size-16">Publisher: ${book.strings.publisher}</div>
                </div>
                <div class="row mt-0 mb-0">
                    <div class="col font-size-16">Date of publication: ${book.strings.publishedDate}</div>
                </div>
                <div class="row mt-0 mb-0">
                    <div class="col font-size-16">ISBN: ${book.strings.isbn}</div>
                </div>
                <div class="row mt-0 mb-0">
                    <div class="col font-size-16">Number of pages: ${book.strings.pageCount}</div>
                </div>
                <div class="row mt-0 mb-0">
                    <div class="col font-size-16">Dimensions: ${book.strings.dimensions}</div>
                </div>
            </div>
        </div>`)
        return book;
    }).then(book => {
        console.log(book);
        fetch(`/api/v1/market/detail?bookid=${bookid}`, {
            method: 'GET',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(response => {
            if (response.ok) return response.json();
            throw new NetworkError(response);
        }).then(json => {
            if (json.status != "success" || !json.data) throw new APIError(json);
            return json.data;
        }).then(data => {
            console.log(data);
        }).catch(e => {
            throw e;
        })
    }).catch(e => {
        if (e instanceof NoGoogleBooksResultsError) {
            $('[data-element="help"]').html("This book does not exist.");
        } else if (e instanceof APIError) {
            $('[data-element="help"]').html("There are no offers avaliable for the moment, please try again later.");
        } else if (e instanceof NetworkError) {
            $('[data-element="help"]').html("An error occured when retrieving data. Please check your connection or try again.");
        } else {
            console.error(e)
        }
    }).finally(() => {
        $('[data-element="progress"]').addClass("hide");
    });
    // console.log(bookid);
});