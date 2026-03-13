import React, { useState, useRef, useEffect } from "react";

const SearchableSelect = ({ options, placeholder, name, value, onChange, disabled }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Sync searchTerm with selected value when dropdown closes
    useEffect(() => {
        if (!isOpen) {
            setSearchTerm("");
        }
    }, [isOpen]);

    const filteredOptions = options.filter((option) =>
        option.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleSelect = (option) => {
        onChange({ target: { name, value: option } });
        setIsOpen(false);
        setSearchTerm("");
    };

    return (
        <div className="searchable-select-container" ref={dropdownRef} style={{ position: "relative", marginTop: "10px", width: "100%" }}>
            <div
                className={`searchable-select-display ${disabled ? "disabled" : ""}`}
                onClick={() => !disabled && setIsOpen(!isOpen)}
                style={{
                    padding: "12px 15px",
                    borderRadius: "10px",
                    border: isOpen ? "1px solid #4caf50" : "1px solid #ddd",
                    background: disabled ? "#f9f9f9" : "#fff",
                    cursor: disabled ? "not-allowed" : "pointer",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    boxShadow: isOpen ? "0 0 0 3px rgba(76, 175, 80, 0.1)" : "none",
                    transition: "all 0.3s"
                }}
            >
                <span style={{ color: value ? "#333" : "#999", fontSize: "1rem" }}>
                    {value || placeholder}
                </span>
                <span style={{ fontSize: "10px", color: "#666", transform: isOpen ? "rotate(180deg)" : "none", transition: "transform 0.3s" }}>▼</span>
            </div>

            {isOpen && (
                <div
                    className="searchable-select-dropdown"
                    style={{
                        position: "absolute",
                        top: "110%",
                        left: 0,
                        right: 0,
                        zIndex: 1000,
                        background: "#fff",
                        border: "1px solid #eee",
                        borderRadius: "12px",
                        boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
                        maxHeight: "250px",
                        overflowY: "auto",
                        padding: "5px"
                    }}
                >
                    <input
                        type="text"
                        placeholder="Search..."
                        autoFocus
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{
                            width: "100%",
                            padding: "10px 12px",
                            border: "none",
                            borderBottom: "1px solid #f0f0f0",
                            outline: "none",
                            boxSizing: "border-box",
                            position: "sticky",
                            top: 0,
                            background: "#fff",
                            fontSize: "0.9rem",
                            marginBottom: "5px"
                        }}
                    />
                    <div className="options-list">
                        {filteredOptions.length > 0 ? (
                            filteredOptions.map((option) => (
                                <div
                                    key={option}
                                    className="searchable-option"
                                    onClick={() => handleSelect(option)}
                                    style={{
                                        padding: "10px 15px",
                                        cursor: "pointer",
                                        borderRadius: "8px",
                                        fontSize: "0.95rem",
                                        transition: "background 0.2s, color 0.2s"
                                    }}
                                    onMouseEnter={(e) => {
                                        e.target.style.background = "#4caf50";
                                        e.target.style.color = "#fff";
                                    }}
                                    onMouseLeave={(e) => {
                                        e.target.style.background = "transparent";
                                        e.target.style.color = "#333";
                                    }}
                                >
                                    {option}
                                </div>
                            ))
                        ) : (
                            <div style={{ padding: "15px", color: "#999", textAlign: "center", fontSize: "0.9rem" }}>No results found</div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default SearchableSelect;
