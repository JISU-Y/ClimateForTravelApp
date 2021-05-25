// http://climatedataapi.worldbank.org/climateweb/rest/v1/country/type/var/start/end/ISO3[.ext]

// base URL
// http://climatedataapi.worldbank.org/climateweb/rest/

// country api / countryCode(2글자)
// http://api.worldbank.org/v2/country/${countryCode}?format=json

const countryCode = URL("http://api.worldbank.org/v2/country/");

// input에 검색한 단어 아니면 b만 눌러도 b로 시작하는 애들 다 보여주기 br 이면 brazil 띄우고 br을 ${}
// input에 입력된 b를 저기 URL에서 찾아서 보여줌
// 그거 가지고 country ID 알아냄 그게 바로 ISO3 임
// 거기서 날씨 정보 꺼내서 보여주면 끝!

const climate = URL(
  "http://climatedataapi.worldbank.org/climateweb/rest/v1/country/type/var/start/end/ISO3"
);

// type은 무조건 mavg 여야함(monthly average)
// var => pr(강수량) / tas(기온)
// start 2020
// end 2039
