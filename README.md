# Climate for Travel App

여행을 위한 세계 기후 정보 어플

- 여행 국가 및 여행 예정월 선택 후 평균 기후 정보 표시하며 그에 따른 여행 적합성 판단 어플

### 주요 기능

1. 국가 검색 기능(299 개국)
2. 국가별/월별 기후(월 평균 기온, 일교차, 강수량) 정보 표시
3. 기후별 체감 및 강수량별 눈/비 빈도 판단

<!-- Line -->

### UI 및 결과 Image

#### Main UI Image

<img width="174" alt="Main UI" src="https://user-images.githubusercontent.com/80020227/124286811-484e6880-db8a-11eb-93e2-32eeac25ce7a.PNG">

---

#### How to use
![ResultVideo](https://user-images.githubusercontent.com/80020227/124354549-8493ce80-dc47-11eb-8b3e-e617e783afa5.gif)

---

### 사용 언어
1. HTML
2. CSS
3. Javascript

---

### API

1. 국가별 예측 기후 정보
https://datahelpdesk.worldbank.org/knowledgebase/articles/902061-climate-data-api

- World Bank에서 제공하는 국가별 예측 기후(월별 평균 기온, 월별 평균 강수량) 정보
- 예측 년도 (2020 ~ 2039), 예측 시나리오는 현재 기준(2021) 평년 기후와 가장 비슷한 시나리오를 선택

2. 국가 정보
https://datahelpdesk.worldbank.org/knowledgebase/articles/898590-country-api-queries

- World Bank에서 제공하는 국가 정보(국가 코드, 국가명) 정보

---

### 기타

#### 개발 이유
 - 개인적으로 세계 여행을 좋아하며 여행을 떠나기 전 해당 나라가 여행에 적합한지(날씨가 어떤지, 언제 가야 좋은지 등)을 알아보고 싶었습니다.
 - 여행 적합성 판단에는 국가적인 제한, 성수기 여부, 거리 등 변수가 많지만 여행 국가를 정한 상태라면 가장 중요한 것은 날씨라고 생각했습니다.
 - 따라서 기온과 강수량에 대한 API를 사용하여 기온, 일교차, 강수량 등을 기준에 따라 판단하여 나름의 여행 적합성을 판단해주는 사이트를 제작하게 되었습니다.

#### 개발 인원
1인

#### 개발 기간
1주
