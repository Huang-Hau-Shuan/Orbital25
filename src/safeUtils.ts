//Utilities safe to use in render (i.e. no node modules imports)
import type { AddressEntry } from "./types";
import { isPlayerProfile } from "./types.guard";
import NRIC from "singapore-nric";
import parsePhoneNumber from "libphonenumber-js";
export function clamp(number: number, min: number, max: number) {
  return Math.min(Math.max(number, min), max);
}
export function normalizeTime(
  year: number,
  month: number,
  day: number,
  hour: number,
  minute: number
) {
  // JavaScript months are 0-based (0 = Jan, 11 = Dec)
  const date = new Date(year, month - 1, day, hour, minute);

  return {
    year: date.getFullYear(),
    month: date.getMonth() + 1, // convert back to 1-based
    day: date.getDate(),
    hour: date.getHours(),
    minute: date.getMinutes(),
  };
}
export const calculateNUSMatricNumber = function (id: string) {
  var matches = id.toUpperCase().match(/^A\d{7}|U\d{6,7}/);
  if (matches) {
    var match = matches[0];

    // Discard 3rd digit from U-prefixed NUSNET ID
    if (match[0] === "U" && match.length === 8) {
      match = match.slice(0, 3) + match.slice(4);
    }

    var weights = {
      U: [0, 1, 3, 1, 2, 7],
      A: [1, 1, 1, 1, 1, 1],
    }[match[0]];
    if (weights === undefined) return;

    for (var i = 0, sum = 0, digits = match.slice(-6); i < 6; i++) {
      sum += weights[i] * Number(digits[i]);
    }

    return match + "YXWURNMLJHEAB"[sum % 13];
  }
};
export const generateRandomString = (
  length: number,
  characters: string = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
) => {
  let result = "";
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};
export const generateRamdomPassword = (length: number = 12) => {
  const upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const lower = "abcdefghijklmnopqrstuvwxyz";
  const digits = "0123456789";
  const special = `~!@#$%^&*_+-=\`|\\(){}[]:;\"'<>,.?/`;
  const allSets = [upper, lower, digits, special];
  let passwordChars: string[] = [];
  //pick one char from each set
  for (let charSet of allSets) {
    const char = charSet[Math.floor(Math.random() * charSet.length)];
    passwordChars.push(char);
  }
  //select other chars
  const allChars = allSets.join();
  while (passwordChars.length < length) {
    const char = allChars[Math.floor(Math.random() * allChars.length)];
    passwordChars.push(char);
  }

  // Shuffle the result
  for (let i = passwordChars.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [passwordChars[i], passwordChars[j]] = [passwordChars[j], passwordChars[i]];
  }

  return passwordChars.join("");
};
export const verifyAddress = (addr: AddressEntry) =>
  addr.country &&
  addr.lines.length > 0 &&
  addr.lines.every(Boolean) &&
  addr.postal.length > 0 &&
  addr.country.length > 0;
export const isValidDate = (dateStr: string) => {
  const regex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
  const match = dateStr.match(regex);
  if (!match) return false;

  const day = parseInt(match[1], 10);
  const month = parseInt(match[2], 10) - 1; // JS months: 0-11
  const year = parseInt(match[3], 10);

  const date = new Date(year, month, day);

  return (
    date.getFullYear() === year &&
    date.getMonth() === month &&
    date.getDate() === day
  );
};
export const getRandomDate = (startStr: string, endStr: string) => {
  const parseDate = (str: string) => {
    const [day, month, year] = str.split("/").map(Number);
    return new Date(year, month - 1, day);
  };

  const formatDate = (date: Date) => {
    const dd = String(date.getDate()).padStart(2, "0");
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const yyyy = date.getFullYear();
    return `${dd}/${mm}/${yyyy}`;
  };

  const startDate = parseDate(startStr);
  const endDate = parseDate(endStr);

  if (startDate > endDate)
    throw new Error("Start date must be before end date");

  const randomTime =
    startDate.getTime() +
    Math.random() * (endDate.getTime() - startDate.getTime());
  const randomDate = new Date(randomTime);

  return formatDate(randomDate);
};
export const randomDigits = (length: number) =>
  Math.floor(Math.random() * Math.pow(10, length))
    .toString()
    .padStart(length, "0");
export const filterNumber = (str: string) =>
  Array.from(str)
    .filter((c) => "0123456789".includes(c))
    .join("");
export const validateEmail = (email: string) => {
  return !!email
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};
/**
 * Check if the password satify NUS password complexity rules:
 * 1. the password length is at least 12
 * 2. the password has at least 3 of the following 4 types of characters:
 * - number
 * - lower case letter
 * - upper case letter
 * - special characters
 * @param password the password to varify
 * @returns a boolean of whether the password is valid
 */
export const isPasswordValid = (password: string) => {
  if (password.length < 12) {
    return false;
  }

  let hasUpper = /[A-Z]/.test(password);
  let hasLower = /[a-z]/.test(password);
  let hasDigit = /\d/.test(password);
  let hasSpecial = /[^A-Za-z0-9]/.test(password);

  let complexityCount = [hasUpper, hasLower, hasDigit, hasSpecial].filter(
    Boolean
  ).length;

  return complexityCount >= 3;
};
/**
 * Check if anything is invalid for a PlayerProfile object
 * @param profile the Player Profile to varify
 * @returns null if the profile is valid, or the string indicating the invalid field
 */
export const checkInvalidProfile = (profile: unknown) => {
  if (!isPlayerProfile(profile)) return "Profile Format";
  if (!profile.firstName) return "First Name";
  if (!profile.lastName) return "Last Name";
  if (!isValidDate(profile.birthday)) return "Date of Birth";
  if (
    profile.NUSNETID &&
    profile.NUSNETID.length !== 8 &&
    !profile.NUSNETID.toUpperCase().startsWith("E")
  )
    return "NUSNETID";
  if (profile.emailPassword && !isPasswordValid(profile.emailPassword))
    return "NUSNET Password";
  if (profile.finOrNric && !NRIC.Validate(profile.finOrNric))
    return profile.isSingaporean ? "NRIC" : "FIN";
  if (!profile.major) return "Major";
  if (
    !parsePhoneNumber(profile.mobileExt + profile.mobile, {
      extract: false,
    })?.isValid()
  )
    return "Mobile Number or Extension";
  if (!validateEmail(profile.personalEmail)) return "Personal Email";
  if (!profile.nationality) return "Nationality"; // importing countries here crash the program
  if (profile.nationality === "Singapore" && profile.isSingaporean)
    return "???";
  if (profile.passport.length !== 9) return "Passport";
  return null;
};
