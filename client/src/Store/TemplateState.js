import {makeAutoObservable} from "mobx";
import axios from "axios";


class TemplateState {

    title = ""
    images = {
        avatar: false,
        background: false
    }
    story = []
    chapter = []
    counter = []

    Errors = undefined

    constructor() {
        makeAutoObservable(this)
    }

    async openOrCreate() {
        axios.get('/api/template/openorcreate').then(response => {
            if (response.status === 201) {

            }
            else if (response.status === 200) {
                this.title = response.data.title
                this.images = response.data.images
                this.story = response.data.story
                this.chapter = response.data.chapter
                this.counter = response.data.counter
            }
        })
    }

    async changeTitle(title) {
        axios.post('/api/template/changetitle', {title}).then(response => {
            if (response.status === 200) {
                this.title = response.data.title
            }
        })
    }

    async changeImage(mode, file) {
        try {
            let formData = new FormData();
            formData.append("mode", mode)
            formData.append("file", file);
            await axios.post('/api/template/changeimage', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }).then((result) => {
                if (mode === "avatar")
                    this.images.avatar = true
                if (mode === "background")
                    this.images.background = true
            })
        } catch (e) {
            console.log(e)
        }
    }

    async createStoryLevel() {
        axios.get('/api/template/createstorylevel').then(response => {
            if (response.status === 200) {
                this.story = response.data.story
            }
        })
    }

    async deleteLevel(id) {
        axios.post('/api/template/deletelevel', {id}).then(response => {
            if (response.status === 200) {
                this.story = response.data.story
            }
        })
    }

    async addChapterToStoryLevel(levelId, chapterId) {
        axios.post('/api/template/addchaptertostorylevel', {levelId, chapterId}).then(response => {
            if (response.status === 200) {
                this.story = response.data.story
            }
        })
    }

    async deleteChapterInStoryLevel(levelId, chapterId) {
        axios.post('/api/template/deletechapterinstorylevel', {levelId, chapterId}).then(response => {
            if (response.status === 200) {
                this.story = response.data.story
            }
        })
    }

    async createChapter(title) {
        axios.post('/api/template/createchapter', {title}).then(response =>{
            if (response.status === 200) {
                this.chapter = response.data.chapters
            }
        })
    }

    async changeChapter(id, title, text, need, decision) {
        axios.post('/api/template/changechapter', {id, title, text, need, decision}).then(response => {
            if (response.status === 200) {
                this.chapter = response.data.chapters
            }
        })
    }

    async deleteChapter(id) {
        axios.post('/api/template/deletechapter', {id}).then(response => {
            if (response.status === 200) {
                this.chapter = response.data.chapters
            }
        })
    }

    async createDecision(chapterId, decisionId, title) {
        axios.post('/api/template/createdecision', {chapterId, decisionId, title}).then(response => {
            if (response.status === 200) {
                this.chapter = response.data.chapters
            }
        })
    }

    async refreshNeed() {
        axios.get('/api/template/refreshneed').then(response => {
            if (response.status === 200) {
                this.chapter = response.data.chapters
            }
        })
    }

    async changeNeed(chapterId, id, count) {
        axios.post('/api/template/changeneed', {chapterId, id, count}).then(response => {
            if (response.status === 200) {
                this.chapter = response.data.chapters
            }
        })
    }

    async refreshDecision() {
        axios.get('/api/template/refreshdevision').then(response => {
            if (response.status === 200) {
                this.chapter = response.data.chapters
            }
        })
    }

    async changeDecision(id, title, counters) {
        axios.post('/api/template/changedecision', {id, title, counters}).then(response => {
            if (response.status === 200) {
                this.chapter = response.data.chapters
            }
        })
    }

    async deleteDecision(id) {
        axios.post('/api/template/deletedecision', {id}).then(response => {
            if (response.status === 200) {
                this.chapter = response.data.chapters
            }
        })
    }

    async createCounter(name, count) {
        axios.post('/api/template/createcounter', {name, count}).then(response =>{
            if (response.status === 200) {
                this.counter = response.data.counters
                this.refreshDecision()
            }
        })
    }

    async changeCounter(name, count, id) {
        axios.post('/api/template/changecounter', {name, count, id}).then(response => {
            if (response.status === 200) {
                this.counter = response.data.counters

            }
        })
    }

    async deleteCounter(id) {
        axios.post('/api/template/deletecounter', {id}).then(response => {
            if (response.status === 200) {
                this.counter = []
                this.counter = response.data.counters
            }
        })
    }

    async checkTemplate() {
        await axios.get('/api/template/checktemplateerrors').then(response => {
            if (response.status === 200) {
                this.Errors = {
                    status: false
                }
                axios.get('/api/template/deletetemplate').then(()=> {
                    this.title = ""
                    this.images = {
                        avatar: false,
                        background: false
                    }
                    this.story = []
                    this.chapter = []
                    this.counter = []
                })
            }
            if (response.status === 206) {
                this.Errors = {
                    status: true,
                    description: {
                        title: response.data.errors.titleError,
                        story: response.data.errors.storyError,
                        chapter: response.data.errors.chapterError,
                        counter: response.data.errors.counterError
                    }
                }
            }
        }).catch(e => {
            this.Errors = {
                status: false
            }
        })
    }
}

export default new TemplateState();