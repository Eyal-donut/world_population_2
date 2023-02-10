//############################################## Variables ##################################################


let chartData = []
let chartLabels = []
const lineChart = document.getElementById('myChart');


const continentsBtnContainer = document.getElementById('continents-btn-container')
const countryButtonsGrid = document.getElementById("countries-btn-grid")
const spinnerContainer = document.getElementById("spinner-container")
const spinner = document.querySelector(".spinner")

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
                label: "population of the countries",
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
        myChart.update()
    }

const createCountryButtonsFromData = (data) => {
    countryButtonsGrid.innerHTML = null
    data.forEach(country => {
        const button = document.createElement('button')
        button.classList.add("country-btn")
        button.innerText = country.name.common
        countryButtonsGrid.append(button)
    })
}
    

//#######################################################################################################################
//################################################# Data Massage and Init  ##############################################

const setChartVariablesWithCountryPopulation = (data, country) => {
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
    getPopulationsForEachCountry(localDataCountries)
    createCountryButtonsFromData(localDataCountries)
    initChart(chartLabels, chartData)
    // myChart.update()

    
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

            if(!response.ok) {
                throw new Error(response.status)
            }
            const populationData = await response.json()
            localStorage.setItem(`populationOf${country}`, JSON.stringify(populationData))
            const localPopulationData = JSON.parse(localStorage.getItem(`populationOf${country}`));

            setChartVariablesWithCountryPopulation(localPopulationData, country)

        } catch (error) {
            console.log("Something went wrong")
            console.log(error)
            
        }
    }
}

const getPopulationsForEachCountry = (data) => {
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
                throw new Error(response)
            }
            const countriesData = await response.json()
            localStorage.setItem(`countriesIn${continent}`, JSON.stringify(countriesData))
            initCountriesFromLocalStorage(continent)
            const localDataCountries = JSON.parse(localStorage.getItem(`countriesIn${continent}`));
            resetChart();
            getPopulationsForEachCountry(localDataCountries)
            createCountryButtonsFromData(localDataCountries)
            initChart(chartLabels, chartData)
            toggleSpinnerView()
        } catch (error) {
            console.log("Something went wrong")
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
                throw new Error(response.status)
            }            
            const citiesData = await response.json()
            console.log(citiesData)
            localStorage.setItem(`citiesIn${country}`, JSON.stringify(await citiesData))

            initCitiesFromLocalStorage(country)
            toggleSpinnerView()

        } catch (error) {
            console.log("Something went wrong")
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



let myChart =new Chart(lineChart, {
    type: "line",
    data: {
        labels: chartLabels,
        datasets: [
            {
            label: "population of the countries",
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


