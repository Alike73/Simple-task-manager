import { Component } from "react";
import img1 from '../../Assets/1.svg';
import img2 from '../../Assets/2.svg';

class Planer extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isExpanded: false,
            isTooltipVisible: false,
            userInput: '',
            itemsList: [],
            warningMessage: '',
            currentItemIndex: null,
            crossedItems: [], // new state property to keep track of crossed items
            isMobile: false
        };
        this.crossedWord = this.crossedWord.bind(this);
    }

    // -----------------------------------------------
    componentDidMount() {
        // Retrieve items list from local storage
        const storedList = localStorage.getItem('itemsList');
        if (storedList) {
            this.setState({ itemsList: JSON.parse(storedList) });
        }
        // Add event listener to detect screen width changes
        window.addEventListener("resize", this.handleScreenWidth);
        // Initial check for screen width
        this.handleScreenWidth();
    }

    componentWillUnmount() {
        // Remove event listener when component is unmounted
        window.removeEventListener("resize", this.handleScreenWidth);
    }
    // Changing state when screen resize
    handleScreenWidth = () => {
        const isMobile = window.innerWidth < 767;
        this.setState({ isMobile });
    };

    onChangeEvent(e) {
        this.setState({ userInput: e });
    }

    addItem(input) {
        if (input === '') {
            this.setState({ warningMessage: 'Please, enter your task first!' });
            setTimeout(() => {
                this.setState({ warningMessage: '' });
            }, 3000);
            return;
        }

        let listArray = this.state.itemsList;
        if (this.state.currentItemIndex !== null) {
            // Update existing item
            listArray[this.state.currentItemIndex] = input;
            this.setState({ itemsList: listArray, userInput: '', currentItemIndex: null }, () => {
                // Save the updated grocery list to local storage
                localStorage.setItem('itemsList', JSON.stringify(listArray));
            });
        } else {
            // Add new item
            listArray.push(input);
            this.setState({ itemsList: listArray, userInput: '' }, () => {
                // Save the updated grocery list to local storage
                localStorage.setItem('itemsList', JSON.stringify(listArray));
            });
        }
    }

    editItem(index) {
        const currentItem = this.state.itemsList[index];
        this.setState({ userInput: currentItem, currentItemIndex: index });
        document.getElementById('modalEditor').classList.add('show'); // Show the modal
    }

    handleKeyPress(e) {
        if (e.key === "Enter") {
            if (this.state.currentItemIndex !== null) {
                this.addItem(this.state.userInput);
            } else {
                this.addItem(this.state.userInput);
            }
        }
    }

    deleteItem() {
        let listArray = [];
        this.setState({ itemsList: listArray }, () => {
            // Clear the grocery list from local storage
            localStorage.removeItem('itemsList');
        });
    }

    deleteItemAtIndex(index) {
        const listArray = this.state.itemsList;
        listArray.splice(index, 1);
        this.setState({ itemsList: listArray }, () => {
            // Save the updated grocery list to local storage
            localStorage.setItem('itemsList', JSON.stringify(listArray));
        });
    }

    crossedWord(eOrIndex) {
    if (typeof eOrIndex === 'number') {
        // If index parameter is provided
        const crossedItems = [...this.state.crossedItems];
        const itemIndex = crossedItems.indexOf(eOrIndex);

        if (itemIndex > -1) {
        crossedItems.splice(itemIndex, 1);
        } else {
        crossedItems.push(eOrIndex);
        }

        this.setState({ crossedItems });
        } else {
            // If event object is provided
            const li = eOrIndex.target.closest('li');
            li.classList.toggle('crossed');
        }
    }

    // -----------------------------------------------
    
    toggleInputExpansion = () => {
        this.setState((prevState) => ({
            isExpanded: !prevState.isExpanded
        }));
    };

    showTooltip = () => {
        this.setState({
            isTooltipVisible: true
        });
    };
    
    hideTooltip = () => {
        this.setState({
            isTooltipVisible: false
        });
    };

    render () {
        const { isExpanded, isTooltipVisible, warningMessage, crossedItems, isMobile } = this.state;

        return (
            <div className="px-4 py-5">
            {/* ---Modal-PopUp-Editor--- */}
                <div className="modal fade" id="modalEditor" tabIndex="-1" aria-labelledby="modalEditorLabel" aria-hidden="true">
                    <div className={ isMobile ? 'modal-dialog modal-lg' : 'modal-dialog modal-lg modal-dialog-centered' }>
                        <div className="modal-content">
                            <div className="modalCloseBtnBox">
                                <button className="btn btn-primary rounded-circle p-2 lh-1 closeEditorBtn" type="button" data-bs-dismiss="modal">
                                    <i className="bi bi-x-lg"></i>
                                    <span className="visually-hidden">Dismiss</span>
                                </button>
                                <div className="WarningBox w-100">
                                    { warningMessage && <p className="lead warningMessage text-center fs-3">{warningMessage}</p> }
                                </div>
                            </div>
                            <div className="modal-body d-flex align-items-end py-5">
                                <input 
                                    className={`form-control form-control-lg modalInput ${isExpanded ? 'expanded' : ''}`} 
                                    type="text" 
                                    placeholder="Click here & type your task... ☟" 
                                    aria-label=".form-control-lg example" 
                                    onChange={(e) => { this.onChangeEvent(e.target.value) }}
                                    onKeyDown={(e) => {
                                        this.handleKeyPress(e);
                                    }}
                                    value={this.state.userInput}
                                />
                                <div
                                    className="bi-pen-wrapper"
                                    onMouseEnter={this.showTooltip}
                                    onMouseLeave={this.hideTooltip}
                                >
                                    <i className="bi bi-pen text-danger fs-3" onClick={this.toggleInputExpansion} />
                                    {isTooltipVisible && (
                                    <div className="tooltip">
                                        {isExpanded ? 'Close me' : 'Open me'}
                                    </div>
                                    )}
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button 
                                    type="button" 
                                    className="btn btn-primary me-auto"
                                    onClick={() => this.addItem(this.state.userInput)}
                                    >
                                    Add task
                                </button>
                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                            </div>
                        </div>
                    </div>
                </div>
            {/* ------------------------ */}
                <div className="container col-xxl-8 px-4 py-5">
                    <div className="row flex-lg-row-reverse justify-content-center g-5 py-5">
                        <h1 className="display-3 Title lh-1 mb-3">
                            SIMPLE TASK MANAGER
                        </h1>
                        <div className="col-10 col-sm-8 col-lg-6">
                            <img src={img1} className="d-block mx-lg-auto img-fluid img1" alt="To do list logo" width="700" height="500" loading="lazy" />
                        </div>
                        <div className="col-lg-6 px-0">
                            <p className="subTitle fs-3">
                                Click plus+ button to start writing your task
                            </p>
                            
                            <button 
                                className="btn btn-outline-primary d-block rounded-circle mx-auto my-5 p-3 lh-1 addBtn" 
                                type="button" 
                                data-bs-toggle="modal" 
                                data-bs-target="#modalEditor"
                                
                                >
                                <i className="bi bi-plus-lg fs-3" />
                                <span className="visually-hidden">Dismiss</span>
                            </button>
                            {/* --------------------------Items-List--------------------------------------- */}
                            <ol className="square">
                                {this.state.itemsList.map((item, index) => {
                                const isCrossed = crossedItems.includes(index);
                                return (
                                        <li key={index} onClick={() => this.crossedWord(index)} className={isCrossed ? 'crossed' : ''}>
                                            {item}
                                            <span>
                                                {!isCrossed && (
                                                    <i
                                                        className="bi bi-pencil text-success fs-5 ps-2"
                                                        onClick={() => this.editItem(index)}
                                                        data-bs-toggle="modal" 
                                                        data-bs-target="#modalEditor"
                                                    />
                                                )}
                                                {isCrossed && (
                                                    <i
                                                        className="bi bi-x-octagon text-danger fs-5 ps-2"
                                                        onClick={() => this.deleteItemAtIndex(index)}
                                                    />
                                                )}
                                            </span>
                                        </li>
                                    );
                                })}
                            </ol>
                            {/* --------------------------------------------------------------------------- */}
                            
                            <button 
                                className="btn btn-outline-primary rounded-circle d-block mx-auto mt-5 p-3 lh-1 deleteAllBtn" 
                                type="button"
                                onClick={() => this.deleteItem()}
                                >
                                <i className="bi bi-x-lg fs-3"></i>
                                <span className="visually-hidden">Dismiss</span>
                                <span className="tooltip-text">Delete all tasks</span>
                            </button>
                            
                            <div className="bottomImgBox mt-5">
                                <img src={img2} className="d-block mx-lg-auto img-fluid img2" alt="To do illustration" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Planer;