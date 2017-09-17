import React = require('react');
import ReactDOM = require('react-dom');
import {ClientRenderer, DriverBase, expect, waitFor} from 'test-drive-react';
import {PopupDemo} from '../../demo/components/popup-demo';
import {Popup, PopupPositionPoint} from '../../src/components/';
import {PopupTestDriver} from '../../test-kit/components/popup-driver';
import {sleep} from '../utils';

export class PopupDemoTestDriver extends DriverBase {
    public static ComponentClass = PopupDemo;
    public popup: PopupTestDriver;

    constructor(public readonly instance: PopupDemo) {
        super(() => ReactDOM.findDOMNode(instance));
        this.popup = new PopupTestDriver(instance.getPopup()!);
    }

    public get container(): HTMLDivElement {
        return this.select('POPUP_DEMO_DIV');
    }
}

describe('<Popup />', function() {
    const clientRenderer = new ClientRenderer();
    let anchor: HTMLElement;

    before(() => {
        anchor = document.body.appendChild(document.createElement('div'));
        anchor.style.position = 'absolute';
        anchor.style.top = '150px';
        anchor.style.left = '150px';
        anchor.style.width = '150px';
        anchor.style.height = '150px';
        anchor.style.border = '1px solid blue';
    });
    afterEach(function() {clientRenderer.cleanup(); });
    after(() => {document.body.removeChild(anchor); });

    describe('The popup user', function() {
        it('clicks on the parent and the popup opens and closes after another click', async function() {
            const {result, waitForDom} = clientRenderer.render(<PopupDemo />);

            let popupDemo = new PopupDemoTestDriver(result as PopupDemo);

            await waitForDom(() => {
                expect(popupDemo.container).to.be.present();
                expect(popupDemo.popup.isPresent).to.equal(false);
            });

            popupDemo.container.click();
            popupDemo = new PopupDemoTestDriver(result as PopupDemo);
            await waitForDom(() => expect(popupDemo.popup.root).to.be.present());

            popupDemo.container.click();
            return waitForDom(() => expect(popupDemo.popup.isPresent).to.equal(false));
        });
    });

    it('displays the popup and renders its children if the open prop is given', function() {
        const {result} = clientRenderer.render(
            <Popup anchor={anchor} open>
                <span>Popup Body</span>
            </Popup>
        );

        const popup = new PopupTestDriver(result as Popup);

        return waitFor(() => {
            expect(popup.root).to.be.present();
            expect(popup.content[0]).to.be.present();
        });
    });

    it('does not render the popup if there is no anchor', async function() {
        const {result} = clientRenderer.render(
            <Popup anchor={null} open>
                <span>Popup Body</span>
            </Popup>
        );
        await sleep(100);

        const popup = new PopupTestDriver(result as Popup);
        await waitFor(() => expect(popup.isPresent).to.equal(false));
    });

    it('does not render the popup if the open prop is false', async function() {
        const {result} = clientRenderer.render(
            <Popup anchor={anchor}>
                <span data-automation-id="SPAN">Popup Body</span>
            </Popup>
        );
        await sleep(100);

        const popup = new PopupTestDriver(result as Popup);
        await waitFor(() => expect(popup.isPresent).to.equal(false));
    });

    it('removes the component when unmounting', async function() {
        const {result} = clientRenderer.render(
            <Popup
                anchor={anchor}
                open
            >
                <span data-automation-id="SPAN">Popup Body</span>
            </Popup>);

        const popup = new PopupTestDriver(result as Popup);

        await waitFor(() => {expect(popup.root).to.be.present(); });
        ReactDOM.unmountComponentAtNode(popup.root!.parentElement!);
        return waitFor(() => {expect(popup.root).to.not.exist; });
    });

    it('syncs the popup width', function() {
        const {result} = clientRenderer.render(
            <Popup
                anchor={anchor}
                syncWidth={true}
                open
            >
                <span data-automation-id="SPAN">Popup Body</span>
            </Popup>);

        const popup = new PopupTestDriver(result as Popup);
        return waitFor(() => {
            expect(popup.root.getBoundingClientRect().width)
                .to.equal(anchor.getBoundingClientRect().width);
        });
    });

    it('sets the default maxHeight', function() {
        const {result} = clientRenderer.render(
            <Popup
                anchor={anchor}
                open
            >
                <span data-automation-id="SPAN">Popup Body</span>
            </Popup>);

        const popup = new PopupTestDriver(result as Popup);
        return waitFor(() => {
            expect(popup.root.style.maxHeight).to.equal('500px');
        });
    });

    it('sets and enforces the maxHeight', function() {
        const {result} = clientRenderer.render(
            <Popup
                anchor={anchor}
                maxHeight={5}
                open
            >
                <span data-automation-id="SPAN">Popup Body</span>
            </Popup>);

        const popup = new PopupTestDriver(result as Popup);
        return waitFor(() => {
            expect(popup.root.style.maxHeight).to.equal('5px');
            expect(popup.root.getBoundingClientRect().height).to.equal(5);
        });
    });

    describe('Scrolling tests', function() {
        const scroll = document.createElement('div');
        scroll.style.height = '5000px';
        scroll.style.width = '5000px';

        before(() => {document.body.appendChild(scroll); });

        after(() => {
            document.body.removeChild(scroll);
            document.body.scrollTop = 0;
            document.body.scrollLeft = 0;
        });

        it('renders the popup in the right location when it is out of view', async function() {
            let div: HTMLDivElement;
            const {waitForDom} = clientRenderer.render(
                <div>
                    <div style={{height: '1000px'}}>Filler</div>
                    <div ref={(elem: HTMLDivElement) => div = elem}>Anchor</div>
                </div>
            );

            await waitForDom(() => {
                expect(div).to.be.present();
            });
            document.body.scrollTop = 500;
            document.body.scrollLeft = 500;
            const {result} = clientRenderer.render(
                <Popup
                    anchor={div!}
                    open
                >
                    <span data-automation-id="SPAN">Popup Body</span>
                </Popup>);

            const popup = new PopupTestDriver(result as Popup);
            return waitForDom(() => {
                expect([div, popup.root]).to.be.inVerticalSequence();
            });
        });
    });

    describe('Layout tests', function() {
        const fixture = getFixture();

        for (const popupPos of fixture) {
            for (const anchorPos of fixture) {
                it(`Popup position: V: ${popupPos.vertical} H: ${popupPos.horizontal};
                 Anchor position: V: ${anchorPos.vertical} H: ${anchorPos.horizontal}`, function() {
                    const {result} = clientRenderer.render(
                        <Popup anchor={anchor} anchorPosition={anchorPos} popupPosition={popupPos} open>
                            <div style={{background: 'green', color: 'white'}}>
                                    <span data-automation-id="SPAN">
                                        Popup Body
                                    </span>
                                <div>some more stuff</div>
                            </div>
                        </Popup>);

                    const popup = new PopupTestDriver(result as Popup);
                    return waitFor(() => runTest(popup.root, anchor, popupPos, anchorPos));
                });
            }
        }
    });
});

