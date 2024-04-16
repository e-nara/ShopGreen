//Declare all DOM Elements

const homeNav = document.querySelector('#home-nav');
const homePage = document.querySelector('#home-page');
homeNav.root = homePage;

const listNav = document.querySelector('#list-nav');
const listPage = document.querySelector('#list-page');
listNav.root = listPage;

const searchNav = document.querySelector('#search-nav');
const searchPage = document.querySelector('#search-page');
searchNav.root = searchPage;


const searchBar = document.getElementById('input-search');
const searchOutput = document.getElementById('search-output');

const locationChoice = document.getElementById('country-select');

const outputList = document.getElementById('list-output');
const shoppingListOutput = document.getElementById('shopping-list-output');
const resultsText = document.getElementById('results-text');

const list = document.getElementById('infinite-list');

searchBar.addEventListener('ionInput', handleSearch);
locationChoice.addEventListener('ionChange', reload);

var currentCountry;
var pageCount = 1; //page count is 1 onload. iterates if ion infinite scroll is triggered.

console.log("connected");
reload(); //on load update the browse food display
updateShoppingList();

function reload(){
    getDetails(locationChoice.value,1).then(updateDisplay);
}

locationChoice.innerHTML = `${countries.map(country => `
            
<ion-select-option value="${country.id}">${country.name}</ion-select-option>

`).join('')}`;


// ---- Whole API CALL --- //

function getDetails(country,page){

    console.log(locationChoice.value);
    return fetch(`https://world.openfoodfacts.net/api/v2/search/q?fields=code,product_name,brands,attribute_groups,packagings,image_url,ecoscore_data,agribalyse,countries_tags_en&packagings_complete=1&origins_tags=${country}&countries=${country}&page=${page}`)

    .then(getJson)
    .catch(reportError);
    
}
function getJson(apiResponse){

    return apiResponse.json();

}
function reportError(err){
    console.log("API FETCH ERROR:" + err);
}

// --- Call the API for 1 product -- //
function getProductByBarcode(barcode){

    return fetch(`https://world.openfoodfacts.net/api/v2/product/${barcode}/q?fields=code,product_name,brands,attribute_groups,packagings,image_url,ecoscore_data,agribalyse,countries_tags_en&countries_tags_en=united-kingdom`)
    .then(getJson)
    .catch(reportError);
    
}

//process the response further
function updateDisplay(jsonObj, append = false) {
    // Save the API response to local storage for development purposes
    let jsonObjStringify = JSON.stringify(jsonObj);
    localStorage.setItem('apiResponse', jsonObjStringify);

    // Extract the products from the API response
    let productArray = jsonObj.products;

    // append is false on first load
    if (!append) {
        productsData = productArray;
        resultsText.innerHTML = `${jsonObj.count} results for items originating from ${locationChoice.value}`
    } else {
        // append is true when scrolling
        productsData = productsData.concat(productArray); //continually add to productsdata.
    }

    // Generate HTML for the products
    let productListHTML = productArray.map(product => `
        <ion-card button onclick='showDetailsHome("${product.code}")'>
            <div class="flex">
                <img class="card-img" src="${product.image_url}" alt="Image Description">
                <ion-card-content class="card-details">
                    <ion-card-title class="product-list-title">${product.product_name}</ion-card-title>
                    <ion-card-subtitle>${product.brands}</ion-card-subtitle>
                    <ion-button onclick="addToShoppingList('${product.code}', event)">Add to Shopping List</ion-button>
                </ion-card-content>
            </div>
        </ion-card button>
    `).join('\n');

    // If append is false, meaning it's not called from infinite scrolling, replace the entire product list
    if (!append) {
        list.innerHTML = productListHTML;
    } else {
        // If append is true, meaning it's called from infinite scrolling, append new products to the existing list
        list.innerHTML += productListHTML;
    }

    // Increment the page count for infinite scrolling
    pageCount++;
}

//-- Infinite Scroll --//
// Sampled from Ionic docs
const infiniteScroll = document.querySelector('ion-infinite-scroll');
infiniteScroll.addEventListener('ionInfinite', (event) => {
    setTimeout(() => {
        // Load more pages when infinite scroll is triggered
        getDetails(locationChoice.value, pageCount + 1).then(jsonObj => updateDisplay(jsonObj, true));
        event.target.complete();
    }, 500); // Distance of 500
});



