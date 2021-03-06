const Template = require('../models/Template')
const Story = require('../models/Story')
const uuid = require('uuid')
const fs = require('fs')

class templateController {

    async openOrCreate(ctx) {
        const key = ctx.cookies.get('key')
        const template = await Template.findOne({key})
        if(template) {
            let images = {
                avatar: false,
                background: false
            }
            if (template.images.avatar !== null && template.images.avatar !== "")
                images.avatar = true
            if (template.images.background !== null && template.images.background !== "")
                images.background = true
            ctx.body = {
                "title": template.title,
                "images": images,
                "story": template.story,
                "chapter": template.chapter,
                "counter": template.counter
            }
            ctx.status = 200
        } else {
            const id = uuid.v4()
            await new Template({id, key}).save()
            ctx.status = 201
        }
    }

    async changeTitle(ctx) {
        const {title} = ctx.request.body
        const key = ctx.cookies.get('key')

        await Template.updateOne({key}, {title: title})

        ctx.body = {
            title: title
        }
        ctx.status = 200
    }

    async changeImage(ctx) {
        try {
            const key = ctx.cookies.get('key')
            const data = ctx.request.fields
            const fileName = uuid.v4() + '.jpg'
            const template = await Template.findOne({key})
            if (data.mode === "avatar") {
                fs.rename(data.file[0].path,
                    "C:\\Users\\evgen\\Desktop\\react-apps\\TellYourStory\\server\\static\\story\\avatar" + "\\" + fileName,
                    async () => {
                        let newFileNames = template.images
                        newFileNames.avatar = fileName
                        await Template.updateOne({key}, {images: newFileNames})
                    })
                ctx.body = "ok"
                ctx.status = 200
            } else if (data.mode === "background") {
                fs.rename(data.file[0].path,
                    "C:\\Users\\evgen\\Desktop\\react-apps\\TellYourStory\\server\\static\\story\\background" + "\\" + fileName,
                    async () => {
                        let newFileNames = template.images
                        newFileNames.background = fileName
                        await Template.updateOne({key}, {images: newFileNames})
                    })
                ctx.body = "ok"
                ctx.status = 200
            } else {
                ctx.body = "not found mode"
                ctx.status = 404
            }
        } catch (e) {
            console.log(e)
        }
    }

    async createStoryLevel(ctx) {
        const id = uuid.v4()
        const key = ctx.cookies.get('key')
        const template = await Template.findOne({key})
        let levels = template.story
        const number = levels.length === 0 ? 0 : levels[levels.length - 1].number + 1
        levels.push({
            id: id,
            number: number,
            chapters: []
        })

        await Template.updateOne({key}, {story: levels})

        ctx.body = {
            story: levels
        }
        ctx.status = 200
    }

    async deleteLevel(ctx) {
        const {id} = ctx.request.body
        const key = ctx.cookies.get('key')
        const template = await Template.findOne({key})
        let levels = template.story
        levels = levels.filter(level => level.id !== id)
        let i = 0
        levels.forEach(level => {
            level.number = i
            i++
        })
        await Template.updateOne({key}, {story: levels})
        ctx.body = {
            story: levels
        }
        ctx.status = 200
    }

    async addChapterToStoryLevel(ctx) {
        const {levelId, chapterId} = ctx.request.body
        const key = ctx.cookies.get('key')
        const template = await Template.findOne({key})
        let levels = template.story
        const storyIdx = levels.findIndex(level => level.id === levelId)
        levels[storyIdx].chapters.push({
            levelId: levelId,
            chapterId: chapterId
        })

        await Template.updateOne({key}, {story: levels})

        ctx.body = {
            story: levels
        }
        ctx.status = 200
    }

    async deleteChapterInStoryLevel(ctx) {
        try {
            const {levelId, chapterId} = ctx.request.body
            const key = ctx.cookies.get('key')
            const template = await Template.findOne({key})
            let levels = template.story
            const storyIdx = levels.findIndex(level => level.id === levelId)
            levels[storyIdx].chapters =
                levels[storyIdx].chapters.filter(chapters =>
                    chapters.chapterId !== chapterId
                )

            await Template.updateOne({key}, {story: levels})

            ctx.body = {
                story: levels
            }
            ctx.status = 200
        } catch (e) {
            console.log(e)
        }
    }

    async createChapter(ctx) {
        const {title} = ctx.request.body
        const key = ctx.cookies.get('key')
        const id = uuid.v4()
        const template = await Template.findOne({key})
        let chapters = template.chapter
        chapters.push({
            id: id,
            title: title,
            text: "",
            need: [],
            decision: []
        })

        await Template.updateOne({key}, {chapter: chapters})

        ctx.body = {
            chapters: chapters
        }
        ctx.status = 200
    }

