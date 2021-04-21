"use strict";
function success(pos) {
  ajaxRequest(pos.coords.latitude, pos.coords.longitude);
}

function fail(error) {
  alert("位置情報の取得に失敗しました" + error.code);
}
navigator.geolocation.getCurrentPosition(success, fail);
function utcToJSTime(utcTime) {
  return utcTime * 1000;
}
function ajaxRequest(lat, long) {
  const url = "https://api.openweathermap.org/data/2.5/forecast";
  const appId = "62964bbe4935c199d0a74d3f2e1b4cae";

  $.ajax({
    url: url,
    data: {
      appid: appId,
      lat: lat,
      lon: long,
      units: "metric",
      lang: "ja",
    },
  })
    .done(function (data) {
      console.log(data);

      data.list.forEach(function (forecast, index) {
        const dateTime = new Date(utcToJSTime(forecast.dt));
        const month = dateTime.getMonth() + 1;
        const date = dateTime.getDate();
        const hours = dateTime.getHours();
        const min = String(dateTime.getMinutes()).padStart(2, `0`);
        const temperature = Math.round(forecast.main.temp);
        const description = forecast.weather[0].description;
        const iconPath = `images/${forecast.weather[0].icon}.svg`;

        console.log("日時" + `${month}/${date}/${hours}/${min}`);
        console.log("気温" + temperature);
        console.log("天気" + description);
        console.log("画像パス" + iconPath);

        // if ([0].mine === "Clouds") {
        //     console.log("d")
        //     $("#back-ground_2").addClass("Clouds")
        // } else if ([0].mine === "Rain") {
        //     $("#back-fround_2").addClass("Rain")
        // } else if ([0].mine === "Clear") {
        //     $("#back-ground_2").addClass("Clear")
        // }
        $("#city").text(data.city.name);
        if (index === 0) {
          const mine = forecast.weather[0].main;
          console.log(mine);
          if (mine === "Clouds") {
            $("#back-ground_2").addClass("Clouds");
          } else if (mine === "Rain") {
            $("#back-ground_2").addClass("Rain");
          } else {
            $("#back-ground_2").addClass("Clear");
          }

          const currentWeather = `
            <div class="container_left">
                 <h1 id="city">都市名</h1>
                <div class="icon"><img src="/${iconPath}"></div>
                            <table> </table>
            </div >
            <div class="container_right">
                <h1 class = "now_wether">現在の天気</h1>
                <div class="wether">
                    <div class = "description">${description}</div>
                    <div class = "temperature">${temperature}°C</div>
                </div>
                 <div class = "now_date">${month}月${date}日${hours}時${min}分</div>
            </div>
            `;
          $("#container").html(currentWeather);
        } else {
          const tableRow = `
                    <tr>
                        <td class = "info">
                            ${month}月${date}日${hours}時${min}分
                        </td>
                        <td class = "icon"><img src = "/${iconPath}"></td>
                        <td><span class = "description_td">${description}</span></td>
                        <td><span class = "temp_td">${temperature}°C</span></td>

                    </tr>`;
          $("#forecast").append(tableRow);
        }
      });
    })
    .fail(function () {
      console.log(`$.ajax faild!`);
    });
}
