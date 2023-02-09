const continentsBtnContainer = document.getElementById('continents-btn-container')
const countryButtonsGrid = document.getElementById("countries-btn-grid")


const createCountriesFromData = (data) => {
    data.forEach(country => {
        const button = document.createElement('button')
        button.classList.add("country-btn")
        button.innerText = country.name.common
        countryButtonsGrid.append(button)
    })
}



const getCountriesByContinent = async (continent) =>{

    if (localStorage.getItem(`countriesIn${continent}`) !== null) {
        const localCountriesData = JSON.parse(localStorage.getItem(`countriesIn${continent}`));
        createCountriesFromData(localCountriesData)
        // localStorage.clear()
    }else {
        try {
            const response = await fetch(`https:restcountries.com/v3.1/region/${continent}`)
            if(!response.ok) throw new Error(response.status)

            const countriesData = await response.json()
            localStorage.setItem(`countriesIn${continent}`, JSON.stringify(await countriesData))
            console.log(countriesData)

            createCountriesFromData(countriesData)
    
        } catch (error) {
            console.log("Something went wrong")
            console.log(error)
            
        }
    }
    }
getCountriesByContinent('europe')

// const getCitiesByCountry = async (country) => {
//     try {
//         fetch('https://countriesnow.space/api/v0.1/countries/population/cities/filter', {
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

//         const data = await response.json()
//         console.log(data)

//         data.forEach(country => {
//             const button = document.createElement('button')
//             button.classList.add("country-btn")
//             button.innerText = country.name.common
//             countryButtonsGrid.append(button)
//         })

//     } catch (error) {
//         console.log("Something went wrong")
//         console.log(error)
        
//     }
// }

// }