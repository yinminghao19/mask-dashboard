var data = {};
$.ajax({
    url: 'http://localhost:8080/all',
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
        console.log(XHR);
    }
});

function init(){
    $("#masterCount").html(data.masterCount);
    $("#numberOfRecipients").html(data.numberOfRecipients);
    $("#numberOfLibraries").html(data.numberOfLibraries);

    var myChart = echarts.init(document.getElementById('shieldui-chart2'));
    var option = {
        tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
            orient: 'vertical',
            left: 'left',
            data: ['总领取数', '领取数', '在库数']
        },
        series: [
            {
                name: '访问来源',
                type: 'pie',
                radius: '55%',
                center: ['50%', '60%'],
                data: [
                    {value: data.masterCount, name: '总领取数'},
                    {value: data.numberOfRecipients, name: '领取数'},
                    {value: data.numberOfLibraries, name: '在库数'}
                ],
                emphasis: {
                    itemStyle: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }
            }
        ]
    };

    myChart.setOption(option);
    tableSetting();
}


function tableSetting(){
    var th = '<tr><th class="y-th">项目</th>';
    var td = '';

    data.allList.forEach((all)=>{
        var hj = 0;
        td = td + '<tr>';
        td = td + '<td class="y-td">'+all.entityName+'</td>';
        data.timeList.forEach((time)=>{
            td = td + '<td class="y-td">'+all[time]+'</td>';
            hj = hj + all[time];
        });
        td = td + '<td class="y-td">'+hj+'</td>'
        td = td + '</tr>';
    });
    $("#rdSetting").append(td);

    data.timeList.forEach((time)=>{
        th = th + '<th class="y-th">' + time +'</th>';
    });
    th = th + '<th class="y-th">合计</th></tr>';
    $("#thSetting").append(th);


}