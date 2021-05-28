import React, { useState } from "react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import { scaleQuantile } from "d3-scale";
import ReactTooltip from "react-tooltip";

import LinearGradient from "./LinearGradient.js";
import "./App.css";

/**
 * Courtesy: https://rawgit.com/Anujarya300/bubble_maps/master/data/geography-data/india.topo.json
 * Looking topojson for other countries/world?
 * Visit: https://github.com/markmarkoh/datamaps
 */
const INDIA_TOPO_JSON = require("./india.topo.json");

const PROJECTION_CONFIG = {
  scale: 5500,
  center: [78, 11] // always in [East Latitude, North Longitude]
};

// Red Variants
const COLOR_RANGE = [
  "#ffedea",
  "#ffcec5",
  "#ffad9f",
  "#ff8a75",
  "#ff5533",
  "#e2492d",
  "#be3d26",
  "#9a311f",
  "#782618"
];

const DEFAULT_COLOR = "#000";

const getRandomInt = () => {
  return parseInt(Math.random() * 100);
};

const geographyStyle = {
  default: {
    outline: "none"
  },
  hover: {
    fill: "#ccc",
    transition: "all 250ms",
    outline: "none"
  },
  pressed: {
    outline: "none"
  }
};

// will generate random heatmap data on every call
const getHeatMapData = () => {
  return [
    {
      id: "AY",
      DistrictName: "Ariyalur",
      value: "754,894"
    },
    {
      id: "CP",
      DistrictName: "Chengalpet",
      value: "25,56,244"
    },
    {
      id: "CHE",
      DistrictName: "Chennai",
      value: "46,46,732"
    },
    {
      id: "CBT",
      DistrictName: "Coimbatore",
      value: "34,58,045"
    },
    {
      id: "CUD",
      DistrictName: "Cuddalore",
      value: "26,05,914"
    },
    {
      id: "DP",
      DistrictName: "Dharmapuri",
      value: "15,06,843"
    },
    {
      id: "DG",
      DistrictName: "Dindigul",
      value: "21,59,775"
    },
    {
      id: "ER",
      DistrictName: "Erode",
      value: "22,51,744"
    },
    {
      id: "KK",
      DistrictName: "Kallakurichi",
      value: "13,70,281"
    },
    {
      id: "KCP",
      DistrictName: "Kancheepuram",
      value: "11,66,401"
    },
    {
      id: "KAR",
      DistrictName: "Karur",
      value: "10,64,493"
    },
    {
      id: "KG",
      DistrictName: "Krishnagiri",
      value: "18,83,731"
    },
    {
      id: "MAD",
      DistrictName: "Madurai",
      value: "30,38,252"
    },
    {
      id: "NGP",
      DistrictName: "Nagapattinam",
      value: "16,16,450"
    },
    {
      id: "KAK",
      DistrictName: "Kanyakumari",
      value: "18,70,374"
    },
    {
      id: "NK",
      DistrictName: "Namakkal",
      value: "17,26,601"
    },
    {
      id: "PR",
      DistrictName: "Perambalur",
      value: "5,65,223"
    },
    {
      id: "PUD",
      DistrictName: "Pudukottai",
      value: "16,18,345"
    },
    {
      id: "RMP",
      DistrictName: "Ramanathapuram",
      value: "13,53,445"
    },
    {
      id: "RP",
      DistrictName: "Ranipet",
      value: "12,10,277"
    },
    {
      id: "SAL",
      DistrictName: "Salem",
      value: "34,82,056"
    },
    {
      id: "SGG",
      DistrictName: "Sivagangai",
      value: "13,39,101"
    },
    {
      id: "TK",
      DistrictName: "Tenkasi",
      value: "14,07,627"
    },
    {
      id: "TJN",
      DistrictName: "Thanjavur",
      value: "24,05,890"
    },
    {
      id: "THN",
      DistrictName: "Theni",
      value: "12,45,899"
    },
    {
      id: "THV",
      DistrictName: "Thiruvallur",
      value: "37,28,104"
    },
    {
      id: "THV",
      DistrictName: "Thiruvarur",
      value: "12,64,277"
    },
    {
      id: "TUT",
      DistrictName: "Tuticorin",
      value: "17,50,176"
    },
    {
      id: "TC",
      DistrictName: "Trichirappalli",
      value: "27,22,290"
    },
    {
      id: "TNV",
      DistrictName: "Thirunelveli",
      value: "16,65,253"
    },
    {
      id: "TPT",
      DistrictName: "Tirupathur",
      value: "11,11,812"
    },
    {
      id: "TPR",
      DistrictName: "Tiruppur",
      value: "24,79,052"
    },
    {
      id: "TVM",
      DistrictName: "Tiruvannamalai",
      value: "24,64,875"
    },
    {
      id: "NG",
      DistrictName: "Nilgiris",
      value: "7,35,394"
    },
    {
      id: "VEL",
      DistrictName: "Vellore",
      value: "16,14,242"
    },
    {
      id: "VIL",
      DistrictName: "Viluppuram",
      value: "20,93,003"
    },
    {
      id: "VDN",
      DistrictName: "Virudhunagar",
      value: "1,942,288"
    }
  ];
};

function App() {
  const [tooltipContent, setTooltipContent] = useState("");
  const [data, setData] = useState(getHeatMapData());

  const gradientData = {
    fromColor: COLOR_RANGE[0],
    toColor: COLOR_RANGE[COLOR_RANGE.length - 1],
    min: 0,
    max: data.reduce((max, item) => (item.value > max ? item.value : max), 0)
  };

  const colorScale = scaleQuantile()
    .domain(data.map((d) => d.value))
    .range(COLOR_RANGE);

  const onMouseEnter = (geo, current = { value: "NA" }) => {
    return () => {
      setTooltipContent(`${geo.properties.name}: ${current.value}`);
    };
  };

  const onMouseLeave = () => {
    setTooltipContent("");
  };

  const onChangeButtonClick = () => {
    setData(getHeatMapData());
  };

  return (
    <div className="full-width-height container">
      <h1 className="no-margin center">DistrictNames and UTs</h1>
      <ReactTooltip>{tooltipContent}</ReactTooltip>
      <ComposableMap
        projectionConfig={PROJECTION_CONFIG}
        projection="geoMercator"
        // width={800}
        // height={520}
        data-tip=""
      >
        <Geographies geography={INDIA_TOPO_JSON}>
          {({ geographies }) =>
            geographies.map((geo) => {
              //console.log(geo.id);
              const current = data.find((s) => s.id === geo.id);
              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill={current ? colorScale(current.value) : DEFAULT_COLOR}
                  style={geographyStyle}
                  onMouseEnter={onMouseEnter(geo, current)}
                  onMouseLeave={onMouseLeave}
                />
              );
            })
          }
        </Geographies>
      </ComposableMap>
      <LinearGradient data={gradientData} />
      <div className="center">
        <button className="mt16" onClick={onChangeButtonClick}>
          Change
        </button>
      </div>
    </div>
  );
}

export default App;
