import React from 'react';

// Restaurant physical components
function RestaurantEntity(props) {
    const { data, isSelected, onClickHandler } = props;

    // Processing click event
    const handleClick = () => {
        onClickHandler(data.location);
    };

    // Style of restaurant entry
    const entryStyle = {
        display: "inline-block",
        padding: "10px",
        margin: "5px",
        border: "1px solid #ddd",
        borderRadius: "5px",
        cursor: "pointer",
        backgroundColor: isSelected ? '#e3f2fd' : 'white', // the color when choose
        transition: 'background-color 0.3s ease', // Add transition effect
    };

    return (
        <div style={entryStyle} onClick={handleClick}>
            {data.name} {isSelected && '✓'} {/* A checkmark is displayed when selected */}
        </div>
    );
}

function RestaurantList(props) {
    const { list, selectedLocations, onClickHandler } = props;

    const restaurantEntries = list.map((entry) => {
        const isSelected = selectedLocations.some(
            (location) =>
                location.lat === entry.location.lat &&
                location.lng === entry.location.lng
        );

        return (
            <RestaurantEntity
                key={entry.name} // Use the restaurant name as a unique key
                data={entry}
                isSelected={isSelected}
                onClickHandler={onClickHandler}
            />
        );
    });

    // Restaurant list container style
    const listStyle = {
        display: 'grid',
        gap: '8px', // Spacing between entries
        padding: '10px',
        border: '1px solid #ddd',
        borderRadius: '8px',
        backgroundColor: '#f9f9f9',
    };

    return (
        <div id="restaurant-list" style={listStyle}>
            {restaurantEntries}
        </div>
    );
}

export default RestaurantList;