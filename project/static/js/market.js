var data = {}

$('#introName').css("opacity", 1);
setTimeout(function() {
    $('#introDesc').css("opacity", 1);
}, 500)
if ($("#balance").html() == 1) {
    $("balanceS").html('');
}

fetch('getAllBooks')
.then(response => response.json())
.then(value => {
    data = value // set global

    let htmls = ''
    for (book of data.books) {
        const html = `<div class="w-300 mw-full">
            <div class="card p-0 mx-15">
                <img src="static/img/books/${book['imagepath']}" class="img-fluid rounded-top" alt="${book['name']}">
                <div class="content">
                    <h2 class="content-title content1">
                        ${book['name']}
                    </h2>
                    <p class="text-left content2">
                        ${book['ownerCount']} sellers
                    </p>
                    <p class="text-left content2">
                        ${book['minPrice']} to ${book['maxPrice']} credits
                    </p>
                    <div class="text-right">
                        <a href="#" class="btn viewOwner" data-id="${book['id']}">View Owners</a>
                    </div>
                </div>
            </div>
        </div>
        `
        htmls += html
    }
    $("#all").html(htmls)
}).catch(function() {
    halfmoon.initStickyAlert({
        content: "Server did not respond, please try again later.",
        title: "Error",
        alertType: "alert-danger",
        fillType: "filled-lm",
        hasDismissButton: false,
    });
})

function showModal(i) {
    halfmoon.toggleModal('modal-1');
    for (book of data.books) {
        if (book.id == i) {
            fetch(`getBookOwners?id=${book.id}`)
            .then(response => response.json())
            .then(value => {
                html = ''
                for (owner of value.owners) {
                    html += `
                    <tr>
                        <td>${owner.name}</td>
                        <td>${owner.email}</td>
                        <td>${owner.condition}%</td>
                        <td>${owner.price} credits</td>
                        <td><button class="btn btn-primary" type="button">Contact</button></td>
                    </tr>
                    `
                }
                $("#tbody").html(html)
            })
            // .catch(error => {/* ignore */})
            break;
        }
    }
}

$(document).on('click', '.viewOwner', e => showModal($(e.currentTarget).data('id')));