//############################################## Variables ##################################################


const continentsBtnContainer = document.getElementById('continents-btn-container')
const countryButtonsGrid = document.getElementById("countries-btn-grid")
const spinnerContainer = document.getElementById("spinner-container")
const spinner = document.querySelector(".spinner")

//############################################### Functions ####################################################




const toggleSpinnerView = () => {
    spinner.classList.toggle("display")
    spinnerContainer.classList.toggle("display")
}

const createGraph = () => {}


//###############################################################################################################

//?###################################### Click on continent - get countries, populations & cities  ################################################

const createCountryButtonsFromData = (data) => {
    countryButtonsGrid.innerHTML = null
    data.forEach(country => {
        const button = document.createElement('button')
        button.classList.add("country-btn")
        button.innerText = country.name.common
        countryButtonsGrid.append(button)
    })
}


const getCountryPopulation = async (country) => {
    try {
        const response = await fetch('https://countriesnow.space/api/v0.1/countries/population', {
            method: 'POST',
            headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
            },
            body: JSON.stringify({ "country": `${country}` })
        })

        if(!response.ok) {
            toggleSpinnerView()
            throw new Error(response.status)
        }
        const populationData = await response.json()
        console.log(populationData)
        localStorage.setItem(`populationOf${country}`, JSON.stringify(await populationData))

        
    } catch (error) {
        console.log("Something went wrong")
            console.log(error)
        
    }
}

const getPopulationsForEachCountry = (data) => {
    data.forEach(country => {
        getCountryPopulation(country.name.common)
    })
}

const getCountriesByContinent = async (continent) =>{

    if (localStorage.getItem(`countriesIn${continent}`) !== null) {
        const localDataCountries = JSON.parse(localStorage.getItem(`countriesIn${continent}`));
        getPopulationsForEachCountry(localDataCountries)
        createCountryButtonsFromData(localDataCountries)

    }
    else {
        try {
            toggleSpinnerView()
            const response = await fetch(`https:restcountries.com/v3.1/region/${continent}`)
            if(!response.ok) {
                toggleSpinnerView()
                throw new Error(response.status)
            }
            const countriesData = await response.json()
            localStorage.setItem(`countriesIn${continent}`, JSON.stringify(await countriesData))

            getPopulationsForEachCountry(countriesData)
            createCountryButtonsFromData(countriesData)
            //! make graph from the information 
            toggleSpinnerView()
            
        } catch (error) {
            console.log("Something went wrong")
            console.log(error)
        }
    }
    }


document.addEventListener("click", function(e){
    if(e.target.className === 'continent-btn') {
        const continent = e.target.innerText.toLowerCase()
        getCountriesByContinent(continent)
    }
})

//?#############################################################################################################################################


//################################################ Click on country - get cities populations ###################################################


const getCitiesByCountry = async (country) => {
    if (localStorage.getItem(`citiesIn${country}`) !== null) {
        const localDataCities = JSON.parse(localStorage.getItem(`citiesIn${country}`));
        //! make a graph from the information
    }
    else{
        toggleSpinnerView()

        try {
            const response = await fetch('https://countriesnow.space/api/v0.1/countries/population/cities/filter', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    "limit": 1000,
                    "order": "asc",
                    "orderBy": "name",
                    "country": `${country}`
                })
            })
            if(!response.ok) {
                toggleSpinnerView()
                throw new Error(response.status)
            }            
            const citiesData = await response.json()
            console.log(citiesData)
            //! make a graph from the information
            toggleSpinnerView()
            localStorage.setItem(`citiesIn${country}`, JSON.stringify(await citiesData))

        } catch (error) {
            console.log("Something went wrong")
            console.log(error)
        }
    }
}

document.addEventListener("click", function(e){
    if(e.target.className === 'country-btn') {
        const country = e.target.innerText.toLowerCase()
        getCitiesByCountry(country)
    }
})

//##############################################################################################################################################