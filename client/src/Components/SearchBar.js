import React from "react"

class SearchBar extends React.Component {
    constructor(){
        super()
        this.onFormSubmit = this.onFormSubmit.bind(this)
        this.onKeyPress = this.onKeyPress.bind(this)
        this.renderSearch = this.renderSearch.bind(this)
        this.renderNominations = this.renderNominations.bind(this)
        this.handleClick = this.handleClick.bind(this)
        this.displayBanner = this.displayBanner.bind(this)
        this.handleRemove = this.handleRemove.bind(this)
        this.closePopup = this.closePopup.bind(this)
        this.confirmNominations = this.confirmNominations.bind(this)
        this.openPopup = this.openPopup.bind(this)
        this.setTheState = this.setTheState.bind(this)
        this.getPopupContent = this.getPopupContent.bind(this)

        this.state = {
            searchTerm: "",
            searchResults: [],
            nominationList: []
        }
    }

    onKeyPress(event) {
        if(event.which === 13) {
            this.onFormSubmit(event)
        }
    }

    openPopup() {
        document.getElementById("popup").className = "modal"
    }

    closePopup(event) {
        document.getElementById("popup").className = "noDisplayClass"
    }

    makeApiCall(url) {
        return fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error("HTTP status " + response.status);
                }
                return response.json();
            })
    }


    onFormSubmit(event) {
        event.stopPropagation()
        event.preventDefault()

        let term =  event.target.value
        this.makeApiCall(`http://localhost:5000/get_movies?searchTerm=${term}`).then((response => {
            console.log(response)
            this.setTheState(term,response)
        })).catch(() => {
                this.setTheState(term,[])
            }
        )
    }

    setTheState(term, responseData) {
        this.setState({
            ...this.state,
            searchTerm: term,
            searchResults: responseData
        })
    }

    displayBanner(bannerText) {
        alert(bannerText)
    }

    confirmNominations(){
        if(this.state.nominationList.length > 5) {
            this.displayBanner("Sorry, You can only nominate 5 movies.")
        }
        else{
            //this.render()
            console.log("triggered")
            this.openPopup()
        }
    }

    handleRemove({target}) {
        console.log(target)
        var nominations = this.state.nominationList.filter(e => e.imdbID !== target.id)
        this.setState({
            ...this.state,
            nominationList: nominations
        })
    }
    handleClick({target}){
        console.log(target)
        if(this.state.nominationList.length === 5){
            this.displayBanner("Only 5 nominations allowed!")
        }
        else {
            var nominations = this.state.nominationList
            var n = this.state.searchResults.filter(e => e.imdbID === target.id)
            nominations.push(n[0])
                this.setState({
                    ...this.state,
                    nominationList: nominations
                })
                console.log(this.state.nominationList)
            }
    }

    renderSearch(){
        if(this.state.searchResults.length === 0 && this.state.searchTerm.length !== 0){
            return (
                <li className="no-list list-item">No such movie</li>
            )
        }
        else {
            return (
                this.state.searchResults.map(res => {
                    return (
                        <li key={res.imdbID} id={`${res.imdbID}_li`} className="list-item">
                            {res.Title}
                            &nbsp;
                            ({res.Year})
                            &nbsp;
                            <button id={res.imdbID} onClick={this.handleClick} className="nominate-button"
                                    disabled={this.state.nominationList.includes(res)}>Nominate
                            </button>
                        </li>
                    )
                })
            )
        }
    }

    renderNominations(){
        if(this.state.nominationList.length === 0){
            return (
                <li className="no-list list-item">No nominations yet</li>
            )
        }
        else {
            return (
                this.state.nominationList.map(nomin => {
                    return (
                        <li key={`${nomin.imdbID}_nom`} className="list-item">
                            {nomin.Title}
                            &nbsp;
                            ({nomin.Year})
                            &nbsp;
                            <button id={nomin.imdbID} onClick={this.handleRemove} className="remove-button"
                                    disabled={!this.state.nominationList.includes(nomin)}>Remove
                            </button>
                        </li>
                    )
                })
            )
        }
    }

    getPopupContent(){
        if(this.state.nominationList.length > 0){
            return (
                <>
                    <h6>Success!! <br/> You have nominated {this.state.nominationList.length} movies, Thanks for your nominations!</h6>
                    <button className="popup_button" onClick={this.closePopup}>OK</button>
                </>
            )
        }
        else{
            return (
                <>
                    <h6>No nominations yet, Please nominate upto 5 movies</h6>
                    <button className="popup_button" onClick={this.closePopup}>OK</button>
                </>
            )
        }
    }
    render() {
       // console.log(this.state.searchResults)
        return (
            <div className="row movie-search-section">
                <div className="row movie-search-bar">
                    <form onSubmit={this.onFormSubmit}>
                        <div className="movie-title">Movie Title</div>
                        <i className="fa fa-search icon" aria-hidden="true"></i>
                        <input className="col-12 col-s-12 search-text" type="text" name="searchTerm" id="searchTerm" onKeyPress={this.onKeyPress}/>
                    </form>
                </div>
                <div className="row">
                    <div className="movie-search-results col-4 col-s-4">
                        <div className="result-title">
                            Results for "{this.state.searchTerm}"
                        </div>
                            <ul className="search-result-list">
                                {this.renderSearch()}
                            </ul>
                    </div>

                    <div className="movie-nomination col-4 col-s-4">
                        <div className="nomination-title">
                            Your Nominations are:
                        </div>
                        <div>
                            <ul className="nomination-list">
                                {this.renderNominations()}
                            </ul>
                        </div>
                        <br/>
                        <button id="confirm-button" className="confirm-button" onClick={this.confirmNominations}>Confirm Nominations</button>
                    </div>
                </div>
                <div id="popup" className={this.state.nominationList.length===5?'modal':'noDisplayClass'}>
                    <div className="modal_content">
                        {this.getPopupContent()}
                    </div>
                </div>
            </div>
        )
    }
}

export default SearchBar