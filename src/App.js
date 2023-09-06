import React, { useState, useEffect } from "react";
import io from "socket.io-client";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

// const socket = io("http://192.168.0.110:8080");
const socket = io("http://localhost:8080");


// Parent
const App = () => {
  // check if the server is connected
  const [connected, setConnected] = useState(false);
  const [temperaturedata, setTemperature] = useState(null);
  const [humiditydata, setHumidity] = useState(null);
  const [fanStatedata, setFan] = useState(null);
  const [windowStatedata, setWindowState] = useState(null);
  const [AutoMandata, setAutoMan] = useState(null);

  // Add event listener to the socket
  useEffect(() => {
    socket.on("DATA", (data) => {
      setTemperature(Number(data.temp));
      setHumidity(data.hum);
      setAutoMan(data.AutoMan);
      setFan(data.fanState);
      setWindowState(data.windowState);
    });
  }, []);
  useEffect(() => {
    const handleConnection = () => {
      setConnected(true);
    };
    socket.on("connect", handleConnection);
  }, []);
  const [toggle, setToggle] = useState(true);
  return (
    <>
      {connected ? (
        <main>
          {toggle ? (
            <Monitor
              tempData={temperaturedata}
              humData={humiditydata}
              AutoMan={AutoMandata}
              windowState={windowStatedata}
              fanState={fanStatedata}
            />
          ) : (
            <Chart
            tempData={temperaturedata}
            humData={humiditydata}
            />
          )}
          <button className="switch" onClick={() => setToggle(!toggle)}>
            {toggle ? "Chart" : "Monitor"}
          </button>
        </main>
      ) : (
        <div class="container__loading">
          <div class="cloud front">
            <span class="left-front"></span>
            <span class="right-front"></span>
          </div>
          <span class="sun sunshine"></span>
          <span class="sun"></span>
          <div class="cloud back">
            <span class="left-back"></span>
            <span class="right-back"></span>
          </div>
        </div>
      )}
    </>
  );
};

