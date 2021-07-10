$(document).ready(function() {
    const initialHelpText = "Loading...";
    $('[data-element="help"]').html(initialHelpText);

    function delay(fn, ms) {
        let timer = 0
        return function(...args) {
            clearTimeout(timer)
            timer = setTimeout(fn.bind(this, ...args), ms || 0)
        }
    }

    async function aggregate(bookIds=[]) {
        $('[data-element="progress"]').removeClass("hide");
        $('[data-element="help"]').html(initialHelpText);
        await fetch('api/v1/market/aggregate', {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                bookIds: bookIds
            })
        }).then(response => {
            if (response.ok) return response.json();
            throw new NetworkError(response);
        }).then(json => {
            if (json.status != "success") throw new APIError(json);
            if (!json.data.length) throw new NoGoogleBooksResultsError();
            return json.data;
        }).then(data => {
            console.log(data)
        }).catch(e => {
            if (e instanceof NoGoogleBooksResultsError) {
                $('[data-element="help"]').html("No results found. Please check your inputs.");
            } else if (e instanceof NetworkError) {
                $('[data-element="help"]').html("An error occured when retrieving data. Please check your connection or try again.");
            } else {
                console.error(e);
            }
        }).finally(() => {
            $('[data-element="help"]').html('');
            $('[data-element="progress"]').addClass("hide");
        });
    }

    async function search(string) {
        $('[data-element="google_book_results"]').addClass("hide").empty();
        if (!string) {
            await aggregate();
            return;
        }
        fetch(`https://www.googleapis.com/books/v1/volumes?q=${string}&orderBy=relevance&maxResults=40&projection=lite`, {
            method: 'GET',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(response => {
            if (!response.ok) throw new NetworkError(response);
            return response.json();
        }).then(async json => {
            if (json.totalItems == 0) throw new NoGoogleBooksResultsError();
            await aggregate(json.items.map(e => e.id));
        }).catch(e => {
            if (e instanceof NoGoogleBooksResultsError) {
                $('[data-element="help"]').html("No results found. Please check your inputs.");
            } else if (e instanceof NetworkError) {
                $('[data-element="help"]').html("An error occured when retrieving data. Please check your connection or try again.");
            } else {
                console.error(e);
            }
        });
    }

    $('[data-field="google_book_input"]').keyup(delay(function(e) {
        if (e.which != 13) search(e.target.value);
    }, 500)).keypress(function(e) {
        if (e.which == 13) {
            e.target.blur();
            search(e.target.value);
        }
    });
});