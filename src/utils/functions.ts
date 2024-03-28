// Saat, dakika ve saniye değerlerini iki haneli olarak biçimlendiren yardımcı bir fonksiyon
export const formatTime = (hours: number, minutes: number, seconds: number) => {
  const formattedHours = String(hours).padStart(2, '0');
  const formattedMinutes = String(minutes).padStart(2, '0');
  const formattedSeconds = String(Math.floor(seconds)).padStart(2, '0');
  return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
};

export function formatDate(date: Date) {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}.${month}.${year}`;
}
