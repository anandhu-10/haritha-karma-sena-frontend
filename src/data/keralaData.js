export const KERALA_DATA = {
    "Alappuzha": {
        "Municipality": {
            "Alappuzha": { wards: 52, areas: ["Vazhicherry", "Civil Station", "Beach Road"] },
            "Cherthala": { wards: 35, areas: ["Town West", "Railway Station", "Court Road"] },
            "Kayamkulam": { wards: 44, areas: ["Market", "KPAC Junction", "TOWN"] }
        },
        "Grama Panchayat": {
            "Ambalappuzha South": { wards: 18, areas: ["Poomala", "Kakkazhom"] },
            "Aryad": { wards: 21, areas: ["Avalookunnu", "Komady"] }
        }
    },
    "Ernakulam": {
        "Corporation": {
            "Kochi": { wards: 74, areas: ["Marine Drive", "Fort Kochi", "Edappally", "Vyttila"] }
        },
        "Municipality": {
            "Aluva": { wards: 26, areas: ["Pump Junction", "Bank Road", "Periyar Terrace"] },
            "Kalamassery": { wards: 42, areas: ["HMT", "Premier", "CUSAT Road"] },
            "Thrikkakara": { wards: 43, areas: ["Kakkanad", "NGO Quarters", "Infopark Road"] }
        },
        "Grama Panchayat": {
            "Mulavukad": { wards: 16, areas: ["Bolgatty", "Vallarpadam"] },
            "Vazhakulam": { wards: 20, areas: ["Marampally", "South Vazhakulam"] }
        }
    },
    "Kottayam": {
        "Municipality": {
            "Kottayam": { wards: 52, areas: ["Thirunakkara", "Kanjikuzhy", "Collectorate", "Nagampadam", "Muttambalam", "Kudamaloor"] },
            "Changanassery": { wards: 37, areas: ["Puzhavathu", "Perunna", "Vazhappally", "Market Junction", "Railway Station Road"] },
            "Pala": { wards: 26, areas: ["Lalam", "Puliyannoor", "Arunapuram", "Meenachil"] },
            "Vaikom": { wards: 26, areas: ["Kottayathukadavu", "West Gate", "Thekenada", "Market Road"] },
            "Ettumanoor": { wards: 35, areas: ["Peroor Junction", "Thellakom", "Athirampuzha Road", "Industrial Estate"] }
        },
        "Grama Panchayat": {
            "Athirampuzha": { wards: 22, areas: ["Ammanchery", "Sreekandamangalam", "Nattassery"] },
            "Akhalapuzha": { wards: 18, areas: ["Puthuppally", "Vakathanam"] },
            "Kumarakom": { wards: 16, areas: ["Boat Jetty", "Kavanattinkara", "Attamangalam"] },
            "Pampady": { wards: 20, areas: ["Kooroppada", "Velloor", "Meenadom"] },
            "Vijayapuram": { wards: 21, areas: ["Vadavathoor", "Manganam", "Kunnumpuram"] }
        }
    },
    "Idukki": {
        "Municipality": {
            "Thodupuzha": { wards: 35, areas: ["Vengalloor", "Mundan mudi", "Kolanikkavu"] },
            "Kattappana": { wards: 31, areas: ["Ambalakkavala", "New Market", "Kallukunnu"] }
        },
        "Grama Panchayat": {
            "Adimali": { wards: 19, areas: ["200 Acre", "Machiplavu"] },
            "Munnar": { wards: 21, areas: ["Old Munnar", "Mattupetty Road"] }
        }
    },
    "Thrissur": {
        "Corporation": {
            "Thrissur": { wards: 55, areas: ["Swaraj Round", "Pattalam Road", "East Fort", "Punkunnam"] }
        },
        "Municipality": {
            "Guruvayur": { wards: 43, areas: ["Temple Gate", "East Nada", "West Nada"] },
            "Chalakudy": { wards: 36, areas: ["South Chalakudy", "North Chalakudy", "Market Road"] }
        },
        "Grama Panchayat": {
            "Pudukkad": { wards: 18, areas: ["Thorekad", "Panampilly Nagar"] }
        }
    }
};

export const DISTRICTS = Object.keys(KERALA_DATA).sort();
