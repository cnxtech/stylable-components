import * as React from 'react';
import {CheckBoxDemo} from "./components/checkbox-demo";
import { TreeViewDemo } from './components/tree-view-demo';
import { NumberInputDemo } from './components/number-input.demo';
import { BirthDatePickerDemo } from './components/birth-date-picker-demo';
import './style.st.css';
import '../src/style/default-theme/base.st.css';
import { RadioGroupDemo } from './components/radio-group-demo'

export class ComponentsDemo extends React.Component<{}, {}>{

    constructor() {
        super();
    }

    render() {
        return <div>
            <div>
                <h2>CheckBox</h2>
                <CheckBoxDemo />
            </div>
            <hr />
            <div>
                <h2>Birth date picker</h2>
                <BirthDatePickerDemo />
            </div>
            <div>
                <h2>TreeView</h2>
                <TreeViewDemo />
            </div>
            <hr />
            <div>
                <h2>Typography</h2>
                <table>
                    <tbody>
                    <tr>
                        <th>
                            <h1>H1</h1>
                        </th>
                        <th>
                            <h2>H2</h2>
                        </th>
                        <th>
                            <h3>H3</h3>
                        </th>
                        <th>
                            <h4>H4</h4>
                        </th>
                        <th>
                            <h5>H5</h5>
                        </th>
                        <th>
                            <h6>H6</h6>
                        </th>
                        <th>
                            <label>Label</label>
                        </th>
                        <th>
                            <p>paragraph</p>
                        </th>
                    </tr>
                    </tbody>
                </table>
            </div>
            <hr />
            <div>
                <h2>button</h2>
                <table>
                    <tbody>
                    <tr>
                        <th>
                            <button>Normal</button>
                        </th>
                        <th>
                            <button disabled >Disabled</button>
                        </th>
                        <th>
                            <a className="button" href="http://www.wix.com" target="_blank">Link</a>
                        </th>
                        <th>
                            <a className="button" href="http://www.wix.com" target="_blank">Disabled link</a>
                        </th>
                    </tr>
                    </tbody>
                </table>
            </div>
            <hr/>
            <div>
                <h2>anchor</h2>
                <table>
                    <tbody>
                    <tr>
                        <th>
                            <a href="http://www.wix.com" target="_blank">Normal</a>
                        </th>
                        <th>
                            <a href="http://www.wix.com" target="_blank">Disabled</a>
                        </th>
                    </tr>
                    </tbody>
                </table>
            </div>
            <hr />
            <div>
                <h2>input</h2>
                <table>
                    <tbody>
                    <tr>
                        <th>
                            <input placeholder="Placeholder"/>
                        </th>
                        <th>
                            <input placeholder="Disabled" disabled/>
                        </th>
                    </tr>
                    </tbody>
                </table>
            </div>
            <hr />
            <div>
                <h2>Radio Group</h2>
                <RadioGroupDemo/>
            </div>
            <hr />
            <div>
                <h2>NumberInput</h2>
                <NumberInputDemo />
            </div>
        </div>;
    }
}
