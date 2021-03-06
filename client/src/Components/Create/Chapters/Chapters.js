import React, {useState} from 'react';
import './Chapters.scss'
import {observer} from "mobx-react-lite";
import addImg from '../../../Images/add.svg'
import template from "../../../Store/TemplateState";
import Chapter from "./Chapter"
import { configure } from "mobx"
import localizationState from '../../../Store/LocalizationState'


const Chapters = observer(() => {

    configure({
        enforceActions: "never",
    })

    const localization = localizationState.text

    const counters = template.counter

    const [addTitle, setAddTitle] = useState('')

    const chapters = template.chapter

    template.refreshDecision().then()
    template.refreshNeed().then()

    const chaptersElements = chapters.map((chapter, index) => {

        return <Chapter key={chapter.id} {...{
            id: chapter.id,
            title: chapter.title,
            text: chapter.text,
            need: chapter.need,
            decision: chapter.decision
        }}/>
    })

    return (
        <div>
            <div className="Create-chapters-add-section">
                <input type="text" className="Create-chapters-add-input-title"
                       placeholder={localization.create.chapters.addTitle}
                       value={addTitle}
                       onChange={value => {
                           setAddTitle(value.target.value)
                       }}
                />
                <img src={addImg} alt="add" className="Create-chapters-add-input-button" onClick={() => {
                    template.createChapter(addTitle).then()
                    setAddTitle('')
                }}/>
            </div>
            <div>
                <div className="Create-chapter-headline-section">
                    <div className="Create-chapter-headline-block">
                        {localization.create.chapters.savedHeadline}
                    </div>
                </div>
                <div>
                    {chaptersElements}
                </div>
            </div>
        </div>

    )
});

export default Chapters;