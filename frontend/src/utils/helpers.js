// ==================================================
// MOVEIT HELPER FUNCTIONS
// ==================================================


// ==================================================
// STRING HELPERS
// ==================================================

export const capitalize = (value) => {
  if (!value) {
    return "";
  }

  return (
    value.charAt(0).toUpperCase() +
    value.slice(1)
  );
};


export const capitalizeWords = (value) => {
  if (!value) {
    return "";
  }

  return value
    .trim()
    .split(/\s+/)
    .map((word) =>
      capitalize(word)
    )
    .join(" ");
};


export const truncateText = (
  text,
  maxLength = 100
) => {
  if (!text) {
    return "";
  }

  if (text.length <= maxLength) {
    return text;
  }

  return (
    text.substring(
      0,
      maxLength
    ).trim() + "..."
  );
};


// ==================================================
// FORM HELPERS
// ==================================================

export const isEmpty = (value) => {
  if (
    value === null ||
    value === undefined
  ) {
    return true;
  }

  if (
    typeof value === "string"
  ) {
    return value.trim() === "";
  }

  return false;
};


export const trimFormData = (
  formData
) => {
  if (!formData) {
    return {};
  }

  const cleanedData = {};

  Object.keys(formData).forEach(
    (key) => {
      const value =
        formData[key];

      cleanedData[key] =
        typeof value === "string"
          ? value.trim()
          : value;
    }
  );

  return cleanedData;
};


// ==================================================
// NUMBER HELPERS
// ==================================================

export const isValidNumber = (
  value
) => {
  if (
    value === "" ||
    value === null ||
    value === undefined
  ) {
    return false;
  }

  return !Number.isNaN(
    Number(value)
  );
};


export const formatNumber = (
  value
) => {
  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return "0";
  }

  return Number(value).toLocaleString(
    "en-KE"
  );
};


// ==================================================
// DATE & TIME HELPERS
// ==================================================

export const formatDate = (
  date
) => {
  if (!date) {
    return "Not available";
  }

  return new Date(
    date
  ).toLocaleDateString(
    "en-KE",
    {
      dateStyle: "medium",
    }
  );
};


export const formatDateTime = (
  date
) => {
  if (!date) {
    return "Not available";
  }

  return new Date(
    date
  ).toLocaleString(
    "en-KE",
    {
      dateStyle: "medium",
      timeStyle: "short",
    }
  );
};


export const formatTime = (
  date
) => {
  if (!date) {
    return "Not available";
  }

  return new Date(
    date
  ).toLocaleTimeString(
    "en-KE",
    {
      hour: "numeric",
      minute: "2-digit",
    }
  );
};


export const getRelativeTime = (
  date
) => {
  if (!date) {
    return "";
  }

  const now =
    new Date();

  const target =
    new Date(date);

  const difference =
    now - target;

  const seconds =
    Math.floor(
      difference / 1000
    );

  const minutes =
    Math.floor(
      seconds / 60
    );

  const hours =
    Math.floor(
      minutes / 60
    );

  const days =
    Math.floor(
      hours / 24
    );

  if (seconds < 60) {
    return "Just now";
  }

  if (minutes < 60) {
    return `${minutes} ${
      minutes === 1
        ? "minute"
        : "minutes"
    } ago`;
  }

  if (hours < 24) {
    return `${hours} ${
      hours === 1
        ? "hour"
        : "hours"
    } ago`;
  }

  if (days < 7) {
    return `${days} ${
      days === 1
        ? "day"
        : "days"
    } ago`;
  }

  return formatDate(date);
};


// ==================================================
// EMAIL HELPERS
// ==================================================

export const isValidEmail = (
  email
) => {
  if (!email) {
    return false;
  }

  const emailPattern =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  return emailPattern.test(
    email.trim()
  );
};


// ==================================================
// PHONE HELPERS
// ==================================================

export const cleanPhoneNumber = (
  phone
) => {
  if (!phone) {
    return "";
  }

  return phone
    .replace(/\s+/g, "")
    .replace(/-/g, "");
};


// ==================================================
// REGISTRATION NUMBER
// ==================================================

export const formatRegistrationNumber =
  (registrationNumber) => {
    if (!registrationNumber) {
      return "";
    }

    return registrationNumber
      .trim()
      .toUpperCase();
  };


// ==================================================
// ARRAY HELPERS
// ==================================================

export const isArray = (
  value
) => {
  return Array.isArray(
    value
  );
};


export const safeArray = (
  value
) => {
  return Array.isArray(
    value
  )
    ? value
    : [];
};


export const sortByNewest = (
  items,
  dateField = "created_at"
) => {
  if (!Array.isArray(items)) {
    return [];
  }

  return [
    ...items,
  ].sort(
    (a, b) => {
      return (
        new Date(
          b[dateField]
        ) -
        new Date(
          a[dateField]
        )
      );
    }
  );
};


