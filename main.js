const continentsBtnContainer = document.getElementById('continents-btn-container')
const countryButtonsGrid = document.getElementById("countries-btn-grid")

//############################################### Functions ####################################################

const createCountryButtonsFromData = (data) => {
    data.forEach(country => {
        const button = document.createElement('button')
        button.classList.add("country-btn")
        button.innerText = country.name.common
        countryButtonsGrid.append(button)
    })
}

//###############################################################################################################

//?############################################## Event listeners ################################################


document.addEventListener("click", function(e){
    if(e.target.className === 'continent-btn') {
        const continent = e.target.innerText.toLowerCase()
        getCountriesByContinent(continent)
    }
})

document.addEventListener("click", function(e){
    if(e.target.className === 'country-btn') {
        const country = e.target.innerText.toLowerCase()
        getCitiesByCountry(country)
    }
})

//?###############################################################################################################


const getCountriesByContinent = async (continent) =>{

    if (localStorage.getItem(`countriesIn${continent}`) !== null) {
        const localDataCountries = JSON.parse(localStorage.getItem(`countriesIn${continent}`));
        createCountryButtonsFromData(localDataCountries)
        // localStorage.clear()
    }
    /* else {
        try {
            const response = await fetch(`https:restcountries.com/v3.1/region/${continent}`)
            if(!response.ok) throw new Error(response.status)

            const countriesData = await response.json()
            localStorage.setItem(`countriesIn${continent}`, JSON.stringify(await countriesData))

            createCountryButtonsFromData(countriesData)
    
        } catch (error) {
            console.log("Something went wrong")
            console.log(error)
            
        }
    }*/
    }


const getCitiesByCountry = async (country) => {
    if (localStorage.getItem(`citiesIn${country}`) !== null) {
        const localDataCities = JSON.parse(localStorage.getItem(`citiesIn${country}`));
        alert('heho')
        //! make a graph from the information
    }
    // else{
    //     try {
    //         const response = await fetch('https://countriesnow.space/api/v0.1/countries/population/cities/filter', {
    //             method: 'POST',
    //             headers: {
    //                 'Accept': 'application/json',
    //                 'Content-Type': 'application/json'
    //             },
    //             body: JSON.stringify({
    //                 "limit": 1000,
    //                 "order": "asc",
    //                 "orderBy": "name",
    //                 "country": `${country}`
    //             })
    //         })
            
    //         if(!response.ok) throw new Error(response.status)
    //         const citiesData = await response.json()
    //         console.log(citiesData)
    //         localStorage.setItem(`citiesIn${country}`, JSON.stringify(await citiesData))
    //         //! make a graph from the information

    //     } catch (error) {
    //         console.log("Something went wrong")
    //         console.log(error)
    //     }
    // }
}