// Database Simulation using LocalStorage for Art Gallery Project

(function() {
    // Initial datasets
    const defaultSocialMedia = {
        facebook: "https://www.facebook.com/art_gallery_rkrathod",
        twitter: "https://www.twitter.com/art_gallery_rkrathod",
        linkedin: "https://www.linkedin.com/art_gallery",
        insta: "https://www.instagram.com/art_gallery"
    };

    const defaultReachUs = {
        nm: "Marwadi Education Foundation",
        add1: "Rajkot-Morbi Highway",
        add2: "",
        city: "Rajkot",
        state: "Gujarat",
        zipcode: "363641",
        contact_no: "8000898273"
    };

    const defaultPages = {
        about_us: "An art gallery exhibits the works of many artists. Each artist is given a specified space on the online webpage. The artists are charged for the space allotted to them on daily basis. The charges vary in different months. Jan to April and August to December the charges are Rs 200 per day per exhibit, from May to July charges are Rs 300 per day per exhibit. Each exhibit has a name and style of painting. The exhibits can be bought by the online customers who need to register with the art gallery. On receiving the full payment, the painting is sent to the customer. The system keeps track of the status of delivery of the painting to the customer. This status can also be seen by the customer. The gallery also stores the information about the visitors of the gallery who need not register with the art gallery website. For visitors only email id of the visitor is asked. Every month a complete information of business through online site is created for the artists as well as for the site promoters."
    };

    const defaultSlider = [
        { id: 1, img_nm: "Slider1.jpg", path: "images/Slider1.jpg" },
        { id: 2, img_nm: "SliderDesert.jpg", path: "images/SliderDesert.jpg" },
        { id: 3, img_nm: "SliderHydrangeas.jpg", path: "images/SliderHydrangeas.jpg" },
        { id: 4, img_nm: "SliderLighthouse.jpg", path: "images/SliderLighthouse.jpg" }
    ];

    const defaultAdmins = [
        { id: 1, full_nm: "Ravi Rathod", username: "admin@admin.com", password: "12345" }
    ];

    const defaultArts = [
        { id: 1, title: "Taj Mahal", price: 250, img: "images/Taj Mahal.jpeg", desc: "Oil painting of Taj Mahal" },
        { id: 2, title: "Mona Lisa", price: 300, img: "images/Mona Lisa.png", desc: "Fine reproduction of Mona Lisa" },
        { id: 3, title: "Krishna with Gopi's", price: 400, img: "images/Krishna with Gopi's.Jpg", desc: "Traditional depiction of Lord Krishna" }
    ];

    // LocalStorage helper functions
    function getJSON(key, defaultValue) {
        const val = localStorage.getItem(key);
        if (!val) {
            localStorage.setItem(key, JSON.stringify(defaultValue));
            return defaultValue;
        }
        try {
            return JSON.parse(val);
        } catch(e) {
            return defaultValue;
        }
    }

    function setJSON(key, value) {
        localStorage.setItem(key, JSON.stringify(value));
    }

    // Initialize database
    const db = {
        social_media: getJSON("art_gallery_social_media", defaultSocialMedia),
        reach_us: getJSON("art_gallery_reach_us", defaultReachUs),
        pages: getJSON("art_gallery_pages", defaultPages),
        slider: getJSON("art_gallery_slider", defaultSlider),
        admins: getJSON("art_gallery_admins", defaultAdmins),
        users: getJSON("art_gallery_users", []),
        arts: getJSON("art_gallery_arts", defaultArts),
        cart: getJSON("art_gallery_cart", [
            { id: 1, title: "Taj Mahal", price: 250, img: "images/Taj Mahal.jpeg", quantity: 1 }
        ])
    };

    // Public DB API
    window.AG_DB = {
        getSocialMedia: () => getJSON("art_gallery_social_media", defaultSocialMedia),
        saveSocialMedia: (data) => setJSON("art_gallery_social_media", data),
        
        getReachUs: () => getJSON("art_gallery_reach_us", defaultReachUs),
        saveReachUs: (data) => setJSON("art_gallery_reach_us", data),
        
        getAboutUs: () => getJSON("art_gallery_pages", defaultPages).about_us,
        saveAboutUs: (text) => {
            const pages = getJSON("art_gallery_pages", defaultPages);
            pages.about_us = text;
            setJSON("art_gallery_pages", pages);
        },
        
        getSlider: () => getJSON("art_gallery_slider", defaultSlider),
        saveSlider: (slider) => setJSON("art_gallery_slider", slider),
        
        getArts: () => getJSON("art_gallery_arts", defaultArts),
        
        getUsers: () => getJSON("art_gallery_users", []),
        registerUser: (user) => {
            const users = getJSON("art_gallery_users", []);
            if (users.some(u => u.email === user.email)) {
                return { success: false, message: "Email already registered" };
            }
            users.push(user);
            setJSON("art_gallery_users", users);
            return { success: true };
        },
        loginUser: (email, password) => {
            const users = getJSON("art_gallery_users", []);
            const user = users.find(u => u.email === email && u.password === password);
            if (user) {
                sessionStorage.setItem("ag_user", JSON.stringify({ email: user.email, name: user.fname }));
                return { success: true, user };
            }
            return { success: false, message: "Invalid email or password" };
        },
        logoutUser: () => {
            sessionStorage.removeItem("ag_user");
        },
        getCurrentUser: () => {
            const user = sessionStorage.getItem("ag_user");
            return user ? JSON.parse(user) : null;
        },

        getAdmins: () => getJSON("art_gallery_admins", defaultAdmins),
        registerAdmin: (admin) => {
            const admins = getJSON("art_gallery_admins", defaultAdmins);
            if (admins.some(a => a.username === admin.username)) {
                return { success: false, message: "Username already registered" };
            }
            admin.id = admins.length + 1;
            admins.push(admin);
            setJSON("art_gallery_admins", admins);
            return { success: true };
        },
        loginAdmin: (username, password) => {
            const admins = getJSON("art_gallery_admins", defaultAdmins);
            const admin = admins.find(a => a.username === username && a.password === password);
            if (admin) {
                sessionStorage.setItem("ag_admin", JSON.stringify({ username: admin.username, name: admin.full_nm }));
                return { success: true, admin };
            }
            return { success: false, message: "Invalid username or password" };
        },
        logoutAdmin: () => {
            sessionStorage.removeItem("ag_admin");
        },
        getCurrentAdmin: () => {
            const admin = sessionStorage.getItem("ag_admin");
            return admin ? JSON.parse(admin) : null;
        },

        getCart: () => getJSON("art_gallery_cart", []),
        saveCart: (cart) => setJSON("art_gallery_cart", cart),
        addToCart: (item) => {
            const cart = getJSON("art_gallery_cart", []);
            const existing = cart.find(c => c.id === item.id);
            if (existing) {
                existing.quantity += 1;
            } else {
                cart.push({ ...item, quantity: 1 });
            }
            setJSON("art_gallery_cart", cart);
        },
        removeFromCart: (itemId) => {
            let cart = getJSON("art_gallery_cart", []);
            cart = cart.filter(c => c.id !== itemId);
            setJSON("art_gallery_cart", cart);
        },
        updateCartQuantity: (itemId, delta) => {
            const cart = getJSON("art_gallery_cart", []);
            const existing = cart.find(c => c.id === itemId);
            if (existing) {
                existing.quantity += delta;
                if (existing.quantity <= 0) {
                    return window.AG_DB.removeFromCart(itemId);
                }
            }
            setJSON("art_gallery_cart", cart);
        }
    };
})();
