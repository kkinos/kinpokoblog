MakeGitHubCard(Url, Name)

function MakeGitHubCard(url, name) {
    var repo_name = name
    fetch("https://getogp.vercel.app/api?url=" + url,
{
  mode: 'cors'
})
  .then((response) => {
       return response.json()
   })
   .then((result) => {
       MakeCard(result, repo_name);
   })
   .catch((e) => {
       console.log(e)
   })
}

function MakeCard(jsonObj, name) {
    const nameele = document.getElementById(name)
    const title = jsonObj.title
    const url = jsonObj.url
    const description = jsonObj.description
    const imageurl = jsonObj.image

    var repourl = document.createElement("a")
    repourl.href = url

    var img = document.createElement("img")
    img.src = imageurl
    img.style.width = "70%"
    img.style.height = "70%"

    repourl.appendChild(img)
    nameele.appendChild(repourl)
}