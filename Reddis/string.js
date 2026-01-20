const client = require("./client");

(async () => {
//   await client.set("msg:6", "hello how are you");a
await client.expire("msg:6",10)
  const result = await client.get("msg:6");
  console.log(result);
})();
