export default class ScoreSystem {

    score;
    playerRecord;

    constructor() {
        this.score = 0;
        this.playerRecord = 0;
        if (window.localStorage) {
            this.retrievePlayerRecord();
        }
    }

    addPoints(pointsToCollect) {
        this.score += pointsToCollect;
    }

    countPlayerRecord() {
        if (this.score > this.playerRecord) {
            this.playerRecord = this.score;
            if (window.localStorage) {
                this.storePlayerRecord();
            }
        }
    }

    reset() {
        this.score = 0;
    }

    retrievePlayerRecord() {
        if (window.localStorage['OpenFlappySaveData']) {
            this.playerRecord = JSON.parse(window.localStorage['OpenFlappySaveData']).maxRecord;
        }
    }

    storePlayerRecord() {
        window.localStorage.setItem('OpenFlappySaveData',JSON.stringify({
            maxRecord : this.playerRecord
        }));
    }

}