function getLayoutTest(axis: 'vertical' | 'horizontal') {
    let start: 'left' | 'top' = 'top';
    let end: 'bottom' | 'right' = 'bottom';
    let length: 'height' | 'width' = 'height';

    if (axis === 'horizontal') {
        start = 'left';
        end = 'right';
        length = 'width';
    }

    // Level one: popup position, level two: anchor position
    return {
        [start]: {
            [start]: (anchor: HTMLElement, popup: HTMLElement) =>
                createExpect(popup.getBoundingClientRect()[start], anchor.getBoundingClientRect()[start]),
            center: (anchor: HTMLElement, popup: HTMLElement) => {
                const anchorRect = anchor.getBoundingClientRect();
                createExpect(popup.getBoundingClientRect()[start], anchorRect[start] + (anchorRect[length] / 2)); },
            [end]: (anchor: HTMLElement, popup: HTMLElement) =>
                createExpect(popup.getBoundingClientRect()[start], anchor.getBoundingClientRect()[end])
        },
        center: {
            [start]: (anchor: HTMLElement, popup: HTMLElement) => {
                const popupRect = popup.getBoundingClientRect();
                createExpect(popupRect[start], anchor.getBoundingClientRect()[start] - (popupRect[length] / 2)); },
            center: (anchor: HTMLElement, popup: HTMLElement) => {
                const popupRect = popup.getBoundingClientRect();
                const anchorRect = anchor.getBoundingClientRect();
                createExpect(popupRect[start], anchorRect[start] + (anchorRect[length] / 2) - (popupRect[length] / 2));
            },
            [end]: (anchor: HTMLElement, popup: HTMLElement) => {
                const popupRect = popup.getBoundingClientRect();
                createExpect(popupRect[end], anchor.getBoundingClientRect()[end] + (popupRect[length] / 2)); }
        },
        [end]: {
            [start]: (anchor: HTMLElement, popup: HTMLElement) =>
                createExpect(popup.getBoundingClientRect()[end], anchor.getBoundingClientRect()[start]),
            center: (anchor: HTMLElement, popup: HTMLElement) => {
                const anchorRect = anchor.getBoundingClientRect();
                createExpect(popup.getBoundingClientRect()[end], anchorRect[start] + (anchorRect[length] / 2)); },
            [end]: (anchor: HTMLElement, popup: HTMLElement) =>
                createExpect(popup.getBoundingClientRect()[end], anchor.getBoundingClientRect()[end])
        }
    };
}

function runTest(popup: HTMLElement, anchor: HTMLElement, popupPos: PopupPositionPoint, anchorPos: PopupPositionPoint) {
    const topTests = getLayoutTest('vertical');
    const leftTests = getLayoutTest('horizontal');

    topTests[popupPos.vertical][anchorPos.vertical](anchor, popup);
    leftTests[popupPos.horizontal][anchorPos.horizontal](anchor, popup);
}

function getFixture(): PopupPositionPoint[] {
    return [{vertical: 'top', horizontal: 'left'},
        {vertical: 'top', horizontal: 'center'},
        {vertical: 'top', horizontal: 'right'},
        {vertical: 'center', horizontal: 'left'},
        {vertical: 'center', horizontal: 'center'},
        {vertical: 'center', horizontal: 'right'},
        {vertical: 'bottom', horizontal: 'left'},
        {vertical: 'bottom', horizontal: 'center'},
        {vertical: 'bottom', horizontal: 'right'}];
}

function createExpect(pValue: number, aValue: number) {
    expect(pValue, `popup value: ${pValue} anchor value: ${aValue}`).to.be.closeTo(aValue, 0.01);
}
