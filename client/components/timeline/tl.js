(function(){

var tl = window.tl || {};

tl.version = '0.1.0.0';
window.tl = tl;

tl.utils = {}; // Utility subsystem
tl.models = {}; //stores all the possible models/components

tl.models.timeline = function() {

	// [svg_width, svg_height]
	var svg_size = [800, 200];
	timeline.svg_size = function(_) {
		if (!arguments.length) return svg_size;
		svg_size = _;
		return timeline;
	};

	//タイムライン用、margin, scale, axis設定
	var margin = {top: 20, right: 20, bottom: 30, left: 50}
	timeline.margin = function(_) {
		if (!arguments.length) return margin;
		margin = _;
		return timeline;
	};

	var width  = svg_size[0] - margin.left - margin.right,
			height = svg_size[1] - margin.top - margin.bottom;

	var dateExtent,
		xScale,
		yScale,
		xAxis,
		yAxis;

	// D3 Selections
	var svg,
			board;

	//var format = d3.time.format("%Y/%m/%d %H:%M:%S:%L");
	var format = d3.time.format("%Y/%m/%d");

	function timeline(selection) {

		selection.each(function(d) {

			var container = d3.select(this);

			var disp_date = { start : '2007/04/01', end : '2014/11/01'}
			/*var work_hist = [{
				company	 : "Sony Corporation",
				link	   : "http://www.sony.co.jp",
				period   : { start : '2008/04/01', end : '2014/11/01' },
				positions :[
					{ title : "Software Engineer, Researcher",
						unit : "Sect1 Intelligence Application Development Division, Technology Development Group, R&D",
						period : {start : '2008/04/01', end : '2011/04/01'},
						explaination : "",
						episodes : [],
						upvotes : 0
					},
					{ title : "Lead Software Engineer, Researcher",
						unit : "Sect1 Intelligence Application Development Division, Technology Development Group, R&D",
						period : {start : '2011/04/01', end : '2014/11/01'},
						explaination : "",
						episodes : [],
						upvotes : 0
					}
				],
				projects : [
					{ title : 'MusicAnalysis',
						period : {start : '2008/04/01', end : '2011/04/01'},
						projects :[],
						explaination : "",
						episodes : [],
						upvotes : 0
					},
					{ title : 'SportAssistTechnology',
						period : {start : '2011/04/01', end : '2014/11/01'},
						projects :[],
						explaination : "",
						episodes : [],
						upvotes : 0
					}
				]
			}];
			*/

			// update size
			width   = svg_size[0] - margin.left - margin.right,
			height  = svg_size[1] - margin.top - margin.bottom;

			dateExtent 	  = [format.parse(disp_date.start), format.parse(disp_date.end)]
			console.log(dateExtent);

			// Timeline scale, axis設定
			xScale = d3.time.scale()
				.domain(dateExtent)
				.range([0, width]);
			yScale = d3.scale.ordinal()
				.domain([1,2,3,4])
				.rangePoints([0, height], 0.25, 10);
			xAxis = d3.svg.axis().scale(xScale).orient("bottom");
			yAxis = d3.svg.axis().scale(yScale).orient("left");

			//ステージ作成
			svg = container.append("svg")
				.attr("width", width + margin.left + margin.right)
				.attr("height", height + margin.top + margin.bottom);

      //タイムライン作成
			board = svg.append("g")
				.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      //x目盛軸
			board.append("g")
				.attr("class", "x axis")
				.attr("transform", "translate(0," + height + ")")
				.call(xAxis);

      //y目盛軸
			board.append("g")
				.attr("class", "y axis")
				.call(yAxis);

			// build the arrow.
			svg.append("svg:defs").selectAll("marker")
				.data(["end"])      // Different link/path types can be defined here
			.enter().append("svg:marker")    // This section adds in the arrows
				.attr("id", String)
				.attr("viewBox", "0 -5 10 10")
				.attr("refX", 9.5)
				.attr("refY", 0)
				.attr("markerWidth", 10)
				.attr("markerHeight", 10)
				.attr("orient", "auto")
			.append("svg:path")
				.attr("d", "M0,-5L10,0L0,5");

			console.log(data.companies);

			// LineGeneratorで処理しやすくするために点を生成する
			// 点の生成 [x, y]
			data.companies.forEach(function(w) {
				w.points = [[xScale(format.parse(w.period.start)), yScale(1)],
										[xScale(format.parse(w.period.end)), yScale(1)]];
				w.markendtype = "end";
			});

			// positions
			data.positions.forEach(function(p) {
				p.points = [[xScale(format.parse(p.period.start)), yScale(2)],
										[xScale(format.parse(p.period.end)), yScale(2)]];
				p.markendtype = "end";
			});

			// projects
			data.projects.forEach(function(d) {
				d.points = [[xScale(format.parse(d.period.start)), yScale(3)],
										[xScale(format.parse(d.period.end)), yScale(3)]];
				d.markendtype = "end";
			});


			// WorkTimeLine生成
			// LineGeneratorの作成
			var linegen = d3.svg.line()
				.x(function(d) { return d[0]; })
				.y(function(d) { return d[1]; })
				.interpolate("basis");

			// 開始点作成
			var companyli = board.append("g");

			// 会社ラインの開始点サークル生成
			companyli.selectAll('.company')
				.data(data.companies)
			.enter().append("circle")
				.attr('class', 'company')
				.attr("cx", function(d) { return d.points[0][0]; })
				.attr("cy", function(d) { return d.points[0][1]; })
				.attr("r", function(d){ return 5;});

			// ラインの生成
			companyli.selectAll('.path')
				.data(data.companies)
			.enter().append('svg:path')
				.attr('d', function(d) { return linegen(d.points); })
				.attr("class", function(d) { return "line company"; })
				.attr("marker-end", function(d) { return "url(#" + d.markendtype + ")"; });

			// textの生成
			companyli.selectAll(".text")
    		.data(data.companies)
  		.enter().append("svg:text")
				.attr("transform", function(d) { return "translate(" + d.points[0][0] + "," + d.points[0][1] + ")"})
				.attr("x", 8 )
				.attr("y", ".0em")
				.attr("class", "company")
				.style("text-anchor", "start")
				.text(function(d) { return d.name; });

			var positionli = board.append("g");
			var projectli = board.append("g");

			// 肩書きラインの開始点サークル生成
			positionli.selectAll('.position')
				.data(data.positions)
			.enter().append("circle")
				.attr('class', 'position')
				.attr("cx", function(d) { return d.points[0][0]; })
				.attr("cy", function(d) { return d.points[0][1]; })
				.attr("r", function(d){ return 5;});

			// ラインの生成
			positionli.selectAll('.path')
				.data(data.positions)
			.enter().append('svg:path')
				.attr('d', function(d) { return linegen(d.points); })
				.attr("class", function(d) { return "line position"; })
				.attr("marker-end", function(d) { return "url(#" + d.markendtype + ")"; });

			// textの生成
			positionli.selectAll(".text")
				.data(data.positions)
			.enter().append("svg:text")
				.attr("transform", function(d) { return "translate(" + d.points[0][0] + "," + d.points[0][1] + ")"})
				.attr("x", 8 )
				.attr("y", ".0em")
				.attr("class", "position")
				.style("text-anchor", "start")
				.text(function(d) { return d.title; });


			// プロジェクトラインの開始点サークル生成
			projectli.selectAll('.project')
					.data(data.projects)
				.enter().append("circle")
					.attr('class', 'project')
					.attr("cx", function(d) { return d.points[0][0]; })
					.attr("cy", function(d) { return d.points[0][1]; })
					.attr("r", function(d){ return 5;});
			// ラインの生成
			projectli.selectAll('.path')
				.data(data.projects)
			.enter().append('svg:path')
				.attr('d', function(d) { return linegen(d.points); })
				.attr("class", function(d) { return "line project"; })
				.attr("marker-end", function(d) { return "url(#" + d.markendtype + ")"; });

			// textの生成
			projectli.selectAll(".text")
				.data(data.projects)
			.enter().append("svg:text")
				.attr("transform", function(d) { return "translate(" + d.points[0][0] + "," + d.points[0][1] + ")"})
				.attr("x", 8 )
				.attr("y", ".-0em")
				.attr("class", "project")
				.style("text-anchor", "start")
				.text(function(d) { return d.title; });



			/*
			// 開始点作成
			arrows = board.append("g");
			arrows.selectAll('.dot')
				.data(work_hist[0].projects)
			.enter().append("circle")
			  .attr('class', 'dot')
				.attr("cx", function(d) { return xScale(format.parse(d.period.start)); })
				.attr("cy", function(d) { return yScale(1);})
				.attr("r", function(d){ return 5;});
				//.style("fill", function(d) { return color(1); })
			*/





			// ラインの生成
			/*
			arrows.selectAll('.path')
				.data(work_hist[0].projects)
			.enter().append('svg:path')
				.attr('d', function(d) { return linegen(d.points); })
				.attr("class", function(d) { return "line " + d.type; })
				.attr("marker-end", function(d) { return "url(#" + d.markendtype + ")"; })
				.attr("stroke-width", 2)
				.attr("stroke", "black");

			// こっちの書き方でもかけるよ
			arrows.selectAll('.line')
				.data(project.childs)
			.enter().append('line')
				.attr('x1', function(d) { return xScale(format.parse(d.period.start));})
				.attr('x2', function(d) { return xScale(format.parse(d.period.end));})
				.attr('y1', function(d) { return yScale(1);})
				.attr('y2', function(d) { return yScale(1);})
				.attr("stroke-width", 2)
				.attr("stroke", "black");
			*/

			// textの生成
			// todo : ぶつからないように調整
			// todo : スケールによって表示非表示を判定


		});

		return timeline;
	};

  // Data
	var data;
	timeline.data = function(_) {
		if (!arguments.length) return data;
		data = _;

		// dateオブジェクト追加
    /*
		data.shots.forEach(function(d) {
			d.d3date = format.parse(d.date);
		});
    */
		return timeline;
	};

	return timeline;
}


})();
