$('#introName').css("opacity", 1)
setTimeout(function() {
    $('#introDesc').css("opacity", 1)
}, 500)
setTimeout(function() {
    $('.debugArea').css("opacity", 1)
}, 1000)

$('#addCredits').click((e) => {
    fetch('addcredits')
    .then(response => response.json())
    .then(function(data) {
        if (data['success']) {
            halfmoon.initStickyAlert({
                content: "10 credits have been successfully added to the user.",
                title: "Success",
                alertType: "alert-success",
                fillType: "filled-lm",
                hasDismissButton: false,
            });
            const newBal = parseInt($('#balance').html(), 10) + 10
            $('#balance').html(newBal);
            $('#balanceS').html((newBal == 1) ? '' : 's')
        } else {
            halfmoon.initStickyAlert({
                content: "Server had problems with updating the balance, please try again later",
                title: "Error",
                alertType: "alert-danger",
                fillType: "filled-lm",
                hasDismissButton: false,
            });
        }
    }).catch(function() {
        halfmoon.initStickyAlert({
            content: "Server did not respond, please try again later.",
            title: "Error",
            alertType: "alert-danger",
            fillType: "filled-lm",
            hasDismissButton: false,
        });
    })
})

$('#resetCredits').click((e) => {
    fetch('resetcredits')
    .then(response => response.json())
    .then(function(data) {
        if (data['success']) {
            halfmoon.initStickyAlert({
                content: "Credit has been reset to 0!",
                title: "Success",
                alertType: "alert-success",
                fillType: "filled-lm",
                hasDismissButton: false,
            });
            $('#balance').html(0);
            $('#balanceS').html('s')
        } else {
            halfmoon.initStickyAlert({
                content: "Server had problems with updating the balance, please try again later",
                title: "Error",
                alertType: "alert-danger",
                fillType: "filled-lm",
                hasDismissButton: false,
            });
        }
    }).catch(function() {
        halfmoon.initStickyAlert({
            content: "Server did not respond, please try again later.",
            title: "Error",
            alertType: "alert-danger",
            fillType: "filled-lm",
            hasDismissButton: false,
        });
    })
})