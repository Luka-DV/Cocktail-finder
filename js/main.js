//The user will enter a cocktail. Get a cocktail name, photo, and instructions and place them in the DOM


document.querySelector("button").addEventListener("click", getCocktail);

/* 
function getCocktail() {
    let cocktail = document.querySelector("input").value;

fetch(`https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${cocktail}`)
    .then(res => res.json()) // parse response as JSON
    .then(data => {
      console.log(data)
      data = data.drinks[0] //get the first object in the array
      document.querySelector("h2").innerText = data.strDrink;
      document.querySelector("img").src = data.strDrinkThumb;
      document.querySelector("#instr").innerText = data.strInstructions;
      for(let i = 1; data[`strIngredient${i}`] != null; i++) {
        document.querySelector("#ingr").innerText += "\n " + data[`strIngredient${i}`];
      }
      
      
    })
    .catch(err => {
        console.log(`error ${err}`)
    });

} */


// with carusel:

let drinkNumber = -1;

function getCocktail() {
    let cocktail = document.querySelector("input").value;

fetch(`https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${cocktail}`)
    .then(res => res.json()) // parse response to JS

    .then(data => {
      console.log(data)
    
     if(data.drinks.length -1 === drinkNumber) { //restart counter if at last item of array
        drinkNumber = -1;
     }
      data = data.drinks[++drinkNumber] //get the next object in the array
      console.log(drinkNumber)
      document.querySelector("h2").innerText = data.strDrink; //get Name
      document.querySelector("img").src = data.strDrinkThumb; //get img
      document.querySelector("#instr").innerText = data.strInstructions; // get instructions

      const ulParentElement = document.querySelector("#ingr");

      while(ulParentElement.firstChild) { //remove all of the previous li elements
        ulParentElement.removeChild(ulParentElement.firstChild)
      }

      for(let i = 1; data[`strIngredient${i}`] != null; i++) { //append neccessary li elements:
        const listItem = document.createElement("li");
        listItem.innerText = data[`strIngredient${i}`];
        ulParentElement.appendChild(listItem);
      }
    })

    .catch(err => {
        console.log(`error ${err}`)
    });

}