import * as React from 'react';
import { DropDown } from '../../src';
import { DropDownItem } from '../../src/components/drop-down/drop-down';

export interface DropDownDemoState {
    selectedItem: DropDownItem | undefined;
}

export class DropDownDemo extends React.Component<{}, DropDownDemoState> {

    constructor() {
        super();
        this.state = {
            selectedItem: undefined
        };
    }

    public render() {
        return (
            <div>
                <h3>DropDown</h3>
                <section data-automation-id="DROP_DOWN_DEMO">
                    <DropDown selectedItem={this.state.selectedItem}/>
                </section>
            </div>
        );
    }
}
