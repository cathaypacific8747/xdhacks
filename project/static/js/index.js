function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function move(counter) {
    $('#bookL').css("transform", `translate(${counter % 2 ? 350 : -100}%, 0)`);
    $('#bookR').css("transform", `translate(${counter % 2 ? -100 : 350}%, 0)`);
}

$('#introName').css("opacity", 1)
setTimeout(function() {
    $('#introDesc').css("opacity", 1)
}, 500)

setTimeout(function() {
    let counter = 1;
    move(counter);
    setInterval(function() {
        move(++counter);
    }, 10500)
    
    setInterval(function() {
        $('#bookL').attr("src", `/static/img/index/${getRndInteger(1, 17)}.png`);
    }, getRndInteger(1500, 2000))
    
    setInterval(function() {
        $('#bookR').attr("src", `/static/img/index/${getRndInteger(1, 17)}.png`);
    }, getRndInteger(1500, 2000))
}, 1500)