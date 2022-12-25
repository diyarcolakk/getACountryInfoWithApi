"use strict";
const btn = document.querySelector(".btn-country");
const countriesContainer = document.querySelector(".countries");
const getJSON = function (url, hataMsj = "Bir şeyler ters gitti") {
  return fetch(url).then((response) => {
    if (!response.ok) throw new Error(`${hataMsj} (${response.status})`);
    return response.json();
  });
};

const ülkeBilgisiAl = function (ülke) {
  getJSON(`https://restcountries.com/v3.1/name/${ülke}`, `Ülke Bulunamadı`)
    .then((data) => {
      ülkeyiGöster(data[0]);
      if (!data[0].borders) throw new Error("Komşu yok");
      const komşu = data[0].borders[0];
      if (!komşu) return;
      return getJSON(
        `https://restcountries.com/v3.1/alpha/${komşu}`,
        `Ülke bulunamadı`
      );
    })
    .then((data) => ülkeyiGöster(data[0], "neighbour"))
    .catch((err) => {
      hataGöster(`Bir şeyler ters gitti 🧨🎇🧨 ${err.message}`);
    })
    .finally(() => {
      countriesContainer.style.opacity = 1;
    });
};

const ülkeyiGöster = function (data, className = "") {
  const languages = Object.values(data.languages);
  const currencies = Object.values(data.currencies);
  console.log(data);
  const html = `<article class="country  ${className}">
            <img class="country__img" src="${data.flags.png}" />
            <div class="country__data">
              <h3 class="country__name">${data.name.common}</h3>
              <h4 class="country__region">${data.region}</h4>
              <p class="country__row"><span>👫</span>${(
                +data.population / 1000000
              ).toFixed(1)}</p>
              <p class="country__row"><span>🗣️</span>${languages[0]}</p>
              <p class="country__row"><span>💰</span>${currencies[0].name}</p>
            </div>
          </article>`;
  countriesContainer.insertAdjacentHTML("beforeend", html);
  countriesContainer.style.opacity = 1;
};

const benNeredeyim = function (lat, lng) {
  fetch(
    `https://geocode.xyz/${lat},${lng}?geoit=json&auth=890381073953563950766x114209`
  )
    .then((res) => {
      if (!res.ok)
        throw new Error(`Geocoding ile ilgili problem ${res.status}`);
      return res.json();
    })
    .then((data) => {
      if (!data) throw new Error(`Böyle bir konum bulunumadı`);
      console.log(data);
      btn.addEventListener("click", function () {
        ülkeBilgisiAl(data.country);
      });
    })
    .catch((err) => console.error(`${err.message}`));
};

benNeredeyim(19.037, 72.873);
