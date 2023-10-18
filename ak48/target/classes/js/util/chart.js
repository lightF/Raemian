//d3차트 ajax통신이후 item, value형식으로 다시
function chart(ele, data, type, color, dateformat, direction, textyn, margin_tmp, text) {
	var margin = {left: 0, top: 0, right: 0, bottom: 0};
	if(margin_tmp) margin = margin_tmp;
	d3.select(ele +' > svg').remove();//초기화
	if(!color) color = ['#fd7f6f', '#7eb0d5', '#b2e061', '#bd7ebe', '#ffb55a', '#ffee65', '#beb9db', '#fdcce5', '#8bd3c7', '#ea5545', '#f46a9b', '#ef9b20', '#edbf33', '#ede15b', '#bdcf32', '#87bc45', '#27aeef', '#b33dc6', '#fd7f6f', '#7eb0d5', '#b2e061', '#bd7ebe', '#ffb55a', '#ffee65', '#beb9db', '#fdcce5', '#8bd3c7', '#ea5545', '#f46a9b', '#ef9b20', '#edbf33', '#ede15b', '#bdcf32', '#87bc45', '#27aeef', '#b33dc6'];
	var svg = d3.select(ele).append('svg').attr('width', $( ele ).width() ).attr('height', $( ele ).height() );
	var width  = $( ele ).width() - margin.left - margin.right;
	var height = $( ele ).height() - margin.top  - margin.bottom;	
	
	var svgG = svg.append('g').attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

	//최대값 임시값
	var valuemax_tmp = [];
	//item 배열로 변경
	var item = [];
	var data2 = [];
	var total_cnt = 0;
	var data3 = {result: []};

	data3.result[0] = data.result;
	data.result = data3.result;

	if(direction == '') direction = 'left';

	//label 중복제거
	for(var i=0;i<data.result.length;i++) {
	
		for(var j=0;j<data.result[i].length;j++) {
			data2[j] = new Array();
			for(var k=0;k<data.result[i][j].length;k++) {
				item.push(data.result[i][j][k].item);
				valuemax_tmp.push(  data.result[i][j][k].value  );
				total_cnt +=  data.result[i][j][k].value;
				data2[j].push({ x: data.result[i][j][k].item, y:  data.result[i][j][k].value });
			}
		}
	}
	//ydomain 최대값
	var valuemax = Math.ceil(Math.max.apply(null, valuemax_tmp) / 100) * 100;
	if (valuemax > 1000) valuemax = Math.ceil(Math.max.apply(null, valuemax_tmp) / 1000) * 1000;	

	svgG.selectAll('text').attr('fill', '#555').style('font-size', '1.4em').attr('alignment-baseline','middle');

		switch(type){
			case 1:
				var xScale = d3.scaleBand().domain(item).padding([0.2]).range([0, width]);
				//var yScale = d3.scaleLinear().domain([0, valuemax]).rangeRound([height - 16, 8]);
				var yScale = d3.scaleLinear().domain([0, valuemax]).nice().range([height+1, 0]);

				var x = d3.scaleBand().range([ 0, height]);

				//var y = d3.scaleLinear().domain([0, valuemax]);
				var y = d3.scaleLinear().domain([0, 100]);

				svgG.append('g').attr('class', 'xgrid').attr('transform', 'translate(0,' + height + ')').call(make_x_gridlines().tickSize(-height).tickPadding(10)).style('stroke', '#b1b4b4'); // 여기서 수정
				svgG.append('g').attr('class', 'ygrid').call(make_y_gridlines().tickSize(-width).ticks(5).tickPadding(5)).style('stroke', '#c1c1c1'); // 여기서 수정

				svgG.select('.xgrid')
					.selectAll('.tick line')
					.attr('class', 'axis_bar')
					.attr('stroke', 'none');
			
				svgG.select('.xgrid')
					.selectAll('.domain')
					.attr('stroke', '#fff');

				svgG.select('.ygrid')
					.selectAll('.tick line')
					.attr('class', 'axis_bar')
					.attr('stroke', '#efefef');

				svgG.select('.ygrid')
					.selectAll('.domain')
					.attr('stroke', '#fff');

				var bar_width = Math.round(Math.round(width / ( data.result.length * item.length)));

				var xbar = d3.scaleBand()
					.range([0, width])
					.domain(data2[0]
					.map(function(d) { return d.x; }));

				var ybar = d3.scaleLinear()
					.range([0, height])
					.domain([0, valuemax]);

				//bar 위치 계산
				var bar_totalwidth = Math.round(bar_width * data2.length / 2);
				for(i=0;i<data2.length;i++) {
					var bar_padding = 0;
					svgG
						.selectAll('myRect' + i)
						.data(data2[i])
						.enter()
						.append('rect')
						.attr('y', height)
						.attr('x', function(d) {
							if(i < 0) bar_padding = 2; else bar_padding = 0; return Math.floor(xScale(d.x) + Math.round(xScale.bandwidth() / data2.length) * i) + Math.floor(Math.ceil(xScale.bandwidth() / data2.length) /2 + bar_padding - 25)//20 좌표조정
						})
						.attr('height', 0 )
						.attr('fill', function(d, j) { if(data2.length > 1) return color[i]; else return color[j]; }) // function(d,i) d는 위에 선언한data, i는 돌릴 i
						.attr('width', function(d, i) { return Math.round(xScale.bandwidth() / data2.length) - 10; })
						//.attr('width', function(d, i) { return Math.round(40 / data2.length); })
						.transition()
						.duration(800)
						.attr('y', function(d) { return height - ybar(d.y); })
						.attr('height',function(d) { return ybar(d.y)+1; })

					if(textyn == 1)
						svgG
							.append('g')
							.selectAll('g')
							.data(data2[i])
							.enter()
							.append('text')
							.attr('class', 'below')
							.attr('font-weight', 'normal')
							//.attr('y', function(d) { if(d.y > valuemax / 2 ) return height - (ybar(d.y) - 5); else return height - (ybar(d.y) + 20); })
							.attr('y', function(d) { return height - (ybar(d.y) + 20); })
							.attr('x', function(d) { if(i < 0) bar_padding = 3; else bar_padding = 0; return Math.floor(xScale(d.x) + Math.round(xScale.bandwidth() / data2.length) * i) + Math.floor(Math.ceil(xScale.bandwidth() / data2.length)/2 + bar_padding - 1) } )
							.text( function(d) {return number_format(d.y);  } )
							.attr('dy', '0.8em')
							.attr('alignment-baseline','middle')
							.attr('text-anchor', 'middle')
							.style('fill', function(d) { if(d.y > valuemax / 2 ) return '#222'; else return '#000'; })
							.transition()
							.delay(850)
							.text( function(d) { return $.number(d.y); } );
						
						//text 조정
						svgG.select('.xgrid')
							.attr('font-family', 'Gulim')
							.selectAll('.tick')
							.attr('font-weight', 'normal')
							.select('text')
							.attr('font-weight', 'normal')
							.attr('stroke', '#666')
							.attr('fill', '');
						svgG.select('.ygrid')
							.attr('font-family', 'Gulim')
							.selectAll('.tick')
							.attr('font-weight', 'normal')
							.select('text')
							.attr('font-weight', 'normal')
							.attr('stroke', '#666')
							.attr('fill', '');
				}
			break;
		case 2://1 - 세로  바차트
			var xScale = d3.scaleLinear().domain([0, valuemax]).range([margin.left, width-margin.right]);
			var yScale = d3.scaleBand().domain(item).padding([0.2]).range([margin.top, height]);
			var x = d3.scaleLinear().domain([margin.left, width-margin.right]);
			var y = d3.scaleBand().range([margin.top, height]);
			//ygrid 총길이

			svgG.append('g')
				.attr('class', 'xgrid')
				.call(make_x_gridlines()
				.tickSize(height)
				.tickPadding(5))
				.style('stroke', '#b1b4b4'); // 여기서 수정

				svgG.select('.xgrid')
					.selectAll('.tick line')
					.attr('class', 'axis_bar')
					.attr('stroke', 'none');
				
				svgG.select('.xgrid')
					.selectAll('.domain')
					.attr('stroke', '#fff');


			svgG.append('g')
				.attr('class', 'ygrid')
				.call(make_y_gridlines()
				.tickSize(-width)
				.ticks(4)
				.tickPadding(5))
				.style('stroke', '#c1c1c1'); // 여기서 수정

				svgG.select('.ygrid')
					.selectAll('.tick line')
					.attr('class', 'axis_bar')
					.attr('stroke', '#efefef');

				svgG.select('.ygrid')
					.selectAll('.domain')
					.attr('stroke', '#fff');


			var bar_height = Math.round(Math.round(height / ( data2.length * item.length)) - ( 5* data2.length));
			
			var bar_totalheight = Math.round(bar_height * data2.length);
			var xbar = d3.scaleLinear().range([0, width]).domain([0, valuemax]);
			var ybar = d3.scaleBand().range([50, height - margin.bottom]).domain(item).padding(0);
			var total = 0;
				for(var i = 0; i<data2[0].length; i++){
					total += data2[0][i].y;
				}
			var k = 0;

			for(i=0;i<data2.length;i++) {
				var bar_padding = 0;
				var bar_center = Math.round(bar_height / 2) - 5;
				
					svgG
						.selectAll('myRect' + i)
						.data(data2[i])
						.enter()
						.append('rect')
						.attr('y', function(d) { return yScale(d.x) + Math.round((bar_height + 1) * i)   } )
						.attr('x', 0)
						.attr('height', bar_height)
						.attr('fill', function(d,i) { return color[i] }) // function(d,i) d는 위에 선언한data, i는 돌릴 i
						.attr('width', 0)
						.transition()
						.duration(800)
						.attr('width', function(d) { return xbar(d.y); });
		
				if(textyn == 1)
					svgG
						.append('g')
						.selectAll('g')
						.data(data2[i])
						.enter()
						.append('text')
						.attr('class', 'below')
						.attr('x',function(d) {  if(d.y > valuemax / 2 ) return xbar(d.y) - 10; else return xbar(d.y) +10; })
						.attr('y', function(d) { return yScale(d.x) - 3 + Math.floor((bar_height + 1 ) * i) + bar_center  })
						.attr('dy', '1.2em')
						.attr('alignment-baseline','middle')
						.attr('text-anchor', function(d) {  if(d.y > valuemax / 2 ) return 'end'; else return 'start' })
						.style('fill', function(d) { if(d.y > valuemax / 2 ) return '#fff'; else return '#000'; })
						.transition()
						.delay(850)
						.text( function(d) { return Math.round((d.y / total) * 100)+"%"; } );
				}
			
		break;
		case 3:
		case 4:
		case 7://line + dot
			if(data2.length == 0) {
				$('#'+id).html("<div style='text-align:center;line-height:250px'>데이터가 없습니다.</div>");
			}else{
			//var xScale = d3.scaleBand().domain(item).rangeRound([0, width]);
			var yScale = d3.scaleLinear().domain([0, valuemax]).nice().rangeRound([height, 0]);
			var xScale = d3.scalePoint().domain(item).padding([0.1]).rangeRound([0, width]);

			svgG.append('g')
				.attr('class', 'xgrid')
				.attr('transform', 'translate(0,' + (height) + ')')
				.call(make_x_gridlines()
				.tickSize(-height)
				.tickPadding(10))
				.style('stroke', '#b1b4b4'); // 여기서 수정

				svgG.select('.xgrid')
					.selectAll('.tick line')
					.attr('class', 'axis_bar')
					.attr('stroke', 'none');
				svgG.select('.xgrid')
					.selectAll('.domain')
					.attr('stroke', '#fff');


/*.call(g => g.selectAll('.tick line')
		.attr('class', 'axis_bar')
		.attr('stroke', 'none'))
	.call(g => g.selectAll('.tick text')
		.attr('fill', 'none'))
	.call(g => g.selectAll('g.tick:nth-child('+sc+'n)').select('line')
		.attr('class', 'axis_bar')
		.attr('stroke', '#686868'))
	.call(g => g.selectAll('.tick:nth-child('+sc+'n -8) text')
		.attr('fill', 'rgba(255, 255, 255, 0.8)'))
	.call( g => g.selectAll('g.tick').attr('data-y', function(d) { return String(d);}) );
*/
		var ticks = 10;
		if(height < 300) ticks = 5;
			svgG.append('g')
				.attr('class', 'ygrid')
				.call(make_y_gridlines()
				.tickSize(-width)
				.ticks(ticks)
				.tickPadding(10))
				.style('stroke', '#c1c1c1'); // 여기서 수정

				svgG.select('.ygrid')
					.selectAll('.tick line')
					.attr('class', 'axis_bar')
					.attr('stroke', '#efefef');
				
				svgG.select('.ygrid')
					.selectAll('.domain')
					.attr('stroke', '#fff');

			
			var line = d3.line().x(function(d) {return xScale(d.x);}).y(function(d) { return yScale(d.y); });
			if(type == 4) line.curve(d3.curveLinear);//곡선

			var lineG = svgG.append('g').selectAll('g').data(data2).enter().append('g');
			var path =  lineG.append('path').attr('class', 'lineChart').attr('fill','none').attr('stroke-width', '2').style('stroke', function(d, i) { return color[i]; }).attr('d', line);

			var totalLength = path.node().getTotalLength();
			path.attr('stroke-dasharray', function(d) {return this.getTotalLength()}).attr('stroke-dashoffset', totalLength).transition().duration(700).ease(d3.easeSin).attr('stroke-dashoffset', 0);

			for(var i =0;i<data2.length;i++) {

				lineG.selectAll('linetext')
					.data(data2[i])
					.enter()
					.append('text')
					.attr('fill', '#666')
					.attr('x', function(d) { return  xScale(d.x)})
					.attr('y', function(d) { return yScale(d.y) - 8;} )
					.attr('text-anchor', 'middle')
					.style('font-size', '1em')
					.style('stroke-width', '1')
					.transition()
					.delay(850)
					.text( function(d) { if(textyn == 1) return number_format(d.y) } );
			if(type==7) 
				lineG.selectAll('linedot')
					.data(data2[i])
					.enter()
					.append('circle')
					.attr('fill', color[i])
					.attr('stroke', 'none')
					.attr('cx', function(d) { return xScale(d.x) })
					.attr('cy', function(d) {return yScale(d.y) })
					.attr('r', 3);
			}
			}
		break;
		case 5:
			var xScale = d3.scaleBand().domain(item).range([0, width]);
			var yScale = d3.scaleLinear().domain([0, valuemax]).rangeRound([height - 16, 8]);
			var x = d3.scaleBand().range([ 0, height]);
			var y = d3.scaleLinear().domain([0, valuemax]);
			svgG.append('g').attr('class', 'xgrid').attr('transform', 'translate(0,' + height + ')').call(make_x_gridlines().tickSize(-height).tickPadding(10));
			svgG.append('g').attr('class', 'ygrid').call(make_y_gridlines().tickSize(-width).ticks(5).tickPadding(5));


			var bar_width = Math.round(Math.round(width / ((data2.length - 1) * item.length)));
			var xbar = d3.scaleBand().range([0, width]).domain(data2[0].map(function(d) { return d.x; }));
			var ybar = d3.scaleLinear().range([0, height]).domain([0, valuemax]);

			var line = d3.line().x(function(d) {return xScale(d.x) + Math.round(width / ((data2.length - 1) * item.length));}).y(function(d) { return yScale(d.y); });
			var lineG = svgG.append('g').selectAll('g').data(Array(data2[0])).enter().append('g');
			var path =  lineG.append('path').attr('class', 'lineChart').attr('d', function(d) { return line(d); }).attr('stroke-width', '2').style('stroke', function(d, i) { return color[0]; }).attr('fill','none') ;

			var totalLength = path.node().getTotalLength();
			path.attr('stroke-dasharray', function(d) {return this.getTotalLength()}).attr('stroke-dashoffset', totalLength).transition().duration(700).ease(d3.easeSin).attr('stroke-dashoffset', 0);

			var bar_totalwidth = Math.round(bar_width * (data2.length - 1) / 2);
			for(i=1;i<data.result.length;i++) {
				svgG
					.selectAll('myRect' + i)
					.data(data2[i])
					.enter()
					.append('rect')
					.attr('y', height)
					.attr('x', function(d) { if(i < 0) bar_padding = 3; else bar_padding = 0; return xScale(d.x) + Math.floor(Math.round(xScale.bandwidth() / (data2.length + 1)) * i) + (bar_padding * i)} )
					.attr('height', 0 )
					.attr('fill', color[i])
					.attr('width', function(d, i) { return Math.round(xScale.bandwidth() / data2.length) - 3; })
					.transition()
					.duration(800)
					.attr('y', function(d) { return height - ybar(d.y); })
					.attr('height',function(d) { return ybar(d.y); })
				if(textyn == 1)
					svgG
						.append('g')
						.selectAll('g')
						.data(data2[i])
						.enter()
						.append('text')
						.attr('class', 'below')
						.attr('y', function(d) { if(d.y > valuemax / 2 ) return height - (ybar(d.y) - 5); else return height - (ybar(d.y) + 20); })
						.attr('x', function(d) { if(i < 0) bar_padding = 3; else bar_padding = 0; return Math.floor(xScale(d.x) + Math.round(xScale.bandwidth() / (data2.length + 1)) * i) + Math.floor(Math.ceil(xScale.bandwidth() / data2.length)/2 + bar_padding - 1) } )
						.attr('dy', '0.8em')
						.attr('alignment-baseline','middle')
						.attr('text-anchor', 'middle')
						.style('fill', function(d) { if(d.y > valuemax / 2 ) return '#fff'; else return '#000'; })
						.transition()
						.delay(850)
						.text( function(d) { return $.number(d.y); } );
			}
		break;
		case 6://json 배열 0번만 인식
			var xScale = d3.scalePoint().domain(item).padding([0.1]).range([margin.left, width]);
			var yScale = d3.scaleLinear().domain([0, valuemax]).nice().range([height, 0]);
			var x = d3.scaleLinear().range([margin.left, width]);
			var y = d3.scaleLinear().range([height, 0]);

			var radius = Math.min(width, height) / 2;
			var inner = Math.round(radius/2) + 10;
			
			var arc = d3.arc().outerRadius(radius).innerRadius(inner);
			var pie = d3.pie().sort(null).startAngle(0).endAngle(360).value(function(d) { return d.y; });
			var g = svg.selectAll('.arc').data(pie(data2[0])).enter().append('g').attr('class', 'arc').attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')');
			g.append('path').style('fill', function(d,i) { return color[i]; }).transition().duration(800).attrTween('d', function(d) {	var i = d3.interpolate(d.startAngle+0.1, d.endAngle);return function(t) {d.endAngle = i(t); return arc(d)	}});
	
			g.append('text')
			  .attr('transform', function(d) {  return 'translate('+(arc.centroid(d)[0])+','+(arc.centroid(d)[1] - 8)+')'; })
			   .text( function(d,i) { if(d.data.y > 0) return d.data.x;  })
			  .attr('font-size', '18px')
			  .attr('font-weight', 'bold')
			  .attr('fill', '#666')
			  .attr('text-anchor', 'middle')
			  .attr('display', 'block');
			
			g.append('text')
			  .attr('transform', function(d) {  return 'translate('+(arc.centroid(d)[0])+','+(arc.centroid(d)[1] + 8)+')'; })
			   .text( function(d,i) { if(d.data.y > 0) return d.data.y+'%';  })
			  .attr('font-size', '18px')
			  .attr('font-weight', 'bold')
			  .attr('fill', '#666')
			  .attr('text-anchor', 'middle')
			  .attr('display', 'block');
			////console.log(d);
			//총갯수 중앙표기
			var id = String(ele).replace('#', '');
			svgG.append('text').attr('class', 'total_'+id).attr('x', parseInt(svg.style('width')) / 2).attr('y', parseInt(svg.style('height')) /2 + 10 ).style('fill', color[2]).text('100%').style('font-size', '1.4em').style('font-weight','bolder').attr('alignment-baseline','middle').attr('text-anchor', 'middle');
			if(data2[0][0].y > 0) $('.total_'+id).animateNumber({ number: 100,
				numberStep: function(now, tween){
					var formatted = now.toFixed(1).replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
					if(formatted > 0) $(tween.elem).text(formatted + '%');
				}
			},{duration: 1000});
			/*if(data2[0][0].y > 0) $('.total_'+id).animateNumber({ number: data2[0][0].y,
				numberStep: function(now, tween){
					var formatted = now.toFixed(1).replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
					$(tween.elem).text(formatted + '%');
				}
			},{duration: 1000});*/

			if(text) {
				svgG.append('text').attr('x', parseInt(svg.style('width')) / 2).attr('y', parseInt(svg.style('height')) / 2 - 10).style('fill', color[2]).text(text).style('font-size', '1em').style('font-weight','700').attr('alignment-baseline','middle').attr('text-anchor', 'middle');
			}
		break;
	}
	//공통함수
		function make_x_gridlines() {	return d3.axisBottom(xScale).ticks(5); }
		function make_y_gridlines() {	return d3.axisLeft(yScale).ticks(5);}

	}
Number.isInteger = Number.isInteger || function(value) {
    return typeof value === "number" && isFinite(value) && Math.floor(value) === value;
};