export interface Country {
  UlkeAdi: string;
  UlkeAdiEn: string;
  UlkeID: number | string;
}

export interface City {
  SehirAdi: string;
  SehirAdiEn: string;
  SehirID: number | string;
}

export interface District {
  IlceAdi: string;
  IlceAdiEn: string;
  IlceID: number | string;
}

export interface PrayerTimes {
  Aksam: string | any;
  AyinSekliURL: any;
  Gunes: string | any;
  GunesBatis: string | any;
  GunesDogus: string | any;
  HicriTarihKisa: string | any;
  HicriTarihKisaIso8601: any;
  HicriTarihUzun: string | any;
  HicriTarihUzunIso8601: any;
  Ikindi: string | any;
  Imsak: string | any;
  KibleSaati: any;
  MiladiTarihKisa: string | any;
  MiladiTarihKisaIso8601: string | any;
  MiladiTarihUzun: string | any;
  MiladiTarihUzunIso8601: string | any;
  Ogle: string | any;
  Yatsi: string | any;
}
