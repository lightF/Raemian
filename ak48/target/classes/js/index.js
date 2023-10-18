var calendar;
$(document).on('click', '.fc-icon-chevron-right, .fc-icon-chevron-left', function(){
	days_list(dayjs(calendar.getDate() ).format('YYYY-MM')+'-01', dayjs(calendar.getDate() ).endOf('month').format('YYYY-MM-DD'));
});

document.addEventListener("DOMContentLoaded", function () {
	register_chart();	
	worker_list();
    //chart391('/js/json','myChart',0)
    var data = {}
    data.url = '/report/chart';
    data.id = 'myChart';
    data.type = 0;
    data.padding = 10;
    data.font_size = 12;
    data.show_yn = 1;
    data.legend_view = true;
    data.anchor_padding = 4;
    data.anchor = 'end';
    //중단 차트
    chart391(data);
    //중단 달력
	days_list(dayjs().format('YYYY-MM')+'-01', dayjs().endOf('month').format('YYYY-MM-DD'));
    //하단 테이블
	worker_list();
});



//등록 건수 통계
function register_chart(){
	var num_tmp = new Array();
	$.ajax({
		url: contextPath + '/register/chart',
		type: 'post',
		dataType: 'json',
		success: function(data) {
			if(data.code = 1){
				if(data.result.length > 0) {
					num_tmp.push( data.result[0].value1 );
					num_tmp.push( data.result[0].value2 );
					num_tmp.push( data.result[0].value3 );
					num_tmp.push( data.result[0].value4 );
					num_tmp.push( data.result[1].value1 );
					num_tmp.push( data.result[1].value2 );
					num_tmp.push( data.result[1].value3 );
					num_tmp.push( data.result[1].value4 );
				}
			}
		}, complete: function(){
			//상단 숫자 표사
			animate_num(num_tmp[0], 1500, '.count_num');//종료숫자, 최대치 도달속도, 쿼리셀렉터
			animate_num(num_tmp[1], 1500, '.count_num1');
			animate_num(num_tmp[2], 1500, '.count_num2');
			animate_num(num_tmp[3], 1500, '.count_num3');
			animate_num(num_tmp[4], 1500, '.count_num4');
			animate_num(num_tmp[5], 1500, '.count_num5');
			animate_num(num_tmp[6], 1500, '.count_num6');
			animate_num(num_tmp[7], 1500, '.count_num7');
		}
	});
}
//근무일정
function days_list(start_date, end_date){
	var events = new Array();
	$.ajax({
		url: contextPath + '/days/list',
		type: 'post',
		dataType: 'json',
		data: { start_date : start_date, end_date: end_date},
		success: function(data) {
			if(data.code = 1){
				for(var i=0;i<data.result.length;i++) {
				events.push( {
	                display: 'background',
		            title: String(data.result[i].cnt),
			        start: date2(data.result[i].date)
			        });
				}
			if(!calendar) calendar2( events );
			else if(calendar) calendar.addEvent(events );
			}
		}, complete: function(){
			
		}
	});
}
//근무자 통계
function worker_list(){
	var num_tmp = new Array();
	$.ajax({
		url: contextPath + '/worker/list',
		type: 'post',
		dataType: 'json',
		success: function(data) {
			if(data.code = 1){
				if(data.result.length > 0) {
					num_tmp.push( data.result[0].value1 );
					num_tmp.push( data.result[0].value2 );
					num_tmp.push( data.result[0].value3 );
					num_tmp.push( data.result[0].value4 );
					num_tmp.push( data.result[1].value1 );
					num_tmp.push( data.result[1].value2 );
					num_tmp.push( data.result[1].value3 );
					num_tmp.push( data.result[1].value4 );
				}
			}
		}, complete: function(){
            animate_num(num_tmp[0], 1500, '.today_call')//종료숫자, 최대치 도달속도, 쿼리셀렉터
            animate_num(num_tmp[1], 1500, '.today_work')//종료숫자, 최대치 도달속도, 쿼리셀렉터
            animate_num(num_tmp[2], 1500, '.today_drive')//종료숫자, 최대치 도달속도, 쿼리셀렉터
            animate_num(num_tmp[3], 1500, '.today_total')//종료숫자, 최대치 도달속도, 쿼리셀렉터

            animate_num(num_tmp[4], 1500, '.month_call')//종료숫자, 최대치 도달속도, 쿼리셀렉터
            animate_num(num_tmp[5], 1500, '.month_work')//종료숫자, 최대치 도달속도, 쿼리셀렉터
            animate_num(num_tmp[6], 1500, '.month_drive')//종료숫자, 최대치 도달속도, 쿼리셀렉터
            animate_num(num_tmp[7], 1500, '.month_total')//종료숫자, 최대치 도달속도, 쿼리셀렉터
		}
	});
}

