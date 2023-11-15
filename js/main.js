//Cocktail Finder

"use strict";

document.querySelector("#getCocktail").addEventListener("click", getCocktail);
document.querySelector("#lucky").addEventListener("click", getRandomCocktail);
document.querySelector("#ingredient").addEventListener("click", listByIngredient);
document.body.addEventListener("keydown", e => {
    if(e.key === "Enter") {
        document.querySelector("#getCocktail").click();
    }
})

const ingredients = document.querySelector("h3");;
const drinkName = document.querySelector("h2");
const image = document.querySelector("img");
const instructions = document.querySelector("#instr");
const cocktailsContainer = document.querySelector("#cocktails");

let drinkNumber = -1;

let currentCocktail = [];


function getCocktail(fizz) {

    let cocktail = checkForCorrectInput(fizz);

    currentCocktail.unshift(cocktail);
    checkIfDifferentCocktail(cocktail);


    fetch(`https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${cocktail}`)
        .then(res => res.json()) // parse response to JS

        .then(data => {
            console.log(data);
            document.querySelector("#cocktails").style.display = "grid"

            if(drinkNumber === data.drinks.length - 1) { //restart counter if at last item of array
                    drinkNumber = -1;
            }

            while(cocktailsContainer.firstChild) {  //reset cocktail buttons
                cocktailsContainer.removeChild(cocktailsContainer.firstChild);
            }

            document.querySelector("p").innerText = "";

            if(data.drinks.length > 1) {  //create new buttons
                document.querySelector("p").innerText = "Or did you mean..."

                sortDrinkslAphabetically(data.drinks);

                for(let i = 1; i < data.drinks.length; i++) {
                    const newButtton = document.createElement("button");

                    if(data.drinks[i].strAlcoholic === "Non alcoholic") {
                        newButtton.innerText = `${data.drinks[i].strDrink}\n(Non alcoholic)`
                    } else {
                        newButtton.innerText = data.drinks[i].strDrink;
                    }
                    
                    cocktailsContainer.appendChild(newButtton);
                }
                createEventListeners();
            }

            if(cocktailsContainer.childElementCount < 4) {
                document.querySelector("#cocktails").style.display = "flex";
            }
            
            const drinkData = data.drinks[++drinkNumber]; //get the next object in the array

            ingredients.innerText = "Ingredients:";
            drinkName.innerText = drinkData.strDrink; //get Name
                if(drinkData.strAlcoholic === "Non alcoholic") {
                    drinkName.innerText += `\n(Non alcoholic)`;
                }
            image.src = drinkData.strDrinkThumb; //get img
            image.alt = `Image of the cocktail named '${drinkData.strDrink}'`;
            instructions.innerText = drinkData.strInstructions; // get instructions

            displayImage();
            showElements();

            const ulParentElement = document.querySelector("#ingr");
            while(ulParentElement.firstChild) { //remove all of the previous li elements
                ulParentElement.removeChild(ulParentElement.firstChild);
            }

            for(let i = 1; drinkData[`strIngredient${i}`] != null; i++) { //append neccessary new li elements:
                const listItem = document.createElement("li");
                listItem.innerText =  (drinkData[`strMeasure${i}`] || "") + " " + drinkData[`strIngredient${i}`];
                ulParentElement.appendChild(listItem);
            }

            })

        .catch(err => {
            hideElements();
            removeImage();
            alertWrongInput("getCocktail");
            console.log(`error ${err}`);
        });
}



function checkForCorrectInput(input) {
    if((typeof input === "object")) {
        return  document.querySelector("input").value;
    } else {
        if(input.endsWith("(Non alcoholic)")) {
            return input.replace("(Non alcoholic)","")
        } 
        return input;
    }
}

function sortDrinkslAphabetically(drinksArray) {
    drinksArray.sort((a, b) => {
        if(a.strDrink < b.strDrink) return -1;
        else return 1;
    }); 
}

function alertWrongInput(callingFunction) {
    const inputText = document.querySelector("input").value;
    console.log(inputText)
    if(callingFunction === "getCocktail") {
        document.querySelector("p").innerText = `Sorry, we couldn't find a cocktail with '${inputText}' in its name.`;
    } else {
        document.querySelector("p").innerText = `Sorry, we couldn't find a cocktail with the ingredient '${inputText || "nothing"}'.`;
    }             
}