    async changeChapter(ctx) {
        try {
            const {id, title, text, need, decision} = ctx.request.body

            const key = ctx.cookies.get('key');
            const template = await Template.findOne({key})
            let chapters = template.chapter
            for (let i = 0; i < chapters.length; ++i) {
                if (chapters[i].id === id) {
                    chapters[i] = {
                        id: id,
                        title: title,
                        text: text,
                        need: need,
                        decision: decision,
                    }
                }
            }

            await Template.updateOne({key}, {chapter: chapters})

            ctx.body = {
                chapters: chapters
            }
            ctx.status = 200
        } catch (e) {
            console.log(e)
        }
    }

    async deleteChapter(ctx) {
        const {id} = ctx.request.body
        const key = ctx.cookies.get('key');
        const template = await Template.findOne({key})
        let chapters = []
        for (let i = 0; i < template.chapter.length; ++i) {
            if(template.chapter[i].id !== id) {
                chapters.push({
                    id: template.chapter[i].id,
                    title: template.chapter[i].title,
                    text: template.chapter[i].text,
                    decision: template.chapter[i].decision
                })
            }
        }

        await Template.updateOne({key}, {chapter: chapters})

        ctx.body = {
            chapters: chapters
        }
        ctx.status = 200
    }

    async createDecision(ctx) {
        try {
            const {chapterId, decisionId, title} = ctx.request.body
            const id = decisionId
            const key = ctx.cookies.get('key');
            const template = await Template.findOne({key})

            let chapters = template.chapter

            const counters = template.counter.map(counter => {
                return{
                    "name": counter.name,
                    "count": 0
                }
            })

            for (let i = 0; i < template.chapter.length; ++i) {
                if (template.chapter[i].id === chapterId) {
                    let decision = chapters[i].decision
                    decision.push({
                            id: id,
                            title: title,
                            counters: counters
                        })
                    chapters[i].decision = decision
                }
            }

            await Template.updateOne({key}, {
                chapter: chapters
            })

            ctx.body = {
                chapters: chapters
            }
            ctx.status = 200
        } catch (e) {
            console.log(e)
        }
    }

    async refreshNeed(ctx) {
        try {
            const key = ctx.cookies.get('key');
            const template = await Template.findOne({key})
            let chapters = template.chapter
            chapters.forEach((chapter) => {
                let tmpNeed = template.counter.map(counter => {
                    return {
                        "id": counter.id,
                        "name": counter.name,
                        "count": 0
                    }
                })
                tmpNeed.forEach(need => {
                        const idx = chapter.need.findIndex(count => count.id === need.id)
                        //console.log()
                        if (idx > -1) {
                            need.count = chapter.need[idx].count
                        }
                })
                chapter.need = tmpNeed
            })

            await Template.updateOne({key}, {
                chapter: chapters
            })

            ctx.body = {
                chapters: chapters
            }
            ctx.status = 200
        } catch (e) {
            console.log(e)
        }
    }

    async changeNeed(ctx) {
        const {chapterId, id, count} = ctx.request.body
        const key = ctx.cookies.get('key');
        const template = await Template.findOne({key})
        let chapters = template.chapter

        const chapterIdx = chapters.findIndex(chapter => chapter.id === chapterId)
        const needIdx = chapters[chapterIdx].need.findIndex(need => need.id === id)
        chapters[chapterIdx].need[needIdx].count = count

        await Template.updateOne({key}, {
            chapter: chapters
        })

        ctx.body = {
            chapters: chapters
        }
        ctx.status = 200
    }

    async refreshDecision(ctx) {

        try {
            const key = ctx.cookies.get('key');
            const template = await Template.findOne({key})

            let chapters = template.chapter

            chapters.forEach((chapter, chapterIndex) => {
                    chapter.decision.forEach( (decision, decisionIndex) =>
                    {
                    let counter = template.counter.map(counter => {
                        return{
                            "name": counter.name,
                            "count": 0
                        }
                    })

                    const counters = template.chapter[chapterIndex].decision[decisionIndex].counters

                    counter.forEach(counter => {
                        const index = counters.findIndex(countersIndex => countersIndex.name === counter.name)
                        if (index >= 0) {
                            counter.count = counters[index].count
                        }
                    })
                    decision.counters = counter
                })
            })

            await Template.updateOne({key}, {
                chapter: chapters
            })

            ctx.body = {
                chapters: chapters
            }
            ctx.status = 200
        } catch (e) {
            console.log(e)
        }
    }

