function SalesChart({ title, chartData = [], type = "line", categories = [] }) {
  const canvasRef = React.useRef(null);
  const chartInstanceRef = React.useRef(null);

  React.useEffect(() => {
    if (!canvasRef.current) return;

    if (chartInstanceRef.current) {
      try {
        chartInstanceRef.current.destroy();
      } catch (e) {}
      chartInstanceRef.current = null;
    }

    const ctx = canvasRef.current.getContext("2d");
    if (!ctx) return;

    let config = {
      type: "line",
      data: { labels: [], datasets: [] },
      options: {
        responsive: true,
        plugins: {
          legend: { position: "bottom" },
          title: { display: !!title, text: title || "" },
        },
        maintainAspectRatio: false,
      },
    };

    try {
      if (type === "line") {
        const labels = (chartData || []).map((d) => d.date);
        const dataPoints = (chartData || []).map((d) => Number(d.total || 0));
        config.type = "line";
        config.data.labels = labels;
        config.data.datasets = [
          {
            label: "Sales",
            data: dataPoints,
            borderColor: "rgba(59, 130, 246, 0.9)",
            backgroundColor: "rgba(59, 130, 246, 0.1)",
            fill: true,
            tension: 0.4,
            borderWidth: 3,
          },
        ];
        config.options.scales = {
          y: { 
            beginAtZero: true,
            ticks: {
              callback: function(value) {
                return '₱' + value.toLocaleString();
              }
            }
          }
        };
      } else if (type === "pie") {
        const labels = (chartData || []).map((d) => d.category);
        const dataPoints = (chartData || []).map((d) => Number(d.qty || 0));

        // Dynamic color generation for categories
        const generateColors = (count) => {
          const baseColors = [
            'rgba(234, 88, 12, 0.9)',    // Orange
            'rgba(202, 138, 4, 0.9)',    // Yellow
            'rgba(219, 39, 119, 0.9)',   // Pink
            'rgba(101, 163, 13, 0.9)',   // Green
            'rgba(37, 99, 235, 0.9)',    // Blue
            'rgba(147, 51, 234, 0.9)',   // Purple
            'rgba(20, 184, 166, 0.9)',   // Teal
            'rgba(245, 158, 11, 0.9)',   // Amber
            'rgba(220, 38, 38, 0.9)',    // Red
            'rgba(132, 204, 22, 0.9)'    // Lime
          ];
          
          if (count <= baseColors.length) {
            return baseColors.slice(0, count);
          }
          
          // Generate additional colors if needed
          const additionalColors = [];
          for (let i = baseColors.length; i < count; i++) {
            const hue = (i * 137.5) % 360; // Golden angle for distribution
            additionalColors.push(`hsla(${hue}, 70%, 50%, 0.9)`);
          }
          return [...baseColors, ...additionalColors];
        };

        const backgroundColor = generateColors(labels.length);

        config.type = "pie";
        config.data.labels = labels;
        config.data.datasets = [
          {
            label: "Sales by Category",
            data: dataPoints,
            backgroundColor,
            borderWidth: 2,
            borderColor: '#fff',
          },
        ];
      } else if (type === "multi-line") {
        const labels = (chartData || []).map((d) => d.date);
        
        // Use provided categories or extract from data
        const availableCategories = categories.length > 0 
          ? categories 
          : Object.keys(chartData[0] || {}).filter(key => key !== 'date');

        // Dynamic color generation
        const generateLineColors = (count) => {
          const baseColors = [
            { border: 'rgba(234, 88, 12, 0.9)', background: 'rgba(234, 88, 12, 0.1)' },
            { border: 'rgba(202, 138, 4, 0.9)', background: 'rgba(202, 138, 4, 0.1)' },
            { border: 'rgba(219, 39, 119, 0.9)', background: 'rgba(219, 39, 119, 0.1)' },
            { border: 'rgba(101, 163, 13, 0.9)', background: 'rgba(101, 163, 13, 0.1)' },
            { border: 'rgba(37, 99, 235, 0.9)', background: 'rgba(37, 99, 235, 0.1)' },
            { border: 'rgba(147, 51, 234, 0.9)', background: 'rgba(147, 51, 234, 0.1)' },
            { border: 'rgba(20, 184, 166, 0.9)', background: 'rgba(20, 184, 166, 0.1)' },
            { border: 'rgba(245, 158, 11, 0.9)', background: 'rgba(245, 158, 11, 0.1)' },
            { border: 'rgba(220, 38, 38, 0.9)', background: 'rgba(220, 38, 38, 0.1)' },
            { border: 'rgba(132, 204, 22, 0.9)', background: 'rgba(132, 204, 22, 0.1)' }
          ];
          
          if (count <= baseColors.length) {
            return baseColors.slice(0, count);
          }
          
          const additionalColors = [];
          for (let i = baseColors.length; i < count; i++) {
            const hue = (i * 137.5) % 360;
            additionalColors.push({
              border: `hsla(${hue}, 70%, 50%, 0.9)`,
              background: `hsla(${hue}, 70%, 50%, 0.1)`
            });
          }
          return [...baseColors, ...additionalColors];
        };

        const colors = generateLineColors(availableCategories.length);
        const datasets = availableCategories.map((cat, index) => ({
          label: cat,
          data: (chartData || []).map((d) => Number(d[cat] || 0)),
          borderColor: colors[index]?.border || `hsla(${index * 50}, 70%, 50%, 0.9)`,
          backgroundColor: colors[index]?.background || `hsla(${index * 50}, 70%, 50%, 0.1)`,
          fill: true,
          tension: 0.4,
          borderWidth: 2,
          pointRadius: 4,
          pointHoverRadius: 6,
        }));

        config.type = "line";
        config.data.labels = labels;
        config.data.datasets = datasets;
        config.options.scales = {
          x: { 
            display: true, 
            title: { display: true, text: 'Date' } 
          },
          y: { 
            display: true, 
            beginAtZero: true,
            title: { display: true, text: 'Sales' },
            ticks: {
              callback: function(value) {
                return '₱' + value.toLocaleString();
              }
            }
          },
        };
      }

      chartInstanceRef.current = new ChartJS(ctx, config);
    } catch (err) {
      console.error("SalesChart render error:", err);
    }

    return () => {
      if (chartInstanceRef.current) {
        try {
          chartInstanceRef.current.destroy();
        } catch (e) {}
        chartInstanceRef.current = null;
      }
    };
  }, [chartData, type, title, categories]);

  const hasData = Array.isArray(chartData) && chartData.length > 0 &&
    (type !== "pie" || chartData.some((d) => Number(d.qty || 0) > 0));

  return (
    <div className="bg-white rounded-2xl shadow-md p-4" style={{ minHeight: 260 }}>
      <div style={{ height: 220, position: "relative" }}>
        {!hasData ? (
          <div className="flex items-center justify-center h-full text-gray-500">
            No data to display
          </div>
        ) : null}
        <canvas ref={canvasRef} style={{ width: "100%", height: "100%" }} />
      </div>
    </div>
  );
}