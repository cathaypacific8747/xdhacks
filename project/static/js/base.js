var csrftoken = $('meta[name=csrf-token]').attr('content')
$.ajaxSetup({
    beforeSend: function(xhr, settings) {
        if (!/^(GET|HEAD|OPTIONS|TRACE)$/i.test(settings.type)) {
            xhrf.xhr.setRequestHeader("X-CSRFToken", csrftoken)
        }
    }
})

$(document).ready(function(){
    let dd = $('.dropdown-trigger')
    if (dd) {
        dd.dropdown({
            alignment: 'right',
            constrainWidth: false,
            coverTrigger: false,
        })
    }
});