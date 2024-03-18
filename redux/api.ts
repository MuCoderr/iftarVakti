import axios from 'axios';

const API_URL = 'https://ezanvakti.herokuapp.com';

export const getCountries = async () => {
  const response = await axios.get(`${API_URL}/ulkeler`);
  console.log('Ülke Verileri Alındı');
  return response.data;
};

export const getCities = async (countryId: number) => {
  const response = await axios.get(`${API_URL}/sehirler/${countryId}`);
  console.log('Şehir Verileri Alındı');
  return response.data;
};

export const getDistricts = async (cityId: number) => {
  const response = await axios.get(`${API_URL}/ilceler/${cityId}`);
  console.log('İlçe Verileri Alındı');
  return response.data;
};

export const getPrayerTimes = async (districtId: number | any) => {
  const response = await axios.get(`${API_URL}/vakitler/${districtId}`);
  console.log('Namaz Vakti Verileri Alındı');
  return response.data;
};
