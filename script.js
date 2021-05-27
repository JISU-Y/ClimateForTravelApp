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
let feelings = [];
var climateInfo = {};
let season = 0;

const seasonImg = [
  "https://images.unsplash.com/photo-1542601098-8fc114e148e2?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTF8fHdpbnRlcnxlbnwwfHwwfHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60",
  "https://images.unsplash.com/photo-1603959620938-4a8eae84709a?ixid=MnwxMjA3fDB8MHxzZWFyY2h8OXx8YXV0b21ufGVufDB8fDB8fA%3D%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=700&q=60",
  "https://images.unsplash.com/photo-1600647993560-11a92e039466?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTN8fHNwcmluZ3xlbnwwfHwwfHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=700&q=60",
  "https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8c3VtbWVyfGVufDB8fDB8fA%3D%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=700&q=60",
  "https://images.unsplash.com/photo-1527513167268-961466388f0d?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTF8fGhvdCUyMHN1bW1lcnxlbnwwfHwwfHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=700&q=60",
];

// object 길이 구하는 함수 가져옴
const getLengthOfObject = (obj) => {
  return Object.keys(obj).length;
};

months.forEach((month) => {
  month.addEventListener("click", () => {
    travelMonth = month.dataset.month;
    travelWhen.innerHTML = travelMonth;
    travelWhen.id = +travelMonth;
  });
});

console.log(season, climateInfo, feelings);

