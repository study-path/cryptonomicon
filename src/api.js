export function loadUsers() {
  return fetch("https://jsonplaceholder.typicode.com/users").then((data) => {
    data.json;
  });
}
