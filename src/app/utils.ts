export enum KeyCode {
	ENTER = 13,
	PLUS = 107,
	MINUS = 109
}

export class KeyCodeMap {
    static _key_codes = {
    	48:  '0',
    	49:  '1',
    	50:  '2',
    	51:  '3',
    	52:  '4',
    	53:  '5',
    	54:  '6',
    	55:  '7',
    	56:  '8',
    	57:  '9',
    	96:  '0',
    	97:  '1',
    	98:  '2',
    	99:  '3',
    	100: '4',
    	101: '5',
    	102: '6',
    	103: '7',
    	104: '8',
    	105: '9',
    	65:  'A',
    	66:  'B',
    	67:  'C',
    	68:  'D',
    	69:  'E',
    	70:  'F',
    	71:  'G',
    	72:  'H',
    	73:  'I',
    	74:  'J',
    	75:  'K',
    	76:  'L',
    	77:  'M',
    	78:  'N',
    	79:  'O',
    	80:  'P',
    	81:  'Q',
    	82:  'R',
    	83:  'S',
    	84:  'T',
    	85:  'U',
    	86:  'V',
    	87:  'W',
    	88:  'X',
    	89:  'Y',
    	90:  'Z',
    }

    static getLiteral(key: number): string{
        return KeyCodeMap._key_codes[key];
    }
}

