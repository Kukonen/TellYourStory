import React from 'react';
import './Counters.scss'
import {observer} from "mobx-react-lite";
import {useState} from "react";
import addIcon from '../../../Images/add.svg'
import template from '../../../Store/TemplateState'
import Counter from './Counter'
import localizationState from "../../../Store/LocalizationState";

const Counters = observer(() => {
    const localization = localizationState.text

    const [name, setName] = useState('')
    const [count, setCount] = useState(0)

    let counters = []

    counters = template.counter

    let counterList = []

    counterList = counters.map(counter => {
            return (
                <Counter key={counter.id} {... {
                    ...counter
                }}/>
            )
        })


    return (
        <div>
            <div className="Create-counters-add">
                <div className="Create-counters-add-input">
                    <input type="text" className="Create-counters-add-input-name"
                           onChange={value => setName(value.target.value)}
                           value={name}
                           placeholder={localization.create.counters.addName}
                    />
                    <input type="number" className="Create-counters-add-input-count"
                           onChange={value => setCount(value.target.value)}
                           value={count}
                           placeholder={localization.create.counters.addCount}
                    />
                    <img alt="add" className="Create-counters-add-input-button" src={addIcon}
                         onClick={() => {
                             template.createCounter(name, count)
                             setName('')
                             setCount(0)
                         }} />
                </div>
            </div>
            <div className="Create-counter-list">
                <div>
                    <div className="Create-counter-list-headline-block">
                        <div className="Create-counter-list-headline">
                            {localization.create.counters.counterListHeadline}
                        </div>
                    </div>
                    {Array.isArray(counterList) ? counterList : null}
                </div>
            </div>
        </div>
    )
});

export default Counters;