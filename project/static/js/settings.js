$(document).ready(function() {
    $('.tooltipped').tooltip();
    $('.material-tooltip').css({
        "border-radius": ".5rem",
        "background-color": "#00000088"
    })

    fetch('api/v1/user/detail', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then((response) => {
        if (response.ok) return response.json();
        throw new Error('Network error');
    })
    .then((json) => {
        if (json["status"] == "success") return json;
        throw new Error('Server error');
    })
    .then((result) => {
        initialise(result["data"]);
    })
    .catch((error) => {
        console.error(error); 
    });
    
    function initialise(data) {
        // profile information
        $('[data-field="profilePic"]').attr("src", `${data["profilePic"]}=s172-c`).parent().removeClass("shimmerBG");
        $('[data-field="name"]').html(data["name"]).removeClass("shimmerBG");
        $('[data-field="email"]').html(data["email"]).removeClass("shimmerBG");
        if (data["cky"]) {
            $('[data-field="cky"]').attr("data-tooltip", "This user is a verified CKY student.").html("verified").addClass("verified");
        } else {
            $('[data-field="cky"]').attr("data-tooltip", "This user may not be a CKY student.").html("warning").addClass("not-verified");
        }
        // payment information
        $('[data-field="payment_information_loader"]').addClass("hide").removeClass("shimmerBG");
        const paymentInformations = ['cash', 'octopus', 'payme', 'tapngo', 'bankTransfer', 'wechatPay', 'alipay', 'eCheque'];
        let hasPaymentInformation = false;
        for (let p of paymentInformations) {
            if (data[p]) {
                hasPaymentInformation = true;
                $(`[data-field="${p}"]`).attr("src", `static/img/payment/${p}.png`);
            }
        }
        if (!hasPaymentInformation) $(`[data-field="payment_information_loader"]`).html("Unset").removeClass("hide");
        // account type information
        if (!data["seller"]) $('[data-field="seller_information_container"]').addClass("hide")
        $('[data-field="account_type_loader"]').addClass("hide").removeClass("shimmerBG");
        if (data["buyer"]) $('[data-field="buyer"]').removeClass("hide");
        if (data["seller"]) $('[data-field="seller"]').removeClass("hide")
        if (!data["buyer"] && !data["seller"]) $(`[data-field="account_type_loader"]`).html("Unset").removeClass("hide");
        // seller information
        $('[data-field="seller_delivery_methods_loader"]').addClass("hide").removeClass("shimmerBG");
        if (data["inSchoolExchange"]) $('data-field="inSchoolExchange"').removeClass("hide");
        if (data["meetup"]) $('data-field="meetup"').removeClass("hide");
        if (data["delivery"]) $('data-field="delivery"').removeClass("hide");
        if (!data["inSchoolExchange"] && !data["meetup"] && !data["delivery"]) $('[data-field="seller_delivery_methods_loader"]').html("Unset").removeClass("hide");
        $('[data-field="seller_negotiable_loader"]').addClass("hide").removeClass("shimmerBG");
        if (data["negotiable"]) {
            $('[data-field="negotiable"]').addClass("negotiable").html("check");
        } else {
            $('[data-field="negotiable"]').addClass("not-negotiable").html("close");
        }
        // contact information
        data["public"] = true;
        $('[data-field="information_loader"]').addClass("hide").removeClass("shimmerBG");
        // public
        if (data["public"]) {
            $('[data-field="public"]').html("Public");
            $('[data-field="public_icon"]').html("public").attr("data-tooltip", "Everyone can see your information.");
        } else {
            $('[data-field="public"]').html("Private");
            $('[data-field="public_icon"]').html("lock").attr("data-tooltip", "Only you can see the information.");
        }
        $('[data-field="public_container"]').removeClass("hide");
        // discord
        data["discord"] = "cathayexpress#2424";
        if (data["discord"]) {
            $('[data-field="discord_icon"]').attr("src", "static/img/contact/discord.png");
            $('[data-field="discord"]').html(data["discord"]);
            $('[data-field="discord_container"]').removeClass("hide");
        }
        // instagram
        data["instagram"] = "walter.stop.bullying.me";
        if (data["instagram"]) {
            $('[data-field="instagram_icon"]').attr("src", "static/img/contact/instagram.png");
            $('[data-field="instagram"]').html(data["instagram"]);
            $('[data-field="instagram_container"]').removeClass("hide");
        }
        // phone
        data["phone"] = "54102041";
        data["whatsapp"] = true;
        data["signal"] = true;
        data["telegram"] = true;
        if (data["phone"]) {
            $('[data-field="phone_icon"]').attr("src", "static/img/contact/phone.png");
            $('[data-field="phone"]').html(data["phone"]);
            if (data["whatsapp"]) $('[data-field="whatsapp"]').attr("src", "static/img/contact/whatsapp.png")
            if (data["signal"]) $('[data-field="signal"]').attr("src", "static/img/contact/signal.png")
            if (data["telegram"]) $('[data-field="telegram"]').attr("src", "static/img/contact/telegram.png")
            $('[data-field="phone_container"]').removeClass("hide");
        }
        // custom contact information
        data["customContactInfo"] = "This is the service hotline for bullying Abraham. Operating hours - 24/7/365. Quality guaranteed, with 5-year warranty."
        if (data["customContactInfo"]) {
            $('[data-field="customContactInfo_icon"]').attr("src", "static/img/contact/customContactInfo.png");
            $('[data-field="customContactInfo"]').html(data["customContactInfo"]);
            $('[data-field="customContactInfo_container"]').removeClass("hide");
        }
    }
});