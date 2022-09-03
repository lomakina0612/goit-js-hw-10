import './css/styles.css';
import fetchCountries from './js/fetchCountries';

import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const DEBOUNCE_DELAY = 300;

const searchBox = document.querySelector("#search-box");
const countryList = document.querySelector(".country-list");
const countryInfo = document.querySelector(".country-info");
searchBox.addEventListener('input', debounce(handleInput, DEBOUNCE_DELAY));



function handleInput(e) {
  let name = this.value;
  if(!name) {return}

  fetch(`https://restcountries.com/v3.1/name/${name}?fields=name,capital,population,flags,languages`)
    .then(response => {   // Response handling
      if (!response.ok) {
        if (response.status === 404) {
          countryInfo.innerHTML = '';
          countryList.innerHTML = '';
          Notify.failure("Oops, there is no country with that name");
        }
        throw new Error(response.status);
      }

      return response.json();
    })
    .then((data) => {     // Data handling
      console.log("🚀data", data);
      if (data.length > 10) {
        countryInfo.innerHTML = '';
        countryList.innerHTML = '';
        return Notify.info("Too many matches found. Please enter a more specific name.");
        
      }
      if (data.length === 1) {
        const { flags, name, capital, population, languages } = data[0] ;
          console.log("🚀data.name.official", name.official);
          console.log("🚀data.capital", capital[0]);
          console.log("🚀data.population", population);
          console.log("🚀data.languages", Object.values(languages).join(', '));
          console.log("🚀data.flags.svg", flags.svg);
        const markup = `
            
            <p class="country-name">
            <span class="flag"><img src="${flags.svg}" alt="flag of ${name.official}" width="30"></span>
            ${name.official}
            </p>
            <p class="country-capital">
              <span class="category">Capital: </span>${capital[0]}
            </p>
            <p class="country-name">
              <span class="category">Population: </span>${population}
            </p>
            <p class="country-capital">
              <span class="category">Languages: </span>${Object.values(languages).join(', ')}
            </p>
          `;

        countryList.innerHTML = '';
        countryInfo.innerHTML = markup;

      } else {
        data.map(({ flags, name, capital, population, languages }) => {
          console.log("🚀data.name.official", name.official);

          console.log("🚀data.flags.svg", flags.svg);
          // let markup = "";
          const markupCoutry = `
            <li class="country">
              <img src="${flags.svg}" alt="flag of ${name.official}" width="30">
              ${name.official}
            </li>
          `;
          countryInfo.innerHTML = '';

          countryList.insertAdjacentHTML('beforeend', markupCoutry);
  
          
        })
        // countryList.innerHTML = markup;
      }
      
    
    
    })
   
    .catch(error => {     // Error handling
      
      console.log("🚀 error", error);
    });

  // Notify.info(`${name}`);
  fetchCountries(this.value);
}

