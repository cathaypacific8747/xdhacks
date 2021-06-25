$('#signinButton').click(() => {
    window.location.href = `login_google?token=${csrftoken}`;
})