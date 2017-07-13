import * as React from 'react';
import { TreeView } from '../src';
import { TreeItemData } from '../src/components/tree-view/tree-view';

interface TreeViewDemoState {
    selectedItem: Object;
}

export const treeData: TreeItemData[] = [
    { label: 'Food Menu', children: [
        { label: 'Salads', children: [
            { label: 'Greek Salad' },
            { label: 'Israeli Salad' },
            { label: 'Caesar Salad' }
        ]},
        { label: 'Steaks', children: [
            { label: 'Fillet Steak' },
            { label: 'Sirloin Steak' }
        ]},
        { label: 'Desserts', children: [
            { label: 'Pancake' },
            { label: 'Muffin' },
            { label: 'Waffle' },
            { label: 'Cupcake' }
        ]}
    ]}
];


function SelectedItem({selectedItem}: any) {
    return <div style={{'font-size': '1.41em', 'text-decoration': 'underline'}}>{selectedItem.label ?
                  (!selectedItem.children ? `You chose ${selectedItem.label}. Bon appetit!` :
                  `You are looking at ${selectedItem.label}. Please choose a dish.`) :
                  'Please choose from the Menu!'}</div>
}

export class TreeViewDemo extends React.Component<{}, TreeViewDemoState>{

    constructor() {
        super();
        this.state = {
            selectedItem: {}
        };
    }

    onSelectItem = (item: Object) => {
        this.setState({selectedItem: item});
    };

    render() {
        return (
            <div>
                <h3>Default TreeView with data only</h3>
                <TreeView dataSource={treeData} />
                <br/>
                <h3>TreeView with ability to select a child</h3>
                <section data-automation-id="TREE_VIEW_DEMO">
                    <SelectedItem selectedItem={this.state.selectedItem}/>
                    <br/>
                    <TreeView dataSource={treeData} onSelectItem={this.onSelectItem}
                              selectedItem={this.state.selectedItem} />
                </section>
            </div>
        )
    }
}
