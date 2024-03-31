import React, { useEffect, useState } from 'react';
import { AntDesign, FontAwesome6 } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { ImageBackground, StyleSheet, View } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
//Redux
import { useDispatch, useSelector } from 'react-redux';
import { getCountries, getCities, getDistricts } from '../redux/api';
import { setCities, setSelectedCityId } from '../redux/slices/cities';
import { setCountries, setSelectedCountryId } from '../redux/slices/countries';
import { setDistricts, setSelectedDistrictsId } from '../redux/slices/districts';

const DropdownComponent = () => {
  const [isCountriesFocus, setIsCountriesFocus] = useState(false);
  const [isCitiesFocus, setIsCitiesFocus] = useState(false);
  const [isDistrictsFocus, setIsDistrictsFocus] = useState(false);

  const countryValue = useSelector((state: any) => state.countries.selectedCountryId);
  const cityValue = useSelector((state: any) => state.cities.selectedCityId);
  const districtValue = useSelector((state: any) => state.districts.selectedDistrictsId);

  const countriesData = useSelector((state: any) => state.countries.countries);
  const citiesData = useSelector((state: any) => state.cities.cities);
  const districtsData = useSelector((state: any) => state.districts.districts);

  const countries = countriesData.map((country: any) => ({
    label: country.UlkeAdi,
    labelEN: country.UlkeAdiEn,
    value: country.UlkeID,
  }));

  const cities = citiesData.map((city: any) => ({
    label: city.SehirAdi,
    labelEN: city.SehirAdiEn,
    value: city.SehirID,
  }));

  const districts = districtsData.map((district: any) => ({
    label: district.IlceAdi,
    labelEN: district.IlceAdiEn,
    value: district.IlceID,
  }));

  const dispatch = useDispatch();

  useEffect(() => {
    AsyncStorage.setItem('selectedLocation', JSON.stringify(false));
    const getCountriesFromAsyncStorage = async () => {
      const countriesData = await AsyncStorage.getItem('countries');

      // Veri daha önce kaydedilmişse AsyncStorage'dan çek
      if (countriesData) {
        const countries = JSON.parse(countriesData);
        dispatch(setCountries(countries)); // Veriyi store'a aktar
        // console.warn("kayıtlı ülke verileri local'den çekildi");

        return;
      }

      // Veri daha önce kaydedilmemişse API'dan çek ve kaydet
      const data = await getCountries();
      dispatch(setCountries(data));
      // console.warn("localde ülkeler olmadığından api'dan çekildi");

      AsyncStorage.setItem('countries', JSON.stringify(data));
    };
    getCountriesFromAsyncStorage();
  }, []);

  useEffect(() => {
    if (countryValue) {
      const getCitiesFromAsyncStorage = async () => {
        const citiesData = await AsyncStorage.getItem(`cities_${countryValue}`);

        // Veri daha önce kaydedilmişse AsyncStorage'dan çek
        if (citiesData) {
          const cities = JSON.parse(citiesData);
          dispatch(setCities(cities)); // Veriyi store'a aktar
          // console.warn("kayıtlı şehir verisi local'den çekildi");
          // console.error(cities);

          return;
        }

        // Veri daha önce kaydedilmemişse API'dan çek ve kaydet
        const data = await getCities(countryValue);
        dispatch(setCities(data));
        // console.warn("localde şehirler olmadığından api'dan çekildi");

        AsyncStorage.setItem(`cities_${countryValue}`, JSON.stringify(data));
      };
      getCitiesFromAsyncStorage();
    }
  }, [countryValue]);

  useEffect(() => {
    if (cityValue) {
      const getDistrictsFromAsyncStorage = async () => {
        const districtsData = await AsyncStorage.getItem(`districts_${cityValue}`);

        // Veri daha önce kaydedilmişse AsyncStorage'dan çek
        if (districtsData) {
          const districts = JSON.parse(districtsData);
          dispatch(setDistricts(districts)); // Veriyi store'a aktar
          // console.warn("kayıtlı ilçe verisi local'den çekildi");
          // console.error(cities);

          return;
        }

        // Veri daha önce kaydedilmemişse API'dan çek ve kaydet
        const data = await getDistricts(cityValue);
        dispatch(setDistricts(data));
        // console.warn("localde ilçeler olmadığından api'dan çekildi");

        AsyncStorage.setItem(`districts_${cityValue}`, JSON.stringify(data));
      };
      getDistrictsFromAsyncStorage();
    }
  }, [cityValue]);

  useEffect(() => {
    if (districtValue) {
      // console.error(districtValue);
      AsyncStorage.removeItem('districtValue');
      AsyncStorage.setItem('districtValue', districtValue);

      AsyncStorage.removeItem('selectedLocation');
      AsyncStorage.setItem('selectedLocation', JSON.stringify(true));

      router.navigate('/prayer');
    }
  }, [districtValue]);

  return (
    <>
      <ImageBackground
        source={require('../assets/images/backgroundLight.png')}
        className="flex-1"
        imageStyle={{ opacity: 0.1 }}>
        <View className=" flex-1 justify-center">
          <View className=" p-[10] m-[20]">
            <Dropdown
              style={[styles.dropdown, isCountriesFocus && { borderColor: '#DA0037' }]}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              inputSearchStyle={styles.inputSearchStyle}
              iconStyle={styles.iconStyle}
              data={countries}
              search
              maxHeight={300}
              labelField="label"
              valueField="value"
              placeholder={!isCountriesFocus ? 'Ülke Seçin' : '...'}
              searchPlaceholder="Ara..."
              value={countryValue}
              onFocus={() => setIsCountriesFocus(true)}
              onBlur={() => setIsCountriesFocus(false)}
              onChange={(item: any) => {
                dispatch(setSelectedCountryId(item.value));
                AsyncStorage.setItem('countryName', item.label);
                setIsCountriesFocus(false);
              }}
              renderLeftIcon={() => (
                <AntDesign className="mr-[15]" name="earth" size={24} color="#DA0037" />
              )}
            />

            {countryValue ? (
              <Dropdown
                style={[styles.dropdown, isCitiesFocus && { borderColor: '#DA0037' }]}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                inputSearchStyle={styles.inputSearchStyle}
                iconStyle={styles.iconStyle}
                data={cities}
                search
                maxHeight={300}
                labelField="label"
                valueField="value"
                placeholder={!isCitiesFocus ? 'Şehir Seçin' : '...'}
                searchPlaceholder="Ara..."
                value={cityValue}
                onFocus={() => setIsCitiesFocus(true)}
                onBlur={() => setIsCitiesFocus(false)}
                onChange={(item: any) => {
                  dispatch(setSelectedCityId(item.value));
                  AsyncStorage.setItem('cityName', item.label);
                  setIsCitiesFocus(false);
                }}
                renderLeftIcon={() => (
                  <FontAwesome6 className="mr-[10]" name="city" size={24} color="#DA0037" />
                )}
              />
            ) : null}

            {cityValue ? (
              <Dropdown
                style={[styles.dropdown, isDistrictsFocus && { borderColor: '#DA0037' }]}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                inputSearchStyle={styles.inputSearchStyle}
                iconStyle={styles.iconStyle}
                data={districts}
                search
                maxHeight={300}
                labelField="label"
                valueField="value"
                placeholder={!isDistrictsFocus ? 'İlçe Seçin' : '...'}
                searchPlaceholder="Ara..."
                value={districtValue}
                onFocus={() => setIsDistrictsFocus(true)}
                onBlur={() => setIsDistrictsFocus(false)}
                onChange={(item: any) => {
                  dispatch(setSelectedDistrictsId(item.value));
                  AsyncStorage.setItem('districtName', item.label);
                  setIsDistrictsFocus(false);
                }}
                renderLeftIcon={() => (
                  <FontAwesome6
                    className="mr-[15] ml-[5]"
                    name="location-dot"
                    size={24}
                    color="#DA0037"
                  />
                )}
              />
            ) : null}
          </View>
        </View>
      </ImageBackground>
    </>
  );
};

export default DropdownComponent;

const styles = StyleSheet.create({
  dropdown: {
    backgroundColor: '#fdfdfd',
    marginBottom: 15,
    height: 50,
    borderColor: 'gray',
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
  },
  label: {
    position: 'absolute',
    backgroundColor: 'white',
    left: 22,
    top: 8,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: 14,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
});