export const sortByOldest = (
  items,
  dateField = "created_at"
) => {
  if (!Array.isArray(items)) {
    return [];
  }

  return [
    ...items,
  ].sort(
    (a, b) => {
      return (
        new Date(
          a[dateField]
        ) -
        new Date(
          b[dateField]
        )
      );
    }
  );
};


// ==================================================
// OBJECT HELPERS
// ==================================================

export const isObject = (
  value
) => {
  return (
    value !== null &&
    typeof value === "object" &&
    !Array.isArray(value)
  );
};


export const getValue = (
  object,
  key,
  fallback = ""
) => {
  if (
    !object ||
    object[key] === undefined ||
    object[key] === null
  ) {
    return fallback;
  }

  return object[key];
};


// ==================================================
// ERROR HELPERS
// ==================================================

export const getErrorMessage = (
  error,
  fallback =
    "Something went wrong."
) => {
  if (!error) {
    return fallback;
  }

  if (
    typeof error === "string"
  ) {
    return error;
  }

  if (error.message) {
    return error.message;
  }

  if (
    error.error
  ) {
    return error.error;
  }

  return fallback;
};


// ==================================================
// BOOLEAN HELPERS
// ==================================================

export const toBoolean = (
  value
) => {
  if (
    value === true ||
    value === "true" ||
    value === 1 ||
    value === "1"
  ) {
    return true;
  }

  return false;
};


// ==================================================
// DEBOUNCE
// ==================================================

export const debounce = (
  callback,
  delay = 300
) => {
  let timeoutId;

  return (
    ...args
  ) => {
    clearTimeout(
      timeoutId
    );

    timeoutId = setTimeout(
      () => {
        callback(
          ...args
        );
      },
      delay
    );
  };
};


// ==================================================
// CLASS NAME HELPER
// ==================================================

export const classNames = (
  ...classes
) => {
  return classes
    .filter(Boolean)
    .join(" ");
};


// ==================================================
// CURRENCY
// ==================================================

export const formatCurrency = (
  amount
) => {
  if (
    amount === null ||
    amount === undefined ||
    amount === ""
  ) {
    return "KSh 0";
  }

  return new Intl.NumberFormat(
    "en-KE",
    {
      style: "currency",
      currency: "KES",
      maximumFractionDigits: 2,
    }
  ).format(
    Number(amount)
  );
};


// ==================================================
// DELIVERY HELPERS
// ==================================================

export const isActiveDelivery = (
  status
) => {
  return [
    "assigned",
    "picked_up",
    "in_transit",
  ].includes(
    status
  );
};


export const isCompletedDelivery = (
  status
) => {
  return status ===
    "delivered";
};


export const isCancelledDelivery = (
  status
) => {
  return status ===
    "cancelled";
};


// ==================================================
// ID HELPERS
// ==================================================

export const isValidId = (
  id
) => {
  if (
    id === null ||
    id === undefined ||
    id === ""
  ) {
    return false;
  }

  const numericId =
    Number(id);

  return (
    Number.isInteger(
      numericId
    ) &&
    numericId > 0
  );
};


// ==================================================
// URL HELPERS
// ==================================================

export const getTripDetailsPath = (
  tripId
) => {
  return `trip-details/${tripId}`;
};


// ==================================================
// STORAGE HELPERS
// ==================================================

export const saveToStorage = (
  key,
  value
) => {
  localStorage.setItem(
    key,
    JSON.stringify(value)
  );
};


export const getFromStorage = (
  key,
  fallback = null
) => {
  const value =
    localStorage.getItem(
      key
    );

  if (!value) {
    return fallback;
  }

  try {
    return JSON.parse(
      value
    );
  } catch (error) {
    return fallback;
  }
};


export const removeFromStorage = (
  key
) => {
  localStorage.removeItem(
    key
  );
};


// ==================================================
// SCROLL HELPER
// ==================================================

export const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
};


// ==================================================
// EXPORT DEFAULT
// ==================================================

const helpers = {
  capitalize,
  capitalizeWords,
  truncateText,
  isEmpty,
  trimFormData,
  isValidNumber,
  formatNumber,
  formatDate,
  formatDateTime,
  formatTime,
  getRelativeTime,
  isValidEmail,
  cleanPhoneNumber,
  formatRegistrationNumber,
  isArray,
  safeArray,
  sortByNewest,
  sortByOldest,
  isObject,
  getValue,
  getErrorMessage,
  toBoolean,
  debounce,
  classNames,
  formatCurrency,
  isActiveDelivery,
  isCompletedDelivery,
  isCancelledDelivery,
  isValidId,
  getTripDetailsPath,
  saveToStorage,
  getFromStorage,
  removeFromStorage,
  scrollToTop,
};

export default helpers;