function addRezultat() {
    let rezultat = prompt("Unesite rezultat utakmice (u obliku X-X):", "")
    if (rezultat.split("-").length !== 2) {
        alert("Pogrešan unos rezultata!")
    } else {
        console.log(document.getElementById("id_utakmice").value)
        const helper = rezultat.split("-");
        if (Number.isInteger(parseInt(helper[0])) && Number.isInteger(parseInt(helper[1]))) {
            axios.post(window.location.protocol + "/utakmica/edit", {
                id_utakmice: parseInt(document.getElementById("id_utakmice").value),
                gol1: parseInt(helper[0]),
                gol2: parseInt(helper[1])
            })
            .then((response) => window.location.reload())
            .catch((err) => window.location.href = "/login")
        } else {
            alert("Rezultat mora biti broj!")
        }
    }
}

function newKomentar() {
    let tekst = prompt("Dodajte komentar na utakmicu:", "")
    if (tekst === null || tekst === "") {
        alert("Komentar mora biti dug barem jedan znak!")
    } else {
        axios.post(window.location.protocol + "/komentar/add", {
            id_utakmice: parseInt(document.getElementById("id_utakmice").value),
            tekst: tekst,
            email: document.getElementById("user_email").value
        })
        .then((response) => window.location.reload())
        .catch((err) => window.location.href = "/login");
    }
}

function editKomentar(id_komentara, stari_tekst) {
    console.log(stari_tekst)
    let tekst = prompt("Dodajte novi tekst za komentar:", stari_tekst)
    if (tekst === null || tekst === "") {
        alert("Komentar mora biti dug barem jedan znak!")
    } else {
        axios.post(window.location.protocol + "/komentar/edit", {
            id_komentara: parseInt(id_komentara),
            tekst: tekst,
            email: document.getElementById("user_email").value
        })
        .then((response) => window.location.reload())
        .catch((err) => alert("Ne možete mijenjati ovaj komentar!"));
    }
}

function removeKomentar(id_komentara, email) {
    if (window.confirm("Jeste li sigurni da želite izbrisati komentar?")) {
        axios.post(window.location.protocol + "/komentar/delete/" + parseInt(id_komentara),{
            email: email
        })
        .then((response) => window.location.reload())
        .catch((err) => alert("Ne možete brisati ovaj komentar!"));
    }
}