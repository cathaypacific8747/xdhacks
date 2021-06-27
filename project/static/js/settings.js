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
        populate(result["data"]);
    })
    .catch((error) => {
        console.error(error); 
    });
    
    function populate(data) {
        $('[data-field="profilePic"]').attr("src", `${data["profilePic"]}=s172-c`).parent().removeClass("shimmerBG")
        $('[data-field="name"]').html(data["name"]).removeClass("shimmerBG")
        $('[data-field="email"]').html(data["email"]).removeClass("shimmerBG")
        if (data["cky"]) {
            $('[data-field="cky"]').attr("data-tooltip", "This user is a verified CKY student.").html("verified").addClass("verified")
        } else {
            $('[data-field="cky"]').attr("data-tooltip", "This user may not be a CKY student.").html("warning").addClass("unverified")
        }
    }
});