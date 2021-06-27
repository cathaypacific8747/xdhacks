var csrftoken = $('meta[name=csrf-token]').attr('content')
$.ajaxSetup({
    beforeSend: function(xhr, settings) {
        if (!/^(GET|HEAD|OPTIONS|TRACE)$/i.test(settings.type)) {
            xhrf.xhr.setRequestHeader("X-CSRFToken", csrftoken)
        }
    }
})

$(document).ready(function(){
    if ($('.dropdown-trigger')) {
        $('.dropdown-trigger').dropdown({
            alignment: 'right',
            constrainWidth: false,
            coverTrigger: false,
        })
    }
});