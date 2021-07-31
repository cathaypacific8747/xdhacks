$(document).ready(function() {
    $('[data-editfield="customContactInfo_text"]').characterCounter();
    
    fetch('/api/v1/user/detail', {
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
        user.bindEditActions();
        user.bindSaveActions();
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

        bindEditAction(section) {
            $(`[data-edit="${section}"]`).click(() => {
                $(`[data-section="${section}_display"]`).addClass('hide');
                $(`[data-edit="${section}"]`).addClass('hide');
                $(`[data-section="${section}_editor"]`).removeClass('hide');
                $(`[data-save="${section}"]`).removeClass('hide');
            });
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

        update_emailnotifications_edit() {
            $('[data-editfield="email_notifications"]').prop('checked', this.data.emailnotifications);
        }
        update_emailnotifications() {
            // rename negotiable class.
            if (this.data.emailnotifications) {
                $('[data-field="email_notifications"]').removeClass('not-negotiable').addClass('negotiable').html('check');
            } else {
                $('[data-field="email_notifications"]').removeClass('negotiable').addClass('not-negotiable').html('close');
            }
            this.update_emailnotifications_edit();
        }

        update_payment_edit() {
            const paymentInformations = ['cash', 'octopus', 'payme', 'tapngo', 'bankTransfer', 'eCheque', 'alipay', 'wechatPay'];
            for (let p of paymentInformations) {
                if (this.data[p]) {
                    $(`[data-editfield="${p}"]`).prop('checked', true);
                } else {
                    $(`[data-editfield="${p}"]`).prop('checked', false);
                }
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
            this.update_payment_edit();
        }

        update_sellerDeliveryMethods_edit() {
            $('[data-editfield="inSchoolExchange"]').prop('checked', this.data.inSchoolExchange);
            $('[data-editfield="meetup"]').prop('checked', this.data.meetup);
            $('[data-editfield="delivery"]').prop('checked', this.data.delivery);
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
            this.update_sellerDeliveryMethods_edit();
        }

        update_sellerNegotiable_edit() {
            $('[data-editfield="negotiable"]').prop('checked', this.data.negotiable);
        }
        update_sellerNegotiable() {
            if (this.data.negotiable) {
                $('[data-field="negotiable"]').removeClass('not-negotiable').addClass('negotiable').html('check');
            } else {
                $('[data-field="negotiable"]').removeClass('negotiable').addClass('not-negotiable').html('close');
            }
            this.update_sellerNegotiable_edit();
        }

        update_publicity_edit() {
            $('[data-editfield="public"]').prop('checked', this.data.public);
        }
        update_publicity() {
            if (this.data.public) {
                $('[data-field="public"]').html('Public');
                $('[data-field="public_icon"]').html('public').attr('data-tooltip', 'Everyone can see your information.');
            } else {
                $('[data-field="public"]').html('Private');
                $('[data-field="public_icon"]').html('lock').attr('data-tooltip', 'Only you can see the information.');
            }
            this.unhide_container('public_container');
            this.update_publicity_edit();
        }

        update_email() {
            if (this.data.email) {
                $('[data-field="email"]').html(this.data.email);
                this.unhide_container('email_container');
            } else {
                this.hide_container('email_container');
            }
        }

        update_discord_edit_text() {
            $('[data-editfield="discord_text"]').val(this.data.discord);
            M.updateTextFields();
            if ($('[data-editfield="discord"]').is(':checked')) {
                $('[data-editfieldgroup="discord"]').removeClass('hide');
            } else {
                $('[data-editfieldgroup="discord"]').addClass('hide');
            }
        }
        update_discord_edit() {
            $('[data-editfield="discord"]').prop('checked', Boolean(this.data.discord)).click(() => {
                this.update_discord_edit_text();
            });
            this.update_discord_edit_text();
        }
        update_discord() {
            if (this.data.discord) {
                $('[data-field="discord_icon"]').attr('src', '/static/img/contact/discord.png');
                $('[data-field="discord"]').html(this.data.discord);
                this.unhide_container('discord_container');
            } else {
                this.hide_container('discord_container');
            }
            this.update_discord_edit();
        }

        update_instagram_edit_text() {
            $('[data-editfield="instagram_text"]').val(this.data.instagram);
            M.updateTextFields();
            if ($('[data-editfield="instagram"]').is(':checked')) {
                $('[data-editfieldgroup="instagram"]').removeClass('hide');
            } else {
                $('[data-editfieldgroup="instagram"]').addClass('hide');
            }
        }
        update_instagram_edit() {
            $('[data-editfield="instagram"]').prop('checked', Boolean(this.data.instagram)).click(() => {
                this.update_instagram_edit_text();
            });
            this.update_instagram_edit_text();
        }
        update_instagram() {
            if (this.data.instagram) {
                $('[data-field="instagram_icon"]').attr('src', '/static/img/contact/instagram.png');
                $('[data-field="instagram"]').html(this.data.instagram);
                this.unhide_container('instagram_container');
            } else {
                this.hide_container('instagram_container');
            }
            this.update_instagram_edit();
        }

        update_phone_edit_text() {
            $('[data-editfield="phone_text"]').val(this.data.phone);
            M.updateTextFields();
            if ($('[data-editfield="phone"]').is(':checked')) {
                $('[data-editfieldgroup="phone"]').removeClass('hide');
            } else {
                $('[data-editfieldgroup="phone"]').addClass('hide');
            }
        }
        update_phone_edit() {
            $('[data-editfield="phone"]').prop('checked', Boolean(this.data.phone)).click(() => {
                this.update_phone_edit_text();
            });
            $('[data-editfield="whatsapp"]').prop('checked', this.data.whatsapp);
            $('[data-editfield="signal"]').prop('checked', this.data.signal);
            $('[data-editfield="telegram"]').prop('checked', this.data.telegram);
            this.update_phone_edit_text();
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
            this.update_phone_edit();
        }

        update_customContactInfo_edit_text() {
            $('[data-editfield="customContactInfo_text"]').val(this.data.customContactInfo);
            M.textareaAutoResize($('[data-editfield="customContactInfo_text"]'));
            if ($('[data-editfield="customContactInfo"]').is(':checked')) {
                $('[data-editfieldgroup="customContactInfo"]').removeClass('hide');
            } else {
                $('[data-editfieldgroup="customContactInfo"]').addClass('hide');
            }
        }
        update_customContactInfo_edit() {
            $('[data-editfield="customContactInfo"]').prop('checked', Boolean(this.data.customContactInfo)).click(() => {
                this.update_customContactInfo_edit_text();
            });
            this.update_customContactInfo_edit_text();
        }
        update_customContactInfo() {
            if (this.data.customContactInfo) {
                $('[data-field="customContactInfo"]').html(this.data.customContactInfo);
                this.unhide_container('customContactInfo_container');
            } else {
                this.hide_container('customContactInfo_container');
            }
            this.update_customContactInfo_edit();
        }

        populate() {
            this.update_profile();

            this.remove_loader('email_notifications_loader');
            this.update_emailnotifications();

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

        bindEditActions() {
            this.bindEditAction('email_notifications');
            this.bindEditAction('payment_information');
            this.bindEditAction('seller_delivery_methods');
            this.bindEditAction('seller_negotiable');
            this.bindEditAction('contact_information');
        }

        // savers
        async save_settings(updateData) {
            return await fetch('api/v1/user/update', {
                method: 'PATCH',
                mode: 'cors',
                headers: csrfprotect({
                    'Content-Type': 'application/json'
                }),
                body: JSON.stringify(updateData)
            }).then(response => {
                if (!response.ok) throw new NetworkError;
                return response.json();
            }).then(json => {
                if (json.status == 'success') {
                    toast({
                        description: json.message,
                        headerPrefix: '',
                        code: 1
                    });
                    return json.data;
                }
                throw new APIError(json);
            }).catch(error => {
                toastError(error);
                return null;
            });
        }

        save_visual(section) {
            $(`[data-section="${section}_editor"]`).addClass('hide');
            $(`[data-save="${section}"]`).addClass('hide');
            $(`[data-section="${section}_display"]`).removeClass('hide');
            $(`[data-edit="${section}"]`).removeClass('hide');
        }

        getInput_emailnotifications() {
            let input = {};
            input.emailnotifications = $('[data-editfield="email_notifications"]').is(':checked');
            return input;
        }
        bindSaveAction_emailnotifications() {
            $('[data-save="email_notifications"]').click(() => {
                const input = this.getInput_emailnotifications();
                this.save_settings(input).then(updatedData => {
                    if (updatedData) {
                        this.data = Object.assign(this.data, updatedData);
                        this.update_emailnotifications();
                        this.save_visual('email_notifications');
                    }
                });
            });
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
            $('[data-save="payment_information"]').click(() => {
                const input = this.getInput_payment();
                this.save_settings(input).then(updatedData => {
                    if (updatedData) {
                        this.data = Object.assign(this.data, updatedData);
                        this.update_payment();
                        this.save_visual('payment_information');
                    }
                });
            });
        }

        getInput_sellerDeliveryMethods() {
            let input = {};
            input.inSchoolExchange = $('[data-editfield="inSchoolExchange"]').is(':checked');
            input.meetup = $('[data-editfield="meetup"]').is(':checked');
            input.delivery = $('[data-editfield="delivery"]').is(':checked');
            return input;
        }
        bindSaveAction_sellerDeliveryMethods() {
            $('[data-save="seller_delivery_methods"]').click(() => {
                const input = this.getInput_sellerDeliveryMethods();
                this.save_settings(input).then(updatedData => {
                    if (updatedData) {
                        this.data = Object.assign(this.data, updatedData);
                        this.update_sellerDeliveryMethods();
                        this.save_visual('seller_delivery_methods');
                    }
                });
            });
        }

        getInput_sellerNegotiable() {
            let input = {};
            input.negotiable = $('[data-editfield="negotiable"]').is(':checked');
            return input;
        }
        bindSaveAction_sellerNegotiable() {
            $('[data-save="seller_negotiable"]').click(() => {
                const input = this.getInput_sellerNegotiable();
                this.save_settings(input).then(updatedData => {
                    if (updatedData) {
                        this.data = Object.assign(this.data, updatedData);
                        this.update_sellerNegotiable();
                        this.save_visual('seller_negotiable');
                    }
                });
            });
        }

        getInput_contactInformation() {
            let input = {};

            input.public = $('[data-editfield="public"]').is(':checked');
            input.discord = $('[data-editfield="discord"]').is(':checked') ? $('[data-editfield="discord_text"]').val() : '';
            input.instagram = $('[data-editfield="instagram"]').is(':checked') ? $('[data-editfield="instagram_text"]').val() : '';
            input.phone = $('[data-editfield="phone"]').is(':checked') ? $('[data-editfield="phone_text"]').val() : '';
            input.whatsapp = $('[data-editfield="whatsapp"]').is(':checked');
            input.signal = $('[data-editfield="signal"]').is(':checked');
            input.telegram = $('[data-editfield="telegram"]').is(':checked');
            input.customContactInfo = $('[data-editfield="customContactInfo"]').is(':checked') ? $('[data-editfield="customContactInfo_text"]').val() : '';

            return input;
        }
        bindSaveAction_contactInformation() {
            $('[data-save="contact_information"]').click(() => {
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
                });
            });
        }

        bindSaveActions() {
            this.bindSaveAction_emailnotifications();
            this.bindSaveAction_payment();
            this.bindSaveAction_sellerDeliveryMethods();
            this.bindSaveAction_sellerNegotiable();
            this.bindSaveAction_contactInformation();
        }
    }
});