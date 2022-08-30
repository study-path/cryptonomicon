<template>
  <div class="ticker">
    <label for="wallet" class="block text-sm font-medium text-gray-700"
      >Ticker</label
    >

    <input
      type="text"
      v-model="ticker"
      @keydown.enter="add"
      name="ticker"
      id="ticker"
      required
      placeholder="Ex., DOGE"
      class="mr-10"
    />
    <select v-model="tickers">
      <option
        v-for="tickerName in tickers"
        :key="tickerName.id"
        value="tickerName"
      ></option>
    </select>

    <div v-if="existTicker" for="" class="decoration-red-50">
      Ticker already added
    </div>
    <div>
      <AddButton type="button" @click="add" :disabled="disabled" class="my-4" />
    </div>
  </div>
</template>
<script>
import AddButton from "./AddButton.vue";
export default {
  name: "App",
  components: {
    AddButton,
  },
  props: {
    disabled: {
      type: Boolean,
      required: false,
      default: false,
    },
  },

  emits: {
    "add-ticker": (value) => typeof value === "string" && value.length > 0,
  },

  data() {
    return {
      ticker: "",
    };
  },
  methods: {
    add() {
      if (this.ticker.length === 0) {
        return;
      }
      this.$emit("add-ticker", this.ticker);
      this.ticker = " ";
    },
  },
};
</script>
