// ts-node index.ts
import fetch from 'node-fetch';


// API call returns max 1000 products
// Price between $0 and $100 000
// Query parameters -> minPrice, maxPrice

// GOAL: Get all products into array called "products"

/*
{
    "total": 99999, //How many products for CERTAIN price range
    "count": 1000, //How many were returned from API, max 1000
    "products": [{},{}..{}] //Array of products, of length COUNT
}
*/


//JSON type
type typeAPI = {
    "total": number,
    "count": number,
    "products": object[]
}

let products:object[] = []; //Final array of products
let allItems:number = 0; //Total amount of items needed to fetch
let minPrice:number = 0;
let maxPrice:number = 100000;
let fetchedItems:number = 0; //Number of already fetched items
let firstFetch:boolean = true;

async function fetchAPI(url:string) {

    const response = await fetch(url, {
    method: 'GET',
    headers: {
        Accept: 'application/json',
    },
    });

    if(!response.ok) {
        throw new Error(`Error! status: ${response.status}`);
    }

    const result = (await response.json());

    return result;    
}

async function divideAndConquer(min:number, max:number){
    
    let res:typeAPI = await fetchAPI('https://api.ecommerce.com/products?minPrice='+min+'&maxPrice='+max);
    
    //First fetch will get total number of items
    if(firstFetch) {
        allItems = res.total;
        firstFetch = false;
    }

    //Add non redundant products to final array,
    for(let i = 0; i < res.products.length; i++) {
        if(!products.includes(res.products[i])) {
            products.push(res.products);
            fetchedItems += 1;
        }
    }

    //All items are not fetched -> divide again
    if(allItems !== fetchedItems) {
        divideAndConquer(min, max/2); //Lower end, starts min = 0, max = 50
        divideAndConquer(max/2, max); //Higher end, starts min = 50, max = 100
    } else {
        console.log(products)
    }
}

function getAllItems() {
    
    divideAndConquer(minPrice, maxPrice);
    
}

getAllItems();