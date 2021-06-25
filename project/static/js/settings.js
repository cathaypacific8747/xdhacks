fetch('api/v1/user/detail')
.then((response) => {
    if (response.ok) {
        return response.json()
    } else {
        throw new Error('An error occurred.')
    }
})  
.then(response => response.json())
.then(value => {
    console.log(value);
})  