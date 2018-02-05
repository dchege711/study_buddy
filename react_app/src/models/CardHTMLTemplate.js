import React from 'react';

function CardHTMLTemplate(props) {
    return (
        <div className="w3-card">
            
            <div className="w3-container w3-right">
                <button className="w3-btn w3-hover-white" onClick={props.resetContents}>
                    <b><i className="fa fa-plus-square-o fa-fw"></i>Add New Card</b>
                </button>
            </div>
        
            <div className="card-header w3-center w3-container" style={{padding:"1% 20% 1% 20%"}}>
                <label className="input-area-padded">
                    <input type="text" name="title" value={props.title}
                    className="w3-input w3-threequarter" onChange={props.handleInputChange} />
                </label>
            </div>
            
            <div className="w3-container">
        
                <label className="input-area"><strong>Description</strong>
                    <textarea name="description" value={props.description}
                    className="w3-input" onChange={props.handleInputChange} />
                </label>
                
                <br />
                
                <label className="input-area"><strong>Tags</strong>
                    <textarea name="tags" value={props.tags}
                    className="w3-input" onChange={props.handleInputChange} />
                </label>
                
                <br />
            
                <label className="input-area"><strong>Urgency</strong>
                    <input type="number" name="urgency" className="w3-input" 
                    value={props.urgency} onChange={props.handleInputChange} />
                </label>    
            </div>
            
            <div className="w3-bar w3-padding-16">
                <button className="w3-left w3-btn w3-round-xxlarge w3-border-blue"
                    onClick={props.fetchPreviousCard}>
                    <b><i className="fa fa-chevron-left"></i> Previous</b>
                </button>
                
                <button className="w3-right w3-btn w3-round-xxlarge w3-border-blue"
                    onClick={props.fetchNextCard}>
                    <b><i className="fa fa-chevron-right"></i> Next</b>
                </button>
                
            </div>
        
            <div className="w3-container" style={{padding:"1% 30% 1% 30%"}}>
                
                <input type="submit" name="update"  
                    className="w3-input w3-center study-buddy-theme-color" value={props.submitLabel} 
                    onClick={props.handleSubmit} 
                />
            </div>

        </div>
    )
}

export default CardHTMLTemplate;
