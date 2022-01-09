(() => {
  // <stdin>
  MakeGithubCard(Url, Name);
  function MakeGithubCard(url, name) {
    var repo_name = name;
    fetch("https://getogp.vercel.app/api?url=" + url, {
      mode: "cors"
    }).then((response) => {
      return response.json();
    }).then((result) => {
      MakeCard(result, repo_name);
    }).catch((e) => {
      console.log(e);
    });
  }
  function MakeCard(json, name) {
    const target_elem = document.getElementById(name);
    const title = json.title;
    const url = json.url;
    const description = json.description;
    const image_url = json.image;
    var elem_a = document.createElement("a");
    elem_a.href = url;
    var elem_img = document.createElement("img");
    elem_img.src = image_url;
    elem_img.style.width = "70%";
    elem_img.style.height = "70%";
    elem_a.appendChild(elem_img);
    target_elem.appendChild(elem_a);
  }
})();
