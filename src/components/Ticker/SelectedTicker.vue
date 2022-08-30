<template>
  <div>
    <section class="graph">
      <h3 class="graph">selectedTicker.name - USD</h3>
      <div class="axisX axisY graph">
        <div
          class="bar"
          v-for="(bar, index) in normalizedGraph"
          :key="index"
          :style="{ height: `${bar}%` }"
        ></div>
      </div>
      <button class="p-2.5" @click="selectedTicker = null" type="button">
        Close
      </button>
    </section>
  </div>
</template>
<script>
export default {
  data() {
    return {
      ticker: "",
      selectedTicker: null,
      graph: [],
    };
  },
  methods: {
    select() {
      this.$emit("selected-ticker", this.ticker);
      this.ticker = " ";
    },
  },
  computed: {
    normalizedGraph() {
      const maxValue = Math.max(...this.graph);
      const minValue = Math.min(...this.graph);
      if (maxValue === minValue) {
        return this.graph.map(() => 50);
      } else {
        return this.graph.map(
          (price) => 5 + ((price - minValue) * 95) / (maxValue - minValue)
        );
      }
    },
  },
  watch: {
    selectedTicker() {
      this.graph = [];
    },
  },
};
</script>
