import React from 'react';
import './Chapters.scss'
import {useState} from "react";
import {observer} from "mobx-react-lite";
import arrowDownImg from "../../../Images/arrowdown.svg";
import arrowUpImg from '../../../Images/arrowup.svg'
import saveImg from "../../../Images/save.svg";
import deleteImg from "../../../Images/trash.svg";
import Need from './Need'
import template from "../../../Store/TemplateState";
import {v4} from "uuid";
import addImg from '../../../Images/add.svg'
import Decision from "./Decision";
import localizationState from '../../../Store/LocalizationState'


const Chapter = observer((props) => {
    const localization = localizationState.text
    const [hide, setHide] = useState(true)
    const [title, setTitle] = useState(props.title)
    const [text, setText] = useState(props.text)
    const [addDecisionTitle, setAddDecisionTitle] = useState('')
    const [decision, setDecision] = useState(props.decision)
    let need = props.need

    need = need.map(need => <Need key={need.id} {...need}/>)

    function updateDecision(newDecision) {
        setDecision(newDecision)
    }


    return (
        <div>
            <div key = {props.id}>
                <div className="Create-chapters-section-head">
                    <input type="text" className="Create-chapters-input-title"
                           placeholder={localization.create.chapters.title}
                           value={title}
                           onChange={value => {
                               setTitle(value.target.value)
                           }}
                    />
                    <img src={hide ? arrowDownImg : arrowUpImg} alt="hide" className="Create-chapters-input-button" onClick={ () => {
                        setHide(!hide)
                    }}
                    />
                    <img src={saveImg} alt="save" className="Create-chapters-input-button" onClick = {() => {
                        const changeDecision = JSON.parse(JSON.stringify(decision))
                        const changeNeed = need.map(needProps => JSON.parse(JSON.stringify(needProps.props)))
                        template.changeChapter(props.id, title, text, changeNeed, changeDecision)
                    }} />
                    <img src={deleteImg} alt="delete" className="Create-chapters-input-button" onClick = {() => {
                        template.deleteChapter(props.id)
                    }} />
                </div>
                <div className={ hide ? "Create-chapters-section-body Create-chapter-hide-section" : "Create-chapters-section-body"}>
                    <textarea
                        value={text}
                        placeholder={localization.create.chapters.text}
                        className="Create-chapters-textarea-text"
                        rows={10}
                        onChange={value => {
                            setText(value.target.value)
                        }}
                    />
                </div>
                <div className={hide ? "Create-chapter-headline-block Create-chapter-hide-section" : "Create-chapter-headline-block"}>
                    {localization.create.chapters.need}
                </div>
                <div className={hide ? "Create-chapters-section-footer Create-chapter-hide-section" : "Create-chapters-section-footer"}>

                    {

                        need.map(need => {
                            const needParams = Object.assign(JSON.parse(JSON.stringify(need.props)), {"chapterId": props.id})
                            return <Need key={need.id} {...needParams}/>
                        })
                    }
                </div>
                <div className={hide ? "Create-chapters-section-footer Create-chapter-hide-section" : "Create-chapters-section-footer"}>
                    <div className="Create-chapters-decision-title-block">
                        <input type="text"
                               className="Create-chapters-decision-name"
                               placeholder={localization.create.chapters.decisionPlaceholder}
                               value={addDecisionTitle}
                               onChange={value => setAddDecisionTitle(value.target.value)}
                        />
                        <img src={addImg} alt="save" className="Create-chapters-decision-save" onClick = {() => {
                            let addDecision = decision

                            const counters = template.counter.map(counter => {
                                return{
                                    "name": counter.name,
                                    "count": 0
                                }
                            })

                            const id = v4()

                            addDecision.push({
                                id: id,
                                title: addDecisionTitle,
                                counters: counters
                            })

                            template.createDecision(props.id, id, addDecisionTitle).then()

                            setDecision(addDecision)
                            setAddDecisionTitle('')
                        }}/>
                    </div>
                    {
                        decision.map(decision => {
                            const decisionParams = Object.assign(decision, {"chapterId": props.id})
                            return <Decision key={decision.id} {...decisionParams} updateDecision={updateDecision}/>
                        })
                    }
                </div>
            </div>
        </div>
    )
});

export default Chapter;