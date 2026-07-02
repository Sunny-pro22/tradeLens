
import React, { useState, useRef, useCallback } from 'react'
import { FiUpload, FiFile } from 'react-icons/fi'
import styles from './FileUpload.module.css'

function FileUpload({ onDataLoaded }) {
  const [dragActive, setDragActive] = useState(false)
  const [fileName, setFileName] = useState('')
  const fileInputRef = useRef(null)

  const parseFile = useCallback((file) => {
  const reader = new FileReader();

  reader.onload = (e) => {
    try {
      let parsedData = [];
      const content = e.target.result;

      if (file.name.endsWith(".json")) {
        const json = JSON.parse(content);

        if (Array.isArray(json)) {
          parsedData = json.map((item) => ({
            date: item.date || item.Date || item.timestamp,
            open: Number(item.open || item.Open),
            high: Number(item.high || item.High),
            low: Number(item.low || item.Low),
            close: Number(
              item.close ||
              item.Close ||
              item["Close/Last"]
            ),
            volume: Number(item.volume || item.Volume),
          }));
        }
      }

      else if (file.name.endsWith(".csv")) {

        const lines = content
          .split(/\r?\n/)
          .filter((l) => l.trim());

        const headers = lines[0]
          .split(",")
          .map((h) => h.trim());

        const findIndex = (...names) =>
          headers.findIndex((h) =>
            names.some(
              (n) => h.toLowerCase() === n.toLowerCase()
            )
          );

        const dateIndex = findIndex("date", "Date");

        const openIndex = findIndex("open", "Open");

        const highIndex = findIndex("high", "High");

        const lowIndex = findIndex("low", "Low");

        const closeIndex = findIndex(
          "close",
          "Close",
          "Close/Last",
          "Adj Close",
          "Adj Close*"
        );

        const volumeIndex = findIndex(
          "volume",
          "Volume"
        );

        if (
          dateIndex === -1 ||
          openIndex === -1 ||
          highIndex === -1 ||
          lowIndex === -1 ||
          closeIndex === -1 ||
          volumeIndex === -1
        ) {
          throw new Error(
            "CSV must contain Date/Open/High/Low/Close/Volume columns."
          );
        }

        const clean = (value) =>
          Number(
            String(value)
              .replace(/\$/g, "")
              .replace(/,/g, "")
              .trim()
          );

        for (let i = 1; i < lines.length; i++) {

          const values = lines[i].split(",");

          parsedData.push({
            date: values[dateIndex],

            open: clean(values[openIndex]),

            high: clean(values[highIndex]),

            low: clean(values[lowIndex]),

            close: clean(values[closeIndex]),

            volume: parseInt(
              String(values[volumeIndex]).replace(/,/g, ""),
              10
            ),
          });
        }
      }

      parsedData = parsedData.filter(
        (d) =>
          d.date &&
          !isNaN(d.open) &&
          !isNaN(d.high) &&
          !isNaN(d.low) &&
          !isNaN(d.close)
      );

      if (parsedData.length === 0) {
        throw new Error("No valid stock data found.");
      }parsedData.sort(
  (a, b) => new Date(a.date) - new Date(b.date)
);

      onDataLoaded(parsedData);

      setFileName(file.name);

    } catch (err) {
      alert("Error parsing file: " + err.message);
    }
  };

  reader.readAsText(file);
}, [onDataLoaded]);

  const handleDrop = useCallback((e) => {
    e.preventDefault()
    setDragActive(false)
    const files = e.dataTransfer.files
    if (files.length > 0) {
      parseFile(files[0])
    }
  }, [parseFile])

  const handleChange = (e) => {
    const files = e.target.files
    if (files.length > 0) {
      parseFile(files[0])
    }
  }

  const handleClick = () => {
    fileInputRef.current.click()
  }

  return (
    <div
      className={`${styles.dropzone} ${dragActive ? styles.active : ''}`}
      onDragEnter={() => setDragActive(true)}
      onDragLeave={() => setDragActive(false)}
      onDragOver={(e) => { e.preventDefault(); setDragActive(true) }}
      onDrop={handleDrop}
      onClick={handleClick}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept=".csv,.json"
        onChange={handleChange}
        style={{ display: 'none' }}
      />
      <div className={styles.iconWrap}>
        <FiUpload className={styles.icon} />
      </div>
      <p className={styles.text}>
        {fileName ? `📄 ${fileName}` : 'Drop a CSV/JSON file here or click to browse'}
      </p>
      <p className={styles.sub}>Supported: date, open, high, low, close, volume</p>
    </div>
  )
}

export default FileUpload