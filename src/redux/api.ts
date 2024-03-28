import axios from 'axios';

const API_URL = 'https://ezanvakti.herokuapp.com';

export const getCountries = async () => {
  try {
    const response = await axios.get(`${API_URL}/ulkeler`);
    // console.warn('Ülke Verileri Alındı');
    return response.data;
  } catch (error) {
    console.error('Ülke verileri alınırken bir hata oluştu:', error);
    throw error; // Hata tekrar atılıyor, isteğe bağlı olarak yönetilebilir.
  }
};

export const getCities = async (countryId: number) => {
  try {
    const response = await axios.get(`${API_URL}/sehirler/${countryId}`);
    // console.warn('Şehir Verileri Alındı');
    return response.data;
  } catch (error) {
    console.error('Şehir verileri alınırken bir hata oluştu:', error);
    throw error; // Hata tekrar atılıyor, isteğe bağlı olarak yönetilebilir.
  }
};

export const getDistricts = async (cityId: number) => {
  try {
    const response = await axios.get(`${API_URL}/ilceler/${cityId}`);
    // console.warn('İlçe Verileri Alındı');
    return response.data;
  } catch (error) {
    console.error('İlçe verileri alınırken bir hata oluştu:', error);
    throw error; // Hata tekrar atılıyor, isteğe bağlı olarak yönetilebilir.
  }
};

export const getPrayerTimes = async (districtId: number | any) => {
  try {
    const response = await axios.get(`${API_URL}/vakitler/${districtId}`);
    // console.warn('Namaz Vakti Verileri Alındı');
    return response.data;
  } catch (error) {
    console.error('Namaz vakti verileri alınırken bir hata oluştu:', error);
    throw error; // Hata tekrar atılıyor, isteğe bağlı olarak yönetilebilir.
  }
};
