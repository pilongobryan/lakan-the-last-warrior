/* =========================================================
   LAKAN: THE LAST WARRIOR
   JAVASCRIPT
========================================================= */


/* =========================================================
   MOBILE NAVIGATION
========================================================= */

const menuToggle =
    document.getElementById("menuToggle");

const mobileNav =
    document.getElementById("mobileNav");


if (
    menuToggle &&
    mobileNav
) {

    menuToggle.addEventListener(
        "click",
        () => {

            const isOpen =
                mobileNav.classList.toggle(
                    "open"
                );


            menuToggle.classList.toggle(
                "active",
                isOpen
            );


            menuToggle.setAttribute(
                "aria-expanded",
                String(isOpen)
            );


            document.body.classList.toggle(
                "no-scroll",
                isOpen
            );

        }
    );


    /* Close mobile navigation after clicking a link */

    const mobileLinks =
        mobileNav.querySelectorAll("a");


    mobileLinks.forEach(
        (link) => {

            link.addEventListener(
                "click",
                () => {

                    mobileNav.classList.remove(
                        "open"
                    );


                    menuToggle.classList.remove(
                        "active"
                    );


                    menuToggle.setAttribute(
                        "aria-expanded",
                        "false"
                    );


                    document.body.classList.remove(
                        "no-scroll"
                    );

                }
            );

        }
    );

}


/* =========================================================
   HERO CHARACTER SWITCHER
========================================================= */

const heroCharacter =
    document.getElementById(
        "heroCharacter"
    );

const characterRole =
    document.getElementById(
        "characterRole"
    );

const characterName =
    document.getElementById(
        "characterName"
    );

const characterDescription =
    document.getElementById(
        "characterDescription"
    );

const characterSwitch =
    document.getElementById(
        "characterSwitch"
    );

const switchText =
    document.getElementById(
        "switchText"
    );


let showingLakan =
    true;


const characters = {

    lakan: {

        image:
            "assets/lakan.png",

        role:
            "SACRED GUARDIAN",

        name:
            "LAKAN",

        description:
            "A warrior whose journey begins with a search for identity, purpose, and balance.",

        button:
            "Meet Sidapa"

    },


    sidapa: {

        image:
            "assets/JIMMY.png",

        role:
            "GOD OF DEATH",

        name:
            "SIDAPA",

        description:
            "The God of Death and Ruler of Fate whose presence forms a central force in Lakan's journey.",

        button:
            "Meet Lakan"

    }

};


/* =========================================================
   CHANGE HERO CHARACTER
========================================================= */

function switchCharacter() {

    if (
        !heroCharacter ||
        !characterRole ||
        !characterName ||
        !characterDescription ||
        !switchText
    ) {

        return;

    }


    const nextCharacter =
        showingLakan
            ? characters.sidapa
            : characters.lakan;


    heroCharacter.classList.add(
        "switching"
    );


    setTimeout(
        () => {

            heroCharacter.src =
                nextCharacter.image;


            heroCharacter.alt =
                nextCharacter.name;


            characterRole.textContent =
                nextCharacter.role;


            characterName.textContent =
                nextCharacter.name;


            characterDescription.textContent =
                nextCharacter.description;


            switchText.textContent =
                nextCharacter.button;


            heroCharacter.classList.remove(
                "switching"
            );

        },
        220
    );


    showingLakan =
        !showingLakan;

}


if (characterSwitch) {

    characterSwitch.addEventListener(
        "click",
        switchCharacter
    );

}


/* =========================================================
   CLOSE MOBILE MENU WHEN CLICKING OUTSIDE
========================================================= */

document.addEventListener(
    "click",
    (event) => {

        if (
            !mobileNav ||
            !menuToggle
        ) {

            return;

        }


        const clickedInsideMenu =
            mobileNav.contains(
                event.target
            );


        const clickedButton =
            menuToggle.contains(
                event.target
            );


        if (
            mobileNav.classList.contains(
                "open"
            ) &&
            !clickedInsideMenu &&
            !clickedButton
        ) {

            mobileNav.classList.remove(
                "open"
            );


            menuToggle.classList.remove(
                "active"
            );


            menuToggle.setAttribute(
                "aria-expanded",
                "false"
            );


            document.body.classList.remove(
                "no-scroll"
            );

        }

    }
);