buttonResult.addEventListener("click", () => {
  console.log(season, climateInfo, feelings);

  // get the result
  if (regionSearch.value === "" || travelMonth === "") {
    // do nothing
    alert("where and when exactly do you want to go?");
    return;
  }

  // 평균 기온, 평균 강수량 구하기
  getClimate(
    `${CLIMATE_BASE}mavg/mpi_echam5/a2/tas/2020/2039/${travelWhere.id}`,
    `${CLIMATE_BASE}mavg/mpi_echam5/a2/pr/2020/2039/${travelWhere.id}`
  );

  // mpi_echam5/a2/ // 기후변화 시나리오 종류 중 하나
  // ensemble // 합친거

  // 일교차 구하기
  const urlMin = `${CLIMATE_BASE}mavg/ensemble/a2/10/tmin_means/2046/2065/kor`;
  const urlMax = `${CLIMATE_BASE}mavg/ensemble/a2/90/tmax_means/2046/2065/kor`;
  getTemperDiff(urlMin, urlMax);

  // // 기온(tas)별 image
  // season = temperSeasonImage(realTas);

  console.log(season, climateInfo, feelings);

  // getClimate, getTemperDiff 하면서 feelings에다가 다 담음
  // 그 다음에 요소 생성, 나타내기
  // createResultEl(
  //   season,
  //   travelWhen.id,
  //   travelWhere.innerHTML,
  //   climateInfo,
  //   feelings
  // );
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

async function getClimate(url_tas, url_pr) {
  // tas(기온)
  const res_tas = await fetch(url_tas);
  const data_tas = await res_tas.json();
  console.log(data_tas);

  // pr(강수량)
  const res_pr = await fetch(url_pr);
  const data_pr = await res_pr.json();
  console.log(data_pr);

  console.log(travelWhen.id);

  const realTas = data_tas[0].monthVals[travelWhen.id - 1].toFixed(1);
  const realPr = data_pr[0].monthVals[travelWhen.id - 1].toFixed(1);

  addToResult(realTas, data_tas[0].variable);
  addToResult(realPr, data_pr[0].variable);

  console.log(season, climateInfo, feelings);
}

async function getTemperDiff(url_min, url_max) {
  const res_min = await fetch(url_min);
  const data_min = await res_min.json();

  const res_max = await fetch(url_max);
  const data_max = await res_max.json();

  console.log(data_min);

  console.log(data_max);

  let data_diff = [];
  for (let i = 0; i < data_min[0].monthVals.length; i++) {
    data_diff[i] = data_max[0].monthVals[i] - data_min[0].monthVals[i]; // 일교차 배열 따로 만듦
  }

  console.log(travelWhen.id);
  console.log(data_diff[travelWhen.id - 1]);
  const realDiff = data_diff[travelWhen.id - 1].toFixed(1);

  console.log(data_diff);
  addToResult(realDiff, "diff");

  console.log(season, climateInfo, feelings);
}

function addToResult(monthVals, param) {
  // 일단 param은 tas(기온), pr(강수량), diff(일교차) 밖에 없음
  // 아마 feelings 배열은 전역으로 빼야할 듯?

  // tas pr은 variable key값에 들어있고,
  // min max는 variable없고 percentile로 구분해야할 듯(10이 최저, 90이 최고)
  // const param = data[0].variable ? data[0].variable : data[0].percentile;

  if (param === "tas") {
    // 들어온 게 tas(기온)이면
    climateInfo.temperature = monthVals;
    temperFeeling(feelings, monthVals);
  } else if (param === "pr") {
    // 강수량
    climateInfo.precipitation = monthVals;
    rainFeeling(feelings, monthVals);
  } else if (param === "diff") {
    // 일교차
    climateInfo.tempDifference = monthVals;
    tempDiffFeeling(feelings, monthVals);
  }

  if (getLengthOfObject(climateInfo) === 3) {
    //climate 수집 다 끝나야 요소 생성
    createResultEl(
      season,
      travelWhen.id,
      travelWhere.innerHTML,
      climateInfo,
      feelings
    );

    // // input 및 버튼 text들 지우기 // 지우고 새로고침 버튼으로 대체?
    clearInputValues();
  }

  console.log(season, climateInfo, feelings);
}

function temperFeeling(feelings, temperature) {
  if (temperature < 8) {
    season = 0;
    feelings.push("추워요");
  } else if (temperature >= 8 && temperature < 13) {
    season = 1;
    feelings.push("조금 쌀쌀해요");
  } else if (temperature >= 13 && temperature < 20) {
    season = 2;
    feelings.push("날씨 좋아요, 딱 이에요");
  } else if (temperature >= 20 && temperature < 26) {
    season = 3;
    feelings.push("더워요");
  } else {
    season = 4;
    feelings.push("쪄 죽어요");
  }
}

function temperSeasonImage(temperature) {
  if (temperature < 8) {
    return 0;
  } else if (temperature >= 8 && temperature < 13) {
    return 1;
  } else if (temperature >= 13 && temperature < 20) {
    return 2;
  } else if (temperature >= 20 && temperature < 26) {
    return 3;
  } else {
    return 4;
  }
}

function rainFeeling(feelings, precipitation) {
  if (precipitation < 50) {
    feelings.push("눈/비는 거의 안 와요");
  } else if (precipitation >= 50 && precipitation < 100) {
    feelings.push("눈/비가 이따금씩 와요");
  } else if (precipitation >= 100 && precipitation < 200) {
    feelings.push("눈/비가 자주 와요");
  } else {
    feelings.push("눈/비가 거의 매일 와요");
  }
}

function tempDiffFeeling(feelings, temperDiff) {
  if (temperDiff < 5) {
    feelings.push("일교차는 거의 없어요");
  } else if (temperDiff >= 5 && temperDiff < 10) {
    feelings.push("일교차가 조금은 있어요");
  } else if (temperDiff >= 10 && temperDiff < 20) {
    feelings.push("일교차가 큰 날씨예요");
  } else {
    feelings.push("일교차가 매우 커요. 조심하세요.");
  }
}

function createResultEl(season, when, where, climateInfo, feelings) {
  console.log(season, climateInfo, feelings);

  finalResult.innerHTML = `
  <img
  src="${seasonImg[season]}"
  alt=""
/>
  <h2>${when}월 ${where} 여행</h2>
  <p class="pResult" style="font-size:18px; font-weight:bold;">
    "평균 기온은 ${climateInfo.temperature}도, 평균 강수량은 ${climateInfo.precipitation}mm
     평균 일교차는 ${climateInfo.tempDifference}도" </br>
     이 때 여기가면
     </p>
  `;

  const pResult = document.querySelector(".pResult");
  const spanFeelings = document.createElement("span");
  feelings.forEach((feeling) => {
    spanFeelings.innerHTML += feeling + "</br>";
  });
  spanFeelings.style.fontSize = "16px";

  pResult.after(spanFeelings);
}

function clearInputValues() {
  // // input 및 버튼 text들 지우기 // 지우고 새로고침 버튼으로 대체?
  regionSearch.value = "";
  travelWhen.innerHTML = "몇";
  travelWhen.id = "";
  travelWhere.innerHTML = "어디로";
  travelWhere.id = "";

  season = 0;
  feelings = [];
  climateInfo = [];
}

// input 넣을 때 국가 이름 검색되도록 (추천까지)
// img도 날씨에 맞는 이미지를 random으로 불러오기
// 몇월 어디로 여행 버튼 결과 나왔을 때는 다시하기 버튼으로 바꾸기
// 결과 나올 때 어디로 언제쯤 클릭하는 거 다 덮어버리기? 트랜지션으로 쑥 올라오게?
// img안에 들어가는 h2, p 태그 안에 글씨들 사진마다 색 다르게 하기
// data 가져올 동안 loading 효과 추가
// 일교차 같은 것도 나와있으면 내용 추가 => 일교차 있는데 2045 - 2065 예측데이터임..
// 날씨별 옷차림 알려주기

// 기온만 말고 강수량까지 나타내기
// fetch 실패 handle (https 도메인에서 http api를 호출하고 있어서 안됐었음 surge에서 배포하면 됨)

//http://unnatural-legs.surge.sh/
