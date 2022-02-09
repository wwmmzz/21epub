import React, { useEffect, useState } from "react";
import './index.css'

const dataUrl =
  "https://gist.githubusercontent.com/Miserlou/c5cd8364bf9b2420bb29/raw/2bf258763cdddd704f8ffd3ea9a3e81d25e2c6f6/cities.json";

let DATA = [];

function App() {
  const [data, setData] = useState([]);
  const [filterData, setFilterData] = useState([]);
  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    DATA = await fetch(dataUrl).then((r) => r.json());
    setData(DATA);
  };

  const handleChange = (text) => {
    if (text) {
      let filter = [];
      const res = data.filter((item) => {
        const str = (item.city + "," + item.state).toLowerCase().split("");
        const t = text.toLowerCase().split("");
        let i = 0,
          j = 0,
          cache = [];
        while (i < t.length && j < str.length) {
          if (str[j] == t[i]) {
            i += 1;
            cache.push(j);
          }
          j += 1;
        }
        if (i == t.length) {
          filter.push(cache);
        }
        return i == t.length;
      });
      setFilterData(filter);
      setData(res);
    } else {
      setFilterData([]);
      setData(DATA);
    }
  };

  return (
    <form className="search-form" id="root">
      <input
        type="text"
        className="search"
        placeholder="City or State"
        onChange={(e) => handleChange(e.target.value)}
      />
      <ul className="suggestions">
        {(data.length &&
          data.map((item, index) => (
            <li key={index}>
              <span className="name">
                {(item.city + "," + item.state).split("").map((t, i) => {
                  if (filterData.length && filterData[index].includes(i)) {
                    return (
                      <span key={i} style={{ backgroundColor: "orange" }}>
                        {t}
                      </span>
                    );
                  } else {
                    return <span key={i}>{t}</span>;
                  }
                })}
                {item.state}
              </span>
              <span className="population">{item.population}</span>
            </li>
          ))) || <li>根据输入筛选数据</li>}
      </ul>
    </form>
  );
}

export default App;
