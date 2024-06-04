document.addEventListener('DOMContentLoaded', () => {
    Promise.all([
        fetch('json/020101.2024.05.27.12.20.03.json').then(response => response.json()),
        fetch('json/020101.2024.05.27.12.20.03_copy.json').then(response => response.json()) // Add the second JSON file here
    ]).then(([jsonData1, jsonData2]) => {
        // Extract the values for the first dataset
        const measures1 = jsonData1.Items.map(item => item.v[0]);
        const beats1 = jsonData1.Items.map(item => item.v[1]);
        const tempo1 = jsonData1.Items.map(item => item.v[2]);

        // Extract the values for the second dataset
        const measures2 = jsonData2.Items.map(item => item.v[0]);
        const beats2 = jsonData2.Items.map(item => item.v[1]);
        const tempo2 = jsonData2.Items.map(item => item.v[2]);

        // Combine labels assuming both datasets have the same structure
        const labels = [];
        measures1.forEach((measure, index) => {
            labels.push(`${measure}:${beats1[index]}`);
        });

        // Calculate min and max values for y-axis from both datasets
        const minValue = Math.min(...tempo1, ...tempo2);
        const maxValue = Math.max(...tempo1, ...tempo2);
        const yMin = minValue - 5;
        const yMax = maxValue + 5;

        // Custom plugin for x-axis labels
        const customXAxisLabels = {
            id: 'customXAxisLabels',
            beforeDraw(chart, args, options) {
                const { ctx, scales: { x } } = chart;
                ctx.save();
                x.ticks.forEach((tick, index) => {
                    const measure = Math.floor(index / 4) + 1;
                    const beat = (index % 4) + 1;
                    const xPos = x.getPixelForTick(index);

                    ctx.font = beat === 1 ? 'bold 14px Arial' : 'normal 10px Arial';
                    ctx.fillStyle = 'black';
                    ctx.textAlign = 'center';
                    ctx.fillText(beat === 1 ? measure : beat, xPos, x.bottom + 10);
                });
                ctx.restore();
            }
        };

        // Create the chart
        const ctx = document.getElementById('myChart').getContext('2d');
        const myChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'Attempt 1',
                        data: tempo1,
                        borderColor: 'rgba(255, 99, 132, 1)',
                        backgroundColor: 'rgba(255, 99, 132, 0.2)',
                        fill: false,
                    },
                    {
                        label: 'Attempt 2',
                        data: tempo2,
                        borderColor: 'rgba(54, 162, 235, 1)',
                        backgroundColor: 'rgba(54, 162, 235, 0.2)',
                        fill: false,
                    }
                ]
            },
            options: {
                scales: {
                    x: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value, index) {
                                return index % 4 === 0 ? labels[index] : ''; // Display label every 4 beats
                            },
                            maxRotation: 0,
                            autoSkip: false
                        }
                    },
                    y: {
                        min: yMin,
                        max: yMax,
                        ticks: {
                            callback: function(value) {
                                return value + ' bpm';
                            }
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: true,
                        labels: {
                            color: 'rgb(255, 99, 132)'
                        }
                    }
                }
            }
        });

        // Function to update the chart range
        window.updateChartRange = function() {
            const rangeSlider = document.getElementById('rangeSlider');
            const scrollSlider = document.getElementById('scrollSlider');
            const rangeValue = document.getElementById('rangeValue');
            const scrollValue = document.getElementById('scrollValue');

            const range = parseInt(rangeSlider.value);
            const scroll = parseInt(scrollSlider.value);

            rangeValue.textContent = range;
            scrollValue.textContent = scroll;

            const startIndex = scroll * 4;
            const endIndex = startIndex + range * 4;

                // Update the x-axis labels to show relevant measures
                myChart.options.scales.x.ticks.callback = function(value, index) {
                    if (value >= startIndex && value < endIndex) {
                        return index % 4 === 0 ? labels[value] : '';
                    }
                    return '';
                };

            myChart.options.scales.x.min = startIndex;
            myChart.options.scales.x.max = endIndex - 1;

            myChart.update();
        };

        // Initialize the scrollSlider max value based on the rangeSlider value
        const rangeSlider = document.getElementById('rangeSlider');
        rangeSlider.addEventListener('input', () => {
            const scrollSlider = document.getElementById('scrollSlider');
            const range = parseInt(rangeSlider.value);
            scrollSlider.max = 16 - range;
            if (parseInt(scrollSlider.value) > 16 - range) {
                scrollSlider.value = 16 - range;
                updateChartRange();
            }
        });
    }).catch(error => console.error('Error fetching the JSON data:', error));
});
