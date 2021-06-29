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
        var user = new UserSettings(result["data"]);
        user.populate()
    })
    .catch((error) => {
        console.error(error); 
    });
    
    class UserSettings {
        constructor(data) {
            this.data = data;
        }

        remove_loader(loader) {
            $(`[data-field="${loader}"]`).addClass("hide").removeClass("shimmerBG");
        }

        unhide_container(container) {
            $(`[data-field="${container}"]`).removeClass("hide");
        }

        hide_container(container) {
            $(`[data-field="${container}"]`).addClass("hide");
        }

        update_profile() {
            $('[data-field="profilePic"]').attr("src", `${this.data.profilePic}=s172-c`).parent().removeClass("shimmerBG");
            $('[data-field="name"]').html(this.data.name).removeClass("shimmerBG");
            $('[data-field="email"]').html(this.data.email).removeClass("shimmerBG");
            if (this.data.cky) {
                $('[data-field="cky"]').attr("data-tooltip", "This user is a verified CKY student.").html("verified").addClass("verified");
            } else {
                $('[data-field="cky"]').attr("data-tooltip", "This user may not be a CKY student.").html("warning").addClass("not-verified");
            }
        }

        update_payment() {
            const paymentInformations = ['cash', 'octopus', 'payme', 'tapngo', 'bankTransfer', 'eCheque', 'alipay', 'wechatPay'];
            let hasPaymentInformation = false;
            for (let p of paymentInformations) {
                if (this.data[p]) {
                    hasPaymentInformation = true;
                    $(`[data-field="${p}"]`).attr("src", `static/img/payment/${p}.png`);
                }
            }
            
            if (hasPaymentInformation) {
                $(`[data-field="payment_information_loader"]`).html("").addClass("hide");
            } else {
                $(`[data-field="payment_information_loader"]`).html("Unset").removeClass("hide");
            }
        }

        update_accountType() {
            if (this.data.seller) {
                $('[data-field="seller_information_container"]').removeClass("hide")
            } else {
                $('[data-field="seller_information_container"]').addClass("hide")
            }
            if (this.data.buyer) $('[data-field="buyer"]').removeClass("hide");
            if (this.data.seller) $('[data-field="seller"]').removeClass("hide");
            if (this.data.buyer || this.data.seller) {
                $(`[data-field="account_type_loader"]`).html("").addClass("hide");
            } else {
                $(`[data-field="account_type_loader"]`).html("Unset").removeClass("hide");
            }
        }

        update_sellerDeliveryMethods() {
            if (this.data.inSchoolExchange) $('[data-field="inSchoolExchange"]').removeClass("hide");
            if (this.data.meetup) $('[data-field="meetup"]').removeClass("hide");
            if (this.data.delivery) $('[data-field="delivery"]').removeClass("hide");
            if (this.data.inSchoolExchange || this.data.meetup || this.data.delivery) {
                $(`[data-field="seller_delivery_methods_loader"]`).html("").addClass("hide");
            } else {
                $(`[data-field="seller_delivery_methods_loader"]`).html("Unset").removeClass("hide");
            }
        }

        update_sellerNegotiable() {
            if (this.data.negotiable) {
                $('[data-field="negotiable"]').removeClass("not-negotiable").addClass("negotiable").html("check");
            } else {
                $('[data-field="negotiable"]').removeClass("negotiable").addClass("not-negotiable").html("close");
            }
        }

        update_publicity() {
            if (this.data.public) {
                $('[data-field="public"]').html("Public");
                $('[data-field="public_icon"]').html("public").attr("data-tooltip", "Everyone can see your information.");
            } else {
                $('[data-field="public"]').html("Private");
                $('[data-field="public_icon"]').html("lock").attr("data-tooltip", "Only you can see the information.");
            }
            this.unhide_container("public_container");
        }

        update_discord() {
            if (this.data.discord) {
                $('[data-field="discord_icon"]').attr("src", "static/img/contact/discord.png");
                $('[data-field="discord"]').html(this.data.discord);
                this.unhide_container("discord_container");
            } else {
                this.hide_container("discord_container");
            }
        }

        update_instagram() {
            if (this.data.instagram) {
                $('[data-field="instagram_icon"]').attr("src", "static/img/contact/instagram.png");
                $('[data-field="instagram"]').html(this.data.instagram);
                this.unhide_container("instagram_container");
            } else {
                this.hide_container("instagram_container");
            }
        }

        update_phone() {
            if (this.data.phone) {
                $('[data-field="phone_icon"]').attr("src", "static/img/contact/phone.png");
                $('[data-field="phone"]').html(this.data.phone);
                if (this.data.whatsapp) $('[data-field="whatsapp"]').attr("src", "static/img/contact/whatsapp.png")
                if (this.data.signal) $('[data-field="signal"]').attr("src", "static/img/contact/signal.png")
                if (this.data.telegram) $('[data-field="telegram"]').attr("src", "static/img/contact/telegram.png")
                this.unhide_container("phone_container");
            } else {
                this.hide_container("phone_container");
            }
        }

        update_customContactInfo() {
            if (this.data.customContactInfo) {
                $('[data-field="customContactInfo_icon"]').attr("src", "static/img/contact/customContactInfo.png");
                $('[data-field="customContactInfo"]').html(this.data.customContactInfo);
                this.unhide_container("customContactInfo_container");
            } else {
                this.hide_container("customContactInfo_container");
            }
        }

        populate() {
            // this.data.seller = true;
            // this.data.inSchoolExchange = true;
            // this.data.public = false;
            // this.data.discord = "cathayexpress#2424";
            // this.data.instagram = "walter.stop.bullying.me";
            // this.data.phone = "54102041"
            // this.data.whatsapp = true;
            // this.data.customContactInfo = "This is the service hotline for bullying Abraham. Operating hours - 24/7/365. Quality guaranteed, with life-time warranty."
            this.update_profile();

            this.remove_loader("payment_information_loader");
            this.update_payment();

            this.remove_loader("account_type_loader");
            this.update_accountType();

            this.remove_loader("seller_delivery_methods_loader");
            this.update_sellerDeliveryMethods();

            this.remove_loader("seller_negotiable_loader");
            this.update_sellerNegotiable();

            this.remove_loader("information_loader");
            this.update_publicity();
            this.update_discord();
            this.update_instagram();
            this.update_phone();
            this.update_customContactInfo();
        }

        // setTimeout(() => {
        //     this.data.buyer = true;
        //     this.data.seller = true;
        //     this.update_accountType()
        //     console.log('done')
        // }, 2000);
    }
});