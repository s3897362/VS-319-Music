document.addEventListener('DOMContentLoaded', () => {
    fetch('json/020101.2024.05.27.12.20.03.json')
        .then(response => response.json())
        .then(jsonData => {
            // Extract the values for the chart
            const measures = jsonData.Items.map(item => item.v[0]);
            const beats = jsonData.Items.map(item => item.v[1]);
            const tempo = jsonData.Items.map(item => item.v[2]);
            
            const labels = [];
            measures.forEach((measure, index) => {
                labels.push(`${measure}:${beats[index]}`);
            });

            // Calculate min and max values for y-axis
            const minValue = Math.min(...tempo);
            const maxValue = Math.max(...tempo);
            const yMin = minValue - 10;
            const yMax = maxValue + 15;

            // Create the chart
            const ctx = document.getElementById('myChart').getContext('2d');
            const myChart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: labels,
                    datasets: [
                        {
                            label: 'User Tempo',
                            data: tempo,
                            borderColor: 'rgba(255, 99, 132, 1)',
                            backgroundColor: 'rgba(255, 99, 132, 0.2)',
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

                myChart.options.scales.x.min = startIndex;
                myChart.options.scales.x.max = endIndex - 1;

                // Update the x-axis labels to show relevant measures
                myChart.options.scales.x.ticks.callback = function(value, index) {
                    if (value >= startIndex && value < endIndex) {
                        return index % 4 === 0 ? labels[value] : '';
                    }
                    return '';
                };

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
        })
        .catch(error => console.error('Error fetching the JSON data:', error));
});
