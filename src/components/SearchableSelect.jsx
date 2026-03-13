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
                    padding: "12px",
                    borderRadius: "8px",
                    border: "1px solid #ccc",
                    background: disabled ? "#f5f5f5" : "#fff",
                    cursor: disabled ? "not-allowed" : "pointer",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center"
                }}
            >
                <span style={{ color: value ? "#000" : "#757575" }}>
                    {value || placeholder}
                </span>
                <span style={{ fontSize: "12px" }}>▼</span>
            </div>

            {isOpen && (
                <div
                    className="searchable-select-dropdown"
                    style={{
                        position: "absolute",
                        top: "100%",
                        left: 0,
                        right: 0,
                        zIndex: 1000,
                        background: "#fff",
                        border: "1px solid #ccc",
                        borderRadius: "0 0 8px 8px",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                        maxHeight: "250px",
                        overflowY: "auto"
                    }}
                >
                    <input
                        type="text"
                        placeholder="Type to search..."
                        autoFocus
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{
                            width: "100%",
                            padding: "10px",
                            border: "none",
                            borderBottom: "1px solid #eee",
                            outline: "none",
                            boxSizing: "border-box",
                            position: "sticky",
                            top: 0,
                            background: "#fff"
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
                                        padding: "10px 12px",
                                        cursor: "pointer",
                                        transition: "background 0.2s"
                                    }}
                                    onMouseEnter={(e) => (e.target.style.background = "#f0f7f0")}
                                    onMouseLeave={(e) => (e.target.style.background = "transparent")}
                                >
                                    {option}
                                </div>
                            ))
                        ) : (
                            <div style={{ padding: "10px 12px", color: "#999" }}>No results found</div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default SearchableSelect;