// Child
// main page
const Monitor = ({ tempData, humData, AutoMan, windowState, fanState }) => {
  // const [temperature, setTemperature] = useState(0);
  // const [humidity, setHumidity] = useState(0);
  const temperature = tempData;
  const humidity = humData;
  // Get current date and time
  // Update the date time every second

  const [date, setDate] = useState(new Date());
  const [day, setDay] = useState(date.getDate());
  const [month, setMonth] = useState(date.getMonth() + 1);
  const [hour, setHour] = useState(date.getHours());
  const [twelveHourFormat, setTwelveHourFormat] = useState(hour % 12 || 12);
  const [minute, setMinute] = useState(date.getMinutes());
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const formattedDate = `${dayNames[date.getDay()]}, ${
    monthNames[month - 1]
  } ${day}`;
  const [temp, setTemp] = useState(true); // State to manage temperature display
  const [hum, setHum] = useState(false); // State to manage humidity display
  const handletempClick = () => {
    // Toggle temperature and humidity display when temperature button is clicked
    if (!temp) {
      setHum(!hum);
      setTemp(!temp);
    }
  };
  const handlehumClick = () => {
    // Toggle temperature and humidity display when humidity button is clicked
    if (!hum) {
      setTemp(!temp);
      setHum(!hum);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const currentDate = new Date();
      setDate(currentDate);
      setDay(currentDate.getDate());
      setMonth(currentDate.getMonth() + 1);
      setHour(currentDate.getHours());
      setTwelveHourFormat(currentDate.getHours() % 12 || 12);
      setMinute(currentDate.getMinutes());
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);
  return (
    <>
      <div className="monitor_data">
        <div className="monitor_data__Upper">
          <div className="monitor_data__Upper__DATEandTIME">
            <div className="monitor_data__Upper__DATEandTIME__WEEKday_MONTH_MDAY">
              <p className="WEEKday_MONTH_MDAY">{formattedDate}</p>
              <p className="Time">{twelveHourFormat}</p>
              <p className="Time">{minute}</p>
            </div>
          </div>
          <div className="monitor_data__Upper__TEMPandHUM">
            <div className="monitor_data__Upper__TEMPandHUM__Upper">
              {/* Display temperature or humidity based on the state */}
              <div className="monitor_data__Upper__TEMPandHUM__Upper__TEMPHUM">
                {/* adding condition */}
                {temperature === "0" || humidity === "0" ? (
                  <div class="loader"></div>
                ) : (
                  <TempHumDisplay
                    displayState={temp}
                    tempData={temperature}
                    humiData={humidity}
                  />
                )}
              </div>
            </div>
            <div className="monitor_data__Upper__TEMPandHUM__Lower">
              {/* Button to toggle between temperature and humidity */}
              <button
                className="monitor_data__Upper__TEMPandHUM__Lower__TEMP__button"
                onClick={handletempClick}
              >
                {/* Temperature icon */}
                {/* The stroke color changes based on the 'temp' state */}
                <svg
                  width="30%"
                  height="30%"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M8 15.9998C7.44772 15.9998 7 16.4475 7 16.9998C7 17.5521 7.44772 17.9998 8 17.9998C8.55228 17.9998 9 17.5521 9 16.9998C9 16.4475 8.55228 15.9998 8 15.9998ZM8 15.9998L8.00707 12M8 16.9998L8.00707 17.0069M20 5C20 6.10457 19.1046 7 18 7C16.8954 7 16 6.10457 16 5C16 3.89543 16.8954 3 18 3C19.1046 3 20 3.89543 20 5ZM12 16.9998C12 19.209 10.2091 20.9998 8 20.9998C5.79086 20.9998 4 19.209 4 16.9998C4 15.9854 4.37764 15.0591 5 14.354L5 6C5 4.34315 6.34315 3 8 3C9.65685 3 11 4.34315 11 6V14.354C11.6224 15.0591 12 15.9854 12 16.9998Z"
                    // IF temp is true, then stroke is White, else stroke is black
                    stroke={temp ? "#FFFFFF" : "#223957"}
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </button>
              {/* Button to toggle between temperature and humidity */}
              <button
                className="monitor_data__Upper__TEMPandHUM__Lower__HUM__button"
                onClick={handlehumClick}
              >
                {/* Humidity icon */}
                {/* The stroke color changes based on the 'hum' state */}
                <svg
                  width="30%"
                  height="30%"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                  <g
                    id="SVGRepo_tracerCarrier"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  ></g>
                  <g id="SVGRepo_iconCarrier">
                    {" "}
                    <path
                      d="M22 16C22 19.3137 19.3137 22 16 22C12.6863 22 10 19.3137 10 16C10 11.6863 16 2 16 2C16 2 22 11.6863 22 16Z"
                      // IF hum is true, then stroke is White, else stroke is black
                      stroke={hum ? "#FFFFFF" : "#223957"}
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    ></path>{" "}
                    <path
                      d="M8 9C8 10.6569 6.65685 12 5 12C3.34315 12 2 10.6569 2 9C2 6.84315 5 2 5 2C5 2 8 6.84315 8 9Z"
                      stroke={hum ? "#FFFFFF" : "#223957"}
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    ></path>{" "}
                  </g>
                </svg>
              </button>
            </div>
          </div>
        </div>
        <div className="monitor_data__Lower">
          {/* Control arduino /> */}
          <Control
            AutoMan={AutoMan}
            windowState={windowState}
            fanState={fanState}
          />
        </div>
      </div>
    </>
  );
};
// Upper part of monitor          TEmpHum       temp      hum
export const TempHumDisplay = ({ displayState, tempData, humiData }) => {
  const [TempHumState, setTempHumState] = useState(1);
  const Temperature = Math.round(tempData);
  const Humidity = Math.floor(humiData);
  // convert temperature to farenheit
  const [Farenheit, setFarenheit] = useState(0);
  const [color, setColor] = useState(1);
  const [color2, setColor2] = useState(0);
  const handleColorClick1 = () => {
    if (!color) {
      setColor(!color);
      setColor2(!color2);
      setTempHumState(!TempHumState);
    }
  };
  const handleColorClick2 = () => {
    if (!color2) {
      setColor2(!color2);
      setColor(!color);
      setTempHumState(!TempHumState);
      setFarenheit(Math.floor((Temperature * 9) / 5 + 32));
    }
  };
  return (
    <>
      {displayState ? (
        <>
          <div className="monitor_data__Upper__TEMPandHUM__Upper__TEMPHUM__TEMP__data">
            {/* if TempHumState is true, then display celcius, else display farenheit */}
            {Temperature === 0 ? (
              <div class="loader"></div>
            ) : TempHumState ? (
              <p>{Temperature}</p>
            ) : (
              <p>{Farenheit}</p>
            )}
          </div>
          <div className="monitor_data__Upper__TEMPandHUM__Upper__TEMPHUM__TEMP__symbol">
            <p
              onClick={handleColorClick1}
              style={{ color: color ? "white" : "#223957" }}
            >
              °C
            </p>
            <p
              onClick={handleColorClick2}
              style={{ color: color2 ? "white" : "#223957" }}
            >
              °F
            </p>
          </div>
        </>
      ) : (
        <>
          <div className="monitor_data__Upper__TEMPandHUM__Upper__TEMPHUM__HUM__data">
            {Humidity === 0 ? <div class="loader"></div> : <p>{Humidity}</p>}
          </div>
          <div className="monitor_data__Upper__TEMPandHUM__Upper__TEMPHUM__HUM__symbol">
            <p>%</p>
          </div>
        </>
      )}
    </>
  );
};

// Control part of monitor  AM      window        Fan
export const Control = ({ AutoMan, windowState, fanState }) => {
  const handleAutoClick = () => {
    // Toggle between AUTO and MANUAL mode
    socket.emit("AutoMan", "Clicked");
    console.log("AutoMan clicked");
  };
  const handleFanClick = () => {
    // Toggle between On and Off
    socket.emit("fanState", "Clicked");
    console.log("Fan clicked");
  };
  const handleWindowStateClick = () => {
    // Toggle between Open and Close
    socket.emit("airconState", "Clicked");
    console.log("aircon clicked");
  };

  return (
    <>
      <button
        className="monitor_data__Lower__button__AUTO_MAN lowerbut"
        onClick={handleAutoClick}
      >
        <svg
          width="40px"
          height="40px"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
          <g
            id="SVGRepo_tracerCarrier"
            stroke-linecap="round"
            stroke-linejoin="round"
          ></g>
          <g id="SVGRepo_iconCarrier">
            {" "}
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M12 6C8.69 6 6 8.69 6 12H9L5 16L1 12H4C4 7.58 7.58 4 12 4C13.57 4 15.03 4.46 16.26 5.24L14.8 6.7C13.97 6.25 13.01 6 12 6ZM15 12L19 8L23 12H20C20 16.42 16.42 20 12 20C10.43 20 8.97 19.54 7.74 18.76L9.2 17.3C10.03 17.75 10.99 18 12 18C15.31 18 18 15.31 18 12H15Z"
              fill={AutoMan ? "#8AA1BF" : "#223957"}
            ></path>{" "}
          </g>
        </svg>
        {AutoMan ? "Auto" : "Manual"}
      </button>
      {/* FAN BUTTON */}

      <button
        className="monitor_data__Lower__button__FAN lowerbut"
        onClick={handleFanClick}
        disabled={AutoMan} // Disable button when in MANUAL mode
      >
        <svg
          width="40px"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
          <g
            id="SVGRepo_tracerCarrier"
            stroke-linecap="round"
            stroke-linejoin="round"
          ></g>
          <g id="SVGRepo_iconCarrier">
            {" "}
            <path
              d="M12 17L9 20M12 17L15 20M12 17V12M12 17V21M9 4L12 7L15 4M12 12L16.3301 9.5M12 12L7.66985 9.50001M12 12L16.3301 14.5M12 3V9M16.3301 9.5L19.7942 7.5M16.3301 9.5L20.4283 10.598M16.3301 9.5L17.4283 5.40187M4.20581 16.5L9.40196 13.5M16.3301 14.5L17.4282 18.5981M16.3301 14.5L20.4282 13.4019M16.3301 14.5L19.7943 16.5M7.66985 9.50001L3.57178 10.5981M7.66985 9.50001L6.57178 5.40193M7.66985 9.50001L4.20581 7.5M6.57178 18.598L7.66985 14.4999L3.57178 13.4019"
              stroke={fanState && !AutoMan ? "#8AA1BF" : "#223957"}
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            ></path>{" "}
          </g>
        </svg>
        {fanState ? "On" : "Off"}
      </button>
      {/* WINDOW BUTTON */}
      <button
        className="monitor_data__Lower__button__WINDOW lowerbut"
        onClick={handleWindowStateClick}
        disabled={AutoMan} // Disable button when in MANUAL mode
      >
        <svg
          width="40px"
          height="40px"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
          <g
            id="SVGRepo_tracerCarrier"
            stroke-linecap="round"
            stroke-linejoin="round"
          ></g>
          <g id="SVGRepo_iconCarrier">
            {" "}
            <path
              d="M8 12H14M5 9H16.5C17.8807 9 19 7.88071 19 6.5C19 5.11929 17.8807 4 16.5 4M4 15H17C18.1046 15 19 15.8954 19 17C19 18.1046 18.1046 19 17 19"
              stroke={windowState && !AutoMan ? "#8AA1BF" : "#223957"}
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            ></path>{" "}
          </g>
        </svg>
        {windowState ? "On" : "Off" }
      </button>
    </>
  );
};

// Child
// Second page
const Chart = ({ tempData, humData}) => {
  // const array of temperature and humidity
  const [timestampt, setTimestamps] = useState([]);
  const [temperature, setTemperatures] = useState([]);
  const [humidity, setHumidities] = useState([]);

  
  useEffect(() => {
    socket.on("CHART", (data) => {
      const temperatures = data.map((item) => item.temperature);
      const humidities = data.map((item) => item.humidity);
      const timestamps = data.map((item) => item.timestamp_);
      setTemperatures(temperatures);
      setHumidities(humidities);
      setTimestamps(timestamps);
      console.log(timestamps);
    });
  }, []);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
    },
  };
  // format time from timestamp
  function format24HourTo12Hour(timestampt) {
    const [hours, minutes] = timestampt.split(':').map(Number);
  
    const period = hours >= 12 ? 'PM' : 'AM';
  
    let hours12 = hours % 12;
    hours12 = hours12 === 0 ? 12 : hours12;
  
    const time12 = `${hours12}:${minutes.toString().padStart(2, '0')} ${period}`;
  
    return time12;
  }
  
  
  const timestamps12Hour = timestampt.map(timestamp => format24HourTo12Hour(timestamp));
 
  const labels = timestamps12Hour;
  const data = {
    labels: labels,
    datasets: [
      {
        label: "Temperature",
        data: temperature,
        backgroundColor: (context) => {
          const chart = context.chart;
          const { chartArea } = chart;
          if (!chartArea) {
            return null;
          }
          // if(context.dataIndex === 0){
          return getGradient(chart, context.dataIndex);
        },
        borderRadius: 5,
      },
      {
        label: "Humidity",
        data: humidity,
        backgroundColor: (context) => {
          const chart = context.chart;
          const { chartArea } = chart;
          if (!chartArea) {
            return null;
          }
          // if(context.dataIndex === 0){
          return getGradient1(chart, context.dataIndex);
        },
        borderRadius: 5,
      },
    ],
  };

  function getGradient(chart, dataIndex) {
    const {
      ctx,
      chartArea: { top, bottom },
    } = chart;
    const graddientSegment = ctx.createLinearGradient(0, top, 0, bottom);
    // add condotion to change color if temp is high or low
    if (temperature[dataIndex] > 33) {
      graddientSegment.addColorStop(0, "red");
      graddientSegment.addColorStop(0.3, "orange");
      graddientSegment.addColorStop(0.8, "blue");
      graddientSegment.addColorStop(1, "navy");
    } else if (temperature[dataIndex] <= 33 && temperature[dataIndex] > 29) {
      graddientSegment.addColorStop(0, "orange");
      graddientSegment.addColorStop(0.8, "blue");
      graddientSegment.addColorStop(1, "navy");
    } else {
      graddientSegment.addColorStop(0, "blue");
      graddientSegment.addColorStop(1, "navy");
    }

    return graddientSegment;
  }
  function getGradient1(chart, dataIndex) {
    const {
      ctx,
      chartArea: { top, bottom },
    } = chart;
    const graddientSegment = ctx.createLinearGradient(0, top, 0, bottom);
    // add condotion to change color if temp is high or low
    if (humidity[dataIndex] > 90) {
      graddientSegment.addColorStop(0, "navy");
      graddientSegment.addColorStop(0.2, "blue");
      graddientSegment.addColorStop(0.4, "teal");
      graddientSegment.addColorStop(0.6, "teal");
      graddientSegment.addColorStop(0.7, "green");
      graddientSegment.addColorStop(0.8,  "orange");
      graddientSegment.addColorStop(0.9, "brown");
      graddientSegment.addColorStop(1, "red");
    } else if (humidity[dataIndex] <= 90 && humidity[dataIndex] > 80) {
      graddientSegment.addColorStop(0, "blue");
      graddientSegment.addColorStop(0.2, "teal");
      graddientSegment.addColorStop(0.4, "teal");
      graddientSegment.addColorStop(0.6, "green");
      graddientSegment.addColorStop(0.7, "orange");
      graddientSegment.addColorStop(0.9, "brown");
      graddientSegment.addColorStop(1, "red");
    } else if (humidity[dataIndex] <= 80 && humidity[dataIndex] > 70) {
      graddientSegment.addColorStop(0, "teal");
      graddientSegment.addColorStop(0.2, "teal");
      graddientSegment.addColorStop(0.4, "green");
      graddientSegment.addColorStop(0.6, "orange");
      graddientSegment.addColorStop(0.9, "brown");
      graddientSegment.addColorStop(1, "red");
    } else if (humidity[dataIndex] <= 70 && humidity[dataIndex] > 60) {
      graddientSegment.addColorStop(0, "teal");
      graddientSegment.addColorStop(0.2, "green");
      graddientSegment.addColorStop(0.4, "orange");
      graddientSegment.addColorStop(0.9, "brown");
      graddientSegment.addColorStop(1, "red");
    } else if (humidity[dataIndex] <= 60 && humidity[dataIndex] > 50) {
      graddientSegment.addColorStop(0, "green");
      graddientSegment.addColorStop(0.2, "orange");
      graddientSegment.addColorStop(0.9, "brown");
      graddientSegment.addColorStop(1, "red");
    } else if (humidity[dataIndex] <= 50 && humidity[dataIndex] > 40) {
      graddientSegment.addColorStop(0, "orange");
      graddientSegment.addColorStop(0.5, "brown");
      graddientSegment.addColorStop(1, "red");
    } else if (humidity[dataIndex] <= 40 && humidity[dataIndex] > 30) {
      graddientSegment.addColorStop(0, "brown");
      graddientSegment.addColorStop(1, "red");
    } else {
      graddientSegment.addColorStop(0, "red");
      graddientSegment.addColorStop(1, "red");
    }
    return graddientSegment;
  }

  return (
    <>
      <div className="chart">
        <h1>Temperature Chart</h1>
        <div className="chart__conatainer">
          <div className="indicator">
            <div className="indicator__temp">
              <div className="indicator__temp__color"></div>
              <p>Current Temperature: {tempData}° </p>
              <p>Current Humidity: {humData}% </p>
            </div>
          </div>
          <Bar data={data} options={options} height={500} width={1000} />
        </div>
      </div>
    </>
  );
};

export default App;
