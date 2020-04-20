var data = [];
var time = new Date().getFullYear() + '-' + (new Date().getMonth() + 1) + "-" + new Date().getDate();
getDate(time);

$("#tj").click(function(){
    $.ajax({
        url: 'http://localhost:8080/toDayTj',
        async: true,
        type: 'post',
        dataType: 'json',
        data: {data: data, time: time},
        success: function(res){
            
        },
        error: function(err){
            console.log(err);
        },
        complete: function(XHR, TS){
            if(XHR.responseText === 'OK'){
                alert('提交成功！')
            }
        }
    });
});

function getDate(time){
    $.ajax({
        url: 'http://localhost:8080/timeDate/' + time,
        async: true,
        type: 'get',
        dataType: 'json',
        success: function(res){
            data = res;
            init();
        },
        error: function(err){
            console.log(err);
        },
        complete: function(XHR, TS){

        }
    });
}

function init() {
    var td = '';
    data.data.forEach((obj, i)=>{
        td = td + "<tr>";
        var color = 'unset';
        if (!obj.sj) {
            obj.sj = '';
        }
        if (!obj.bz) {
            obj.bz = '';
        }
        if (Number(obj.numberOfMasksReceived) === 0 && obj.sj === '') {
            obj.sj = 0;
            color = '#0080007a';
        }
        if(obj.sj && obj.sj !== '' && obj.bz && obj.bz !== '') {
            color = '#ff000080';
        } else if(obj.sj && obj.sj !== ''){
            color = '#0080007a';
        }
        if (obj.entity) {
            td = td + '<td class="y-td" style="background: '+ color +'">' + obj.entity + '</td><td class="y-td" style="background: '+ color +'">' + obj.city + '</td><td class="y-td" style="background: '+ color +'">' + obj.numberOfMasksReceived;
            td = td + '</td><td class="y-td rlsj" style="background: '+ color +'">'+ obj.sj +'</td><td class="y-td" style="background: '+ color +'">'+ obj.bz +'</td>'
        }
        td = td + "</tr>";
    });

    $("#rdSetting").append(td);
    dasdsa();
}

function dasdsa(){
    $(".rlsj").dblclick((e)=>{
        var v = $(e.target).html();
        $(e.target).html('');
        $(e.target).append('<input class="rlsjInput" style="width:100%" type="number" value="'+ v +'"/>');
        var td = $(e.target);
        $(".rlsjInput").focus();
        $(".rlsjInput").blur(function(e){
            var value = $(e.target).val();
            td.empty();
            td.html(value);
            checkNum(td);
        });
        $(".rlsjInput").keydown(function(e){
            if(e.which === 13){
                var value = $(e.target).val();
                td.empty();
                td.html(value);
                checkNum(td);
            }
        });
    });
}

function checkNum(td){
    var tdlist = $(td).parent().children();
    if (td.html() !== '' && Number(td.html()) > Number($(tdlist[2]).html())) {
        for(var i = 0; i < tdlist.length; i++){
            $(tdlist[i])[0].style.background="#ff000080";
        }
        $(tdlist[4]).html('超出领取：' + (Number(td.html()) - Number($(tdlist[2]).html())).toString());
    } else if (td.html() !== '' && Number(td.html()) === Number($(tdlist[2]).html())) {
        for(var i = 0; i < tdlist.length; i++){
            $(tdlist[i])[0].style.background="#0080007a";
        }
        $(tdlist[4]).html('');
    } else {
        for(var i = 0; i < tdlist.length; i++){
            $(tdlist[i])[0].style.background="unset";
        }
        $(tdlist[4]).html('');
    }
    dataSet($(tdlist[0]), Number(td.html()), $(tdlist[4]).html());
}

function dataSet(td,shtd, bz){
    data.data.forEach((obj)=>{
        if(obj.entity === td.html()){
            obj.sj = shtd;
            obj.bz = bz;
        }
    });
}