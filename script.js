const odpovedi = [
  "u tvojí mámy v posteli",
  "čistí si zuby",
  "dává spink",
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
  "na záchodě",
  "otevírá tajemnou komnatu",
  "papá vajíčka",
  "kupuje crypto",
  "v baru",
  "na kalbě",
  "v clubu",
  "v kasínu",
  "rozhodně ne na místě srazu",
  "všude ale nikde",
  "dělá si kafe",
  "dolejvá pití",
  "chlastá",
  "zrovna vstal",
  "krade telefon",
  "ve vlaku",
  "na koloběžce",
  "u Patrika v pokoji",
  "nakupuje v rimi",
  "šel pryč",
  "ztratil se",
  "na Eiffelovce",
  "ztratil se v horách",
  "kupuje bagetu",
  "kupuje crypto",
  "v 420",
  "Zvedá Matava5Gaming",
  "Kodí školní web",
];

Odpoved();

function Odpoved() {
  let index = getRandomNumber(0, odpovedi.length);
  document.getElementById("odpoved").innerHTML = odpovedi[index];
}

function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

const timer = setInterval(() => {
  Odpoved();
}, 10000);

let data;

async function doudaInfo() {
  const response = await fetch("https://douda-api.bagros.eu/");
  data = await response.json();

  const div = document.createElement("div");
  const dayOfWeek = new Date().getDay() - 1;
  let hours = "";
  console.log(data[0].pos[dayOfWeek][1].subject);
  for (i = 1; i < 8; i++) {
    let subject = data[0].pos[dayOfWeek][i].subject
    let room = data[0].pos[dayOfWeek][i].room
    if(room.includes("Neučí")){room = ""}
    if(subject.includes("Programování a vývoj aplikací")){subject = "PVA"}
    
    hours += `<td>${subject}<br>${room}</td>`;
    console.log(div.innerHTML);
  }
  // fstring
  
  div.innerHTML = `<table><thead><tr><th></th><th>1<br>8:00-8:45</th><th>2<br>8:55-9:40</th><th>3<br>9:50-10:35</th><th>4<br>10:50-11:35</th><th>5<br>11:45-12:30</th><th>6<br>12:40-13:25</th><th>7<br>13:35-14:20</th></tr></thead><tbody><tr>${hours}</tr></tbody></table>`;
  console.log(div.innerHTML)
  document.body.appendChild(div);
}

doudaInfo();