document.addEventListener("DOMContentLoaded", () => {

    const body = document.querySelector('body');

    // On scroll check if scrollY is > 0 in order to add a background color to the header
    const header = document.querySelector('.header');
    window.addEventListener('scroll', () => {
        let scroll = window.pageYOffset;
        scroll > 0 ? header.classList.add('header__bg') : header.classList.remove('header__bg');
    });

    // Hamburger Menu toggle on mobile resolutions
    const hamburgerMenu = document.querySelector('.menu-toggle');
    const hamburgerAnchors = document.querySelectorAll('header a');

    hamburgerMenu &&
        hamburgerMenu.addEventListener('click', () => {
            header.classList.toggle('menu--open');
            body.classList.toggle('overflow-hidden');
        });

    // Close Mobile menu on anchor click
    const closeMenuOnClick = () => {
        window.innerWidth <= 768 &&
            hamburgerAnchors.forEach(anchor => {
                anchor.addEventListener('click', () => {
                    header.classList.remove('menu--open');
                    body.classList.remove('overflow-hidden');
                })
            })
    }

    // Call the close menu on click function at DOM loaded and on document resize
    closeMenuOnClick();
    document.addEventListener('resize', () => {
        closeMenuOnClick();
    })

    // Swiper JS Hero Slider Configuration
    const swiper = new Swiper('.swiper', {
        loop: true,
        pagination: {
            el: '.swiper-pagination',
        },
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
    });

    // Function to fetch JSON data and display it in the tab-data container
    const tabLinks = document.querySelectorAll(".tabs__link");
    const loaderContainer = document.querySelector(".loader");

    // Fetch data function based on the tab clicked by the user
    const fetchData = async (tabName) => {
        try {
            loaderContainer.style.display = "block"; // Show loader 
            const response = await fetch(`assets/ajax/${tabName}.json`);
            const data = await response.json();
            setTimeout(() => {
                document.getElementById("content").textContent = data.item.content.join(" ");
                loaderContainer.style.display = "none"; // Hide loader after 0.5 second
            }, 500);
        } catch (error) {
            console.error("There was a problem with the fetch operation:", error);
        }
    }

    // Function to open a tab and fetch its data
    const openTab = (evt, tabName) => {
        // Get all tab links and remove the "active" class
        tabLinks.forEach((link) => {
            link.classList.remove("active");
        });

        // Add the "active" class to the button that opened the tab
        evt.currentTarget.classList.add("active");

        // Fetch the JSON data for the selected tab and display it in the tab-data container
        fetchData(tabName);
    }

    // Get the tab buttons and attach the "openTab" function as a click event handler
    tabLinks.forEach((link) => {
        link.addEventListener("click", (event) => {
            openTab(event, link.getAttribute("data-tab"));
        });
    });

    fetchData("tab1"); // Default fetch: Tab 1
    tabLinks[0].classList.add("active"); // Default active class on tab 1

    const emailInput = document.getElementById('email');
    const emailAlert = document.querySelector("#emailAlert");
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const messageInput = document.getElementById('message');
    const messageAlert = document.querySelector("#messageAlert");
    const messageRegex = /^[a-zA-Z0-9\s.,!?]+$/;

    const submitButton = document.getElementById('submit');

    // Input validation function 
    const validateInput = (input, alert, regex, text) => {
        if (!regex.test(input.value)) {
            input.classList.add("error");
            alert.style.display = "block"; // Show error text
            alert.textContent = text;
            updateSubmitButton();
        } else {
            input.classList.remove("error");
            alert.textContent = "";
            alert.style.display = "none"; // Hide error text
            updateSubmitButton();
        }
    }

    // Update submit button based on form input
    const updateSubmitButton = () => {
        const emailError = emailAlert.textContent;
        const messageError = messageAlert.textContent;
        const emailValue = emailInput.value;
        const messageValue = messageInput.value;

        // If email or message are empty or with error
        emailError || messageError || !emailValue || !messageValue
            ? submitButton.setAttribute('disabled', '') // disable submit button
            : submitButton.removeAttribute('disabled'); // if not, enable submit button
    }

    // Call input validation function on blur
    emailInput.addEventListener('blur', () => {
        validateInput(emailInput, emailAlert, emailRegex, 'Invalid email');
    });

    // Call input validation function on blur
    messageInput.addEventListener('blur', () => {
        validateInput(messageInput, messageAlert, messageRegex, 'Invalid message');
    });

    // Display cookie banner based on local storage boolean value
    const closeCookieBtn = document.getElementById('closeCookieConsent');
    const cookieContainer = document.querySelector('.cookie__overlay');
    // Get local storage value
    const hasCookieConsent = localStorage.getItem('cookieConsent');
    // If false display the cookie banner
    if (!hasCookieConsent) {
        cookieContainer.style.display = 'block'
        body.classList.add('overflow-hidden');
    }

    // Close cookie banner on click
    cookieContainer &&
        closeCookieBtn.addEventListener('click', () => {
            cookieContainer.style.display = 'none';
            // Set "true" the local storage value
            localStorage.setItem('cookieConsent', 'true');
            body.classList.remove('overflow-hidden');
        });
});