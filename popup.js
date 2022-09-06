const host = "localhost:8080";

// イベント
button.addEventListener("click", async () => {
  console.log("button clicked");
  axios.get("http://" + host + "/uuid")
    .then((res) => {
      console.log(res);
    });
});
