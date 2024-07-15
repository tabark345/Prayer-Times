import React, { useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { MagnifyingGlassIcon } from '@heroicons/react/24/solid';
import { ClockIcon } from '@heroicons/react/24/outline';
import logo from '../assets/logo.png';

const PrayerTimings = () => {
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [month, setMonth] = useState('');
  const [day, setDay] = useState('');
  const [method, setMethod] = useState('2'); // Default method
  const [prayerTimes, setPrayerTimes] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchPrayerTimings = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `http://api.aladhan.com/v1/calendarByCity/${new Date().getFullYear()}/${month}?city=${city}&country=${state}&method=${method}`
      );
      const data = response.data.data;
      // Find the specific day and reorder the list
      const enteredDay = data.find(timing => parseInt(timing.date.gregorian.day) === parseInt(day));
      const otherDays = data.filter(timing => parseInt(timing.date.gregorian.day) !== parseInt(day));
      if (enteredDay) {
        setPrayerTimes([enteredDay, ...otherDays]);
      } else {
        setPrayerTimes(data);
      }
    } catch (error) {
      console.error('Error fetching prayer timings:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="flex justify-center mb-8">
        <img src={logo} alt="Logo" className="h-16" />
      </div>
      <h1 className="text-3xl font-bold text-center text-primary mb-6">Prayer Timings</h1>
      <div className="flex flex-col justify-center items-center space-y-4 mb-8">
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="City"
          className="border p-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <input
          type="text"
          value={state}
          onChange={(e) => setState(e.target.value)}
          placeholder="State"
          className="border p-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <input
          type="text"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          placeholder="Month"
          className="border p-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <input
          type="text"
          value={day}
          onChange={(e) => setDay(e.target.value)}
          placeholder="Day"
          className="border p-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <select
          value={method}
          onChange={(e) => setMethod(e.target.value)}
          className="border p-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="0">Shia Ithna-Ashari</option>
          <option value="1">University of Islamic Sciences, Karachi</option>
          <option value="2">Islamic Society of North America</option>
          <option value="3">Muslim World League</option>
          <option value="4">Umm Al-Qura University, Makkah</option>
          <option value="5">Egyptian General Authority of Survey</option>
          <option value="7">Institute of Geophysics, University of Tehran</option>
          <option value="8">Gulf Region</option>
          <option value="9">Kuwait</option>
          <option value="10">Qatar</option>
          <option value="11">Majlis Ugama Islam Singapura, Singapore</option>
          <option value="12">Union Organization islamic de France</option>
          <option value="13">Diyanet İşleri Başkanlığı, Turkey</option>
          <option value="14">Spiritual Administration of Muslims of Russia</option>
          <option value="15">Moonsighting Committee Worldwide</option>
          <option value="16">Dubai (unofficial)</option>
          <option value="99">Custom</option>
        </select>
        <button
          onClick={fetchPrayerTimings}
          className="bg-primary hover:bg-secondary text-white py-2 px-4 rounded-md flex items-center space-x-2"
        >
          <MagnifyingGlassIcon className="h-5 w-5" />
          <span>Get Timings</span>
        </button>
      </div>
      {loading ? (
        <div className="text-center text-primary">Loading...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {prayerTimes.map((timings, index) => (
            <motion.div
              key={index}
              className={`bg-white p-4 rounded-md shadow-md ${parseInt(timings.date.gregorian.day) === parseInt(day) ? 'border-2 border-primary' : ''}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-xl font-semibold text-primary mb-2">{timings.date.readable}</h2>
              <div className="flex flex-col space-y-1">
                <div className="flex items-center space-x-2">
                  <ClockIcon className="h-5 w-5 text-primary" />
                  <p>Fajr: {timings.timings.Fajr}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <ClockIcon className="h-5 w-5 text-primary" />
                  <p>Dhuhr: {timings.timings.Dhuhr}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <ClockIcon className="h-5 w-5 text-primary" />
                  <p>Asr: {timings.timings.Asr}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <ClockIcon className="h-5 w-5 text-primary" />
                  <p>Maghrib: {timings.timings.Maghrib}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <ClockIcon className="h-5 w-5 text-primary" />
                  <p>Isha: {timings.timings.Isha}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PrayerTimings;
