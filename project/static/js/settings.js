$(document).ready(function() {
    $('[data-editfield="customContactInfo_text"]').characterCounter();
    
    fetch('api/v1/user/detail', {
        method: 'GET',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then((response) => {
        if (response.ok) return response.json();
        throw new NetworkError(response);
    })
    .then((json) => {
        if (json["status"] == "success") return json;
        throw new APIError(json);
    })
    .then((result) => {
        var user = new UserSettings(result["data"]);
        user.populate();
        user.bindEditActions();
        user.bindSaveActions();
    })
    .catch((error) => {
        toastError(error);
    });
    
    class UserSettings {
        constructor(data) {
            this.data = data;
        }

        // utilities
        remove_loader(loader) {
            $(`[data-field="${loader}"]`).addClass("hide").removeClass("shimmerBG");
        }

        unhide_container(container) {
            $(`[data-field="${container}"]`).removeClass("hide");
        }

        hide_container(container) {
            $(`[data-field="${container}"]`).addClass("hide");
        }

        bindEditAction(section) {
            $(`[data-edit="${section}"]`).click(() => {
                $(`[data-section="${section}_display"]`).addClass("hide");
                $(`[data-edit="${section}"]`).addClass("hide");
                $(`[data-section="${section}_editor"]`).removeClass("hide");
                $(`[data-save="${section}"]`).removeClass("hide");
            })
        }

        // updaters
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

        update_payment_edit() {
            const paymentInformations = ['cash', 'octopus', 'payme', 'tapngo', 'bankTransfer', 'eCheque', 'alipay', 'wechatPay'];
            for (let p of paymentInformations) {
                if (this.data[p]) {
                    $(`[data-editfield="${p}"]`).prop("checked", true);
                } else {
                    $(`[data-editfield="${p}"]`).prop("checked", false);
                }
            }
        }
        update_payment() {
            const paymentInformations = ['cash', 'octopus', 'payme', 'tapngo', 'bankTransfer', 'eCheque', 'alipay', 'wechatPay'];
            let hasPaymentInformation = false;
            for (let p of paymentInformations) {
                if (this.data[p]) {
                    hasPaymentInformation = true;
                    $(`[data-field="${p}"]`).attr("src", `static/img/payment/${p}.png`);
                } else {
                    $(`[data-field="${p}"]`).attr("src", '');
                }
            }
            
            if (hasPaymentInformation) {
                $(`[data-field="payment_information_loader"]`).html("").addClass("hide");
            } else {
                $(`[data-field="payment_information_loader"]`).html("Unset").removeClass("hide");
            }
            this.update_payment_edit()
        }

        update_accountType_edit_options() {
            if ($('[data-editfield="seller"]').is(':checked')) {
                $('[data-field="seller_information_container"]').removeClass("hide")
            } else {
                $('[data-field="seller_information_container"]').addClass("hide")
            }
        }
        update_accountType_edit() {
            $('[data-editfield="buyer"]').prop("checked", this.data.buyer);
            $('[data-editfield="seller"]').prop("checked", this.data.seller).click(() => {
                this.update_accountType_edit_options();
            });
            this.update_accountType_edit_options();
        }
        update_accountType() {
            if (this.data.seller) {
                $('[data-field="seller_information_container"]').removeClass("hide")
                $('[data-field="seller"]').removeClass("hide");
            } else {
                $('[data-field="seller_information_container"]').addClass("hide")
                $('[data-field="seller"]').addClass("hide");
            }
            if (this.data.buyer) {
                $('[data-field="buyer"]').removeClass("hide");
            } else {
                $('[data-field="buyer"]').addClass("hide");
            }
            if (this.data.buyer || this.data.seller) {
                $(`[data-field="account_type_loader"]`).html("").addClass("hide");
            } else {
                $(`[data-field="account_type_loader"]`).html("Unset").removeClass("hide");
            }
            this.update_accountType_edit()
        }

        update_sellerDeliveryMethods_edit() {
            $('[data-editfield="inSchoolExchange"]').prop("checked", this.data.inSchoolExchange);
            $('[data-editfield="meetup"]').prop("checked", this.data.meetup);
            $('[data-editfield="delivery"]').prop("checked", this.data.delivery);
        }
        update_sellerDeliveryMethods() {
            if (this.data.inSchoolExchange) {
                $('[data-field="inSchoolExchange"]').removeClass("hide");
            } else {
                $('[data-field="inSchoolExchange"]').addClass("hide");
            }
            if (this.data.meetup) {
                $('[data-field="meetup"]').removeClass("hide");
            } else {
                $('[data-field="meetup"]').addClass("hide");
            }
            if (this.data.delivery) {
                $('[data-field="delivery"]').removeClass("hide");
            } else {
                $('[data-field="delivery"]').addClass("hide");
            }

            if (this.data.inSchoolExchange || this.data.meetup || this.data.delivery) {
                $(`[data-field="seller_delivery_methods_loader"]`).html("").addClass("hide");
            } else {
                $(`[data-field="seller_delivery_methods_loader"]`).html("Unset").removeClass("hide");
            }
            this.update_sellerDeliveryMethods_edit()
        }

        update_sellerNegotiable_edit() {
            $('[data-editfield="negotiable"]').prop("checked", this.data.negotiable);
        }
        update_sellerNegotiable() {
            if (this.data.negotiable) {
                $('[data-field="negotiable"]').removeClass("not-negotiable").addClass("negotiable").html("check");
            } else {
                $('[data-field="negotiable"]').removeClass("negotiable").addClass("not-negotiable").html("close");
            }
            this.update_sellerNegotiable_edit()
        }

        update_publicity_edit() {
            $('[data-editfield="public"]').prop("checked", this.data.public);
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
            this.update_publicity_edit();
        }

        update_discord_edit_text() {
            $('[data-editfield="discord_text"]').val(this.data.discord);
            M.updateTextFields();
            if ($('[data-editfield="discord"]').is(':checked')) {
                $('[data-editfieldgroup="discord"]').removeClass("hide");
            } else {
                $('[data-editfieldgroup="discord"]').addClass("hide");
            }
        }
        update_discord_edit() {
            $('[data-editfield="discord"]').prop("checked", Boolean(this.data.discord)).click(() => {
                this.update_discord_edit_text();
            });
            this.update_discord_edit_text();
        }
        update_discord() {
            if (this.data.discord) {
                $('[data-field="discord_icon"]').attr("src", "static/img/contact/discord.png");
                $('[data-field="discord"]').html(this.data.discord);
                this.unhide_container("discord_container");
            } else {
                this.hide_container("discord_container");
            }
            this.update_discord_edit();
        }

        update_instagram_edit_text() {
            $('[data-editfield="instagram_text"]').val(this.data.instagram);
            M.updateTextFields();
            if ($('[data-editfield="instagram"]').is(':checked')) {
                $('[data-editfieldgroup="instagram"]').removeClass("hide");
            } else {
                $('[data-editfieldgroup="instagram"]').addClass("hide");
            }
        }
        update_instagram_edit() {
            $('[data-editfield="instagram"]').prop("checked", Boolean(this.data.instagram)).click(() => {
                this.update_instagram_edit_text();
            });
            this.update_instagram_edit_text();
        }
        update_instagram() {
            if (this.data.instagram) {
                $('[data-field="instagram_icon"]').attr("src", "static/img/contact/instagram.png");
                $('[data-field="instagram"]').html(this.data.instagram);
                this.unhide_container("instagram_container");
            } else {
                this.hide_container("instagram_container");
            }
            this.update_instagram_edit()
        }

        update_phone_edit_text() {
            $('[data-editfield="phone_text"]').val(this.data.phone);
            M.updateTextFields();
            if ($('[data-editfield="phone"]').is(':checked')) {
                $('[data-editfieldgroup="phone"]').removeClass("hide");
            } else {
                $('[data-editfieldgroup="phone"]').addClass("hide");
            }
        }
        update_phone_edit() {
            $('[data-editfield="phone"]').prop("checked", Boolean(this.data.phone)).click(() => {
                this.update_phone_edit_text();
            })
            $('[data-editfield="whatsapp"]').prop("checked", this.data.whatsapp);
            $('[data-editfield="signal"]').prop("checked", this.data.signal);
            $('[data-editfield="telegram"]').prop("checked", this.data.telegram);
            this.update_phone_edit_text();
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
            this.update_phone_edit()
        }

        update_customContactInfo_edit_text() {
            $('[data-editfield="customContactInfo_text"]').val(this.data.customContactInfo);
            M.textareaAutoResize($('[data-editfield="customContactInfo_text"]'));
            if ($('[data-editfield="customContactInfo"]').is(':checked')) {
                $('[data-editfieldgroup="customContactInfo"]').removeClass("hide");
            } else {
                $('[data-editfieldgroup="customContactInfo"]').addClass("hide");
            }
        }
        update_customContactInfo_edit() {
            $('[data-editfield="customContactInfo"]').prop("checked", Boolean(this.data.customContactInfo)).click(() => {
                this.update_customContactInfo_edit_text();
            })
            this.update_customContactInfo_edit_text();
        }
        update_customContactInfo() {
            if (this.data.customContactInfo) {
                $('[data-field="customContactInfo_icon"]').attr("src", "static/img/contact/customContactInfo.png");
                $('[data-field="customContactInfo"]').html(this.data.customContactInfo);
                this.unhide_container("customContactInfo_container");
            } else {
                this.hide_container("customContactInfo_container");
            }
            this.update_customContactInfo_edit();
        }

        populate() {
            // this.data.cash = true;
            // this.data.octopus = true;
            // this.data.payme = true;
            // this.data.seller = false;
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

            this.remove_loader("contact_information_loader");
            this.update_publicity();
            this.update_discord();
            this.update_instagram();
            this.update_phone();
            this.update_customContactInfo();
        }

        bindEditActions() {
            this.bindEditAction('payment_information');
            this.bindEditAction('account_type');
            this.bindEditAction('seller_delivery_methods');
            this.bindEditAction('seller_negotiable');
            this.bindEditAction('contact_information');
        }

        // savers
        async save_settings(updateData) {
            const updatedData = await fetch('api/v1/user/update', {
                method: 'POST',
                mode: 'cors',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updateData)
            })
            .then((response) => {
                if (response.ok) return response.json();
                throw new NetworkError(response);
            })
            .then((json) => {
                if (json["status"] == "success") {
                    toast(json["message"], '', 1);
                    return json["data"];
                }
                throw new APIError(json);
            })
            .catch((error) => {
                toastError(error);
                return null;
            });
            return updatedData;
        }

        save_visual(section) {
            $(`[data-section="${section}_editor"]`).addClass("hide");
            $(`[data-save="${section}"]`).addClass("hide");
            $(`[data-section="${section}_display"]`).removeClass("hide");
            $(`[data-edit="${section}"]`).removeClass("hide");
        }

        getInput_payment() {
            let input = {};
            input.cash = $('[data-editfield="cash"]').is(':checked');
            input.octopus = $('[data-editfield="octopus"]').is(':checked');
            input.payme = $('[data-editfield="payme"]').is(':checked');
            input.tapngo = $('[data-editfield="tapngo"]').is(':checked');
            input.bankTransfer = $('[data-editfield="bankTransfer"]').is(':checked');
            input.wechatPay = $('[data-editfield="wechatPay"]').is(':checked');
            input.alipay = $('[data-editfield="alipay"]').is(':checked');
            input.eCheque = $('[data-editfield="eCheque"]').is(':checked');
            return input;
        }
        bindSaveAction_payment() {
            $(`[data-save="payment_information"]`).click(() => {
                const input = this.getInput_payment();
                this.save_settings(input).then(updatedData => {
                    if (updatedData) {
                        this.data = Object.assign(this.data, updatedData);
                        this.update_payment();
                        this.save_visual('payment_information');
                    }
                })
            })
        }

        getInput_accountType() {
            let input = {};
            input.buyer = $('[data-editfield="buyer"]').is(':checked');
            input.seller = $('[data-editfield="seller"]').is(':checked');
            return input;
        }
        bindSaveAction_accountType() {
            $(`[data-save="account_type"]`).click(() => {
                const input = this.getInput_accountType();
                this.save_settings(input).then(updatedData => {
                    if (updatedData) {
                        this.data = Object.assign(this.data, updatedData);
                        this.update_accountType();
                        this.save_visual('account_type');
                    }
                })
            })
        }

        getInput_sellerDeliveryMethods() {
            let input = {};
            input.inSchoolExchange = $('[data-editfield="inSchoolExchange"]').is(':checked');
            input.meetup = $('[data-editfield="meetup"]').is(':checked');
            input.delivery = $('[data-editfield="delivery"]').is(':checked');
            return input;
        }
        bindSaveAction_sellerDeliveryMethods() {
            $(`[data-save="seller_delivery_methods"]`).click(() => {
                const input = this.getInput_sellerDeliveryMethods();
                this.save_settings(input).then(updatedData => {
                    if (updatedData) {
                        this.data = Object.assign(this.data, updatedData);
                        this.update_sellerDeliveryMethods();
                        this.save_visual('seller_delivery_methods');
                    }
                })
            })
        }

        getInput_sellerNegotiable() {
            let input = {};
            input.negotiable = $('[data-editfield="negotiable"]').is(':checked');
            return input;
        }
        bindSaveAction_sellerNegotiable() {
            $(`[data-save="seller_negotiable"]`).click(() => {
                const input = this.getInput_sellerNegotiable();
                this.save_settings(input).then(updatedData => {
                    if (updatedData) {
                        this.data = Object.assign(this.data, updatedData);
                        this.update_sellerNegotiable();
                        this.save_visual('seller_negotiable');
                    }
                })
            })
        }

        getInput_contactInformation() {
            let input = {};

            input.public = $('[data-editfield="public"]').is(':checked');
            input.discord = $('[data-editfield="discord"]').is(':checked') ? $('[data-editfield="discord_text"]').val() : '';
            input.instagram = $('[data-editfield="instagram"]').is(':checked') ? $('[data-editfield="instagram_text"]').val() : '';
            input.phone = $('[data-editfield="phone"]').is(':checked') ? $('[data-editfield="phone_text"]').val() : '';
            input.customContactInfo = $('[data-editfield="customContactInfo"]').is(':checked') ? $('[data-editfield="customContactInfo_text"]').val() : '';

            return input;
        }
        bindSaveAction_contactInformation() {
            $(`[data-save="contact_information"]`).click(() => {
                const input = this.getInput_contactInformation();
                this.save_settings(input).then(updatedData => {
                    if (updatedData) {
                        this.data = Object.assign(this.data, updatedData);
                        this.update_publicity();
                        this.update_discord();
                        this.update_instagram();
                        this.update_phone();
                        this.update_customContactInfo();
                        this.save_visual('contact_information');
                    }
                })
            })
        }

        bindSaveActions() {
            this.bindSaveAction_payment();
            this.bindSaveAction_accountType();
            this.bindSaveAction_sellerDeliveryMethods();
            this.bindSaveAction_sellerNegotiable();
            this.bindSaveAction_contactInformation();
        }
    }
});