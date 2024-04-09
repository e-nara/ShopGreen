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

const list = document.getElementById('infinite-list');

searchBar.addEventListener('ionInput', handleSearch);
locationChoice.addEventListener('ionChange', reload);

var pageCount = 1; //page count is 1 onload. iterates if ion infinite scroll is triggered.

console.log("connected");
reload(); //on load update the browse food display
updateShoppingList();

function reload(){
    getDetails(locationChoice.value,1).then(updateDisplay);
}


// ---- Whole API CALL --- //

function getDetails(country,page){

    console.log(locationChoice.value);
    return fetch(`https://world.openfoodfacts.net/api/v2/search/q?fields=code,product_name,brands,attribute_groups,packagings,image_url,ecoscore_data,agribalyse,countries_tags_en&origins_tags=${country}&page=${page}`)

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
function updateDisplay(jsonObj){
    //console.log(jsonObj);

    //save the apiresponse to localstorage in case API goes down and we still need to test -- for development
    let jsonObjStringify = JSON.stringify(jsonObj);
    localStorage.setItem('apiResponse', jsonObjStringify)

    let productArray = jsonObj.products;
    productsData = productArray;

    list.innerHTML = `
        ${productArray.map(product => `
                
                <ion-card button onclick="showDetailsHome('${product.product_name}')">
                      <div class="flex">
                        <img class="card-img" src="${product.image_url}" alt="Image Description">
                        
                        <ion-card-content class="card-details">
                          <h2>${product.product_name}</h2>
                          <p>property 1</p>
                          
                        </ion-card-content>
                        <ion-button class="card-button ion-text-wrap" onclick="addToShoppingList('${product.code}')">Add to Shopping List</ion-button>
                      </div>
                </ion-card button>
                 
                `).join('\n')}

    `

}

function loadMorePages(jsonObj){
    //console.log(jsonObj);

    //save the apiresponse to localstorage in case API goes down and we still need to test -- for development
    let jsonObjStringify = JSON.stringify(jsonObj);
    localStorage.setItem('apiResponse', jsonObjStringify)

    let productArray = jsonObj.products;
    productsData = productArray;

    list.innerHTML += `
        ${productArray.map(product => `
                
                <ion-card button onclick="showDetailsHome('${product.product_name}')">
                      <div class="flex">
                        <img class="card-img" src="${product.image_url}" alt="Image Description">
                        
                        <ion-card-content class="card-details">
                          <h2>${product.product_name}</h2>
                          <p>property 1</p>
                          
                        </ion-card-content>
                        <ion-button class="card-button ion-text-wrap" onclick="addToShoppingList('${product.code}')">Add to Shopping List</ion-button>
                      </div>
                </ion-card button>
                 
                `).join('\n')}

    `
    pageCount++;

}



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
    }).catch(reportError);
}



//-- Generate product Details on a new screen --//
const navHome = document.getElementById('home-nav');
const navList = document.getElementById('list-nav');
const navSearch = document.getElementById('search-nav');


async function showDetailsHome(aTitle) {

    let product = new Object;

    for (object of productsData){ //search for a match to pass
        if(object.product_name === aTitle){ //if found the right animal
            product = object; //assign animal object to the right animal from the array in data
        }
    }

    navHome.push('nav-detail', {product}); //when clicked render this route, pass down the animal object

    //console.log(aTitle);
}

async function showDetailsList(aTitle) {

    let product = new Object;

    for (object of productsData){ //search for a match to pass
        if(object.product_name === aTitle){ //if found the right animal
            product = object; //assign animal object to the right animal from the array in data
        }
    }

    navList.push('nav-detail', {product}); //when clicked render this route, pass down the animal object

    //console.log(aTitle);
}




//-- Add to Shopping List --//

function addToShoppingList(productCode){
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
            updateShoppingList(); //add this product to the list 
        } else {
            console.log("already in shopping list");
        }
    }

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
                
                <ion-item button onclick="showDetailsList('${productData.product.product_name}')">
                        <ion-avatar slot="start">
                            <img src="${productData.product.image_url}">
                        </ion-avatar>
                        <ion-label><h1>${productData.product.product_name}</h1></ion-label>
                    </ion-item button>
                
                `
            }).catch(reportError);
        }
    }

    //for each barcode fetch the data and add it to the an array of objs
    //take that array of objs and map it to the innerhtml
    

}



//-- Infinite Scroll --//
//sampled from ionic docs
  const infiniteScroll = document.querySelector('ion-infinite-scroll');
  infiniteScroll.addEventListener('ionInfinite', (event) => {
    setTimeout(() => {
        getDetails(locationChoice.value,pageCount+1).then(loadMorePages)
      event.target.complete();
    }, 500); //distance of 500
  });


