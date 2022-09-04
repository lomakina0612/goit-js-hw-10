export const fetchCountries = (name) => {
  if(!name) {return}
  return new Promise((resolve, reject) => {  // аргументом промісу є функція,параметрами якого є дві функції resolve та reject
    fetch(`https://restcountries.com/v3.1/name/${name}?fields=name,capital,population,flags,languages`)   //fetch повертає проміс зі службовою інформацією
    .then(response => {
      if (!response.ok) {
        throw new Error(response.status);
      }
      return response.json();   // метод json() парсіт дані у JSON-форматі та повертвє проміс
    })
    .then((data) => {
      return resolve(data);   // повертаємо проміс з масивом країн
    })
    .catch(error => {
      return reject(error);   // повертаємо проміс з помилкою
    });
  })
}
