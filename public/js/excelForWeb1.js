$("#todayTime").html(new Date().toLocaleDateString());
$("#tijiao").click(function(){
    $.ajax({
        url: 'http://localhost:8080/profile',
        async: true,
        type: 'post',
        dataType: 'json',
        data: {data: $("#nr").val(), time: $("#time").val(), zs: $("#zs").val()},
        success: function(res){
            
        },
        error: function(err){
            console.log(err);
        },
        complete: function(XHR, TS){
            if(XHR.responseText === 'OK'){
                window.location.href = 'http://localhost:8080/blog.html';
            }
        }
    });
});