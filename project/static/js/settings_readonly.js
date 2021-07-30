$(document).ready(function() {
    var userid = $('meta[name=userid]').attr('content');
    fetch(`/api/v1/user/detail?userid=${userid}`, {
        method: 'GET',
        mode: 'cors',
        headers: csrfprotect({
            'Content-Type': 'application/json'
        }),
    }).then(response => {
        if (response.ok) return response.json();
        throw new NetworkError(response);
    }).then(json => {
        if (json.status != 'success') throw new APIError(json);
        return json.data;
    }).then(result => {
        var user = new UserSettings(result);
        user.populate();
    }).catch(e => {
        toastError(e);
    });
    
    class UserSettings {
        constructor(data) {
            this.data = data;
        }

        // utilities
        remove_loader(loader) {
            $(`[data-field="${loader}"]`).addClass('hide').removeClass('shimmerBG');
        }

        unhide_container(container) {
            $(`[data-field="${container}"]`).removeClass('hide');
        }

        hide_container(container) {
            $(`[data-field="${container}"]`).addClass('hide');
        }

        // updaters
        update_profile() {
            $('[data-field="profilePic"]').attr('src', `${this.data.profilePic}=s172-c`);
            $('[data-field="name"]').html(this.data.name).removeClass('shimmerBG');
            if (this.data.cky) {
                $('[data-field="cky"]').attr('data-tooltip', 'This user is a verified CKY student.').html('verified').addClass('verified');
            } else {
                $('[data-field="cky"]').attr('data-tooltip', 'This user may not be a CKY student.').html('warning').addClass('not-verified');
            }
        }

        update_payment() {
            const paymentInformations = ['cash', 'octopus', 'payme', 'tapngo', 'bankTransfer', 'eCheque', 'alipay', 'wechatPay'];
            let hasPaymentInformation = false;
            for (let p of paymentInformations) {
                if (this.data[p]) {
                    hasPaymentInformation = true;
                    $(`[data-field="${p}"]`).attr('src', `/static/img/payment/${p}.png`);
                } else {
                    $(`[data-field="${p}"]`).attr('src', '');
                }
            }
            
            if (hasPaymentInformation) {
                $('[data-field="payment_information_loader"]').html('').addClass('hide');
            } else {
                $('[data-field="payment_information_loader"]').html('Unset').removeClass('hide');
            }
        }

        update_sellerDeliveryMethods() {
            if (this.data.inSchoolExchange) {
                $('[data-field="inSchoolExchange"]').removeClass('hide');
            } else {
                $('[data-field="inSchoolExchange"]').addClass('hide');
            }
            if (this.data.meetup) {
                $('[data-field="meetup"]').removeClass('hide');
            } else {
                $('[data-field="meetup"]').addClass('hide');
            }
            if (this.data.delivery) {
                $('[data-field="delivery"]').removeClass('hide');
            } else {
                $('[data-field="delivery"]').addClass('hide');
            }
            if (this.data.inSchoolExchange || this.data.meetup || this.data.delivery) {
                $('[data-field="seller_delivery_methods_loader"]').html('').addClass('hide');
            } else {
                $('[data-field="seller_delivery_methods_loader"]').html('Unset').removeClass('hide');
            }
        }

        update_sellerNegotiable() {
            if (this.data.negotiable) {
                $('[data-field="negotiable"]').removeClass('not-negotiable').addClass('negotiable').html('check');
            } else {
                $('[data-field="negotiable"]').removeClass('negotiable').addClass('not-negotiable').html('close');
            }
        }

        update_publicity() {
            if (this.data.public) {
                $('[data-field="public"]').html('Public');
                $('[data-field="public_icon"]').html('public').attr('data-tooltip', 'Everyone can see this person\'s information.');
            } else {
                $('[data-field="public"]').html('Private');
                $('[data-field="public_icon"]').html('lock').attr('data-tooltip', 'Only the owner can see this person\'s information.');
            }
            this.unhide_container('public_container');
        }

        update_email() {
            if (this.data.email) {
                $('[data-field="email"]').html(this.data.email);
                this.unhide_container('email_container');
            } else {
                this.hide_container('email_container');
            }
        }
        update_discord() {
            if (this.data.discord) {
                $('[data-field="discord_icon"]').attr('src', '/static/img/contact/discord.png');
                $('[data-field="discord"]').html(this.data.discord);
                this.unhide_container('discord_container');
            } else {
                this.hide_container('discord_container');
            }
        }

        update_instagram() {
            if (this.data.instagram) {
                $('[data-field="instagram_icon"]').attr('src', '/static/img/contact/instagram.png');
                $('[data-field="instagram"]').html(this.data.instagram);
                this.unhide_container('instagram_container');
            } else {
                this.hide_container('instagram_container');
            }
        }

        update_phone() {
            if (this.data.phone) {
                $('[data-field="phone"]').html(this.data.phone);
                if (this.data.whatsapp) $('[data-field="whatsapp"]').attr('src', '/static/img/contact/whatsapp.png');
                if (this.data.signal) $('[data-field="signal"]').attr('src', '/static/img/contact/signal.png');
                if (this.data.telegram) $('[data-field="telegram"]').attr('src', '/static/img/contact/telegram.png');
                this.unhide_container('phone_container');
            } else {
                this.hide_container('phone_container');
            }
        }

        update_customContactInfo() {
            if (this.data.customContactInfo) {
                $('[data-field="customContactInfo"]').html(this.data.customContactInfo);
                this.unhide_container('customContactInfo_container');
            } else {
                this.hide_container('customContactInfo_container');
            }
        }

        populate() {
            this.update_profile();

            this.remove_loader('payment_information_loader');
            this.update_payment();

            this.remove_loader('seller_delivery_methods_loader');
            this.update_sellerDeliveryMethods();

            this.remove_loader('seller_negotiable_loader');
            this.update_sellerNegotiable();

            this.remove_loader('contact_information_loader');
            this.update_publicity();
            this.update_email();
            this.update_discord();
            this.update_instagram();
            this.update_phone();
            this.update_customContactInfo();
        }
    }
});