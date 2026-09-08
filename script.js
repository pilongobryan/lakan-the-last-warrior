/* =========================================================
   LAKAN: THE LAST WARRIOR
   Website JavaScript
========================================================= */


/* =========================================================
   WAIT FOR PAGE TO LOAD
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {


        /* =================================================
           MOBILE MENU
        ================================================== */

        const menuButton =
            document.getElementById("menuButton");

        const mobileMenu =
            document.getElementById("mobileMenu");


        if (
            menuButton &&
            mobileMenu
        ) {

            menuButton.addEventListener(
                "click",
                function () {

                    const isOpen =
                        menuButton.getAttribute(
                            "aria-expanded"
                        ) === "true";


                    menuButton.setAttribute(
                        "aria-expanded",
                        String(!isOpen)
                    );


                    menuButton.setAttribute(
                        "aria-label",
                        isOpen
                            ? "Open menu"
                            : "Close menu"
                    );


                    mobileMenu.classList.toggle(
                        "is-open",
                        !isOpen
                    );

                }
            );


            /*
             * Close mobile menu
             * after clicking a navigation link.
             */

            const mobileLinks =
                mobileMenu.querySelectorAll("a");


            mobileLinks.forEach(
                function (link) {

                    link.addEventListener(
                        "click",
                        function () {

                            mobileMenu.classList.remove(
                                "is-open"
                            );


                            menuButton.setAttribute(
                                "aria-expanded",
                                "false"
                            );


                            menuButton.setAttribute(
                                "aria-label",
                                "Open menu"
                            );

                        }
                    );

                }
            );


            /*
             * Close the menu when the user
             * clicks outside it.
             */

            document.addEventListener(
                "click",
                function (event) {

                    const clickedInsideMenu =
                        mobileMenu.contains(event.target);

                    const clickedButton =
                        menuButton.contains(event.target);


                    if (
                        !clickedInsideMenu &&
                        !clickedButton &&
                        mobileMenu.classList.contains("is-open")
                    ) {

                        mobileMenu.classList.remove(
                            "is-open"
                        );


                        menuButton.setAttribute(
                            "aria-expanded",
                            "false"
                        );


                        menuButton.setAttribute(
                            "aria-label",
                            "Open menu"
                        );

                    }

                }
            );

        }



        /* =================================================
           HERO CHARACTER SWITCHER
        ================================================== */


        const heroCharacter =
            document.getElementById(
                "heroCharacter"
            );


        const characterSwitch =
            document.getElementById(
                "characterSwitch"
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


        const switchText =
            document.getElementById(
                "switchText"
            );


        /*
         * Keep track of which character
         * is currently displayed.
         */

        let showingLakan = true;



        if (
            heroCharacter &&
            characterSwitch
        ) {


            characterSwitch.addEventListener(
                "click",
                function () {


                    /*
                     * Fade the current
                     * character out.
                     */

                    heroCharacter.classList.remove(
                        "active"
                    );


                    /*
                     * Wait slightly for
                     * the fade transition.
                     */

                    window.setTimeout(
                        function () {


                            /* =========================
                               SHOW SIDAPA
                            ========================== */

                            if (showingLakan) {


                                heroCharacter.src =
                                    "assets/sidapa.png";


                                heroCharacter.alt =
                                    "Sidapa, God of Death and Ruler of Fate";


                                characterRole.textContent =
                                    "ANTAGONIST";


                                characterName.textContent =
                                    "SIDAPA";


                                characterDescription.textContent =
                                    "The God of Death and Ruler of Fate who seeks to eliminate the Alab ng Diwa.";


                                switchText.textContent =
                                    "Meet Lakan";


                                characterSwitch.setAttribute(
                                    "aria-label",
                                    "Switch to Lakan"
                                );


                                showingLakan =
                                    false;


                            }


                            /* =========================
                               SHOW LAKAN
                            ========================== */

                            else {


                                heroCharacter.src =
                                    "assets/lakan.png";


                                heroCharacter.alt =
                                    "Lakan, the Sacred Guardian";


                                characterRole.textContent =
                                    "PROTAGONIST";


                                characterName.textContent =
                                    "LAKAN";


                                characterDescription.textContent =
                                    "The player-controlled Sacred Guardian who must recover his lost memories and confront Sidapa.";


                                switchText.textContent =
                                    "Meet Sidapa";


                                characterSwitch.setAttribute(
                                    "aria-label",
                                    "Switch to Sidapa"
                                );


                                showingLakan =
                                    true;

                            }


                            /*
                             * Trigger the CSS
                             * fade-in animation.
                             */

                            requestAnimationFrame(
                                function () {

                                    heroCharacter.classList.add(
                                        "active"
                                    );

                                }
                            );

                        },
                        200
                    );

                }
            );

        }

    }
);