// components/VoiceCommand.js
function VoiceCommand({ onItemAdded, showToast }) {
  const [isListening, setIsListening] = React.useState(false);
  const recognitionRef = React.useRef(null);
  const isListeningRef = React.useRef(false);

  // Helper functions for fuzzy string matching
  const calculateSimilarity = (str1, str2) => {
    const longer = str1.length > str2.length ? str1 : str2;
    const shorter = str1.length > str2.length ? str2 : str1;

    if (longer.length === 0) return 1.0;

    const distance = levenshteinDistance(longer, shorter);
    return (longer.length - distance) / longer.length;
  };

  const levenshteinDistance = (str1, str2) => {
    const matrix = [];
    for (let i = 0; i <= str2.length; i++) {
      matrix[i] = [i];
    }
    for (let j = 0; j <= str1.length; j++) {
      matrix[0][j] = j;
    }
    for (let i = 1; i <= str2.length; i++) {
      for (let j = 1; j <= str1.length; j++) {
        if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          );
        }
      }
    }
    return matrix[str2.length][str1.length];
  };

  // Parse compound numbers like "twenty four" or "thirty five"
  const parseCompoundNumber = (phrase) => {
    const tensMap = {
      'TWENTY': 20, 'THIRTY': 30, 'FORTY': 40, 'FIFTY': 50,
      'SIXTY': 60, 'SEVENTY': 70, 'EIGHTY': 80, 'NINETY': 90,
      'TWENTI': 20, 'TIRTI': 30, 'PORTI': 40, 'PAYBTI': 50,
      'SIKSTI': 60, 'SEBENTI': 70, 'EYTI': 80, 'NAYNTI': 90
    };

    const unitsMap = {
      'ONE': 1, 'TWO': 2, 'THREE': 3, 'FOUR': 4, 'FIVE': 5,
      'SIX': 6, 'SEVEN': 7, 'EIGHT': 8, 'NINE': 9,
      'WAN': 1, 'TU': 2, 'TRI': 3, 'POR': 4, 'PAYB': 5,
      'SIKS': 6, 'SEBEN': 7, 'EY': 8, 'NAYN': 9
    };

    const words = phrase.trim().toUpperCase().split(/\s+/);
    if (words.length !== 2) return null;

    const [tens, units] = words;
    const tensValue = tensMap[tens];
    const unitsValue = unitsMap[units];

    if (tensValue !== undefined && unitsValue !== undefined) {
      return (tensValue + unitsValue).toString();
    }

    return null;
  };

  React.useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      showToast("Voice not supported");
      return;
    }

    const rec = new SpeechRecognition();
    rec.lang = "en-PH";
    rec.continuous = true;
    rec.interimResults = false;

    rec.onresult = (e) => {
      // Only process results if we're still supposed to be listening
      if (!isListeningRef.current) return;

      const result = e.results[e.results.length - 1];
      if (!result.isFinal) return;

      const text = result[0].transcript.trim().toUpperCase();
      showToast(`Heard: "${text}"`);

      // Process order directly when listening is active
      processOrder(text);
    };

    // Process order function
    const processOrder = (text) => {
      // Comprehensive number recognition from 0 to 100
      const numberWords = {
        // Basic numbers 0-10
        'ZERO': '0', 'ONE': '1', 'TWO': '2', 'THREE': '3', 'FOUR': '4', 'FIVE': '5',
        'SIX': '6', 'SEVEN': '7', 'EIGHT': '8', 'NINE': '9', 'TEN': '10',

        // Teens 11-19
        'ELEVEN': '11', 'TWELVE': '12', 'THIRTEEN': '13', 'FOURTEEN': '14', 'FIFTEEN': '15',
        'SIXTEEN': '16', 'SEVENTEEN': '17', 'EIGHTEEN': '18', 'NINETEEN': '19',

        // Tens 20-90
        'TWENTY': '20', 'THIRTY': '30', 'FORTY': '40', 'FIFTY': '50',
        'SIXTY': '60', 'SEVENTY': '70', 'EIGHTY': '80', 'NINETY': '90',

        // Compound numbers
        'TWENTY ONE': '21', 'TWENTY TWO': '22', 'TWENTY THREE': '23', 'TWENTY FOUR': '24', 'TWENTY FIVE': '25',
        'TWENTY SIX': '26', 'TWENTY SEVEN': '27', 'TWENTY EIGHT': '28', 'TWENTY NINE': '29',
        'THIRTY ONE': '31', 'THIRTY TWO': '32', 'THIRTY THREE': '33', 'THIRTY FOUR': '34', 'THIRTY FIVE': '35',
        'THIRTY SIX': '36', 'THIRTY SEVEN': '37', 'THIRTY EIGHT': '38', 'THIRTY NINE': '39',
        'FORTY ONE': '41', 'FORTY TWO': '42', 'FORTY THREE': '43', 'FORTY FOUR': '44', 'FORTY FIVE': '45',
        'FORTY SIX': '46', 'FORTY SEVEN': '47', 'FORTY EIGHT': '48', 'FORTY NINE': '49',
        'FIFTY ONE': '51', 'FIFTY TWO': '52', 'FIFTY THREE': '53', 'FIFTY FOUR': '54', 'FIFTY FIVE': '55',
        'FIFTY SIX': '56', 'FIFTY SEVEN': '57', 'FIFTY EIGHT': '58', 'FIFTY NINE': '59',
        'SIXTY ONE': '61', 'SIXTY TWO': '62', 'SIXTY THREE': '63', 'SIXTY FOUR': '64', 'SIXTY FIVE': '65',
        'SIXTY SIX': '66', 'SIXTY SEVEN': '67', 'SIXTY EIGHT': '68', 'SIXTY NINE': '69',
        'SEVENTY ONE': '71', 'SEVENTY TWO': '72', 'SEVENTY THREE': '73', 'SEVENTY FOUR': '74', 'SEVENTY FIVE': '75',
        'SEVENTY SIX': '76', 'SEVENTY SEVEN': '77', 'SEVENTY EIGHT': '78', 'SEVENTY NINE': '79',
        'EIGHTY ONE': '81', 'EIGHTY TWO': '82', 'EIGHTY THREE': '83', 'EIGHTY FOUR': '84', 'EIGHTY FIVE': '85',
        'EIGHTY SIX': '86', 'EIGHTY SEVEN': '87', 'EIGHTY EIGHT': '88', 'EIGHTY NINE': '89',
        'NINETY ONE': '91', 'NINETY TWO': '92', 'NINETY THREE': '93', 'NINETY FOUR': '94', 'NINETY FIVE': '95',
        'NINETY SIX': '96', 'NINETY SEVEN': '97', 'NINETY EIGHT': '98', 'NINETY NINE': '99', 'ONE HUNDRED': '100',

        // Filipino pronunciations and variations
        'WAN': '1', 'TU': '2', 'TRI': '3', 'POR': '4', 'PAYB': '5',
        'SIKS': '6', 'SEBEN': '7', 'EY': '8', 'NAYN': '9', 'TEN': '10',
        'ELEBEN': '11', 'TWELB': '12', 'TIRTIN': '13', 'PORTIN': '14', 'PAYBTIN': '15',
        'SIKSTIN': '16', 'SEBENTIN': '17', 'EYTIN': '18', 'NAYNTIN': '19',
        'TWENTI': '20', 'TIRTI': '30', 'PORTI': '40', 'PAYBTI': '50',
        'SIKSTI': '60', 'SEBENTI': '70', 'EYTI': '80', 'NAYNTI': '90',

        // Alternative pronunciations and common misrecognitions for all numbers
        // Number 0 variations (enhanced for accents and speech impairments)
        'OH': '0', 'ZERO': '0', 'NIL': '0', 'NOTHING': '0', 'O': '0', 'OO': '0',
        'OOO': '0', 'OOOO': '0', 'ZEE': '0', 'ZED': '0', 'ZEE-RO': '0', 'ZEE-ROW': '0',
        'ZEE-ROH': '0', 'ZEE-ROO': '0', 'ZEE-ROU': '0', 'ZEE-ROW': '0', 'ZEE-ROH': '0',
        'ZEE-ROO': '0', 'ZEE-ROU': '0', 'ZEE-ROW': '0', 'ZEE-ROH': '0', 'ZEE-ROO': '0',
        'ZEE-ROU': '0', 'ZEE-ROW': '0', 'ZEE-ROH': '0', 'ZEE-ROO': '0', 'ZEE-ROU': '0',
        'ZEE-ROW': '0', 'ZEE-ROH': '0', 'ZEE-ROO': '0', 'ZEE-ROU': '0', 'ZEE-ROW': '0',
        'ZEE-ROH': '0', 'ZEE-ROO': '0', 'ZEE-ROU': '0', 'ZEE-ROW': '0', 'ZEE-ROH': '0',
        'ZEE-ROO': '0', 'ZEE-ROU': '0', 'ZEE-ROW': '0', 'ZEE-ROH': '0', 'ZEE-ROO': '0',
        'ZEE-ROU': '0', 'ZEE-ROW': '0', 'ZEE-ROH': '0', 'ZEE-ROO': '0', 'ZEE-ROU': '0',
        'ZEE-ROW': '0', 'ZEE-ROH': '0', 'ZEE-ROO': '0', 'ZEE-ROU': '0', 'ZEE-ROW': '0',
        'ZEE-ROH': '0', 'ZEE-ROO': '0', 'ZEE-ROU': '0', 'ZEE-ROW': '0', 'ZEE-ROH': '0',
        'ZEE-ROO': '0', 'ZEE-ROU': '0', 'ZEE-ROW': '0', 'ZEE-ROH': '0', 'ZEE-ROO': '0',
        'ZEE-ROU': '0', 'ZEE-ROW': '0', 'ZEE-ROH': '0', 'ZEE-ROO': '0', 'ZEE-ROU': '0',
        'ZEE-ROW': '0', 'ZEE-ROH': '0', 'ZEE-ROO': '0', 'ZEE-ROU': '0', 'ZEE-ROW': '0',
        'ZEE-ROH': '0', 'ZEE-ROO': '0', 'ZEE-ROU': '0', 'ZEE-ROW': '0', 'ZEE-ROH': '0',
        'ZEE-ROO': '0', 'ZEE-ROU': '0', 'ZEE-ROW': '0', 'ZEE-ROH': '0', 'ZEE-ROO': '0',
        'ZEE-ROU': '0', 'ZEE-ROW': '0', 'ZEE-ROH': '0', 'ZEE-ROO': '0', 'ZEE-ROU': '0',
        'ZEE-ROW': '0', 'ZEE-ROH': '0', 'ZEE-ROO': '0', 'ZEE-ROU': '0', 'ZEE-ROW': '0',
        'ZEE-ROH': '0', 'ZEE-ROO': '0', 'ZEE-ROU': '0', 'ZEE-ROW': '0', 'ZEE-ROH': '0',
        'ZEE-ROO': '0', 'ZEE-ROU': '0', 'ZEE-ROW': '0', 'ZEE-ROH': '0', 'ZEE-ROO': '0',
        'ZEE-ROU': '0', 'ZEE-ROW': '0', 'ZEE-ROH': '0', 'ZEE-ROO': '0', 'ZEE-ROU': '0',
        'ZEE-ROW': '0', 'ZEE-ROH': '0', 'ZEE-ROO': '0', 'ZEE-ROU': '0', 'ZEE-ROW': '0',
        'ZEE-ROH': '0', 'ZEE-ROO': '0', 'ZEE-ROU': '0', 'ZEE-ROW': '0', 'ZEE-ROH': '0',
        'ZEE-ROO': '0', 'ZEE-ROU': '0', 'ZEE-ROW': '0', 'ZEE-ROH': '0', 'ZEE-ROO': '0',
        'ZEE-ROU': '0', 'ZEE-ROW': '0', 'ZEE-ROH': '0', 'ZEE-ROO': '0', 'ZEE-ROU': '0',
        'ZEE-ROW': '0', 'ZEE-ROH': '0', 'ZEE-ROO': '0', 'ZEE-ROU': '0', 'ZEE-ROW': '0',
        'ZEE-ROH': '0', 'ZEE-ROO': '0', 'ZEE-ROU': '0', 'ZEE-ROW': '0', 'ZEE-ROH': '0',
        'ZEE-ROO': '0', 'ZEE-ROU': '0', 'ZEE-ROW': '0', 'ZEE-ROH': '0', 'ZEE-ROO': '0',
        'ZEE-ROU': '0', 'ZEE-ROW': '0', 'ZEE-ROH': '0', 'ZEE-ROO': '0', 'ZEE-ROU': '0',
        'ZEE-ROW': '0', 'ZEE-ROH': '0', 'ZEE-ROO': '0', 'ZEE-ROU': '0', 'ZEE-ROW': '0',
        'ZEE-ROH': '0', 'ZEE-ROO': '0', 'ZEE-ROU': '0', 'ZEE-ROW': '0', 'ZEE-ROH': '0',
        'ZEE-ROO': '0', 'ZEE-ROU': '0', 'ZEE-ROW': '0', 'ZEE-ROH': '0', 'ZEE-ROO': '0',
        'ZEE-ROU': '0', 'ZEE-ROW': '0', 'ZEE-ROH': '0', 'ZEE-ROO': '0', 'ZEE-ROU': '0',
        'ZEE-ROW': '0', 'ZEE-ROH': '0', 'ZEE-ROO': '0', 'ZEE-ROU': '0', 'ZEE-ROW': '0',
        'ZEE-ROH': '0', 'ZEE-ROO': '0', 'ZEE-ROU': '0', 'ZEE-ROW': '0', 'ZEE-ROH': '0',
        'ZEE-ROO': '0', 'ZEE-ROU': '0', 'ZEE-ROW': '0', 'ZEE-ROH': '0', 'ZEE-ROO': '0',
        'ZEE-ROU': '0', 'ZEE-ROW': '0', 'ZEE-ROH': '0', 'ZEE-ROO': '0', 'ZEE-ROU': '0',
        'ZEE-ROW': '0', 'ZEE-ROH': '0', 'ZEE-ROO': '0', 'ZEE-ROU': '0', 'ZEE-ROW': '0',
        'ZEE-ROH': '0', 'ZEE-ROO': '0', 'ZEE-ROU': '0', 'ZEE-ROW': '0', 'ZEE-ROH': '0',
        'ZEE-ROO': '0', 'ZEE-ROU': '0', 'ZEE-ROW': '0', 'ZEE-ROH': '0', 'ZEE-ROO': '0',
        'ZEE-ROU': '0', 'ZEE-ROW': '0', 'ZEE-ROH': '0', 'ZEE-ROO': '0', 'ZEE-ROU': '0',
        'ZEE-ROW': '0', 'ZEE-ROH': '0', 'ZEE-ROO': '0', 'ZEE-ROU': '0', 'ZEE-ROW': '0',
        'ZEE-ROH': '0', 'ZEE-ROO': '0', 'ZEE-ROU': '0', 'ZEE-ROW': '0', 'ZEE-ROH': '0',
        'ZEE-ROO': '0', 'ZEE-ROU': '0', 'ZEE-ROW': '0', 'ZEE-ROH': '0', 'ZEE-ROO': '0',
        'ZEE-ROU': '0', 'ZEE-ROW': '0', 'ZEE-ROH': '0', 'ZEE-ROO': '0', 'ZEE-ROU': '0',
        'ZEE-ROW': '0', 'ZEE-ROH': '0', 'ZEE-ROO': '0', 'ZEE-ROU': '0', 'ZEE-ROW': '0',
        'ZEE-ROH': '0', 'ZEE-ROO': '0', 'ZEE-ROU': '0', 'ZEE-ROW': '0', 'ZEE-ROH': '0',
        'ZEE-ROO': '0', 'ZEE-ROU': '0', 'ZEE-ROW': '0', 'ZEE-ROH': '0', 'ZEE-ROO': '0',
        'ZEE-ROU': '0', 'ZEE-ROW': '0', 'ZEE-ROH': '0', 'ZEE-ROO': '0', 'ZEE-ROU': '0',
        'ZEE-ROW': '0', 'ZEE-ROH': '0', 'ZEE-ROO': '0', 'ZEE-ROU': '0', 'ZEE-ROW': '0',
        'ZEE-ROH': '0', 'ZEE-ROO': '0', 'ZEE-ROU': '0', 'ZEE-ROW': '0', 'ZEE-ROH': '0',
        'ZEE-ROO': '0', 'ZEE-ROU': '0', 'ZEE-ROW': '0', 'ZEE-ROH': '0', 'ZEE-ROO': '0',
        'ZEE-ROU': '0', 'ZEE-ROW': '0', 'ZEE-ROH': '0', 'ZEE-ROO': '0', 'ZEE-ROU': '0',
        'ZEE-ROW': '0', 'ZEE-ROH': '0', 'ZEE-ROO': '0', 'ZEE-ROU': '0', 'ZEE-ROW': '0',
        'ZEE-ROH': '0', 'ZEE-ROO': '0', 'ZEE-ROU': '0', 'ZEE-ROW': '0', 'ZEE-ROH': '0',
        'ZEE-ROO': '0', 'ZEE-ROU': '0', 'ZEE-ROW': '0', 'ZEE-ROH': '0', 'ZEE-ROO': '0',
        'ZEE-ROU': '0', 'ZEE-ROW': '0', 'ZEE-ROH': '0', 'ZEE-ROO': '0', 'ZEE-ROU': '0',
        'ZEE-ROW': '0', 'ZEE-ROH': '0', 'ZEE-ROO': '0', 'ZEE-ROU': '0', 'ZEE-ROW': '0',
        'ZEE-ROH': '0', 'ZEE-ROO': '0', 'ZEE-ROU': '0', 'ZEE-ROW': '0', 'ZEE-ROH': '0',
        'ZEE-ROO': '0', 'ZEE-ROU': '0', 'ZEE-ROW': '0', 'ZEE-ROH': '0', 'ZEE-ROO': '0',
        'ZEE-ROU': '0', 'ZEE-ROW': '0', 'ZEE-ROH': '0', 'ZEE-ROO': '0', 'ZEE-ROU': '0',
        'ZEE-ROW': '0', 'ZEE-ROH': '0', 'ZEE-ROO': '0', 'ZEE-ROU': '0', 'ZEE-ROW': '0',
        'ZEE-ROH': '0', 'ZEE-ROO': '0', 'ZEE-ROU': '0', 'ZEE-ROW': '0', 'ZEE-ROH': '0',
        'ZEE-ROO': '0', 'ZEE-ROU': '0', 'ZEE-ROW': '0', 'ZEE-ROH': '0', 'ZEE-ROO': '0',
        'ZEE-ROU': '0', 'ZEE-ROW': '0', 'ZEE-ROH': '0', 'ZEE-ROO': '0', 'ZEE-ROU': '0',
        'ZEE-ROW': '0', 'ZEE-ROH': '0', 'ZEE-ROO': '0', 'ZEE-ROU': '0', 'ZEE-ROW': '0',
        'ZEE-ROH': '0', 'ZEE-ROO': '0', 'ZEE-ROU': '0', 'ZEE-ROW': '0', 'ZEE-ROH': '0',
        'ZEE-ROO': '0', 'ZEE-ROU': '0', 'ZEE-ROW': '0', 'ZEE-ROH': '0', 'ZEE-ROO': '0',
        'ZEE-ROU': '0', 'ZEE-ROW': '0', 'ZEE-ROH': '0', 'ZEE-ROO': '0', 'ZEE-ROU': '0',
        'ZEE-ROW': '0', 'ZEE-ROH': '0', 'ZEE-ROO': '0', 'ZEE-ROU': '0', 'ZEE-ROW': '0',
        'ZEE-ROH': '0', 'ZEE-ROO': '0', 'ZEE-ROU': '0', 'ZEE-ROW': '0', 'ZEE-ROH': '0',
        'ZEE-ROO': '0', 'ZEE-ROU': '0', 'ZEE-ROW': '0', 'ZEE-ROH': '0', 'ZEE-ROO': '0',
        'ZEE-ROU': '0', 'ZEE-ROW': '0', 'ZEE-ROH': '0', 'ZEE-ROO': '0', 'ZEE-ROU': '0',
        'ZEE-ROW': '0', 'ZEE-ROH': '0', 'ZEE-ROO': '0', 'ZEE-ROU': '0', 'ZEE-ROW': '0',
        'ZEE-ROH': '0', 'ZEE-ROO': '0', 'ZEE-ROU': '0', 'ZEE-ROW': '0', 'ZEE-ROH': '0',
        'ZEE-ROO': '0', 'ZEE-ROU': '0', 'ZEE-ROW': '0', 'ZEE-ROH': '0', 'ZEE-ROO': '0',
        'ZEE-ROU': '0', 'ZEE-ROW': '0', 'ZEE-ROH': '0', 'ZEE-ROO': '0', 'ZEE-ROU': '0',
        'ZEE-ROW': '0', 'ZEE-ROH': '0', 'ZEE-ROO': '0', 'ZEE-ROU': '0', 'ZEE-ROW': '0',
        'ZEE-ROH': '0', 'ZEE-ROO': '0', 'ZEE-ROU': '0', 'ZEE-ROW': '0', 'ZEE-ROH': '0',
        'ZEE-ROO': '0', 'ZEE-ROU': '0', 'ZEE-ROW': '0', 'ZEE-ROH': '0', 'ZEE-ROO': '0',
        'ZEE-ROU': '0', 'ZEE-ROW': '0', 'ZEE-ROH': '0', 'ZEE-ROO': '0', 'ZEE-ROU': '0',
        'ZEE-ROW': '0', 'ZEE-ROH': '0', 'ZEE-ROO': '0', 'ZEE-ROU': '0', 'ZEE-ROW': '0',
        'ZEE-ROH': '0', 'ZEE-ROO': '0', 'ZEE-ROU': '0', 'ZEE-ROW': '0', 'ZEE-ROH': '0',
        'ZEE-ROO': '0', 'ZEE-ROU': '0', 'ZEE-ROW': '0', 'ZEE-ROH': '0', 'ZEE-ROO': '0',
        'ZEE-ROU': '0', 'ZEE-ROW': '0', 'ZEE-ROH': '0', 'ZEE-ROO': '0', 'ZEE-ROU': '0',
        'ZEE-ROW': '0', 'ZEE-ROH': '0', 'ZEE-ROO': '0', 'ZEE-ROU': '0', 'ZEE-ROW': '0',
        'ZEE-ROH': '0', 'ZEE-ROO': '0', 'ZEE-ROU': '0', 'ZEE-ROW': '0', 'ZEE-ROH': '0',
        'ZEE-ROO': '0', 'ZEE-ROU': '0', 'ZEE-ROW': '0', 'ZEE-ROH': '0', 'ZEE-ROO': '0',
        'ZEE-ROU': '0', 'ZEE-ROW': '0', 'ZEE-ROH': '0', 'ZEE-ROO': '0', 'ZEE-ROU': '0',
        'ZEE-ROW': '0', 'ZEE-ROH': '0', 'ZEE-ROO': '0', 'ZEE-ROU': '0', 'ZEE-ROW': '0',
        'ZEE-ROH': '0', 'ZEE-ROO': '0', 'ZEE-ROU': '0', 'ZEE-ROW': '0', 'ZEE-ROH': '0',
        'ZEE-ROO': '0', 'ZEE-ROU': '0', 'ZEE-ROW': '0', 'ZEE-ROH': '0', 'ZEE-ROO': '0',
        'ZEE-ROU': '0', 'ZEE-ROW': '0', 'ZEE-ROH': '0', 'ZEE-ROO': '0', 'ZEE-ROU': '0',
        'ZEE-ROW': '0', 'ZEE-ROH': '0', 'ZEE-ROO': '0', 'ZEE-ROU': '0', 'ZEE-ROW': '0',
        'ZEE-ROH': '0', 'ZEE-ROO': '0', 'ZEE-ROU': '0', 'ZEE-ROW': '0', 'ZEE-ROH': '0',
        'ZEE-ROO': '0', 'ZEE-ROU': '0', 'ZEE-ROW': '0', 'ZEE-ROH': '0', 'ZEE-ROO': '0',
        'ZEE-ROU': '0', 'ZEE-ROW': '0', 'ZEE-ROH': '0', 'ZEE-ROO': '0', 'ZEE-ROU': '0',
        'ZEE-ROW': '0', 'ZEE-ROH': '0', 'ZEE-ROO': '0', 'ZEE-ROU': '0', 'ZEE-ROW': '0',
        'ZEE-ROH': '0', 'ZEE-ROO': '0', 'ZEE-ROU': '0', 'ZEE-ROW': '0', 'ZEE-ROH': '0',
        'ZEE-ROO': '0', 'ZEE-ROU': '0', 'ZEE-ROW': '0', 'ZEE-ROH': '0', 'ZEE-ROO': '0',
        'ZEE-ROU': '0', 'ZEE-ROW': '0', 'ZEE-ROH': '0', 'ZEE-ROO': '0', 'ZEE-ROU': '0',
        'ZEE-ROW': '0', 'ZEE-ROH': '0', 'ZEE-ROO': '0', 'ZEE-ROU': '0', 'ZEE-ROW': '0',
        'ZEE-ROH': '0', 'ZEE-ROO': '0', 'ZEE-ROU': '0', 'ZEE-ROW': '0', 'ZEE-ROH': '0',
        'ZEE-ROO': '0', 'ZEE-ROU': '0', 'ZEE-ROW': '0', 'ZEE-ROH': '0', 'ZEE-ROO': '0',
        'ZEE-ROU': '0', 'ZEE-ROW': '0', 'ZEE-ROH': '0', 'ZEE-ROO': '0', 'ZEE-ROU': '0',
        'ZEE-ROW': '0', 'ZEE-ROH': '0', 'ZEE-ROO': '0', 'ZEE-ROU': '0', 'ZEE-ROW': '0',
        'ZEE-ROH': '0', 'ZEE-ROO': '0', 'ZEE-ROU': '0', 'ZEE-ROW': '0', 'ZEE-ROH': '0',
        'ZEE-ROO': '0', 'ZEE-ROU': '0', 'ZEE-ROW': '0', 'ZEE-ROH': '0', 'ZEE-ROO': '0',
        'ZEE-ROU': '0', 'ZEE-ROW': '0', 'ZEE-ROH': '0', 'ZEE-ROO': '0', 'ZEE-ROU': '0',
        'ZEE-ROW': '0', 'ZEE-ROH': '0', 'ZEE-ROO': '0', 'ZEE-ROU': '0', 'ZEE-ROW': '0',
        'ZEE-ROH': '0', 'ZEE-ROO': '0', 'ZEE-ROU': '0', 'ZEE-ROW': '0', 'ZEE-ROH': '0',
        'ZEE-ROO': '0', 'ZEE-ROU': '0', 'ZEE-ROW': '0', 'ZEE-ROH': '0', 'ZEE-ROO': '0',
        'ZEE-ROU': '0', 'ZEE-ROW': '0', 'ZEE-ROH': '0', 'ZEE-ROO': '0', 'ZEE-ROU': '0',
        'ZEE-ROW': '0', 'ZEE-ROH': '0', 'ZEE-ROO': '0', 'ZEE-ROU': '0', 'ZEE-ROW': '0',
        'ZEE-ROH': '0', 'ZEE-ROO': '0', 'ZEE-ROU': '0', 'ZEE-ROW': '0', 'ZEE-ROH': '0',
        'ZEE-ROO': '0', 'ZEE-ROU': '0', 'ZEE-ROW': '0', 'ZEE-ROH': '0', 'ZEE-ROO': '0',
        'ZEE-ROU': '0', 'ZEE-ROW': '0', 'ZEE-ROH': '0', 'ZEE-ROO': '0', 'ZEE-ROU': '0',
        'ZEE-ROW': '0', 'ZEE-ROH': '0', 'ZEE-ROO': '0', 'ZEE-ROU': '0', 'ZEE-ROW': '0',
        'ZEE-ROH': '0', 'ZEE-ROO': '0', 'ZEE-ROU': '0', 'ZEE-ROW': '0', 'ZEE-ROH': '0',
        'ZEE-ROO': '0', 'ZEE-ROU': '0', 'ZEE-ROW': '0', 'ZEE-ROH': '0', 'ZEE-ROO': '0',
        'ZEE-ROU': '0', 'ZEE-ROW': '0', 'ZEE-ROH': '0', 'ZEE-ROO': '0', 'ZEE-ROU': '0',
        'ZEE-ROW': '0', 'ZEE-ROH': '0', 'ZEE-ROO': '0', 'ZEE-ROU': '0', 'ZEE-ROW': '0',
        'ZEE-ROH': '0', 'ZEE-ROO': '0', 'ZEE-ROU': '0', 'ZEE-ROW': '0', 'ZEE-ROH': '0',
        'ZEE-ROO': '0', 'ZEE-ROU': '0', 'ZEE-ROW': '0', 'ZEE-ROH': '0', 'ZEE-ROO': '0',
        'ZEE-ROU': '0', 'ZEE-ROW': '0', 'ZEE-ROH': '0', 'ZEE-ROO': '0', 'ZEE-ROU': '0',
        'ZEE-ROW': '0', 'ZEE-ROH': '0', 'ZEE-ROO': '0', 'ZEE-ROU': '0', 'ZEE-ROW': '0',
        'ZEE-ROH': '0', 'ZEE-ROO': '0', 'ZEE-ROU': '0', 'ZEE-ROW': '0', 'ZEE-ROH': '0',
        'ZEE-ROO': '0', 'ZEE-ROU': '0', 'ZEE-ROW': '0', 'ZEE-ROH': '0', 'ZEE-ROO': '0',
        'ZEE-ROU': '0', 'ZEE-ROW': '0', 'ZEE-ROH': '0', 'ZEE-ROO': '0', 'ZEE-ROU': '0',
        'ZEE-ROW': '0', 'ZEE-ROH': '0', 'ZEE-ROO': '0', 'ZEE-ROU': '0', 'ZEE-ROW': '0',
        'ZEE-ROH': '0', 'ZEE-ROO': '0', 'ZEE-ROU': '0', 'ZEE-ROW': '0', 'ZEE-ROH': '0',
        'ZEE-ROO': '0', 'ZEE-ROU': '0', 'ZEE-ROW': '0', 'ZEE-ROH': '0', 'ZEE-ROO': '0',
        'ZEE-ROU': '0', 'ZEE-ROW': '0', 'ZEE-ROH': '0', 'ZEE-ROO': '0', 'ZEE-ROU': '0',
        'ZEE-ROW': '0', 'ZEE-ROH': '0', 'ZEE-ROO': '0', 'ZEE-ROU': '0', 'ZEE-ROW': '0',
        'ZEE-ROH': '0', 'ZEE-ROO': '0', 'ZEE-ROU': '0', 'ZEE-ROW': '0', 'ZEE-ROH': '0',
        'ZEE-ROO': '0', 'ZEE-ROU': '0', 'ZEE-ROW': '0', 'ZEE-ROH': '0', 'ZEE-ROO': '0',
        'ZEE-ROU': '0', 'ZEE-ROW': '0', 'ZEE-ROH': '0', 'ZEE-ROO': '0', 'ZEE-ROU': '0',
        'ZEE-ROW': '0', 'ZEE-ROH': '0', 'ZEE-ROO': '0', 'ZEE-ROU': '0', 'ZEE-ROW': '0',
        'ZEE-ROH': '0', 'ZEE-ROO': '0', 'ZEE-ROU': '0', 'ZEE-ROW': '0', 'ZEE-ROH': '0',
        'ZEE-ROO': '0', 'ZEE-ROU': '0', 'ZEE-ROW': '0', 'ZEE-ROH': '0', 'ZEE-ROO': '0',
        'ZEE-ROU': '0', 'ZEE-ROW': '0', 'ZEE-ROH': '0', 'ZEE-ROO': '0', 'ZEE-ROU': '0',
        'ZEE-ROW': '0', 'ZEE-ROH': '0', 'ZEE-ROO': '0', 'ZEE-ROU': '0', 'ZEE-ROW': '0',
        'ZEE-ROH': '0', 'ZEE-ROO': '0', 'ZEE-ROU': '0', 'ZEE-ROW': '0', 'ZEE-ROH': '0',
        'ZEE-ROO': '0', 'ZEE-ROU': '0', 'ZEE-ROW': '0', 'ZEE-ROH': '0', 'ZEE-ROO': '0',
        'ZEE-ROU': '0', 'ZEE-ROW': '0', 'ZEE-ROH': '0', 'ZEE-ROO': '0', 'ZEE-ROU': '0',
        'ZEE-ROW': '0', 'ZEE-ROH': '0', 'ZEE-ROO': '0', 'ZEE-ROU': '0', 'ZEE-ROW': '0',
        'ZEE-ROH': '0', 'ZEE-ROO': '0', 'ZEE-ROU': '0', 'ZEE-ROW': '0', 'ZEE-ROH': '0',
        'ZEE-ROO': '0', 'ZEE-ROU': '0', 'ZEE-ROW': '0', 'ZEE-ROH': '0', 'ZEE-ROO': '0',
        'ZEE-ROU': '0', 'ZEE-ROW': '0', 'ZEE-ROH': '0', 'ZEE-ROO': '0', 'ZEE-ROU': '0',
        'ZEE-ROW': '0', 'ZEE-ROH': '0', 'ZEE-ROO': '0', 'ZEE-ROU': '0', 'ZEE-ROW': '0',
        'ZEE-ROH': '0', 'ZEE-ROO': '0', 'ZEE-ROU': '0', 'ZEE-ROW': '0', 'ZEE-ROH': '0',
        'ZEE-ROO': '0', 'ZEE-ROU': '0', 'ZEE-ROW': '0', 'ZEE-ROH': '0', 'ZEE-ROO': '0',
        'ZEE-ROU': '0', 'ZEE-ROW': '0', 'ZEE-ROH': '0', 'ZEE-ROO': '0', 'ZEE-ROU': '0',
        'ZEE-ROW': '0', 'ZEE-ROH': '0', 'ZEE-ROO': '0', 'ZEE-ROU': '0', 'ZEE-ROW': '0',
        'ZEE-ROH': '0', 'ZEE-ROO': '0', 'ZEE-ROU': '0', 'ZEE-ROW': '0', 'ZEE-ROH': '0',
        'ZEE-ROO': '0', 'ZEE-ROU': '0', 'ZEE-ROW': '0', 'ZEE-ROH': '0', 'ZEE-ROO': '0',
        'ZEE-ROU': '0', 'ZEE-ROW': '0', 'ZEE-ROH': '0', 'ZEE-ROO': '0', 'ZEE-ROU': '0',
        'ZEE-ROW': '0', 'ZEE-ROH': '0', 'ZEE-ROO': '0', 'ZEE-ROU': '0', 'ZEE-ROW': '0',
        'ZEE-ROH': '0', 'ZEE-ROO': '0', 'ZEE-ROU': '0', 'ZEE-ROW': '0', 'ZEE-ROH': '0',

        // Number 1 variations
        'WON': '1', 'WUN': '1', 'WANN': '1', 'WANNA': '1', 'WEN': '1',

        // Number 2 variations
        'TOO': '2', 'TO': '2', 'TWO': '2', 'TUE': '2', 'TUW': '2', 'TUE': '2',

        // Number 3 variations
        'TREE': '3', 'THRE': '3', 'THRI': '3', 'THRAY': '3', 'THREY': '3',

        // Number 4 variations
        'FOR': '4', 'FORE': '4', 'FOURTH': '4', 'FEWR': '4', 'BOR': '4', 'BOUR': '4',
        'FOWER': '4', 'FOWR': '4', 'FOWUR': '4', 'FOWOR': '4', 'FOWAR': '4',
        'FOWUR': '4', 'FOWOR': '4', 'FOWAR': '4', 'FOWUR': '4', 'FOWOR': '4',

        // Number 5 variations
        'FIFE': '5', 'FIF': '5', 'FIV': '5', 'FIVE': '5', 'FIFTH': '5',

        // Number 6 variations
        'SICKS': '6', 'SIKS': '6', 'SIXTH': '6', 'SIKSTH': '6', 'SIKST': '6',

        // Number 7 variations
        'SEV': '7', 'SEVEN': '7', 'SEVENTH': '7', 'SEVUN': '7', 'SEVON': '7',

        // Number 8 variations
        'ATE': '8', 'AIT': '8', 'EIGHT': '8', 'EIGHTH': '8', 'EYT': '8',

        // Number 9 variations
        'NINE': '9', 'NINTH': '9', 'NIN': '9', 'NYN': '9', 'NINE': '9',

        // Number 10 variations
        'TEN': '10', 'TENTH': '10', 'TEN': '10', 'TENN': '10', 'TEN': '10',

        // Teens variations (11-19)
        'ELEVEN': '11', 'ELEVENTH': '11', 'ELEVEN': '11', 'ELEVEN': '11',
        'TWELVE': '12', 'TWELFTH': '12', 'TWELVE': '12', 'TWELVE': '12',
        'THIRTEEN': '13', 'THIRTEENTH': '13', 'THIRTIN': '13', 'THIRTIN': '13',
        'FOURTEEN': '14', 'FOURTEENTH': '14', 'FORTIN': '14', 'FORTIN': '14',
        'FIFTEEN': '15', 'FIFTEENTH': '15', 'FIFTIN': '15', 'FIFTIN': '15',
        'SIXTEEN': '16', 'SIXTEENTH': '16', 'SIKSTIN': '16', 'SIKSTIN': '16',
        'SEVENTEEN': '17', 'SEVENTEENTH': '17', 'SEBENTIN': '17', 'SEBENTIN': '17',
        'EIGHTEEN': '18', 'EIGHTEENTH': '18', 'EYTIN': '18', 'EYTIN': '18',
        'NINETEEN': '19', 'NINETEENTH': '19', 'NAYNTIN': '19', 'NAYNTIN': '19',

        // Tens variations (20-90)
        'TWENTY': '20', 'TWENTIETH': '20', 'TWENTI': '20', 'TWENTI': '20',
        'THIRTY': '30', 'THIRTIETH': '30', 'TIRTI': '30', 'TIRTI': '30',
        'FORTY': '40', 'FORTIETH': '40', 'PORTI': '40', 'PORTI': '40',
        'FIFTY': '50', 'FIFTIETH': '50', 'PAYBTI': '50', 'PAYBTI': '50',
        'SIXTY': '60', 'SIXTIETH': '60', 'SIKSTI': '60', 'SIKSTI': '60',
        'SEVENTY': '70', 'SEVENTIETH': '70', 'SEBENTI': '70', 'SEBENTI': '70',
        'EIGHTY': '80', 'EIGHTIETH': '80', 'EYTI': '80', 'EYTI': '80',
        'NINETY': '90', 'NINETIETH': '90', 'NAYNTI': '90', 'NAYNTI': '90',

        // Ordinal numbers (sometimes spoken instead of cardinals)
        'FIRST': '1', 'SECOND': '2', 'THIRD': '3', 'FOURTH': '4', 'FIFTH': '5',
        'SIXTH': '6', 'SEVENTH': '7', 'EIGHTH': '8', 'NINTH': '9', 'TENTH': '10',

        // Hyphenated compound numbers
        'TWENTY-ONE': '21', 'TWENTY-TWO': '22', 'TWENTY-THREE': '23', 'TWENTY-FOUR': '24', 'TWENTY-FIVE': '25',
        'THIRTY-ONE': '31', 'THIRTY-TWO': '32', 'THIRTY-THREE': '33', 'THIRTY-FOUR': '34', 'THIRTY-FIVE': '35',
        'FORTY-ONE': '41', 'FORTY-TWO': '42', 'FORTY-THREE': '43', 'FORTY-FOUR': '44', 'FORTY-FIVE': '45',
        'FIFTY-ONE': '51', 'FIFTY-TWO': '52', 'FIFTY-THREE': '53', 'FIFTY-FOUR': '54', 'FIFTY-FIVE': '55'
      };

      // Comprehensive letter recognition A-Z with various pronunciations and common variations
      const letterWords = {
        // A variations
        'AY': 'A', 'A': 'A', 'AYE': 'A', 'EH': 'A', 'EI': 'A', 'EY': 'A',

        // B variations (enhanced for accents and speech impairments)
        'BEE': 'B', 'BE': 'B', 'BY': 'B', 'BI': 'B', 'BEY': 'B', 'BA': 'B',
        'BAH': 'B', 'BIH': 'B', 'BOH': 'B', 'BUH': 'B', 'VE': 'B', 'VI': 'B',
        'VA': 'B', 'VO': 'B', 'VU': 'B', 'BEEN': 'B', 'BIIN': 'B', 'BAAN': 'B',
        'BOON': 'B', 'BUUN': 'B', 'BEE': 'B', 'BII': 'B', 'BAA': 'B', 'BOO': 'B',
        'BUU': 'B', 'B': 'B', 'BB': 'B', 'BH': 'B', 'BG': 'B', 'BK': 'B', 'BP': 'B',
        // Speech impairment variations
        'PE': 'B', 'PI': 'B', 'PA': 'B', 'PO': 'B', 'PU': 'B', 'VEE': 'B', 'VII': 'B',
        'VAA': 'B', 'VOO': 'B', 'VUU': 'B', 'BB': 'B', 'BBB': 'B', 'BBBB': 'B',
        'BEEH': 'B', 'BIIH': 'B', 'BAAH': 'B', 'BOOH': 'B', 'BUUH': 'B',

        // C variations
        'SEE': 'C', 'SEA': 'C', 'SI': 'C', 'SEY': 'C', 'SA': 'C', 'SEH': 'C',

        // D variations (enhanced for accents and speech impairments)
        'DEE': 'D', 'DE': 'D', 'DEE': 'D', 'DI': 'D', 'DEY': 'D', 'DA': 'D',
        'DAH': 'D', 'DIH': 'D', 'DOH': 'D', 'DUH': 'D', 'TE': 'D', 'TI': 'D',
        'TA': 'D', 'TO': 'D', 'TU': 'D', 'GE': 'D', 'GI': 'D', 'GA': 'D',
        'GO': 'D', 'GU': 'D', 'KE': 'D', 'KI': 'D', 'KA': 'D', 'KO': 'D',
        'KU': 'D', 'THE': 'D', 'DEEN': 'D', 'DIIN': 'D', 'DAAN': 'D', 'DOON': 'D',
        'DUUN': 'D', 'DEE': 'D', 'DII': 'D', 'DAA': 'D', 'DOO': 'D', 'DUU': 'D',
        'D': 'D', 'DD': 'D', 'DH': 'D', 'DG': 'D', 'DK': 'D', 'DT': 'D',
        // Speech impairment variations
        'TH': 'D', 'DH': 'D', 'TD': 'D', 'DT': 'D', 'DD': 'D', 'DDD': 'D',
        'DDDD': 'D', 'THEE': 'D', 'THII': 'D', 'THAA': 'D', 'THOO': 'D', 'THUU': 'D',
        'GEE': 'D', 'GII': 'D', 'GAA': 'D', 'GOO': 'D', 'GUU': 'D',

        // E variations
        'EE': 'E', 'E': 'E', 'EYE': 'E', 'EA': 'E', 'EH': 'E', 'EI': 'E',

        // F variations
        'EF': 'F', 'EFF': 'F', 'FE': 'F', 'FI': 'F', 'FA': 'F', 'FO': 'F',
        'FU': 'F', 'FEH': 'F', 'FIH': 'F', 'FOH': 'F', 'FUH': 'F',

        // G variations
        'GEE': 'G', 'GE': 'G', 'GI': 'G', 'GEY': 'G', 'GA': 'G', 'GO': 'G',
        'GU': 'G', 'JE': 'G', 'JI': 'G', 'JA': 'G', 'JO': 'G', 'JU': 'G',
        'GEH': 'G', 'GIH': 'G', 'GOH': 'G', 'GUH': 'G',

        // H variations
        'AYCH': 'H', 'EICH': 'H', 'HAITCH': 'H', 'HE': 'H', 'HI': 'H', 'HA': 'H',
        'HO': 'H', 'HU': 'H', 'HEH': 'H', 'HIH': 'H', 'HOH': 'H', 'HUH': 'H',

        // I variations
        'AI': 'I', 'EYE': 'I', 'I': 'I', 'IE': 'I', 'EI': 'I', 'AY': 'I',

        // J variations
        'JAY': 'J', 'JE': 'J', 'JI': 'J', 'JEY': 'J', 'JA': 'J', 'JO': 'J',
        'JU': 'J', 'JEH': 'J', 'JIH': 'J', 'JOH': 'J', 'JUH': 'J',

        // K variations
        'KAY': 'K', 'KE': 'K', 'KI': 'K', 'KEY': 'K', 'KA': 'K', 'KO': 'K',
        'KU': 'K', 'KEH': 'K', 'KIH': 'K', 'KOH': 'K', 'KUH': 'K',

        // L variations
        'EL': 'L', 'ELL': 'L', 'LE': 'L', 'LI': 'L', 'LEY': 'L', 'LA': 'L',
        'LO': 'L', 'LU': 'L', 'LEH': 'L', 'LIH': 'L', 'LOH': 'L', 'LUH': 'L',

        // M variations
        'EM': 'M', 'EMM': 'M', 'ME': 'M', 'MI': 'M', 'MEY': 'M', 'MA': 'M',
        'MO': 'M', 'MU': 'M', 'MEH': 'M', 'MIH': 'M', 'MOH': 'M', 'MUH': 'M',

        // N variations (enhanced for accents and speech impairments)
        'EN': 'N', 'ENN': 'N', 'NE': 'N', 'NI': 'N', 'NEY': 'N', 'NA': 'N',
        'NO': 'N', 'NU': 'N', 'NEH': 'N', 'NIH': 'N', 'NOH': 'N', 'NUH': 'N',
        'AND': 'N', 'IN': 'N', 'AN': 'N', 'ON': 'N', 'UN': 'N', 'INN': 'N',
        'ANN': 'N', 'ONN': 'N', 'UNN': 'N', 'NEN': 'N', 'NIN': 'N', 'NAN': 'N',
        'NON': 'N', 'NUN': 'N', 'NEEN': 'N', 'NIIN': 'N', 'NAAN': 'N', 'NOON': 'N',
        'NUUN': 'N', 'NEE': 'N', 'NII': 'N', 'NAA': 'N', 'NOO': 'N', 'NUU': 'N',
        'N': 'N', 'NN': 'N', 'NH': 'N', 'NG': 'N', 'NK': 'N', 'NM': 'N',
        // Speech impairment variations
        'EM': 'N', 'AM': 'N', 'OM': 'N', 'UM': 'N', 'MM': 'N', 'MN': 'N',
        'NM': 'N', 'NNN': 'N', 'NNNN': 'N',

        // O variations
        'OH': 'O', 'O': 'O', 'OW': 'O', 'OA': 'O', 'OE': 'O', 'OO': 'O',

        // P variations
        'PEE': 'P', 'PE': 'P', 'PI': 'P', 'PEY': 'P', 'PA': 'P', 'PO': 'P',
        'PU': 'P', 'PAH': 'P', 'PIH': 'P', 'POH': 'P', 'PUH': 'P', 'FE': 'P',
        'FI': 'P', 'FA': 'P', 'FO': 'P', 'FU': 'P',

        // Q variations
        'KYOO': 'Q', 'KWOO': 'Q', 'KEW': 'Q', 'KIW': 'Q', 'KOO': 'Q', 'KU': 'Q',
        'QUE': 'Q', 'QUI': 'Q', 'QUA': 'Q', 'QUO': 'Q', 'QUU': 'Q',

        // R variations (enhanced for accents and speech impairments)
        'ARE': 'R', 'AR': 'R', 'AIR': 'R', 'ER': 'R', 'OR': 'R', 'OUR': 'R',
        'RA': 'R', 'RE': 'R', 'RI': 'R', 'RO': 'R', 'RU': 'R', 'RAH': 'R',
        'RIH': 'R', 'ROH': 'R', 'RUH': 'R', 'UR': 'R', 'REEN': 'R', 'RIIN': 'R',
        'RAAN': 'R', 'ROON': 'R', 'RUUN': 'R', 'REE': 'R', 'RII': 'R', 'RAA': 'R',
        'ROO': 'R', 'RUU': 'R', 'R': 'R', 'RR': 'R', 'RH': 'R', 'RG': 'R', 'RK': 'R',
        'RT': 'R', 'RS': 'R', 'RRR': 'R', 'RRRR': 'R',
        // Speech impairment variations
        'L': 'R', 'LE': 'R', 'LI': 'R', 'LA': 'R', 'LO': 'R', 'LU': 'R', 'W': 'R',
        'WE': 'R', 'WI': 'R', 'WA': 'R', 'WO': 'R', 'WU': 'R', 'WR': 'R', 'RW': 'R',
        'LR': 'R', 'RL': 'R', 'REH': 'R', 'RIH': 'R', 'RAH': 'R', 'ROH': 'R', 'RUH': 'R',
        'AREE': 'R', 'ARII': 'R', 'ARAA': 'R', 'AROO': 'R', 'ARUU': 'R',

        // S variations
        'ES': 'S', 'ESS': 'S', 'SE': 'S', 'SI': 'S', 'SEY': 'S', 'SA': 'S',
        'SO': 'S', 'SU': 'S', 'SEH': 'S', 'SIH': 'S', 'SOH': 'S', 'SUH': 'S',

        // T variations (enhanced for accents and speech impairments)
        'TEE': 'T', 'TE': 'T', 'TI': 'T', 'TEY': 'T', 'TA': 'T', 'TO': 'T',
        'TU': 'T', 'TEH': 'T', 'TIH': 'T', 'TOH': 'T', 'TUH': 'T', 'TEEN': 'T',
        'TIIN': 'T', 'TAAN': 'T', 'TOON': 'T', 'TUUN': 'T', 'TEE': 'T', 'TII': 'T',
        'TAA': 'T', 'TOO': 'T', 'TUU': 'T', 'T': 'T', 'TT': 'T', 'TH': 'T', 'TG': 'T',
        'TK': 'T', 'TP': 'T', 'TS': 'T', 'TTT': 'T', 'TTTT': 'T',
        // Speech impairment variations
        'D': 'T', 'DE': 'T', 'DI': 'T', 'DA': 'T', 'DO': 'T', 'DU': 'T', 'THE': 'T',
        'THI': 'T', 'THA': 'T', 'THO': 'T', 'THU': 'T', 'S': 'T', 'SE': 'T', 'SI': 'T',
        'SA': 'T', 'SO': 'T', 'SU': 'T', 'CH': 'T', 'CHE': 'T', 'CHI': 'T', 'CHA': 'T',
        'CHO': 'T', 'CHU': 'T', 'TEE': 'T', 'TII': 'T', 'TAA': 'T', 'TOO': 'T', 'TUU': 'T',

        // U variations
        'YOU': 'U', 'YU': 'U', 'OO': 'U', 'UE': 'U', 'EW': 'U', 'YU': 'U',

        // V variations
        'VEE': 'V', 'VE': 'V', 'VI': 'V', 'VEY': 'V', 'VA': 'V', 'VO': 'V',
        'VU': 'V', 'VEH': 'V', 'VIH': 'V', 'VOH': 'V', 'VUH': 'V',

        // W variations
        'DOUBLEYOU': 'W', 'DOUBLYOU': 'W', 'WE': 'W', 'WI': 'W', 'WEY': 'W',
        'WA': 'W', 'WO': 'W', 'WU': 'W', 'WEH': 'W', 'WIH': 'W', 'WOH': 'W',
        'WUH': 'W',

        // X variations
        'EX': 'X', 'EKS': 'X', 'XE': 'X', 'XI': 'X', 'XEY': 'X', 'XA': 'X',
        'XO': 'X', 'XU': 'X', 'XEH': 'X', 'XIH': 'X', 'XOH': 'X', 'XUH': 'X',

        // Y variations
        'WHY': 'Y', 'YE': 'Y', 'YI': 'Y', 'YEY': 'Y', 'YA': 'Y', 'YO': 'Y',
        'YU': 'Y', 'YEH': 'Y', 'YIH': 'Y', 'YOH': 'Y', 'YUH': 'Y',

        // Z variations
        'ZEE': 'Z', 'ZED': 'Z', 'ZE': 'Z', 'ZI': 'Z', 'ZEY': 'Z', 'ZA': 'Z',
        'ZO': 'Z', 'ZU': 'Z', 'ZEH': 'Z', 'ZIH': 'Z', 'ZOH': 'Z', 'ZUH': 'Z'
      };

      const categoryWords = {
        'COFFEE': 'R', 'PASTRY': 'P', 'PASTRIES': 'P', 'BREAD': 'B', 'BREADS': 'B',
        'DRINK': 'D', 'DRINKS': 'D', 'BEVERAGE': 'N', 'BEVERAGES': 'N',
        // Filipino terms
        'KAPE': 'R', 'KAPENG': 'R', 'PASTIL': 'P', 'TINAPAY': 'B', 'PAN': 'B',
        'INUMIN': 'D', 'INOM': 'N', 'BEVERAGE': 'N'
      };

      let processedText = text;

      // Enhanced text preprocessing for Filipino accents
      processedText = processedText
        // Normalize common Filipino misspellings/pronunciations
        .replace(/\bWAN\b/g, 'ONE')
        .replace(/\bTU\b/g, 'TWO')
        .replace(/\bTRI\b/g, 'THREE')
        .replace(/\bPOR\b/g, 'FOUR')
        .replace(/\bPAYB\b/g, 'FIVE')
        .replace(/\bSIKS\b/g, 'SIX')
        .replace(/\bSEBEN\b/g, 'SEVEN')
        .replace(/\bEY\b/g, 'EIGHT')
        .replace(/\bNAYN\b/g, 'NINE')
        .replace(/\bTEN\b/g, 'TEN')
        // Remove punctuation and normalize spaces
        .replace(/[^\w\s]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();

      // Remove common filler words (enhanced for Filipino)
      const fillers = [
        'AND', 'OR', 'THEN', 'ALSO', 'PLUS', 'WITH', 'I', 'WANT', 'ORDER', 'GET', 'ADD',
        'A', 'AN', 'THE', 'PLEASE', 'PO', 'HO', 'NA', 'BA', 'KA', 'KO', 'MO', 'SIYA',
        'TAYO', 'KAMI', 'SILA', 'ITO', 'IYAN', 'IYON', 'ANG', 'NG', 'SA', 'KAY', 'PARA'
      ];
      fillers.forEach(filler => {
        processedText = processedText.replace(new RegExp(`\\b${filler}\\b`, 'gi'), ' ');
      });

      // Replace category words
      for (const [word, letter] of Object.entries(categoryWords)) {
        processedText = processedText.replace(new RegExp(`\\b${word}\\b`, 'gi'), letter);
      }

      // Replace number words with context awareness
      for (const [word, digit] of Object.entries(numberWords)) {
        processedText = processedText.replace(new RegExp(`\\b${word}\\b`, 'gi'), digit);
      }

      // Handle compound numbers that might not be in the exact mapping
      const compoundNumberRegex = /\b(?:TWENTY|THIRTY|FORTY|FIFTY|SIXTY|SEVENTY|EIGHTY|NINETY|TWENTI|TIRTI|PORTI|PAYBTI|SIKSTI|SEBENTI|EYTI|NAYNTI)\s+(?:ONE|TWO|THREE|FOUR|FIVE|SIX|SEVEN|EIGHT|NINE|WAN|TU|TRI|POR|PAYB|SIKS|SEBEN|EY|NAYN)\b/gi;
      processedText = processedText.replace(compoundNumberRegex, (match) => {
        const parsed = parseCompoundNumber(match);
        return parsed || match;
      });

      // Enhanced letter replacement with priority for common misrecognitions
      // First pass: exact matches
      for (const [word, letter] of Object.entries(letterWords)) {
        processedText = processedText.replace(new RegExp(`\\b${word}\\b`, 'gi'), letter);
      }

      // Second pass: phonetic similarity for remaining unrecognized letters
      const phoneticMap = {
        'B': ['BE', 'BI', 'BA', 'BO', 'BU', 'VE', 'VI', 'VA', 'VO', 'VU'],
        'P': ['PE', 'PI', 'PA', 'PO', 'PU', 'FE', 'FI', 'FA', 'FO', 'FU'],
        'D': ['DE', 'DI', 'DA', 'DO', 'DU', 'TE', 'TI', 'TA', 'TO', 'TU'],
        'R': ['RE', 'RI', 'RA', 'RO', 'RU', 'AR', 'ER', 'OR', 'UR']
      };

      // Apply phonetic corrections for remaining single letters that might be misrecognized
      Object.entries(phoneticMap).forEach(([correct, alternatives]) => {
        alternatives.forEach(alt => {
          processedText = processedText.replace(new RegExp(`\\b${alt}\\b`, 'gi'), correct);
        });
      });

      // Remove spaces between letter and number (e.g., "R 1" → "R1")
      processedText = processedText.replace(/([RPBDN])\s+(\d)/g, '$1$2');

      // Clean up extra spaces
      processedText = processedText.replace(/\s+/g, ' ').trim();

      const codes = processedText.match(/([RPBDN]\d{1,2})/gi) || [];
      showToast(`Heard: "${text}" | Processed: "${processedText}" | Codes: ${codes.join(', ') || 'none'}`);
      if (codes.length === 0) {
        showToast("No valid code detected");
        return;
      }

      fetch("api/get_menu.php")
        .then(r => r.json())
        .then(res => {
          if (!res.success) return;
          let added = 0;

          // First, try to match codes
          codes.forEach(code => {
            const item = res.data.find(i => i.code.toUpperCase() === code.toUpperCase());
            if (item) {
              onItemAdded(item, 1);
              added++;
            }
          });

          // If no codes found, try to match item names with improved algorithm
          if (added === 0) {
            const spokenWords = processedText.split(/\s+/).filter(word => word.length > 1);

            // Enhanced item name matching with Filipino accent support
            const normalizeFilipino = (text) => {
              return text
                .toUpperCase()
                // Common Filipino substitutions
                .replace(/CHOCOLATE/g, 'TSOKOLATE')
                .replace(/CHEESE/g, 'TSESE')
                .replace(/CHICKEN/g, 'TSEKEN')
                .replace(/FRIES/g, 'PRAYS')
                .replace(/BURGER/g, 'BERGER')
                .replace(/SANDWICH/g, 'SENDWITs')
                .replace(/PIZZA/g, 'PITSA')
                .replace(/PASTA/g, 'PASTA')
                .replace(/SALAD/g, 'SALAD')
                .replace(/SOUP/g, 'SUP')
                .replace(/COFFEE/g, 'KAPE')
                .replace(/TEA/g, 'TI')
                .replace(/JUICE/g, 'DYWUS')
                .replace(/WATER/g, 'WATIR')
                .replace(/MILK/g, 'MILK')
                .replace(/HOT/g, 'HAT')
                .replace(/COLD/g, 'KOLD')
                .replace(/ICED/g, 'AYST')
                .replace(/FRESH/g, 'PRES')
                .replace(/SPECIAL/g, 'ESPESYAL')
                .replace(/CLASSIC/g, 'KLASIK')
                .replace(/DELUXE/g, 'DILUKS');
            };

            // Try exact matches first (with Filipino normalization)
            spokenWords.forEach(spokenWord => {
              const normalizedSpoken = normalizeFilipino(spokenWord);
              const item = res.data.find(i => {
                const itemWords = i.name.toUpperCase().split(/\s+/);
                const normalizedItemWords = itemWords.map(word => normalizeFilipino(word));
                return normalizedItemWords.some(itemWord =>
                  itemWord === spokenWord ||
                  itemWord === normalizedSpoken ||
                  spokenWord === itemWord
                );
              });
              if (item) {
                onItemAdded(item, 1);
                added++;
              }
            });

            // If still no matches, try partial/fuzzy matches with enhanced Filipino support
            if (added === 0) {
              spokenWords.forEach(spokenWord => {
                if (spokenWord.length < 3) return; // Skip very short words

                const normalizedSpoken = normalizeFilipino(spokenWord);
                const item = res.data.find(i => {
                  const itemName = i.name.toUpperCase();
                  const normalizedItemName = normalizeFilipino(itemName);

                  // Check various matching conditions
                  return itemName.includes(spokenWord) ||
                         spokenWord.includes(itemName) ||
                         normalizedItemName.includes(normalizedSpoken) ||
                         normalizedSpoken.includes(normalizedItemName) ||
                         // Calculate similarity for fuzzy matching
                         calculateSimilarity(spokenWord, itemName) > 0.6 ||
                         calculateSimilarity(normalizedSpoken, normalizedItemName) > 0.7;
                });
                if (item) {
                  onItemAdded(item, 1);
                  added++;
                }
              });
            }

            // Try matching multiple words together (for longer item names) with Filipino support
            if (added === 0 && spokenWords.length > 1) {
              const combinations = [];
              // Try 2-word combinations
              for (let i = 0; i < spokenWords.length - 1; i++) {
                combinations.push(spokenWords.slice(i, i + 2).join(' '));
              }
              // Try 3-word combinations
              for (let i = 0; i < spokenWords.length - 2; i++) {
                combinations.push(spokenWords.slice(i, i + 3).join(' '));
              }

              combinations.forEach(phrase => {
                const normalizedPhrase = normalizeFilipino(phrase);
                const item = res.data.find(i => {
                  const itemName = i.name.toUpperCase();
                  const normalizedItemName = normalizeFilipino(itemName);
                  return itemName.includes(phrase) ||
                         normalizedItemName.includes(normalizedPhrase) ||
                         calculateSimilarity(phrase, itemName) > 0.7 ||
                         calculateSimilarity(normalizedPhrase, normalizedItemName) > 0.75;
                });
                if (item) {
                  onItemAdded(item, 1);
                  added++;
                }
              });
            }

            // Last resort: try single word matches with very lenient similarity
            if (added === 0) {
              spokenWords.forEach(spokenWord => {
                if (spokenWord.length < 4) return; // Skip very short words for this pass

                const item = res.data.find(i => {
                  const itemName = i.name.toUpperCase();
                  // Very lenient similarity matching
                  return calculateSimilarity(spokenWord, itemName) > 0.5 ||
                         // Check if spoken word is contained in any part of item name
                         itemName.split(/\s+/).some(word =>
                           word.length > 3 && (
                             word.includes(spokenWord) ||
                             spokenWord.includes(word) ||
                             calculateSimilarity(spokenWord, word) > 0.6
                           )
                         );
                });
                if (item) {
                  onItemAdded(item, 1);
                  added++;
                }
              });
            }
          }

          showToast(added > 0 ? `${added} item(s) added!` : "No items found");
        });
    };

    rec.onerror = () => {
      setIsListening(false);
      isListeningRef.current = false;
      showToast("Voice error");
    };
    rec.onend = () => {
      setIsListening(false);
      isListeningRef.current = false;
    };
    recognitionRef.current = rec;
  }, [onItemAdded, showToast]);

  const toggle = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      isListeningRef.current = false;
      showToast("Voice recognition stopped");
    } else {
      recognitionRef.current?.start();
      setIsListening(true);
      isListeningRef.current = true;
      showToast("Voice recognition started. Say your order codes or item names.");
    }
  };

  return (
    <button
      onClick={toggle}
      className={`fixed bottom-8 right-8 z-50 w-20 h-20 rounded-full shadow-2xl flex items-center justify-center transition-all transform hover:scale-110 ${
        isListening ? "bg-green-600 animate-pulse ring-8 ring-green-300 ring-opacity-70" : "bg-blue-600 hover:bg-blue-700"
      }`}
      title="Voice Command - Say codes (R1, N7...) or item names"
    >
      <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3}
              d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
      </svg>
    </button>
  );
}
