// /src/utils/date.js

export const getExactAge = (dob) => {
  const today = new Date();
  const birthDate = new Date(dob);

  let years = today.getFullYear() - birthDate.getFullYear();
  let months = today.getMonth() - birthDate.getMonth();
  let days = today.getDate() - birthDate.getDate();

  if (days < 0) {
    months--;
    const prevMonth = new Date(today.getFullYear(), today.getMonth(), 0);
    days += prevMonth.getDate();
  }

  if (months < 0) {
    years--;
    months += 12;
  }

  return { years, months, days };
};

/**
 * Get completed age (used for insurance underwriting)
 */
export const getCompletedAge = (dob, asOfDate = new Date()) => {
  const birthDate = new Date(dob);
  const currentDate = new Date(asOfDate);

  let age = currentDate.getFullYear() - birthDate.getFullYear();

  // Check if birthday has occurred this year
  const hasBirthdayOccurred =
    currentDate.getMonth() > birthDate.getMonth() ||
    (currentDate.getMonth() === birthDate.getMonth() &&
      currentDate.getDate() >= birthDate.getDate());

  if (!hasBirthdayOccurred) {
    age--;
  }

  return age;
};

/**
 * Get next birthday
 */
export const getNextBirthday = (dob) => {
  const today = new Date();
  const birthDate = new Date(dob);

  let nextBirthday = new Date(
    today.getFullYear(),
    birthDate.getMonth(),
    birthDate.getDate(),
  );

  if (nextBirthday < today) {
    nextBirthday.setFullYear(today.getFullYear() + 1);
  }

  return nextBirthday;
};

/**
 * Calculate days to next birthday
 */
export const daysToNextBirthday = (dob) => {
  const nextBday = getNextBirthday(dob);
  const today = new Date();
  const timeDiff = nextBday - today;
  return Math.ceil(timeDiff / (1000 * 3600 * 24));
};
