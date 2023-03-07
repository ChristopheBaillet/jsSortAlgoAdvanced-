let csvFile;
let listVille = [];
let nbPermutation = 0;
let nbComparaison = 0;

document.querySelector("#read-button").addEventListener('click', function () {
    csvFile = document.querySelector("#file-input").files[0];
    let reader = new FileReader();
    reader.addEventListener('load', function (e) {
        // récupération de la liste des villes
        listVille = getArrayCsv(e.target.result);

        // Calcul de la distance des villes par rapport à Grenoble
        listVille.forEach(ville => {
            ville.distanceFromGrenoble = distanceFromGrenoble(ville);
        });
        // Tri
        const algo = $("#algo-select").val();
        nbPermutation = 0;
        nbComparaison = 0;
        sort(algo);

        // Affichage 
        displayListVille()
    });
    reader.readAsText(csvFile)
})

/**
 * Récupére la liste des villes contenu dans le fichier csv
 * @param csv fichier csv brut
 * @returns la liste des villes mis en forme
 */
function getArrayCsv(csv) {
    let listLine = csv.split("\n")
    listVille = [];
    let isFirstLine = true;
    listLine.forEach(line => {
        if (isFirstLine || line === '') {
            isFirstLine = false;
        } else {
            let listColumn = line.split(";");
            listVille.push(
                new Ville(
                    listColumn[8],
                    listColumn[9],
                    listColumn[11],
                    listColumn[12],
                    listColumn[13],
                    0
                )
            );
        }
    });
    return listVille;
}

/**
 * Calcul de la distance entre Grenoble et une ville donnée
 * @param ville ville
 * @returns la distance qui sépare la ville de Grenoble
 */
function distanceFromGrenoble(ville) {
    let r = 6384;
    const grenoble = {
        longitude: 5.7167,
        latitude: 45.1667,
    }
    return 2 * r * Math.asin(Math.sqrt(h(ville.latitude, ville.longitude, grenoble.latitude, grenoble.longitude)));
}

/**
 * Retourne vrai si la ville i est plus proche de Grenoble
 * par rapport à j
 * @param {*} i distance de la ville i
 * @param {*} j distance de la ville j
 * @return vrai si la ville i est plus proche
 */
function isLess(i, j) {
    nbComparaison++;
    return listVille[i].distanceFromGrenoble < listVille[j].distanceFromGrenoble;
}

/**
 * interverti la ville i avec la ville j dans la liste des villes
 * @param {*} i 
 * @param {*} j
 * @param listVille
 */
function swap(i, j) {
   const temp = listVille[i];
   listVille[i] = listVille[j];
   listVille[j] = temp;
    nbPermutation++
}

function sort(type) {
    switch (type) {
        case 'insert':
            insertionSort();
            break;
        case 'select':
            selectionSort();
            break;
        case 'bubble':
            bubbleSort();
            break;
        case 'shell':
            shellSort();
            break;
        case 'merge':
            mergesort();
            break;
        case 'heap':
            heapSort();
            break;
        case 'quick':
            quicksort();
            break;
        case 'bubbleOptimized':
            bubbleSortOptimised();
            break;
    }
}

function bubbleSortOptimised() {
    let sorted = false;
    let passage = 0;

    while (!sorted){
        sorted = true;
        for (let i = 0; i < listVille.length - passage - 1; i++){
            if (isLess(i + 1, i)){
                swap(i, i + 1);
                sorted = false;
            }
        }
        passage++;
        nbComparaison++;
    }
}

function bubbleSort() {
    let sorted = false;

    while (!sorted){
        sorted = true;
        for (let i = 0; i < listVille.length - 1; i++){
            if (isLess(i + 1, i)){
                swap(i, i + 1);
                sorted = false;
            }
        }
        nbComparaison++;
    }
}

function heapSort() {
    organize();
    for (let i = listVille.length - 1; i >= 0; i--) {
        swap(0, i);
        moveDown(i, 0);
    }
}

function organize() {
    for (let i = 0; i < listVille.length; i++) {
        moveUp(i);
    }
}

function moveUp(index) {
    const roundedIndex = Math.floor(index / 2);
    if (isLess(roundedIndex, index)) {
        swap(index, roundedIndex);
        moveUp(roundedIndex);
    }
}

function moveDown(element, index) {
    const formule = 2 * index + 1;
    let max;
    if (formule < element) {
        max = isLess((2 * index), formule) ? formule : 2 * index;
        if (isLess(index, max)) {
            swap(max, index);
            moveDown(element, max);
        }
        nbComparaison++;
    }
}

function insertionSort(ecart = 1) {
    for (let i = ecart; i < listVille.length; i++){
        const currentValue = listVille[i];
        let position = i;
        while (position > ecart - 1 && listVille[position - ecart].distanceFromGrenoble > currentValue.distanceFromGrenoble){
            listVille[position] = listVille[position - ecart];
            position = position - ecart;
            nbPermutation++;
            nbComparaison++;
        }
        listVille[position] = currentValue;
    }
}

function selectionSort() {
    for (let i = 0; i < listVille.length; i++){
        let minIndex = i;
        for (let j = i + 1; j < listVille.length; j++){
            if (isLess(j, minIndex)){
                minIndex = j;
            }
        }
        swap(i, minIndex)
    }
}

function shellSort() {
    let ecart = 0;
    while (ecart < listVille.length){
        ecart = ecart * 3 + 1;
        nbComparaison++;
    }

    while (ecart !== 0){
        ecart = Math.floor(ecart / 3);
        insertionSort(ecart);
        nbComparaison++;
    }
}

function mergesort() {
    console.log("mergesort - implement me !");
}


function quicksort() {
    console.log("quicksort - implement me !");
}

/** MODEL */

class Ville {
    constructor(nom_commune, codes_postaux, latitude, longitude, dist, distanceFromGrenoble) {
        this.nom_commune = nom_commune;
        this.codes_postaux = codes_postaux;
        this.latitude = latitude;
        this.longitude = longitude;
        this.dist = dist;
        this.distanceFromGrenoble = distanceFromGrenoble;
    }
}

/** AFFICHAGE */
function displayPermutation(nbPermutation) {
    document.getElementById('permutation').innerHTML = nbPermutation + ' permutations';
}

function displayComparaison(nbComparaison) {
    document.getElementById('comparaison').innerHTML = nbComparaison + ' comparaisons';
}

function displayListVille() {
    document.getElementById("navp").innerHTML = "";
    displayPermutation(nbPermutation);
    displayComparaison(nbComparaison)
    let mainList = document.getElementById("navp");
    for (let i = 0; i < listVille.length; i++) {
        let item = listVille[i];
        let elem = document.createElement("li");
        elem.innerHTML = item.nom_commune + " - \t" + Math.round(item.distanceFromGrenoble * 10000) / 10000 + ' m';
        mainList.appendChild(elem);
    }
}

function hav(angle){
    return (1 - Math.cos(angle)) / 2;
}

function h(lat1, lon1, lat2, lon2){
    return hav(lat2-lat1) + Math.cos(lat1) * Math.cos(lat2) * hav(lon2, lon1)
}
