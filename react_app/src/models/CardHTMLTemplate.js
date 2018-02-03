import React from 'react';

function CardHTMLTemplate(props) {
    return (
        <div className="w3-card">
            
            <div className="w3-container w3-right">
                <button onClick={props.resetContents}>
                    <i className="fa fa-plus-square-o fa-fw"></i>Add New Card
                </button>
            </div>
        
            <div className="w3-blue w3-center w3-container">
                <label style={{width:"70%", padding:"10px 5px 20px 5px"}}>
                    <input type="text" name="title" value={props.title} style={{width:"inherit"}}
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
        
            <div className="w3-container">
                <input type="submit" name="update" className="w3-input w3-center"
                    value={props.submitLabel} onClick={props.handleSubmit} 
                />
                
            </div>

        </div>
    )
}

export default CardHTMLTemplate;
