const getCountriesPopulations = async (country) => {
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
        const populationData = await response.json()
        console.log(populationData)
        localStorage.setItem(`populationOf${country}`, JSON.stringify(await populationData))

        
    } catch (error) {
        console.log("Something went wrong")
            console.log(error)
        
    }
}
getCountriesPopulations('Israel')