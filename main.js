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



const continentsBtnContainer = document.getElementById('continents-btn-container')
const countryButtonsGrid = document.getElementById("countries-btn-grid")
const spinnerContainer = document.getElementById("spinner-container")
const spinner = document.querySelector(".spinner")

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


const setChartVariablesWithCountryPopulation = (data, country) => {
        const populationCountsArray = data.data.populationCounts
        const lastIndex = data.data.populationCounts.length -1
        const populationValue =  data.data.populationCounts[lastIndex].value
        console.log(populationCountsArray)
        console.log(populationValue)

        chartLabels.push(`${country}`)
        chartData.push(populationValue)
        console.log(chartData)
        console.log(chartLabels)

}

const setChartVariablesWithCity = (dataInput) => {
    dataInput.data.forEach(city => {
        const cityName = city.city
        console.log(cityName)
        chartLabels.push(cityName)

        const populationCountsArray = city.populationCounts
        const populationValue =  city.populationCounts[0].value
        // console.log(populationCountsArray)
        // console.log(populationValue)

        chartData.push(populationValue)
        // console.log(chartData)
        // console.log(chartLabels)

    })
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
}


const initFromLocalStorage = (continent) => {
    const localDataCountries = JSON.parse(localStorage.getItem(`countriesIn${continent}`));
        resetChart();
        getPopulationsForEachCountry(localDataCountries)
        createCountryButtonsFromData(localDataCountries)
        initChart(chartLabels, chartData)
}

//###############################################################################################################

//?###################################### Click on continent: get countries & populations   ####################################################

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
            localStorage.setItem(`populationOf${country}`, JSON.stringify(await populationData))
            setChartVariablesWithCountryPopulation(await populationData, country)

        } catch (error) {
            // console.log("Something went wrong")
            // console.log(error)
            
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

        initFromLocalStorage(continent)
    }
    else {
        try {
            // toggleSpinnerView()
            const response = await fetch(`https://restcountries.com/v3.1/region/${continent}`)
            if(!response.ok) {
                throw new Error(response)
            }
            const countriesData = await response.json()
            localStorage.setItem(`countriesIn${continent}`, JSON.stringify(await countriesData))
            initFromLocalStorage(continent)
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
        resetChart();
        const localDataCities = JSON.parse(localStorage.getItem(`citiesIn${country}`));
        setChartVariablesWithCity(localDataCities)
        initChart(chartLabels, chartData)

    }
    else{

        try {
            toggleSpinnerView()
            resetChart();
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
            setChartVariablesWithCity(citiesData)
            initChart(chartLabels, chartData)
            toggleSpinnerView()

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

localStorage.clear()





