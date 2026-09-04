//도넛 차트
const config = {
    type: 'doughnut',
    data: data,
};


//우선은 지출만 / 원형
function createDoughnutChart() {
    var context = document.getElementById('doughnutChart').getContext('2d');
    var myChart = new Chart(context, {
        type: 'doughnut',
        data: {
            labels: ['식비', '쇼핑', '교통', '생활', '문화·여가', '고정지출', '기타'],
            datasets: [{
                label: '지출',
                data: JSON.parse(localStorage.getItem("sodam-records")) || [0, 0, 0, 0, 0, 0, 0], // 실제 데이터로 대체 필요 - 로컬스토리지?
                backgroundColor: ['#e2828a', '#efb26b', '#93cb8c', '#7ed0c4', '#8fb4e8', '#b39ddb', '#98989d'],
                borderColor: '#fff',
                borderWidth: 1,
                hoverOffset: 4
            }]
        },
        options: {
            responsive: true
        }
    })
};

//막대
function createBarChart() {
    var context = document.getElementById('barChart').getContext('2d');
    var myChart = new Chart(context, {
        type: 'bar',
        data: {
            labels: ['식비', '쇼핑', '교통', '생활', '문화·여가', '고정지출', '기타'],
            datasets: [{
                label: '지출',
                data: JSON.parse(localStorage.getItem("sodam-records")) || [0, 0, 0, 0, 0, 0, 0], // 실제 데이터로 대체 필요 - 로컬스토리지?
                borderWidth: 1,
                backgroundColor: ['#e2828a', '#efb26b', '#93cb8c', '#7ed0c4', '#8fb4e8', '#b39ddb', '#98989d'],
                borderColor: '#fff',

            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100,
                    min: 0,
                    ticks: {
                        stepSize: 10
                    }
                }
            }
        }
    });
}