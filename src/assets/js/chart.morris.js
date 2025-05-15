/* eslint-disable no-undef */
$(function () {
	function formatDate(date) {
	  const day = String(date.getDate()).padStart(2, '0');
	  const month = String(date.getMonth() + 1).padStart(2, '0');
	  return `${day}/${month}`;
	}

	function generateLast7DaysData() {
	  const days = [];
	  const today = new Date();
	  today.setHours(0, 0, 0, 0);
	  for (let i = 6; i >= 0; i--) {
		const date = new Date(today.getTime() - i * 86400000);
		days.push({
		  date: formatDate(date),
		  revenue: Math.floor(Math.random() * 300) + 50,
		  electricity: Math.floor(Math.random() * 20) + 30,
		  water: Math.floor(Math.random() * 50) + 10,
		  abc: Math.floor(Math.random() * 50) + 45,
		  xyz: Math.floor(Math.random() * 50) + 60,
		});
	  }
	  return days;
	}

	function calculateServiceTotals(data) {
	  return data.reduce((total, day) => {
		total.electricity += day.electricity;
		total.water += day.water;
		total.abc += day.abc;
		total.xyz += day.xyz;
		return total;
	  }, { electricity: 0, water: 0, abc: 0, xyz: 0 });
	}

	function renderAreaChart(data) {
	  return Morris.Area({
		element: 'morrisArea',
		data,
		xkey: 'date',
		ykeys: ['revenue'],
		labels: ['Doanh thu (triệu VND)'],
		lineColors: ['#1b5a90'],
		lineWidth: 2,
		fillOpacity: 0.5,
		gridTextSize: 10,
		hideHover: 'auto',
		resize: true,
		parseTime: false,
		xLabelAngle: 45
	  });
	}

	function renderLineChart(data) {
	  return Morris.Line({
		element: 'morrisLine',
		data,
		xkey: 'date',
		ykeys: ['electricity', 'water', 'abc', 'xyz'],
		labels: ['Điện tử', 'Điện nước', 'Điện lạnh', 'Điện dân dụng'],
		lineColors: ['#1b5a90', '#ff9d00', '#ff0000', '#00ff00'],
		lineWidth: 1,
		gridTextSize: 10,
		hideHover: 'auto',
		resize: true,
		parseTime: false,
		xLabelAngle: 45
	  });
	}

	function renderDonutChart(totals) {
	  return Morris.Donut({
		element: 'morrisDonut',
		data: [
		  { label: "Điện tử", value: totals.electricity },
		  { label: "Điện nước", value: totals.water },
		  { label: "Điện lạnh", value: totals.abc },
		  { label: "Điện dân dụng", value: totals.xyz },
		],
		colors: ['#1b5a90', '#ff9d00', '#ff0000', '#00ff00'],
		resize: true
	  });
	}



	const last7DaysData = generateLast7DaysData();
	const totals = calculateServiceTotals(last7DaysData);

	window.mA = renderAreaChart(last7DaysData);
	window.mL = renderLineChart(last7DaysData);
	window.mD = renderDonutChart(totals);
	window.barChart = renderBarChart(last7DaysData);

	$(window).on("resize", function () {
	  mA.redraw();
	  mL.redraw();
	  mD.redraw();
	});
  });