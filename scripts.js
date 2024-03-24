// SIDEBAR TOGGLE

const mean = (arr) => arr.reduce((s, c) => s + c, 0) / arr.length;

const zip = (a, b) => a.map((k, i) => [k, b[i]]);

const mul_sum = (a, b) => zip(a, b).reduce((c, d) => d[0] * d[1] + c, 0);

const linear_regression = (x, y) => {
  const len = x.length;

  const x_mean = mean(x);
  const y_mean = mean(y);

  const xy_dev = mul_sum(x, y) - len * x_mean * y_mean;
  const xx_dev = mul_sum(x, x) - len * x_mean * x_mean;
  console.log(xy_dev);

  const m = xy_dev / xx_dev;
  return {
    m: m,
    b: y_mean - m * x_mean
  };
};

const eval_regression = (reg, xs) => xs.map((x, _) => reg.m * x + reg.b);

let sidebarOpen = false;
const sidebar = document.getElementById('sidebar');

function openSidebar() {
  if (!sidebarOpen) {
    sidebar.classList.add('sidebar-responsive');
    sidebarOpen = true;
  }
}

function closeSidebar() {
  if (sidebarOpen) {
    sidebar.classList.remove('sidebar-responsive');
    sidebarOpen = false;
  }
}

// ---------- CHARTS ----------

// BAR CHART
const barChartOptions = {
  series: [
    {
      data: [10, 8, 6, 4, 2],
    },
  ],
  chart: {
    type: 'bar',
    height: 350,
    toolbar: {
      show: false,
    },
  },
  colors: ['#246dec', '#cc3c43', '#367952', '#f5b74f', '#4f35a1'],
  plotOptions: {
    bar: {
      distributed: true,
      borderRadius: 4,
      horizontal: false,
      columnWidth: '40%',
    },
  },
  dataLabels: {
    enabled: false,
  },
  legend: {
    show: false,
  },
  xaxis: {
    categories: ['PatientData1', 'PatientData2', 'PatientData3', 'PatientData4', 'PatientData5'],
  },
  yaxis: {
    title: {
      text: 'Count',
    },
  },
};

const barChart = new ApexCharts(
  document.querySelector('#bar-chart'),
  barChartOptions
);
barChart.render();

const data = [31, 40, 28, 51, 42, 109, 100];
const x = [0, 1, 2, 3, 4, 5, 6];
const reg = linear_regression(x, data);
const reg_data = eval_regression(reg, x);

// AREA CHART
const areaChartOptions = {
  series: [
    {
      name: 'DiseaseCount1',
      data: data,
    },
    {
      name: 'DiseaseCount2',
      data: [11, 32, 45, 32, 34, 52, 41],
    },
    {
      name: "Regression",
      data: reg_data,
    }
  ],
  chart: {
    height: 350,
    type: 'area',
    toolbar: {
      show: false,
    },
  },
  colors: ['#4f35a1', '#246dec', '#246'],
  dataLabels: {
    enabled: false,
  },
  stroke: {
    curve: 'smooth',
  },
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
  markers: {
    size: 0,
  },
  yaxis: [
    {
      title: {
        text: 'Population Affected',
      },
    },
    {
      opposite: true,
      title: {
        text: 'Number of Deaths',
      },
    },
  ],
  tooltip: {
    shared: true,
    intersect: false,
  },
};

const areaChart = new ApexCharts(
  document.querySelector('#area-chart'),
  areaChartOptions
);
areaChart.render();