    async changeDecision(ctx) {
        try {
            const {id, title, counters} = ctx.request.body
            const key = ctx.cookies.get('key');

            const template = await Template.findOne({key})

            let chapters = template.chapter

            for (let i = 0; i < chapters.length; ++i) {
                for (let j = 0; j < chapters[i].decision.length; ++j) {
                    if (chapters[i].decision[j].id === id) {
                        chapters[i].decision[j] = {
                            id: id,
                            title: title,
                            counters: counters
                        }
                    }
                }
            }

            await Template.updateOne({key}, {
                chapter: chapters
            })

            ctx.body = {
                chapters: chapters
            }
            ctx.status = 200

        } catch (e) {
            console.log(e)
        }


    }

    async deleteDecision(ctx) {
        const {id} = ctx.request.body
        const key = ctx.cookies.get('key');
        const template = await Template.findOne({key})
        let chapters = template.chapter

        for (let i = 0; i < chapters.length; ++i) {
            const decision = []

            for (let j = 0; j < chapters[i].decision.length; ++j) {
                if (chapters[i].decision[j].id !== id) {
                    decision.push(chapters[i].decision[j])
                }
            }
            chapters[i].decision = decision
        }

        await Template.updateOne({key}, {chapter: chapters})

        ctx.body = {
            chapters: chapters
        }
        ctx.status = 200
    }

    async createCounter(ctx) {
        const {name, count} = ctx.request.body
        const key = ctx.cookies.get('key');
        const id = uuid.v4()
        const template = await Template.findOne({key})
        let counters = template.counter
        counters.push({
            id: id,
            name: name,
            count: count
        })

        await Template.updateOne({key}, {counter: counters})

        ctx.body = {
            counters: counters
        }
        ctx.status = 200
    }

    async changeCounter(ctx) {
        const {name, count, id} = ctx.request.body
        const key = ctx.cookies.get('key');
        const template = await Template.findOne({key})
        let counters = template.counter
        for (let i = 0; i < counters.length; ++i) {
            if(counters[i].id === id) {
                counters[i] = {
                    name: name,
                    count: count,
                    id: id
                }
            }
        }

        await Template.updateOne({key}, {counter: counters})

        ctx.body = {
            counters: counters
        }
        ctx.status = 200
    }

    async deleteCounter(ctx) {
        const {id} = ctx.request.body
        const key = ctx.cookies.get('key');
        const template = await Template.findOne({key})
        let counters = []
        for (let i = 0; i < template.counter.length; ++i) {
            if(template.counter[i].id !== id) {
                counters.push({
                    name: template.counter[i].name,
                    count: template.counter[i].count,
                    id: template.counter[i].id
                })
            }
        }

        await Template.updateOne({key}, {counter: counters})

        ctx.body = {
            counters: counters
        }
        ctx.status = 200
    }

    async checkTemplateErrors(ctx) {
        const key = ctx.cookies.get('key');
        const template = await Template.findOne({key});

        // check title

        let titleError = false

        if (template.title === "") {
            titleError = true
        }

        // check story

        let storyError = false

        try {
            let storyHasChapters = false

            template.story.forEach(level => {
               if (level.chapters.length > 0) {
                   storyHasChapters = true
               }
            })

            if (!storyHasChapters) {
                storyError = true
            }
        } catch (e) {
            storyError = true
        }

        // check chapter

        let chapterError = false

        try {
            template.chapter.forEach(chapter => {
                if (chapter.title === "") {
                    chapterError = true
                }
                if (chapter.text === "") {
                    chapterError = true
                }
            })
        } catch (e) {
            chapterError = true
        }

        // check counter

        let counterError = false

        try {
            template.counter.forEach(counter => {
                const num = Number(counter.count)
                if (!Number.isInteger(num)) {
                    counterError = true
                }
                if (!counter.name === "") {
                    counterError = true
                }
            })
        } catch (e) {
            console.log(e)
            counterError = true
        }

        if (titleError || storyError || chapterError || counterError) {
            ctx.body = {
                errors: {
                    "titleError": titleError,
                    "storyError": storyError,
                    "chapterError": chapterError,
                    "counterError": counterError
                }
            }
            ctx.status = 206
        } else {
            try {
                const id = uuid.v4()
                await new Story({id, key, struct: template}).save()

                ctx.body = {
                    errors: null
                }
                ctx.status = 200 
            } catch (e) {
                console.log(e)
            }
            
        }
    }

    async deleteTemplate(ctx) {
        const key = ctx.cookies.get('key');
        await Template.deleteOne({key})

        ctx.status = 200
    }
}

module.exports = new templateController();