var csrftoken = $('meta[name=csrf-token]').attr('content');
$.ajaxSetup({
    beforeSend: function(xhr, settings) {
        if (!/^(GET|HEAD|OPTIONS|TRACE)$/i.test(settings.type)) {
            xhrf.xhr.setRequestHeader("X-CSRFToken", csrftoken)
        }
    }
})

$(document).ready(function() {
    $('.dropdown-trigger').dropdown({
        alignment: 'right',
        constrainWidth: false,
        coverTrigger: false,
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

    window.NetworkError = NetworkError;
    window.APIError = APIError;

    window.toastError = function(e) {
        if (e instanceof NetworkError) {
            toast(e.message, 'Network', 3);
        } else if (e instanceof APIError) {
            toast(e.message, 'Server', 3);
        } else {
            toast('Something went wrong. Please try again later', 'Unknown', 3)
        }
        console.error(e)
    }
});