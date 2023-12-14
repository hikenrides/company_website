import React from "react";

const DropDownProfile = () => {
    return (
        <div className="flex flex-col dropDownProfile">
            <ul className="flex flex-col gap-4">
                <li>Profile</li>
                <li>My Bookings</li>
                <li>My trip offers</li>
                <li>my trip requests</li>
            </ul>
        </div>
    )
}

export default DropDownProfile