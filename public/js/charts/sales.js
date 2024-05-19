(async function () {
    "use strict";

    // Colors
    const text_primary_500 = '#6366F1';
    const text_secondary_500 = '#EC4899';
    const text_yellow_500 = '#F59E0B';
    const text_green_500 = '#22C55E';
    const text_gray_500 = '#84848f';

    // Convert HEX TO RGBA
    function hexToRGBA(hex, opacity) {
        if (hex != null) {
            return 'rgba(' + (hex = hex.replace('#', '')).match(new RegExp('(.{' + hex.length / 3 + '})', 'g')).map(function (l) { return parseInt(hex.length % 2 ? l + l : l, 16) }).concat(isFinite(opacity) ? opacity : 1).join(',') + ')';
        }
    }

    // Get data
    const response = await axios.get('/app/admin/metrics/data')

    if (response.status != 200) return alertMessage("error", "Não foi possível estabeler a conexão com o servidor.")

    const data = response.data

    const amounts = data.financesCharts.map(item => item.totalAmount);
    const posts = data.posts.map(item => item.count);
    const visitors = data.visitors.map(item => item.count);

    const minValueAmount = amounts.reduce((min, value) => (value < min ? value : min), data[0]);
    const maxValueAmount = amounts.reduce((max, value) => (value > max ? value : max), data[0]);
    
    // Show data
    const showData = function() {
        document.getElementById("quantity-finances").innerText = data.financesCurrentMonth.length
        document.getElementById("quantity-revenue").innerText = `R$${data.revenue}`
        document.getElementById("quantity-posts").innerText = data.posts.length
        document.getElementById("quantity-users").innerText = data.users
    }

    // Charts JS
    const myCharts = function () {
        Chart.defaults.color = text_gray_500;

        // Sales KPI
        const chart_kpi = document.getElementById("ChartKpi");
        if (chart_kpi != null) {
            const ctb = chart_kpi.getContext('2d');

            const TrafficChart = new Chart(ctb, {
                type: 'line',
                data: {
                    labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
                    datasets: [{
                        label: 'Receita',
                        data: amounts,
                        fill: {
                            target: 'origin'
                        },
                        borderColor: text_primary_500,
                        backgroundColor: [
                            hexToRGBA(text_primary_500, 0.4)
                        ],
                        tension: 0.3,
                        pointBackgroundColor: text_primary_500,
                        pointBorderWidth: 0,
                        pointHitRadius: 30,
                        pointHoverBackgroundColor: text_primary_500,
                        pointHoverRadius: 5,
                        pointRadius: 0,
                        tooltip: {
                            callbacks: {
                                label: (Item) => 'R$' + (Item.formattedValue)
                            }
                        }
                    }]
                },
                options: {
                    animation: {
                        delay: 2000
                    },
                    interaction: {
                        mode: 'index',
                        intersect: false,
                    },
                    scales: {
                        x: {
                            stacked: true,
                            display: true,
                            grid: {
                                display: false
                            }
                        },
                        y: {
                            stacked: true,
                            grid: {
                                borderDash: [4, 4]
                            },
                            min: minValueAmount,
                            max: maxValueAmount,
                            ticks: {
                                callback: function (value, index, ticks) {
                                    return '$' + value;
                                }
                            }
                        }
                    },
                    plugins: {
                        legend: {
                            display: true,
                            position: "bottom"
                        }
                    }
                }
            })
        }

        // Posts KPI
        const chart_posts = document.getElementById("BarPosts");
        if (chart_posts != null) {
            const ctb = chart_posts.getContext('2d');
            const BarChart = new Chart(ctb, {
                type: 'bar',
                data: {
                    labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
                    datasets: [{
                        label: 'Publicações',
                        data: posts,
                        backgroundColor: [
                            hexToRGBA(text_green_500, 0.4)
                        ],
                        borderColor: text_green_500,
                        borderWidth: 1,
                        tooltip: {
                            callbacks: {
                                label: (Item) => (Item.formattedValue)
                            }
                        }
                    }]
                },
                options: {
                    animation: {
                        y: {
                            duration: 4000,
                            from: 500
                        }
                    },
                    scales: {
                        x: {
                            display: true,
                            grid: {
                                display: false
                            }
                        },
                        y: {
                            display: true,
                            grid: {
                                borderDash: [4, 4]
                            },
                            ticks: {
                                callback: function (value, index, ticks) {
                                    return value;
                                }
                            }
                        }
                    },
                    plugins: {
                        legend: {
                            display: false
                        }
                    }
                }
            })
        }

        // Visitors KPI
        const chart_visitors = document.getElementById("BarVisitors");
        if (chart_visitors != null) {
            const ctb = chart_visitors.getContext('2d');
            const BarChart = new Chart(ctb, {
                type: 'bar',
                data: {
                    labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
                    datasets: [{
                        label: 'Visitantes',
                        data: visitors,
                        backgroundColor: [
                            hexToRGBA(text_green_500, 0.4)
                        ],
                        borderColor: text_green_500,
                        borderWidth: 1,
                        tooltip: {
                            callbacks: {
                                label: (Item) => (Item.formattedValue)
                            }
                        }
                    }]
                },
                options: {
                    animation: {
                        y: {
                            duration: 4000,
                            from: 500
                        }
                    },
                    scales: {
                        x: {
                            display: true,
                            grid: {
                                display: false
                            }
                        },
                        y: {
                            display: true,
                            grid: {
                                borderDash: [4, 4]
                            },
                            ticks: {
                                callback: function (value, index, ticks) {
                                    return value;
                                }
                            }
                        }
                    },
                    plugins: {
                        legend: {
                            display: false
                        }
                    }
                }
            })
        }
    }

    showData();
    myCharts();
})();