//container for all continents:
//addEventListener for the container: 
const buttonsContainer = 'something'

async function getCountriesData(){
    try {
        const respons = await fetch()
        if(!resoponse.ok) throw new Error("sth went wrong")
        

        const data = response.json()
        //extract list of countries and save them to arrays per continent and save to local storage
        
    } catch (error) {
        
    }
}

//! display buttons for all continents

//click on a continent

buttonsContainer.addEventListener('click', async function(e) =>{
    if(e.target.className === continentButton) {
        try {
            //display spinner
            //disable all buttons
            // await: get the information for the chosen continent from the local storage or from the variables
        if(some condition to make sure the countries information is saved to a variable that we can approach) throw new Error("sth went wrong")

            //await: dynamically create buttons for countries
            const countryButton = createNewELement('button')
            countryButton.classList.add('country')
            countryButton.innerText = 'country name from the api data'
            //await: create graph with countries populations
            //hide spinner
            //enable buttons

        } catch (error) {
            
        }
    }
})


buttonsContainer.addEventListener('click', async function(e) =>{
        try {
            //display spinner
            //disable all buttons
            const reponseCities =  await fetch(url with ${e.target.innerText} )
if (!response.ok) throw new Error("sth went wrong")

            const dataCites = await responsCities.json()
            //check if city population has value. if it's empty don't save it
            //save to local storage
             //await: dynamically create buttons for cities
            //await: create graph with cities populations
            //hide spinner
            //enable buttons)

        } catch (error) {
            
        }
    }
})