/* =========================================================
   ESCAPE KEY FOR MOBILE MENU
========================================================= */

document.addEventListener(
    "keydown",
    (event) => {

        if (
            event.key === "Escape" &&
            mobileNav &&
            mobileNav.classList.contains(
                "open"
            )
        ) {

            mobileNav.classList.remove(
                "open"
            );


            if (menuToggle) {

                menuToggle.classList.remove(
                    "active"
                );


                menuToggle.setAttribute(
                    "aria-expanded",
                    "false"
                );

            }


            document.body.classList.remove(
                "no-scroll"
            );

        }

    }
);


/* =========================================================
   DEVELOPER CARD LIGHTBOX
========================================================= */

const developerCards =
    document.querySelectorAll(
        ".developer-card"
    );


const photoLightbox =
    document.getElementById(
        "photoLightbox"
    );


const lightboxImage =
    document.getElementById(
        "lightboxImage"
    );


const lightboxName =
    document.getElementById(
        "lightboxName"
    );


const lightboxClose =
    document.getElementById(
        "lightboxClose"
    );


/* =========================================================
   OPEN DEVELOPER PHOTO
========================================================= */

function openDeveloperPhoto(
    card
) {

    if (
        !photoLightbox ||
        !lightboxImage ||
        !lightboxName
    ) {

        return;

    }


    const image =
        card.dataset.image;


    const name =
        card.dataset.name;


    if (!image) {

        return;

    }


    lightboxImage.src =
        image;


    lightboxImage.alt =
        name || "Developer photo";


    lightboxName.textContent =
        name || "";


    photoLightbox.classList.add(
        "open"
    );


    photoLightbox.setAttribute(
        "aria-hidden",
        "false"
    );


    document.body.classList.add(
        "no-scroll"
    );

}


/* =========================================================
   CLOSE DEVELOPER PHOTO
========================================================= */

function closeDeveloperPhoto() {

    if (!photoLightbox) {

        return;

    }


    photoLightbox.classList.remove(
        "open"
    );


    photoLightbox.setAttribute(
        "aria-hidden",
        "true"
    );


    document.body.classList.remove(
        "no-scroll"
    );


    /*
     * Clear the image after the
     * closing transition.
     */

    setTimeout(
        () => {

            if (lightboxImage) {

                lightboxImage.src =
                    "";

                lightboxImage.alt =
                    "";

            }


            if (lightboxName) {

                lightboxName.textContent =
                    "";

            }

        },
        250
    );

}


/* =========================================================
   CLICK ANYWHERE ON DEVELOPER CARD
========================================================= */

developerCards.forEach(
    (card) => {

        card.addEventListener(
            "click",
            () => {

                openDeveloperPhoto(
                    card
                );

            }
        );

    }
);


/* =========================================================
   CLOSE USING X BUTTON
========================================================= */

if (lightboxClose) {

    lightboxClose.addEventListener(
        "click",
        (event) => {

            event.stopPropagation();

            closeDeveloperPhoto();

        }
    );

}


/* =========================================================
   CLOSE BY CLICKING BACKDROP
========================================================= */

if (photoLightbox) {

    photoLightbox.addEventListener(
        "click",
        (event) => {

            /*
             * Only close when clicking the
             * dark area outside the image.
             */

            if (
                event.target ===
                photoLightbox
            ) {

                closeDeveloperPhoto();

            }

        }
    );

}


/* =========================================================
   CLOSE WITH ESCAPE KEY
========================================================= */

document.addEventListener(
    "keydown",
    (event) => {

        if (
            event.key === "Escape" &&
            photoLightbox &&
            photoLightbox.classList.contains(
                "open"
            )
        ) {

            closeDeveloperPhoto();

        }

    }
);