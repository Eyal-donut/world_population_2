//############################################## Variables ##################################################


let chartData = []
let chartLabels = []
const lineChart = document.getElementById('myChart');

let myChart =new Chart(lineChart, {
    type: "line",
    data: {
        labels: chartLabels,
        datasets: [
            {
            label: "Population",
            data: chartData,
            borderWidth: 1,
            },
        ],
    },
    options: {
        scales: {
            y: {
                beginAtZero: true,
            },
        },
    },
});
Chart.defaults.font.size = 16;



const continentsBtnContainer = document.getElementById('continents-btn-container')
const countryButtonsGrid = document.getElementById("countries-btn-grid")
const spinnerContainer = document.getElementById("spinner-container")
const spinner = document.querySelector(".spinner")

const chooseContinent = document.querySelector(".choose-continent")
const chooseCountry = document.querySelector(".choose-country")
const errorMsg = document.querySelector(".error")

let activeHeadingMsg = chooseContinent


//#################################################################################################################
//############################################### Aid functions ####################################################


const toggleSpinnerView = () => {
    spinner.classList.toggle("display")
    spinnerContainer.classList.toggle("display")
}

const resetChart =() => {
    chartData = []
    chartLabels = []
    myChart.destroy()

}

const initChart = (countries, populationData) => {
    myChart =new Chart(lineChart, {
            type: "line",
            data: {
            labels: countries,
            datasets: [
                {
                label: "Population",
                data: populationData,
                borderWidth: 1,
                },
            ],
            },
            options: {
            scales: {
                y: {
                beginAtZero: true,
                },
            },
            },
        });
    }

const resetButtonsGrid = () => {
    countryButtonsGrid.innerHTML = null
}

const createButton = (country) => {
    const button = document.createElement('button')
        button.classList.add("country-btn")
        button.innerText = country
        countryButtonsGrid.append(button)
}
    
const setHeadingText = (makeActive) => {
    activeHeadingMsg.classList.toggle('display')
    activeHeadingMsg = makeActive
    activeHeadingMsg.classList.toggle('display')
}

//#######################################################################################################################
//################################################# Data Massage and Init  ##############################################

const setChartVariablesWithCountryPopulation = async (data, country) => {
        const populationCountsArray = data.data.populationCounts
        const lastIndex = data.data.populationCounts.length -1
        const populationValue =  data.data.populationCounts[lastIndex].value
        chartLabels.push(`${country}`)
        chartData.push(populationValue)
        
}

const setChartVariablesWithCity = (dataInput) => {
    dataInput.data.forEach(city => {
        const cityName = city.city
        chartLabels.push(cityName)
        const populationCountsArray = city.populationCounts
        const populationValue =  city.populationCounts[0].value
        chartData.push(populationValue)
    })
}


const initCountriesFromLocalStorage = (continent) => {
    const localDataCountries = JSON.parse(localStorage.getItem(`countriesIn${continent}`));
    resetChart();
    resetButtonsGrid(localDataCountries)
    getCountriesPopulations(localDataCountries)
    initChart(chartLabels, chartData)
    setHeadingText(chooseCountry)

    
}

const initCitiesFromLocalStorage = (country) => {
    const localDataCities = JSON.parse(localStorage.getItem(`citiesIn${country}`));
    resetChart();
    setChartVariablesWithCity(localDataCities)
    initChart(chartLabels, chartData)
}

//###############################################################################################################

//?###########################################################################################################################
//?################################################### Fetch information   ####################################################


const getCountryPopulation = async (country) => {
    if (localStorage.getItem(`populationOf${country}`) !== null) {
        const localDataCountriesPopulation = JSON.parse(localStorage.getItem(`populationOf${country}`));
        setChartVariablesWithCountryPopulation(localDataCountriesPopulation, country)
            createButton(country)
    } 
    else {
        try {
            const response = await fetch('https://countriesnow.space/api/v0.1/countries/population', {
                method: 'POST',
                headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
                },
                body: JSON.stringify({ "country": `${country}` })
            })

            if(!response.ok) throw new Error(response.status)           
            else {
            const populationData = await response.json()
            localStorage.setItem(`populationOf${country}`, JSON.stringify(populationData))
            const localPopulationData = JSON.parse(localStorage.getItem(`populationOf${country}`));
            setChartVariablesWithCountryPopulation(localPopulationData, country)
            createButton(country)
            }

        } catch (error) {
            console.log("Something went wrong", "getCountryPopulation")
            console.log(error)
            
        }
    }
}

const getCountriesPopulations = (data) => {
    data.forEach(country => {
        getCountryPopulation(country.name.common)
    })
}

const getCountriesByContinent = async (continent) =>{

    if (localStorage.getItem(`countriesIn${continent}`) !== null) {

        initCountriesFromLocalStorage(continent)
    }
    else {
        try {
            toggleSpinnerView()
            const response = await fetch(`https://restcountries.com/v3.1/region/${continent}`)
            if(!response.ok) {
                toggleSpinnerView()
                throw new Error(response)
            }
            const countriesData = await response.json()
            localStorage.setItem(`countriesIn${continent}`, JSON.stringify(await countriesData))
            initCountriesFromLocalStorage(continent)
            setInterval(() => {
                myChart.update()
                
            }, 300);
            toggleSpinnerView()

        } catch (error) {
            console.log("Something went wrong", "getCountriesByContinent")
            console.log(error)
        }
    }
}

const getCitiesByCountry = async (country) => {
    if (localStorage.getItem(`citiesIn${country}`) !== null) {
        initCitiesFromLocalStorage(country)
    }
    else{
        try {
            toggleSpinnerView()
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
                errorMsg.innerText = `Error! could not get ${country}'s cities population data. Please choose another country.`
                setHeadingText(errorMsg)
                throw new Error(response.status)
            }            
            const citiesData = await response.json()
            console.log(citiesData)
            localStorage.setItem(`citiesIn${country}`, JSON.stringify(await citiesData))

            initCitiesFromLocalStorage(country)
            toggleSpinnerView()

        } catch (error) {
            console.log("Something went wrong", "getCitiesByCountry")
            console.log(error)
        }
    }
}



//?#############################################################################################################################################

//##############################################################################################################################################
//################################################ Event listeners - click ###################################################

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

//##############################################################################################################################################





