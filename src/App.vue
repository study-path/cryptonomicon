<template>
  <div>
    <div class="p-2.5 flex flex-auto justify-center gap-x-8">
      <router-link to="/tickers" class="bg-slate-200 rounded p-2 mx-4"
        >Go to Ticker</router-link
      >
      <router-link to="/users" class="bg-slate-200 rounded p-2 mx-4"
        >Go to Users</router-link
      >
    </div>
    <router-view></router-view>
  </div>
</template>
