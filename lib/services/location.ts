import axios from "axios";

interface CountryAPIResponse {
  data: {
    objects: ({
      names: {
        common: string;
      };
      codes: {alpha_2: string};
      currencies?: ({
        code: string,
        name: string;
        symbol: string
      })[]
    })[]
  }
  
}

// For `fetchStates` response
interface StatesAPIResponse {
  data: {
    states: { name: string }[];
  };
}

export interface Country {
  name: string;
  code: string;
  currencies: string[];
}

export const fetchCountries = async (): Promise<Country[]> => {
  const response1 = await axios.get<CountryAPIResponse>(
    "https://api.restcountries.com/countries/v5?response_fields=names.common,codes.alpha_2,currencies&limit=100", 
    {headers: {"Authorization": `Bearer ${process.env.NEXT_PUBLIC_RESTCOUNTRIES_API_KEY}`}}
  );

  const response2 = await axios.get<CountryAPIResponse>(
    "https://api.restcountries.com/countries/v5?response_fields=names.common,codes.alpha_2,currencies&offset=100&limit=100", 
    {headers: {"Authorization": `Bearer ${process.env.NEXT_PUBLIC_RESTCOUNTRIES_API_KEY}`}}
  );

  const response3 = await axios.get<CountryAPIResponse>(
    "https://api.restcountries.com/countries/v5?response_fields=names.common,codes.alpha_2,currencies&offset=200&limit=100", 
    {headers: {"Authorization": `Bearer ${process.env.NEXT_PUBLIC_RESTCOUNTRIES_API_KEY}`}}
  );


  const objects = [...response1.data.data.objects, ...response2.data.data.objects, ...response3.data.data.objects]
  // console.log(objects);
  return objects
    .map((c) => ({
      name: c.names.common,
      code: c.codes.alpha_2,
      currencies: c.currencies ? c.currencies.map(curr => curr.code) : []
    }))
    .sort((a, b) => a.name.localeCompare(b.name));
};

export const fetchStates = async (countryName: string): Promise<string[]> => {
  const { data } = await axios.post<StatesAPIResponse>(
    "https://countriesnow.space/api/v0.1/countries/states",
    { country: countryName }
  );

  return data.data.states.map((s) => s.name);
};
