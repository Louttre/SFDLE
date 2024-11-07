export const eyeCompare = (eyeColor1, eyeColor2) => {
    // Compare the eye color of two characters
    // Convert both arrays to sets to easily compare them
    const set1 = new Set(eyeColor1);
    const set2 = new Set(eyeColor2);
  
    // Check if both sets are exactly the same
    if (set1.size === set2.size && [...set1].every(color => set2.has(color))) {
        return true;
    }
    // Check if there is at least one common element, but not a full match
    else if ([...set1].some(color => set2.has(color))) {
        return "~";
    }
    // No common colors at all
    else {
        return false;
    }
}

export const fightingStyleCompare = (char1, char2) => {
    // Compare the fightingSyles of two characters
    // Convert both arrays to sets to easily compare them
    const set1 = new Set(char1);
    const set2 = new Set(char2);
  
    // Check if both sets are exactly the same
    if (set1.size === set2.size && [...set1].every(fightingSyle => set2.has(fightingSyle))) {
        return true;
    }
    // Check if there is at least one common element, but not a full match
    else if ([...set1].some(fightingSyle => set2.has(fightingSyle))) {
        return "~";
    }
    // No common fightingSyles at all
    else {
        return false;
    }
}

export const heightWeightCompare = (char1, char2) => {
    // Compare the height and weight of two characters
    

    let value1 = parseInt(char1.replace(/\D/g, ''), 10); // \D matches any non-digit character
    let value2 = parseInt(char2.replace(/\D/g, ''), 10); // Replace all non-digit characters with an empty string

    if (char2.includes("Secret") && char1.includes("Secret")) {
        return true;
    } else if (char2.includes("Secret")){
        return false;
    } else if (char1.includes("Secret")) {
        return false;
    }

    // Compare the values
    if (value1 === value2) {
        return true;
    } else if (value1 > value2) {
        return ">";
    } else {
        return "<";
    }
}