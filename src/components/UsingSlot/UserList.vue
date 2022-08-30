<template>
  <input type="text" placeholder="filter..." />
  <hr />
  <ul>
    <li v-for="user in filteredUsers" :key="user.id">
      {{ user.name }} {{ user.username }}
    </li>
  </ul>
</template>
<script>
export default {
  props: {
    users: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      filter: "",
    };
  },
  computed: {
    filteredUsers() {
      return this.filter
        ? this.users.filter((u) =>
            this.fields.some((v) =>
              u[v].toLowerCase().includes(this.filter.toLowerCase())
            )
          )
        : this.users;
    },
  },
};
</script>
