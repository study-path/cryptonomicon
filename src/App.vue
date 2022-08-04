<template>
  <div>
    <div class="ticker">
      <label class="bg-orange-900">Ticker</label>
      <input
        type="text"
        v-model="ticker"
        @keydown.enter="add"
        name="ticker"
        id="ticker"
        required
      />
      <select v-model="tickers">
        <option
          v-for="tickerName in tickers"
          :key="tickerName.id"
          value="tickerName"
        ></option>
      </select>
      <div class="p-10 bg-slate-300 rounded-md">{{ ticker.toUpperCase() }}</div>

      <div v-if="existTicker" for="" class="decoration-red-50">
        Ticker already added
      </div>
      <button @click="add">Add</button>
    </div>
    <template v-if="tickers.length">
      <hr />

      <div class="container">
        <div
          class="flex flex-col justify-items-center"
          :class="{
            'green-border': sel === t,
          }"
          v-for="(t, index) in tickers"
          :key="index"
          @click="select(t)"
        >
          <div>{{ t.name.toUpperCase() }} - USD</div>
          <div>{{ t.price }}</div>

          <button @click.stop="deleteTicker(t)">Delete</button>
        </div>
      </div>
      <hr />
    </template>
    <section v-if="sel" class="graph">
      <h3 class="graph">{{ sel.name }} - USD</h3>
      <div class="axisX axisY graph">
        <div
          class="bar"
          v-for="(bar, index) in normalizeGraph()"
          :key="index"
          :style="{ height: `${bar}%` }"
        ></div>
      </div>
      <button @click="sel = null" type="button">Close</button>
    </section>
  </div>
</template>

<script>
export default {
  name: "App",
  data() {
    return {
      ticker: "",
      tickers: [],
      sel: null,
      graph: [],
      existTicker: false,
    };
  },
  created() {
    const tickersData = localStorage.getItem("cryptonomicon-list");
    if (tickersData) {
      this.tickers = JSON.parse(tickersData);
    }
  },

  methods: {
    add() {
      const currentTicker = {
        name: this.ticker,
        price: "-",
      };

      localStorage.setItem("cryptonomicon-list", JSON.stringify(this.tickers));

      if (this.tickers.length) {
        const exist = this.tickers.filter((t) => t.name === currentTicker.name);
        if (exist.length) {
          this.existTicker = true;
        } else {
          this.existTicker = false;
          this.tickers.push(currentTicker);
        }
      } else {
        this.existTicker = false;
        this.tickers.push(currentTicker);
      }

      setInterval(async () => {
        const f = await fetch(
          `https://min-api.cryptocompare.com/data/price?fsym=${currentTicker.name}&tsyms=USD&api_key=42900433546e3911f97fcb744153bb343102a612c5cf36f1a948b460f9f1c8d2`
        );
        const data = await f.json();
        this.tickers.find((t) => t.name === currentTicker.name).price =
          data.USD > 1 ? data.USD.toFixed(2) : data.USD.toPrecision(2);

        if (this.sel?.name === currentTicker.name) {
          this.graph.push(data.USD);
        }
      }, 3000);

      this.ticker = "";
    },

    select(ticker) {
      this.sel = ticker;
      this.graph = [];
    },

    deleteTicker(tickerToRemove) {
      this.tickers = this.tickers.filter((t) => t != tickerToRemove);
    },
    normalizeGraph() {
      const maxValue = Math.max(...this.graph);
      const minValue = Math.min(...this.graph);
      return this.graph.map(
        (price) => 5 + ((price - minValue) * 95) / (maxValue - minValue)
      );
    },
  },
};
</script>

<style scoped>
.ticker {
  padding: 10px;
}

label {
  padding: 5px;
}

input {
  margin: 5px;
}
button {
  margin: 10px 0;
}

.container {
  display: flex;
  justify-content: space-around;
  align-items: center;
}

.inner {
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  flex-wrap: nowrap;
  align-content: space-around;
  align-items: center;
  border: 1px solid grey;
  padding: 10px;
  width: 150px;
  height: 100px;
}
dl {
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
  gap: 10px;
}
.green-border {
  border: 3px solid green;
  padding: 5px;
}
.bar {
  background-color: rgb(149, 235, 235);
  border: 1px solid rgb(75, 190, 224);
  padding: 0 10px;
}
/* .box {
  display: flex;
  flex-direction: column;
  align-items: center;
} */

.axisX {
  border-bottom: 1px groove gray;
  width: 300px;
}
.axisY {
  display: flex;
  align-items: flex-end;
  border-left: 1px groove gray;
  height: 300px;
}
</style>
