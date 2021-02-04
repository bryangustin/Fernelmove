const  url = "http://www.odwb.be/api"; 
const fernelmont = "/datasets/1.0/search/?q="
const sport = "/records/1.0/search/?dataset=sports&q="
const associations = "/records/1.0/search/?dataset=associations&q="
const convivialite = "/records/1.0/search/?dataset=lieux-de-convivialite-fernelmont&q=" // GEO
const ecoles = "/records/1.0/search/?dataset=ecoles-de-fernelmont&q=" // GEO
const livres = "/records/1.0/search/?dataset=boites-a-livres&q=" //GEO

// const musique =
// const cinema =
// const jeux_vidéo =
// const livres =
// const scout = 
// const jeux_société =
// const art =
// const internet =

// fetch(url+fernelmont)
// .then(response => response.json())
// .then(data => {
//     console.log(data)
// })

fetch(url+convivialite)
.then(response => response.json())
.then(data => {
    lieu = []
    data.records.forEach(element =>{
        lieu.push(element)
        //lieu.push({text,[element.geometry.coordinates[0],element.geometry.coordinates[1]]})

    })
    console.log(lieu);
})
