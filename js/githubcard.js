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
  function MakeCard(jsonObj, name) {
    const target_ele = document.getElementById(name);
    const title = jsonObj.title;
    const url = jsonObj.url;
    const description = jsonObj.description;
    const image_url = jsonObj.image;
    var ele_a = document.createElement("a");
    ele_a.href = url;
    var ele_img = document.createElement("img");
    ele_img.src = image_url;
    ele_img.style.width = "70%";
    ele_img.style.height = "70%";
    ele_a.appendChild(ele_img);
    target_ele.appendChild(ele_a);
  }
})();
