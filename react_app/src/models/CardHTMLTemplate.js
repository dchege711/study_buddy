function CardHTMLTemplate(props) {
    return (
        <div className="w3-card">
            <header className="w3-container w3-blue">
                <h5>{props.title}</h5>
            </header>
        
            <label>Description
                <input type="text" name="description" value={props.description}
                onChange={props.handleInputChange} />
            </label>
        
            <label>Urgency
                <input type="number" name="urgency" 
                value={props.urgency} onChange={props.handleInputChange} />
            </label>
        
            <input type="submit" name="update" value="Update" 
                onChange={props.handleSubmit} />
        
        
        </div>
    )
}

export default CardHTMLTemplate;
