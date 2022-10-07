const odpovedi = [ 
    "u tvojí mámy",
    "čistí si zuby",
    "dává spink",
    "v posteli",
    "na telefonu",
    "v hospodě",
    "v čajovně",
    "ve škole",
    "v data centu",
    "spravuje školní pc",
    "dává dýmku",
    "v LIDU",
    "balí si batoh",
    "v letadle",
    "sprchuje se",
    "ve vaně",
    "snídá",
    "dělá vajíčka",
    "večeří",
    "píčuje do vaření",
    "spravuje kávovar",
    "otevírá víno",
    "pije",
    "odchoduje na burze",
    "nabaluje random čubiny",
    "vychází z poza rohu",
    "sexuje",
    "je na záchodě",
    "otevírá tajemnou komnatu",
    "papá vajíčka",
    "kupuje crypto",
    "v baru",
    "na kalbě",
    "v clubu",
    "v kasínu",
    "rozhodně ne na místě srazu",
]

Odpoved();

function Odpoved(){
    let index = getRandomNumber(0, odpovedi.length);
    document.getElementById("odpoved").innerHTML = odpovedi[index];
}

function getRandomNumber(min,max) {
    return Math.floor(Math.random() * (max - min) ) + min;
}
