var data = [];
var time = new Date().getFullYear() + '-' + (new Date().getMonth() + 1) + "-" + new Date().getDate();

timeList();

$("#select").change(function(){
    getDate();
});

$("#tj").click(function(){
    $.ajax({
        url: 'http://localhost:8080/toDayTj',
        async: true,
        type: 'post',
        dataType: 'json',
        data: {data: data, time: $("#select ").val()},
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

$.ajax({
    url: 'https://mkapi.eastmoney.com/epidemic/api/getSummaryData',
    type: 'get',
    dataType: 'json',
    success: function(res){
        var qyd = '<div style="transition: margin-bottom 1s; margin-bottom="0px" id="yqDivSub"></div>';
        res.data.countryAddConfirmList.forEach((yq)=>{
            qyd = qyd + '<div>'+ yq.area +' 昨日确诊人数：' + yq.addConfirm + '</div>';
        });
        $("#yqDiv").append(qyd);
        setInterval(function(){
            if (Number($("#yqDivSub")[0].style.marginBottom.replace("px","")) - 1 === -435) {
                $("#yqDivSub")[0].style.marginBottom = "40px";
            } else {
                $("#yqDivSub")[0].style.marginBottom = (Number($("#yqDivSub")[0].style.marginBottom.replace("px","")) - 1).toString() + 'px';
            }
        },100);
    },
    error: function(err){
        console.log(err);
    },
    complete: function(XHR, TS){
        console.log(XHR);
    }
});


function timeList(){
    $.ajax({
        url: 'http://localhost:8080/allTime',
        async: true,
        type: 'get',
        dataType: 'json',
        success: function(res){
            console.log(res);
            var option = "";
            var value = "";
            res.forEach((t)=>{
                option = option + '<option value='+ t +' >' + t + '</option>';
                value = t;
            });
            $("#select").append(option);
            $("#select").val(value);
            getDate();
        },
        error: function(err){
            console.log(err);
        },
        complete: function(XHR, TS){

        }
    });
}

function getDate(){
    $.ajax({
        url: 'http://localhost:8080/timeDate/' + $("#select ").val(),
        async: true,
        type: 'get',
        dataType: 'json',
        success: function(res){
            data = res;
            if (data.data && data.data.length > 0) {
                var sjxs = 0;
                data.data.forEach((obj)=>{
                    if (obj.sj) {
                        sjxs = sjxs + Number(obj.sj);
                    }
                    
                    $("#bzlq").html(sjxs);
                });
                init();
            }
        },
        error: function(err){
            console.log(err);
        },
        complete: function(XHR, TS){

        }
    });
}

function init() {
    $("#rdSetting").empty();
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
    var sjxs = 0;
    data.data.forEach((obj)=>{
        if(obj.entity === td.html()){
            obj.sj = shtd;
            obj.bz = bz;
        }

        if (obj.sj) {
            sjxs =sjxs + Number(obj.sj);
        }
    });

    $("#bzlq").html(sjxs);
}