$(function () {
    $.ajax({
        url: "includes/chart.php",
        type: "GET",
        success: function (response) {
            console.log("AJAX request successful. Response:", response); // Debugging line
            var chartData = response;
            
            var chartProperties = {
                caption: "iBoxing Performance Data",
                xAxisName: "User ID", // Indicating user_id from file_context_0
                yAxisName: "Performance Data",
                rotatevalues: "1",
                theme: "zune"
            };
            var apiChart = new FusionCharts({
                type: "mscolumn2d",
                renderAt: "chart-container",
                width: '100%',
                height: '100%',
                dataFormat: "json",
                dataSource: {
                    chart: chartProperties,
                    categories: [{
                        category: chartData.map(item => ({ label: item.user_id }))
                    }],
                    dataset: [
                        {
                            seriesname: "Duration",
                            data: chartData.map(item => ({ value: item.duration }))
                        },
                        {
                            seriesname: "Max Distance",
                            data: chartData.map(item => ({ value: item.max_distance }))
                        },
                        {
                            seriesname: "Highest Pitch",
                            data: chartData.map(item => ({ value: item.highest_pitch }))
                        },
                        {
                            seriesname: "Hits Per Min",
                            data: chartData.map(item => ({ value: item.hits_per_min }))
                        },
                        {
                            seriesname: "Total Hits",
                            data: chartData.map(item => ({ value: item.total_hits }))
                        }
                    ]
                }
            });
            console.log("Chart properties:", chartProperties); // Debugging line
            console.log("Chart data:", chartData); // Debugging line
            apiChart.render();
        },
        error: function (xhr, status, error) {
            console.error("Error fetching data: ", status, error);
        }
    });
});