//-- handle search --//
function handleSearch(){
    let barcode = searchBar.value;
    console.log(barcode);
    getProductByBarcode(barcode).then(function(productData){
        console.log(productData.product);
        searchOutput.innerHTML = `
        <ion-card>
            <ion-card-header>
                <ion-card-title>${productData.product.product_name}</ion-card-title>
                <ion-card-subtitle>${productData.product.brands}</ion-card-subtitle>
            </ion-card-header>
        
            <ion-img src="${productData.product.image_url}">
            </ion-img>

            <ion-card-content>
                <ion-list>
                ${productData.product.packagings.map(item => `
                
                        <ion-item >
                            <ion-label>${item.shape}:</ion-label>
                            <ion-label id="label-city">${item.material}</ion-label>
                        </ion-item>
                
                `).join('')}
                </ion-list>
            </ion-card-content>
        </ion-card>
        `
    }).catch(function(error){
        reportError(error);

        searchOutput.innerHTML = `Sorry, this item doesn't seem to be in our database.`
    });
}



//-- Generate product Details on a new screen --//
const navHome = document.getElementById('home-nav');
const navList = document.getElementById('list-nav');
const navSearch = document.getElementById('search-nav');


async function showDetailsHome(code) {
    console.log("Showing details of: " + code);
    console.log(productsData);
    try {
        // Find the product asynchronously
        let product = productsData.find(object => object.code === code);

        console.log(product);

        if (!product) {
            throw new Error('Product not found');
        }

        // Push the route once the product is found
        await navHome.push('nav-detail', { product });
    } catch (error) {
        console.error('Error showing details:', error);
    }
}

//-- Show Details --//
//using the barcode as a reference, show a screen with detailed info on the product

async function showDetailsList(code) {
    try {
        // Find the product asynchronously
        let product = productsData.find(object => object.code === code);

        if (!product) {
            throw new Error('Product not found');
        }

        // Push the route once the product is found
        await navList.push('nav-detail', { product });
    } catch (error) {
        console.error('Error showing details:', error);
    }
}

//-- Add to Shopping List --//

function addToShoppingList(productCode, event){
    event.stopPropagation();
    console.log("called");
    array = [];
    array.push(productCode);
    console.log(array);

    //This whole thing is a mess. Fix later

    if(!localStorage.getItem('shoppingList')){
        console.log('empty');
        let array = [productCode];
        localStorage.setItem('shoppingList', JSON.stringify(array));
    } else{
        console.log('not empty');
        let currentStorage = localStorage.getItem('shoppingList'); //string
        //console.log("currentStorage: "+ currentStorage);
        
        let parseStorage = JSON.parse(currentStorage); // array ? 
        if(!parseStorage.includes(productCode)){ //we only want to add unique items to the shopping list
            console.log("added to shopping list")
            parseStorage.push(productCode);
            //console.log(parseStorage);
            localStorage.setItem('shoppingList', JSON.stringify(parseStorage));
        } else {
            console.log("already in shopping list");
        }
    }
    updateShoppingList(); //add this product to the list 
}

function deleteFromShoppingList(code){
    event.stopPropagation();
    console.log("Deleting: "+ code +" from shopping list");
    let currentStorage = localStorage.getItem('shoppingList'); //string
    let parseStorage = JSON.parse(currentStorage);
    console.log("current list: " + parseStorage)
    let newArray = parseStorage.filter(function(id){
        return id != code;
    })

    console.log("filtered: " + newArray);

    localStorage.setItem('shoppingList', JSON.stringify(newArray));

    updateShoppingList();
}

//-- Populate Shopping List --//

function updateShoppingList(){

    let codeList = JSON.parse(localStorage.getItem('shoppingList'));
    console.log("Shopping List: " + codeList);

    //clear the existing content of shoppingListOutput
    shoppingListOutput.innerHTML = "";

    if(!codeList){
        console.log("nothing in the shopping list");
        shoppingListOutput.innerHTML = `
            
            <ion-item>
                Nothing in the shopping list yet.
            </ion-item>
            
            `
    } else {
        for(barcode of codeList){
            getProductByBarcode(barcode).then(function(productData){
                console.log(productData.product);
                shoppingListOutput.innerHTML += `
                
                <ion-item button onclick="showDetailsList('${productData.product.code}')">
                        <ion-avatar slot="start">
                            <img src="${productData.product.image_url}">
                        </ion-avatar>
                        <ion-label><h1>${productData.product.product_name}</h1></ion-label>
                        <ion-button slot="end" onclick='deleteFromShoppingList("${productData.product.code}", event)'> - </ion-button>
                    </ion-item button>
                
                `
            }).catch(reportError);
        }
    }

    //for each barcode fetch the data and add it to the an array of objs
    //take that array of objs and map it to the innerhtml
    

}



