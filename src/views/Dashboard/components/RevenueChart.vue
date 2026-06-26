<template>
  <BaseCard class="chart-card text-left p-md mb-xl">
    <h3 class="title-xs text-ink mb-md">Tren Pendapatan Bulanan</h3>
    <div class="chart-container">
      <canvas ref="chartCanvas"></canvas>
    </div>
  </BaseCard>
</template>

<script>
import { ref, onMounted, watch } from 'vue';
import { Chart, registerables } from 'chart.js';
import BaseCard from '../../../components/ui/BaseCard.vue';

Chart.register(...registerables);

export default {
  name: 'RevenueChart',
  components: {
    BaseCard,
  },
  props: {
    data: {
      type: Array,
      default: () => [],
    },
  },
  setup(props) {
    const chartCanvas = ref(null);
    let chartInstance = null;

    const monthNames = {
      '01': 'Januari', '02': 'Februari', '03': 'Maret', '04': 'April',
      '05': 'Mei', '06': 'Juni', '07': 'Juli', '08': 'Agustus',
      '09': 'September', '10': 'Oktober', '11': 'November', '12': 'Desember'
    };

    const renderChart = () => {
      if (chartInstance) {
        chartInstance.destroy();
      }
      if (!chartCanvas.value || !props.data || props.data.length === 0) return;

      const ctx = chartCanvas.value.getContext('2d');
      const labels = props.data.map(d => {
        const parts = d.bulan.split('-');
        return `${monthNames[parts[1]] || parts[1]} ${parts[0]}`;
      });
      const dataValues = props.data.map(d => d.pendapatan);

      chartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: labels,
          datasets: [{
            label: 'Pendapatan (Rp)',
            data: dataValues,
            backgroundColor: 'rgba(99, 102, 241, 0.65)',
            borderColor: 'rgba(99, 102, 241, 1)',
            borderWidth: 1.5,
            borderRadius: 6,
            barPercentage: 0.6,
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false
            },
            tooltip: {
              backgroundColor: '#1e293b',
              titleColor: '#fff',
              bodyColor: '#fff',
              borderColor: 'rgba(99, 102, 241, 1)',
              borderWidth: 1,
              padding: 12,
              displayColors: false,
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                callback: function(value) {
                  if (value >= 1000000) return (value / 1000000) + ' Jt';
                  if (value >= 1000) return (value / 1000) + ' Rb';
                  return value;
                }
              }
            }
          }
        }
      });
    };

    onMounted(renderChart);
    watch(() => props.data, renderChart, { deep: true });

    return {
      chartCanvas,
    };
  },
};
</script>

<style scoped>
.chart-container {
  position: relative;
  height: 300px;
  width: 100%;
}
</style>