function createEventListeners() {
    const category = document.querySelectorAll("#cocktails > *"); 
    category.forEach(ele => ele.addEventListener("click", (click) => {
        getCocktail(click.target.innerText);
    }));
}

function checkIfDifferentCocktail(drink) {
    if(currentCocktail[0] !== currentCocktail[1]){
        drinkNumber = -1;
        currentCocktail = [drink];
    } else if (currentCocktail.length === 3) {
        currentCocktail.pop();
    }
}

function showElements() {
    drinkName.classList.remove("hidden");
    ingredients.classList.remove("hidden");
    document.querySelector("ul").classList.remove("hidden");
    instructions.style.display = "flex";
}

function hideElements() {
    drinkName.classList.add("hidden");
    ingredients.classList.add("hidden");
    document.querySelector("ul").classList.add("hidden");
    instructions.style.display = "none";   
}

function displayImage() {
    document.querySelector("#img-section").classList.remove("hidden");
}

function removeImage() {
    document.querySelector("#img-section").classList.add("hidden");
}

function clearInput() {
    document.querySelector("#inp").value = null;
}



function getRandomCocktail() {

    clearInput();

    fetch(`https://www.thecocktaildb.com/api/json/v1/1/random.php`)
        .then(res => res.json()) // parse response to JS

        .then(data => {
            console.log(data);
            while(cocktailsContainer.firstChild) {  //reset cocktail buttons
                cocktailsContainer.removeChild(cocktailsContainer.firstChild);
            }

            document.querySelector("p").innerText = "";

            const drinkData = data.drinks[0];

            ingredients.innerText = "Ingredients:";
            drinkName.innerText = drinkData.strDrink; //get Name
            image.src = drinkData.strDrinkThumb; //get img
            image.alt = `Image of the cocktail named '${drinkData.strDrink}'`; //insert alt text
            instructions.innerText = drinkData.strInstructions; // get instructions

            displayImage();
            showElements();

            const ulParentElement = document.querySelector("#ingr");
            while(ulParentElement.firstChild) { //remove all of the previous li elements
                ulParentElement.removeChild(ulParentElement.firstChild);
            }

            for(let i = 1; drinkData[`strIngredient${i}`] != null; i++) { //append neccessary new li elements:
                const listItem = document.createElement("li");
                listItem.innerText =  (drinkData[`strMeasure${i}`] || "") + " " + drinkData[`strIngredient${i}`];
                ulParentElement.appendChild(listItem);
            }
            })

        .catch(err => {
            console.log(`error ${err}`);
        });
}


function listByIngredient() {

    const ingredient = document.querySelector("input").value;

    fetch(`https://www.thecocktaildb.com/api/json/v1/1/filter.php?i=${ingredient}`)
    .then(res => res.json()) // parse response to JS

    .then(data => {
        console.log(data);
        document.querySelector("#cocktails").style.display = "grid";

        while(cocktailsContainer.firstChild) {  //reset cocktail buttons
            cocktailsContainer.removeChild(cocktailsContainer.firstChild);
        }

        document.querySelector("p").innerText = "";

        const ulParentElement = document.querySelector("#ingr");
        while(ulParentElement.firstChild) { //remove all of the previous li elements
            ulParentElement.removeChild(ulParentElement.firstChild);
        }

        removeImage();
        hideElements();

        drinkName.innerText = "";
        ingredients.innerText = "";
        instructions.innerText = "";
        image.src = "";

        if(data.drinks.length >= 1) {  //create new buttons
            document.querySelector("p").innerText = `Choose your cocktail with the ingredient '${ingredient}':`;

            sortDrinkslAphabetically(data.drinks);

            for(let i = 0; i < data.drinks.length; i++) {
                const newButtton = document.createElement("button");
                newButtton.innerText = data.drinks[i].strDrink;
                cocktailsContainer.appendChild(newButtton);
            }

            createEventListeners();
        }

        if(cocktailsContainer.childElementCount < 4) {
            document.querySelector("#cocktails").style.display = "flex";
        }

    })

    .catch(err => {
        hideElements();
        removeImage();
        alertWrongInput();
        console.log(`error ${err}`);
    });
}


