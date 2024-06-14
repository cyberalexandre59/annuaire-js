$(document).ready(function() {
    let editIndex = null;
    let contacts = [];

    // Charge les contacts depuis le local storage
    function chargerContacts() {
        contacts = JSON.parse(localStorage.getItem('contacts')) || [];
        contacts.sort((a, b) => a.nom.localeCompare(b.nom)); // Trie les contacts par nom
        contacts.forEach((contact, index) => {
            ajouterContactHTML(contact, index);
        });
        desactiverBoutonsAlphabet(); // Désactive les boutons après avoir chargé les contacts
    }

    // Affiche les informations d'un utilisateur
    function afficherinfo() {
        $(this).siblings('.affichage').toggle();
    }

    // Affiche le formulaire pour ajouter un nouveau contact
    function afficherform() {
        $('#ajout-contact').toggle();
        // Réinitialiser le formulaire
        $('#civil').val('monsieur');
        $('#prenom').val('');
        $('#nom').val('');
        $('#num').val('');
        editIndex = null;
    }

    // Ajoute ou modifie un contact
    function ajouterContact() {
        let civil = $('#civil').val();
        let prenom = $('#prenom').val();
        let nom = $('#nom').val();
        let num = $('#num').val();

        if (prenom && nom && num) {
            let contact = {
                civil: civil,
                prenom: prenom,
                nom: nom,
                num: num
            };

            if (editIndex !== null) {
                // Modifie le contact existant
                contacts[editIndex] = contact;
                localStorage.setItem('contacts', JSON.stringify(contacts));
                $('#liste-utilisateur').empty();
                chargerContacts();
                editIndex = null;
            } else {
                // Ajoute un nouveau contact
                contacts.push(contact);
                localStorage.setItem('contacts', JSON.stringify(contacts));
                $('#liste-utilisateur').empty();
                chargerContacts(); // Recharger les contacts triés après ajout
            }

            // Réinitialise le formulaire
            $('#civil').val('monsieur');
            $('#prenom').val('');
            $('#nom').val('');
            $('#num').val('');
            $('#ajout-contact').hide();
        } else {
            alert('Veuillez remplir tous les champs.');
        }
    }

    function ajouterContactHTML(contact, index) {
        let utilisateur = `<li>
        <p class="nom-utilisateur">${contact.nom} ${contact.prenom}</p>
        <div class="affichage" style="display: none;">
            <p class="nom-complet">${contact.civil} ${contact.prenom} ${contact.nom}</p>
            <p class="tel-utilisateur">${contact.num}</p>
            <p class="modification bouton-action" data-index="${index}"><i class="fas fa-pen"></i> Editer ce contact</p>
            <p class="suppression bouton-action" data-index="${index}"><i class="fas fa-trash"></i> Supprimer ce contact</p>
        </div>
        </li>`;

        $('#liste-utilisateur').append(utilisateur);
    }

    // Affiche le formulaire de modification prérempli
    function modifierContact() {
        editIndex = $(this).data('index');
        let contact = contacts[editIndex];

        $('#civil').val(contact.civil);
        $('#prenom').val(contact.prenom);
        $('#nom').val(contact.nom);
        $('#num').val(contact.num);
        $('#ajout-contact').show();
    }

    // Supprime un contact spécifique
    function supprimerContact() {
        let index = $(this).data('index');
        let contactElement = $(this).closest('li');

        // Animation de fondu sortant
        contactElement.addClass('fade-out').fadeOut('slow', function() {
            // Supprimer l'élément une fois l'animation terminée
            contacts.splice(index, 1);
            localStorage.setItem('contacts', JSON.stringify(contacts));
            $(this).remove(); // Supprimer l'élément de la liste
            chargerContacts(); // Recharger les contacts après suppression
        });
    }

    // Supprime tous les contacts
    function supprimerTousLesContacts() {
        localStorage.removeItem('contacts');
        $('#liste-utilisateur').empty();
        contacts = [];
        desactiverBoutonsAlphabet(); // Désactive les boutons après avoir supprimé tous les contacts
    }

    // Filtre les contacts par la première lettre du nom
    function filterContacts(letter) {
        $('.nom-utilisateur').each(function() {
            let nom = $(this).text();
            if (nom.charAt(0).toUpperCase() === letter) {
                $(this).parent().show();
            } else {
                $(this).parent().hide();
            }
        });
    }

    // Affiche tous les contacts
    function afficherTousLesContacts() {
        $('.nom-utilisateur').parent().show();
    }

    // Filtre les contacts en fonction de la barre de recherche
    function rechercherContacts() {
        let query = $('#recherche-contact').val().toLowerCase();
        $('.nom-utilisateur').each(function() {
            let nom = $(this).text().toLowerCase();
            let contactElement = $(this).parent(); // Sélectionne l'élément parent pour l'animation

            if (nom.includes(query)) {
                // Affiche le contact avec une animation de fondu entrant
                contactElement.addClass('fade-in-out').fadeIn('slow');
            } else {
                // Masque le contact avec une animation de fondu sortant
                contactElement.addClass('fade-in-out').fadeOut('slow');
            }
        });
    }

    // Attache un événement aux boutons de l'alphabet
    $('.alpha-btn').on('click', function() {
        let letter = $(this).text().toUpperCase();
        filterContacts(letter);
    });

    // Attache l'événement au bouton "Afficher tous les contacts"
    $('#afficher-tous').on('click', afficherTousLesContacts);

    // Attache l'événement à la barre de recherche
    $('#recherche-contact').on('input', rechercherContacts);

    // Désactive les boutons de l'alphabet sans contacts correspondants
    function desactiverBoutonsAlphabet() {
        let alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        for (let i = 0; i < alphabet.length; i++) {
            let letter = alphabet[i];
            let hasContacts = contacts.some(contact => contact.nom.charAt(0).toUpperCase() === letter);
            let button = $('.alpha-btn').eq(i);
            if (!hasContacts) {
                button.prop('disabled', true);
            } else {
                button.prop('disabled', false);
            }
        }
    }

    // Charge les contacts au démarrage
    chargerContacts();

    // Ouvre la pop-up lorsque le bouton paramètres est cliqué
    $('#settings').click(function() {
        $('#popup-wrapper').fadeIn().css('display', 'flex'); // Affiche la pop-up avec effet de fondu et flexbox
    });

    // Ferme la pop-up lorsque le bouton de fermeture est cliqué
    $('#close-popup').click(function() {
        $('#popup-wrapper').fadeOut(); // Masquer la pop-up avec effet de fondu
    });

    // Ajoute ou modifie un contact lorsque le bouton Ajouter est cliqué
    $('#ajout-utilisateur1').on('click', afficherform);
    $('#ajout-utilisateur2').on('click', ajouterContact);

    // Supprime tous les contacts lorsque le bouton Supprimer est cliqué
    $('#supprimer-tous').on('click', supprimerTousLesContacts);

    // Modifie un contact lorsque le bouton de modification est cliqué
    $(document).on('click', '.modification', modifierContact);

    // Supprime un contact lorsque le bouton de suppression est cliqué
    $(document).on('click', '.suppression', supprimerContact);

    // Affiche les informations d'un utilisateur lorsque son nom est cliqué
    $(document).on('click', '.nom-utilisateur', afficherinfo);

    // Dark mode toggle
    function toggleDarkMode() {
        if ($('#toggle-dark-mode').is(':checked')) {
            $('body').addClass('dark-mode');
            localStorage.setItem('dark-mode', 'enabled');
        } else {
            $('body').removeClass('dark-mode');
            localStorage.setItem('dark-mode', 'disabled');
        }
    }

    // Initialise le mode sombre en fonction de la préférence de l'utilisateur
    if (localStorage.getItem('dark-mode') === 'enabled') {
        $('#toggle-dark-mode').prop('checked', true);
        $('body').addClass('dark-mode');
    }

    // Attache l'événement à la case à cocher du mode sombre
    $('#toggle-dark-mode').change(toggleDarkMode);
});

let animationEnabled = true; // Variable globale pour suivre l'état de l'animation

// Crée une fonction pour activer ou désactiver l'animation des boutons
function toggleAnimation() {
    animationEnabled = $('#toggle-animation').is(':checked');
    if (!animationEnabled) {
        // Si l'animation est désactivée, supprimez la classe d'animation des boutons
        $("#ajout-utilisateur1, #supprimer-tous, #settings, #ajout-utilisateur2").removeClass("animate__animated animate__bounce");
    }
}

$(document).ready(function() {
    // Attache un événement à la case à cocher pour appeler la fonction toggleAnimation
    $('#toggle-animation').change(toggleAnimation);

    // Ajoute l'animation "bounce" lors du survol des boutons d'ajout et de suppression
    $("#ajout-utilisateur1, #supprimer-tous, #settings, #ajout-utilisateur2").hover(
        function() {
            if (animationEnabled) {
                $(this).addClass("animate__animated animate__bounce");
            }
        },
        function() {
            if (animationEnabled) {
                $(this).removeClass("animate__animated animate__bounce");
            }
        }
    );
});
