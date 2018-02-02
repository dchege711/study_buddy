import React from 'react';

function CardHTMLTemplate(props) {
    return (
        <div className="w3-card">
            <header className="w3-container w3-blue">
                <h5>{props.title}</h5>
            </header>
        
            <label>Description
                <textarea name="description" value={props.description}
                onChange={props.handleInputChange} />
            </label>
        
            <label>Urgency
                <input type="number" name="urgency" 
                value={props.urgency} onChange={props.handleInputChange} />
            </label>
        
            <input type="submit" name="update" value={props.submitLabel} 
                onClick={props.handleSubmit} />
                
            <button className="w3-button w3-aqua" value="+" 
                onClick={props.resetContents} />

        </div>
    )
}

export default CardHTMLTemplate;
