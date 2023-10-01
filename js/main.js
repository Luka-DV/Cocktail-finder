//The user will enter a cocktail. Get a cocktail name, photo, and instructions and place them in the DOM

"use strict";

document.querySelector("#getCocktail").addEventListener("click", getCocktail);
document.querySelector("#lucky").addEventListener("click", getRandomCocktail);
document.querySelector("#ingredient").addEventListener("click", listByIngredient);


let drinkNumber = -1;

let currentCocktail = [];


function getCocktail(fizz) {
    
    let cocktail = (typeof fizz === "object") ? document.querySelector("input").value : fizz;
    currentCocktail.unshift(cocktail);
    checkIfDifferentCocktail(cocktail);


    fetch(`https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${cocktail}`)
        .then(res => res.json()) // parse response to JS

        .then(data => {
            console.log(data);

            const cocktailsContainer = document.querySelector("#cocktails");

            if(drinkNumber === data.drinks.length - 1) { //restart counter if at last item of array
                    drinkNumber = -1;
            }

            while(cocktailsContainer.firstChild) {  //reset cocktail buttons
                cocktailsContainer.removeChild(cocktailsContainer.firstChild);
            }
            document.querySelector("p").innerText = "";

            if(data.drinks.length > 1) {  //create new buttons
                document.querySelector("p").innerText = "Or did you mean..."
                for(let i = 1; i <= data.drinks.length - 1; i++) {
                    const newButtton = document.createElement("button");
                    newButtton.innerText = data.drinks[i].strDrink;
                    cocktailsContainer.appendChild(newButtton);
                }

                document.querySelector("#cocktails").style.justifyContent = "space-between";

                createEventListeners();
            }

            
            const drinkData = data.drinks[++drinkNumber]; //get the next object in the array

            document.querySelector("h3").innerText = "Ingredients:";
            document.querySelector("h2").innerText = drinkData.strDrink; //get Name
            document.querySelector("img").src = drinkData.strDrinkThumb; //get img
            document.querySelector("img").alt = `Image of the cocktail named '${drinkData.strDrink}'`;
            document.querySelector("#instr").innerText = drinkData.strInstructions; // get instructions

            

            displayImage();


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

    function displayImage() {
        document.querySelector("body > section+section").classList.remove("hidden");
    }

    function removeImage() {
        document.querySelector("body > section+section").classList.add("hidden");
    }

    
    

    function getRandomCocktail() {
    
        fetch(`https://www.thecocktaildb.com/api/json/v1/1/random.php`)
            .then(res => res.json()) // parse response to JS
    
            .then(data => {
                console.log(data);

                const cocktailsContainer = document.querySelector("#cocktails");

                while(cocktailsContainer.firstChild) {  //reset cocktail buttons
                    cocktailsContainer.removeChild(cocktailsContainer.firstChild);
                }
                document.querySelector("p").innerText = "";

                const drinkData = data.drinks[0]
    
                document.querySelector("h3").innerText = "Ingredients:";
                document.querySelector("h2").innerText = drinkData.strDrink; //get Name
                document.querySelector("img").src = drinkData.strDrinkThumb; //get img
                document.querySelector("img").alt = `Image of the cocktail named '${drinkData.strDrink}'`; //insert alt text
                document.querySelector("#instr").innerText = drinkData.strInstructions; // get instructions

                displayImage();
    
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

            const cocktailsContainer = document.querySelector("#cocktails");
            while(cocktailsContainer.firstChild) {  //reset cocktail buttons
                cocktailsContainer.removeChild(cocktailsContainer.firstChild);
            }
            document.querySelector("p").innerText = "";


            const ulParentElement = document.querySelector("#ingr");
            while(ulParentElement.firstChild) { //remove all of the previous li elements
                ulParentElement.removeChild(ulParentElement.firstChild);
            }

            removeImage();

            document.querySelector("h2").innerText = "";
            document.querySelector("h3").innerText = "";
            document.querySelector("h4").innerText = "";
            document.querySelector("img").src = "";

            //document.querySelector("#cocktails").style.justifyContent = "flex-start";

            if(data.drinks.length > 1) {  //create new buttons
                document.querySelector("p").innerText = `Choose your cocktail with ${ingredient} :`
                for(let i = 1; i <= data.drinks.length - 1; i++) {
                    const newButtton = document.createElement("button");
                    newButtton.innerText = data.drinks[i].strDrink;
                    cocktailsContainer.appendChild(newButtton);
                }

                createEventListeners();


                document.querySelector("#cocktails").style.fontSize = "clamp(0.8rem, 1.5vw, 1.2rem)"
            }

        })

        .catch(err => {
            console.log(`error ${err}`);
        });
        
    }