function animate_num(end, drt, selector) {
    if (selector != undefined) {
        if (end != undefined) { var end_num = end } else { var end_num = 0 }
        if (drt != undefined) { var drt_num = drt } else { var drt_num = 1000 }
        $({ val: 0/*시작숫자*/ }).animate({ val: end_num/*종료숫자*/ }, {
            duration: drt_num,
            step: function () {
                var num = number_format(Math.floor(this.val));
                document.querySelector(selector).innerHTML = num;
                //$(".count_num").text(num);
            },
            complete: function () {
                var num = number_format(Math.floor(this.val));
                document.querySelector(selector).innerHTML = num;
            }
        });
    }

}

//var data = {} 안에 인자값 넣어서 전달
//url 서비스 url   *필수값
//id = 엘리먼트 id,  *필수값
/*type  *필수값
    7 = 선형
    1 = 막대형
    2 = 레이더형
    3 = 파이
    4 = 도넛
    5 = 비균형 원형차트
    6 = 버블형
*/
//padding = int 그래프 영역 패딩
//labels = [] 없으면 데이터 result item
//label_d = [] 없으면 빈값
//backgroundColor [] 2중배열
//borderColor []
//borderWidth int  선 굵기
//hover_text = color 마우스 올릴시 상세보기
//font_size int
//show_yn tick 위에 숫자 표시 1 = 표시
//anchor tick 위에 숫자 표시  'end' = 위 , 'start' = 아래 defult = 1
//format = 표시 단위 string ex ) '인','회','원'
//legend_view 범례  = true, false  / default false 
//anchor_padding int tick 숫자 패딩
//xgrid = x축 격자 true ,false
//ygrid = y축 격자 true ,false
//fill = 영역 색 채움 ture , false
//snake = 곡선차트 생성 값 0~1.0 사이 입력
function chart391(data) {
    var url = data.url;
    var id = data.id;
    var type = data.type;
    var padding = data.padding;
    var labels_d = data.labels_d;
    var label_d = data.label_d;
    var backgroundColor = data.backgroundColor;
    var borderColor = data.borderColor;
    var borderWidth = data.borderWidth;
    var hover_text = data.hover_text;
    var font_size = data.font_size;
    var show_yn = data.show_yn;
    var anchor = data.anchor;
    var format = data.format;
    var legend_view = data.legend_view;
    var anchor_padding = data.anchor_padding;
    if (data.xgrid == undefined) { var xgrid = true } else { var xgrid = data.xgrid; }
    if (data.ygrid == undefined) { var ygrid = true } else { var ygrid = data.ygrid; }
    if (data.fill == undefined) { var fill = false } else { var fill = data.fill; }
    if (data.snake == undefined) { var snake = 0 } else { var snake = data.snake; }
    var ctx = document.querySelector('#' + id).getContext("2d");
    var chart_data = {}
    switch (Number(type)) {
        case 0:
            var type_str = 'line';
            break;
        case 1:
            var type_str = 'bar';
            break;
        case 2:
            var type_str = 'radar';
            break;
        case 3:
            var type_str = 'pie';
            break;
        case 4:
            var type_str = 'doughnut';
            break;
        case 5:
            var type_str = 'polarArea';
            break;
        case 6:
            var type_str = 'bubble';
            break;
        default:
            var type_str = 'line';
            break;
    }
    var default_color = [
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)',
        'rgba(153, 102, 200, 1)',
        'rgba(255, 159, 64, 1)'
    ];
    $.ajax({
        type: 'get',
        url: contextPath + url,
        dataType: 'json',
        success: function (data_json) {
            if (data_json.code == 1 && data_json.result[0].length > 0) {
                chart_data.type = type_str;
                chart_data.data = {};
                chart_data.data.datasets = [];

                if (labels_d != undefined && labels_d.length > 0) { chart_data.data.labels = labels_d } else { chart_data.data.labels = [] }

                var chart_value1 = {};
                chart_value1.datalabels = {}
                if (label_d != '' && label_d != undefined && label_d[0] != undefined) { chart_value1.label = label_d[0] } else { chart_value1.label = '고장접수' }
                if (backgroundColor != '' && backgroundColor != undefined && backgroundColor[0] != undefined) { chart_value1.backgroundColor = backgroundColor[0] } else { chart_value1.backgroundColor = default_color }
                if (borderColor != '' && borderColor != undefined && borderColor[0] != undefined) { chart_value1.borderColor = borderColor[0] } else { chart_value1.borderColor = default_color }
                if (borderWidth != '' && borderWidth != undefined) { chart_value1.borderWidth = borderWidth } else { chart_value1.borderWidth = 1 }
                if (hover_text != '' && hover_text != undefined) { chart_value1.datalabels.color = hover_text } else { chart_value1.datalabels.color = 'white' }
                if (font_size != '' && font_size != undefined) { chart_value1.datalabels.font = { size: font_size } } else { chart_value1.datalabels.font = { size: 12 } }
                if (anchor.toString() != 'end' && anchor.toString() != 'start') { } else { chart_value1.datalabels.align = anchor; chart_value1.datalabels.anchor = anchor }
                chart_value1.datalabels.formatter = function (value, context) {
                    // data 에 넣은 데이타 순번. 물론 0 부터 시작
                    var idx = context.dataIndex;

                    // 여기선 첫번째 데이타엔 단위를 '원' 으로, 그 다음 데이타엔 'P' 를 사용
                    // number_format() 는 여기서 기술하지 않았지만, 천단위 세팅. ChartJS 의 data 엔 숫자만 입력
                    //천단위 콤마
                    function number_format_chart(x) {
                        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                    }
                    if (format == undefined) {
                        return number_format_chart(value);
                    } else {
                        return number_format_chart(value) + format;
                    }
                    //return context.chart.data.labels[idx] + ' ' + number_format_chart(value) + (idx == 0 ? '원' : 'P');
                }
                chart_value1.data = []
                for (var i = 0; i < data_json.result[0].length; i++) {
                    var dt = data_json.result[0][i];

                    if (dt.value != undefined && dt.value != '') { chart_value1.data.push(dt.value) } else { chart_value1.data.push(0) }
                    if (!labels_d) { if (dt.item != undefined) { chart_data.data.labels.push(dt.item) } else { chart_data.data.labels.push((i + 1)) } }
                }
                chart_data.data.datasets.push(chart_value1)



                ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                //추가 비교 데이터가 있을 경우 
                if (data_json.result[1]) {
                    var chart_value1 = {};
                    chart_value1.datalabels = {}
                    if (label_d != '' && label_d != undefined && label_d[1] != undefined) { chart_value1.label = label_d[1] } else { chart_value1.label = '고장조치' }
                    if (backgroundColor != '' && backgroundColor != undefined && backgroundColor[1] != undefined) { chart_value1.backgroundColor = backgroundColor[1] } else { chart_value1.backgroundColor = default_color }
                    if (borderColor != '' && borderColor != undefined && borderColor[1] != undefined) { chart_value1.borderColor = borderColor[1] } else { chart_value1.borderColor = default_color }
                    if (anchor.toString() != 'end' && anchor.toString() != 'start') { } else { chart_value1.datalabels.align = anchor; chart_value1.datalabels.anchor = anchor }
                    chart_value1.data = []
                    for (var i = 0; i < data_json.result[1].length; i++) {
                        var dt = data_json.result[1][i];
                        if (dt.value != undefined && dt.value != '') { chart_value1.data.push(dt.value) } else { chart_value1.data.push(0) }
                    }
                    chart_data.data.datasets.push(chart_value1)
                }

                if (data_json.result[2]) {
                    var chart_value1 = {};
                    chart_value1.datalabels = {}
                    if (label_d != '' && label_d != undefined && label_d[2] != undefined) { chart_value1.label = label_d[2] } else { chart_value1.label = 'chart3' }
                    if (backgroundColor != '' && backgroundColor != undefined && backgroundColor[2] != undefined) { chart_value1.backgroundColor = backgroundColor[2] } else { chart_value1.backgroundColor = default_color }
                    if (borderColor != '' && borderColor != undefined && borderColor[2] != undefined) { chart_value1.borderColor = borderColor[2] } else { chart_value1.borderColor = default_color }
                    if (anchor.toString() != 'end' && anchor.toString() != 'start') { } else { chart_value1.datalabels.align = anchor; chart_value1.datalabels.anchor = anchor }
                    chart_value1.data = []
                    for (var i = 0; i < data_json.result[2].length; i++) {
                        var dt = data_json.result[2][i];
                        if (dt.value != undefined && dt.value != '') { chart_value1.data.push(dt.value) } else { chart_value1.data.push(0) }
                    }
                    chart_data.data.datasets.push(chart_value1)
                }







                ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                //공통 옵션 설정
                if (show_yn == 1) { chart_data.plugins = [ChartDataLabels] }
                if (legend_view) { var legend_viewd = legend_view } else { var legend_viewd = false }
                chart_data.options = {
                    elements: {
                        line: {
                            //활성화 하면 그래프 영역이 색깔채움됨
                            fill: fill,
                            tension: snake
                        }
                    },
                    scales: {
                        x: {
                            grid: {
                                display: xgrid,
                            }
                        },
                        y: {
                            grid: {
                                display: ygrid,
                                stacked: true
                            }
                        }
                    },
                    tooltips: {
                        callbacks: {
                            label: function (tooltipItem) {
                                return tooltipItem.yLabel;
                            }
                        }
                    },
                    plugins: {
                        //label(상단 제목 감추고 싶으면 legend false)
                        legend: legend_viewd, // Hide legend
                        datalabels: {
                            //데이터 라벨 백그라운드 설정 
                            backgroundColor: function (context) {
                                return context.dataset.backgroundColor;
                            },
                            borderRadius: 4,
                            color: 'white',
                            font: {
                                weight: 'bold'
                            },
                            formatter: Math.round,
                            padding: anchor_padding
                        }

                    },
                    layout: {
                        padding: padding
                    },


                }
            }

        }, complete: function () {
            new Chart(ctx, chart_data)
        }
    });


}




//달력
function calendar2(events) {
    var calendarEl = document.getElementById('calendar');

    calendar = new FullCalendar.Calendar(calendarEl, {
        headerToolbar: {
            left: 'prev',
            center: 'title',
            right: 'next'
        },
        locale: 'ko',

        eventDidMount: function (info) {
//            var tooltip = new tippy(info.el.closest('td'), {
//                content: "임원빈이 만듫었음!",
//            });
        },
        eventClick: function(info) {
            location.href = contextPath + '/work_management?date='+info.dateStr;
        },
        dateClick: function(info) {
            location.href = contextPath + '/work_management?date='+info.dateStr;
        },
        events: events,
		isLoading: function(info) {
			//alert(1);

		}
        
    });
    calendar.render();







    // var calendarEl = document.getElementById('calendar');
    // var calendar = new FullCalendar.Calendar(calendarEl, {
    //     //	initialView: 'dayGridDay',
    //     headerToolbar: {
    //         left: 'prev',
    //         center: 'title',
    //         right: 'next'
    //     },


    //     locale: 'ko',
    //     //	dayMaxEvents: true,

    //     // 이벤트
    //     events: function (info, successCallback, failureCallback) {


    //     }
    // });
    // calendar.render();
}


