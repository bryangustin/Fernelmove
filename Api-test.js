const sport = "/records/1.0/search/?dataset=sports&q="
// const musique =
// const cinema =
// const jeux_vidéo =
// const livres =
// const scout = 
// const jeux_société =
// const art =
// const internet =
const  url = "http://www.odwb.be/api"+sport; 


fetch(url)
.then(response => response.json())
.then(data => {
    console.log(data)
})