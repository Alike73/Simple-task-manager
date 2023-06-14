
import React, { useState, useEffect } from "react";

const ShowAddBtn = () => {
    const [showAddBtn, setShowAddBtn] = useState(false);
    useEffect(() => {
        window.addEventListener("scroll", () => {
            if (window.scrollY > 400) {
                setShowAddBtn(true);
            } else {
                setShowAddBtn(false);
            }
        });
    }, []);
    
    return (
        <div>
            <div className="top-to-btn">
                {" "}
                {showAddBtn && (
                    <button 
                        className="btn btn-outline-primary d-block rounded-circle mx-auto my-5 p-3 lh-1 icon-position icon-style addBtn" 
                        type="button" 
                        data-bs-toggle="modal" 
                        data-bs-target="#modalEditor"
                        
                        >
                        <i className="bi bi-plus-lg fs-3" />
                        <span className="visually-hidden">Dismiss</span>
                    </button>
                )}{" "}
            </div>
        </div>
    );
};
export default ShowAddBtn;