function myFunction() {
    let r = confirm("Attention! Es tu sur de vouloir supprimer ton compte? (toutes tes données seront supprimées)");

    if (r == true) {
        document.getElementById("accountForm").action = "/delete-account";
        document.getElementById("accountForm").submit();
    }
}