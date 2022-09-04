import './css/styles.css';
import {fetchCountries} from './js/fetchCountries';

import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const DEBOUNCE_DELAY = 300;

const searchBox = document.querySelector("#search-box");
const countryList = document.querySelector(".country-list");
const countryInfo = document.querySelector(".country-info");
searchBox.addEventListener('input', debounce(handleInput, DEBOUNCE_DELAY));
// debounce дозволяє реагувати на 'input' не частіше ніж раз на DEBOUNCE_DELAY мсек


function refreshHTML() {
  countryInfo.innerHTML = '';
  countryList.innerHTML = '';
}


function handleInput(e) {
  if (!this.value) { return refreshHTML(); }
  const contries = fetchCountries(this.value.trim()); // отримуємо проміс, який повертає fetchCountries
  contries.then((data) => {     // отримуємо з промісу масив країн 
    if (data.length > 10) {
      refreshHTML();
      return Notify.info("Too many matches found. Please enter a more specific name.");   
    }
    if (data.length === 1) {
      const { flags, name, capital, population, languages } = data[0];  // деструктуризуємо єдиний елемент масиву
      const markup = ` 
        <p class="country-name">
          <span class="flag"><img src="${flags.svg}" alt="flag of ${name.official}" width="30"></span>
          ${name.official}
        </p>
        <p class="country-info">
          <span class="category">Capital: </span>${capital[0]}
        </p>
        <p class="country-info">
          <span class="category">Population: </span>${population}
        </p>
        <p class="country-info">
          <span class="category">Languages: </span>${Object.values(languages).join(', ')}
        </p>
      `;
      countryList.innerHTML = '';
      countryInfo.innerHTML = markup;
    } else {
      refreshHTML();
      data.map(({ flags, name }) => {
        const markupCoutry = `
          <li class="country">
            <span class="flag"><img src="${flags.svg}" alt="flag of ${name.official}" width="30"></span>
            ${name.official}
          </li>
        `;
        countryList.insertAdjacentHTML('beforeend', markupCoutry);
      })
    }
  })
  .catch(error => { 
    refreshHTML();
    Notify.failure("Oops, there is no country with that name");  
  });
}

