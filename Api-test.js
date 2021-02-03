const fernelmont = "/datasets/1.0/search/?q="

const sport = "/records/1.0/search/?dataset=sports&q="
const culture = "/records/1.0/search/?dataset="
// const musique =
// const cinema =
// const jeux_vidéo =
// const livres =
// const scout = 
// const jeux_société =
// const art =
// const internet =
const  url = "http://www.odwb.be/api"; 


fetch(url+culture)
.then(response => response.json())
.then(data => {
    console.log(data)
})

fetch(url+fernelmont)
.then(response => response.json())
.then(data => {
    console.log(data)
})