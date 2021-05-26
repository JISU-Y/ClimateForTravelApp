// climate base url
const CLIMATE_BASE =
  "http://climatedataapi.worldbank.org/climateweb/rest/v1/country/"; // json 포맷이 default
// http://climatedataapi.worldbank.org/climateweb/rest/v1/country/type/var/start/end/ISO3[.ext]
//   "http://climatedataapi.worldbank.org/climateweb/rest/v1/country/mavg/tas/2020/2039/BRA"

// country base url / countryCode(2글자)
const COUNTNAME_BASE = "http://api.worldbank.org/v2/country/"; // ${countryCode}?format=json // json default 아님
// http://api.worldbank.org/v2/country/${countryCode}?format=json

const regionForm = document.querySelector(".region");
const regionSearch = document.querySelector(".regionSearch");
const months = document.querySelectorAll(".month");
const buttonResult = document.querySelector(".btn-result");
const travelWhen = document.querySelector(".when");
const travelWhere = document.querySelector(".where");

// input에 검색한 단어 아니면 b만 눌러도 b로 시작하는 애들 다 보여주기 br 이면 brazil 띄우고 br을 ${}
// input에 입력된 b를 저기 URL에서 찾아서 보여줌
// 그거 가지고 country ID 알아냄 그게 바로 ISO3 임
// 거기서 날씨 정보 꺼내서 보여주면 끝!

let countryCode = ""; // input 값이 들어갈 자리
let travelMonth = "";

months.forEach((month) => {
  month.addEventListener("click", () => {
    travelMonth = month.dataset.month;
    travelWhen.innerHTML = travelMonth;
    travelWhen.id = +travelMonth;
  });
});

buttonResult.addEventListener("click", () => {
  // get the result
  if (regionSearch.value === "" || travelMonth === "") {
    // do nothing
    return;
  }

  getClimate(
    CLIMATE_BASE + "mavg/mpi_echam5/a2/tas/2020/2039/" + travelWhere.id
  );
  // mpi_echam5/a2/ // 기후변화 시나리오 종류 중 하나
  // ensemble // 합친거
});

regionForm.addEventListener("submit", (e) => {
  e.preventDefault();

  countryCode = regionSearch.value; // 검색한 국가코드
  getCountries(
    `http://api.worldbank.org/v2/country/${countryCode}?format=json`
  );
});

async function getCountries(url) {
  const res = await fetch(url);
  const data = await res.json();

  const { id, iso2Code, name } = data[1][0];
  // array안에 0이 page 정보 , 1이 country 정보 / country 정보 안에서 0들이 진짜 정보

  console.log(id, iso2Code, name);

  travelWhere.innerHTML = name;
  travelWhere.id = id;
}

// type은 무조건 mavg 여야함(monthly average)
// var => pr(강수량) / tas(기온)
// start 2020
// end 2039

// ppt_means Average daily precipitation
// tmin_means Average daily minimum temperature
// tmax_means Average daily maximum temperature

async function getClimate(url) {
  const res = await fetch(url);
  const data = await res.json();

  console.log(data[0].monthVals); // 1월(0) 부터 12월(11) 까지의 배열

  console.log(data[0].monthVals[travelWhen.id - 1]); // month는 1부터 시작 / data는 0부터 시작
}
