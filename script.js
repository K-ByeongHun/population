let populationChart; // 막대차트 객체 선언해주는 장치
let linePopulationChart; // 꺾은선 차트 객체 선언해주는 장치

function predictPopulation(event) {
    event.preventDefault(); // 페이지 새로고침 방지

    const years = parseInt(document.getElementById('years').value);
    // CSV 파일 경로 설정
    const csvFilePath = '인구.csv';

    // CSV 파일 읽기 코드
    Papa.parse(csvFilePath, {
        download: true,
        complete: function(results) {
            const data = results.data;

            // 특정 행렬의 데이터 가져오기
            const target_value2024 = parseFloat(data[1][3]);  //1행 3열
            const target_value2025 = parseFloat(data[1][4]);  //1행 4열
            const rate2024 = parseFloat(data[5][3] * 1 / 100); //5행 3열
            const rate2025 = parseFloat(data[5][4] * 1 / 100); //5행 4열

            // 2024년 리스트, 2025리스트 생성
            const List4 = createList(target_value2024, rate2024, years);
            const List5 = createList(target_value2025, rate2025, years);

            // 차트 만들기
            drawChart(List4, List5);
        },
        error: function(error) {
            console.error('Sorry, I cannot find your CSV file:', error);
        }
    });
}

function createList(initialValue, rate, years) {        //for 문을 통해 입력된 변수만큼 리스트에 순서쌍으로 넣는 장치 **지수함수 과정을 엮었음**
    const list = [];
    for (let i = 1; i <= years; i++) {
        const value = Math.floor(initialValue * Math.pow(1.0 + rate, i)); //rate 가 인구 증가율임
        list.push({ year: i, value: value }); //리스트에 순서쌍으로 집어넣음, 차트를 만들땐 순서쌍을 분리해주어야함
    }
    return list;
}

function drawChart(data1, data2) {
    const Bar = document.getElementById('populationChart').getContext('2d');
    const Line = document.getElementById('linePopulationChart').getContext('2d');       //차트를 그리기 위한 상수
    const years = data1.map(entry => entry.year); // 차트를 만들기 위해 새로운 변수를 놓아서 리스트의 요소만 할당시켜줌
    const values1 = data1.map(entry => entry.value);
    const values2 = data2.map(entry => entry.value);

    // 로그 스케일이 켜져 있는지 확인
    const isLogScale = document.getElementById('logScale').checked;
    const transformedValues1 = isLogScale ? values1.map(value => Math.log10(value)) : values1;    // 삼항 연산자를 활용하여 체크가 켜져있으면 변환, 안켜져있으면 변환하지 않음
    const transformedValues2 = isLogScale ? values2.map(value => Math.log10(value)) : values2;

    // 기존 차트가 있으면 파괴
    if (populationChart) {
        populationChart.destroy();
    }
    if (linePopulationChart) {
        linePopulationChart.destroy();
    }

    // 막대 그래프 생성
    populationChart = new Chart(Bar, {
        type: 'bar',
        data: {
            labels: years,      // years를 활용해서 x축을 구현함.
            datasets: [
                {
                    label: '2024 Population',
                    data: transformedValues1,   // 변환된 값에 따라 y축을 구성함
                    backgroundColor: 'rgba(54, 162, 235, 0.5)',   //그냥 배경 색깔
                    borderColor: 'rgba(54, 162, 235, 1)',     //그냥 그래프 색깔
                    borderWidth: 1    //그냥 그래프 너비
                },
                {
                    label: '2025 Population',
                    data: transformedValues2,   // 변환된 값에 따라 y축을 구성함
                    backgroundColor: 'rgba(255, 99, 132, 0.5)',   //그냥 배경 색깔
                    borderColor: 'rgba(255, 99, 132, 1)',   //그냥 그래프 색깔
                    borderWidth: 1    //그냥 그래프 너비
                }
            ]
        },
        options: {
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Years'   //x축 이름
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: isLogScale ? 'Population (log scale)' : 'Population'    //로그 스케일 체크가 켜지면 y축 label도 바꿔버림, 중복 처럼 보일 수 있지만 이놈은 초기 그래프에서 띄울 때 사용
                    },
                    ticks: {
                        beginAtZero: true   //y축 눈금을 항상 0으로 두기-> 짜피 밑이 음수인경우 0으로 수렴하기 때문에 중요하진 않다
                    }
                }
            }
        }
    });

    // 꺾은선 그래프 생성
    linePopulationChart = new Chart(Line, {
        type: 'line',
        data: {
            labels: years,
            datasets: [
                {
                    label: '2024 Population',
                    data: transformedValues1,   // 변환된 값에 따라 y축을 구성함
                    backgroundColor: 'rgba(54, 162, 235, 0.5)',  //그냥 배경 색깔
                    borderColor: 'rgba(54, 162, 235, 1)',     //그냥 그래프 색깔
                    borderWidth: 1,      //그냥 그래프 너비
                    fill: false
                },
                {
                    label: '2025 Population',
                    data: transformedValues2,   // 변환된 값에 따라 y축을 구성함
                    backgroundColor: 'rgba(255, 99, 132, 0.5)',   //그냥 배경 색깔
                    borderColor: 'rgba(255, 99, 132, 1)',    //그냥 그래프 색깔
                    borderWidth: 1,     //그냥 그래프 너비
                    fill: false
                }
            ]
        },
        options: {
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Years'   //x축 이름
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: isLogScale ? 'Population (log scale)' : 'Population'    //로그 스케일 체크가 켜지면 y축 label도 바꿔버림 중복 처럼 보일 수 있지만 이놈은 초기 그래프 띄울 때 label띄움
                    },
                    ticks: {
                        beginAtZero: true     //y축 눈금을 항상 0으로 두기-> 짜피 밑이 음수인경우 0으로 수렴하기 때문에 중요하진 않다
                    }
                }
            }
        }
    });
}

function logscalecheckbox() {
    if (populationChart && linePopulationChart) {
        const isLogScale = document.getElementById('logScale').checked;   //체크 되었는지 불린으로 놓음. 체크 되면 아마 이 상수가 true 로 변환되어 사용됨

        const data1 = populationChart.data.datasets[0].data;
        const data2 = populationChart.data.datasets[1].data;

        populationChart.data.datasets[0].data = isLogScale ? data1.map(value => Math.log10(value)) : data1.map(value => Math.pow(10, value));
        populationChart.data.datasets[1].data = isLogScale ? data2.map(value => Math.log10(value)) : data2.map(value => Math.pow(10, value));
        
        linePopulationChart.data.datasets[0].data = isLogScale ? data1.map(value => Math.log10(value)) : data1.map(value => Math.pow(10, value));
        linePopulationChart.data.datasets[1].data = isLogScale ? data2.map(value => Math.log10(value)) : data2.map(value => Math.pow(10, value));

        populationChart.options.scales.y.title.text = isLogScale ? 'Population (log scale)' : 'Population';   //옵션 중복처럼 보일 수 있지만 위는 초기 그래프에서 띄우는 작업, 변환 될 때 바꾸는 작업
        linePopulationChart.options.scales.y.title.text = isLogScale ? 'Population (log scale)' : 'Population'; //변환될 때 바뀌는 작업
        populationChart.update();
        linePopulationChart.update();
    }
}
