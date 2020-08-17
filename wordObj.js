class wordObj {
    constructor() {
        this.Dalin = [];
        this.SO = [];
        this.SAOL1 = [];
        this.SAOL6 = [];
        this.SAOL7 = [];
        this.SAOL8 = [];
        this.SAOL9 = [];
        this.SAOL10 = [];
        this.SAOL11 = [];
        this.SAOL12 = [];
        this.SAOL13 = [];
        this.SAOL14 = [];
    }

    length() {
        let res = 0;
        for (let key of Object.keys(this)) {
            res += this[key].length;
        }
        return res;
    }

    concat(other) {
        for (let key of Object.keys(other)) {
            this[key] = this[key].concat(other[key]);
        }
    }

    addToBooks(_books, word) {
        for (const current of _books) {
            this.addToBook(current, word)
        }
    }

    addToBook(_book, word) {
        this[_book.match(/SO|Dalin|SAOL|\d\d|\d/g).reduce((a, b) => a + b)].push(word)
    }
}

module.exports = wordObj;