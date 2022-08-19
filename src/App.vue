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
      <AddButton />
    </div>
    <template v-if="tickers.length">
      <hr class="w-full border-t border-gray-600 my-4" />
      <div>
        <button class="p-10" v-if="page > 1" @click="page = page - 1">
          Back
        </button>
        <button class="mx-2" v-if="hasNextPage" @click="page = page + 1">
          Front
        </button>
        <div>Filter :<input v-model="filter" @input="page = 1" /></div>
      </div>
      <hr class="w-full border-t border-gray-600 my-4" />
      <div class="container">
        <div
          class="flex flex-col justify-items-center"
          :class="{
            'green-border': selectedTicker === t,
          }"
          v-for="(t, index) in paginatedTickers"
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
    <section v-if="selectedTicker" class="graph">
      <h3 class="graph">{{ selectedTicker.name }} - USD</h3>
      <div class="axisX axisY graph">
        <div
          class="bar"
          v-for="(bar, index) in normalizedGraph"
          :key="index"
          :style="{ height: `${bar}%` }"
        ></div>
      </div>
      <button @click="selectedTicker = null" type="button">Close</button>
    </section>
  </div>
</template>

<script>
import AddButton from "./components/AddButton.vue";
export default {
  name: "App",
  components: {
    AddButton,
  },
  data() {
    return {
      ticker: "",
      filter: "",
      tickers: [],
      selectedTicker: null,
      graph: [],
      existTicker: false,
      page: 1,
    };
  },
  created() {
    const windowData = Object.fromEntries(
      new URL(window.location).searchParams.entries()
    );

    if (windowData.filter) {
      this.filter = windowData.filter;
    }

    if (windowData.page) {
      this.page = windowData.page;
    }

    const tickersData = localStorage.getItem("cryptonomicon-list");

    if (tickersData) {
      this.tickers = JSON.parse(tickersData);
      this.tickers.forEach((ticker) => {
        this.subscribeToUpdates(ticker.name);
      });
    }
  },
  methods: {
    subscribeToUpdates(tickerName) {
      setInterval(async () => {
        const f = await fetch(
          `https://min-api.cryptocompare.com/data/price?fsym=${tickerName}&tsyms=USD&api_key=4abdfd2ec08d3c936b78a1ac9b895bccdee3b7adf098d66e096ad87c26970636`
        );
        const data = await f.json();

        this.tickers.find((t) => t.name === tickerName).price =
          data.USD > 1 ? data.USD.toFixed(2) : data.USD.toPrecision(2);

        if (this.selectedTicker?.name === tickerName) {
          this.graph.push(data.USD);
        }
      }, 80000);

      this.ticker = "";
    },
    add() {
      const currentTicker = {
        name: this.ticker,
        price: "-",
      };

      this.tickers = [...this.tickers, currentTicker];

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

      this.subscribeToUpdates(currentTicker.name);
    },
    select(ticker) {
      this.selectedTicker = ticker;
    },

    deleteTicker(tickerToRemove) {
      this.tickers = this.tickers.filter((t) => t != tickerToRemove);
      if (this.selectedTicker === tickerToRemove) {
        this.selectedTicker = null;
      }
    },
  },
  computed: {
    startIndex() {
      return (this.page - 1) * 6;
    },
    endIndex() {
      return this.page * 6;
    },
    filteredTickers() {
      return this.tickers.filter((ticker) => ticker.name.includes(this.filter));
    },
    paginatedTickers() {
      return this.filteredTickers.slice(this.startIndex, this.endIndex);
    },
    hasNextPage() {
      return this.filteredTickers.length > this.endIndex;
    },
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
    pageStateOptions() {
      return {
        filter: this.filter,
        page: this.page,
      };
    },
  },
  watch: {
    tickers() {
      localStorage.setItem("cryptonomicon-list", JSON.stringify(this.tickers));
    },
    selectedTicker() {
      this.graph = [];
    },
    filter() {
      this.page = 1;
    },
    page() {
      window.history.pushState(
        null,
        document.title,
        `${window.location.pathname}?filter=${this.filter}&page=${this.page}`
      );
    },
    pageStateOptions(value) {
      window.history.pushState(
        null,
        document.title,
        `${window.location.pathname}?filter=${value.filter}&page=${value.page}`
      );
    },
    paginatedTickers() {
      if (this.paginatedTickers.length === 0 && this.page > 1) {
        this.page -= 1;
      }
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
