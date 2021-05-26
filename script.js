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
const finalResult = document.querySelector(".result-container");

// input에 검색한 단어 아니면 b만 눌러도 b로 시작하는 애들 다 보여주기 br 이면 brazil 띄우고 br을 ${}
// input에 입력된 b를 저기 URL에서 찾아서 보여줌
// 그거 가지고 country ID 알아냄 그게 바로 ISO3 임
// 거기서 날씨 정보 꺼내서 보여주면 끝!

let countryCode = ""; // input 값이 들어갈 자리
let travelMonth = "";

const seasonImg = [
  "http://images.unsplash.com/photo-1542601098-8fc114e148e2?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTF8fHdpbnRlcnxlbnwwfHwwfHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60",
  "http://images.unsplash.com/photo-1603959620938-4a8eae84709a?ixid=MnwxMjA3fDB8MHxzZWFyY2h8OXx8YXV0b21ufGVufDB8fDB8fA%3D%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=700&q=60",
  "http://images.unsplash.com/photo-1600647993560-11a92e039466?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTN8fHNwcmluZ3xlbnwwfHwwfHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=700&q=60",
  "http://images.unsplash.com/photo-1473496169904-658ba7c44d8a?ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8c3VtbWVyfGVufDB8fDB8fA%3D%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=700&q=60",
  "http://images.unsplash.com/photo-1527513167268-961466388f0d?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTF8fGhvdCUyMHN1bW1lcnxlbnwwfHwwfHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=700&q=60",
];

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
    alert("where and when exactly do you want to go?");
    return;
  }

  console.log(
    `${CLIMATE_BASE}mavg/mpi_echam5/a2/tas/2020/2039/${travelWhere.id}`
  );

  getClimate(
    `${CLIMATE_BASE}mavg/mpi_echam5/a2/tas/2020/2039/${travelWhere.id}`
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
  console.log(url);
  const res = await fetch(url);
  const data = await res.json();

  console.log(data[0].monthVals); // 1월(0) 부터 12월(11) 까지의 배열

  console.log(data[0].monthVals[travelWhen.id - 1]); // month는 1부터 시작 / data는 0부터 시작
  showResult(data[0].monthVals[travelWhen.id - 1]);
}

// 결과 총망라해서 여행 적합 판단하기
function showResult(temper) {
  // 소수점 정리
  temper = temper.toFixed(1);
  // 기온(tas), 강수량(pr)
  if (temper < 8) {
    console.log(`${travelWhen.id}월에 ${travelWhere.innerHTML} 가면 추워요`);
    createResultEl(0, travelWhen.id, travelWhere.innerHTML, temper, "추워요");
  } else if (temper >= 8 && temper < 13) {
    console.log(
      `${travelWhen.id}월에 ${travelWhere.innerHTML} 가면 조금 쌀쌀해요`
    );
    createResultEl(
      1,
      travelWhen.id,
      travelWhere.innerHTML,
      temper,
      "조금 쌀쌀해요"
    );
  } else if (temper >= 13 && temper < 20) {
    console.log(
      `${travelWhen.id}월에 ${travelWhere.innerHTML} 가면 날씨 좋아요, 딱 이예요`
    );
    createResultEl(
      2,
      travelWhen.id,
      travelWhere.innerHTML,
      temper,
      "날씨 좋아요, 딱 이예요"
    );
  } else if (temper >= 20 && temper < 26) {
    console.log(`${travelWhen.id}월에 ${travelWhere.innerHTML} 가면 더워요`);
    createResultEl(3, travelWhen.id, travelWhere.innerHTML, temper, "더워요");
  } else {
    console.log(`${travelWhen.id}월에 ${travelWhere.innerHTML} 가면 쪄 죽어요`);
    createResultEl(
      4,
      travelWhen.id,
      travelWhere.innerHTML,
      temper,
      "쪄 죽어요"
    );
  }

  // input 및 버튼 text들 지우기 // 지우고 새로고침 버튼으로 대체?
  regionSearch.value = "";
  travelWhen.innerHTML = "몇";
  travelWhen.id = "";
  travelWhere.innerHTML = "어디로";
  travelWhere.id = "";
}

function createResultEl(
  season,
  when,
  where,
  temperature,
  precipitation,
  feeling
) {
  finalResult.innerHTML = `
  <img
  src="${seasonImg[season]}"
  alt="${temperature}"
/>
  <h2>${when}월 ${where} 여행</h2>
  <p>
    "평균 기온은 ${temperature}도, 평균 강수량은 ${precipitation} 이 때 여기가면 ${feeling}"
  </p>
  `;
}

// input 넣을 때 국가 이름 검색되도록 (추천까지)
// img도 날씨에 맞는 이미지를 random으로 불러오기
// 몇월 어디로 여행 버튼 결과 나왔을 때는 다시하기 버튼으로 바꾸기
// img안에 들어가는 h2, p 태그 안에 글씨들 사진마다 색 다르게 하기
// 기온만 말고 강수량까지 나타내기
// 날씨별 옷차림 알려주기
// 일교차 같은 것도 나와있으면 내용 추가
// fetch 실패 handle (https 도메인에서 http api를 호출하고 있어서 안됐었음 surge에서 배포하면 됨)
